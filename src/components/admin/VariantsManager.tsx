import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
}

interface VariantsManagerProps {
  variants: Variant[];
  basePrice: number;
  onChange: (variants: Variant[]) => void;
}

export const VariantsManager = ({ variants, basePrice, onChange }: VariantsManagerProps) => {
  const [options, setOptions] = useState<VariantOption[]>([
    { name: '', values: [] },
  ]);
  const [currentOption, setCurrentOption] = useState(0);
  const [newValue, setNewValue] = useState('');

  const addOption = () => {
    if (options.length < 3) {
      setOptions([...options, { name: '', values: [] }]);
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
              <Label>Values</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Small, Medium, Large"
                  value={currentOption === optionIndex ? newValue : ''}
                  onChange={(e) => {
                    setCurrentOption(optionIndex);
                    setNewValue(e.target.value);
                  }}
                  onKeyPress={(e) => {
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
              </Card>
            ))}
          </div>
        </div>
      )}

      {variants.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <p>Configure variant options above and click "Generate Variants"</p>
        </div>
      )}
    </div>
  );
};
