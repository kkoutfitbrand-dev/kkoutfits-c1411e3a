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
  const [options, setOptions] = useState<VariantOption[]>([
    { name: '', values: [] },
  ]);
  const [currentOption, setCurrentOption] = useState(0);
  const [newValue, setNewValue] = useState('');
  const [uploadingImages, setUploadingImages] = useState<Set<number>>(new Set());

  const addOption = () => {
    if (options.length < 3) {
      setOptions([...options, { name: '', values: [] }]);
    }
  };

  const applySizeTemplate = (optionIndex: number) => {
    if (!productCategory) return;
    
    const categoryKey = productCategory.toLowerCase().replace(/\s+/g, '-');
    const sizes = SIZE_TEMPLATES[categoryKey as keyof typeof SIZE_TEMPLATES];
    
    if (sizes) {
      const newOptions = [...options];
      newOptions[optionIndex].values = sizes;
      setOptions(newOptions);
      toast({
        title: 'Size Template Applied',
        description: `Added ${sizes.length} sizes for ${productCategory}`,
      });
    }
  };

  const updateOptionName = (index: number, name: string) => {
    const newOptions = [...options];
    newOptions[index].name = name;
    setOptions(newOptions);
  };

  const addValue = (optionIndex: number) => {
    if (!newValue.trim()) return;
    
    const newOptions = [...options];
    newOptions[optionIndex].values.push(newValue.trim());
    setOptions(newOptions);
    setNewValue('');
  };

  const removeValue = (optionIndex: number, valueIndex: number) => {
    const newOptions = [...options];
    newOptions[optionIndex].values.splice(valueIndex, 1);
    setOptions(newOptions);
  };

  const generateVariants = () => {
    const filledOptions = options.filter(opt => opt.name && opt.values.length > 0);
    
    if (filledOptions.length === 0) return;

    const combinations: Variant[] = [];
    
    const generate = (current: Partial<Variant>, depth: number) => {
      if (depth === filledOptions.length) {
        combinations.push({
          ...current,
          inventory_count: 0,
          is_available: true,
          price_cents: basePrice,
        } as Variant);
        return;
      }

      const option = filledOptions[depth];
      option.values.forEach(value => {
        const optionKey = `option${depth + 1}` as 'option1' | 'option2' | 'option3';
        generate({
          ...current,
          [`${optionKey}_name`]: option.name,
          [`${optionKey}_value`]: value,
        }, depth + 1);
      });
    };

    generate({}, 0);
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

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Variant Options</h3>
          {options.length < 3 && (
            <Button type="button" variant="outline" size="sm" onClick={addOption}>
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          )}
        </div>

        {options.map((option, optionIndex) => (
          <Card key={optionIndex} className="p-4 space-y-3">
            <div className="space-y-2">
              <Label>Option Name (e.g., Size, Color)</Label>
              <Input
                placeholder="Size"
                value={option.name}
                onChange={(e) => updateOptionName(optionIndex, e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Values</Label>
                {option.name.toLowerCase() === 'size' && productCategory && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => applySizeTemplate(optionIndex)}
                  >
                    Use {productCategory} sizes
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Small, Medium, Large"
                  value={currentOption === optionIndex ? newValue : ''}
                  onChange={(e) => {
                    setCurrentOption(optionIndex);
                    setNewValue(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addValue(optionIndex);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => addValue(optionIndex)}
                  disabled={!newValue.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {option.values.length === 0 
                  ? 'Add at least one value to enable variant generation'
                  : `${option.values.length} value${option.values.length > 1 ? 's' : ''} added`
                }
              </p>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {option.values.map((value, valueIndex) => (
                  <Badge key={valueIndex} variant="secondary" className="gap-2">
                    {value}
                    <button
                      type="button"
                      onClick={() => removeValue(optionIndex, valueIndex)}
                      className="hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}

        <Button
          type="button"
          onClick={generateVariants}
          disabled={!options.some(opt => opt.name && opt.values.length > 0)}
          className="w-full"
        >
          <Check className="h-4 w-4 mr-2" />
          Generate Variants
        </Button>
      </div>

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

                <div className="space-y-3">
                  {/* Variant Image Upload for Color variants */}
                  {variant.option1_name?.toLowerCase().includes('color') || 
                   variant.option2_name?.toLowerCase().includes('color') || 
                   variant.option3_name?.toLowerCase().includes('color') ? (
                    <div className="space-y-2">
                      <Label className="text-xs">Color Image</Label>
                      {variant.image_url ? (
                        <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                          <img 
                            src={variant.image_url} 
                            alt="Variant" 
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => removeVariantImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed rounded-lg p-4 text-center">
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
                          <label htmlFor={`variant-image-${index}`} className="cursor-pointer">
                            <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                              {uploadingImages.has(index) ? 'Uploading...' : 'Upload color image'}
                            </p>
                          </label>
                        </div>
                      )}
                    </div>
                  ) : null}

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">SKU</Label>
                      <Input
                        placeholder="SKU"
                        value={variant.sku || ''}
                        onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Price (₹)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={variant.price_cents ? variant.price_cents / 100 : basePrice / 100}
                        onChange={(e) => updateVariant(index, 'price_cents', Math.round(parseFloat(e.target.value) * 100))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Stock</Label>
                      <Input
                        type="number"
                        value={variant.inventory_count}
                        onChange={(e) => updateVariant(index, 'inventory_count', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {variants.length === 0 && options.some(opt => opt.name && opt.values.length > 0) && (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <p className="font-medium mb-2">Ready to generate variants!</p>
          <p className="text-sm">Click "Generate Variants" above to create all combinations</p>
        </div>
      )}
      
      {variants.length === 0 && !options.some(opt => opt.name && opt.values.length > 0) && (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <p className="font-medium mb-2">No variants configured yet</p>
          <p className="text-sm">Add option names and values above, then click "Generate Variants"</p>
        </div>
      )}
    </div>
  );
};
