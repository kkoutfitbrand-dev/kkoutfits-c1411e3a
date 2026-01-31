import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  delay: number;
  duration: number;
  color: string;
}

interface HeartConfettiProps {
  isActive: boolean;
  onComplete?: () => void;
  particleCount?: number;
}

const colors = [
  'hsl(340, 82%, 52%)', // Rose
  'hsl(350, 80%, 60%)', // Pink
  'hsl(0, 80%, 50%)',   // Red
  'hsl(340, 70%, 70%)', // Light pink
  'hsl(43, 96%, 56%)',  // Gold
];

export const HeartConfetti = ({
  isActive,
  onComplete,
  particleCount = 30,
}: HeartConfettiProps) => {
  const [particles, setParticles] = useState<HeartParticle[]>([]);

  useEffect(() => {
    if (isActive) {
      // Generate particles
      const newParticles: HeartParticle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // Random x position (0-100%)
        y: -10, // Start above viewport
        size: Math.random() * 16 + 12, // 12-28px
        rotation: Math.random() * 360,
        delay: Math.random() * 0.5, // 0-0.5s delay
        duration: Math.random() * 2 + 2, // 2-4s duration
        color: colors[Math.floor(Math.random() * colors.length)],
      }));

      setParticles(newParticles);

      // Clear particles after animation
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
              initial={{
                y: '-10vh',
                rotate: particle.rotation,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                y: '110vh',
                rotate: particle.rotation + 360,
                opacity: [0, 1, 1, 0.8, 0],
                scale: [0, 1.2, 1, 1, 0.8],
                x: [0, Math.sin(particle.id) * 50, Math.cos(particle.id) * 30, 0],
              }}
              exit={{
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: 'easeOut',
              }}
            >
              <Heart
                className="w-full h-full drop-shadow-md"
                style={{
                  fill: particle.color,
                  color: particle.color,
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default HeartConfetti;
