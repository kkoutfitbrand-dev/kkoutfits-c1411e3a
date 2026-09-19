import { motion } from 'framer-motion';
import { Sun, Shirt, Gem, PartyPopper, ArrowRight, Flame } from 'lucide-react';
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
  if (Array.isArray(images) && images.length > 0) return images[0] as string;
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

const styleCategories = [
  {
    id: 'beach',
    title: 'Beach Vibes',
    subtitle: 'Effortless summer looks',
    icon: Sun,
    gradient: 'from-sky-400 to-cyan-500',
    link: '/shop',
    hot: true,
  },
  {
    id: 'casual',
    title: 'Smart Casuals',
    subtitle: 'Everyday essentials',
    icon: Shirt,
    gradient: 'from-amber-400 to-orange-500',
    link: '/shop',
  },
  {
    id: 'formal',
    title: 'Formal Elegance',
    subtitle: 'Refined & polished',
    icon: Gem,
    gradient: 'from-slate-600 to-slate-800',
    link: '/shop',
  },
  {
    id: 'party',
    title: 'Party Wear',
    subtitle: 'Stand out tonight',
    icon: PartyPopper,
    gradient: 'from-violet-500 to-purple-600',
    link: '/trending',
  },
];

export const SummerStyleGuide = () => {
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
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-12 md:py-16">
      <div className="container px-4">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-10">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold uppercase tracking-widest mb-3"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Sun className="w-3.5 h-3.5" />
              Summer Style Guide
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Dress for the Season
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto text-sm">
              Curated collections for every summer occasion
            </p>
          </div>
        </ScrollReveal>

        {/* Category cards with glow and badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
          {styleCategories.map((cat, i) => (
            <ScrollReveal key={cat.id} delay={i * 0.08} direction="up">
              <Link to={cat.link}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`relative rounded-2xl bg-gradient-to-br ${cat.gradient} p-5 md:p-6 text-white overflow-hidden group cursor-pointer shadow-lg`}
                >
                  {/* Glow border effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      boxShadow: 'inset 0 0 20px rgba(255,255,255,0.2), 0 0 30px rgba(255,255,255,0.1)',
                    }}
                  />

                  {/* HOT badge */}
                  {cat.hot && (
                    <motion.div
                      className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold uppercase"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Flame className="w-3 h-3" />
                      HOT
                    </motion.div>
                  )}

                  <cat.icon className="w-8 h-8 mb-3 opacity-90" />
                  <h3 className="font-bold text-sm md:text-base">{cat.title}</h3>
                  <p className="text-white/70 text-xs mt-1">{cat.subtitle}</p>
                  <ArrowRight className="w-4 h-4 absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Featured products with stagger */}
        <ScrollReveal>
          <h3 className="text-lg font-bold text-foreground mb-4">Top Picks for You</h3>
        </ScrollReveal>
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {products.map((product, i) => {
              const { price, originalPrice } = getDisplayPrice(product);
              return (
                <ScrollReveal key={product.id} delay={i * 0.08} direction="up">
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
      </div>
    </section>
  );
};

export default SummerStyleGuide;
