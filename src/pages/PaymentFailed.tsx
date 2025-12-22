import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { X, RefreshCw, Home, Phone } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, error } = location.state || {};

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 py-12 md:py-20 flex flex-col items-center justify-center min-h-[80vh]">
        {/* Animated Failed Icon */}
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
          {/* Shake animation wrapper */}
          <motion.div
            animate={{ 
              x: [0, -5, 5, -5, 5, 0],
            }}
            transition={{ 
              duration: 0.5, 
              delay: 0.8,
              ease: "easeInOut"
            }}
          >
            {/* Main circle */}
            <motion.div
              className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-2xl"
              initial={{ rotate: -180 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <X className="w-16 h-16 md:w-20 md:h-20 text-white stroke-[3]" />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Failed Message */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
            Payment Failed
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            We couldn't process your payment. Don't worry, no amount was deducted from your account.
          </p>
        </motion.div>

        {/* Error Info */}
        {error && (
          <motion.div
            className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-sm text-destructive text-center">
              {error}
            </p>
          </motion.div>
        )}

        {orderId && (
          <motion.p
            className="mt-4 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Order Reference: <span className="font-mono font-semibold">{orderId.slice(0, 8).toUpperCase()}</span>
          </motion.p>
        )}

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Button
            size="lg"
            onClick={() => navigate('/checkout')}
            className="gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </Button>
        </motion.div>

        {/* Help Section */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <p className="text-muted-foreground mb-2">Need help?</p>
          <Button variant="link" onClick={() => navigate('/contact')} className="gap-2">
            <Phone className="w-4 h-4" />
            Contact Support
          </Button>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentFailed;
