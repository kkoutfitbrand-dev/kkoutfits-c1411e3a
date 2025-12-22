import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, ShoppingBag, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = location.state || {};
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 py-12 md:py-20 flex flex-col items-center justify-center min-h-[80vh]">
        {/* Animated Success Tick */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.2 
          }}
        >
          {/* Outer glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-green-500/20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ 
              duration: 1.5, 
              repeat: 2,
              repeatType: "loop",
              ease: "easeOut"
            }}
          />
          
          {/* Main circle */}
          <motion.div
            className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl"
            initial={{ rotate: -180 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Check className="w-16 h-16 md:w-20 md:h-20 text-white stroke-[3]" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
            Thank You for Shopping!
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-accent">
            KKOUTFITD
          </p>
        </motion.div>

        {/* Order Info */}
        <motion.div
          className="mt-8 text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-muted-foreground">
            Your payment was successful and your order has been placed.
          </p>
          {orderId && (
            <p className="text-sm text-muted-foreground">
              Order ID: <span className="font-mono font-semibold">{orderId.slice(0, 8).toUpperCase()}</span>
            </p>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Button
            size="lg"
            onClick={() => navigate('/account')}
            className="gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            View Orders
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/shop')}
            className="gap-2"
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Floating confetti animation */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#f472b6', '#a78bfa', '#34d399', '#fbbf24', '#60a5fa'][i % 5],
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ y: -20, opacity: 1, rotate: 0 }}
                animate={{ 
                  y: window.innerHeight + 20, 
                  opacity: 0,
                  rotate: Math.random() * 360
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: "easeIn"
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
