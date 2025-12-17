import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WishlistItem {
  id: string;
  product_id: string;
  product: {
    id: string;
    title: string;
    price_cents: number;
    images: Json;
    slug: string;
    variants?: Json;
  };
}

interface ProductVariant {
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

const getFirstImage = (images: Json): string => {
  if (Array.isArray(images) && images.length > 0) {
    return images[0] as string;
  }
  return "/placeholder.svg";
};

const getSalePrice = (variants: Json): number | null => {
  if (variants && typeof variants === 'object' && 'sale_price_cents' in variants) {
    return (variants as { sale_price_cents?: number }).sale_price_cents || null;
  }
  return null;
};

const Wishlist = () => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [movingToCart, setMovingToCart] = useState<string | null>(null);
  const [sizeDialogOpen, setSizeDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { data, error } = await supabase
        .from("wishlists")
        .select(`
          id,
          product_id,
          product:products(id, title, price_cents, images, slug, variants)
        `)
        .eq("user_id", user?.id);

      if (error) throw error;
      setWishlistItems(data as unknown as WishlistItem[]);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setWishlistItems(items => items.filter(item => item.id !== id));
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove item");
    }
  };

  const openSizeDialog = async (item: WishlistItem) => {
    setSelectedItem(item);
    setSelectedSize("");
    setSelectedColor("");
    setLoadingOptions(true);
    setSizeDialogOpen(true);

    try {
      const { data: variants, error } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", item.product.id);

      if (error) throw error;

      const variantsData = variants as ProductVariant[];
      setProductVariants(variantsData);

      // Extract unique colors from variants
      const colors = variantsData
        .map(v => {
          if (v.option1_name?.toLowerCase() === 'color') return v.option1_value;
          if (v.option2_name?.toLowerCase() === 'color') return v.option2_value;
          return null;
        })
        .filter((v, i, arr) => v && arr.indexOf(v) === i) as string[];

      // Extract unique sizes from variants
      const sizes = variantsData
        .map(v => {
          if (v.option1_name?.toLowerCase() === 'size') return v.option1_value;
          if (v.option2_name?.toLowerCase() === 'size') return v.option2_value;
          return null;
        })
        .filter((v, i, arr) => v && arr.indexOf(v) === i) as string[];

      setAvailableColors(colors);
      setAvailableSizes(sizes);
    } catch (error) {
      console.error("Error fetching options:", error);
      setAvailableSizes([]);
      setAvailableColors([]);
    } finally {
      setLoadingOptions(false);
    }
  };

  const getAvailableSizesForColor = (color: string): string[] => {
    if (!color) return availableSizes;
    return productVariants
      .filter(v => {
        const variantColor = v.option1_name?.toLowerCase() === 'color' ? v.option1_value : v.option2_value;
        return variantColor === color;
      })
      .map(v => {
        if (v.option1_name?.toLowerCase() === 'size') return v.option1_value;
        if (v.option2_name?.toLowerCase() === 'size') return v.option2_value;
        return null;
      })
      .filter((v, i, arr) => v && arr.indexOf(v) === i) as string[];
  };

  const moveToCart = async () => {
    if (!user || !selectedItem) return;

    const sizesForColor = selectedColor ? getAvailableSizesForColor(selectedColor) : availableSizes;
    
    if (availableColors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    if (sizesForColor.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    
    setMovingToCart(selectedItem.id);
    setSizeDialogOpen(false);
    
    try {
      const salePrice = getSalePrice(selectedItem.product.variants);
      const price = salePrice || selectedItem.product.price_cents;
      
      const newCartItem = {
        id: `${selectedItem.product.id}-${selectedSize}-${selectedColor}-${Date.now()}`,
        productId: selectedItem.product.id,
        name: selectedItem.product.title,
        price: price / 100,
        image: getFirstImage(selectedItem.product.images),
        quantity: 1,
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
        updatedItems = [...(existingCart.items as any[]), newCartItem];
      } else {
        updatedItems = [newCartItem];
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

      // Remove from wishlist
      await supabase
        .from("wishlists")
        .delete()
        .eq("id", selectedItem.id);

      setWishlistItems(items => items.filter(i => i.id !== selectedItem.id));
      const details = [selectedColor, selectedSize].filter(Boolean).join(", ");
      toast.success(`Moved to cart${details ? ` (${details})` : ""}`);
    } catch (error) {
      console.error("Error moving to cart:", error);
      toast.error("Failed to move to cart");
    } finally {
      setMovingToCart(null);
      setSelectedItem(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 container px-4 py-16 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 container px-4 py-16 flex flex-col items-center justify-center">
          <Heart className="w-24 h-24 text-muted-foreground mb-6" />
          <h1 className="text-3xl font-serif font-bold mb-4">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground mb-8">Save your favorite items here</p>
          <Link to="/">
            <Button size="lg">Explore Products</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container px-4 py-8 md:py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold">
              My Wishlist ({wishlistItems.length})
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {wishlistItems.map(item => {
              const salePrice = getSalePrice(item.product.variants);
              const displayPrice = salePrice || item.product.price_cents;
              const originalPrice = salePrice ? item.product.price_cents : null;

              return (
                <div key={item.id} className="bg-card border border-border rounded-lg overflow-hidden group">
                  <div className="relative">
                    <Link to={`/product/${item.product.slug}`}>
                      <img
                        src={getFirstImage(item.product.images)}
                        alt={item.product.title}
                        className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-4 right-4 p-2 bg-background/90 rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                  <div className="p-4">
                    <Link to={`/product/${item.product.slug}`}>
                      <h3 className="font-semibold mb-2 hover:text-accent transition-colors line-clamp-2">
                        {item.product.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold">₹{(displayPrice / 100).toLocaleString()}</span>
                      {originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{(originalPrice / 100).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => openSizeDialog(item)}
                      disabled={movingToCart === item.id}
                    >
                      {movingToCart === item.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ShoppingCart className="w-4 h-4 mr-2" />
                      )}
                      {movingToCart === item.id ? "Moving..." : "Move to Cart"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Footer />

        {/* Size & Color Selection Dialog */}
        <Dialog open={sizeDialogOpen} onOpenChange={setSizeDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Options</DialogTitle>
            </DialogHeader>
            
            {selectedItem && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <img
                    src={getFirstImage(selectedItem.product.images)}
                    alt={selectedItem.product.title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="font-semibold line-clamp-2">{selectedItem.product.title}</h4>
                    <p className="text-lg font-bold mt-1">
                      ₹{((getSalePrice(selectedItem.product.variants) || selectedItem.product.price_cents) / 100).toLocaleString()}
                    </p>
                  </div>
                </div>

                {loadingOptions ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <>
                    {availableColors.length > 0 && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Choose Color</label>
                        <div className="flex flex-wrap gap-2">
                          {availableColors.map(color => (
                            <button
                              key={color}
                              onClick={() => {
                                setSelectedColor(color);
                                setSelectedSize(""); // Reset size when color changes
                              }}
                              className={`min-w-[60px] h-10 px-4 rounded-lg border-2 font-semibold transition-all ${
                                selectedColor === color
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border hover:border-primary"
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {(() => {
                      const sizesForColor = selectedColor ? getAvailableSizesForColor(selectedColor) : availableSizes;
                      return sizesForColor.length > 0 ? (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Choose Size</label>
                          <div className="flex flex-wrap gap-2">
                            {sizesForColor.map(size => (
                              <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`min-w-[50px] h-10 px-4 rounded-lg border-2 font-semibold transition-all ${
                                  selectedSize === size
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border hover:border-primary"
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : availableSizes.length === 0 && availableColors.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No options available for this product.</p>
                      ) : null;
                    })()}
                  </>
                )}

                <Button 
                  className="w-full" 
                  onClick={moveToCart}
                  disabled={
                    (availableColors.length > 0 && !selectedColor) ||
                    ((selectedColor ? getAvailableSizesForColor(selectedColor) : availableSizes).length > 0 && !selectedSize)
                  }
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
};

export default Wishlist;
