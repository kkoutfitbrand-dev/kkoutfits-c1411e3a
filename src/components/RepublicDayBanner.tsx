import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Animated star burst
const StarBurst = ({ delay, size, x, y }: { delay: number; size: number; x: number; y: number }) => (
  <motion.div
    className="absolute"
    style={{ left: `${x}%`, top: `${y}%` }}
    initial={{ scale: 0, rotate: 0, opacity: 0 }}
    animate={{ 
      scale: [0, 1, 0],
      rotate: [0, 180],
      opacity: [0, 1, 0]
    }}
    transition={{ duration: 3, delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    <Star className="text-amber-300/60" style={{ width: size, height: size }} fill="currentColor" />
  </motion.div>
);

// Tricolor ribbon
const TricolorRibbon = ({ className }: { className?: string }) => (
  <div className={`flex ${className}`}>
    <div className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400" />
    <div className="flex-1 bg-gradient-to-r from-white to-gray-100" />
    <div className="flex-1 bg-gradient-to-r from-green-600 to-green-500" />
  </div>
);

// Animated Ashoka Chakra with glow
const GlowingChakra = ({ size = 120, className = '' }: { size?: number; className?: string }) => (
  <motion.div className={`relative ${className}`}>
    <motion.div
      className="absolute inset-0 rounded-full blur-xl"
      style={{ background: 'radial-gradient(circle, rgba(0,56,147,0.4) 0%, transparent 70%)' }}
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
    >
      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0, 56, 147, 0.6)" strokeWidth="3" />
      <circle cx="50" cy="50" r="10" fill="rgba(0, 56, 147, 0.8)" />
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="50"
          y1="50"
          x2="50"
          y2="8"
          stroke="rgba(0, 56, 147, 0.6)"
          strokeWidth="2"
          transform={`rotate(${i * 15} 50 50)`}
        />
      ))}
    </motion.svg>
  </motion.div>
);

export const RepublicDayBanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="relative min-h-[420px] sm:min-h-[480px] md:min-h-[560px]">
        {/* Luxurious dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-neutral-900 to-zinc-950" />
        
        {/* Golden mesh pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(251, 191, 36, 0.15) 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, rgba(34, 197, 94, 0.15) 0%, transparent 50%),
                              radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.1) 0%, transparent 60%)`
          }}
        />

        {/* Animated tricolor glow bands */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1 sm:h-1.5"
          style={{ background: 'linear-gradient(90deg, #FF9933, #FFFFFF, #138808)' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 sm:h-1.5"
          style={{ background: 'linear-gradient(90deg, #138808, #FFFFFF, #FF9933)' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />

        {/* Star bursts */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <StarBurst x={10} y={20} size={16} delay={0} />
          <StarBurst x={85} y={15} size={12} delay={0.5} />
          <StarBurst x={70} y={70} size={14} delay={1} />
          <StarBurst x={20} y={75} size={10} delay={1.5} />
          <StarBurst x={50} y={10} size={18} delay={2} />
        </div>

        {/* Glowing Chakra - Right side */}
        <div className="absolute right-4 sm:right-8 md:right-16 top-1/2 -translate-y-1/2 opacity-20 sm:opacity-30">
          <GlowingChakra size={120} className="sm:hidden" />
          <GlowingChakra size={180} className="hidden sm:block md:hidden" />
          <GlowingChakra size={240} className="hidden md:block" />
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 flex items-center justify-center min-h-[420px] sm:min-h-[480px] md:min-h-[560px]">
          <div className="text-center max-w-3xl py-8 sm:py-10">
            
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-4 sm:mb-6 inline-block"
            >
              <div className="relative">
                <TricolorRibbon className="h-1 w-full absolute -top-2 rounded-full" />
                <div className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span 
                    className="text-xs sm:text-sm font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-green-400"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    KKOUTFITS • REPUBLIC DAY 2026
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <TricolorRibbon className="h-1 w-full absolute -bottom-2 rounded-full" />
              </div>
            </motion.div>

            {/* Main Heading - Elegant serif */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-3 sm:mb-4"
            >
              <span 
                className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
                style={{ 
                  fontFamily: "'Playfair Display', Georgia, serif",
                  background: 'linear-gradient(135deg, #FF9933 0%, #FFD700 25%, #FFFFFF 50%, #90EE90 75%, #138808 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 60px rgba(255, 153, 51, 0.3)'
                }}
              >
                Republic Day
              </span>
              <motion.span 
                className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white/90 mt-1 sm:mt-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '0.1em' }}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Season Started
              </motion.span>
            </motion.h1>

            {/* Subheading - Modern sans */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg sm:text-xl md:text-2xl text-white/80 font-light mb-2 tracking-wide"
            >
              Wear the{' '}
              <span 
                className="font-semibold italic"
                style={{ 
                  background: 'linear-gradient(90deg, #FF9933, #138808)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Pride of India
              </span>
            </motion.p>

            {/* Tamil Text - Elegant styling */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-sm sm:text-base text-amber-300/70 mb-6 sm:mb-8 font-medium"
            >
              இந்திய குடியரசு தினத்தை ஸ்டைலாக கொண்டாடுங்கள்
            </motion.p>

            {/* Decorative divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex items-center justify-center gap-3 mb-6 sm:mb-8"
            >
              <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-orange-400" />
              <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
              <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-green-400" />
            </motion.div>

            {/* CTA Button - Premium style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Link to="/shop">
                <Button
                  size="lg"
                  className="group relative overflow-hidden text-zinc-900 font-bold px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700)',
                    boxShadow: '0 0 40px rgba(255, 215, 0, 0.4), 0 10px 30px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.4), transparent, rgba(255,255,255,0.2))'
                    }}
                  />
                  <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                    Shop Republic Day Collection
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-5 sm:mt-6 text-xs sm:text-sm text-white/40 tracking-widest uppercase"
            >
              Celebrate Freedom with Fashion
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RepublicDayBanner;
