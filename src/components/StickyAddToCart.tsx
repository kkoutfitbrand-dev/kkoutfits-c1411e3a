import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StickyAddToCartProps {
  productName: string;
  productImage: string;
  price: number;
  originalPrice: number;
  sizes: string[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
  /** Element id that controls when the bar should appear (appears when this element scrolls out of view) */
  triggerId?: string;
}

export const StickyAddToCart = ({
  productName,
  productImage,
  price,
  originalPrice,
  sizes,
  selectedSize,
  onSizeChange,
  quantity,
  onQuantityChange,
  onAddToCart,
  triggerId,
}: StickyAddToCartProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Preferred: show sticky bar only when the main action buttons are NOT visible.
    if (triggerId) {
      const el = document.getElementById(triggerId);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          // If user can't see the main Add to Cart area, show the sticky bar.
          setIsVisible(!entry.isIntersecting);
        },
        {
          // A little buffer so it doesn't flicker at the edge
          root: null,
          threshold: 0.2,
        }
      );

      observer.observe(el);
      return () => observer.disconnect();
    }

    // Fallback: pixel-based scroll threshold
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [triggerId]);

  if (!mounted) return null;

  const stickyBar = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border shadow-2xl"
        >
          <div className="container px-4 py-3">
            <div className="flex items-center gap-4">
              {/* Product Image & Name */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                <img
                  src={productImage}
                  alt={productName}
                  className="w-14 h-14 object-cover rounded-lg border border-border shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{productName}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">₹{price.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{originalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Size Selector */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="hidden sm:flex items-center gap-2"
              >
                <label className="text-sm font-medium whitespace-nowrap">Size:</label>
                <div className="flex gap-1">
                  {sizes.slice(0, 3).map((size) => (
                    <button
                      key={size}
                      onClick={() => onSizeChange(size)}
                      className={`px-3 py-1.5 text-sm rounded border-2 font-medium transition-all duration-200 ${
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground scale-105"
                          : "border-border hover:border-primary hover:scale-105"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                  {sizes.length > 3 && (
                    <button className="px-3 py-1.5 text-sm rounded border-2 border-border hover:border-primary transition-colors">
                      +{sizes.length - 3}
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Quantity Selector - Hidden on mobile */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="hidden md:flex items-center gap-2"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 transition-transform hover:scale-110"
                  onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 transition-transform hover:scale-110"
                  onClick={() => onQuantityChange(quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </motion.div>

              {/* Add to Cart Button */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <Button
                  onClick={onAddToCart}
                  className="gap-2 whitespace-nowrap shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  size="lg"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span className="hidden sm:inline">Add to Cart</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(stickyBar, document.body);
};
