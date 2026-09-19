import { motion } from 'framer-motion';
import { Glasses, Palette, Zap, ArrowRight, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ScrollReveal';

const features = [
  {
    icon: Glasses,
    title: 'Trendy Styles',
    desc: 'Curated looks for every summer vibe',
    gradient: 'from-sky-400 to-cyan-500',
  },
  {
    icon: Palette,
    title: 'Vibrant Colors',
    desc: 'Bold palettes that pop in the sun',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    icon: Zap,
    title: 'Premium Quality',
    desc: 'Breathable fabrics for hot days',
    gradient: 'from-violet-400 to-purple-500',
  },
];

export const SummerLifestyleBanner = () => {
  return (
    <section className="relative overflow-hidden py-12 md:py-16">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, hsl(199 89% 96%) 0%, hsl(43 70% 95%) 50%, hsl(199 89% 96%) 100%)',
        }}
      />

      {/* Floating sun decorations */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute opacity-[0.06]"
          style={{
            top: `${20 + i * 25}%`,
            right: `${5 + i * 10}%`,
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 12 + i * 4, repeat: Infinity, ease: 'linear' }}
        >
          <Sun className="text-amber-500" style={{ width: 40 + i * 20, height: 40 + i * 20 }} />
        </motion.div>
      ))}

      <div className="container px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Left: Text */}
          <div className="flex-1 text-center md:text-left">
            <ScrollReveal>
              <motion.span
                className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold uppercase tracking-widest mb-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                ☀️ New Arrivals
              </motion.span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Your Summer.{' '}
                <span className="relative">
                  <span className="relative z-10">Your Style.</span>
                  <motion.span
                    className="absolute bottom-1 left-0 right-0 h-3 bg-amber-300/40 rounded-full -z-0"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    style={{ originX: 0 }}
                  />
                </span>
              </h2>

              <p className="text-muted-foreground mt-4 max-w-md mx-auto md:mx-0">
                Discover our handpicked collection of summer essentials designed to keep you stylish and comfortable.
              </p>

              <div className="mt-6">
                <Link to="/shop">
                  <Button className="relative overflow-hidden group bg-foreground text-background hover:bg-foreground/90 px-6">
                    <span className="relative z-10 flex items-center gap-2">
                      Shop Collection
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    {/* Shimmer */}
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    />
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Feature cards */}
          <div className="flex-1 w-full max-w-sm md:max-w-none">
            <div className="flex flex-col gap-3">
              {features.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center flex-shrink-0`}>
                    <feat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{feat.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{feat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
