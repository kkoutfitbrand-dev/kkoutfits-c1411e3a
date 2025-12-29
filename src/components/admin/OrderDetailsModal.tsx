import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Separator } from '@/components/ui/separator';
import { Package, MapPin, User, Calendar } from 'lucide-react';

interface OrderItem {
  product_id?: string;
  title: string;
  price_cents: number;
  quantity: number;
  image?: string;
  size?: string;
  is_combo?: boolean;
  selected_size?: string;
  combo_items?: Array<{
    color_name: string;
    quantity: number;
    image_url: string;
  }>;
}

interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_cents: number;
  order_items: OrderItem[];
  shipping_address: ShippingAddress;
  profiles?: {
    name: string;
  };
}

interface OrderDetailsModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrderDetailsModal = ({ order, open, onOpenChange }: OrderDetailsModalProps) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Order ID: {order.id.slice(0, 8)}...
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Order Date
              </div>
              <p className="font-medium">
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Status</div>
              <OrderStatusBadge status={order.status} />
            </div>
          </div>

          <Separator />

          {/* Customer Details */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Customer Information</h3>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="font-medium">{order.profiles?.name || order.shipping_address?.name || 'Unknown Customer'}</p>
              {order.shipping_address?.phone && (
                <p className="text-sm text-muted-foreground">Phone: {order.shipping_address.phone}</p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Shipping Address</h3>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 space-y-1">
              <p className="font-medium">{order.shipping_address.name}</p>
              <p className="text-sm">{order.shipping_address.address}</p>
              <p className="text-sm">
                {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
              </p>
              <p className="text-sm">Phone: {order.shipping_address.phone}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Order Items</h3>
            </div>
            <div className="space-y-3">
              {order.order_items.map((item, index) => (
                <div
                  key={index}
                  className="bg-muted/50 rounded-lg p-4"
                >
                  <div className="flex items-center gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <div className="text-sm text-muted-foreground space-y-0.5">
                        {item.is_combo && (
                          <div className="flex items-center gap-1">
                            <Package className="h-3 w-3 text-primary" />
                            <span className="text-primary font-medium">Combo Bundle</span>
                            {item.selected_size && (
                              <span>• Size: {item.selected_size}</span>
                            )}
                          </div>
                        )}
                        {!item.is_combo && item.size && <span>Size: {item.size} • </span>}
                        <span>Quantity: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₹{(item.price_cents / 100).toLocaleString('en-IN')}
                      </p>
                      <p className="text-sm text-muted-foreground">each</p>
                    </div>
                  </div>
                  
                  {/* Show combo items */}
                  {item.is_combo && item.combo_items && item.combo_items.length > 0 && (
                    <div className="mt-3 ml-20 space-y-2 border-l-2 border-primary/20 pl-3">
                      <p className="text-xs font-medium text-muted-foreground">Combo Items:</p>
                      {item.combo_items.map((ci, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          {ci.image_url ? (
                            <img src={ci.image_url} alt={ci.color_name} className="w-8 h-8 rounded object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                              <Package className="h-3 w-3" />
                            </div>
                          )}
                          <span>{ci.color_name}</span>
                          {ci.quantity > 1 && <span className="text-muted-foreground">×{ci.quantity}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Total */}
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total Amount</span>
            <span>₹{(order.total_cents / 100).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
