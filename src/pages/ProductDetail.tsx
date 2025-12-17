import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Share2, Truck, RefreshCcw, Shield, ZoomIn, Minus, Plus, ChevronRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/hooks/useWishlist";
import { ProductReviews } from "@/components/ProductReviews";
import { ProductQA } from "@/components/ProductQA";
import { RelatedProducts } from "@/components/RelatedProducts";
import { StickyAddToCart } from "@/components/StickyAddToCart";
import { PincodeChecker } from "@/components/PincodeChecker";
import { SizeGuideModal } from "@/components/SizeGuideModal";
import { ProductOffers } from "@/components/ProductOffers";
import { RatingSummary } from "@/components/RatingSummary";
import { ProductDetailSkeleton } from "@/components/ProductDetailSkeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

interface Variant {
  id: string;
  option1_name: string | null;
  option1_value: string | null;
  option2_name: string | null;
  option2_value: string | null;
  image_url: string | null;
  price_cents: number | null;
  inventory_count: number;
  is_available: boolean | null;
}

interface Product {
  id: string;
  title: string;
  description: string | null;
  price_cents: number;
  images: string[];
  slug: string;
  variants?: Variant[];
}
const ProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [manualImageSelect, setManualImageSelect] = useState(false);

  // Fetch product and variants
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('slug', id)
          .single();

        if (productError) throw productError;

        const { data: variantsData, error: variantsError } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', productData.id);

        if (variantsError) throw variantsError;

        setProduct({
          ...productData,
          images: Array.isArray(productData.images) 
            ? productData.images.filter((img): img is string => typeof img === 'string')
            : [],
          variants: variantsData || []
        });
        setVariants(variantsData || []);

        // Auto-select first color if available
        const colorVariants = variantsData?.filter(v => v.option1_name?.toLowerCase() === 'color') || [];
        if (colorVariants.length > 0 && colorVariants[0].option1_value) {
          setSelectedColor(colorVariants[0].option1_value);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error loading product",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, toast]);

  // Get unique colors with images
  const colorVariants = variants
    .filter(v => v.option1_name?.toLowerCase() === 'color' && v.option1_value)
    .reduce((acc, curr) => {
      const colorValue = curr.option1_value!;
      if (!acc.find(v => v.option1_value === colorValue)) {
        acc.push(curr);
      }
      return acc;
    }, [] as Variant[]);

  // Get sizes for selected color
  const availableSizes = variants
    .filter(v => {
      // If no color selected or no colors exist, show all sizes
      if (!selectedColor || colorVariants.length === 0) return true;
      
      // Filter by selected color
      return v.option1_value?.toLowerCase() === selectedColor.toLowerCase() ||
             v.option2_value?.toLowerCase() === selectedColor.toLowerCase();
    })
    .map(v => {
      // Find the size value
      if (v.option1_name?.toLowerCase() === 'size') return v.option1_value;
      if (v.option2_name?.toLowerCase() === 'size') return v.option2_value;
      return null;
    })
    .filter((v, i, arr) => v && arr.indexOf(v) === i) as string[];

  // Update main image when color changes (but not when user manually selects)
  useEffect(() => {
    if (selectedColor && !manualImageSelect) {
      const colorVariant = colorVariants.find(v => v.option1_value?.toLowerCase() === selectedColor.toLowerCase());
      if (colorVariant?.image_url) {
        const images = product?.images || [];
        const colorImageIndex = images.indexOf(colorVariant.image_url);
        if (colorImageIndex !== -1) {
          setSelectedImage(colorImageIndex);
        } else if (colorVariant.image_url) {
          setSelectedImage(0);
        }
      }
    }
    // Reset manual select flag after color change is processed
    if (manualImageSelect) {
      setManualImageSelect(false);
    }
  }, [selectedColor]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <ProductDetailSkeleton />
        <Footer />
      </div>
    );
  }
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container px-4 py-16 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Product Not Found</h1>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const displayPrice = product.price_cents / 100;
  const productImages = product.images.length > 0 ? product.images : [product1];
  
  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to cart",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (availableSizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        description: "Choose a size before adding to cart",
        variant: "destructive"
      });
      return;
    }
    if (colorVariants.length > 0 && !selectedColor) {
      toast({
        title: "Please select a color",
        description: "Choose a color before adding to cart",
        variant: "destructive"
      });
      return;
    }

    setAddingToCart(true);
    try {
      // Get the selected variant's image if available
      const selectedVariant = variants.find(v => 
        v.option1_value === selectedColor && v.option2_value === selectedSize
      );
      const variantImage = selectedVariant?.image_url || productImages[0];
      const variantPrice = selectedVariant?.price_cents || product.price_cents;

      const newItem = {
        id: `${product.id}-${selectedColor}-${selectedSize}-${Date.now()}`,
        productId: product.id,
        name: product.title,
        price: variantPrice / 100,
        image: variantImage,
        quantity: quantity,
        size: selectedSize,
        color: selectedColor
      };

      // Fetch existing cart
      const { data: existingCart } = await supabase
        .from('carts')
        .select('items')
        .eq('user_id', user.id)
        .maybeSingle();

      let updatedItems;
      if (existingCart?.items && Array.isArray(existingCart.items)) {
        // Check if same product with same size/color already exists
        const existingIndex = (existingCart.items as any[]).findIndex(
          (item: any) => item.productId === product.id && item.size === selectedSize && item.color === selectedColor
        );
        
        if (existingIndex > -1) {
          // Update quantity
          updatedItems = [...(existingCart.items as any[])];
          updatedItems[existingIndex].quantity += quantity;
        } else {
          // Add new item
          updatedItems = [...(existingCart.items as any[]), newItem];
        }
      } else {
        updatedItems = [newItem];
      }

      // Save cart
      if (existingCart) {
        await supabase
          .from('carts')
          .update({ items: JSON.parse(JSON.stringify(updatedItems)), updated_at: new Date().toISOString() })
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('carts')
          .insert({ user_id: user.id, items: JSON.parse(JSON.stringify(updatedItems)) });
      }

      toast({
        title: "Added to cart!",
        description: `${product.title} ${selectedColor ? `(${selectedColor})` : ''} ${selectedSize ? `(${selectedSize})` : ''} x ${quantity}`
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    } finally {
      setAddingToCart(false);
    }
  };
  
  const handleAddToWishlist = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to wishlist",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    await toggleWishlist(product.id, product.title);
  };

  const inWishlist = product ? isInWishlist(product.id) : false;

  return <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{product.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div id="product-image-gallery">
            <div className="mb-4 rounded-lg overflow-hidden bg-muted relative group cursor-zoom-in" onClick={() => setIsZoomed(!isZoomed)}>
              <img 
                src={productImages[selectedImage]} 
                alt={product.title} 
                className={`w-full aspect-[3/4] object-cover transition-transform duration-300 ${isZoomed ? "scale-150" : "group-hover:scale-105"}`} 
              />
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full p-2">
                <ZoomIn className="h-5 w-5 text-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {productImages.map((image, index) => (
                <button 
                  key={index} 
                  onClick={() => {
                    setManualImageSelect(true);
                    setSelectedImage(index);
                    setIsZoomed(false);
                  }}
                  className={`rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? "border-accent" : "border-border"}`}
                >
                  <img src={image} alt={`${product.title} ${index + 1}`} className="w-full aspect-[3/4] object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">{product.title}</h1>
            
            <div id="product-price" className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold">₹{displayPrice.toLocaleString()}</span>
            </div>

            {product.description && (
              <p className="text-muted-foreground mb-6">{product.description}</p>
            )}

            {/* Color Selection */}
            {colorVariants.length > 0 && (
              <div className="mb-6">
                <label className="font-semibold block mb-3">Select Color</label>
                <div className="flex flex-wrap gap-3">
                  {colorVariants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedColor(variant.option1_value || "")}
                      className={`relative rounded-lg border-2 overflow-hidden transition-all ${
                        selectedColor === variant.option1_value 
                          ? "border-accent ring-2 ring-accent ring-offset-2" 
                          : "border-border hover:border-accent"
                      }`}
                    >
                      <img 
                        src={variant.image_url || productImages[0]} 
                        alt={variant.option1_value || "Color variant"}
                        className="w-16 h-16 object-cover"
                      />
                      {selectedColor === variant.option1_value && (
                        <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
                            ✓
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: <span className="font-medium capitalize">{selectedColor}</span>
                  </p>
                )}
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="mb-8 p-6 bg-muted/30 rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold">Select Size</label>
                  <Link to="/size-guide" className="text-sm text-accent hover:underline font-medium flex items-center gap-1">
                    <span>Size Guide</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-3">
                  {availableSizes.map(size => (
                    <button 
                      key={size} 
                      onClick={() => setSelectedSize(size)} 
                      className={`min-w-[70px] h-12 px-5 rounded-lg border-2 font-semibold text-base transition-all hover:scale-105 ${
                        selectedSize === size 
                          ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105" 
                          : "border-border bg-background hover:border-primary hover:bg-primary/5"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {selectedSize && (
                  <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Size selected: <span className="font-bold text-foreground">{selectedSize}</span></span>
                  </p>
                )}

                {!selectedSize && (
                  <p className="text-sm text-muted-foreground/70 mt-3">
                    Please select your size to continue
                  </p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="font-semibold block mb-3">Quantity</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border-2 border-border hover:border-accent flex items-center justify-center font-bold">
                  -
                </button>
                <span className="w-16 text-center font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg border-2 border-border hover:border-accent flex items-center justify-center font-bold">
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div id="product-actions" className="flex gap-3 mb-6">
              <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={addingToCart}>
                {addingToCart ? "Adding..." : "Add to Cart"}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleAddToWishlist}
                disabled={wishlistLoading}
                className={inWishlist ? "bg-red-500 text-white border-red-500 hover:bg-red-600 hover:text-white" : ""}
              >
                <Heart className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={async () => {
                  const shareData = {
                    title: product?.title || 'Check out this product',
                    text: `Check out ${product?.title} at KK Outfits!`,
                    url: window.location.href,
                  };
                  
                  if (navigator.share) {
                    try {
                      await navigator.share(shareData);
                    } catch (err) {
                      // User cancelled or share failed
                    }
                  } else {
                    // Fallback: copy URL to clipboard
                    await navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: "Link copied!",
                      description: "Product link copied to clipboard",
                    });
                  }
                }}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="border-t border-border pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <p className="font-semibold">Free Shipping</p>
                  <p className="text-sm text-muted-foreground">On orders above ₹999</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RefreshCcw className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <p className="font-semibold">Easy Returns</p>
                  <p className="text-sm text-muted-foreground">7-day return policy</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <p className="font-semibold">100% Authentic</p>
                  <p className="text-sm text-muted-foreground">Genuine products guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Product Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="qa">Q&A</TabsTrigger>
              <TabsTrigger value="care">Care Instructions</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="py-6">
              {product.description ? (
                <p className="text-muted-foreground">{product.description}</p>
              ) : (
                <p className="text-muted-foreground">No description available.</p>
              )}
            </TabsContent>
            <TabsContent value="details" className="py-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold mb-2">Product Information</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Product ID: {product.id}</li>
                    {availableSizes.length > 0 && (
                      <li>Available Sizes: {availableSizes.join(", ")}</li>
                    )}
                    {colorVariants.length > 0 && (
                      <li>Available Colors: {colorVariants.map(v => v.option1_value).join(", ")}</li>
                    )}
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="py-6">
              <ProductReviews />
            </TabsContent>
            <TabsContent value="qa" className="py-6">
              <ProductQA />
            </TabsContent>
            <TabsContent value="care" className="py-6">
              <ul className="space-y-3 text-muted-foreground">
                <li>• Dry clean only for best results</li>
                <li>• Store in a cool, dry place away from direct sunlight</li>
                <li>• Iron on low heat if needed</li>
                <li>• Do not bleach or use harsh chemicals</li>
                <li>• Keep away from sharp objects to prevent snags</li>
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts />

      {/* Sticky Add to Cart Bar */}
      <StickyAddToCart 
        triggerId="product-price"
        hideTriggerId="product-image-gallery"
        productName={product.title} 
        productImage={productImages[0]} 
        price={displayPrice} 
        originalPrice={displayPrice} 
        sizes={availableSizes} 
        selectedSize={selectedSize} 
        onSizeChange={setSelectedSize} 
        quantity={quantity} 
        onQuantityChange={setQuantity} 
        onAddToCart={handleAddToCart} 
      />

      <Footer />
    </div>;
};
export default ProductDetail;