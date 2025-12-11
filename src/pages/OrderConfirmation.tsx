import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, Truck, MapPin } from "lucide-react";
import { Link, useLocation, Navigate } from "react-router-dom";

interface OrderDetails {
  orderId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  paymentMethod: string;
}

const OrderConfirmation = () => {
  const location = useLocation();
  const orderDetails = location.state as OrderDetails | null;

  if (!orderDetails) {
    return <Navigate to="/" replace />;
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

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
              <p className="font-mono font-semibold text-lg">{orderDetails.orderId}</p>
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
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs text-center font-medium">Confirmed</span>
            </div>
            <div className="flex-1 h-0.5 bg-border mx-2" />
            <div className="flex flex-col items-center min-w-[80px]">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2">
                <Package className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-xs text-center text-muted-foreground">Processing</span>
            </div>
            <div className="flex-1 h-0.5 bg-border mx-2" />
            <div className="flex flex-col items-center min-w-[80px]">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2">
                <Truck className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-xs text-center text-muted-foreground">Shipped</span>
            </div>
            <div className="flex-1 h-0.5 bg-border mx-2" />
            <div className="flex flex-col items-center min-w-[80px]">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2">
                <MapPin className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-xs text-center text-muted-foreground">Delivered</span>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Items */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {(orderDetails.items || []).map(item => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ₹{item.price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
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
                  <span>₹{(orderDetails.total).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={`font-medium ${orderDetails.total > 999 ? 'text-green-600' : ''}`}>
                    {orderDetails.total > 999 ? "FREE" : "₹99"}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>₹{(orderDetails.total + (orderDetails.total > 999 ? 0 : 99)).toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Payment: {orderDetails.paymentMethod === 'cod' ? 'Cash on Delivery' : orderDetails.paymentMethod === 'upi' ? 'UPI' : 'Card'}
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
