import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Share2, Truck, RefreshCcw, Shield, ZoomIn, Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProductReviews } from "@/components/ProductReviews";
import { ProductQA } from "@/components/ProductQA";
import { RelatedProducts } from "@/components/RelatedProducts";
import { StickyAddToCart } from "@/components/StickyAddToCart";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

// Mock product data
const products = {
  "1": {
    id: "1",
    name: "Cream Embroidered Kurta Pajama Set",
    price: 5999,
    originalPrice: 8999,
    images: [product1, product2, product3],
    description: "Elegant cream kurta pajama set with intricate embroidery on collar and cuffs. Perfect for festive occasions and celebrations.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    sku: "KK-KRT-001",
    category: "Kurtas",
  },
  "2": {
    id: "2",
    name: "Royal Black Sherwani with Golden Embroidery",
    price: 24999,
    originalPrice: 34999,
    images: [product2, product1, product4],
    description: "Luxurious black sherwani with golden embroidery. Perfect for weddings and special occasions.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    sku: "KK-SHR-002",
    category: "Sherwanis",
  },
  "3": {
    id: "3",
    name: "Burgundy Velvet Bandhgala Jacket",
    price: 12999,
    originalPrice: 17999,
    images: [product3, product5, product2],
    description: "Premium velvet bandhgala jacket with silver buttons. Ideal for festive celebrations.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    sku: "KK-BND-003",
    category: "Bandhgalas",
  },
  "4": {
    id: "4",
    name: "Emerald Green Silk Kurta with Gold Details",
    price: 7999,
    originalPrice: 11999,
    images: [product4, product1, product6],
    description: "Elegant silk kurta with gold border details. Traditional wear for festive occasions.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    sku: "KK-KRT-004",
    category: "Kurtas",
  },
  "5": {
    id: "5",
    name: "Premium Ivory Wedding Sherwani",
    price: 49999,
    originalPrice: 69999,
    images: [product5, product2, product3],
    description: "Premium ivory sherwani with heavy embroidery and red dupatta. Perfect for wedding ceremonies.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    sku: "KK-SHR-005",
    category: "Sherwanis",
  },
  "6": {
    id: "6",
    name: "Grey Indo-Western Kurta",
    price: 6999,
    originalPrice: 9999,
    images: [product6, product4, product1],
    description: "Contemporary grey indo-western kurta with modern cut. Perfect blend of tradition and style.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    sku: "KK-IND-006",
    category: "Indo Western",
  },
};

const ProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const product = products[id as keyof typeof products];
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

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

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "Choose a size before adding to cart",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Added to cart!",
      description: `${product.name} (Size: ${selectedSize}, Qty: ${quantity})`,
    });
  };

  const handleAddToWishlist = () => {
    toast({
      title: "Added to wishlist!",
      description: product.name,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-accent">Home</Link>
          <span>/</span>
          <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-accent">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <div 
              className="mb-4 rounded-lg overflow-hidden bg-muted relative group cursor-zoom-in"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className={`w-full aspect-[3/4] object-cover transition-transform duration-300 ${
                  isZoomed ? "scale-150" : "group-hover:scale-105"
                }`}
              />
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full p-2">
                <ZoomIn className="h-5 w-5 text-foreground" />
              </div>
              <div className="absolute top-4 left-4 bg-accent/90 text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                360° View Available
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                    setIsZoomed(false);
                  }}
                  className={`rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-accent" : "border-border"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full aspect-[3/4] object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold">₹{product.price.toLocaleString()}</span>
              <span className="text-xl text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
              <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            </div>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold">Select Size</label>
                <Link to="/size-guide" className="text-sm text-accent hover:underline">
                  Size Guide
                </Link>
              </div>
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 mb-3">
                <p className="text-sm text-accent-foreground">
                  <strong>Size Recommendation:</strong> Based on average measurements, we recommend size M for best fit.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-lg border-2 font-medium transition-colors ${
                      selectedSize === size
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border hover:border-accent"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="font-semibold block mb-3">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border-2 border-border hover:border-accent flex items-center justify-center font-bold"
                >
                  -
                </button>
                <span className="w-16 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border-2 border-border hover:border-accent flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" onClick={handleAddToWishlist}>
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
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
              <p className="text-muted-foreground">{product.description}</p>
              <p className="mt-4 text-muted-foreground">
                Crafted with premium fabrics and attention to detail, this piece combines traditional
                elegance with contemporary comfort. Perfect for special occasions and celebrations.
              </p>
            </TabsContent>
            <TabsContent value="details" className="py-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold mb-2">Product Information</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>SKU: {product.sku}</li>
                    <li>Category: {product.category}</li>
                    <li>Available Sizes: {product.sizes.join(", ")}</li>
                    <li>Stock Status: {product.inStock ? "In Stock" : "Out of Stock"}</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Fabric Details</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Material: Premium Cotton Blend</li>
                    <li>Pattern: Embroidered</li>
                    <li>Occasion: Festive & Wedding</li>
                    <li>Wash Care: Dry Clean Only</li>
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
        productName={product.name}
        productImage={product.images[0]}
        price={product.price}
        originalPrice={product.originalPrice}
        sizes={product.sizes}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        quantity={quantity}
        onQuantityChange={setQuantity}
        onAddToCart={handleAddToCart}
      />

      <Footer />
    </div>
  );
};

export default ProductDetail;
