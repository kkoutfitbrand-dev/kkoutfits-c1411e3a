import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  rating?: number;
}

export const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  badge,
  rating = 4.2,
}: ProductCardProps) => {
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Link to={`/product/${id}`} className="group block">
      <Card className="overflow-hidden border border-border hover:shadow-md transition-shadow duration-200">
        <div className="relative overflow-hidden aspect-[3/4]">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
          {badge && (
            <Badge className="absolute top-2 left-2 bg-foreground text-background border-0 text-xs font-bold uppercase rounded-sm px-2 py-1">
              {badge}
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
    </Link>
  );
};