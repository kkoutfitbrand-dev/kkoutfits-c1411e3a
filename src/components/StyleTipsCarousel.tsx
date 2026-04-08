import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ScrollReveal } from '@/components/ScrollReveal';

const styleTips = [
  { quote: "Style is a way to say who you are without having to speak.", author: "Rachel Zoe" },
  { quote: "Dress shabbily and they remember the dress; dress impeccably and they remember the woman.", author: "Coco Chanel" },
  { quote: "Fashion is about dressing according to what's fashionable. Style is more about being yourself.", author: "Oscar de la Renta" },
  { quote: "Elegance is elimination.", author: "Cristóbal Balenciaga" },
  { quote: "Buy less, choose well, make it last.", author: "Vivienne Westwood" },
];

export const StyleTipsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % styleTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 relative overflow-hidden">
      {/* Background with subtle pattern */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(43 40% 97%) 50%, hsl(0 0% 100%) 100%)',
        }}
      />
      {/* Diagonal dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="container px-4 relative z-10">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            {/* Decorative sparkles */}
            <div className="flex justify-center gap-4 mb-6">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  <Sparkles
                    className="text-amber-400"
                    style={{
                      width: 14 + i * 3,
                      height: 14 + i * 3,
                      opacity: 0.5 + i * 0.1,
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Quote card */}
            <motion.div
              className="relative bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-amber-100"
              whileHover={{ scale: 1.01 }}
            >
              <motion.div
                className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-amber-500 flex items-center justify-center shadow-lg"
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
                    "{styleTips[currentIndex].quote}"
                  </p>
                  {/* Gradient author name */}
                  <p className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-sky-600">
                    — {styleTips[currentIndex].author}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center gap-2 mt-6">
                {styleTips.map((_, i) => (
                  <motion.button
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentIndex ? 'bg-amber-500' : 'bg-amber-200'
                    }`}
                    onClick={() => setCurrentIndex(i)}
                    whileHover={{ scale: 1.3 }}
                  />
                ))}
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-8 text-muted-foreground"
            >
              Elevate your wardrobe this summer ✨
            </motion.p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
