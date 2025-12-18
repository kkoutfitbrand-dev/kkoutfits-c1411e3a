import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

interface Product {
  id: string;
  title: string;
  price_cents: number;
  images: Json;
  slug: string;
  variants: Json;
}

const getFirstImage = (images: Json): string => {
  if (Array.isArray(images) && images.length > 0) {
    return images[0] as string;
  }
  return '/placeholder.svg';
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

export const TrendingProducts = () => {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const fetchTrendingProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price_cents, images, slug, variants')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      setTrendingProducts(data || []);
    } catch (error) {
      console.error('Error fetching trending products:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="container px-4 py-12 md:py-16">
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <Flame className="h-6 w-6 text-orange-500" />
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold">
            Trending Now
          </h2>
          <Flame className="h-6 w-6 text-orange-500" />
        </div>
        <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
          Most viewed and loved by customers this week
        </p>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={i} index={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {trendingProducts.map((product) => {
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
              />
            );
          })}
        </div>
      )}
    </section>
  );
};
