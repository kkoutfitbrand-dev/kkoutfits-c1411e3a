import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Sparkles, CheckCircle2, ShoppingBag, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

const steps = [
  {
    id: 1,
    icon: Mail,
    title: "Open your Gmail inbox",
    subtitle: "Check the email address you used to sign up",
    color: "from-red-500 to-red-600"
  },
  {
    id: 2,
    icon: Sparkles,
    title: "Find the email from KK Outfits",
    subtitle: "Subject: Confirm your KK Outfits account",
    color: "from-amber-500 to-orange-500"
  },
  {
    id: 3,
    icon: CheckCircle2,
    title: "Click 'Confirm Account'",
    subtitle: "This secures and activates your account",
    color: "from-emerald-500 to-green-600"
  },
  {
    id: 4,
    icon: ShoppingBag,
    title: "Your account is ready!",
    subtitle: "Start exploring premium men's & women's fashion",
    color: "from-purple-500 to-pink-500"
  }
];

const EmailConfirmationModal = ({ isOpen, onClose, email }: EmailConfirmationModalProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      const timer = setInterval(() => {
        setActiveStep(prev => (prev < 3 ? prev + 1 : prev));
      }, 1500);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const handleResendEmail = async () => {
    setIsResending(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    setIsResending(false);

    if (error) {
      toast({
        title: "Failed to resend",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Email sent!",
        description: "Please check your inbox for the confirmation link."
      });
    }
  };

  const handleStartShopping = () => {
    onClose();
    navigate('/');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl overflow-hidden border border-border"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-primary to-primary/80 px-6 py-8 text-center overflow-hidden">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block text-3xl mb-2"
              >
                ✨
              </motion.span>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-foreground">
                Confirm Your Email to Start Shopping
              </h2>
              <p className="text-primary-foreground/80 text-sm mt-2">
                We've sent a confirmation email to <span className="font-semibold">{email}</span>
              </p>
            </motion.div>

            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          </div>

          {/* Progress indicator */}
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: activeStep >= index ? 1 : 0.8 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      activeStep >= index
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {activeStep > index ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      step.id
                    )}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className="w-8 md:w-12 h-1 mx-1">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: activeStep > index ? 1 : 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="h-full bg-primary origin-left rounded-full"
                      />
                      <div className="h-full bg-muted -mt-1 rounded-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Steps content */}
          <div className="px-6 py-6 space-y-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{
                    opacity: activeStep >= index ? 1 : 0.4,
                    x: 0,
                    scale: activeStep === index ? 1.02 : 1
                  }}
                  transition={{ delay: index * 0.3, duration: 0.5 }}
                  className={`relative flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${
                    activeStep === index
                      ? 'bg-muted/80 shadow-lg'
                      : 'bg-transparent'
                  }`}
                >
                  {/* Icon container */}
                  <motion.div
                    animate={{
                      scale: activeStep === index ? [1, 1.1, 1] : 1
                    }}
                    transition={{
                      duration: 1,
                      repeat: activeStep === index ? Infinity : 0,
                      repeatType: "reverse"
                    }}
                    className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>

                  {/* Text content */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.subtitle}</p>
                  </div>

                  {/* Active indicator */}
                  {activeStep === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Confetti animation on step 4 */}
          <AnimatePresence>
            {activeStep === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none overflow-hidden"
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      x: "50%",
                      y: "30%",
                      scale: 0
                    }}
                    animate={{
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      scale: [0, 1, 0.5],
                      rotate: Math.random() * 360
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.05,
                      ease: "easeOut"
                    }}
                    className={`absolute w-3 h-3 rounded-full ${
                      ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-amber-400', 'bg-emerald-400'][i % 5]
                    }`}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer actions */}
          <div className="px-6 pb-6 space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={handleStartShopping}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                size="lg"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Start Shopping on KK Outfits
              </Button>
            </motion.div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>Didn't receive email?</span>
              <Button
                variant="link"
                size="sm"
                onClick={handleResendEmail}
                disabled={isResending}
                className="p-0 h-auto font-medium text-primary hover:text-primary/80"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend Email"
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmailConfirmationModal;
