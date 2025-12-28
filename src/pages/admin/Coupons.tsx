import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Search, Ticket, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CouponForm, CouponFormData } from '@/components/admin/CouponForm';
import { format } from 'date-fns';

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
  created_at: string;
}

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons((data || []).map(c => ({
        ...c,
        discount_type: c.discount_type as 'percentage' | 'fixed'
      })));
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (formData: CouponFormData) => {
    setSaving(true);
    try {
      const couponData = {
        code: formData.code.toUpperCase().trim(),
        description: formData.description || null,
        discount_type: formData.discount_type,
        discount_value: formData.discount_value,
        minimum_order_cents: Math.round((formData.minimum_order || 0) * 100),
        maximum_discount_cents: formData.maximum_discount ? Math.round(formData.maximum_discount * 100) : null,
        usage_limit: formData.usage_limit || null,
        is_active: formData.is_active,
        valid_from: formData.valid_from || new Date().toISOString(),
        valid_until: formData.valid_until || null,
      };

      if (editingCoupon) {
        const { error } = await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', editingCoupon.id);
        if (error) throw error;
        toast.success('Coupon updated successfully');
      } else {
        const { error } = await supabase
          .from('coupons')
          .insert(couponData);
        if (error) throw error;
        toast.success('Coupon created successfully');
      }

      setIsDialogOpen(false);
      setEditingCoupon(null);
      fetchCoupons();
    } catch (error: any) {
      console.error('Error saving coupon:', error);
      if (error.code === '23505') {
        toast.error('Coupon code already exists');
      } else {
        toast.error('Failed to save coupon');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon');
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: !coupon.is_active })
        .eq('id', coupon.id);
      if (error) throw error;
      toast.success(coupon.is_active ? 'Coupon deactivated' : 'Coupon activated');
      fetchCoupons();
    } catch (error) {
      console.error('Error toggling coupon:', error);
      toast.error('Failed to update coupon');
    }
  };

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isExpired = (validUntil: string | null) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Coupons</h1>
            <p className="text-muted-foreground">Manage discount coupons</p>
          </div>
          <Button onClick={() => { setEditingCoupon(null); setIsDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Coupon
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="text-center py-12">
            <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No coupons found</h3>
            <p className="text-muted-foreground">Create your first coupon to get started</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead className="hidden sm:table-cell">Discount</TableHead>
                  <TableHead className="hidden md:table-cell">Min Order</TableHead>
                  <TableHead className="hidden lg:table-cell">Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Valid Until</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <div>
                        <span className="font-mono font-bold">{coupon.code}</span>
                        {coupon.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{coupon.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {coupon.discount_type === 'percentage'
                        ? `${coupon.discount_value}%`
                        : `₹${coupon.discount_value}`}
                      {coupon.maximum_discount_cents && coupon.discount_type === 'percentage' && (
                        <span className="text-xs text-muted-foreground block">
                          Max: ₹{coupon.maximum_discount_cents / 100}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {coupon.minimum_order_cents > 0
                        ? `₹${coupon.minimum_order_cents / 100}`
                        : '-'}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {coupon.usage_limit
                        ? `${coupon.used_count}/${coupon.usage_limit}`
                        : `${coupon.used_count}`}
                    </TableCell>
                    <TableCell>
                      {isExpired(coupon.valid_until) ? (
                        <Badge variant="secondary">Expired</Badge>
                      ) : coupon.is_active ? (
                        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {coupon.valid_until
                        ? format(new Date(coupon.valid_until), 'MMM dd, yyyy')
                        : 'No expiry'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleActive(coupon)}
                          title={coupon.is_active ? 'Deactivate' : 'Activate'}
                        >
                          <div className={`w-3 h-3 rounded-full ${coupon.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setEditingCoupon(coupon); setIsDialogOpen(true); }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(coupon.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
            </DialogHeader>
            <CouponForm
              initialData={editingCoupon ? {
                code: editingCoupon.code,
                description: editingCoupon.description || '',
                discount_type: editingCoupon.discount_type,
                discount_value: editingCoupon.discount_value,
                minimum_order: editingCoupon.minimum_order_cents / 100,
                maximum_discount: editingCoupon.maximum_discount_cents ? editingCoupon.maximum_discount_cents / 100 : undefined,
                usage_limit: editingCoupon.usage_limit || undefined,
                is_active: editingCoupon.is_active,
                valid_from: editingCoupon.valid_from,
                valid_until: editingCoupon.valid_until || undefined,
              } : undefined}
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
              saving={saving}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminCoupons;