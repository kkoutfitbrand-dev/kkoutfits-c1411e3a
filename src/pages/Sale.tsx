import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag } from "lucide-react";
import { Json } from "@/integrations/supabase/types";
import { useSaleCampaign } from "@/hooks/useSaleCampaign";
import { EditorialFashionBanner } from "@/components/EditorialFashionBanner";
import saleBanner from "@/assets/campaign/sale-runway-panorama.jpg.asset.json";

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

const getSalePrice = (variants: Json): number | null => {
  if (variants && typeof variants === 'object' && 'sale_price_cents' in variants) {
    return (variants as { sale_price_cents?: number }).sale_price_cents || null;
  }
  return null;
};

const getDisplayPrice = (product: Product): { price: number; originalPrice?: number } => {
  const salePrice = getSalePrice(product.variants);
  if (salePrice && salePrice < product.price_cents) {
    return {
      price: salePrice / 100,
      originalPrice: product.price_cents / 100
    };
  }
  return { price: product.price_cents / 100 };
};

const Sale = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { campaign } = useSaleCampaign();

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, title, price_cents, images, slug, category, variants')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Filter products that have a sale price
        const saleProducts = (data || []).filter(product => {
          const salePrice = getSalePrice(product.variants);
          return salePrice && salePrice < product.price_cents;
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
      
      <EditorialFashionBanner
        image={saleBanner.url}
        eyebrow={campaign?.name || "KK OUTFITS Sale"}
        title={campaign?.title || "Statement Styles. Special Prices."}
        description={campaign?.promotional_text || "Discover selected premium fashion at special prices for a limited time."}
        cta="Explore the Sale"
        to="#sale-products"
        eager
      />

      <main id="sale-products" className="container scroll-mt-20 px-4 py-8 md:py-12">
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
              {products.map((product) => {
                const { price, originalPrice } = getDisplayPrice(product);
                return (
                  <ProductCard
                    key={product.id}
                    id={product.slug}
                    productId={product.id}
                    name={product.title}
                    price={price}
                    originalPrice={originalPrice}
                    image={getFirstImage(product.images)}
                    category={product.category}
                    badge="SALE"
                  />
                );
              })}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Sale;
