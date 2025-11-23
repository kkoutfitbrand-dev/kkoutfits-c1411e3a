import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Upload, X, Loader2, Package, Tag, TrendingUp, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  weight: z.number().min(0).optional(),
  meta_title: z.string().max(60).optional(),
  meta_description: z.string().max(160).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const ProductForm = ({ open, onOpenChange, onSuccess }: ProductFormProps) => {
  const [uploading, setUploading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
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

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      setImageFiles((prev) => [...prev, ...files]);
      
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const uploadImages = async () => {
    const uploadedUrls: string[] = [];
    
    for (const file of imageFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setUploading(true);
      const imageUrls = imageFiles.length > 0 ? await uploadImages() : [];

      const { error } = await supabase.from('products').insert({
        title: data.title,
        slug: data.slug,
        description: data.description || '',
        price_cents: Math.round(data.price_cents * 100),
        inventory_count: data.inventory_count,
        images: imageUrls,
        variants: {
          sku: data.sku,
          barcode: data.barcode,
          category: data.category,
          tags: data.tags?.split(',').map(t => t.trim()).filter(Boolean),
          weight: data.weight,
          sale_price_cents: data.sale_price_cents ? Math.round(data.sale_price_cents * 100) : null,
          meta_title: data.meta_title,
          meta_description: data.meta_description,
        },
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product created successfully',
      });

      reset();
      setImageFiles([]);
      setImagePreviews([]);
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create product',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Product</DialogTitle>
          <DialogDescription>
            Create a comprehensive product listing with all necessary details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Pricing
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Inventory
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                SEO
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="e.g., Premium Cotton Kurta"
                  className="transition-all"
                />
                {errors.title && (
                  <p className="text-sm text-destructive animate-fade-in">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  {...register('slug')}
                  placeholder="premium-cotton-kurta"
                />
                {errors.slug && (
                  <p className="text-sm text-destructive animate-fade-in">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Detailed product description, features, and benefits..."
                  rows={5}
                  className="resize-none"
                />
                {errors.description && (
                  <p className="text-sm text-destructive animate-fade-in">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men">Men's Wear</SelectItem>
                    <SelectItem value="women">Women's Wear</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="traditional">Traditional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  {...register('tags')}
                  placeholder="cotton, ethnic, summer, festive"
                />
                <p className="text-xs text-muted-foreground">Add relevant tags to help customers find this product</p>
              </div>

              {/* Image Upload Section with Drag & Drop */}
              <div className="space-y-2">
                <Label>Product Images *</Label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop images here, or click to browse
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    Choose Files
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported: JPG, PNG, WEBP (Max 5MB each)
                  </p>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-5 gap-3 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group animate-scale-in">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-border hover:border-primary transition-all"
                        />
                        {index === 0 && (
                          <Badge className="absolute top-1 left-1 text-xs">Primary</Badge>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing" className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Regular Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register('price_cents', { valueAsNumber: true })}
                    placeholder="999.00"
                  />
                  {errors.price_cents && (
                    <p className="text-sm text-destructive animate-fade-in">{errors.price_cents.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sale_price">Sale Price (₹)</Label>
                  <Input
                    id="sale_price"
                    type="number"
                    step="0.01"
                    {...register('sale_price_cents', { valueAsNumber: true })}
                    placeholder="799.00"
                  />
                  <p className="text-xs text-muted-foreground">Leave empty if not on sale</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  {...register('weight', { valueAsNumber: true })}
                  placeholder="0.5"
                />
                <p className="text-xs text-muted-foreground">Used for shipping calculations</p>
              </div>
            </TabsContent>

            {/* Inventory Tab */}
            <TabsContent value="inventory" className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                  <Input
                    id="sku"
                    {...register('sku')}
                    placeholder="KRT-001-BLU-M"
                  />
                  <p className="text-xs text-muted-foreground">Unique identifier for inventory tracking</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    {...register('barcode')}
                    placeholder="1234567890123"
                  />
                  <p className="text-xs text-muted-foreground">UPC, EAN, or ISBN</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inventory">Stock Quantity *</Label>
                <Input
                  id="inventory"
                  type="number"
                  {...register('inventory_count', { valueAsNumber: true })}
                  placeholder="100"
                />
                {errors.inventory_count && (
                  <p className="text-sm text-destructive animate-fade-in">{errors.inventory_count.message}</p>
                )}
                <p className="text-xs text-muted-foreground">Total units available for sale</p>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <h4 className="font-medium mb-2">Inventory Status</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">• Set to 0 to mark as "Out of Stock"</p>
                  <p className="text-muted-foreground">• Low stock alerts trigger at &lt; 10 units</p>
                  <p className="text-muted-foreground">• Track inventory automatically on orders</p>
                </div>
              </div>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  {...register('meta_title')}
                  placeholder="Premium Cotton Kurta - Comfortable & Stylish"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: 50-60 characters for optimal search results
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  {...register('meta_description')}
                  placeholder="Shop our premium cotton kurta collection. Perfect for any occasion, featuring comfortable fabrics and elegant designs."
                  rows={3}
                  maxLength={160}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: 120-160 characters for best SEO performance
                </p>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  SEO Best Practices
                </h4>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">✓ Include primary keyword in title</p>
                  <p className="text-muted-foreground">✓ Write compelling meta description</p>
                  <p className="text-muted-foreground">✓ Use descriptive, unique content</p>
                  <p className="text-muted-foreground">✓ Add high-quality product images</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || uploading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || uploading}
              className="min-w-[120px]"
            >
              {(isSubmitting || uploading) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Create Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
