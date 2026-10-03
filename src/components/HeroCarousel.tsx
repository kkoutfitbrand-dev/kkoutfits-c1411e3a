import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroStore from "@/assets/hero-store.png";

export const HeroCarousel = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <div ref={ref} className="relative h-[280px] overflow-hidden bg-muted md:h-[380px] lg:h-[450px]">
      {/* Parallax Background Image */}
      <motion.div style={{ y: backgroundY, scale }} className="absolute inset-0 w-full h-[130%]">
        <img
          src={heroStore}
          alt="Our Store"
          className="w-full h-full object-cover object-center"
          width={1536}
          height={1024}
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      <motion.div style={{ y: textY, opacity }} className="absolute inset-0 z-10 flex items-center">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-xl text-background"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-3 inline-block rounded-full border border-background/30 bg-background/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm"
            >
              NEW COLLECTION 2026
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-3 font-sans text-3xl font-bold leading-tight md:text-4xl lg:text-5xl"
            >
              Welcome to Our Store
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mb-5 text-base text-background/90 md:text-lg"
            >
              Discover Our Latest Collection
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Link to="/shop">
                <Button
                  size="lg"
                  className="rounded-full bg-background px-8 font-bold text-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:bg-background/90 hover:shadow-xl"
                >
                  Shop Now
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom fade into page background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none"
      />
    </div>
  );
};
