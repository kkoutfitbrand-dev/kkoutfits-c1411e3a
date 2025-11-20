import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { SavedForLater } from "@/components/SavedForLater";
import { toast } from "sonner";
import product1 from "@/assets/product-1.jpg";
import product3 from "@/assets/product-3.jpg";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Cream Embroidered Kurta Pajama Set",
      price: 5999,
      image: product1,
      quantity: 1,
      size: "M",
    },
    {
      id: "3",
      name: "Burgundy Velvet Bandhgala Jacket",
      price: 12999,
      image: product3,
      quantity: 1,
      size: "L",
    },
  ]);

  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };

  const saveForLater = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      setSavedItems(prev => [...prev, item]);
      setCartItems(items => items.filter(item => item.id !== id));
      toast.success("Item saved for later");
    }
  };

  const moveToCart = (id: string) => {
    const item = savedItems.find(item => item.id === id);
    if (item) {
      setCartItems(prev => [...prev, item]);
      setSavedItems(items => items.filter(item => item.id !== id));
      toast.success("Item moved to cart");
    }
  };

  const removeSavedItem = (id: string) => {
    setSavedItems(items => items.filter(item => item.id !== id));
    toast.success("Item removed");
  };

  const applyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode.toUpperCase());
      toast.success(`Coupon ${couponCode.toUpperCase()} applied!`);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const discount = appliedCoupon === "SAVE200" ? 200 : appliedCoupon === "SAVE10" ? Math.floor(subtotal * 0.1) : 0;
  const total = subtotal + shipping - discount;
  const savings = discount + (shipping === 0 ? 99 : 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 container px-4 py-16 flex flex-col items-center justify-center">
          <ShoppingBag className="w-24 h-24 text-muted-foreground mb-6" />
          <h1 className="text-3xl font-serif font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Add items to get started</p>
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
      <div className="min-h-screen bg-background">
        <Navigation />
      <div className="container px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="bg-card border border-border rounded-lg p-4 flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">Size: {item.size}</p>
                  <p className="font-semibold text-lg">₹{item.price.toLocaleString()}</p>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-border rounded-md">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2 hover:bg-muted transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2 hover:bg-muted transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-serif font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-accent">
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
                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button variant="outline">Apply</Button>
                </div>
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
      <Footer />
    </div>
    </ProtectedRoute>
  );
};

export default Cart;
