import { motion } from 'framer-motion';
import { Heart, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ScrollReveal';

const coupleOutfits = [
  {
    id: 1,
    title: 'Matching Ethnic Elegance',
    description: 'Coordinated traditional wear for the perfect duo',
    image: '/placeholder.svg',
    link: '/category/ethnic',
  },
  {
    id: 2,
    title: 'Casual Couple Goals',
    description: 'Relaxed, matching styles for everyday love',
    image: '/placeholder.svg',
    link: '/category/casual',
  },
  {
    id: 3,
    title: 'Formal Date Night',
    description: 'Sophisticated pairs for special evenings',
    image: '/placeholder.svg',
    link: '/category/formal',
  },
];

export const ValentineCoupleSection = () => {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Romantic gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, hsl(340 30% 96%) 0%, hsl(350 40% 94%) 50%, hsl(340 30% 96%) 100%)',
        }}
      />
      
      {/* Animated sparkles */}
      <motion.div
        className="absolute top-10 left-10"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Sparkles className="w-8 h-8 text-rose-300" />
      </motion.div>
      <motion.div
        className="absolute bottom-10 right-10"
        animate={{ 
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Sparkles className="w-6 h-6 text-pink-300" />
      </motion.div>

      <div className="container px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full mb-4 shadow-lg"
            >
              <Users className="w-5 h-5 text-white" />
              <span className="text-white font-bold tracking-wide">COUPLE'S COLLECTION</span>
              <Heart className="w-5 h-5 text-white fill-white" />
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Perfect Pairs for 
              <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent"> Perfect Love</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Match your outfits, double the style. Find coordinated looks that celebrate your bond.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coupleOutfits.map((outfit, index) => (
            <ScrollReveal key={outfit.id} delay={index * 0.15}>
              <Link to={outfit.link}>
                <motion.div
                  className="group relative rounded-2xl overflow-hidden bg-white shadow-xl h-80"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-900/80 via-rose-900/20 to-transparent z-10" />
                  
                  {/* Placeholder background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-pink-100" />
                  
                  {/* Heart decoration */}
                  <motion.div
                    className="absolute top-4 right-4 z-20"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Heart className="w-8 h-8 text-white fill-rose-500 drop-shadow-lg" />
                  </motion.div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rose-200 transition-colors">
                      {outfit.title}
                    </h3>
                    <p className="text-white/80 text-sm mb-4">
                      {outfit.description}
                    </p>
                    <motion.div
                      className="flex items-center gap-2 text-rose-200 font-medium"
                      whileHover={{ x: 5 }}
                    >
                      <span>Shop Now</span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <div className="text-center mt-10">
            <Link to="/trending">
              <Button
                size="lg"
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold shadow-lg shadow-rose-500/25"
              >
                <Heart className="w-5 h-5 mr-2 fill-white" />
                Explore All Couple Outfits
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
