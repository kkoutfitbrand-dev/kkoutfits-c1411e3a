import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Percent, Tag, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Floating sale tags animation
const FloatingSaleTag = ({ delay, x, y, rotation }: { delay: number; x: number; y: number; rotation: number }) => (
  <motion.div
    className="absolute"
    style={{ left: `${x}%`, top: `${y}%` }}
    initial={{ opacity: 0, scale: 0, rotate: rotation - 20 }}
    animate={{ 
      opacity: [0, 0.6, 0],
      scale: [0, 1, 0.8],
      rotate: [rotation - 20, rotation, rotation + 10],
      y: [0, -20, -40]
    }}
    transition={{ duration: 4, delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    <Tag className="text-primary/40 w-4 h-4 sm:w-6 sm:h-6" />
  </motion.div>
);

// Animated discount badge
const DiscountBadge = ({ percent, className }: { percent: number; className?: string }) => (
  <motion.div
    className={`relative ${className}`}
    animate={{ 
      scale: [1, 1.05, 1],
      rotate: [0, 2, -2, 0]
    }}
    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
  >
    <div className="relative">
      <motion.div
        className="absolute inset-0 rounded-full blur-xl bg-primary/30"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-2xl border-4 border-primary-foreground/20">
        <div className="text-center">
          <span className="block text-2xl sm:text-3xl md:text-4xl font-black text-primary-foreground leading-none">
            {percent}%
          </span>
          <span className="block text-xs sm:text-sm font-bold text-primary-foreground/90 uppercase tracking-wider">
            OFF
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

// Shimmer effect
const ShimmerLine = () => (
  <motion.div
    className="absolute inset-0 overflow-hidden"
    initial={{ x: '-100%' }}
    animate={{ x: '200%' }}
    transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
  >
    <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
  </motion.div>
);

export const MegaSaleBanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="relative min-h-[380px] sm:min-h-[420px] md:min-h-[480px]">
        {/* Dynamic gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted to-background" />
        
        {/* Accent color overlay */}
        <motion.div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
                         radial-gradient(ellipse at 70% 30%, hsl(var(--accent) / 0.1) 0%, transparent 40%),
                         radial-gradient(ellipse at 50% 80%, hsl(var(--secondary) / 0.1) 0%, transparent 50%)`
          }}
        />

        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Animated top border */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Floating sale tags */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <FloatingSaleTag x={8} y={25} rotation={-15} delay={0} />
          <FloatingSaleTag x={88} y={20} rotation={20} delay={0.8} />
          <FloatingSaleTag x={75} y={65} rotation={-10} delay={1.6} />
          <FloatingSaleTag x={15} y={70} rotation={15} delay={2.4} />
          <FloatingSaleTag x={45} y={15} rotation={-5} delay={3.2} />
        </div>

        {/* Discount Badge - Right side (hidden on very small screens) */}
        <div className="absolute right-4 sm:right-8 md:right-16 lg:right-24 top-1/2 -translate-y-1/2 hidden sm:block">
          <DiscountBadge percent={70} />
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 flex items-center min-h-[380px] sm:min-h-[420px] md:min-h-[480px]">
          <div className="max-w-2xl py-8 sm:py-10">
            
            {/* Sale Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-4 sm:mb-5 inline-block"
            >
              <div className="relative overflow-hidden">
                <ShimmerLine />
                <div className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full">
                  <Zap className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-xs sm:text-sm font-bold tracking-widest text-primary uppercase">
                    Limited Time Offer
                  </span>
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-3 sm:mb-4"
            >
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[0.9]">
                MEGA
              </span>
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
                  SALE
                </span>
              </span>
            </motion.h1>

            {/* Mobile discount badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="sm:hidden mb-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary rounded-full">
                <Percent className="w-5 h-5 text-primary-foreground" />
                <span className="text-xl font-black text-primary-foreground">UP TO 70% OFF</span>
              </div>
            </motion.div>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground mb-2 max-w-lg"
            >
              Unbeatable prices on premium fashion. 
              <span className="text-foreground font-semibold"> Shop now</span> before it's gone!
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8"
            >
              {['Free Shipping', 'Easy Returns', 'Best Prices'].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {feature}
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Link to="/shop">
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl w-full sm:w-auto"
                >
                  <ShimmerLine />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Shop the Sale
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              
              <Link to="/trending">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-semibold px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 w-full sm:w-auto"
                >
                  View Trending
                </Button>
              </Link>
            </motion.div>

            {/* Urgency text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-5 sm:mt-6 text-xs text-muted-foreground flex items-center gap-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--myntra-green))] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--myntra-green))]"></span>
              </span>
              <span>2,847 customers shopping now</span>
            </motion.p>
          </div>
        </div>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(90deg, hsl(var(--accent)), hsl(var(--primary)), hsl(var(--accent)))' }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
      </div>
    </section>
  );
};

export default MegaSaleBanner;
