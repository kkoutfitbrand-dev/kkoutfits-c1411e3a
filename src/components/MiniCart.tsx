import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color?: string;
}

export const MiniCart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setCartItems([]);
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
          setCartItems(data.items as unknown as CartItem[]);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();

    // Subscribe to realtime updates
    if (user) {
      const channel = supabase
        .channel('cart-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'carts',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            if (payload.new && 'items' in payload.new) {
              const items = payload.new.items;
              if (Array.isArray(items)) {
                setCartItems(items as unknown as CartItem[]);
              }
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const removeItem = async (itemId: string) => {
    if (!user) return;

    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);

    try {
      await supabase
        .from('carts')
        .update({ items: JSON.parse(JSON.stringify(updatedItems)), updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Link to="/cart">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-accent text-[10px] font-semibold text-accent-foreground flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Button>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent 
        align="end" 
        className="w-80 p-0 bg-background border border-border shadow-xl z-50"
        sideOffset={8}
      >
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Shopping Cart ({totalItems})</h3>
        </div>

        {loading ? (
          <div className="p-4 text-center text-muted-foreground">
            Loading...
          </div>
        ) : cartItems.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <Link to="/">
              <Button variant="link" className="mt-2">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="max-h-64 overflow-y-auto">
              {cartItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex gap-3 p-3 border-b border-border hover:bg-muted/50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.color && `${item.color} / `}{item.size} × {item.quantity}
                    </p>
                    <p className="text-sm font-semibold mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    className="text-muted-foreground hover:text-destructive p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {cartItems.length > 3 && (
                <p className="text-center text-sm text-muted-foreground py-2">
                  +{cartItems.length - 3} more item(s)
                </p>
              )}
            </div>

            <div className="p-4 border-t border-border bg-muted/30">
              <div className="flex justify-between mb-3">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex gap-2">
                <Link to="/cart" className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">
                    View Cart
                  </Button>
                </Link>
                <Link to="/checkout" className="flex-1">
                  <Button className="w-full" size="sm">
                    Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};
