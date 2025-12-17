import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroStore from "@/assets/hero-store.png";
export const HeroCarousel = () => {
  const ref = useRef(null);
  const {
    scrollYProgress
  } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  return <div ref={ref} className="relative h-[280px] md:h-[380px] lg:h-[450px] overflow-hidden bg-muted">
      {/* Parallax Background Image */}
      <motion.div style={{
      y: backgroundY,
      scale
    }} className="absolute inset-0 w-full h-[130%]">
        <img src={heroStore} alt="Our Store" className="w-full h-full object-cover object-center" />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Content with Parallax */}
      <motion.div style={{
      y: textY,
      opacity
    }} className="absolute inset-0 flex items-center">
        <div className="container px-4">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }} className="max-w-xl text-white">
            <motion.span initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6,
            delay: 0.3
          }} className="inline-block px-3 py-1 mb-3 text-xs font-semibold bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              NEW COLLECTION 2026
            </motion.span>
            <motion.h2 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.4
          }} className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 font-sans leading-tight">
              Welcome to Our Store
            </motion.h2>
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.5
          }} className="text-base md:text-lg mb-5 text-white/90">
              Discover Our Latest Collection
            </motion.p>
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.6
          }}>
              <Link to="/shop">
                <Button size="lg" className="bg-white text-foreground hover:bg-white/90 font-bold rounded-full px-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  Shop Now
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 0.6
    }} transition={{
      duration: 1,
      delay: 0.8
    }} className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </div>;
};