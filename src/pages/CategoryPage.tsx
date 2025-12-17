import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Filter, Grid2x2, List, Check } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
interface Product {
  id: string;
  title: string;
  price_cents: number;
  images: Json;
  slug: string;
  category: string | null;
}
const getFirstImage = (images: Json): string => {
  if (Array.isArray(images) && images.length > 0) {
    return images[0] as string;
  }
  return '/placeholder.svg';
};
const CategoryPage = () => {
  const {
    category
  } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  useEffect(() => {
    fetchProducts();
  }, [category]);
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase.from('products').select('id, title, price_cents, images, slug, category').eq('status', 'published').order('created_at', {
        ascending: false
      });

      // Filter by category if provided
      if (category) {
        query = query.eq('category', category);
      }
      const {
        data,
        error
      } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on price
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const price = product.price_cents / 100;
      return price >= priceRange[0] && price <= priceRange[1];
    });
  }, [products, priceRange]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price_cents - b.price_cents);
      case "price-high":
        return sorted.sort((a, b) => b.price_cents - a.price_cents);
      case "newest":
        return sorted.reverse();
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);
  const handleClearFilters = () => {
    setPriceRange([0, 20000]);
  };
  const getCategoryTitle = () => {
    return category?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Products';
  };
  return <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl md:text-4xl font-serif font-bold">
            {getCategoryTitle()}
          </h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <div className="flex items-center justify-end mb-6">
                  <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                    Clear All
                  </Button>
                </div>

                {/* Price Range */}
                <div className="mb-6 pb-6 border-b border-border">
                  <h3 className="font-semibold mb-4">Price Range</h3>
                  <Slider value={priceRange} onValueChange={setPriceRange} max={20000} step={100} className="mb-4" />
                  <div className="flex justify-between text-sm">
                    <span>₹{priceRange[0].toLocaleString()}</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                {/* Colors */}

                {/* Sizes */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <p className="text-muted-foreground mb-8">
          Showing {sortedProducts.length} of {products.length} products
        </p>

        <div className="grid grid-cols-1 gap-8">
          {/* Products Grid */}
          <div>
            {/* Sort and View Options */}
            

            {/* Products Display */}
            {loading ? <div className="grid grid-cols-2 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} index={i} />
                ))}
              </div> : sortedProducts.length > 0 ? viewMode === "grid" ? <div className="grid grid-cols-2 gap-4 md:gap-6 animate-fade-in">
                  {sortedProducts.map(product => <ProductCard key={product.id} id={product.slug} productId={product.id} name={product.title} price={product.price_cents / 100} image={getFirstImage(product.images)} category={product.category} />)}
                </div> : <div className="space-y-4 animate-fade-in">
                  {sortedProducts.map(product => <div key={product.id} className="flex gap-4 p-4 border border-border rounded-lg hover:shadow-lg transition-shadow bg-card">
                      <img src={getFirstImage(product.images)} alt={product.title} className="w-32 h-32 object-cover rounded-md flex-shrink-0" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg">{product.title}</h3>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold">₹{(product.price_cents / 100).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => window.location.href = `/product/${product.slug}`} className="flex-1">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>)}
                </div> : <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">
                  No products found matching your filters
                </p>
                <Button onClick={handleClearFilters}>Clear Filters</Button>
              </div>}
          </div>
        </div>
      </div>

      <Footer />
    </div>;
};
export default CategoryPage;