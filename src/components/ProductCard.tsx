import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
}
export const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  badge
}: ProductCardProps) => {
  const discount = originalPrice ? Math.round((originalPrice - price) / originalPrice * 100) : 0;
  return <Card className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300">
      <Link to={`/product/${id}`}>
        <div className="relative overflow-hidden aspect-[3/4]">
          <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          {badge && <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
              {badge}
            </Badge>}
          {discount > 0 && <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">
              {discount}% OFF
            </Badge>}
          
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">₹{price.toLocaleString("en-IN")}</span>
          {originalPrice && <span className="text-sm text-muted-foreground line-through">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>}
        </div>
      </CardContent>
    </Card>;
};