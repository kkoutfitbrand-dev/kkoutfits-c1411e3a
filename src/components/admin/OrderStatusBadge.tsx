import { Badge } from '@/components/ui/badge';

interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const getVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'secondary';
      case 'paid':
        return 'default';
      case 'packed':
        return 'outline';
      case 'shipped':
        return 'default';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pending',
      paid: 'Paid',
      packed: 'Packed',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return labels[status?.toLowerCase()] || status;
  };

  return (
    <Badge variant={getVariant(status)} className="capitalize">
      {getLabel(status)}
    </Badge>
  );
};
