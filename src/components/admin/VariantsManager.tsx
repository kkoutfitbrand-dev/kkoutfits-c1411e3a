import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Check, Upload, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
interface VariantOption {
  name: string;
  values: string[];
}
interface Variant {
  id?: string;
  option1_name?: string;
  option1_value?: string;
  option2_name?: string;
  option2_value?: string;
  option3_name?: string;
  option3_value?: string;
  sku?: string;
  price_cents?: number;
  inventory_count: number;
  is_available: boolean;
  image_url?: string;
  imageFile?: File;
}
interface VariantsManagerProps {
  variants: Variant[];
  basePrice: number;
  onChange: (variants: Variant[]) => void;
  productCategory?: string;
}
const SIZE_TYPE_OPTIONS = {
  'shirt': {
    label: 'Shirt / Top Sizes',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
  },
  'pant': {
    label: 'Pant / Bottom Sizes',
    sizes: ['28', '30', '32', '34', '36', '38', '40', '42']
  },
  'free': {
    label: 'Free Size',
    sizes: ['Free Size']
  }
};
export const VariantsManager = ({
  variants,
  basePrice,
  onChange,
  productCategory
}: VariantsManagerProps) => {
  const [sizeType, setSizeType] = useState<keyof typeof SIZE_TYPE_OPTIONS | ''>('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState<Set<number>>(new Set());

  // Get available sizes based on selected size type
  const availableSizes = sizeType ? SIZE_TYPE_OPTIONS[sizeType].sizes : [];
  const toggleSize = (size: string) => {
    setSelectedSizes(prev => {
      const newSizes = prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size];

      // Auto-generate variants when sizes change
      generateVariants(newSizes, selectedColors);
      return newSizes;
    });
  };
  const addColor = (color: string) => {
    if (!color.trim() || selectedColors.includes(color.trim())) return;
    const newColors = [...selectedColors, color.trim()];
    setSelectedColors(newColors);
    generateVariants(selectedSizes, newColors);
  };
  const removeColor = (color: string) => {
    const newColors = selectedColors.filter(c => c !== color);
    setSelectedColors(newColors);
    generateVariants(selectedSizes, newColors);
  };
  const generateVariants = (sizes: string[], colors: string[]) => {
    if (sizes.length === 0) {
      onChange([]);
      return;
    }
    const combinations: Variant[] = [];
    if (colors.length === 0) {
      // Size only variants
      sizes.forEach(size => {
        combinations.push({
          option1_name: 'Size',
          option1_value: size,
          inventory_count: 0,
          is_available: true,
          price_cents: basePrice
        });
      });
    } else {
      // Size + Color variants
      colors.forEach(color => {
        sizes.forEach(size => {
          combinations.push({
            option1_name: 'Color',
            option1_value: color,
            option2_name: 'Size',
            option2_value: size,
            inventory_count: 0,
            is_available: true,
            price_cents: basePrice
          });
        });
      });
    }
    onChange(combinations);
  };
  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = {
      ...newVariants[index],
      [field]: value
    };
    onChange(newVariants);
  };
  const deleteVariant = (index: number) => {
    onChange(variants.filter((_, i) => i !== index));
  };
  const handleVariantImageUpload = async (index: number, file: File) => {
    setUploadingImages(prev => new Set(prev).add(index));
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `variant-${Date.now()}-${Math.random()}.${fileExt}`;
      const {
        error: uploadError
      } = await supabase.storage.from('product-images').upload(fileName, file);
      if (uploadError) throw uploadError;
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('product-images').getPublicUrl(fileName);
      updateVariant(index, 'image_url', publicUrl);
      toast({
        title: 'Image Uploaded',
        description: 'Variant image uploaded successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload variant image',
        variant: 'destructive'
      });
    } finally {
      setUploadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };
  const removeVariantImage = (index: number) => {
    updateVariant(index, 'image_url', undefined);
  };
  const [newColor, setNewColor] = useState('');
  return <div className="space-y-6">
      {/* Size Type Selection */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Select Size Type</h3>
            <p className="text-sm text-muted-foreground">
              Choose the size format for your product
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {Object.entries(SIZE_TYPE_OPTIONS).map(([key, {
            label
          }]) => <Button key={key} type="button" variant={sizeType === key ? "default" : "outline"} onClick={() => {
            setSizeType(key as keyof typeof SIZE_TYPE_OPTIONS);
            setSelectedSizes([]);
            onChange([]);
          }} className="min-w-[140px]">
                {label}
              </Button>)}
          </div>
        </div>
      </Card>

      {/* Size Selection */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Select Available Sizes</h3>
            <p className="text-sm text-muted-foreground">
              Click on sizes to add them to your product
            </p>
          </div>

          {availableSizes.length > 0 ? <div className="flex flex-wrap gap-2">
              {availableSizes.map(size => <Button key={size} type="button" variant={selectedSizes.includes(size) ? "default" : "outline"} size="lg" onClick={() => toggleSize(size)} className="min-w-[60px] h-12 font-semibold transition-all">
                  {selectedSizes.includes(size) && <Check className="h-4 w-4 mr-2" />}
                  {size}
                </Button>)}
            </div> : <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <p className="text-sm text-muted-foreground">
                Please select a size type above to see available sizes
              </p>
            </div>}

          {selectedSizes.length > 0 && <div className="pt-4 border-t">
              <p className="text-sm font-medium text-muted-foreground">
                Selected: {selectedSizes.length} size{selectedSizes.length > 1 ? 's' : ''}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedSizes.map(size => <Badge key={size} variant="secondary" className="text-sm py-1 px-3">
                    {size}
                  </Badge>)}
              </div>
            </div>}
        </div>
      </Card>

      {/* Color Selection (Optional) */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Colors (Optional)</h3>
            <p className="text-sm text-muted-foreground">
              Add colors if your product comes in different colors
            </p>
          </div>

          <div className="flex gap-2">
            <Input placeholder="Enter color name (e.g., Red, Blue)" value={newColor} onChange={e => setNewColor(e.target.value)} onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addColor(newColor);
              setNewColor('');
            }
          }} />
            <Button type="button" variant="secondary" onClick={() => {
            addColor(newColor);
            setNewColor('');
          }} disabled={!newColor.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {selectedColors.length > 0 && <div className="flex flex-wrap gap-2">
              {selectedColors.map(color => <Badge key={color} variant="default" className="gap-2 py-1 px-3">
                  {color}
                  <button type="button" onClick={() => removeColor(color)} className="hover:text-destructive-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>)}
            </div>}
        </div>
      </Card>

      {variants.length > 0 && <div className="space-y-3">
          <h3 className="text-lg font-semibold">Variant Details ({variants.length})</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {variants.map((variant, index) => <Card key={index} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">
                      {[variant.option1_value, variant.option2_value, variant.option3_value].filter(Boolean).join(' / ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {[variant.option1_name, variant.option2_name, variant.option3_name].filter(Boolean).join(' / ')}
                    </p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => deleteVariant(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {/* Variant Image Upload for Color variants */}
                  {variant.option1_name?.toLowerCase().includes('color') || variant.option2_name?.toLowerCase().includes('color') || variant.option3_name?.toLowerCase().includes('color') ? <div className="space-y-2">
                      <Label className="text-xs">Color Image</Label>
                      {variant.image_url ? <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                          <img src={variant.image_url} alt="Variant" className="w-full h-full object-cover" />
                          <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => removeVariantImage(index)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div> : <div className="border-2 border-dashed rounded-lg p-4 text-center">
                          <input type="file" accept="image/*" id={`variant-image-${index}`} className="hidden" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleVariantImageUpload(index, file);
                }} />
                          <label htmlFor={`variant-image-${index}`} className="cursor-pointer">
                            <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                              {uploadingImages.has(index) ? 'Uploading...' : 'Upload color image'}
                            </p>
                          </label>
                        </div>}
                    </div> : null}

                  <div className="grid grid-cols-3 gap-3">
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Price (₹)</Label>
                      <Input type="number" step="0.01" value={variant.price_cents ? variant.price_cents / 100 : basePrice / 100} onChange={e => updateVariant(index, 'price_cents', Math.round(parseFloat(e.target.value) * 100))} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Stock</Label>
                      <Input type="number" value={variant.inventory_count} onChange={e => updateVariant(index, 'inventory_count', parseInt(e.target.value) || 0)} />
                    </div>
                  </div>
                </div>
              </Card>)}
          </div>
        </div>}

      {variants.length === 0 && selectedSizes.length === 0 && <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <p className="font-medium mb-2">No sizes selected</p>
          <p className="text-sm">Click on sizes above to create variants</p>
        </div>}
    </div>;
};