import { motion } from 'framer-motion';
import { Heart, Gift, Sparkles, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ProductCard } from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/HomeSkeleton';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

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

// Floating decorative heart
const DecorativeHeart = ({ className }: { className?: string }) => (
  <motion.div
    className={className}
    animate={{
      y: [0, -10, 0],
      rotate: [-5, 5, -5],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    <Heart className="w-full h-full fill-rose-400/30 text-rose-400/30" />
  </motion.div>
);

// Gift categories
const giftCategories = [
  {
    id: 'for-her',
    title: 'For Her',
    subtitle: 'Elegant picks she\'ll love',
    icon: Heart,
    gradient: 'from-rose-500 to-pink-500',
    bgGradient: 'from-rose-50 to-pink-50',
    link: '/category/women',
  },
  {
    id: 'for-him',
    title: 'For Him',
    subtitle: 'Stylish finds for him',
    icon: Gift,
    gradient: 'from-rose-600 to-red-500',
    bgGradient: 'from-rose-50 to-red-50',
    link: '/category/men',
  },
  {
    id: 'couple',
    title: 'Couple\'s Edit',
    subtitle: 'Match your love',
    icon: Sparkles,
    gradient: 'from-pink-500 to-rose-400',
    bgGradient: 'from-pink-50 to-rose-50',
    link: '/trending',
  },
];

export const ValentineGiftGuide = () => {
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
          .limit(4);

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
    <section className="relative overflow-hidden py-12 md:py-16">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(340 100% 97%) 0%, hsl(0 0% 100%) 100%)',
        }}
      />

      {/* Decorative hearts */}
      <DecorativeHeart className="absolute top-8 left-8 w-8 h-8 hidden md:block" />
      <DecorativeHeart className="absolute top-20 right-16 w-6 h-6 hidden md:block" />
      <DecorativeHeart className="absolute bottom-16 left-20 w-5 h-5 hidden md:block" />

      <div className="container px-4 relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 rounded-full mb-4"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span className="text-sm font-semibold text-rose-600 uppercase tracking-wide">
                Valentine's Special
              </span>
            </motion.div>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Valentine's Gift Guide
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Find the perfect outfit for your special someone this Valentine's Day
            </p>
          </div>
        </ScrollReveal>

        {/* Gift Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {giftCategories.map((category, index) => (
            <ScrollReveal key={category.id} delay={index * 0.1}>
              <Link to={category.link}>
                <motion.div
                  className={`group relative overflow-hidden rounded-2xl p-6 h-40 md:h-48 flex flex-col justify-between cursor-pointer bg-gradient-to-br ${category.bgGradient} border border-rose-100 hover:border-rose-200 transition-colors`}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Icon circle */}
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg`}>
                    <category.icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Text content */}
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {category.subtitle}
                    </p>
                    <div className="flex items-center gap-1 text-rose-600 font-medium text-sm group-hover:gap-2 transition-all">
                      <span>Shop Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Decorative heart */}
                  <div className="absolute -right-4 -bottom-4 opacity-10">
                    <Heart className="w-24 h-24 fill-rose-500 text-rose-500" />
                  </div>
                </motion.div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Featured Products */}
        <ScrollReveal delay={0.2}>
          <div className="bg-white rounded-2xl border border-rose-100 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                  <Star className="w-5 h-5 text-rose-500 fill-rose-500" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Top Picks for Valentine's</h3>
                  <p className="text-sm text-muted-foreground">Curated with love</p>
                </div>
              </div>
              <Link to="/valentine-collection">
                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 border-rose-200 text-rose-600 hover:bg-rose-50">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <ProductGridSkeleton count={4} />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
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

            <div className="text-center mt-6 sm:hidden">
              <Link to="/valentine-collection">
                <Button variant="outline" className="w-full border-rose-200 text-rose-600 hover:bg-rose-50">
                  View All Valentine's Picks
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Promo Banner */}
        <ScrollReveal delay={0.3}>
          <motion.div
            className="mt-8 rounded-2xl p-6 md:p-8 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(340 82% 52%) 0%, hsl(0 80% 50%) 100%)',
            }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            {/* Decorative elements */}
            <Heart className="absolute top-4 left-6 w-8 h-8 text-white/10 fill-white/10" />
            <Heart className="absolute bottom-4 right-8 w-12 h-12 text-white/10 fill-white/10" />

            <div className="relative z-10">
              <p className="text-white/90 text-sm font-medium mb-2">Limited Time Offer</p>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                Use code <span className="underline decoration-2">LOVE50</span> for extra 10% off!
              </h3>
              <p className="text-white/80 text-sm mb-4">
                Free gift wrapping on all Valentine's orders 💝
              </p>
              <Link to="/valentine-collection">
                <Button className="bg-white text-rose-600 hover:bg-white/90 font-semibold">
                  Shop Valentine's Collection
                </Button>
              </Link>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ValentineGiftGuide;
