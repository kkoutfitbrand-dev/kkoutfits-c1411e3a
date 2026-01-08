import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ExternalLink, MousePointer, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EmailVerificationStepsProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

const steps = [
  {
    icon: Mail,
    title: 'Open Gmail',
    description: 'Go to your Gmail inbox',
    action: 'Open Gmail',
    link: 'https://mail.google.com',
  },
  {
    icon: ExternalLink,
    title: 'Open KK OUTFIT Mail',
    description: 'Find the email from KK OUTFIT',
    action: 'Look for our email',
  },
  {
    icon: MousePointer,
    title: 'Click Confirm Button',
    description: 'Click the confirmation link in the email',
    action: 'Confirm your email',
  },
  {
    icon: ShoppingBag,
    title: 'Start Shopping!',
    description: 'Welcome to KK OUTFIT - enjoy shopping!',
    action: 'Shop Now',
  },
];

export const EmailVerificationSteps = ({ isOpen, onClose, email }: EmailVerificationStepsProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      setCompletedSteps([]);
      
      // Auto-advance through steps for demo
      const timers: NodeJS.Timeout[] = [];
      steps.forEach((_, index) => {
        if (index > 0) {
          timers.push(
            setTimeout(() => {
              setActiveStep(index);
              setCompletedSteps(prev => [...prev, index - 1]);
            }, index * 2000)
          );
        }
      });

      return () => timers.forEach(clearTimeout);
    }
  }, [isOpen]);

  const handleOpenGmail = () => {
    window.open('https://mail.google.com', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-center font-serif text-2xl">
            Verify Your Email
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <p className="text-muted-foreground">
            We've sent a confirmation email to
          </p>
          <p className="font-medium text-primary mt-1">{email}</p>
        </motion.div>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;
              const isCompleted = completedSteps.includes(index);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    scale: isActive ? 1.02 : 1,
                  }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 100
                  }}
                  className={`
                    relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300
                    ${isActive 
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
                      : isCompleted 
                        ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                        : 'border-border bg-card'
                    }
                  `}
                >
                  {/* Step Number / Check */}
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isActive ? [1, 1.2, 1] : 1,
                      rotate: isCompleted ? 360 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                    className={`
                      flex items-center justify-center w-12 h-12 rounded-full shrink-0
                      ${isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <Check className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </motion.div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold ${isActive ? 'text-primary' : ''}`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-1 -top-1"
                    >
                      <span className="flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
                      </span>
                    </motion.div>
                  )}

                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div 
                      className={`
                        absolute left-10 top-full w-0.5 h-4 -translate-x-1/2
                        ${isCompleted ? 'bg-green-500' : 'bg-border'}
                      `}
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6 space-y-3"
        >
          <Button 
            onClick={handleOpenGmail} 
            className="w-full group"
            size="lg"
          >
            <Mail className="mr-2 h-5 w-5" />
            Open Gmail
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="w-full text-muted-foreground"
          >
            I'll verify later
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
