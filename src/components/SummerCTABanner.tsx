import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ScrollReveal';

const discountBadges = [
  { value: '30%', x: 8, y: 15, delay: 0 },
  { value: '40%', x: 75, y: 20, delay: 1.5 },
  { value: '50%', x: 85, y: 65, delay: 3 },
  { value: '25%', x: 5, y: 70, delay: 2 },
];

const dots = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 3,
}));

export const SummerCTABanner = () => {
  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      {/* Warm gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, hsl(25 80% 12%) 0%, hsl(200 60% 15%) 50%, hsl(25 80% 12%) 100%)',
        }}
      />

      {/* Animated particle dots */}
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full bg-white/10"
          style={{ left: `${dot.x}%`, top: `${dot.y}%`, width: dot.size, height: dot.size }}
          animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.5, 1] }}
          transition={{ duration: dot.duration, repeat: Infinity, delay: dot.delay }}
        />
      ))}

      {/* Floating discount badges - hidden on mobile for cleanliness */}
      <div className="hidden md:block">
        {discountBadges.map((badge, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${badge.x}%`, top: `${badge.y}%` }}
            animate={{
              y: [0, -12, 0],
              rotate: [-5, 5, -5],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: badge.delay }}
          >
            <div className="px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 backdrop-blur-sm">
              <span className="text-amber-300 font-bold text-sm">{badge.value} OFF</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Wave pattern at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 40" className="w-full" preserveAspectRatio="none">
          <path d="M0,20 Q200,0 400,20 T800,20 T1200,20 L1200,40 L0,40 Z" fill="rgba(255,255,255,0.03)" />
        </svg>
      </div>

      <div className="container px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-4">
                🔥 Don't Miss Out
              </span>

              <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">
                Summer Deals Are{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-sky-300">
                  Going Fast
                </span>
              </h2>

              <p className="text-white/60 mt-3 text-sm md:text-base max-w-lg mx-auto">
                Grab the hottest styles of the season before they're gone. New arrivals added daily.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/shop">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 px-8 group">
                  Shop Summer Sale
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/trending">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Trending
                </Button>
              </Link>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
