import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Grid3X3, List, SlidersHorizontal, Sparkles } from "lucide-react";
import { Json } from "@/integrations/supabase/types";
interface Product {
  id: string;
  title: string;
  price_cents: number;
  images: Json;
  slug: string;
  category: string | null;
  variants: Json;
  description: string | null;
}
const occasionMeta: Record<string, {
  title: string;
  subtitle: string;
  keywords: string[];
}> = {
  wedding: {
    title: "Wedding Collection",
    subtitle: "Royal attire for your special day",
    keywords: ["wedding", "bridal", "sherwani", "lehenga", "reception", "marriage", "ceremony", "groom", "bride", "sangeet", "mehendi"]
  },
  festival: {
    title: "Festival Wear",
    subtitle: "Traditional outfits for celebrations",
    keywords: ["festival", "diwali", "holi", "pongal", "onam", "eid", "navratri", "durga", "puja", "traditional", "ethnic", "kurta", "saree"]
  },
  party: {
    title: "Party Essentials",
    subtitle: "Elegant styles for every occasion",
    keywords: ["party", "cocktail", "evening", "bandhgala", "formal", "elegant", "dinner", "reception", "celebration", "club", "night"]
  },
  casual: {
    title: "Casual Collection",
    subtitle: "Comfortable everyday wear",
    keywords: ["casual", "daily", "comfortable", "everyday", "relaxed", "simple", "indo-western", "fusion", "office", "work", "cotton"]
  }
};
const getFirstImage = (images: Json): string => {
  if (Array.isArray(images) && images.length > 0) {
    return images[0] as string;
  }
  return "/placeholder.svg";
};
const getSalePrice = (variants: Json): number | null => {
  if (Array.isArray(variants)) {
    for (const variant of variants) {
      if (typeof variant === 'object' && variant !== null && 'sale_price_cents' in variant && variant.sale_price_cents) {
        return (variant.sale_price_cents as number) / 100;
      }
    }
  } else if (typeof variants === 'object' && variants !== null && 'sale_price_cents' in variants && variants.sale_price_cents) {
    return (variants.sale_price_cents as number) / 100;
  }
  return null;
};
const getDisplayPrice = (product: Product): {
  price: number;
  originalPrice?: number;
} => {
  const salePrice = getSalePrice(product.variants);
  if (salePrice) {
    // salePrice is already in rupees, price_cents needs conversion
    return {
      price: salePrice,
      originalPrice: product.price_cents / 100
    };
  }
  // Convert cents to rupees
  return {
    price: product.price_cents / 100
  };
};
const classifyProduct = (product: Product, occasionKey: string): boolean => {
  const meta = occasionMeta[occasionKey];
  if (!meta) return false;
  const searchText = `${product.title} ${product.category || ''} ${product.description || ''}`.toLowerCase();
  return meta.keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
};
const OccasionPage = () => {
  const {
    occasion
  } = useParams<{
    occasion: string;
  }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const meta = occasion ? occasionMeta[occasion] : null;
  useEffect(() => {
    const fetchProducts = async () => {
      if (!occasion || !meta) return;
      setLoading(true);
      try {
        const {
          data,
          error
        } = await supabase.from("products").select("id, title, price_cents, images, slug, category, variants, description").eq("status", "published");
        if (error) throw error;

        // Filter products based on occasion keywords
        const filteredProducts = (data || []).filter(product => classifyProduct(product as Product, occasion));
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [occasion, meta]);
  if (!meta) {
    return <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Occasion not found</h1>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
        <Footer />
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{meta.title}</h1>
          <p className="text-muted-foreground">{meta.subtitle}</p>
        </div>

        {/* Controls */}
        

        {/* Products Grid */}
        {loading ? <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
            {Array.from({
          length: 8
        }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div> : products.length > 0 ? <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
            {products.map(product => {
          const {
            price,
            originalPrice
          } = getDisplayPrice(product);
          return <ProductCard key={product.id} id={product.slug} name={product.title} price={price} originalPrice={originalPrice} image={getFirstImage(product.images)} productId={product.id} category={product.category || undefined} />;
        })}
          </div> : <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No products found for this occasion.</p>
            <Link to="/shop">
              <Button>Browse All Products</Button>
            </Link>
          </div>}
      </div>

      <Footer />
    </div>;
};
export default OccasionPage;