import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Upload, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ComboItem {
  id?: string;
  color_name: string;
  image_url: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
}

interface ComboFormProps {
  combo?: {
    id: string;
    name: string;
    description: string | null;
    images: string[];
    original_price_cents: number;
    combo_price_cents: number;
    discount_percentage: number;
    status: string;
    min_quantity: number;
    size_type?: string;
    available_sizes?: string[];
  } | null;
  onClose: () => void;
}

const SIZE_TYPE_OPTIONS = {
  shirt: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  pant: ['28', '30', '32', '34', '36', '38', '40', '42', '44'],
  free: ['Free Size'],
};

export const ComboForm = ({ combo, onClose }: ComboFormProps) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState(combo?.name || '');
  const [description, setDescription] = useState(combo?.description || '');
  const [images, setImages] = useState<string[]>(combo?.images || []);
  const [originalPrice, setOriginalPrice] = useState(combo ? (combo.original_price_cents / 100).toString() : '');
  const [comboPrice, setComboPrice] = useState(combo ? (combo.combo_price_cents / 100).toString() : '');
  const [status, setStatus] = useState(combo?.status || 'draft');
  const [minQuantity, setMinQuantity] = useState(combo?.min_quantity?.toString() || '1');
  const [colorItems, setColorItems] = useState<ComboItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [sizeType, setSizeType] = useState<'shirt' | 'pant' | 'free'>(
    (combo?.size_type as 'shirt' | 'pant' | 'free') || 'free'
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(combo?.available_sizes || []);

  useEffect(() => {
    fetchCategories();
    if (combo?.id) {
      fetchComboItems();
      fetchComboCategories();
    }
  }, [combo?.id]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchComboCategories = async () => {
    if (!combo?.id) return;
    try {
      const { data, error } = await supabase
        .from('combo_products')
        .select('category, subcategories')
        .eq('id', combo.id)
        .single();

      if (error) throw error;
      if (data) {
        setSelectedCategory(data.category || '');
        setSelectedSubcategories((data.subcategories as string[]) || []);
      }
    } catch (error) {
      console.error('Error fetching combo categories:', error);
    }
  };

  const fetchComboItems = async () => {
    if (!combo?.id) return;
    try {
      const { data, error } = await supabase
        .from('combo_product_items')
        .select('*')
        .eq('combo_id', combo.id);

      if (error) throw error;
      setColorItems(data || []);
    } catch (error) {
      console.error('Error fetching combo items:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `combo-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(urlData.publicUrl);
      }
      setImages([...images, ...uploadedUrls]);
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleColorImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `combo-color-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      const updated = [...colorItems];
      updated[index].image_url = urlData.publicUrl;
      setColorItems(updated);
    } catch (error) {
      console.error('Error uploading color image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addColorItem = () => {
    setColorItems([...colorItems, { color_name: '', image_url: '' }]);
  };

  const updateColorItem = (index: number, field: keyof ComboItem, value: string) => {
    const updated = [...colorItems];
    updated[index] = { ...updated[index], [field]: value };
    setColorItems(updated);
  };

  const removeColorItem = (index: number) => {
    setColorItems(colorItems.filter((_, i) => i !== index));
  };

  const calculateDiscount = () => {
    const orig = parseFloat(originalPrice) || 0;
    const combo = parseFloat(comboPrice) || 0;
    if (orig > 0 && combo > 0 && combo < orig) {
      return Math.round(((orig - combo) / orig) * 100);
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !originalPrice || !comboPrice) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate color items have names
    const emptyColorNames = colorItems.filter(item => !item.color_name.trim());
    if (emptyColorNames.length > 0) {
      toast.error('Please enter a name for all color variants');
      return;
    }

    setLoading(true);
    try {
      const comboData = {
        name,
        description,
        images,
        original_price_cents: Math.round(parseFloat(originalPrice) * 100),
        combo_price_cents: Math.round(parseFloat(comboPrice) * 100),
        discount_percentage: calculateDiscount(),
        status,
        min_quantity: parseInt(minQuantity) || 1,
        category: selectedCategory || null,
        subcategories: selectedSubcategories,
        size_type: sizeType,
        available_sizes: sizeType === 'free' ? ['Free Size'] : selectedSizes,
      };

      if (combo?.id) {
        // Update existing combo
        const { error } = await supabase
          .from('combo_products')
          .update(comboData)
          .eq('id', combo.id);

        if (error) throw error;

        // Delete existing items and re-insert
        await supabase.from('combo_product_items').delete().eq('combo_id', combo.id);
        
        if (colorItems.length > 0) {
          const itemsToInsert = colorItems.map(item => ({
            combo_id: combo.id,
            color_name: item.color_name,
            image_url: item.image_url,
          }));
          const { error: itemsError } = await supabase
            .from('combo_product_items')
            .insert(itemsToInsert);
          if (itemsError) throw itemsError;
        }

        toast.success('Combo updated successfully');
      } else {
        // Create new combo
        const { data: newCombo, error } = await supabase
          .from('combo_products')
          .insert(comboData)
          .select()
          .single();

        if (error) throw error;

        if (colorItems.length > 0 && newCombo) {
          const itemsToInsert = colorItems.map(item => ({
            combo_id: newCombo.id,
            color_name: item.color_name,
            image_url: item.image_url,
          }));
          const { error: itemsError } = await supabase
            .from('combo_product_items')
            .insert(itemsToInsert);
          if (itemsError) throw itemsError;
        }

        toast.success('Combo created successfully');
      }

      onClose();
    } catch (error) {
      console.error('Error saving combo:', error);
      toast.error('Failed to save combo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{combo ? 'Edit Combo' : 'Create Combo Offer'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Combo Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Premium Shirt Combo Pack"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the combo offer..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Main Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select main category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => !c.parent_id).map(cat => (
                      <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedCategory && (
                <div>
                  <Label>Subcategories (Multi-select)</Label>
                  <div className="mt-2 border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                    {categories.filter(c => {
                      const parent = categories.find(p => p.slug === selectedCategory);
                      return c.parent_id === parent?.id;
                    }).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No subcategories available</p>
                    ) : (
                      categories.filter(c => {
                        const parent = categories.find(p => p.slug === selectedCategory);
                        return c.parent_id === parent?.id;
                      }).map(subcat => (
                        <div key={subcat.id} className="flex items-center gap-2">
                          <Checkbox
                            id={subcat.id}
                            checked={selectedSubcategories.includes(subcat.slug)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedSubcategories([...selectedSubcategories, subcat.slug]);
                              } else {
                                setSelectedSubcategories(selectedSubcategories.filter(s => s !== subcat.slug));
                              }
                            }}
                          />
                          <Label htmlFor={subcat.id} className="cursor-pointer font-normal">{subcat.name}</Label>
                        </div>
                      ))
                    )}
                  </div>
                  {selectedSubcategories.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {selectedSubcategories.map(slug => {
                        const cat = categories.find(c => c.slug === slug);
                        return cat ? (
                          <span key={slug} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                            {cat.name}
                            <button type="button" onClick={() => setSelectedSubcategories(selectedSubcategories.filter(s => s !== slug))}>
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Size Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Size Type</CardTitle>
              <p className="text-sm text-muted-foreground">Choose the size format for your product</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={sizeType === 'shirt' ? 'default' : 'outline'}
                  onClick={() => {
                    setSizeType('shirt');
                    setSelectedSizes([]);
                  }}
                >
                  Shirt / Top Sizes
                </Button>
                <Button
                  type="button"
                  variant={sizeType === 'pant' ? 'default' : 'outline'}
                  onClick={() => {
                    setSizeType('pant');
                    setSelectedSizes([]);
                  }}
                >
                  Pant / Bottom Sizes
                </Button>
                <Button
                  type="button"
                  variant={sizeType === 'free' ? 'default' : 'outline'}
                  onClick={() => {
                    setSizeType('free');
                    setSelectedSizes(['Free Size']);
                  }}
                >
                  Free Size
                </Button>
              </div>

              {sizeType !== 'free' && (
                <div className="space-y-2">
                  <Label>Available Sizes</Label>
                  <div className="flex flex-wrap gap-2">
                    {SIZE_TYPE_OPTIONS[sizeType].map((size) => (
                      <Button
                        key={size}
                        type="button"
                        variant={selectedSizes.includes(size) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          if (selectedSizes.includes(size)) {
                            setSelectedSizes(selectedSizes.filter(s => s !== size));
                          } else {
                            setSelectedSizes([...selectedSizes, size]);
                          }
                        }}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                  {selectedSizes.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedSizes.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="originalPrice">Original Price (₹) *</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="e.g., 2999"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="comboPrice">Combo Price (₹) *</Label>
                <Input
                  id="comboPrice"
                  type="number"
                  value={comboPrice}
                  onChange={(e) => setComboPrice(e.target.value)}
                  placeholder="e.g., 1999"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              {calculateDiscount() > 0 && (
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                    Discount: {calculateDiscount()}% OFF 
                    <span className="ml-2 text-muted-foreground">
                      (Save ₹{(parseFloat(originalPrice) - parseFloat(comboPrice)).toFixed(2)})
                    </span>
                  </p>
                </div>
              )}
              <div className="pt-4 border-t">
                <Label htmlFor="minQuantity">Minimum Quantity Required *</Label>
                <Input
                  id="minQuantity"
                  type="number"
                  value={minQuantity}
                  onChange={(e) => setMinQuantity(e.target.value)}
                  placeholder="e.g., 3 for 3-shirt combo"
                  min="1"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Customer must select exactly this many items to get the combo price
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Combo Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {images.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Color Variants */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Color Variants</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addColorItem}>
              <Plus className="h-4 w-4 mr-1" />
              Add Color
            </Button>
          </CardHeader>
          <CardContent>
            {colorItems.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No color variants yet. Add colors that customers can choose from.
              </p>
            ) : (
              <div className="space-y-4">
                {colorItems.map((item, index) => (
                  <div key={index} className="flex gap-4 items-start p-4 border rounded-lg">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border flex-shrink-0">
                      {item.image_url ? (
                        <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <label className="w-full h-full flex items-center justify-center bg-muted cursor-pointer">
                          <Upload className="h-5 w-5 text-muted-foreground" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleColorImageUpload(index, e)}
                            className="hidden"
                            disabled={uploading}
                          />
                        </label>
                      )}
                    </div>
                    <div className="flex-1">
                      <Label>Color Name *</Label>
                      <Input
                        value={item.color_name}
                        onChange={(e) => updateColorItem(index, 'color_name', e.target.value)}
                        placeholder="e.g., Navy Blue"
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeColorItem(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : combo ? 'Update Combo' : 'Create Combo'}
          </Button>
        </div>
      </form>
    </div>
  );
};
