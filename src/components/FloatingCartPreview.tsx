import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, X, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartItem {
  name: string;
  image: string;
  price: number;
  quantity?: number;
  details?: string;
}

interface FloatingCartPreviewProps {
  isVisible: boolean;
  onClose: () => void;
  item: CartItem | null;
}

export const FloatingCartPreview = ({ isVisible, onClose, item }: FloatingCartPreviewProps) => {
  const navigate = useNavigate();

  if (!item) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-[9998]"
            onClick={onClose}
          />
          
          {/* Centered bottom modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[90vw] max-w-md"
          >
          <div className="bg-card border border-border rounded-xl shadow-[0_-4px_30px_rgba(0,0,0,0.15)] overflow-hidden">
            {/* Success Header */}
            <div className="bg-green-500 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                  className="w-5 h-5 bg-white rounded-full flex items-center justify-center"
                >
                  <Check className="h-3 w-3 text-green-500" />
                </motion.div>
                <span className="text-white font-medium text-sm">Added to Cart!</span>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Item Preview */}
            <div className="p-4">
              <div className="flex gap-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>

                <div className="flex-1 min-w-0">
                  <motion.h4
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="font-semibold text-foreground truncate"
                  >
                    {item.name}
                  </motion.h4>
                  {item.details && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-xs text-muted-foreground mt-0.5 line-clamp-1"
                    >
                      {item.details}
                    </motion.p>
                  )}
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    className="text-primary font-bold mt-1"
                  >
                    ₹{item.price.toLocaleString()}
                  </motion.p>
                </div>
              </div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-2 mt-4"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={onClose}
                >
                  Continue Shopping
                </Button>
                <Button
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => {
                    onClose();
                    navigate('/cart');
                  }}
                >
                  View Cart
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </motion.div>
            </div>

            {/* Progress bar for auto-close */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-1 bg-primary origin-left"
            />
          </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
