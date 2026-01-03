import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
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

export const PongalOfferBanners = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Link to={currentBanner.link} className="block h-full">
              <img
                src={currentBanner.image}
                alt={currentBanner.title}
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Text Content with different animations */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <motion.h3
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-white font-bold text-2xl sm:text-3xl drop-shadow-lg"
                >
                  {currentBanner.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-amber-300 text-lg font-semibold mt-1"
                >
                  {currentBanner.subtitle}
                </motion.p>
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
