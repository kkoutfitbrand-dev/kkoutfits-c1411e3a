import { motion } from 'framer-motion';
import { Heart, Gift, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useValentineCountdown } from '@/hooks/useValentineCountdown';

export const ValentineCountdownBanner = () => {
  const { days, hours, minutes, seconds, status } = useValentineCountdown();

  if (status === 'ended') return null;

  const showCountdown = status === 'countdown';

  return (
    <section className="relative overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ duration: 5, repeat: Infinity }}
        style={{ backgroundSize: '200% 200%' }}
      />

      {/* Floating hearts in background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 12}%`,
              top: '50%',
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.4, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            <Heart className="w-6 h-6 text-white/30 fill-white/20" />
          </motion.div>
        ))}
      </div>

      <div className="container px-4 py-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left content */}
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <Gift className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-white/90 text-sm font-medium flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Valentine's Day Special
              </motion.p>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {showCountdown ? 'Hurry! Offers End Soon' : 'Coming Soon!'}
              </h3>
            </div>
          </div>

          {/* Countdown timer */}
          {showCountdown && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 md:gap-4"
            >
              <Clock className="w-5 h-5 text-white/80 hidden md:block" />
              {[
                { value: days, label: 'Days' },
                { value: hours, label: 'Hrs' },
                { value: minutes, label: 'Min' },
                { value: seconds, label: 'Sec' },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                    animate={{ scale: item.label === 'Sec' ? [1, 1.05, 1] : 1 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <span className="text-2xl md:text-3xl font-bold text-white">
                      {String(item.value).padStart(2, '0')}
                    </span>
                  </motion.div>
                  <span className="text-xs text-white/80 mt-1">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CTA Button */}
          <Link to="/valentine-collection">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-white text-rose-600 hover:bg-white/90 font-bold shadow-xl"
              >
                <Heart className="w-5 h-5 mr-2 fill-current" />
                Shop Valentine's
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  );
};
