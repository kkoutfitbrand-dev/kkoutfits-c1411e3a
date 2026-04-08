import { motion } from 'framer-motion';
import { Sparkles, Sun, Star } from 'lucide-react';

const icons = [Sparkles, Sun, Star];
const colors = ['text-amber-400/40', 'text-sky-400/30', 'text-yellow-400/35'];

const particles = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  size: Math.random() * 12 + 6,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: Math.random() * 14 + 16,
  opacity: Math.random() * 0.15 + 0.04,
  iconIdx: i % 3,
}));

export const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => {
        const Icon = icons[p.iconIdx];
        return (
          <motion.div
            key={p.id}
            className="absolute"
            style={{ left: `${p.left}%`, bottom: '-30px' }}
            animate={{
              y: [0, -window.innerHeight - 100],
              x: [0, Math.sin(p.id) * 50, 0],
              rotate: [0, 360],
              scale: [1, 1.15, 0.95, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'linear',
            }}
          >
            <Icon
              className={colors[p.iconIdx]}
              style={{
                width: p.size,
                height: p.size,
                opacity: p.opacity,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};
