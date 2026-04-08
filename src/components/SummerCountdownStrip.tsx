import { motion, useInView } from 'framer-motion';
import { Flame, Package, Truck, Percent } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

const CountUp = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const stats = [
  { icon: Package, value: 500, suffix: '+', label: 'Products', color: 'text-amber-300' },
  { icon: Percent, value: 50, suffix: '%', label: 'Up to Off', color: 'text-sky-300' },
  { icon: Truck, value: 0, suffix: '', label: 'Free Shipping', color: 'text-emerald-300', isText: true },
];

export const SummerCountdownStrip = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-500 to-sky-500" />
      
      {/* Shimmer overlay */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-2">
        <svg viewBox="0 0 1200 8" className="w-full h-full" preserveAspectRatio="none">
          <motion.path
            d="M0,4 Q150,0 300,4 T600,4 T900,4 T1200,4 L1200,8 L0,8 Z"
            fill="rgba(255,255,255,0.15)"
            animate={{ d: [
              "M0,4 Q150,0 300,4 T600,4 T900,4 T1200,4 L1200,8 L0,8 Z",
              "M0,4 Q150,8 300,4 T600,4 T900,4 T1200,4 L1200,8 L0,8 Z",
            ]}}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          />
        </svg>
      </div>

      <div className="container px-4 py-4 md:py-5 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Badge */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm"
              animate={{ boxShadow: [
                '0 0 0 0 rgba(255,255,255,0)',
                '0 0 0 4px rgba(255,255,255,0.15)',
                '0 0 0 0 rgba(255,255,255,0)',
              ]}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame className="w-4 h-4 text-yellow-200" />
              <span className="text-white text-xs font-bold uppercase tracking-wider">Limited Time</span>
            </motion.div>
            <span className="text-white/80 text-xs hidden md:inline">Summer Sale is Live!</span>
          </motion.div>

          {/* Stats */}
          <div className="flex items-center gap-4 md:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="flex items-center gap-2 text-white"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color}`} />
                <div className="text-center">
                  <div className="text-sm md:text-base font-bold leading-tight">
                    {stat.isText ? 'FREE' : <CountUp target={stat.value} suffix={stat.suffix} />}
                  </div>
                  <div className="text-[10px] md:text-xs text-white/70 leading-tight">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
