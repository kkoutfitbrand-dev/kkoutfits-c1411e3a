import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ScrollReveal } from '@/components/ScrollReveal';

const loveQuotes = [
  { quote: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" },
  { quote: "Love is not about how many days, months, or years you have been together.", author: "Unknown" },
  { quote: "In all the world, there is no heart for me like yours.", author: "Maya Angelou" },
  { quote: "I have found the one whom my soul loves.", author: "Song of Solomon" },
  { quote: "You are my today and all of my tomorrows.", author: "Leo Christopher" },
];

export const ValentineLoveQuotes = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % loveQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 relative overflow-hidden">
      {/* Soft gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(340 50% 97%) 50%, hsl(0 0% 100%) 100%)',
        }}
      />

      <div className="container px-4 relative z-10">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            {/* Decorative hearts */}
            <div className="flex justify-center gap-4 mb-6">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  <Heart 
                    className={`fill-rose-${300 + i * 100} text-rose-${300 + i * 100}`}
                    style={{ 
                      width: 16 + i * 4, 
                      height: 16 + i * 4,
                      opacity: 0.6 + i * 0.1,
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Quote card */}
            <motion.div
              className="relative bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-rose-100"
              whileHover={{ scale: 1.01 }}
            >
              {/* Quote icon */}
              <motion.div
                className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center shadow-lg"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Quote className="w-6 h-6 text-white" />
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="pt-4"
                >
                  <p className="text-xl md:text-2xl text-foreground font-serif italic mb-4">
                    "{loveQuotes[currentIndex].quote}"
                  </p>
                  <p className="text-muted-foreground font-medium">
                    — {loveQuotes[currentIndex].author}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 mt-6">
                {loveQuotes.map((_, i) => (
                  <motion.button
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentIndex ? 'bg-rose-500' : 'bg-rose-200'
                    }`}
                    onClick={() => setCurrentIndex(i)}
                    whileHover={{ scale: 1.3 }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-8 text-muted-foreground"
            >
              Dress your love story this Valentine's ❤️
            </motion.p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
