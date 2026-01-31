import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Check, Loader2, Plus, Pencil, Trash2, CreditCard, ChevronDown, Package, X, CheckCircle, Tag, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useRazorpay } from "@/hooks/useRazorpay";
interface BuyNowItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}
interface CartItem {
  id: string;
  productId?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  is_combo?: boolean;
  combo_id?: string;
  selected_size?: string;
  combo_items?: Array<{
    color_name: string;
    quantity: number;
    image_url: string;
  }>;
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

// Expandable item component for combo products in order summary
const ComboExpandableItem = ({
  item
}: {
  item: CartItem;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  if (item.is_combo && item.combo_items && item.combo_items.length > 0) {
    return <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex gap-3">
          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium line-clamp-2">{item.name}</p>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Package className="h-3 w-3 text-primary" />
              <span className="text-xs text-primary font-medium">Combo Bundle</span>
              {item.selected_size && <span className="text-xs text-muted-foreground">• Size: {item.selected_size}</span>}
            </div>
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-1 transition-colors">
                <span>{item.combo_items.length} items</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
            </CollapsibleTrigger>
            <p className="text-sm font-semibold mt-1">₹{item.price.toLocaleString()}</p>
          </div>
        </div>
        <CollapsibleContent className="ml-[76px] mt-2 space-y-1.5 pb-2">
          {item.combo_items.map((ci, idx) => <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
              {ci.image_url ? <img src={ci.image_url} alt={ci.color_name} className="w-8 h-8 rounded object-cover" /> : <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                  <Package className="h-3 w-3" />
                </div>}
              <span>{ci.color_name}</span>
              {ci.quantity > 1 && <span className="text-muted-foreground">×{ci.quantity}</span>}
            </div>)}
        </CollapsibleContent>
      </Collapsible>;
  }

  // Regular non-combo item
  return <div className="flex gap-3">
      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
      <div className="flex-1">
        <p className="text-sm font-medium line-clamp-2">{item.name}</p>
        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
        <p className="text-sm font-semibold">₹{item.price.toLocaleString()}</p>
      </div>
    </div>;
};
const Checkout = () => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [isPreparingRazorpay, setIsPreparingRazorpay] = useState(false);
  const [preparedRazorpayOrder, setPreparedRazorpayOrder] = useState<null | {
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
  }>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for Buy Now item in location state
  const buyNowItem = (location.state as {
    buyNowItem?: BuyNowItem;
  })?.buyNowItem;
  const isBuyNowMode = !!buyNowItem;
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const {
    toast
  } = useToast();
  const {
    isLoaded: razorpayLoaded
  } = useRazorpay();
  const onAddressSubmit = async (data: AddressFormData) => {
    if (!user) return;
    try {
      if (selectedAddressId && savedAddresses.find(a => a.id === selectedAddressId)) {
        // Editing existing address
        const {
          error
        } = await supabase.from('addresses').update({
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode
        }).eq('id', selectedAddressId).eq('user_id', user.id);
        if (error) throw error;
        setSavedAddresses(prev => prev.map(addr => addr.id === selectedAddressId ? {
          ...addr,
          ...data
        } : addr));
        toast({
          title: "Address updated successfully"
        });
      } else {
        // Adding new address
        const isFirst = savedAddresses.length === 0;
        const {
          data: newAddr,
          error
        } = await supabase.from('addresses').insert({
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
        }).select().single();
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
          isDefault: newAddr.is_default
        };
        setSavedAddresses(prev => [...prev, newAddress]);
        setSelectedAddressId(newAddr.id);
        toast({
          title: "Address added successfully"
        });
      }
      setShowAddressForm(false);
      setStep(2);
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Failed to save address",
        variant: "destructive"
      });
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
      const {
        error
      } = await supabase.from('addresses').delete().eq('id', id).eq('user_id', user.id);
      if (error) throw error;
      setSavedAddresses(prev => prev.filter(addr => addr.id !== id));
      toast({
        title: "Address deleted"
      });
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: "Failed to delete address",
        variant: "destructive"
      });
    }
  };
  const handleSetDefault = async (id: string) => {
    if (!user) return;
    try {
      // First, unset all defaults
      await supabase.from('addresses').update({
        is_default: false
      }).eq('user_id', user.id);

      // Then set the new default
      const {
        error
      } = await supabase.from('addresses').update({
        is_default: true
      }).eq('id', id).eq('user_id', user.id);
      if (error) throw error;
      setSavedAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      })));
      toast({
        title: "Default address updated"
      });
    } catch (error) {
      console.error('Error setting default address:', error);
      toast({
        title: "Failed to update default address",
        variant: "destructive"
      });
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
  const {
    user
  } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(true);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Handle mobile payment redirect - check for pending order data on mount
  useEffect(() => {
    const handlePendingPayment = async () => {
      const pendingOrderData = sessionStorage.getItem('pending_order_data');
      if (!pendingOrderData || !user) return;
      try {
        const orderData = JSON.parse(pendingOrderData);

        // Check if the Razorpay order was paid by querying our verify endpoint
        // This handles the case where mobile app redirected back after payment
        const urlParams = new URLSearchParams(window.location.search);
        const razorpayPaymentId = urlParams.get('razorpay_payment_id');
        const razorpayOrderId = urlParams.get('razorpay_order_id');
        const razorpaySignature = urlParams.get('razorpay_signature');
        if (razorpayPaymentId && razorpayOrderId && razorpaySignature) {
          setProcessingPayment(true);
          const {
            data: verifyData,
            error: verifyError
          } = await supabase.functions.invoke('verify-razorpay-payment', {
            body: {
              razorpay_order_id: razorpayOrderId,
              razorpay_payment_id: razorpayPaymentId,
              razorpay_signature: razorpaySignature,
              order_data: {
                user_id: orderData.user_id,
                order_items: orderData.order_items,
                total_cents: orderData.total_cents,
                shipping_address: orderData.shipping_address
              }
            }
          });
          sessionStorage.removeItem('pending_order_data');
          setProcessingPayment(false);
          if (verifyError || !verifyData?.verified) {
            navigate('/payment-failed', {
              state: {
                error: 'Payment verification failed'
              }
            });
          } else {
            navigate('/payment-success', {
              state: {
                orderId: verifyData.orderId
              }
            });
          }

          // Clean up URL params
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (error) {
        console.error('Error handling pending payment:', error);
        sessionStorage.removeItem('pending_order_data');
      }
    };
    handlePendingPayment();
  }, [user, navigate]);
  useEffect(() => {
    // If Buy Now mode, use the buyNowItem instead of fetching cart
    if (isBuyNowMode && buyNowItem) {
      setCartItems([{
        id: buyNowItem.id,
        productId: buyNowItem.productId,
        name: buyNowItem.name,
        price: buyNowItem.price,
        image: buyNowItem.image,
        quantity: buyNowItem.quantity,
        size: buyNowItem.size,
        color: buyNowItem.color
      }]);
      setCartLoading(false);
      return;
    }
    const fetchCart = async () => {
      if (!user) return;
      try {
        const {
          data,
          error
        } = await supabase.from('carts').select('items').eq('user_id', user.id).maybeSingle();
        if (error) throw error;
        if (data?.items && Array.isArray(data.items)) {
          const items = data.items as unknown as CartItem[];

          // Get unique product IDs
          const productIds = [...new Set(items.map(item => item.productId).filter(Boolean))];
          if (productIds.length > 0) {
            // Fetch current product prices
            const {
              data: products
            } = await supabase.from('products').select('id, price_cents, variants').in('id', productIds);
            if (products) {
              // Create a map of product ID to selling price
              const priceMap = new Map<string, number>();
              products.forEach(product => {
                priceMap.set(product.id, getSellingPrice(product));
              });

              // Update cart items with current selling prices
              const updatedItems = items.map(item => ({
                ...item,
                price: item.productId && priceMap.has(item.productId) ? priceMap.get(item.productId)! : item.price
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
  }, [user, isBuyNowMode, buyNowItem]);

  // Fetch saved addresses from database
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) {
        setAddressesLoading(false);
        return;
      }
      try {
        const {
          data,
          error
        } = await supabase.from('addresses').select('*').eq('user_id', user.id).order('is_default', {
          ascending: false
        });
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
            isDefault: addr.is_default || false
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
      const {
        data,
        error
      } = await supabase.from('coupons').select('*').eq('code', couponCode.toUpperCase().trim()).eq('is_active', true).maybeSingle();
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
      toast({
        title: `Coupon "${data.code}" applied!`
      });
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
    toast({
      title: 'Coupon removed'
    });
  };
  const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId) || savedAddresses.find(addr => addr.isDefault);
  const prepareRazorpayOrder = async () => {
    if (!user || cartItems.length === 0) return null;
    if (preparedRazorpayOrder) return preparedRazorpayOrder;
    if (!razorpayLoaded || !window.Razorpay) {
      return null;
    }
    setIsPreparingRazorpay(true);
    try {
      const tempReceiptId = `temp_${Date.now()}`;
      const {
        data,
        error
      } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: total,
          currency: 'INR',
          receipt: tempReceiptId,
          notes: {
            user_id: user.id
          }
        }
      });
      if (error || !data?.orderId) {
        console.error('Error creating Razorpay order:', error || data?.error);
        throw new Error(data?.error || 'Failed to create payment order');
      }
      const prepared = {
        orderId: data.orderId as string,
        amount: data.amount as number,
        currency: data.currency as string,
        keyId: data.keyId as string
      };

      // Store order data in sessionStorage for mobile payment redirect handling
      const orderDataForSession = {
        user_id: user.id,
        order_items: cartItems,
        total_cents: Math.round(total * 100),
        shipping_address: selectedAddress || {},
        razorpay_order_id: prepared.orderId
      };
      sessionStorage.setItem('pending_order_data', JSON.stringify(orderDataForSession));
      setPreparedRazorpayOrder(prepared);
      return prepared;
    } finally {
      setIsPreparingRazorpay(false);
    }
  };

  // Pre-create Razorpay order when user reaches Review step on mobile/desktop.
  // This keeps "Pay Now" opening the checkout as a direct user gesture (better mobile compatibility).
  useEffect(() => {
    if (step !== 3) return;
    if (paymentMethod !== 'online') return;
    if (!user || cartItems.length === 0) return;
    if (!razorpayLoaded || !window.Razorpay) return;
    if (preparedRazorpayOrder) return;
    prepareRazorpayOrder().catch(err => {
      console.error('Error preparing Razorpay order:', err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, paymentMethod, user, cartItems.length, razorpayLoaded]);
  const initiateRazorpayPayment = async (): Promise<{
    success: boolean;
    orderId?: string;
  }> => {
    if (!user || cartItems.length === 0) return {
      success: false
    };
    if (!razorpayLoaded || !window.Razorpay) {
      toast({
        title: "Error",
        description: "Payment gateway is loading. Please try again.",
        variant: "destructive"
      });
      return {
        success: false
      };
    }
    try {
      const prepared = await prepareRazorpayOrder();
      if (!prepared?.orderId) {
        throw new Error('Failed to prepare payment order');
      }

      // Open Razorpay immediately after we have a prepared order
      return new Promise<{
        success: boolean;
        orderId?: string;
      }>(resolve => {
        const options = {
          key: prepared.keyId,
          amount: prepared.amount,
          currency: prepared.currency,
          name: 'KKOUTFITD',
          description: 'Order Payment',
          order_id: prepared.orderId,
          handler: async function (response: any) {
            try {
              sessionStorage.removeItem('pending_order_data');
              const {
                data: verifyData,
                error: verifyError
              } = await supabase.functions.invoke('verify-razorpay-payment', {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  order_data: {
                    user_id: user.id,
                    order_items: cartItems,
                    total_cents: Math.round(total * 100),
                    shipping_address: selectedAddress || {},
                    coupon_code: appliedCoupon?.code || null,
                    coupon_discount_cents: appliedCoupon ? Math.round(discount * 100) : 0
                  }
                }
              });
              if (verifyError || !verifyData?.verified) {
                console.error('Payment verification failed:', verifyError || verifyData?.error);
                toast({
                  title: "Payment Verification Failed",
                  description: "Please contact support if amount was deducted.",
                  variant: "destructive"
                });
                resolve({
                  success: false
                });
                return;
              }
              setPreparedRazorpayOrder(null);
              resolve({
                success: true,
                orderId: verifyData.orderId
              });
            } catch (err) {
              console.error('Error verifying payment:', err);
              resolve({
                success: false
              });
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
            ondismiss: function () {
              sessionStorage.removeItem('pending_order_data');
              setPreparedRazorpayOrder(null);
              resolve({
                success: false
              });
            }
          },
          redirect: false
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          console.error('Payment failed:', response.error);
          sessionStorage.removeItem('pending_order_data');
          setPreparedRazorpayOrder(null);
          toast({
            title: "Payment Failed",
            description: response.error.description || "Please try again.",
            variant: "destructive"
          });
          resolve({
            success: false
          });
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
      return {
        success: false
      };
    }
  };
  const handlePlaceOrder = async () => {
    if (!user || cartItems.length === 0) return;
    setPlacingOrder(true);
    try {
      // If online payment, initiate Razorpay first (order created only after successful payment)
      if (paymentMethod === 'online') {
        setProcessingPayment(true);
        const paymentResult = await initiateRazorpayPayment();
        setProcessingPayment(false);
        if (!paymentResult.success) {
          // Navigate to failure page - no order was created
          navigate('/payment-failed', {
            state: {
              error: 'Payment was cancelled or failed'
            }
          });
          setPlacingOrder(false);
          return;
        }

        // Navigate to success page for online payment
        navigate('/payment-success', {
          state: {
            orderId: paymentResult.orderId
          }
        });
        setPlacingOrder(false);
        return;
      }

      // COD: Create order directly in database
      const {
        data: orderData,
        error: orderError
      } = await supabase.from('orders').insert([{
        user_id: user.id,
        order_items: cartItems as unknown as import('@/integrations/supabase/types').Json,
        total_cents: Math.round(total * 100),
        shipping_address: (selectedAddress || {}) as unknown as import('@/integrations/supabase/types').Json,
        status: 'pending',
        payment_method: paymentMethod,
        coupon_code: appliedCoupon?.code || null,
        coupon_discount_cents: appliedCoupon ? Math.round(discount * 100) : 0
      }]).select('id').single();
      if (orderError) throw orderError;

      // Clear cart for COD orders (but not for Buy Now mode)
      if (!isBuyNowMode) {
        await supabase.from('carts').update({
          items: []
        }).eq('user_id', user.id);
      }

      // Navigate to confirmation for COD
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
  return <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20 lg:pb-0">
        <Navigation />
      
      <div className="container px-4 py-8 md:py-12">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold">
            {isBuyNowMode ? "Express Checkout" : "Checkout"}
          </h1>
          {isBuyNowMode && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-medium">
              <Zap className="h-3.5 w-3.5 fill-current" />
              ​
            </span>}
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 md:mb-12">
          <div className="flex items-center gap-2 sm:gap-4 max-w-2xl w-full">
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <div className={`w-8 h-8 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base ${step >= 1 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                {step > 1 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : "1"}
              </div>
              <span className={`text-xs sm:text-base ${step >= 1 ? "font-medium" : "text-muted-foreground"}`}>Address</span>
            </div>
            
            <div className="flex-1 h-0.5 bg-border" />
            
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <div className={`w-8 h-8 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base ${step >= 2 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                {step > 2 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : "2"}
              </div>
              <span className={`text-xs sm:text-base ${step >= 2 ? "font-medium" : "text-muted-foreground"}`}>Payment</span>
            </div>
            
            <div className="flex-1 h-0.5 bg-border" />
            
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <div className={`w-8 h-8 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base ${step >= 3 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                3
              </div>
              <span className={`text-xs sm:text-base ${step >= 3 ? "font-medium" : "text-muted-foreground"}`}>Review</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {step === 1 && <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-serif font-bold mb-6">Delivery Address</h2>
                <form id="checkout-form" onSubmit={form.handleSubmit(onAddressSubmit)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" {...form.register('firstName')} className="mt-2" />
                      {form.formState.errors.firstName && <p className="text-sm text-destructive mt-1">{form.formState.errors.firstName.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" {...form.register('lastName')} className="mt-2" />
                      {form.formState.errors.lastName && <p className="text-sm text-destructive mt-1">{form.formState.errors.lastName.message}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" {...form.register('phone')} className="mt-2" />
                    {form.formState.errors.phone && <p className="text-sm text-destructive mt-1">{form.formState.errors.phone.message}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input id="address" {...form.register('address')} className="mt-2" />
                    {form.formState.errors.address && <p className="text-sm text-destructive mt-1">{form.formState.errors.address.message}</p>}
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" {...form.register('city')} className="mt-2" />
                      {form.formState.errors.city && <p className="text-sm text-destructive mt-1">{form.formState.errors.city.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input id="state" {...form.register('state')} className="mt-2" />
                      {form.formState.errors.state && <p className="text-sm text-destructive mt-1">{form.formState.errors.state.message}</p>}
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input id="pincode" {...form.register('pincode')} className="mt-2" placeholder="e.g. 600001" />
                      {form.formState.errors.pincode && <p className="text-sm text-destructive mt-1">{form.formState.errors.pincode.message}</p>}
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
              </div>}

            {step === 2 && <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-serif font-bold mb-6">Payment Method</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div className={`flex items-center space-x-3 border rounded-lg p-4 transition-colors ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 font-medium">
                        <CreditCard className="h-4 w-4" />
                        Online Payment
                      </div>
                      <div className="text-sm text-muted-foreground">UPI, Credit/Debit Card, Net Banking & more via Razorpay</div>
                    </Label>
                  </div>
                  
                  <div className={`flex items-center space-x-3 border rounded-lg p-4 transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border'}`}>
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
              </div>}

            {step === 3 && <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-serif font-bold mb-6">Review Your Order</h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2">Delivery Address</h3>
                    {selectedAddress ? <p className="text-sm text-muted-foreground">
                        {selectedAddress.firstName} {selectedAddress.lastName}<br />
                        {selectedAddress.address}<br />
                        {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}<br />
                        Phone: +91 {selectedAddress.phone}
                      </p> : <p className="text-sm text-muted-foreground">No address selected</p>}
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
                    <Button className="flex-1" size="lg" onClick={handlePlaceOrder} disabled={placingOrder || processingPayment || cartItems.length === 0 || paymentMethod === 'online' && isPreparingRazorpay}>
                      {(placingOrder || processingPayment || isPreparingRazorpay) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {processingPayment ? 'Processing Payment...' : isPreparingRazorpay ? 'Preparing Payment...' : paymentMethod === 'online' ? 'Pay Now' : 'Place Order'}
                    </Button>
                </div>
              </div>}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-serif font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map(item => <ComboExpandableItem key={item.id} item={item} />)}
              </div>
              
              <Separator className="my-4" />
              
              {/* Coupon Code Section */}
              <div className="mb-4">
                {appliedCoupon ? <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">{appliedCoupon.code}</p>
                        <p className="text-xs text-green-600 dark:text-green-500">
                          {appliedCoupon.discount_type === 'percentage' ? `${appliedCoupon.discount_value}% off` : `₹${appliedCoupon.discount_value} off`}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100 flex-shrink-0" onClick={removeCoupon}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div> : <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input placeholder="Enter coupon code" value={couponCode} onChange={e => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError(null);
                    }} className="uppercase" />
                      <Button variant="outline" onClick={applyCoupon} disabled={couponLoading || !couponCode.trim()}>
                        {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                      </Button>
                    </div>
                    {couponError && <p className="text-xs text-destructive">{couponError}</p>}
                  </div>}
              </div>
              
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
                {discount > 0 && <div className="flex justify-between text-sm text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Discount
                    </span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>}
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
            <p className="text-sm text-muted-foreground">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
              {discount > 0 && <span className="text-green-600 ml-1">• ₹{discount} off</span>}
            </p>
            <p className="text-lg font-bold">₹{total.toLocaleString()}</p>
          </div>
          {step === 1 && <Button type="submit" form="checkout-form" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue
            </Button>}
          {step === 2 && <Button onClick={() => setStep(3)}>
              Review Order
            </Button>}
          {step === 3 && <Button size="lg" onClick={handlePlaceOrder} disabled={placingOrder || processingPayment || cartItems.length === 0 || paymentMethod === 'online' && isPreparingRazorpay}>
              {(placingOrder || processingPayment || isPreparingRazorpay) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {processingPayment ? 'Processing...' : isPreparingRazorpay ? 'Preparing...' : paymentMethod === 'online' ? 'Pay Now' : 'Place Order'}
            </Button>}
        </div>
      </div>

      <Footer />
    </div>
  </ProtectedRoute>;
};
export default Checkout;