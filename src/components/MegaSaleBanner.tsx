import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sun, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSummerCountdown } from '@/hooks/useSummerCountdown';
import { StarConfetti } from '@/components/StarConfetti';

// Floating sun particle
const FloatingSun = ({
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
        opacity: [0, 0.6, 0],
        scale: [0.5, 1, 0.8],
        rotate: [0, 180],
      }}
      transition={{ duration: 8, delay, repeat: Infinity, ease: 'easeOut' }}
    >
      <Sparkles className={`${sizes[size]} text-amber-300/50`} />
    </motion.div>
  );
};

// Sparkle effect
const SparkleEffect = ({ delay, x, y }: { delay: number; x: number; y: number }) => (
  <motion.div
    className="absolute"
    style={{ left: `${x}%`, top: `${y}%` }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
    transition={{ duration: 2, delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    <Star className="w-4 h-4 text-amber-400" />
  </motion.div>
);

// Discount badge
const SaleBadge = ({ percent }: { percent: number }) => (
  <motion.div
    className="relative"
    animate={{ scale: [1, 1.05, 1] }}
    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
  >
    <motion.div
      className="absolute inset-0 rounded-full blur-2xl"
      style={{ background: 'radial-gradient(circle, hsla(38,90%,50%,0.35) 0%, transparent 70%)' }}
      animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
    <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-2xl">
      <div className="text-center z-10">
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

// Shimmer effect
const ShimmerLine = () => (
  <motion.div
    className="absolute inset-0 overflow-hidden rounded-full"
    initial={{ x: '-100%' }}
    animate={{ x: '200%' }}
    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
  >
    <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
  </motion.div>
);

export const MegaSaleBanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const countdown = useSummerCountdown();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  const handleShopClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowConfetti(true);
    setTimeout(() => navigate('/shop'), 500);
  };

  return (
    <section ref={ref} className="relative overflow-hidden">
      <StarConfetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />

      <div className="relative min-h-[480px] sm:min-h-[500px] md:min-h-[520px]">
        {/* Base gradient — sky to amber */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, hsl(200 80% 92%) 0%, hsl(200 70% 90%) 30%, hsl(43 80% 88%) 70%, hsl(38 80% 85%) 100%)',
          }}
        />

        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse at 30% 50%, hsla(200,80%,55%,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, hsla(38,90%,55%,0.1) 0%, transparent 40%)',
              'radial-gradient(ellipse at 40% 40%, hsla(200,80%,55%,0.18) 0%, transparent 50%), radial-gradient(ellipse at 60% 60%, hsla(38,90%,55%,0.14) 0%, transparent 40%)',
              'radial-gradient(ellipse at 30% 50%, hsla(200,80%,55%,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, hsla(38,90%,55%,0.1) 0%, transparent 40%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Top decorative border */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ background: 'linear-gradient(90deg, hsl(200 80% 55%), hsl(43 96% 56%), hsl(200 80% 55%))' }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <FloatingSun x={5} delay={0} size="sm" />
          <FloatingSun x={15} delay={1.5} size="md" />
          <FloatingSun x={85} delay={0.8} size="lg" />
          <FloatingSun x={92} delay={2.2} size="sm" />
          <div className="hidden sm:block">
            <FloatingSun x={25} delay={3} size="sm" />
            <FloatingSun x={75} delay={1.2} size="md" />
          </div>
        </div>

        {/* Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          <SparkleEffect x={20} y={20} delay={0} />
          <SparkleEffect x={80} y={30} delay={1} />
          <SparkleEffect x={60} y={70} delay={2} />
          <div className="hidden sm:block">
            <SparkleEffect x={40} y={15} delay={1.5} />
            <SparkleEffect x={90} y={60} delay={2.5} />
          </div>
        </div>

        {/* Sale Badge — right side on desktop */}
        <div className="absolute right-4 sm:right-8 md:right-16 lg:right-24 top-1/2 -translate-y-1/2 hidden sm:block">
          <SaleBadge percent={50} />
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 flex items-center min-h-[480px] sm:min-h-[500px] md:min-h-[520px]">
          <div className="max-w-2xl py-10 sm:py-12">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-4 sm:mb-5 inline-block"
            >
              <div className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-white/30 backdrop-blur-sm border border-sky-300/40 rounded-full shadow-sm">
                <Sun className="w-4 h-4 text-amber-600" />
                <span className="text-xs sm:text-sm font-bold tracking-widest text-sky-800 uppercase">
                  Summer Collection
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
              <span className="flex items-center gap-2 sm:gap-3 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-800 leading-[0.9]">
                <Sun className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-amber-500" />
                SUMMER
              </span>
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mt-1">
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, hsl(200 80% 50%) 0%, hsl(38 90% 50%) 50%, hsl(200 70% 45%) 100%)',
                  }}
                >
                  STYLE SALE
                </span>
              </span>
            </motion.h1>

            {/* Mobile badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="sm:hidden mb-4 flex justify-center"
            >
              <SaleBadge percent={50} />
            </motion.div>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-slate-600 mb-2 max-w-lg"
            >
              Fresh styles for the new season.
              <span className="text-slate-800 font-semibold"> Shop now</span> & upgrade your wardrobe!
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-3 sm:gap-4 mb-6"
            >
              {['Free Shipping', 'Easy Returns', 'Best Prices'].map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600"
                >
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {feature}
                </motion.div>
              ))}
            </motion.div>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-6 sm:mb-8"
            >
              {countdown.status === 'coming-soon' && (
                <div className="inline-flex items-center gap-3 px-5 py-3 bg-sky-600/15 backdrop-blur-sm rounded-xl border border-sky-400/30">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <div>
                    <span className="block text-sm font-bold text-slate-800">Coming Soon!</span>
                    <span className="text-xs text-slate-600">Summer Sale starts in {countdown.days} days</span>
                  </div>
                </div>
              )}

              {countdown.status === 'countdown' && (
                <div className="bg-sky-600/20 backdrop-blur-sm rounded-2xl p-4 inline-block border border-sky-400/30">
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 mb-3 text-center">
                    ☀️ Sale starts in:
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <CountdownUnit value={countdown.days} label="Days" />
                    <span className="text-2xl font-bold text-slate-400 pb-5">:</span>
                    <CountdownUnit value={countdown.hours} label="Hours" />
                    <span className="text-2xl font-bold text-slate-400 pb-5">:</span>
                    <CountdownUnit value={countdown.minutes} label="Mins" />
                    <span className="text-2xl font-bold text-slate-400 pb-5">:</span>
                    <CountdownUnit value={countdown.seconds} label="Secs" />
                  </div>
                </div>
              )}

              {countdown.status === 'ended' && (
                <div className="inline-flex items-center gap-3 px-5 py-3 bg-amber-500/15 backdrop-blur-sm rounded-xl border border-amber-400/30">
                  <Sun className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-semibold text-slate-800">Summer Sale is LIVE! ☀️</span>
                </div>
              )}
            </motion.div>

            {/* CTA */}
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
                  background: 'linear-gradient(135deg, hsl(200 80% 50%) 0%, hsl(38 90% 50%) 100%)',
                }}
              >
                <ShimmerLine />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Sun className="w-4 h-4" />
                  Shop the Sale
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>

              <Link to="/shop">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-semibold px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full border-2 border-sky-400 text-sky-700 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all duration-300 w-full sm:w-auto backdrop-blur-sm"
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
          style={{ background: 'linear-gradient(90deg, hsl(43 96% 56%), hsl(200 80% 55%), hsl(43 96% 56%))' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
      </div>
    </section>
  );
};

export default MegaSaleBanner;
