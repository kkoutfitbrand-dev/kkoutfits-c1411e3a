import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Upload, X, Loader2, Check, ChevronRight, ChevronLeft, Eye, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { Progress } from '@/components/ui/progress';
import { ProductPreview } from './ProductPreview';
import { VariantsManager } from './VariantsManager';
const productSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200),
  description: z.string().max(2000).optional(),
  price_cents: z.number().min(0, 'Price must be positive'),
  sale_price_cents: z.number().min(0).optional(),
  inventory_count: z.number().min(0, 'Inventory must be non-negative'),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  weight: z.number().min(0).optional()
});
type ProductFormData = z.infer<typeof productSchema>;
interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editProduct?: any;
}
const steps = [{
  id: 1,
  name: 'Basic Info',
  description: 'Product details'
}, {
  id: 2,
  name: 'Pricing',
  description: 'Price & costs'
}, {
  id: 3,
  name: 'Inventory',
  description: 'Stock & tracking'
}, {
  id: 4,
  name: 'Variants',
  description: 'Size, Color options'
}];
export const ProductForm = ({
  open,
  onOpenChange,
  onSuccess,
  editProduct
}: ProductFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [variants, setVariants] = useState<any[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Fetch categories from database
  const {
    data: categories = []
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('categories').select('*').eq('is_active', true).order('display_order', {
        ascending: true
      });
      if (error) throw error;
      return data || [];
    }
  });
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting
    },
    reset,
    setValue,
    trigger,
    getValues,
    watch
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      price_cents: 0,
      sale_price_cents: 0,
      inventory_count: 0,
      sku: '',
      barcode: '',
      category: '',
      tags: '',
      weight: 0
    }
  });
  useEffect(() => {
    if (!open) {
      setCurrentStep(1);
      reset();
      setImageFiles([]);
      setImagePreviews([]);
      setExistingImages([]);
      setVariants([]);
    } else if (editProduct) {
      // Populate form with existing product data
      const variantsData = editProduct.variants || {};
      setValue('title', editProduct.title);
      setValue('slug', editProduct.slug);
      setValue('description', editProduct.description || '');
      setValue('price_cents', editProduct.price_cents / 100);
      setValue('sale_price_cents', variantsData.sale_price_cents ? variantsData.sale_price_cents / 100 : 0);
      setValue('inventory_count', editProduct.inventory_count || 0);
      setValue('sku', variantsData.sku || '');
      setValue('barcode', variantsData.barcode || '');
      setValue('category', editProduct.category || variantsData.category || '');
      setValue('tags', variantsData.tags?.join(', ') || '');
      setValue('weight', variantsData.weight || 0);

      // Set existing images
      if (editProduct.images && Array.isArray(editProduct.images)) {
        setExistingImages(editProduct.images);
        setImagePreviews(editProduct.images);
      }

      // Load existing variants from product_variants table
      const loadVariants = async () => {
        const {
          data,
          error
        } = await supabase.from('product_variants').select('*').eq('product_id', editProduct.id);
        if (!error && data && data.length > 0) {
          setVariants(data);
        }
      };
      loadVariants();
    }
  }, [open, reset, editProduct, setValue]);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };
  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };
  const uploadImages = async () => {
    const uploadedUrls: string[] = [...existingImages];
    for (const file of imageFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      const {
        error: uploadError
      } = await supabase.storage.from('product-images').upload(filePath, file);
      if (uploadError) {
        throw uploadError;
      }
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('product-images').getPublicUrl(filePath);
      uploadedUrls.push(publicUrl);
    }
    return uploadedUrls;
  };
  const validateStep = async () => {
    let fieldsToValidate: (keyof ProductFormData)[] = [];
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['title', 'slug', 'description', 'category', 'tags'];
        break;
      case 2:
        fieldsToValidate = ['price_cents', 'sale_price_cents', 'weight'];
        break;
      case 3:
        fieldsToValidate = ['inventory_count', 'sku', 'barcode'];
        break;
      case 4:
        // Variants step - no required fields
        fieldsToValidate = [];
        break;
    }
    const result = await trigger(fieldsToValidate);
    return result;
  };
  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isValid = await validateStep();
    if (isValid) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        toast({
          title: 'Progress Saved',
          description: `${steps[currentStep - 1].name} completed successfully`
        });
      }
    }
  };
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const onSubmit = async (data: ProductFormData) => {
    try {
      setUploading(true);
      const imageUrls = imageFiles.length > 0 || existingImages.length > 0 ? await uploadImages() : existingImages;
      const productData = {
        title: data.title,
        slug: data.slug,
        description: data.description || '',
        price_cents: Math.round(data.price_cents * 100),
        inventory_count: data.inventory_count,
        images: imageUrls,
        status: 'published',
        category: data.category || null,
        variants: {
          sku: data.sku,
          barcode: data.barcode,
          tags: data.tags?.split(',').map(t => t.trim()).filter(Boolean),
          weight: data.weight,
          sale_price_cents: data.sale_price_cents ? Math.round(data.sale_price_cents * 100) : null
        }
      };
      let error;
      if (editProduct) {
        // Update existing product
        const result = await supabase.from('products').update(productData).eq('id', editProduct.id);
        error = result.error;

        // Update or insert variants
        if (variants.length > 0) {
          // Delete old variants
          await supabase.from('product_variants').delete().eq('product_id', editProduct.id);

          // Insert new variants
          const variantsData = variants.map(v => ({
            product_id: editProduct.id,
            ...v,
            price_cents: v.price_cents || productData.price_cents
          }));
          await supabase.from('product_variants').insert(variantsData);
        }
      } else {
        // Create new product
        const result = await supabase.from('products').insert(productData).select().single();
        error = result.error;

        // Insert variants if any
        if (!error && result.data && variants.length > 0) {
          const variantsData = variants.map(v => ({
            product_id: result.data.id,
            ...v,
            price_cents: v.price_cents || productData.price_cents
          }));
          await supabase.from('product_variants').insert(variantsData);
        }
      }
      if (error) throw error;
      toast({
        title: 'Success',
        description: editProduct ? 'Product updated successfully' : 'Product published successfully'
      });
      reset();
      setImageFiles([]);
      setImagePreviews([]);
      setExistingImages([]);
      setVariants([]);
      setCurrentStep(1);
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${editProduct ? 'update' : 'create'} product`,
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };
  const saveDraft = async () => {
    try {
      setUploading(true);
      const data = getValues();
      const imageUrls = imageFiles.length > 0 || existingImages.length > 0 ? await uploadImages() : existingImages;
      const productData = {
        title: data.title || 'Untitled Product',
        slug: data.slug || `draft-${Date.now()}`,
        description: data.description || '',
        price_cents: data.price_cents ? Math.round(data.price_cents * 100) : 0,
        inventory_count: data.inventory_count || 0,
        images: imageUrls,
        status: 'draft',
        category: data.category || null,
        variants: {
          sku: data.sku,
          barcode: data.barcode,
          tags: data.tags?.split(',').map(t => t.trim()).filter(Boolean),
          weight: data.weight,
          sale_price_cents: data.sale_price_cents ? Math.round(data.sale_price_cents * 100) : null
        }
      };
      let error;
      if (editProduct) {
        const result = await supabase.from('products').update(productData).eq('id', editProduct.id);
        error = result.error;
      } else {
        const result = await supabase.from('products').insert(productData);
        error = result.error;
      }
      if (error) throw error;
      toast({
        title: 'Draft Saved',
        description: 'Product saved as draft. You can continue editing later.'
      });
      reset();
      setImageFiles([]);
      setImagePreviews([]);
      setExistingImages([]);
      setVariants([]);
      setCurrentStep(1);
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save draft',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };
  const handlePreview = () => {
    setPreviewOpen(true);
  };
  const getPreviewData = () => {
    const data = getValues();
    return {
      title: data.title || 'Product Title',
      description: data.description || '',
      price_cents: data.price_cents || 0,
      sale_price_cents: data.sale_price_cents,
      category: data.category,
      tags: data.tags,
      images: imagePreviews,
      inventory_count: data.inventory_count || 0
    };
  };
  const progress = currentStep / steps.length * 100;
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {editProduct ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            {editProduct ? 'Update product information and variants' : 'Complete all steps to create a comprehensive product listing'}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-4">
              {steps.map(step => <div key={step.id} className={`flex flex-col items-center relative ${step.id <= currentStep ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${step.id < currentStep ? 'bg-primary text-primary-foreground' : step.id === currentStep ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : 'bg-muted text-muted-foreground'}`}>
                    {step.id < currentStep ? <Check className="h-5 w-5" /> : step.id}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${step.id === currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>)}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input id="title" {...register('title')} placeholder="e.g., Premium Cotton Kurta" onChange={e => {
              register('title').onChange(e);
              setValue('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''));
            }} />
                {errors.title && <p className="text-sm text-destructive animate-fade-in">{errors.title.message}</p>}
              </div>

              

              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea id="description" {...register('description')} placeholder="Detailed product description, features, and benefits..." rows={5} className="resize-none" />
              </div>

              {/* Main Category Section */}
              <div className="space-y-3">
                <Label>Main Category</Label>
                <div className="grid grid-cols-5 gap-2">
                  {['Shirts', 'T-Shirts', 'Pants', 'Jeans', 'Casual Wear'].map((cat) => {
                    const catSlug = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    const isSelected = watch('category') === catSlug;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setValue('category', catSlug)}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          isSelected 
                            ? 'border-primary bg-primary/10 text-primary font-semibold' 
                            : 'border-border hover:border-primary/50 hover:bg-muted'
                        }`}
                      >
                        <span className="text-sm">{cat}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Select a main category to display this product on the category page
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Or Select from Database Categories</Label>
                <Select value={watch('category') || ''} onValueChange={value => setValue('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: any) => <SelectItem key={cat.id} value={cat.slug}>
                        {cat.parent_id && '• '}{cat.name}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" {...register('tags')} placeholder="cotton, ethnic, summer, festive" />
                <p className="text-xs text-muted-foreground">Add relevant tags to help customers find this product</p>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Product Images *</Label>
                <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop images here, or click to browse
                  </p>
                  <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('image-upload')?.click()}>
                    Choose Files
                  </Button>
                  <input id="image-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported: JPG, PNG, WEBP (Max 5MB each)
                  </p>
                </div>

                {imagePreviews.length > 0 && <div className="grid grid-cols-5 gap-3 mt-4">
                    {imagePreviews.map((preview, index) => <div key={index} className="relative group animate-scale-in">
                        <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg border-2 border-border hover:border-primary transition-all" />
                        {index === 0 && <Badge className="absolute top-1 left-1 text-xs">Primary</Badge>}
                        <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                          <X className="h-3 w-3" />
                        </button>
                      </div>)}
                  </div>}
              </div>
            </div>}

          {/* Step 2: Pricing */}
          {currentStep === 2 && <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">MRP (₹) *</Label>
                  <Input id="price" type="number" step="0.01" {...register('price_cents', {
                valueAsNumber: true
              })} placeholder="999.00" />
                  {errors.price_cents && <p className="text-sm text-destructive animate-fade-in">{errors.price_cents.message}</p>}
                  <p className="text-xs text-muted-foreground">Maximum Retail Price</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sale_price">Selling Price (₹) *</Label>
                  <Input id="sale_price" type="number" step="0.01" {...register('sale_price_cents', {
                valueAsNumber: true
              })} placeholder="799.00" />
                  <p className="text-xs text-muted-foreground">Your actual selling price</p>
                </div>
              </div>

              {/* Auto-calculated Discount Preview */}
              {(() => {
                const mrpValue = watch('price_cents');
                const sellingValue = watch('sale_price_cents');
                if (mrpValue && sellingValue && mrpValue > sellingValue) {
                  const discount = Math.round(((mrpValue - sellingValue) / mrpValue) * 100);
                  return (
                    <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Price Preview</h4>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground line-through">MRP: ₹{mrpValue.toLocaleString()}</span>
                        <span className="font-semibold text-foreground">Selling: ₹{sellingValue.toLocaleString()}</span>
                        <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-xs font-medium">{discount}% OFF</span>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" type="number" step="0.01" {...register('weight', {
              valueAsNumber: true
            })} placeholder="0.5" />
                <p className="text-xs text-muted-foreground">Used for shipping calculations</p>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4 mt-4">
                <h4 className="font-medium mb-2">Pricing Tips</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• Set competitive prices based on market research</p>
                  <p>• Use sale prices to create urgency and boost conversions</p>
                  <p>• Include weight for accurate shipping cost calculations</p>
                </div>
              </div>
            </div>}

          {/* Step 3: Inventory */}
          {currentStep === 3 && <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                

                
              </div>

              <div className="space-y-2">
                <Label htmlFor="inventory">Stock Quantity *</Label>
                <Input id="inventory" type="number" {...register('inventory_count', {
              valueAsNumber: true
            })} placeholder="100" />
                {errors.inventory_count && <p className="text-sm text-destructive animate-fade-in">{errors.inventory_count.message}</p>}
                <p className="text-xs text-muted-foreground">Total units available for sale</p>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <h4 className="font-medium mb-2">Inventory Management</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• Set to 0 to mark as "Out of Stock"</p>
                  <p>• Low stock alerts trigger at &lt; 10 units</p>
                  <p>• Track inventory automatically on orders</p>
                  
                </div>
              </div>
            </div>}

          {/* Step 4: Variants */}
          {currentStep === 4 && <div className="animate-fade-in">
              <VariantsManager variants={variants} basePrice={getValues('price_cents') ? Math.round(getValues('price_cents') * 100) : 0} onChange={setVariants} productCategory={getValues('category')} />
              
              {variants.length === 0 && (
                <div className="mt-4 p-4 border border-dashed rounded-lg bg-muted/20">
                  <h4 className="font-medium mb-2">💡 How to add sizes:</h4>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Select a category first (Step 1) to see available sizes</li>
                    <li>Click on the sizes you want to offer for this product</li>
                    <li>Optionally add colors if your product comes in different colors</li>
                    <li>Set inventory and price for each variant below</li>
                    <li>Click "Publish Product" when ready</li>
                  </ol>
                </div>
              )}
            </div>}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 1 || isSubmitting || uploading}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button type="button" variant="outline" onClick={handlePreview} disabled={!getValues('title')}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={saveDraft} disabled={isSubmitting || uploading}>
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>

              {currentStep < 4 ? <Button type="button" onClick={(e) => handleNext(e)} disabled={isSubmitting || uploading}>
                  {currentStep === 3 ? 'Continue to Variants (Required)' : 'Save & Continue'}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button> : <Button type="submit" disabled={isSubmitting || uploading || variants.length === 0} className="min-w-[140px]">
                  {(isSubmitting || uploading) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {variants.length === 0 ? 'Select Sizes First' : editProduct ? 'Update Product' : 'Publish Product'}
                </Button>}
            </div>
          </div>
        </form>

        {/* Product Preview Modal */}
        <ProductPreview open={previewOpen} onOpenChange={setPreviewOpen} productData={getPreviewData()} />
      </DialogContent>
    </Dialog>;
};