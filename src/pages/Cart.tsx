import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag, Loader2, X, CheckCircle, Truck, Gift } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { SavedForLater } from "@/components/SavedForLater";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface CartItem {
  id: string;
  productId?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color?: string;
  is_combo?: boolean;
  combo_id?: string;
  combo_items?: Array<{
    color_name: string;
    quantity: number;
    image_url: string;
  }>;
}

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_cents: number;
  maximum_discount_cents: number | null;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  valid_from: string;
  valid_until: string | null;
}

// Helper to get selling price from product
const getSellingPrice = (product: any): number => {
  if (product.variants && typeof product.variants === 'object' && 'sale_price_cents' in product.variants) {
    const salePrice = product.variants.sale_price_cents;
    if (salePrice && salePrice < product.price_cents) {
      return salePrice / 100;
    }
  }
  return product.price_cents / 100;
};

const Cart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('carts')
          .select('items')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data?.items && Array.isArray(data.items)) {
          const items = data.items as unknown as CartItem[];
          const productIds = [...new Set(items.map(item => item.productId).filter(Boolean))];
          
          if (productIds.length > 0) {
            const { data: products } = await supabase
              .from('products')
              .select('id, price_cents, variants')
              .in('id', productIds);
            
            if (products) {
              const priceMap = new Map<string, number>();
              products.forEach(product => {
                priceMap.set(product.id, getSellingPrice(product));
              });
              
              const updatedItems = items.map(item => ({
                ...item,
                price: item.productId && priceMap.has(item.productId) 
                  ? priceMap.get(item.productId)! 
                  : item.price
              }));
              
              setCartItems(updatedItems);
              return;
            }
          }
          
          setCartItems(items);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  const saveCartToDb = async (items: CartItem[]) => {
    if (!user) return;

    try {
      const { data: existingCart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingCart) {
        await supabase
          .from('carts')
          .update({ items: JSON.parse(JSON.stringify(items)), updated_at: new Date().toISOString() })
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('carts')
          .insert({ user_id: user.id, items: JSON.parse(JSON.stringify(items)) });
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const updateQuantity = async (id: string, delta: number) => {
    const newItems = cartItems.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    setCartItems(newItems);
    await saveCartToDb(newItems);
  };

  const removeItem = async (id: string) => {
    const newItems = cartItems.filter(item => item.id !== id);
    setCartItems(newItems);
    await saveCartToDb(newItems);
    toast.success("Item removed from cart");
  };

  const saveForLater = async (id: string) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      setSavedItems(prev => [...prev, item]);
      const newItems = cartItems.filter(item => item.id !== id);
      setCartItems(newItems);
      await saveCartToDb(newItems);
      toast.success("Item saved for later");
    }
  };

  const moveToCart = async (id: string) => {
    const item = savedItems.find(item => item.id === id);
    if (item) {
      const newItems = [...cartItems, item];
      setCartItems(newItems);
      setSavedItems(items => items.filter(item => item.id !== id));
      await saveCartToDb(newItems);
      toast.success("Item moved to cart");
    }
  };

  const removeSavedItem = (id: string) => {
    setSavedItems(items => items.filter(item => item.id !== id));
    toast.success("Item removed");
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  
  const calculateDiscount = (): number => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.discount_type === 'percentage') {
      let discount = Math.floor(subtotal * (appliedCoupon.discount_value / 100));
      if (appliedCoupon.maximum_discount_cents) {
        discount = Math.min(discount, appliedCoupon.maximum_discount_cents / 100);
      }
      return discount;
    } else {
      return appliedCoupon.discount_value;
    }
  };
  
  const discount = calculateDiscount();
  const total = subtotal + shipping - discount;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setCouponLoading(true);
    setCouponError(null);
    
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase().trim())
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setCouponError('Invalid coupon code');
        return;
      }

      if (data.valid_until && new Date(data.valid_until) < new Date()) {
        setCouponError('This coupon has expired');
        return;
      }

      if (data.minimum_order_cents > 0 && subtotal * 100 < data.minimum_order_cents) {
        setCouponError(`Minimum order of ₹${data.minimum_order_cents / 100} required`);
        return;
      }

      if (data.usage_limit && data.used_count >= data.usage_limit) {
        setCouponError('This coupon has reached its usage limit');
        return;
      }

      setAppliedCoupon({
        ...data,
        discount_type: data.discount_type as 'percentage' | 'fixed'
      });
      setCouponCode('');
      toast.success(`Coupon "${data.code}" applied!`);
    } catch (error) {
      console.error('Error applying coupon:', error);
      setCouponError('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    toast.success('Coupon removed');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 container px-4 py-16 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground mt-4">Loading your cart...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 container px-4 py-16 flex flex-col items-center justify-center">
          <ShoppingBag className="w-24 h-24 text-muted-foreground mb-6" />
          <h1 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-center">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8 text-center">Add items to get started</p>
          <Link to="/">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-32 lg:pb-0">
        <Navigation />
        <div className="container px-4 py-6 md:py-12">
          <h1 className="text-2xl md:text-4xl font-serif font-bold mb-6 md:mb-8">Shopping Cart</h1>
          
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 md:space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="bg-card border border-border rounded-lg p-3 md:p-4 flex gap-3 md:gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 md:w-32 md:h-32 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm md:text-base line-clamp-2">{item.name}</h3>
                        {item.is_combo && (
                          <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full mt-1">
                            Combo Bundle
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 md:p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                    
                    {/* Combo items breakdown with color images */}
                    {item.is_combo ? (
                      <div className="mt-2">
                        <span className="text-xs md:text-sm font-medium text-muted-foreground">Selected Items:</span>
                        <div className="flex flex-wrap gap-1.5 md:gap-2 mt-1.5">
                          {item.combo_items && item.combo_items.length > 0 ? (
                            item.combo_items.map((ci, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 bg-muted/50 rounded-md px-1.5 py-1 md:px-2 md:py-1.5">
                                {ci.image_url ? (
                                  <img 
                                    src={ci.image_url} 
                                    alt={ci.color_name || `Item ${idx + 1}`}
                                    className="w-6 h-6 md:w-8 md:h-8 rounded object-cover border border-border"
                                  />
                                ) : (
                                  <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-muted border border-border flex items-center justify-center">
                                    <span className="text-[10px] md:text-xs text-muted-foreground">{idx + 1}</span>
                                  </div>
                                )}
                                <span className="text-xs md:text-sm">
                                  {ci.color_name || `Item ${idx + 1}`}
                                  {ci.quantity > 1 && <span className="text-muted-foreground ml-0.5">×{ci.quantity}</span>}
                                </span>
                              </div>
                            ))
                          ) : item.color ? (
                            <span className="text-xs md:text-sm text-muted-foreground">{item.color}</span>
                          ) : (
                            <span className="text-xs md:text-sm text-muted-foreground">{item.size || 'Bundle items'}</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-x-2 md:gap-x-3 text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">
                        {item.color && <span>Color: {item.color}</span>}
                        {item.size && <span>Size: {item.size}</span>}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2 md:mt-4">
                      <p className="font-semibold text-base md:text-lg">₹{item.price.toLocaleString()}</p>
                      
                      {!item.is_combo ? (
                        <div className="flex items-center border border-border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1.5 md:p-2 hover:bg-muted transition-colors"
                          >
                            <Minus className="w-3 h-3 md:w-4 md:h-4" />
                          </button>
                          <span className="px-3 md:px-4 font-medium text-sm md:text-base">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1.5 md:p-2 hover:bg-muted transition-colors"
                          >
                            <Plus className="w-3 h-3 md:w-4 md:h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs md:text-sm text-muted-foreground">
                          Qty: {item.quantity} bundle
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary - Desktop */}
            <div className="lg:col-span-1 hidden lg:block">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-serif font-bold mb-6">Order Summary</h2>
                
                {/* Free Shipping Progress Bar - Desktop */}
                {(() => {
                  const freeShippingThreshold = 999;
                  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
                  const remaining = freeShippingThreshold - subtotal;
                  return (
                    <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        {remaining <= 0 ? (
                          <>
                            <Gift className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-green-600">🎉 You've unlocked FREE shipping!</span>
                          </>
                        ) : (
                          <>
                            <Truck className="w-5 h-5 text-primary" />
                            <span className="text-sm font-medium">Add ₹{remaining.toLocaleString()} more for FREE shipping</span>
                          </>
                        )}
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>₹0</span>
                        <span>₹{freeShippingThreshold}</span>
                      </div>
                    </div>
                  );
                })()}
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="mb-6">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-green-700 dark:text-green-400">{appliedCoupon.code}</p>
                          <p className="text-xs text-green-600 dark:text-green-500">
                            {appliedCoupon.discount_type === 'percentage' 
                              ? `${appliedCoupon.discount_value}% off`
                              : `₹${appliedCoupon.discount_value} off`}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100 flex-shrink-0"
                        onClick={removeCoupon}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase());
                            setCouponError(null);
                          }}
                          className="uppercase"
                        />
                        <Button 
                          variant="outline" 
                          onClick={applyCoupon}
                          disabled={couponLoading || !couponCode.trim()}
                        >
                          {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                        </Button>
                      </div>
                      {couponError && (
                        <p className="text-xs text-destructive">{couponError}</p>
                      )}
                    </div>
                  )}
                </div>

                <Link to="/checkout">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <Link to="/">
                  <Button variant="ghost" className="w-full mt-3">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Saved for Later Section */}
          {savedItems.length > 0 && (
            <div className="mt-8">
              <SavedForLater
                items={savedItems}
                onMoveToCart={moveToCart}
                onRemove={removeSavedItem}
              />
            </div>
          )}
        </div>

        {/* Sticky Mobile Order Summary */}
        <div className="sticky bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border p-4 lg:hidden z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
          <div className="space-y-3">
            {/* Free Shipping Progress Bar - Mobile */}
            {(() => {
              const freeShippingThreshold = 999;
              const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
              const remaining = freeShippingThreshold - subtotal;
              return (
                <div className="flex items-center gap-3">
                  {remaining <= 0 ? (
                    <Gift className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <Truck className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <Progress value={progress} className="h-1.5" />
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {remaining <= 0 ? '🎉 Free shipping!' : `₹${remaining} more`}
                  </span>
                </div>
              );
            })()}

            {/* Coupon Code - Mobile */}
            {!appliedCoupon ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponError(null);
                  }}
                  className="uppercase text-sm"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={applyCoupon}
                  disabled={couponLoading || !couponCode.trim()}
                >
                  {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">{appliedCoupon.code}</span>
                  <span className="text-xs text-green-600">-₹{discount}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-green-600"
                  onClick={removeCoupon}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
            {couponError && <p className="text-xs text-destructive">{couponError}</p>}
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
                <p className="text-lg font-bold">₹{total.toLocaleString()}</p>
              </div>
              <Link to="/checkout">
                <Button size="lg">Checkout</Button>
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Cart;