import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Check, Loader2, Plus, Pencil, Trash2, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useRazorpay } from "@/hooks/useRazorpay";

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

// Helper to get selling price from product
const getSellingPrice = (product: any): number => {
  // Check for sale price in variants JSON field
  if (product.variants && typeof product.variants === 'object' && 'sale_price_cents' in product.variants) {
    const salePrice = product.variants.sale_price_cents;
    if (salePrice && salePrice < product.price_cents) {
      return salePrice / 100;
    }
  }
  return product.price_cents / 100;
};

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
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const navigate = useNavigate();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const { toast } = useToast();
  const { isLoaded: razorpayLoaded } = useRazorpay();

  const onAddressSubmit = async (data: AddressFormData) => {
    if (!user) return;
    
    try {
      if (selectedAddressId && savedAddresses.find(a => a.id === selectedAddressId)) {
        // Editing existing address
        const { error } = await supabase
          .from('addresses')
          .update({
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            address: data.address,
            city: data.city,
            state: data.state,
            pincode: data.pincode
          })
          .eq('id', selectedAddressId)
          .eq('user_id', user.id);

        if (error) throw error;

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
        const isFirst = savedAddresses.length === 0;
        const { data: newAddr, error } = await supabase
          .from('addresses')
          .insert({
            user_id: user.id,
            type: 'Home',
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            address: data.address,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
            is_default: isFirst
          })
          .select()
          .single();

        if (error) throw error;

        const newAddress: SavedAddress = {
          id: newAddr.id,
          type: newAddr.type as "Home" | "Office" | "Other",
          firstName: newAddr.first_name,
          lastName: newAddr.last_name,
          phone: newAddr.phone,
          address: newAddr.address,
          city: newAddr.city,
          state: newAddr.state,
          pincode: newAddr.pincode,
          isDefault: newAddr.is_default,
        };
        setSavedAddresses(prev => [...prev, newAddress]);
        setSelectedAddressId(newAddr.id);
        toast({ title: "Address added successfully" });
      }
      
      setShowAddressForm(false);
      setStep(2);
    } catch (error) {
      console.error('Error saving address:', error);
      toast({ title: "Failed to save address", variant: "destructive" });
    }
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

  const handleDeleteAddress = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setSavedAddresses(prev => prev.filter(addr => addr.id !== id));
      toast({ title: "Address deleted" });
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({ title: "Failed to delete address", variant: "destructive" });
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    
    try {
      // First, unset all defaults
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
      
      // Then set the new default
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setSavedAddresses(prev =>
        prev.map(addr => ({
          ...addr,
          isDefault: addr.id === id,
        }))
      );
      toast({ title: "Default address updated" });
    } catch (error) {
      console.error('Error setting default address:', error);
      toast({ title: "Failed to update default address", variant: "destructive" });
    }
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
          const items = data.items as unknown as CartItem[];
          
          // Get unique product IDs
          const productIds = [...new Set(items.map(item => item.productId).filter(Boolean))];
          
          if (productIds.length > 0) {
            // Fetch current product prices
            const { data: products } = await supabase
              .from('products')
              .select('id, price_cents, variants')
              .in('id', productIds);
            
            if (products) {
              // Create a map of product ID to selling price
              const priceMap = new Map<string, number>();
              products.forEach(product => {
                priceMap.set(product.id, getSellingPrice(product));
              });
              
              // Update cart items with current selling prices
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
        setCartLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  // Fetch saved addresses from database
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) {
        setAddressesLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', user.id)
          .order('is_default', { ascending: false });

        if (error) throw error;

        if (data) {
          const addresses: SavedAddress[] = data.map(addr => ({
            id: addr.id,
            type: addr.type as "Home" | "Office" | "Other",
            firstName: addr.first_name,
            lastName: addr.last_name,
            phone: addr.phone,
            address: addr.address,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            isDefault: addr.is_default || false,
          }));
          setSavedAddresses(addresses);
          
          // Auto-select default address
          const defaultAddr = addresses.find(a => a.isDefault);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
          }
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setAddressesLoading(false);
      }
    };

    fetchAddresses();
  }, [user]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId) || savedAddresses.find(addr => addr.isDefault);

  const initiateRazorpayPayment = async (orderId: string) => {
    if (!razorpayLoaded || !window.Razorpay) {
      toast({
        title: "Error",
        description: "Payment gateway is loading. Please try again.",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Create Razorpay order
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: total,
          currency: 'INR',
          receipt: orderId,
          notes: {
            order_id: orderId,
            user_id: user?.id
          }
        }
      });

      if (error || !data?.orderId) {
        console.error('Error creating Razorpay order:', error || data?.error);
        throw new Error(data?.error || 'Failed to create payment order');
      }

      return new Promise<boolean>((resolve) => {
        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: 'Your Store',
          description: `Order #${orderId.slice(0, 8)}`,
          order_id: data.orderId,
          handler: async function (response: any) {
            try {
              // Verify payment
              const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  order_id: orderId
                }
              });

              if (verifyError || !verifyData?.verified) {
                console.error('Payment verification failed:', verifyError || verifyData?.error);
                toast({
                  title: "Payment Verification Failed",
                  description: "Please contact support if amount was deducted.",
                  variant: "destructive"
                });
                resolve(false);
                return;
              }

              resolve(true);
            } catch (err) {
              console.error('Error verifying payment:', err);
              resolve(false);
            }
          },
          prefill: {
            name: selectedAddress ? `${selectedAddress.firstName} ${selectedAddress.lastName}` : '',
            contact: selectedAddress?.phone || ''
          },
          theme: {
            color: '#000000'
          },
          modal: {
            ondismiss: function() {
              resolve(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          console.error('Payment failed:', response.error);
          toast({
            title: "Payment Failed",
            description: response.error.description || "Please try again.",
            variant: "destructive"
          });
          resolve(false);
        });
        rzp.open();
      });
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || cartItems.length === 0) return;
    
    setPlacingOrder(true);
    try {
      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          order_items: cartItems as unknown as import('@/integrations/supabase/types').Json,
          total_cents: total * 100,
          shipping_address: (selectedAddress || {}) as unknown as import('@/integrations/supabase/types').Json,
          status: paymentMethod === 'online' ? 'payment_pending' : 'pending',
          payment_method: paymentMethod
        }])
        .select('id')
        .single();

      if (orderError) throw orderError;

      // If online payment, initiate Razorpay
      if (paymentMethod === 'online') {
        setProcessingPayment(true);
        const paymentSuccess = await initiateRazorpayPayment(orderData.id);
        setProcessingPayment(false);

        if (!paymentSuccess) {
          // Update order status to failed
          await supabase
            .from('orders')
            .update({ status: 'payment_failed' })
            .eq('id', orderData.id);
          
          setPlacingOrder(false);
          return;
        }
      }

      // Clear cart
      await supabase
        .from('carts')
        .update({ items: [] })
        .eq('user_id', user.id);

      // Navigate to confirmation
      navigate('/order-confirmation', {
        state: {
          orderId: orderData.id,
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
      setProcessingPayment(false);
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
                <form id="checkout-form" onSubmit={form.handleSubmit(onAddressSubmit)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" {...form.register('firstName')} className="mt-2" />
                      {form.formState.errors.firstName && (
                        <p className="text-sm text-destructive mt-1">{form.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" {...form.register('lastName')} className="mt-2" />
                      {form.formState.errors.lastName && (
                        <p className="text-sm text-destructive mt-1">{form.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" {...form.register('phone')} className="mt-2" />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-destructive mt-1">{form.formState.errors.phone.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input id="address" {...form.register('address')} className="mt-2" />
                    {form.formState.errors.address && (
                      <p className="text-sm text-destructive mt-1">{form.formState.errors.address.message}</p>
                    )}
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" {...form.register('city')} className="mt-2" />
                      {form.formState.errors.city && (
                        <p className="text-sm text-destructive mt-1">{form.formState.errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input id="state" {...form.register('state')} className="mt-2" />
                      {form.formState.errors.state && (
                        <p className="text-sm text-destructive mt-1">{form.formState.errors.state.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input id="pincode" {...form.register('pincode')} className="mt-2" placeholder="e.g. 600001" />
                      {form.formState.errors.pincode && (
                        <p className="text-sm text-destructive mt-1">{form.formState.errors.pincode.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input id="country" value="India" disabled className="mt-2" />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Continue to Payment
                  </Button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-serif font-bold mb-6">Payment Method</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div className={`flex items-center space-x-3 border rounded-lg p-4 transition-colors ${
                    paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}>
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 font-medium">
                        <CreditCard className="h-4 w-4" />
                        Online Payment
                      </div>
                      <div className="text-sm text-muted-foreground">UPI, Credit/Debit Card, Net Banking & more via Razorpay</div>
                    </Label>
                  </div>
                  
                  <div className={`flex items-center space-x-3 border rounded-lg p-4 transition-colors ${
                    paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}>
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-sm text-muted-foreground">Pay when you receive your order</div>
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
                    {selectedAddress ? (
                      <p className="text-sm text-muted-foreground">
                        {selectedAddress.firstName} {selectedAddress.lastName}<br />
                        {selectedAddress.address}<br />
                        {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}<br />
                        Phone: +91 {selectedAddress.phone}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">No address selected</p>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Payment Method</h3>
                    <p className="text-sm text-muted-foreground">
                      {paymentMethod === "online" ? "Online Payment" : "Cash on Delivery"}
                    </p>
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
                    disabled={placingOrder || processingPayment || cartItems.length === 0}
                  >
                    {(placingOrder || processingPayment) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {processingPayment ? 'Processing Payment...' : paymentMethod === 'online' ? 'Pay Now' : 'Place Order'}
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
                  <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
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
            <Button type="submit" form="checkout-form" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue
            </Button>
          )}
          {step === 2 && (
            <Button onClick={() => setStep(3)}>
              Review Order
            </Button>
          )}
          {step === 3 && (
            <Button size="lg" onClick={handlePlaceOrder} disabled={placingOrder || processingPayment || cartItems.length === 0}>
              {(placingOrder || processingPayment) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {processingPayment ? 'Processing...' : paymentMethod === 'online' ? 'Pay Now' : 'Place Order'}
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
