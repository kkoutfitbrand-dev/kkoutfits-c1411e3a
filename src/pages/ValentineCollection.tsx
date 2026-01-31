import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ProductCard } from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/HomeSkeleton";
import { motion } from "framer-motion";
import { Heart, Sparkles, Gift, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

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
    return { price: salePrice / 100, originalPrice: product.price_cents / 100 };
  }
  return { price: product.price_cents / 100 };
};

// Floating heart decoration
const FloatingHeart = ({ delay, x, y }: { delay: number; x: number; y: number }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%` }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 0.6, 0],
      scale: [0.5, 1, 0.5],
      y: [0, -30, 0],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <Heart className="w-4 h-4 fill-rose-400/50 text-rose-400/50" />
  </motion.div>
);

// Gift guide categories
const giftCategories = [
  {
    title: "For Her",
    description: "Elegant sarees, lehengas & ethnic wear",
    icon: Heart,
    color: "from-rose-500 to-pink-500",
    link: "/category/women",
  },
  {
    title: "For Him",
    description: "Stylish kurtas, sherwanis & formals",
    icon: Gift,
    color: "from-rose-600 to-red-500",
    link: "/category/men",
  },
  {
    title: "Couple Goals",
    description: "Matching outfits for the perfect pair",
    icon: Sparkles,
    color: "from-pink-500 to-rose-400",
    link: "/trending",
  },
];

const ValentineCollection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, title, price_cents, images, slug, category, variants')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(12);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative min-h-[400px] md:min-h-[500px]">
          {/* Background gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, hsl(340 100% 92%) 0%, hsl(350 100% 95%) 30%, hsl(340 80% 85%) 70%, hsl(340 70% 80%) 100%)',
            }}
          />

          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(ellipse at 30% 50%, rgba(244,63,94,0.15) 0%, transparent 50%)',
                'radial-gradient(ellipse at 50% 50%, rgba(244,63,94,0.2) 0%, transparent 50%)',
                'radial-gradient(ellipse at 30% 50%, rgba(244,63,94,0.15) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Heart pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='%23be123c'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Floating hearts */}
          <div className="absolute inset-0 overflow-hidden">
            <FloatingHeart x={10} y={20} delay={0} />
            <FloatingHeart x={85} y={30} delay={1} />
            <FloatingHeart x={25} y={60} delay={2} />
            <FloatingHeart x={75} y={70} delay={1.5} />
            <FloatingHeart x={50} y={15} delay={2.5} />
          </div>

          {/* Top border */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{
              background: 'linear-gradient(90deg, hsl(340 80% 60%), hsl(0 80% 60%), hsl(43 96% 56%), hsl(340 80% 60%))',
            }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Content */}
          <div className="container mx-auto px-4 relative z-10 flex items-center min-h-[400px] md:min-h-[500px]">
            <div className="max-w-2xl py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-4"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/30 backdrop-blur-sm border border-rose-300/40 rounded-full">
                  <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                  <span className="text-sm font-bold tracking-widest text-rose-700 uppercase">
                    Valentine's Collection
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-rose-800 mb-4"
              >
                Dress Your{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, hsl(340 82% 52%) 0%, hsl(0 80% 50%) 100%)',
                  }}
                >
                  Love Story
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-rose-700/80 mb-6 max-w-lg"
              >
                Discover romantic outfits perfect for date nights, special moments, and celebrating love. Up to 50% off on selected styles.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-3"
              >
                <Link to="/shop">
                  <Button
                    size="lg"
                    className="font-bold px-8 py-6 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, hsl(340 82% 52%) 0%, hsl(0 80% 50%) 100%)',
                    }}
                  >
                    <Heart className="w-4 h-4 mr-2 fill-current" />
                    Explore Collection
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Bottom border */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1.5"
            style={{
              background: 'linear-gradient(90deg, hsl(43 96% 56%), hsl(340 80% 60%), hsl(0 80% 60%), hsl(43 96% 56%))',
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
        </div>
      </section>

      {/* Gift Guide Categories */}
      <ScrollReveal>
        <section className="container px-4 py-12 md:py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
              Valentine's Gift Guide
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Find the perfect outfit for your loved one this Valentine's Day
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {giftCategories.map((category, index) => (
              <ScrollReveal key={category.title} delay={index * 0.1}>
                <Link to={category.link}>
                  <motion.div
                    className="group relative overflow-hidden rounded-2xl p-6 md:p-8 h-48 flex flex-col justify-between cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${category.color.split(' ')[0].replace('from-', 'var(--tw-gradient-from)')} 0%, ${category.color.split(' ')[1].replace('to-', 'var(--tw-gradient-to)')} 100%)`,
                    }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`}
                    />
                    
                    <div className="relative z-10">
                      <category.icon className="w-8 h-8 text-white mb-3" />
                      <h3 className="text-xl font-bold text-white mb-1">
                        {category.title}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {category.description}
                      </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-2 text-white font-medium">
                      <span>Shop Now</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Decorative hearts */}
                    <div className="absolute top-4 right-4 opacity-20">
                      <Heart className="w-16 h-16 fill-white text-white" />
                    </div>
                  </motion.div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Featured Products */}
      <ScrollReveal>
        <section className="container px-4 py-8 md:py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                ❤️ Love-Worthy Picks
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Curated styles for romantic occasions
              </p>
            </div>
            <Link to="/shop">
              <Button variant="outline" className="hidden sm:flex items-center gap-2">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {products.map((product, index) => {
                const { price, originalPrice } = getDisplayPrice(product);
                return (
                  <ScrollReveal key={product.id} delay={index * 0.05} direction="up">
                    <ProductCard
                      id={product.slug}
                      productId={product.id}
                      name={product.title}
                      price={price}
                      originalPrice={originalPrice}
                      image={getFirstImage(product.images)}
                      category={product.category}
                    />
                  </ScrollReveal>
                );
              })}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link to="/shop">
              <Button variant="outline" className="w-full max-w-xs">
                View All Products
              </Button>
            </Link>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA Banner */}
      <ScrollReveal>
        <section className="container px-4 py-8 md:py-12">
          <div
            className="relative overflow-hidden rounded-2xl p-8 md:p-12 text-center"
            style={{
              background: 'linear-gradient(135deg, hsl(340 82% 52%) 0%, hsl(0 80% 50%) 100%)',
            }}
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <Heart className="absolute top-4 left-8 w-12 h-12 text-white/10 fill-white/10" />
              <Heart className="absolute bottom-6 right-12 w-16 h-16 text-white/10 fill-white/10" />
              <Sparkles className="absolute top-8 right-20 w-8 h-8 text-white/20" />
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Make This Valentine's Unforgettable
              </h2>
              <p className="text-white/80 mb-6 max-w-xl mx-auto">
                Free gift wrapping on all orders. Use code LOVE50 for extra 10% off!
              </p>
              <Link to="/shop">
                <Button
                  size="lg"
                  className="bg-white text-rose-600 hover:bg-white/90 font-bold px-8 py-6 rounded-full"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default ValentineCollection;
