import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Share2, ShoppingCart, Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ProductPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productData: {
    title: string;
    description: string;
    price_cents: number;
    sale_price_cents?: number;
    category?: string;
    tags?: string;
    images: string[];
    inventory_count: number;
  };
}

export const ProductPreview = ({ open, onOpenChange, productData }: ProductPreviewProps) => {
  const hasDiscount = productData.sale_price_cents && productData.sale_price_cents < productData.price_cents;
  const discountPercent = hasDiscount
    ? Math.round(((productData.price_cents - productData.sale_price_cents!) / productData.price_cents) * 100)
    : 0;

  const displayPrice = productData.sale_price_cents || productData.price_cents;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Product Preview
            <Badge variant="outline">Storefront View</Badge>
          </DialogTitle>
          <DialogDescription>
            This is how customers will see your product on the website
          </DialogDescription>
        </DialogHeader>

        {/* Preview Content */}
        <div className="grid md:grid-cols-2 gap-8 mt-4">
          {/* Images Section */}
          <div className="space-y-4">
            {productData.images.length > 0 ? (
              <>
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-border bg-muted">
                  <img
                    src={productData.images[0]}
                    alt={productData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {productData.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {productData.images.slice(1, 5).map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square rounded-md overflow-hidden border border-border bg-muted"
                      >
                        <img
                          src={img}
                          alt={`${productData.title} ${idx + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square rounded-lg border-2 border-dashed border-border bg-muted flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No images uploaded</p>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {productData.title || 'Product Title'}
              </h1>
              
              {/* Category & Tags */}
              {(productData.category || productData.tags) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {productData.category && (
                    <Badge variant="secondary">{productData.category}</Badge>
                  )}
                  {productData.tags?.split(',').map((tag, idx) => (
                    <Badge key={idx} variant="outline">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(0 reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-foreground">
                  ₹{displayPrice.toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{productData.price_cents.toLocaleString('en-IN')}
                    </span>
                    <Badge variant="destructive">{discountPercent}% OFF</Badge>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-4">
                {productData.inventory_count > 0 ? (
                  <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    In Stock ({productData.inventory_count} available)
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>

              <Separator className="my-4" />

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {productData.description || 'No description provided'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1" size="lg" disabled>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg" disabled>
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" disabled>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground text-center">
            This is a preview. Buttons are disabled. Publish the product to make it available on your store.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
