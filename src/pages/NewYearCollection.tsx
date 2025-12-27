import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Gift, Percent, Timer, PartyPopper } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const NewYearCollection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2026-01-01T00:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { data: products, isLoading } = useQuery({
    queryKey: ['new-year-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .limit(12);

      if (error) throw error;
      return data;
    },
  });

  const offers = [
    {
      icon: Percent,
      title: 'FLAT 50% OFF',
      description: 'On all New Year collection items',
      code: 'NEWYEAR50',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Gift,
      title: 'FREE GIFT',
      description: 'On orders above ₹5000',
      code: 'FREEGIFT',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Timer,
      title: 'EXTRA 10% OFF',
      description: 'For first 100 orders daily',
      code: 'FIRST100',
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section 
        className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0c1929 0%, #1a1a2e 25%, #16213e 50%, #0f0f23 75%, #1a0a2e 100%)',
        }}
      >
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-amber-400"
              style={{
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-600/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-amber-500/20 rounded-full blur-[100px]" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 mb-6">
              <PartyPopper className="w-4 h-4 text-amber-400" />
              <span className="text-amber-200 text-sm">Limited Time Collection</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                New Year 2026
              </span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Celebrate the new year in style with our exclusive collection
            </p>

            {/* Mini countdown */}
            <div className="flex items-center justify-center gap-4 text-white">
              <span className="text-amber-400 text-sm">Offer ends in:</span>
              <div className="flex gap-2">
                <div className="bg-white/10 backdrop-blur-sm rounded px-3 py-1">
                  <span className="text-lg font-bold">{timeLeft.days}</span>
                  <span className="text-xs text-white/60">d</span>
                </div>
                <span className="text-amber-400">:</span>
                <div className="bg-white/10 backdrop-blur-sm rounded px-3 py-1">
                  <span className="text-lg font-bold">{timeLeft.hours}</span>
                  <span className="text-xs text-white/60">h</span>
                </div>
                <span className="text-amber-400">:</span>
                <div className="bg-white/10 backdrop-blur-sm rounded px-3 py-1">
                  <span className="text-lg font-bold">{timeLeft.minutes}</span>
                  <span className="text-xs text-white/60">m</span>
                </div>
                <span className="text-amber-400">:</span>
                <div className="bg-white/10 backdrop-blur-sm rounded px-3 py-1">
                  <span className="text-lg font-bold">{timeLeft.seconds}</span>
                  <span className="text-xs text-white/60">s</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((offer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl blur-xl" 
                     style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
                <div className="relative bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${offer.color} mb-4`}>
                    <offer.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                  <p className="text-muted-foreground mb-4">{offer.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Use code:</span>
                    <Badge variant="secondary" className="font-mono">{offer.code}</Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-amber-600 font-medium">Featured Products</span>
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">New Year Collection</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our handpicked selection of festive wear perfect for celebrating the new year
              </p>
            </motion.div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[3/4] rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products?.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="relative">
                    <Badge className="absolute top-2 left-2 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                      50% OFF
                    </Badge>
                    <ProductCard
                      id={product.id}
                      name={product.title}
                      price={product.price_cents / 100}
                      originalPrice={(product.price_cents / 100) * 2}
                      image={(product.images as string[])?.[0] || '/placeholder.svg'}
                      category={product.category || 'Clothing'}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Don't Miss Out on Our New Year Sale!
            </h2>
            <p className="text-white/90 text-lg mb-6">
              Use code <span className="font-bold">NEWYEAR50</span> for flat 50% off
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/shop" 
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-orange-600 font-bold rounded-full hover:bg-white/90 transition-colors"
              >
                Shop All Products
              </a>
              <a 
                href="/category/festive" 
                className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors"
              >
                View Festive Wear
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NewYearCollection;
