import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useValentineCountdown } from '@/hooks/useValentineCountdown';
import { HeartConfetti } from '@/components/HeartConfetti';

// Floating hearts animation
const FloatingHeart = ({
  delay,
  x,
  size = 'md',
}: {
  delay: number;
  x: number;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizes = { sm: 'w-3 h-3', md: 'w-5 h-5', lg: 'w-7 h-7' };
  
  return (
    <motion.div
      className="absolute bottom-0"
      style={{ left: `${x}%` }}
      initial={{ y: 0, opacity: 0, scale: 0 }}
      animate={{
        y: [0, -400, -500],
        opacity: [0, 0.8, 0],
        scale: [0.5, 1, 0.8],
        rotate: [0, 15, -10, 0],
      }}
      transition={{
        duration: 7,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    >
      <Heart className={`${sizes[size]} fill-rose-400/60 text-rose-400/60`} />
    </motion.div>
  );
};

// Falling rose petals
const FallingPetal = ({ delay, x }: { delay: number; x: number }) => (
  <motion.div
    className="absolute top-0"
    style={{ left: `${x}%` }}
    initial={{ y: -20, opacity: 0, rotate: 0 }}
    animate={{
      y: [0, 500],
      opacity: [0, 0.6, 0],
      rotate: [0, 180, 360],
      x: [0, 30, -20, 10],
    }}
    transition={{
      duration: 10,
      delay,
      repeat: Infinity,
      ease: 'linear',
    }}
  >
    <div className="w-3 h-4 bg-gradient-to-br from-rose-300 to-pink-400 rounded-full transform rotate-45 opacity-50" />
  </motion.div>
);

// Sparkle effect
const Sparkle = ({ delay, x, y }: { delay: number; x: number; y: number }) => (
  <motion.div
    className="absolute"
    style={{ left: `${x}%`, top: `${y}%` }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    <Sparkles className="w-4 h-4 text-amber-400" />
  </motion.div>
);

// Animated discount badge with heart shape
const HeartBadge = ({ percent }: { percent: number }) => (
  <motion.div
    className="relative"
    animate={{
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    {/* Glow effect */}
    <motion.div
      className="absolute inset-0 rounded-full blur-2xl"
      style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.4) 0%, transparent 70%)' }}
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
    
    <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 flex items-center justify-center">
      {/* Heart shape background */}
      <Heart className="absolute w-full h-full fill-rose-500 text-rose-500 drop-shadow-xl" />
      
      {/* Discount text */}
      <div className="relative text-center z-10">
        <span className="block text-2xl sm:text-3xl md:text-4xl font-black text-white leading-none drop-shadow-md">
          {percent}%
        </span>
        <span className="block text-xs sm:text-sm font-bold text-white/90 uppercase tracking-wider">
          OFF
        </span>
      </div>
    </div>
  </motion.div>
);

// Countdown timer unit
const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <motion.div
      key={value}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg"
    >
      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md">
        {value.toString().padStart(2, '0')}
      </span>
    </motion.div>
    <span className="mt-1 text-[10px] sm:text-xs font-semibold text-white/80 uppercase tracking-wider">
      {label}
    </span>
  </div>
);

// Shimmer effect for buttons
const ShimmerLine = () => (
  <motion.div
    className="absolute inset-0 overflow-hidden rounded-full"
    initial={{ x: '-100%' }}
    animate={{ x: '200%' }}
    transition={{
      duration: 2.5,
      repeat: Infinity,
      ease: 'linear',
      repeatDelay: 1,
    }}
  >
    <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
  </motion.div>
);

export const MegaSaleBanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const countdown = useValentineCountdown();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  const handleShopClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowConfetti(true);
    // Navigate after a short delay to let confetti start
    setTimeout(() => {
      navigate('/valentine-collection');
    }, 500);
  };

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Heart Confetti */}
      <HeartConfetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="relative min-h-[480px] sm:min-h-[500px] md:min-h-[520px]">
        
        {/* Base gradient background - romantic rose colors */}
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
              'radial-gradient(ellipse at 30% 50%, rgba(244,63,94,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(251,113,133,0.1) 0%, transparent 40%)',
              'radial-gradient(ellipse at 40% 40%, rgba(244,63,94,0.2) 0%, transparent 50%), radial-gradient(ellipse at 60% 60%, rgba(251,113,133,0.15) 0%, transparent 40%)',
              'radial-gradient(ellipse at 30% 50%, rgba(244,63,94,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(251,113,133,0.1) 0%, transparent 40%)',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Subtle heart pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='%23be123c'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Top decorative border */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{
            background: 'linear-gradient(90deg, hsl(340 80% 60%), hsl(0 80% 60%), hsl(43 96% 56%), hsl(340 80% 60%))',
          }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Floating hearts - reduced on mobile */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <FloatingHeart x={5} delay={0} size="sm" />
          <FloatingHeart x={15} delay={1.5} size="md" />
          <FloatingHeart x={85} delay={0.8} size="lg" />
          <FloatingHeart x={92} delay={2.2} size="sm" />
          <div className="hidden sm:block">
            <FloatingHeart x={25} delay={3} size="sm" />
            <FloatingHeart x={75} delay={1.2} size="md" />
            <FloatingHeart x={45} delay={4} size="sm" />
          </div>
        </div>

        {/* Falling petals */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <FallingPetal x={10} delay={0} />
          <FallingPetal x={90} delay={2} />
          <div className="hidden sm:block">
            <FallingPetal x={30} delay={4} />
            <FallingPetal x={70} delay={6} />
            <FallingPetal x={50} delay={8} />
          </div>
        </div>

        {/* Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          <Sparkle x={20} y={20} delay={0} />
          <Sparkle x={80} y={30} delay={1} />
          <Sparkle x={60} y={70} delay={2} />
          <div className="hidden sm:block">
            <Sparkle x={40} y={15} delay={1.5} />
            <Sparkle x={90} y={60} delay={2.5} />
          </div>
        </div>

        {/* Heart Badge - positioned right on desktop */}
        <div className="absolute right-4 sm:right-8 md:right-16 lg:right-24 top-1/2 -translate-y-1/2 hidden sm:block">
          <HeartBadge percent={50} />
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 flex items-center min-h-[480px] sm:min-h-[500px] md:min-h-[520px]">
          <div className="max-w-2xl py-10 sm:py-12">
            
            {/* Valentine's Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-4 sm:mb-5 inline-block"
            >
              <div className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-white/30 backdrop-blur-sm border border-rose-300/40 rounded-full shadow-sm">
                <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                <span className="text-xs sm:text-sm font-bold tracking-widest text-rose-700 uppercase">
                  Valentine's Special
                </span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-3 sm:mb-4"
            >
              <span className="flex items-center gap-2 sm:gap-3 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-rose-800 leading-[0.9]">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 fill-rose-600 text-rose-600" />
                LOVE YOUR
              </span>
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mt-1">
                <span 
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, hsl(340 82% 52%) 0%, hsl(0 80% 50%) 50%, hsl(340 70% 45%) 100%)',
                  }}
                >
                  STYLE SALE
                </span>
              </span>
            </motion.h1>

            {/* Mobile discount badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="sm:hidden mb-4 flex justify-center"
            >
              <HeartBadge percent={50} />
            </motion.div>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-rose-700/80 mb-2 max-w-lg"
            >
              Celebrate love with exclusive fashion deals. 
              <span className="text-rose-800 font-semibold"> Shop now</span> for your perfect look!
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-3 sm:gap-4 mb-6"
            >
              {['Free Shipping', 'Gift Wrapping', 'Best Prices'].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-1.5 text-xs sm:text-sm text-rose-700/80"
                >
                  <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                  {feature}
                </motion.div>
              ))}
            </motion.div>

            {/* Smart Countdown Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-6 sm:mb-8"
            >
              {countdown.status === 'coming-soon' && (
                <div className="inline-flex items-center gap-3 px-5 py-3 bg-rose-600/20 backdrop-blur-sm rounded-xl border border-rose-400/30">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <div>
                    <span className="block text-sm font-bold text-rose-800">Coming Soon!</span>
                    <span className="text-xs text-rose-700/80">Valentine's Sale starts in {countdown.days} days</span>
                  </div>
                </div>
              )}

              {countdown.status === 'countdown' && (
                <div className="bg-rose-600/30 backdrop-blur-sm rounded-2xl p-4 inline-block border border-rose-400/30">
                  <p className="text-xs sm:text-sm font-semibold text-rose-800 mb-3 text-center">
                    ❤️ Sale ends in:
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <CountdownUnit value={countdown.days} label="Days" />
                    <span className="text-2xl font-bold text-white/60 pb-5">:</span>
                    <CountdownUnit value={countdown.hours} label="Hours" />
                    <span className="text-2xl font-bold text-white/60 pb-5">:</span>
                    <CountdownUnit value={countdown.minutes} label="Mins" />
                    <span className="text-2xl font-bold text-white/60 pb-5">:</span>
                    <CountdownUnit value={countdown.seconds} label="Secs" />
                  </div>
                </div>
              )}

              {countdown.status === 'ended' && (
                <div className="inline-flex items-center gap-3 px-5 py-3 bg-rose-600/20 backdrop-blur-sm rounded-xl border border-rose-400/30">
                  <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                  <span className="text-sm font-semibold text-rose-800">Thank you for celebrating with us! 💕</span>
                </div>
              )}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Button
                size="lg"
                onClick={handleShopClick}
                className="group relative overflow-hidden font-bold px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl w-full sm:w-auto text-white"
                style={{
                  background: 'linear-gradient(135deg, hsl(340 82% 52%) 0%, hsl(0 80% 50%) 100%)',
                }}
              >
                <ShimmerLine />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4 fill-current" />
                  Shop the Sale
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              
              <Link to="/valentine-collection">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-semibold px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full border-2 border-rose-400 text-rose-700 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 w-full sm:w-auto backdrop-blur-sm"
                >
                  View Collection
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom decorative border */}
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
  );
};

export default MegaSaleBanner;
