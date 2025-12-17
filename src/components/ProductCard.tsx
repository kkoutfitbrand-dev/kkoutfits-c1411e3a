import { Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useWishlist } from "@/hooks/useWishlist";
import { useProductRating } from "@/hooks/useProductRatings";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  category?: string | null;
  productId?: string;
}

const getCategoryStyle = (category: string | null | undefined): string => {
  switch (category?.toLowerCase()) {
    case 'men':
      return 'bg-gradient-to-r from-blue-600 to-blue-400 shadow-blue-500/30';
    case 'women':
      return 'bg-gradient-to-r from-pink-600 to-pink-400 shadow-pink-500/30';
    case 'casual':
      return 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-emerald-500/30';
    case 'formal':
      return 'bg-gradient-to-r from-slate-700 to-slate-500 shadow-slate-500/30';
    default:
      return 'bg-gradient-to-r from-primary to-primary/70 shadow-primary/30';
  }
};

export const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  badge,
  category,
  productId,
}: ProductCardProps) => {
  const { isInWishlist, toggleWishlist, loading } = useWishlist();
  const actualProductId = productId || id;
  const inWishlist = isInWishlist(actualProductId);
  const { rating: productRating } = useProductRating(actualProductId);
  
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
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`absolute bottom-10 right-2 px-3 py-1 rounded-full text-white text-[10px] font-semibold uppercase tracking-wider shadow-lg backdrop-blur-sm ${getCategoryStyle(category)}`}
              >
                {category}
              </motion.div>
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
            {productRating.review_count > 0 ? (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex items-center gap-0.5 bg-myntra-green text-white text-xs font-bold px-1.5 py-0.5 rounded-sm">
                  <span>{productRating.average_rating}</span>
                  <Star className="h-2.5 w-2.5 fill-current" />
                </div>
                <span className="text-xs text-muted-foreground">
                  ({productRating.review_count >= 1000 
                    ? `${(productRating.review_count / 1000).toFixed(1)}k` 
                    : productRating.review_count})
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 mb-2">
                <span className="text-xs text-muted-foreground">No reviews yet</span>
              </div>
            )}
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
