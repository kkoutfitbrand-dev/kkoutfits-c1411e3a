import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Gift, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import pongalBanner from '@/assets/pongal-banner.jpg';

// Floating particle component for festive sparkles
const FloatingParticle = ({
  delay,
  x
}: {
  delay: number;
  x: number;
}) => <motion.div className="absolute w-2 h-2 rounded-full bg-amber-400/60" style={{
  left: `${x}%`
}} initial={{
  y: '100%',
  opacity: 0
}} animate={{
  y: '-100%',
  opacity: [0, 1, 1, 0]
}} transition={{
  duration: 4,
  delay,
  repeat: Infinity,
  ease: 'linear'
}} />;

// Glowing lamp effect
const GlowingLamp = ({
  x,
  delay
}: {
  x: number;
  delay: number;
}) => <motion.div className="absolute bottom-20" style={{
  left: `${x}%`
}} animate={{
  opacity: [0.5, 1, 0.5],
  scale: [1, 1.1, 1]
}} transition={{
  duration: 2,
  delay,
  repeat: Infinity,
  ease: 'easeInOut'
}}>
    <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_20px_10px_rgba(251,191,36,0.4)]" />
  </motion.div>;
export const PongalBanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    amount: 0.3
  });
  return <section ref={ref} className="relative overflow-hidden">
      <div className="relative min-h-[500px] md:min-h-[600px]">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: `url(${pongalBanner})`
      }}>
          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[10, 25, 40, 55, 70, 85].map((x, i) => <FloatingParticle key={i} x={x} delay={i * 0.5} />)}
        </div>

        {/* Glowing Lamps */}
        <GlowingLamp x={15} delay={0} />
        <GlowingLamp x={85} delay={0.5} />

        {/* Kolam Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, transparent 0%, transparent 40%, rgba(255,215,0,0.1) 40%, rgba(255,215,0,0.1) 42%, transparent 42%)`,
        backgroundSize: '60px 60px'
      }} />

        {/* Main Content */}
        <div className="container mx-auto px-4 relative z-10 flex items-center min-h-[500px] md:min-h-[600px]">
          <div className="max-w-2xl py-12">
            {/* Festival Badge */}
            <motion.div initial={{
            opacity: 0,
            y: -20
          }} animate={isInView ? {
            opacity: 1,
            y: 0
          } : {}} transition={{
            duration: 0.6
          }} className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/30 to-amber-500/30 border border-amber-500/40 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-amber-200 text-sm font-medium tracking-wide">PONGAL CELEBRATION 2026</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 initial={{
            opacity: 0,
            x: -30
          }} animate={isInView ? {
            opacity: 1,
            x: 0
          } : {}} transition={{
            duration: 0.8,
            delay: 0.2
          }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent drop-shadow-lg">
                Happy Pongal
              </span>
            </motion.h1>

            {/* Tamil Text */}
            <motion.p initial={{
            opacity: 0,
            x: -30
          }} animate={isInView ? {
            opacity: 1,
            x: 0
          } : {}} transition={{
            duration: 0.6,
            delay: 0.3
          }} className="text-lg sm:text-xl text-amber-300/90 font-medium mb-2">
              பொங்கல் கொண்டாட்டம் – பாரம்பரியத்தில் ஸ்டைல்
            </motion.p>

            {/* Subheading */}
            <motion.p initial={{
            opacity: 0,
            x: -30
          }} animate={isInView ? {
            opacity: 1,
            x: 0
          } : {}} transition={{
            duration: 0.6,
            delay: 0.4
          }} className="text-xl sm:text-2xl text-white/90 font-light mb-8">
              Celebrate Tradition in <span className="text-amber-400 font-semibold">Style</span>
            </motion.p>

            {/* Offer Badge */}
            <motion.div initial={{
            opacity: 0,
            scale: 0.8
          }} animate={isInView ? {
            opacity: 1,
            scale: 1
          } : {}} transition={{
            duration: 0.5,
            delay: 0.5
          }} className="mb-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg blur-lg opacity-50 animate-pulse" />
                
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={isInView ? {
            opacity: 1,
            y: 0
          } : {}} transition={{
            duration: 0.6,
            delay: 0.6
          }}>
              <Link to="/shop">
                <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-8 py-6 text-lg rounded-full shadow-[0_0_30px_rgba(251,146,60,0.4)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(251,146,60,0.6)]">
                  <span className="relative z-10 flex items-center gap-2">
                    Shop Pongal Collection
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 40L60 35C120 30 240 20 360 25C480 30 600 50 720 55C840 60 960 50 1080 40C1200 30 1320 20 1380 15L1440 10V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V40Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </div>
    </section>;
};
export default PongalBanner;