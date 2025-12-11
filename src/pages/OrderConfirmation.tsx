import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, Truck, MapPin, Loader2 } from "lucide-react";
import { Link, useLocation, useSearchParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface OrderItem {
  id: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

interface OrderDetails {
  orderId: string;
  items: OrderItem[];
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  status?: string;
  createdAt?: string;
}

const OrderConfirmation = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const stateOrderDetails = location.state as OrderDetails | null;
  const orderIdFromUrl = searchParams.get('orderId');
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(stateOrderDetails);
  const [loading, setLoading] = useState(!stateOrderDetails && !!orderIdFromUrl);
  const [error, setError] = useState<string | null>(null);

  // Fetch order from database if not passed via state
  useEffect(() => {
    const fetchOrder = async () => {
      if (stateOrderDetails || !orderIdFromUrl || !user) return;
      
      setLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderIdFromUrl)
          .eq('user_id', user.id)
          .maybeSingle();

        if (fetchError) throw fetchError;
        
        if (data) {
          const items = (data.order_items as unknown as OrderItem[]) || [];
          const address = (data.shipping_address as unknown as ShippingAddress) || {
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            phone: ''
          };
          
          setOrderDetails({
            orderId: data.id,
            items,
            total: data.total_cents / 100,
            shippingAddress: address,
            paymentMethod: (data as any).payment_method || 'cod',
            status: data.status || 'pending',
            createdAt: data.created_at || undefined
          });
        } else {
          setError('Order not found');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderIdFromUrl, user, stateOrderDetails]);

  // Redirect if no order details and no order ID to fetch
  if (!loading && !orderDetails && !orderIdFromUrl) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container px-4 py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'The order you are looking for does not exist.'}</p>
          <Button asChild>
            <Link to="/">Go to Home</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  const items = orderDetails.items || [];
  const subtotal = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const finalTotal = subtotal + shipping;

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cod': return 'Cash on Delivery';
      case 'upi': return 'UPI Payment';
      case 'card': return 'Credit/Debit Card';
      default: return method;
    }
  };

  const getStatusStep = (status?: string) => {
    switch (status) {
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 1; // pending/confirmed
    }
  };

  const currentStep = getStatusStep(orderDetails.status);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 py-8 md:py-12">
        {/* Success Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-100 mb-4">
            <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
          </div>
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">Thank you for your order. We've received your order and will begin processing it soon.</p>
        </div>

        {/* Order Details Card */}
        <Card className="max-w-3xl mx-auto p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="font-mono font-semibold text-lg break-all">{orderDetails.orderId}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-muted-foreground">Estimated Delivery</p>
              <p className="font-semibold">{estimatedDelivery.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Order Timeline */}
          <div className="flex items-center justify-between mb-8 overflow-x-auto">
            <div className="flex flex-col items-center min-w-[80px]">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep >= 1 ? 'bg-green-100' : 'bg-muted'}`}>
                <CheckCircle className={`w-5 h-5 ${currentStep >= 1 ? 'text-green-600' : 'text-muted-foreground'}`} />
              </div>
              <span className={`text-xs text-center ${currentStep >= 1 ? 'font-medium' : 'text-muted-foreground'}`}>Confirmed</span>
            </div>
            <div className={`flex-1 h-0.5 mx-2 ${currentStep >= 2 ? 'bg-green-500' : 'bg-border'}`} />
            <div className="flex flex-col items-center min-w-[80px]">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep >= 2 ? 'bg-green-100' : 'bg-muted'}`}>
                <Package className={`w-5 h-5 ${currentStep >= 2 ? 'text-green-600' : 'text-muted-foreground'}`} />
              </div>
              <span className={`text-xs text-center ${currentStep >= 2 ? 'font-medium' : 'text-muted-foreground'}`}>Processing</span>
            </div>
            <div className={`flex-1 h-0.5 mx-2 ${currentStep >= 3 ? 'bg-green-500' : 'bg-border'}`} />
            <div className="flex flex-col items-center min-w-[80px]">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep >= 3 ? 'bg-green-100' : 'bg-muted'}`}>
                <Truck className={`w-5 h-5 ${currentStep >= 3 ? 'text-green-600' : 'text-muted-foreground'}`} />
              </div>
              <span className={`text-xs text-center ${currentStep >= 3 ? 'font-medium' : 'text-muted-foreground'}`}>Shipped</span>
            </div>
            <div className={`flex-1 h-0.5 mx-2 ${currentStep >= 4 ? 'bg-green-500' : 'bg-border'}`} />
            <div className="flex flex-col items-center min-w-[80px]">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep >= 4 ? 'bg-green-100' : 'bg-muted'}`}>
                <MapPin className={`w-5 h-5 ${currentStep >= 4 ? 'text-green-600' : 'text-muted-foreground'}`} />
              </div>
              <span className={`text-xs text-center ${currentStep >= 4 ? 'font-medium' : 'text-muted-foreground'}`}>Delivered</span>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Items */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Order Items ({items.length})</h3>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id || index} className="flex gap-4">
                  <img 
                    src={item.image || '/placeholder.svg'} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded bg-muted"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-1">{item.name}</p>
                    {(item.size || item.color) && (
                      <p className="text-xs text-muted-foreground">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && ' | '}
                        {item.color && `Color: ${item.color}`}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      ₹{(item.price || 0).toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold whitespace-nowrap">₹{((item.price || 0) * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p className="text-sm text-muted-foreground">
                {orderDetails.shippingAddress?.firstName} {orderDetails.shippingAddress?.lastName}<br />
                {orderDetails.shippingAddress?.address}<br />
                {orderDetails.shippingAddress?.city}, {orderDetails.shippingAddress?.state} - {orderDetails.shippingAddress?.pincode}<br />
                Phone: {orderDetails.shippingAddress?.phone}
              </p>
            </div>

            {/* Payment Summary */}
            <div>
              <h3 className="font-semibold mb-2">Payment Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Payment: {getPaymentMethodLabel(orderDetails.paymentMethod)}
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Button asChild variant="outline" className="flex-1">
            <Link to="/track-order">Track Order</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
