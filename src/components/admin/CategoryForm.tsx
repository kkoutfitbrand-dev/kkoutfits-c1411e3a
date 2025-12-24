import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100),
  parent_id: z.string().optional().nullable(),
  description: z.string().max(500).optional(),
  display_order: z.number().min(0),
  is_active: z.boolean(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
  image_url?: string | null;
}

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editingCategory?: Category | null;
  parentCategories: Category[];
}

export const CategoryForm = ({
  open,
  onOpenChange,
  onSuccess,
  editingCategory,
  parentCategories,
}: CategoryFormProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      parent_id: null,
      description: '',
      display_order: 0,
      is_active: true,
    },
  });

  const isActive = watch('is_active');

  useEffect(() => {
    if (editingCategory) {
      reset({
        name: editingCategory.name,
        slug: editingCategory.slug,
        parent_id: editingCategory.parent_id,
        description: editingCategory.description || '',
        display_order: editingCategory.display_order,
        is_active: editingCategory.is_active,
      });
      setImagePreview(editingCategory.image_url || null);
    } else {
      reset({
        name: '',
        slug: '',
        parent_id: null,
        description: '',
        display_order: 0,
        is_active: true,
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [editingCategory, reset, open]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return editingCategory?.image_url || null;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `category-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, imageFile);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setUploading(true);
      
      const imageUrl = await uploadImage();

      const categoryData = {
        name: data.name,
        slug: data.slug,
        parent_id: data.parent_id || null,
        description: data.description || null,
        display_order: data.display_order,
        is_active: data.is_active,
        image_url: imagePreview === null ? null : imageUrl,
      };

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Category updated successfully',
        });
      } else {
        const { error } = await supabase.from('categories').insert(categoryData);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Category created successfully',
        });
      }

      reset();
      setImageFile(null);
      setImagePreview(null);
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save category',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
          <DialogDescription>
            {editingCategory
              ? 'Update category information'
              : 'Create a new category for organizing products'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Category Image Upload */}
          <div className="space-y-2">
            <Label>Category Image</Label>
            <div className="flex items-start gap-4">
              {imagePreview ? (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border">
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
                  <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Upload an image for this category. This will be displayed in the product form and category pages.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 400x400px, JPG or PNG
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., Shirts"
                onChange={(e) => {
                  register('name').onChange(e);
                  if (!editingCategory) {
                    setValue('slug', generateSlug(e.target.value));
                  }
                }}
              />
              {errors.name && (
                <p className="text-sm text-destructive animate-fade-in">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                {...register('slug')}
                placeholder="shirts"
                className="font-mono text-sm"
              />
              {errors.slug && (
                <p className="text-sm text-destructive animate-fade-in">
                  {errors.slug.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent_id">Parent Category (Optional)</Label>
            <Select
              onValueChange={(value) => setValue('parent_id', value === 'none' ? null : value)}
              defaultValue={editingCategory?.parent_id || 'none'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Parent (Main Category)</SelectItem>
                {parentCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Leave empty for main category, or select a parent to create a subcategory
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Brief description of the category"
              rows={3}
              className="resize-none"
            />
            {errors.description && (
              <p className="text-sm text-destructive animate-fade-in">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                {...register('display_order', { valueAsNumber: true })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first
              </p>
              {errors.display_order && (
                <p className="text-sm text-destructive animate-fade-in">
                  {errors.display_order.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="is_active">Status</Label>
              <div className="flex items-center gap-3 h-10">
                <Switch
                  id="is_active"
                  checked={isActive}
                  onCheckedChange={(checked) => setValue('is_active', checked)}
                />
                <span className="text-sm">
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Inactive categories are hidden from customers
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || uploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || uploading}>
              {(isSubmitting || uploading) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};