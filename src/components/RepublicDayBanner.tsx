import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Floating tricolor particle
const TricolorParticle = ({ delay, x, color }: { delay: number; x: number; color: string }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full"
    style={{ left: `${x}%`, backgroundColor: color }}
    initial={{ y: '100%', opacity: 0 }}
    animate={{ y: '-100%', opacity: [0, 0.8, 0.8, 0] }}
    transition={{ duration: 5, delay, repeat: Infinity, ease: 'linear' }}
  />
);

// Ashoka Chakra component
const AshokaChakra = ({ size = 120, className = '' }: { size?: number; className?: string }) => (
  <motion.svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={className}
    animate={{ rotate: 360 }}
    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
  >
    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0, 56, 147, 0.3)" strokeWidth="2" />
    <circle cx="50" cy="50" r="8" fill="rgba(0, 56, 147, 0.4)" />
    {/* 24 spokes */}
    {Array.from({ length: 24 }).map((_, i) => (
      <line
        key={i}
        x1="50"
        y1="50"
        x2="50"
        y2="10"
        stroke="rgba(0, 56, 147, 0.3)"
        strokeWidth="1.5"
        transform={`rotate(${i * 15} 50 50)`}
      />
    ))}
  </motion.svg>
);

// Waving flag stripe
const FlagStripe = ({ color, delay, yOffset }: { color: string; delay: number; yOffset: number }) => (
  <motion.div
    className="absolute h-1/3 w-full"
    style={{ backgroundColor: color, top: `${yOffset}%` }}
    animate={{ 
      scaleX: [1, 1.02, 1],
      opacity: [0.15, 0.25, 0.15]
    }}
    transition={{ duration: 3, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

// Glowing orb
const GlowOrb = ({ x, y, color, delay }: { x: number; y: number; color: string; delay: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: '200px',
      height: '200px',
      backgroundColor: color,
    }}
    animate={{ 
      opacity: [0.2, 0.4, 0.2],
      scale: [1, 1.2, 1]
    }}
    transition={{ duration: 4, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

export const RepublicDayBanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  // Tricolor palette
  const saffron = '#FF9933';
  const white = '#FFFFFF';
  const green = '#138808';
  const navyBlue = '#003893';

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="relative min-h-[500px] md:min-h-[600px]">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        
        {/* Animated Flag Stripes Background */}
        <div className="absolute inset-0 opacity-20 overflow-hidden">
          <FlagStripe color={saffron} delay={0} yOffset={0} />
          <FlagStripe color={white} delay={0.5} yOffset={33} />
          <FlagStripe color={green} delay={1} yOffset={66} />
        </div>

        {/* Glowing Orbs */}
        <GlowOrb x={10} y={20} color={saffron} delay={0} />
        <GlowOrb x={80} y={60} color={green} delay={1.5} />
        <GlowOrb x={50} y={10} color={navyBlue} delay={0.8} />

        {/* Floating Tricolor Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[10, 20, 35, 50, 65, 80, 90].map((x, i) => (
            <TricolorParticle 
              key={i} 
              x={x} 
              delay={i * 0.7} 
              color={i % 3 === 0 ? saffron : i % 3 === 1 ? white : green} 
            />
          ))}
        </div>

        {/* Ashoka Chakra Watermarks */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <AshokaChakra size={300} className="absolute -right-20 top-1/2 -translate-y-1/2 opacity-10" />
          <AshokaChakra size={150} className="absolute left-10 bottom-20 opacity-5" />
        </div>

        {/* Diagonal Tricolor Accent */}
        <motion.div 
          className="absolute top-0 right-0 w-2 h-full"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="h-1/3 w-full" style={{ backgroundColor: saffron }} />
          <div className="h-1/3 w-full" style={{ backgroundColor: white }} />
          <div className="h-1/3 w-full" style={{ backgroundColor: green }} />
        </motion.div>

        {/* Main Content */}
        <div className="container mx-auto px-4 relative z-10 flex items-center min-h-[500px] md:min-h-[600px]">
          <div className="max-w-2xl py-12">
            {/* Festival Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 via-white/10 to-green-500/20 border border-white/20 backdrop-blur-sm">
                <span className="text-lg">🇮🇳</span>
                <span className="text-white/90 text-sm font-semibold tracking-wide">
                  KKOUTFITS – REPUBLIC DAY CELEBRATION 2026
                </span>
                <span className="text-lg">🇮🇳</span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent drop-shadow-lg">
                Republic Day Season
              </span>
              <br />
              <motion.span 
                className="text-white"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Started
              </motion.span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl sm:text-2xl text-white/90 font-light mb-2"
            >
              Wear the <span className="font-semibold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">Pride of India</span>
            </motion.p>

            {/* Tamil Text */}
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg text-orange-300/80 font-medium mb-8"
            >
              இந்திய குடியரசு தினத்தை ஸ்டைலாக கொண்டாடுங்கள்
            </motion.p>

            {/* Decorative Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-1 w-32 mb-8 rounded-full origin-left"
              style={{ 
                background: `linear-gradient(90deg, ${saffron}, ${white}, ${green})`
              }}
            />

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link to="/shop">
                <Button
                  size="lg"
                  className="group relative overflow-hidden text-white font-bold px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${saffron}, ${green})`,
                    boxShadow: `0 0 30px rgba(255, 153, 51, 0.4), 0 0 30px rgba(19, 136, 8, 0.3)`
                  }}
                >
                  {/* Hover glow overlay */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, rgba(255,255,255,0.2), transparent, rgba(255,255,255,0.1))`
                    }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    <Flag className="w-5 h-5" />
                    Shop Republic Day Collection
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </motion.div>

            {/* Small tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-6 text-sm text-white/50"
            >
              Celebrate freedom with fashion • Limited edition collection
            </motion.p>
          </div>

          {/* Right Side Decorative Element */}
          <motion.div
            className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              <AshokaChakra size={200} className="opacity-30" />
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                  style={{ backgroundColor: 'rgba(0, 56, 147, 0.3)' }}
                >
                  🇮🇳
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Wave with Tricolor */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <defs>
              <linearGradient id="tricolorWave" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={saffron} stopOpacity="0.3" />
                <stop offset="50%" stopColor={white} stopOpacity="0.2" />
                <stop offset="100%" stopColor={green} stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path
              d="M0 40L60 35C120 30 240 20 360 25C480 30 600 50 720 55C840 60 960 50 1080 40C1200 30 1320 20 1380 15L1440 10V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V40Z"
              fill="url(#tricolorWave)"
            />
            <path
              d="M0 50L60 45C120 40 240 30 360 35C480 40 600 55 720 58C840 62 960 55 1080 48C1200 40 1320 32 1380 28L1440 24V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V50Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default RepublicDayBanner;
