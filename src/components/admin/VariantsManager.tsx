import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Check, Upload, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

const SIZE_TEMPLATES = {
  'shirts': ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
  'formal-shirts': ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
  'casual-shirts': ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
  'party-wear-shirts': ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
  't-shirt': ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
  'pants-and-shorts': ['28', '30', '32', '34', '36', '38', '40', '42'],
  'jeans': ['28', '30', '32', '34', '36', '38', '40', '42'],
  'kurta': ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
  'sherwani': ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
  'bandhgala': ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
  'sarees': ['Free Size'],
  'chudithar': ['S', 'M', 'L', 'XL', 'XXL'],
  'lehenga': ['S', 'M', 'L', 'XL', 'XXL'],
};

export const VariantsManager = ({ variants, basePrice, onChange, productCategory }: VariantsManagerProps) => {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState<Set<number>>(new Set());

  // Get available sizes based on category
  const availableSizes = productCategory 
    ? SIZE_TEMPLATES[productCategory.toLowerCase().replace(/\s+/g, '-') as keyof typeof SIZE_TEMPLATES] || []
    : [];

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => {
      const newSizes = prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size];
      
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
          price_cents: basePrice,
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
            price_cents: basePrice,
          });
        });
      });
    }

    onChange(combinations);
  };

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
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
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      updateVariant(index, 'image_url', publicUrl);
      
      toast({
        title: 'Image Uploaded',
        description: 'Variant image uploaded successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload variant image',
        variant: 'destructive',
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

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Select Available Sizes</h3>
            <p className="text-sm text-muted-foreground">
              Click on sizes to add them to your product
            </p>
          </div>

          {availableSizes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant={selectedSizes.includes(size) ? "default" : "outline"}
                  size="lg"
                  onClick={() => toggleSize(size)}
                  className="min-w-[60px] h-12 font-semibold transition-all"
                >
                  {selectedSizes.includes(size) && (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  {size}
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <p className="text-sm text-muted-foreground">
                Please select a category first to see available sizes
              </p>
            </div>
          )}

          {selectedSizes.length > 0 && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-muted-foreground">
                Selected: {selectedSizes.length} size{selectedSizes.length > 1 ? 's' : ''}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedSizes.map((size) => (
                  <Badge key={size} variant="secondary" className="text-sm py-1 px-3">
                    {size}
                  </Badge>
                ))}
              </div>
            </div>
          )}
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
            <Input
              placeholder="Enter color name (e.g., Red, Blue)"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addColor(newColor);
                  setNewColor('');
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                addColor(newColor);
                setNewColor('');
              }}
              disabled={!newColor.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {selectedColors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedColors.map((color) => (
                <Badge key={color} variant="default" className="gap-2 py-1 px-3">
                  {color}
                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className="hover:text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>

      {variants.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Variant Details ({variants.length})</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {variants.map((variant, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">
                      {[
                        variant.option1_value,
                        variant.option2_value,
                        variant.option3_value
                      ].filter(Boolean).join(' / ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {[
                        variant.option1_name,
                        variant.option2_name,
                        variant.option3_name
                      ].filter(Boolean).join(' / ')}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteVariant(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Color & Image Section */}
                  <div className="p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      🎨 Color & Product Image
                    </h4>
                    
                    {/* Show color if this variant has one */}
                    {variant.option1_name?.toLowerCase() === 'color' && (
                      <div className="mb-4 p-3 bg-background rounded-md border">
                        <Label className="text-xs text-muted-foreground">Color</Label>
                        <p className="font-semibold text-lg capitalize">{variant.option1_value}</p>
                      </div>
                    )}

                    {/* Image Upload */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Upload Color Image</Label>
                      {variant.image_url ? (
                        <div className="relative w-full h-48 border-2 border-primary rounded-lg overflow-hidden group">
                          <img 
                            src={variant.image_url} 
                            alt={`${variant.option1_value || 'Variant'} image`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                const input = document.getElementById(`variant-image-${index}`) as HTMLInputElement;
                                input?.click();
                              }}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Change Image
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeVariantImage(index)}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            id={`variant-image-${index}`}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleVariantImageUpload(index, file);
                            }}
                          />
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-primary/40 rounded-lg p-10 text-center hover:border-primary hover:bg-primary/5 transition-all bg-background">
                          <input
                            type="file"
                            accept="image/*"
                            id={`variant-image-${index}`}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleVariantImageUpload(index, file);
                            }}
                          />
                          <label htmlFor={`variant-image-${index}`} className="cursor-pointer block">
                            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                              <Upload className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-sm font-semibold mb-1">
                              {uploadingImages.has(index) ? 'Uploading...' : 'Click to Upload Image'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Show this color variant to customers
                            </p>
                          </label>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                        💡 <strong>Tip:</strong> Upload a clear photo showing the actual color. This helps customers make better decisions!
                      </p>
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="p-4 bg-secondary/5 rounded-lg border-2 border-secondary/20">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      💰 Pricing & Inventory
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Market Selling Price (₹)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter price (e.g., 999.00)"
                          value={variant.price_cents ? (variant.price_cents / 100).toFixed(2) : ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              updateVariant(index, 'price_cents', null);
                            } else {
                              updateVariant(index, 'price_cents', Math.round(parseFloat(value) * 100));
                            }
                          }}
                          className="text-lg font-bold"
                        />
                        <p className="text-xs text-muted-foreground">
                          💵 This is the final price customers will pay
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Available Stock</Label>
                        <Input
                          type="number"
                          placeholder="Enter quantity"
                          value={variant.inventory_count || ''}
                          onChange={(e) => updateVariant(index, 'inventory_count', parseInt(e.target.value) || 0)}
                          className="text-lg font-bold"
                        />
                        <p className="text-xs text-muted-foreground">
                          📦 Total units available for sale
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {variants.length === 0 && selectedSizes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <p className="font-medium mb-2">No sizes selected</p>
          <p className="text-sm">Click on sizes above to create variants</p>
        </div>
      )}
    </div>
  );
};
