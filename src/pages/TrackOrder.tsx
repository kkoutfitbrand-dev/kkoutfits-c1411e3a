import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Truck, CheckCircle2, MapPin, Clock, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

interface OrderData {
  id: string;
  status: string;
  created_at: string;
  total_cents: number;
  payment_method: string;
  shipping_address: ShippingAddress;
  order_items: OrderItem[];
}

const ORDER_STATUSES = ['pending', 'paid', 'packed', 'shipped', 'delivered'];

const getStatusIndex = (status: string) => {
  const index = ORDER_STATUSES.indexOf(status);
  return index === -1 ? 0 : index;
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Order Placed',
    paid: 'Payment Confirmed',
    packed: 'Packed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };
  return labels[status] || status;
};

const getStatusDescription = (status: string) => {
  const descriptions: Record<string, string> = {
    pending: 'Your order has been placed successfully',
    paid: 'Payment has been confirmed',
    packed: 'Your order is packed and ready for shipping',
    shipped: 'Your order has been shipped and is on its way',
    delivered: 'Your order has been delivered successfully',
    cancelled: 'Your order has been cancelled'
  };
  return descriptions[status] || '';
};

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      // Search by order ID (UUID)
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId.trim())
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!data) {
        setError('Order not found. Please check your order ID and try again.');
        return;
      }

      setOrder({
        id: data.id,
        status: data.status || 'pending',
        created_at: data.created_at || new Date().toISOString(),
        total_cents: data.total_cents,
        payment_method: data.payment_method || 'cod',
        shipping_address: data.shipping_address as unknown as ShippingAddress,
        order_items: data.order_items as unknown as OrderItem[]
      });
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Unable to fetch order details. Please try again.');
      toast({ title: "Error", description: "Failed to fetch order", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedDelivery = (createdAt: string) => {
    const orderDate = new Date(createdAt);
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(estimatedDate.getDate() + 5);
    return estimatedDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const trackingSteps = [
    { status: 'pending', label: "Order Placed", icon: CheckCircle2 },
    { status: 'paid', label: "Payment Confirmed", icon: CheckCircle2 },
    { status: 'packed', label: "Packed", icon: Package },
    { status: 'shipped', label: "Shipped", icon: Truck },
    { status: 'delivered', label: "Delivered", icon: CheckCircle2 },
  ];

  const currentStatusIndex = order ? getStatusIndex(order.status) : -1;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-center">Track Your Order</h1>
        
        {!order ? (
          <div className="max-w-md mx-auto">
            <div className="bg-card border border-border rounded-lg p-6 md:p-8">
              <form onSubmit={handleTrack} className="space-y-6">
                <div>
                  <Label htmlFor="orderId">Order ID *</Label>
                  <Input
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Enter your order ID"
                    required
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    You can find your order ID in your order confirmation email or in your account orders.
                  </p>
                </div>
                
                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
                
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Track Order
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {/* Order Info */}
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h2 className="text-xl font-serif font-bold mb-2">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </h2>
                  <p className="text-muted-foreground">Placed on {formatDate(order.created_at)}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className={`px-4 py-2 font-medium rounded-full ${
                    order.status === 'delivered' 
                      ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                      : order.status === 'shipped' || order.status === 'out_for_delivery'
                      ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400'
                      : 'bg-accent/20 text-accent-foreground'
                  }`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Delivery Address</h3>
                  {order.shipping_address && (
                    <p className="text-sm text-muted-foreground">
                      {order.shipping_address.firstName} {order.shipping_address.lastName}<br />
                      {order.shipping_address.address}<br />
                      {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}<br />
                      Phone: +91 {order.shipping_address.phone}
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Order Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Total: ₹{(order.total_cents / 100).toLocaleString()}<br />
                    Payment: {order.payment_method === 'online' ? 'Online Payment' : 'Cash on Delivery'}<br />
                    Items: {order.order_items?.length || 0} item(s)<br />
                    Expected Delivery: {getEstimatedDelivery(order.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            {order.order_items && order.order_items.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-serif font-bold mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.order_items.map((item, index) => (
                    <div key={index} className="flex gap-4 items-center">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                          {item.size && ` • Size: ${item.size}`}
                          {item.color && ` • Color: ${item.color}`}
                        </p>
                      </div>
                      <p className="font-semibold">₹{item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tracking Timeline */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold mb-8">Tracking Status</h2>
              
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  {trackingSteps.map((step, index) => (
                    <div 
                      key={index} 
                      className={`text-xs font-medium ${
                        index <= currentStatusIndex ? 'text-accent' : 'text-muted-foreground'
                      }`}
                    >
                      {index === 0 ? 'Placed' : index === trackingSteps.length - 1 ? 'Delivered' : ''}
                    </div>
                  ))}
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all duration-500"
                    style={{ width: `${((currentStatusIndex + 1) / trackingSteps.length) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Timeline Steps */}
              <div className="relative">
                {trackingSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  
                  return (
                    <div key={index} className="flex gap-4 mb-8 last:mb-0">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          isCompleted 
                            ? "bg-accent text-accent-foreground" 
                            : "bg-muted text-muted-foreground"
                        } ${isCurrent ? "ring-4 ring-accent/30" : ""}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        {index < trackingSteps.length - 1 && (
                          <div className={`absolute left-6 top-12 w-0.5 h-8 ${
                            isCompleted ? "bg-accent" : "bg-border"
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className={`font-semibold mb-1 ${isCompleted ? "" : "text-muted-foreground"}`}>
                          {step.label}
                          {isCurrent && (
                            <span className="ml-2 text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isCompleted ? getStatusDescription(step.status) : 'Pending'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button variant="outline" onClick={() => setOrder(null)}>
                Track Another Order
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TrackOrder;
