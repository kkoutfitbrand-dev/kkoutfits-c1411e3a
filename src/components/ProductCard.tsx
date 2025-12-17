import { Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useWishlist } from "@/hooks/useWishlist";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  rating?: number;
  category?: string | null;
  productId?: string;
}

const getCategoryColor = (category: string | null | undefined): string => {
  switch (category?.toLowerCase()) {
    case 'men':
      return 'bg-blue-500/90 text-white';
    case 'women':
      return 'bg-pink-500/90 text-white';
    case 'casual':
      return 'bg-emerald-500/90 text-white';
    case 'formal':
      return 'bg-slate-700/90 text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  badge,
  rating = 4.2,
  category,
  productId,
}: ProductCardProps) => {
  const { isInWishlist, toggleWishlist, loading } = useWishlist();
  const actualProductId = productId || id;
  const inWishlist = isInWishlist(actualProductId);
  
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(actualProductId, name);
  };

  return (
    <Link to={`/product/${id}`} className="group block">
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Card className="overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300">
          <div className="relative overflow-hidden aspect-[3/4]">
            <motion.img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            {badge && (
              <Badge className="absolute top-2 left-2 bg-foreground text-background border-0 text-xs font-bold uppercase rounded-sm px-2 py-1">
                {badge}
              </Badge>
            )}
            <button
              onClick={handleWishlistClick}
              disabled={loading}
              className={`absolute top-2 right-2 p-2 rounded-full transition-all ${
                inWishlist 
                  ? "bg-red-500 text-white" 
                  : "bg-background/80 text-foreground hover:bg-background"
              }`}
            >
              <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
            </button>
            {category && (
              <Badge className={`absolute bottom-10 right-2 text-xs font-medium px-2 py-1 rounded-sm border-0 ${getCategoryColor(category)}`}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Badge>
            )}
            {discount > 0 && (
              <div className="absolute bottom-2 left-2 bg-myntra-pink text-white text-xs font-bold px-2 py-1 rounded-sm">
                {discount}% OFF
              </div>
            )}
          </div>
          <CardContent className="p-3">
            <h3 className="font-medium text-sm mb-1 line-clamp-2 text-foreground">
              {name}
            </h3>
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center gap-0.5 bg-myntra-green text-white text-xs font-bold px-1.5 py-0.5 rounded-sm">
                <span>{rating}</span>
                <Star className="h-2.5 w-2.5 fill-current" />
              </div>
              <span className="text-xs text-muted-foreground">(2.3k)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">
                ₹{price.toLocaleString("en-IN")}
              </span>
              {originalPrice && (
                <>
                  <span className="text-xs text-muted-foreground line-through">
                    ₹{originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-myntra-orange font-semibold">
                    ({discount}% OFF)
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};
