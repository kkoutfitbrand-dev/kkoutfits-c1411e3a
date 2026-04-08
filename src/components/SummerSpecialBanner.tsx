import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Shield, Gem, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const highlights = [
  { label: '🆕 New Arrivals', delay: 0.3 },
  { label: '✨ Limited Edition', delay: 0.4 },
  { label: '🔥 Flat 40% Off', delay: 0.5 },
];

const offers = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999' },
  { icon: Shield, title: 'Premium Quality', desc: '100% authentic fabrics' },
  { icon: Gem, title: 'Exclusive Styles', desc: 'Curated collections' },
];

const floatingParticles = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 10 + 6,
  delay: Math.random() * 4,
  duration: Math.random() * 6 + 8,
}));

export const SummerSpecialBanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(56,189,248,0.15),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(245,158,11,0.1),_transparent_60%)]" />

      {/* Floating particles */}
      {floatingParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(p.id) * 15, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        >
          <Sparkles className="text-amber-400" style={{ width: p.size, height: p.size }} />
        </motion.div>
      ))}

      {/* Content */}
      <div className="container relative z-10 px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <span className="inline-block text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-2">
                ☀️ Summer 2026
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="text-white">Summer </span>
                <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                  Specials
                </span>
              </h2>
              <p className="text-sky-200/80 text-sm md:text-base mt-3 max-w-md">
                Elevate your wardrobe with our handpicked summer collection — fresh styles, premium fabrics, unbeatable prices.
              </p>
            </motion.div>

            {/* Highlight chips */}
            <div className="flex flex-wrap gap-2">
              {highlights.map((h) => (
                <motion.span
                  key={h.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: h.delay, ease: 'easeOut' }}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 text-white backdrop-blur-sm border border-white/10"
                >
                  {h.label}
                </motion.span>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button
                asChild
                size="lg"
                className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold group"
              >
                <Link to="/shop">
                  Explore Summer Collection
                  <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  {/* Shimmer */}
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-[shimmer_2.5s_infinite]" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right - Glassmorphism card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            className="relative"
          >
            <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 space-y-5">
              <h3 className="text-white font-semibold text-lg tracking-wide">Why Shop With Us</h3>
              {offers.map((offer, i) => (
                <motion.div
                  key={offer.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.15 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <offer.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{offer.title}</p>
                    <p className="text-sky-200/60 text-xs">{offer.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Glow effect behind card */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500/20 via-sky-400/10 to-amber-500/20 blur-xl -z-10 animate-pulse" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
