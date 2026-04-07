import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: Math.random() * 12 + 6,
  left: Math.random() * 100,
  delay: Math.random() * 6,
  duration: Math.random() * 12 + 18,
  opacity: Math.random() * 0.15 + 0.05,
}));

export const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.left}%`, bottom: '-30px' }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [0, Math.sin(p.id) * 40, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        >
          <Sparkles
            className="text-amber-400/40"
            style={{
              width: p.size,
              height: p.size,
              opacity: p.opacity,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};
