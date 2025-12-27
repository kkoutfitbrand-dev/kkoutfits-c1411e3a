import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const ComboBanner = () => {
  return (
    <section className="container px-4 py-6 md:py-8">
      <motion.div 
        className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-accent rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-10 -left-10 w-32 md:w-48 h-32 md:h-48 bg-white/10 rounded-full blur-2xl"
            animate={{
              x: [0, 30, 0],
              y: [0, 20, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-10 -right-10 w-40 md:w-56 h-40 md:h-56 bg-white/10 rounded-full blur-2xl"
            animate={{
              x: [0, -25, 0],
              y: [0, -25, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 md:p-8">
          {/* Left - Text content */}
          <div className="flex-1 text-center sm:text-left">
            <Badge className="mb-2 bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              EXCLUSIVE OFFER
            </Badge>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
              COMBO OFFER
            </h2>
            <p className="text-white/90 text-sm md:text-base mb-3">
              Up to 40% OFF • Mix & match colors
            </p>

            <Button 
              asChild 
              size="sm"
              className="bg-white text-primary hover:bg-white/90 font-bold group"
            >
              <Link to="/combo">
                Shop Combos
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Right - Discount badge */}
          <motion.div
            className="flex-shrink-0"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-xl">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">40%</span>
              <span className="text-xs font-semibold text-primary/70">OFF</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
