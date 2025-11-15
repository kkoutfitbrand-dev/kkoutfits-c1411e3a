import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Minus, Plus } from "lucide-react";

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
}: StickyAddToCartProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar when scrolled past 600px (approximately past the main add to cart button)
      setIsVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border shadow-lg animate-in slide-in-from-bottom duration-300">
      <div className="container px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Product Image & Name */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src={productImage}
              alt={productName}
              className="w-14 h-14 object-cover rounded-lg border border-border"
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
          </div>

          {/* Size Selector */}
          <div className="hidden sm:flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap">Size:</label>
            <div className="flex gap-1">
              {sizes.slice(0, 3).map((size) => (
                <button
                  key={size}
                  onClick={() => onSizeChange(size)}
                  className={`px-3 py-1.5 text-sm rounded border-2 font-medium transition-colors ${
                    selectedSize === size
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border hover:border-accent"
                  }`}
                >
                  {size}
                </button>
              ))}
              {sizes.length > 3 && (
                <button className="px-3 py-1.5 text-sm rounded border-2 border-border hover:border-accent">
                  +{sizes.length - 3}
                </button>
              )}
            </div>
          </div>

          {/* Quantity Selector - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onQuantityChange(quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Add to Cart Button */}
          <Button onClick={onAddToCart} className="gap-2 whitespace-nowrap" size="lg">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
