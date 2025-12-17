import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { Search, ShoppingBag, Heart, User, Menu, X, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  if (Array.isArray(variants) && variants.length > 0) {
    const variant = variants[0] as { compareAtPrice?: number };
    return variant.compareAtPrice;
  }
  return undefined;
};

const Trending = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("id, title, price_cents, images, slug, category, variants")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(12);

    if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl md:text-3xl font-medium tracking-tight"
              >
                <span className="text-foreground">KKOutfits</span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/shop" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Shop
              </Link>
              <Link to="/trending" className="text-sm font-medium text-foreground transition-colors">
                Trending
              </Link>
              <Link to="/sale" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sale
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Search className="h-5 w-5" />
              </Button>
              <Link to="/wishlist">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/cart">
                <Button variant="ghost" size="icon">
                  <ShoppingBag className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/account">
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-background"
            >
              <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
                <Link to="/" className="py-2 text-muted-foreground">Home</Link>
                <Link to="/shop" className="py-2 text-muted-foreground">Shop</Link>
                <Link to="/trending" className="py-2 font-medium">Trending</Link>
                <Link to="/sale" className="py-2 text-muted-foreground">Sale</Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Trending Now</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Most Popular This Week
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover what everyone's loving right now. Our most sought-after styles and bestsellers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trending Products Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <ProductCardSkeleton key={i} index={i} />
                ))
              : products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.title}
                    price={product.price_cents / 100}
                    image={getFirstImage(product.images)}
                    category={product.category || undefined}
                    originalPrice={getOriginalPrice(product.variants)}
                  />
                ))}
          </div>

          {!loading && products.length === 0 && (
            <div className="text-center py-16">
              <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No trending products</h3>
              <p className="text-muted-foreground mb-4">Check back soon for new arrivals</p>
              <Link to="/shop">
                <Button>Browse All Products</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Trending;
