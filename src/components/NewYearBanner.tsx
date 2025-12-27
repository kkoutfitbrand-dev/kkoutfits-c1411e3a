import { useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Gift, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Firework particle component
const Firework = ({ x, y, color, delay }: { x: number; y: number; color: string; delay: number }) => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    angle: (i * 30) * (Math.PI / 180),
    distance: 60 + Math.random() * 40,
  }));

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 1.5, delay, repeat: Infinity, repeatDelay: 3 }}
    >
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(particle.angle) * particle.distance,
            y: Math.sin(particle.angle) * particle.distance,
            opacity: [1, 1, 0],
            scale: [1, 0.5, 0],
          }}
          transition={{ duration: 1.2, delay: delay + 0.1, repeat: Infinity, repeatDelay: 3 }}
        />
      ))}
      <motion.div
        className="absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}` }}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 0] }}
        transition={{ duration: 0.5, delay, repeat: Infinity, repeatDelay: 3 }}
      />
    </motion.div>
  );
};

// Interactive firework on hover/click
const InteractiveFirework = ({ x, y }: { x: number; y: number }) => {
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#FF69B4', '#00D4FF'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const particles = Array.from({ length: 16 }, (_, i) => ({
    angle: (i * 22.5) * (Math.PI / 180),
    distance: 80 + Math.random() * 60,
  }));

  return (
    <motion.div
      className="absolute pointer-events-none z-50"
      style={{ left: x, top: y }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(particle.angle) * particle.distance,
            y: Math.sin(particle.angle) * particle.distance,
            opacity: [1, 1, 0],
            scale: [1, 0.3, 0],
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      ))}
    </motion.div>
  );
};

// Countdown Timer Component
const CountdownTimer = () => {
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

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ rotateX: -90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div className="bg-gradient-to-b from-amber-900/80 to-amber-950/90 backdrop-blur-sm rounded-lg p-2 sm:p-3 md:p-4 min-w-[50px] sm:min-w-[60px] md:min-w-[80px] border border-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-b from-amber-200 to-amber-400 bg-clip-text text-transparent">
            {String(value).padStart(2, '0')}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-amber-400/5 to-transparent rounded-lg pointer-events-none" />
      </motion.div>
      <span className="text-amber-300/80 text-[10px] sm:text-xs md:text-sm mt-1 md:mt-2 uppercase tracking-widest font-medium">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
      <TimeBlock value={timeLeft.days} label="Days" />
      <span className="text-amber-400 text-xl sm:text-2xl md:text-3xl font-light mt-[-20px]">:</span>
      <TimeBlock value={timeLeft.hours} label="Hours" />
      <span className="text-amber-400 text-xl sm:text-2xl md:text-3xl font-light mt-[-20px]">:</span>
      <TimeBlock value={timeLeft.minutes} label="Mins" />
      <span className="text-amber-400 text-xl sm:text-2xl md:text-3xl font-light mt-[-20px]">:</span>
      <TimeBlock value={timeLeft.seconds} label="Secs" />
    </div>
  );
};

export const NewYearBanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [interactiveFireworks, setInteractiveFireworks] = useState<{ id: number; x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const newFirework = { id: Date.now(), x, y };
    setInteractiveFireworks(prev => [...prev, newFirework]);

    setTimeout(() => {
      setInteractiveFireworks(prev => prev.filter(fw => fw.id !== newFirework.id));
    }, 1500);
  }, []);

  // Auto fireworks on scroll into view - continuous sky burst effect
  useEffect(() => {
    if (isInView && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      
      const createRandomFirework = () => {
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height * 0.5; // Upper half of banner (sky area)
        const newFirework = { id: Date.now() + Math.random(), x, y };
        setInteractiveFireworks(prev => [...prev.slice(-15), newFirework]);
      };
      
      // Create initial burst
      for (let i = 0; i < 5; i++) {
        setTimeout(createRandomFirework, i * 200);
      }

      // Continuous automatic fireworks every 800ms
      const intervalId = setInterval(() => {
        createRandomFirework();
        // Random chance for double burst
        if (Math.random() > 0.5) {
          setTimeout(createRandomFirework, 150);
        }
      }, 800);

      return () => clearInterval(intervalId);
    }
  }, [isInView]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      onClick={handleInteraction}
    >
      <div
        ref={containerRef}
        className="relative min-h-[600px] md:min-h-[700px] py-16 md:py-24"
        style={{
          background: 'linear-gradient(135deg, #0c1929 0%, #1a1a2e 25%, #16213e 50%, #0f0f23 75%, #1a0a2e 100%)',
        }}
      >
        {/* Animated Stars Background */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />

        {/* Auto Fireworks */}
        <Firework x={15} y={20} color="#FFD700" delay={0} />
        <Firework x={85} y={15} color="#FF6B6B" delay={0.5} />
        <Firework x={50} y={10} color="#4ECDC4" delay={1} />
        <Firework x={25} y={35} color="#FF69B4" delay={1.5} />
        <Firework x={75} y={30} color="#00D4FF" delay={2} />

        {/* Interactive Fireworks */}
        {interactiveFireworks.map(fw => (
          <InteractiveFirework key={fw.id} x={fw.x} y={fw.y} />
        ))}

        {/* Main Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/30 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-amber-200 text-sm font-medium tracking-wide">NEW YEAR CELEBRATION</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
            </motion.div>

            {/* Big 2026 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
              className="mb-4"
            >
              <h1 className="text-[80px] sm:text-[120px] md:text-[180px] lg:text-[220px] font-black leading-none tracking-tighter">
                <span className="bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(251,191,36,0.5)]">
                  2026
                </span>
              </h1>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl sm:text-2xl md:text-3xl text-white/90 font-light mb-8 tracking-wide"
            >
              Ring in the New Year in <span className="text-amber-400 font-semibold">Style</span>
            </motion.p>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-10"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 text-sm tracking-widest uppercase">Countdown to 2026</span>
              </div>
              <CountdownTimer />
            </motion.div>

            {/* Offer Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-red-500 rounded-lg blur-lg opacity-50 animate-pulse" />
                <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-bold text-lg md:text-xl shadow-2xl">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    <span>FLAT 50% OFF on New Year Collection</span>
                    <Gift className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/new-year-collection">
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold px-8 py-6 text-lg rounded-full shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(251,191,36,0.6)]"
                  onMouseEnter={handleInteraction}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Shop New Year Collection
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link to="/sale">
                <Button
                  size="lg"
                  className="relative overflow-hidden bg-white/20 border-2 border-white text-white hover:bg-white hover:text-black font-bold px-8 py-6 text-lg rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
                  onMouseEnter={handleInteraction}
                >
                  View All Offers
                </Button>
              </Link>
            </motion.div>

            {/* Click hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-8 text-white/40 text-sm"
            >
              ✨ Click anywhere for fireworks! ✨
            </motion.p>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 50L60 45C120 40 240 30 360 35C480 40 600 60 720 65C840 70 960 60 1080 50C1200 40 1320 30 1380 25L1440 20V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default NewYearBanner;
