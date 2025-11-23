import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, AlertTriangle, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ProductForm } from '@/components/admin/ProductForm';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkInventory, setBulkInventory] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        variant: 'destructive',
      });
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [statusFilter]);

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', deleteId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      fetchProducts();
    }
    setDeleteId(null);
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .in('id', selectedProducts);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete products',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `${selectedProducts.length} products deleted successfully`,
      });
      setSelectedProducts([]);
      fetchProducts();
    }
  };

  const handleBulkInventoryUpdate = async () => {
    if (selectedProducts.length === 0 || !bulkInventory) return;

    const inventory = parseInt(bulkInventory);
    if (isNaN(inventory) || inventory < 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid inventory number',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('products')
      .update({ inventory_count: inventory })
      .in('id', selectedProducts);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update inventory',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `Inventory updated for ${selectedProducts.length} products`,
      });
      setBulkInventory('');
      setSelectedProducts([]);
      fetchProducts();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)} className="mb-4">
          <TabsList>
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>
        </Tabs>

        {selectedProducts.length > 0 && (
          <div className="bg-muted/50 border border-border rounded-lg p-4 flex items-center gap-4">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <span className="font-medium">{selectedProducts.length} selected</span>
            <div className="flex items-center gap-2 ml-auto">
              <Input
                type="number"
                placeholder="New inventory"
                value={bulkInventory}
                onChange={(e) => setBulkInventory(e.target.value)}
                className="w-32"
              />
              <Button size="sm" onClick={handleBulkInventoryUpdate}>
                Update Inventory
              </Button>
              <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                Delete Selected
              </Button>
            </div>
          </div>
        )}

        <div className="border border-border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => toggleProductSelection(product.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{product.title}</div>
                        {product.status === 'draft' && (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{product.slug}</div>
                    </TableCell>
                    <TableCell>₹{(product.price_cents / 100).toLocaleString('en-IN')}</TableCell>
                    <TableCell>{product.inventory_count || 0}</TableCell>
                    <TableCell>
                      <span className={product.inventory_count > 0 ? 'text-green-600' : 'text-red-600'}>
                        {product.inventory_count > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={fetchProducts}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
