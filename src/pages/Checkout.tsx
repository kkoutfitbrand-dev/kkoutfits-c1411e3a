import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Check, Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

const addressSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100, "Name must be less than 100 characters"),
  lastName: z.string().trim().min(1, "Last name is required").max(100, "Name must be less than 100 characters"),
  phone: z.string().trim().regex(/^(\+91)?[6-9]\d{9}$/, "Invalid Indian phone number"),
  address: z.string().trim().min(10, "Address must be at least 10 characters").max(500, "Address must be less than 500 characters"),
  city: z.string().trim().min(1, "City is required").max(100, "City must be less than 100 characters"),
  state: z.string().trim().min(1, "State is required").max(100, "State must be less than 100 characters"),
  pincode: z.string().trim().regex(/^\d{6}$/, "Pincode must be exactly 6 digits")
});

type AddressFormData = z.infer<typeof addressSchema>;

interface SavedAddress {
  id: string;
  type: "Home" | "Office" | "Other";
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([
    {
      id: "1",
      type: "Home",
      firstName: "John",
      lastName: "Doe",
      phone: "9876543210",
      address: "123 MG Road, Near City Mall",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      isDefault: true,
    },
    {
      id: "2",
      type: "Office",
      firstName: "John",
      lastName: "Doe",
      phone: "9876543210",
      address: "456 Tech Park, Whitefield",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560066",
      isDefault: false,
    },
  ]);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: ""
    }
  });

  const onAddressSubmit = async (data: AddressFormData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (selectedAddressId) {
      // Editing existing address
      setSavedAddresses(prev =>
        prev.map(addr =>
          addr.id === selectedAddressId
            ? { ...addr, ...data }
            : addr
        )
      );
      toast({ title: "Address updated successfully" });
    } else {
      // Adding new address
      const newAddress: SavedAddress = {
        id: Date.now().toString(),
        type: "Home",
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        isDefault: savedAddresses.length === 0,
      };
      setSavedAddresses(prev => [...prev, newAddress]);
      toast({ title: "Address added successfully" });
    }
    
    setShowAddressForm(false);
    setSelectedAddressId(null);
  };

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
    setStep(2);
  };

  const handleEditAddress = (address: SavedAddress) => {
    setSelectedAddressId(address.id);
    Object.entries(address).forEach(([key, value]) => {
      if (key !== "id" && key !== "type" && key !== "isDefault") {
        (form as any).setValue(key, value);
      }
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id: string) => {
    setSavedAddresses(prev => prev.filter(addr => addr.id !== id));
    toast({ title: "Address deleted" });
  };

  const handleSetDefault = (id: string) => {
    setSavedAddresses(prev =>
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: ""
    }
  });

  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('carts')
          .select('items')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data?.items && Array.isArray(data.items)) {
          setCartItems(data.items as unknown as CartItem[]);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setCartLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId) || savedAddresses.find(addr => addr.isDefault);

  const handlePlaceOrder = async () => {
    if (!user || cartItems.length === 0) return;
    
    setPlacingOrder(true);
    try {
      const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
      
      // Create order in database
      const { error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          order_items: cartItems as unknown as import('@/integrations/supabase/types').Json,
          total_cents: total * 100,
          shipping_address: (selectedAddress || {}) as unknown as import('@/integrations/supabase/types').Json,
          status: 'pending'
        }]);

      if (orderError) throw orderError;

      // Clear cart
      await supabase
        .from('carts')
        .update({ items: [] })
        .eq('user_id', user.id);

      // Navigate to confirmation
      navigate('/order-confirmation', {
        state: {
          orderId,
          items: cartItems,
          total,
          shippingAddress: selectedAddress,
          paymentMethod
        }
      });
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20 lg:pb-0">
        <Navigation />
      
      <div className="container px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">Checkout</h1>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 md:mb-12">
          <div className="flex items-center gap-2 sm:gap-4 max-w-2xl w-full">
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <div className={`w-8 h-8 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base ${
                step >= 1 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {step > 1 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : "1"}
              </div>
              <span className={`text-xs sm:text-base ${step >= 1 ? "font-medium" : "text-muted-foreground"}`}>Address</span>
            </div>
            
            <div className="flex-1 h-0.5 bg-border" />
            
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <div className={`w-8 h-8 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base ${
                step >= 2 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {step > 2 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : "2"}
              </div>
              <span className={`text-xs sm:text-base ${step >= 2 ? "font-medium" : "text-muted-foreground"}`}>Payment</span>
            </div>
            
            <div className="flex-1 h-0.5 bg-border" />
            
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <div className={`w-8 h-8 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base ${
                step >= 3 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
              }`}>
                3
              </div>
              <span className={`text-xs sm:text-base ${step >= 3 ? "font-medium" : "text-muted-foreground"}`}>Review</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-serif font-bold mb-6">Delivery Address</h2>
                <form id="checkout-form" onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" {...register('firstName')} className="mt-2" />
                      {errors.firstName && (
                        <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" {...register('lastName')} className="mt-2" />
                      {errors.lastName && (
                        <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" {...register('phone')} className="mt-2" />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input id="address" {...register('address')} className="mt-2" />
                    {errors.address && (
                      <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
                    )}
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" {...register('city')} className="mt-2" />
                      {errors.city && (
                        <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input id="state" {...register('state')} className="mt-2" />
                      {errors.state && (
                        <p className="text-sm text-destructive mt-1">{errors.state.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input id="pincode" {...register('pincode')} className="mt-2" placeholder="e.g. 600001" />
                      {errors.pincode && (
                        <p className="text-sm text-destructive mt-1">{errors.pincode.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input id="country" value="India" disabled className="mt-2" />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Continue to Payment
                  </Button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-serif font-bold mb-6">Payment Method</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div className="flex items-center space-x-3 border border-border rounded-lg p-4">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-sm text-muted-foreground">Pay when you receive</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 border border-border rounded-lg p-4">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex-1 cursor-pointer">
                      <div className="font-medium">UPI</div>
                      <div className="text-sm text-muted-foreground">Google Pay, PhonePe, Paytm</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 border border-border rounded-lg p-4">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="font-medium">Credit / Debit Card</div>
                      <div className="text-sm text-muted-foreground">Visa, Mastercard, Rupay</div>
                    </Label>
                  </div>
                </RadioGroup>
                
                <div className="flex gap-4 mt-6">
                  <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} className="flex-1">
                    Continue to Review
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-serif font-bold mb-6">Review Your Order</h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2">Delivery Address</h3>
                    <p className="text-sm text-muted-foreground">
                      John Doe<br />
                      123 Street Name, City Name<br />
                      State - 123456<br />
                      Phone: +91 98765 43210
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Payment Method</h3>
                    <p className="text-sm text-muted-foreground">Cash on Delivery</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                    Back
                  </Button>
                  <Button 
                    className="flex-1" 
                    size="lg" 
                    onClick={handlePlaceOrder}
                    disabled={placingOrder || cartItems.length === 0}
                  >
                    {placingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Place Order
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-serif font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold">₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Order Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 lg:hidden z-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
            <p className="text-lg font-bold">₹{total.toLocaleString()}</p>
          </div>
          {step === 1 && (
            <Button type="submit" form="checkout-form" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue
            </Button>
          )}
          {step === 2 && (
            <Button onClick={() => setStep(3)}>
              Review Order
            </Button>
          )}
          {step === 3 && (
            <Button size="lg" onClick={handlePlaceOrder} disabled={placingOrder || cartItems.length === 0}>
              {placingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Place Order
            </Button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  </ProtectedRoute>
  );
};

export default Checkout;
