import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

interface Product {
  id: string;
  title: string;
  price_cents: number;
  images: Json;
  slug: string;
  variants: Json;
  category: string | null;
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

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<Product[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Sync URL query to state
  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  // Real-time search as user types with debounce
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed) {
      const timer = setTimeout(() => {
        searchProducts(trimmed);
      }, 300); // 300ms debounce
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      fetchRelatedProducts();
    }
  }, [searchQuery]);

  const searchProducts = async (searchTerm: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price_cents, images, slug, variants, category')
        .eq('status', 'published')
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
        .limit(20);

      if (error) throw error;
      setResults(data || []);

      // Fetch related products based on categories of found products
      if (data && data.length > 0) {
        const categories = [...new Set(data.map(p => p.category).filter(Boolean))];
        fetchRelatedByCategories(categories as string[], data.map(p => p.id));
      } else {
        fetchRelatedProducts();
      }
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedByCategories = async (categories: string[], excludeIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price_cents, images, slug, variants, category')
        .eq('status', 'published')
        .in('category', categories)
        .not('id', 'in', `(${excludeIds.join(',')})`)
        .limit(4);

      if (error) throw error;
      setRelatedProducts(data || []);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price_cents, images, slug, variants, category')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      setRelatedProducts(data || []);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 py-8 md:py-12">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search for products..."
              className="pl-12 h-14 text-lg"
            />
          </div>
        </form>

        {/* Show results when user has typed something */}
        {searchQuery.trim() ? (
          <>
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                Search results for "{searchQuery}"
              </h1>
              <p className="text-muted-foreground">
                {loading ? 'Searching...' : `${results.length} products found`}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
                {[...Array(4)].map((_, i) => (
                  <ProductCardSkeleton key={i} index={i} />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
                {results.map(product => {
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
                      category={product.category || undefined}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <SearchIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-serif font-bold mb-2">No products found</h2>
                <p className="text-muted-foreground mb-8">
                  Try a different search term or browse our collections
                </p>
              </div>
            )}

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="mt-16 border-t border-border pt-12">
                <h2 className="text-2xl font-serif font-bold mb-6 text-center">
                  You May Also Like
                </h2>
                <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
                  {relatedProducts.map(product => {
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
                        category={product.category || undefined}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <SearchIcon className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-2xl font-serif font-bold mb-4">Start Searching</h2>
            <p className="text-muted-foreground mb-12">
              Enter a keyword to find products
            </p>

            {/* Show trending/recent products when no search */}
            {relatedProducts.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-serif font-bold mb-6">Trending Products</h3>
                <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
                  {relatedProducts.map(product => {
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
                        category={product.category || undefined}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Search;
