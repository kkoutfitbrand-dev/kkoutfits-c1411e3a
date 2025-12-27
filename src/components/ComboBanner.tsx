import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Package, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const ComboBanner = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-accent py-12 md:py-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating shapes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-white/20 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="container px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Text content */}
          <div className="text-center md:text-left max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Sparkles className="h-3 w-3 mr-1" />
                EXCLUSIVE OFFER
              </Badge>
            </motion.div>
            
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              COMBO OFFER
              <span className="block text-lg md:text-xl font-normal mt-2 text-white/90">
                Up to 40% OFF on Bundle Deals
              </span>
            </motion.h2>
            
            <motion.p
              className="text-white/80 text-lg mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Mix & match your favorite colors. Select multiple items and save more!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 font-bold group"
              >
                <Link to="/combo">
                  Shop Combos
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Visual element */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Circular background */}
              <div className="absolute inset-0 bg-white/10 rounded-full backdrop-blur-sm" />
              
              {/* Package icons */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="relative w-48 h-48 md:w-60 md:h-60">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                      style={{
                        top: i < 2 ? '0%' : 'auto',
                        bottom: i >= 2 ? '0%' : 'auto',
                        left: i % 2 === 0 ? '0%' : 'auto',
                        right: i % 2 === 1 ? '0%' : 'auto',
                      }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Package className="h-8 w-8 text-white" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Center badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-xl">
                <span className="text-2xl font-bold text-primary">40%</span>
                <span className="text-xs font-semibold text-primary/70">OFF</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
