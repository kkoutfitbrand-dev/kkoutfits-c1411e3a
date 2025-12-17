import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag, Percent } from "lucide-react";
import { Json } from "@/integrations/supabase/types";

interface Product {
  id: string;
  title: string;
  price_cents: number;
  images: Json;
  slug: string;
  category: string | null;
  variants: Json;
}

const getFirstImage = (images: Json): string => {
  if (Array.isArray(images) && images.length > 0) {
    return images[0] as string;
  }
  return "/placeholder.svg";
};

const getOriginalPrice = (variants: Json): number | undefined => {
  if (variants && typeof variants === 'object' && !Array.isArray(variants)) {
    const v = variants as Record<string, unknown>;
    if (v.compareAtPrice && typeof v.compareAtPrice === 'number') {
      return v.compareAtPrice;
    }
  }
  return undefined;
};

const Sale = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, title, price_cents, images, slug, category, variants')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Filter products that have a compare_at_price (on sale)
        const saleProducts = (data || []).filter(product => {
          const originalPrice = getOriginalPrice(product.variants);
          return originalPrice && originalPrice > product.price_cents / 100;
        });

        setProducts(saleProducts);
      } catch (error) {
        console.error('Error fetching sale products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-destructive/90 to-destructive py-12 md:py-16">
        <div className="container px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Percent className="h-8 w-8 md:h-10 md:w-10 text-destructive-foreground" />
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-destructive-foreground">
              SALE
            </h1>
            <Tag className="h-8 w-8 md:h-10 md:w-10 text-destructive-foreground" />
          </div>
          <p className="text-destructive-foreground/90 text-lg md:text-xl max-w-2xl mx-auto">
            Discover amazing deals on premium fashion. Limited time offers on your favorite styles!
          </p>
        </div>
      </div>

      <main className="container px-4 py-8 md:py-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Tag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Sale Items Available</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Check back soon for exciting deals and discounts on our latest collections!
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {products.length} item{products.length !== 1 ? 's' : ''} on sale
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.slug}
                  productId={product.id}
                  name={product.title}
                  price={product.price_cents / 100}
                  originalPrice={getOriginalPrice(product.variants)}
                  image={getFirstImage(product.images)}
                  category={product.category}
                  badge="SALE"
                />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Sale;
