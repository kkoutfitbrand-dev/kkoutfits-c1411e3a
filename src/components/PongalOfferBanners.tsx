import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import pongalOffer1 from '@/assets/pongal-offer-1.jpg';
import pongalOffer2 from '@/assets/pongal-offer-2.jpg';
import pongalOffer3 from '@/assets/pongal-offer-3.jpg';

const banners = [
  {
    id: 1,
    image: pongalOffer1,
    title: 'Festive Offers',
    subtitle: 'Up to 50% Off',
    link: '/shop',
  },
  {
    id: 2,
    image: pongalOffer2,
    title: 'Traditional Collection',
    subtitle: 'New Arrivals',
    link: '/shop',
  },
  {
    id: 3,
    image: pongalOffer3,
    title: 'Pongal Special',
    subtitle: 'Shop Now',
    link: '/shop',
  },
];

// Sparkle particle component
const Sparkle = ({ delay, duration, size, left, top }: { 
  delay: number; 
  duration: number; 
  size: number; 
  left: string; 
  top: string;
}) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left, top }}
    initial={{ opacity: 0, scale: 0, rotate: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 1, 0],
      rotate: [0, 180, 360],
      y: [0, -30, -60],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'easeOut',
    }}
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]"
    >
      <path
        d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
        fill="currentColor"
      />
    </svg>
  </motion.div>
);

// Floating confetti particle
const Confetti = ({ delay, color, left }: { delay: number; color: string; left: string }) => (
  <motion.div
    className="absolute w-2 h-3 rounded-sm pointer-events-none"
    style={{ left, backgroundColor: color, top: '-10px' }}
    initial={{ opacity: 0, y: -20, rotateZ: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      y: ['-20px', '120%'],
      rotateZ: [0, 360, 720],
      rotateX: [0, 180, 360],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: 'linear',
    }}
  />
);

export const PongalOfferBanners = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Generate random sparkle positions
  const sparkles = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
      size: 12 + Math.random() * 16,
      left: `${5 + Math.random() * 90}%`,
      top: `${10 + Math.random() * 70}%`,
    })), []
  );

  // Generate confetti particles
  const confettiPieces = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      color: ['#FCD34D', '#FB923C', '#F87171', '#A78BFA', '#34D399'][Math.floor(Math.random() * 5)],
      left: `${Math.random() * 100}%`,
    })), []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentBanner = banners[currentIndex];

  return (
    <section className="container px-4 py-8">
      <div className="relative overflow-hidden rounded-2xl shadow-lg h-56 sm:h-64 md:h-72">
        {/* Floating Sparkles */}
        {sparkles.map((sparkle) => (
          <Sparkle key={sparkle.id} {...sparkle} />
        ))}

        {/* Falling Confetti */}
        {confettiPieces.map((piece) => (
          <Confetti key={piece.id} {...piece} />
        ))}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner.id}
            initial={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)', rotate: -3 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            <Link to={currentBanner.link} className="block h-full">
              <motion.img
                src={currentBanner.image}
                alt={currentBanner.title}
                className="w-full h-full object-cover"
                initial={{ scale: 1 }}
                animate={{ scale: 1.05 }}
                transition={{ duration: 3, ease: 'linear' }}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Text Content with creative animations */}
              <div className="absolute bottom-0 left-0 right-0 p-6 overflow-hidden">
                <motion.h3
                  initial={{ opacity: 0, x: -50, rotateY: 90 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.3,
                    type: 'spring',
                    stiffness: 100
                  }}
                  className="text-white font-bold text-2xl sm:text-3xl drop-shadow-lg"
                >
                  {currentBanner.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20, letterSpacing: '0.5em' }}
                  animate={{ opacity: 1, y: 0, letterSpacing: '0.05em' }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.5,
                    ease: 'easeOut'
                  }}
                  className="text-amber-300 text-lg font-semibold mt-1"
                >
                  {currentBanner.subtitle}
                </motion.p>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                  className="h-0.5 w-24 bg-gradient-to-r from-amber-400 to-orange-500 mt-3 origin-left"
                />
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Dots Indicator */}
        <div className="absolute bottom-3 right-4 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-amber-400 w-6'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PongalOfferBanners;
