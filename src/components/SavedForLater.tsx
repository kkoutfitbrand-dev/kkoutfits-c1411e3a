import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

interface SavedItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
}

interface SavedForLaterProps {
  items: SavedItem[];
  onMoveToCart: (id: string) => void;
  onRemove: (id: string) => void;
}

export const SavedForLater = ({ items, onMoveToCart, onRemove }: SavedForLaterProps) => {
  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Saved For Later ({items.length})</h2>
      
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex gap-4">
              <Link to={`/product/${item.id}`} className="flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
              </Link>
              
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <Link to={`/product/${item.id}`}>
                      <h3 className="font-medium hover:text-primary">{item.name}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(item.id)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <p className="text-lg font-semibold">₹{item.price.toLocaleString()}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveToCart(item.id)}
                  >
                    Move to Bag
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
