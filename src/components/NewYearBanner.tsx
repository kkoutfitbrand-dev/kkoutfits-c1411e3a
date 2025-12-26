import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Gift, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import productShirt1 from "@/assets/product-shirt-1.jpg";

const NewYearBanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Generate random stars
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 3,
    duration: Math.random() * 2 + 2
  }));

  // Generate confetti
  const confetti = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    color: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#FFFFFF'][Math.floor(Math.random() * 5)]
  }));

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden py-16 md:py-24"
      style={{
        background: 'linear-gradient(135deg, hsl(222, 47%, 11%) 0%, hsl(230, 35%, 15%) 30%, hsl(220, 40%, 8%) 70%, hsl(45, 100%, 20%) 100%)'
      }}
    >
      {/* Animated Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            boxShadow: '0 0 6px 2px rgba(255, 215, 0, 0.4)'
          }}
        />
      ))}

      {/* Floating Confetti */}
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-2 h-2 md:w-3 md:h-3 rounded-sm animate-confetti"
          style={{
            left: piece.left,
            top: '-20px',
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`
          }}
        />
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />

      {/* Sparkle Effects */}
      <motion.div
        className="absolute top-10 left-10 text-yellow-400/60"
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles size={40} />
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-10 text-yellow-400/60"
        animate={{ rotate: -360, scale: [1, 1.3, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <PartyPopper size={36} />
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-20 text-yellow-400/40 hidden md:block"
        animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Gift size={32} />
      </motion.div>

      <div className="container px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Left Content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            style={{ opacity }}
          >
            {/* New Year Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 mb-6 animate-glow-pulse"
            >
              <Sparkles size={16} className="text-yellow-400" />
              <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">
                New Year Special
              </span>
              <Sparkles size={16} className="text-yellow-400" />
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white"
              style={{ textShadow: '0 0 40px rgba(255, 215, 0, 0.3)' }}
            >
              Ring in{" "}
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent animate-shimmer">
                2026
              </span>
              {" "}in Style
            </motion.h2>

            {/* Large 2026 Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <span
                className="text-7xl md:text-8xl lg:text-9xl font-black bg-gradient-to-b from-yellow-300 via-yellow-500 to-orange-600 bg-clip-text text-transparent"
                style={{
                  textShadow: '0 0 80px rgba(255, 215, 0, 0.5), 0 0 120px rgba(255, 165, 0, 0.3)',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}
              >
                2026
              </span>
            </motion.div>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-300 text-lg md:text-xl mb-6 max-w-lg mx-auto lg:mx-0"
            >
              Celebrate the new year with our exclusive collection. 
              <span className="text-yellow-400 font-semibold"> Up to 50% OFF</span> on premium styles!
            </motion.p>

            {/* Offer Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-8 max-w-md mx-auto lg:mx-0"
            >
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <Gift className="text-yellow-400" size={24} />
                <div>
                  <p className="text-yellow-400 font-bold text-lg">NEW YEAR SPECIAL</p>
                  <p className="text-gray-400 text-sm">Use code: <span className="text-yellow-300 font-mono font-bold">NEWYEAR26</span></p>
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link to="/shop">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold px-8 py-6 text-lg rounded-full shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105"
                >
                  <PartyPopper className="mr-2" size={20} />
                  Shop New Year Collection
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Floating Shirt */}
          <motion.div
            className="flex-1 relative"
            style={{ y, perspective: 1000 }}
          >
            <div className="relative w-64 h-80 md:w-80 md:h-96 lg:w-96 lg:h-[500px] mx-auto">
              {/* Glow Effect Behind Shirt */}
              <div
                className="absolute inset-0 rounded-3xl blur-3xl opacity-60"
                style={{
                  background: 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, rgba(255,165,0,0.2) 50%, transparent 70%)'
                }}
              />

              {/* 3D Floating Shirt */}
              <motion.div
                className="relative z-10 w-full h-full"
                animate={{
                  y: [0, -20, 0],
                  rotateY: [-5, 5, -5],
                  rotateX: [2, -2, 2]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                <img
                  src={productShirt1}
                  alt="New Year Collection Shirt"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl"
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3)',
                    border: '2px solid rgba(255, 215, 0, 0.2)'
                  }}
                />

                {/* Floating Badge */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg"
                  animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  50% OFF
                </motion.div>

                {/* New Tag */}
                <motion.div
                  className="absolute -bottom-2 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1 rounded-full font-bold text-xs shadow-lg"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  NEW ARRIVAL
                </motion.div>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-8 -left-8 w-16 h-16 border-2 border-yellow-500/30 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -bottom-8 -right-8 w-24 h-24 border border-orange-500/20 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export { NewYearBanner };
