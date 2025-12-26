import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ShoppingBag, Heart, User, Menu, X, Sparkles, TrendingUp, Star, Percent, Package } from "lucide-react";
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
interface Category {
  id: string;
  name: string;
  slug: string;
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
const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);

      // Calculate scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / totalHeight * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    // Smooth scroll to all products section
    const allProductsSection = document.getElementById("all-products-section");
    if (allProductsSection) {
      const headerOffset = isScrolled ? 100 : 140;
      const elementPosition = allProductsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    const {
      data
    } = await supabase.from("categories").select("id, name, slug").eq("is_active", true).order("display_order", {
      ascending: true
    });
    if (data) {
      setCategories(data);
    }
  };
  const fetchProducts = async () => {
    const {
      data
    } = await supabase.from("products").select("id, title, price_cents, images, slug, category, variants").eq("status", "published").order("created_at", {
      ascending: false
    });
    if (data) {
      setProducts(data);
    }
    setLoading(false);
  };
  const allCategories = [{
    id: "all",
    name: "All Products",
    slug: "all"
  }, ...categories];
  const filteredProducts = activeCategory === "all" ? products : products.filter(p => p.category?.toLowerCase() === activeCategory);
  const newArrivals = products.slice(0, 4);
  const trending = products.slice(0, 6);
  const saleProducts = products.filter(p => getSalePrice(p.variants));
  return <div className="min-h-screen bg-background">
      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left" style={{
      scaleX: scrollProgress / 100
    }} initial={{
      scaleX: 0
    }} />

      {/* Custom Header */}
      <header className={`sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-12 md:h-14' : 'h-16 md:h-20'}`}>
            {/* Logo */}
            <Link to="/shop" className="flex items-center gap-2">
              <motion.div initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} className={`font-bold tracking-tight transition-all duration-300 ${isScrolled ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>
                <span className="text-primary">KK</span>
                <span className="text-foreground">Outfits</span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className={`font-medium text-muted-foreground hover:text-foreground transition-colors ${isScrolled ? 'text-xs' : 'text-sm'}`}>
                Home
              </Link>
              <Link to="/shop" className={`font-medium text-foreground transition-colors ${isScrolled ? 'text-xs' : 'text-sm'}`}>
                Shop
              </Link>
              <Link to="/sale" className={`font-medium text-muted-foreground hover:text-foreground transition-colors ${isScrolled ? 'text-xs' : 'text-sm'}`}>
                Sale
              </Link>
              <Link to="/about" className={`font-medium text-muted-foreground hover:text-foreground transition-colors ${isScrolled ? 'text-xs' : 'text-sm'}`}>
                About
              </Link>
              <Link to="/contact" className={`font-medium text-muted-foreground hover:text-foreground transition-colors ${isScrolled ? 'text-xs' : 'text-sm'}`}>
                Contact
              </Link>
            </nav>

            {/* Actions */}
            <div className={`flex items-center transition-all duration-300 ${isScrolled ? 'gap-1' : 'gap-3'}`}>
              <Button variant="ghost" size="icon" className={`hidden md:flex transition-all duration-300 ${isScrolled ? 'h-8 w-8' : ''}`}>
                <Search className={`transition-all duration-300 ${isScrolled ? 'h-4 w-4' : 'h-5 w-5'}`} />
              </Button>
              <Link to="/wishlist">
                <Button variant="ghost" size="icon" className={`transition-all duration-300 ${isScrolled ? 'h-8 w-8' : ''}`}>
                  <Heart className={`transition-all duration-300 ${isScrolled ? 'h-4 w-4' : 'h-5 w-5'}`} />
                </Button>
              </Link>
              <Link to="/cart">
                <Button variant="ghost" size="icon" className={`relative transition-all duration-300 ${isScrolled ? 'h-8 w-8' : ''}`}>
                  <ShoppingBag className={`transition-all duration-300 ${isScrolled ? 'h-4 w-4' : 'h-5 w-5'}`} />
                </Button>
              </Link>
              <Link to="/account">
                <Button variant="ghost" size="icon" className={`hidden md:flex transition-all duration-300 ${isScrolled ? 'h-8 w-8' : ''}`}>
                  <User className={`transition-all duration-300 ${isScrolled ? 'h-4 w-4' : 'h-5 w-5'}`} />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className={`md:hidden transition-all duration-300 ${isScrolled ? 'h-8 w-8' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className={`transition-all duration-300 ${isScrolled ? 'h-4 w-4' : 'h-5 w-5'}`} /> : <Menu className={`transition-all duration-300 ${isScrolled ? 'h-4 w-4' : 'h-5 w-5'}`} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: "auto"
        }} exit={{
          opacity: 0,
          height: 0
        }} className="md:hidden border-t border-border bg-background">
              <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
                <Link to="/" className="py-2 text-muted-foreground">Home</Link>
                <Link to="/shop" className="py-2 font-medium">Shop</Link>
                <Link to="/sale" className="py-2 text-muted-foreground">Sale</Link>
                <Link to="/about" className="py-2 text-muted-foreground">About</Link>
                <Link to="/contact" className="py-2 text-muted-foreground">Contact</Link>
              </nav>
            </motion.div>}
        </AnimatePresence>
      </header>

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              New Collection 2026
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              Discover Your <span className="text-primary">Perfect Style</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Explore our curated collection of premium fashion for every occasion
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/trending">
                <Button size="lg" className="rounded-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Shop Trending
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className={`border-b border-border sticky bg-background/95 backdrop-blur-md z-40 transition-all duration-300 ${isScrolled ? 'py-2 top-12 md:top-14' : 'py-6 top-16 md:top-20'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {allCategories.map(cat => <Button key={cat.id} variant={activeCategory === cat.slug ? "default" : "outline"} size="sm" className={`rounded-full whitespace-nowrap transition-all duration-300 ${isScrolled ? 'h-7 text-xs px-3' : ''}`} onClick={() => handleCategoryClick(cat.slug)}>
                {cat.slug === "all" ? <Package className={`mr-1 transition-all duration-300 ${isScrolled ? 'h-3 w-3' : 'h-4 w-4'}`} /> : <ShoppingBag className={`mr-1 transition-all duration-300 ${isScrolled ? 'h-3 w-3' : 'h-4 w-4'}`} />}
                {cat.name}
              </Button>)}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <ScrollReveal>
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">New Arrivals</h2>
                <p className="text-muted-foreground">Fresh styles just dropped</p>
              </div>
              <Badge variant="secondary" className="hidden md:flex">
                <Sparkles className="h-3 w-3 mr-1" />
                Just In
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {loading ? Array.from({
              length: 4
            }).map((_, i) => <ProductCardSkeleton key={i} index={i} />) : newArrivals.map(product => {
              const { price, originalPrice } = getDisplayPrice(product);
              return <ProductCard key={product.id} id={product.slug} name={product.title} price={price} image={getFirstImage(product.images)} category={product.category || undefined} originalPrice={originalPrice} productId={product.id} />;
            })}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Sale Banner */}
      {saleProducts.length > 0 && <ScrollReveal>
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="bg-gradient-to-r from-destructive/20 via-destructive/10 to-primary/10 rounded-2xl p-6 md:p-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <Badge variant="destructive" className="mb-2">
                      <Percent className="h-3 w-3 mr-1" />
                      Limited Time
                    </Badge>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">Mega Sale Event</h3>
                    <p className="text-muted-foreground">Up to 50% off on selected items</p>
                  </div>
                  <Link to="/sale">
                    <Button size="lg" variant="destructive" className="rounded-full">
                      Shop Sale Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>}

      {/* Trending Products */}
      <ScrollReveal>
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Trending Now</h2>
                <p className="text-muted-foreground">Most popular this week</p>
              </div>
              <Badge variant="outline" className="hidden md:flex">
                <TrendingUp className="h-3 w-3 mr-1" />
                Hot
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {loading ? Array.from({
              length: 6
            }).map((_, i) => <ProductCardSkeleton key={i} index={i} />) : trending.map(product => {
              const { price, originalPrice } = getDisplayPrice(product);
              return <ProductCard key={product.id} id={product.slug} name={product.title} price={price} image={getFirstImage(product.images)} category={product.category || undefined} originalPrice={originalPrice} productId={product.id} />;
            })}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* All Products */}
      <ScrollReveal>
        <section id="all-products-section" className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  {activeCategory === "all" ? "All Products" : allCategories.find(c => c.slug === activeCategory)?.name}
                </h2>
                <p className="text-muted-foreground">{filteredProducts.length} products found</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {loading ? Array.from({
              length: 8
            }).map((_, i) => <ProductCardSkeleton key={i} index={i} />) : filteredProducts.map(product => {
              const { price, originalPrice } = getDisplayPrice(product);
              return <ProductCard key={product.id} id={product.slug} name={product.title} price={price} image={getFirstImage(product.images)} category={product.category || undefined} originalPrice={originalPrice} productId={product.id} />;
            })}
            </div>

            {!loading && filteredProducts.length === 0 && <div className="text-center py-16">
                <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">Try selecting a different category</p>
                <Button onClick={() => setActiveCategory("all")}>View All Products</Button>
              </div>}
          </div>
        </section>
      </ScrollReveal>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[{
            icon: Package,
            title: "Free Shipping",
            desc: "On all orders"
          }, {
            icon: Star,
            title: "Premium Quality",
            desc: "100% authentic products"
          }, {
            icon: Heart,
            title: "Easy Returns",
            desc: "30-day return policy"
          }, {
            icon: ShoppingBag,
            title: "Secure Payment",
            desc: "100% secure checkout"
          }].map((feature, i) => <motion.div key={i} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: i * 0.1
          }} className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-1">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>;
};
export default Shop;