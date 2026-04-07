import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StarParticle {
  id: number;
  x: number;
  size: number;
  rotation: number;
  delay: number;
  duration: number;
  color: string;
}

interface StarConfettiProps {
  isActive: boolean;
  onComplete?: () => void;
  particleCount?: number;
}

const colors = [
  'hsl(43, 96%, 56%)',   // Gold
  'hsl(200, 80%, 55%)',  // Sky blue
  'hsl(38, 90%, 50%)',   // Amber
  'hsl(200, 60%, 70%)',  // Light blue
  'hsl(0, 0%, 95%)',     // White
];

export const StarConfetti = ({
  isActive,
  onComplete,
  particleCount = 30,
}: StarConfettiProps) => {
  const [particles, setParticles] = useState<StarParticle[]>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles: StarParticle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 16 + 12,
        rotation: Math.random() * 360,
        delay: Math.random() * 0.5,
        duration: Math.random() * 2 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));

      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 4500);

      return () => clearTimeout(timer);
    }
  }, [isActive, particleCount, onComplete]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute"
              style={{
                left: `${particle.x}%`,
                width: particle.size,
                height: particle.size,
              }}
              initial={{ y: '-10vh', rotate: particle.rotation, opacity: 0, scale: 0 }}
              animate={{
                y: '110vh',
                rotate: particle.rotation + 360,
                opacity: [0, 1, 1, 0.8, 0],
                scale: [0, 1.2, 1, 1, 0.8],
                x: [0, Math.sin(particle.id) * 50, Math.cos(particle.id) * 30, 0],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: particle.duration, delay: particle.delay, ease: 'easeOut' }}
            >
              <Star
                className="w-full h-full drop-shadow-md"
                style={{ fill: particle.color, color: particle.color }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default StarConfetti;
