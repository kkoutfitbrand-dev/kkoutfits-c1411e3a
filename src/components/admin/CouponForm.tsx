import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';

export interface CouponFormData {
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order?: number;
  maximum_discount?: number;
  usage_limit?: number;
  is_active: boolean;
  valid_from?: string;
  valid_until?: string;
}

interface CouponFormProps {
  initialData?: CouponFormData;
  onSubmit: (data: CouponFormData) => void;
  onCancel: () => void;
  saving?: boolean;
}

export const CouponForm = ({ initialData, onSubmit, onCancel, saving }: CouponFormProps) => {
  const [formData, setFormData] = useState<CouponFormData>(initialData || {
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 10,
    minimum_order: 0,
    maximum_discount: undefined,
    usage_limit: undefined,
    is_active: true,
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) return;
    if (formData.discount_value <= 0) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">Coupon Code *</Label>
        <Input
          id="code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
          placeholder="e.g., SAVE20"
          className="font-mono uppercase"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="e.g., Get 20% off on orders above ₹999"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Discount Type *</Label>
        <RadioGroup
          value={formData.discount_type}
          onValueChange={(v) => setFormData({ ...formData, discount_type: v as 'percentage' | 'fixed' })}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="percentage" id="percentage" />
            <Label htmlFor="percentage" className="font-normal">Percentage (%)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fixed" id="fixed" />
            <Label htmlFor="fixed" className="font-normal">Fixed Amount (₹)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="discount_value">
            Discount Value *{formData.discount_type === 'percentage' ? ' (%)' : ' (₹)'}
          </Label>
          <Input
            id="discount_value"
            type="number"
            min="1"
            max={formData.discount_type === 'percentage' ? 100 : undefined}
            value={formData.discount_value}
            onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minimum_order">Minimum Order (₹)</Label>
          <Input
            id="minimum_order"
            type="number"
            min="0"
            value={formData.minimum_order || ''}
            onChange={(e) => setFormData({ ...formData, minimum_order: Number(e.target.value) || 0 })}
            placeholder="0"
          />
        </div>
      </div>

      {formData.discount_type === 'percentage' && (
        <div className="space-y-2">
          <Label htmlFor="maximum_discount">Maximum Discount (₹)</Label>
          <Input
            id="maximum_discount"
            type="number"
            min="0"
            value={formData.maximum_discount || ''}
            onChange={(e) => setFormData({ ...formData, maximum_discount: Number(e.target.value) || undefined })}
            placeholder="No limit"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="usage_limit">Usage Limit</Label>
        <Input
          id="usage_limit"
          type="number"
          min="1"
          value={formData.usage_limit || ''}
          onChange={(e) => setFormData({ ...formData, usage_limit: Number(e.target.value) || undefined })}
          placeholder="Unlimited"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="valid_from">Valid From</Label>
          <Input
            id="valid_from"
            type="date"
            value={formData.valid_from?.split('T')[0] || ''}
            onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="valid_until">Valid Until</Label>
          <Input
            id="valid_until"
            type="date"
            value={formData.valid_until?.split('T')[0] || ''}
            onChange={(e) => setFormData({ ...formData, valid_until: e.target.value || undefined })}
          />
        </div>
      </div>

      <div className="flex items-center justify-between py-2">
        <Label htmlFor="is_active">Active</Label>
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {initialData ? 'Update Coupon' : 'Create Coupon'}
        </Button>
      </div>
    </form>
  );
};