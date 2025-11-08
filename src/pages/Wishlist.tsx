import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import product2 from "@/assets/product-2.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
}

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: "2",
      name: "Royal Black Sherwani with Golden Embroidery",
      price: 24999,
      originalPrice: 34999,
      image: product2,
    },
    {
      id: "4",
      name: "Emerald Green Silk Kurta with Gold Details",
      price: 7999,
      originalPrice: 11999,
      image: product4,
    },
    {
      id: "5",
      name: "Premium Ivory Wedding Sherwani",
      price: 49999,
      originalPrice: 69999,
      image: product5,
    },
  ]);

  const removeItem = (id: string) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 container px-4 py-16 flex flex-col items-center justify-center">
          <Heart className="w-24 h-24 text-muted-foreground mb-6" />
          <h1 className="text-3xl font-serif font-bold mb-4">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground mb-8">Save your favorite items here</p>
          <Link to="/">
            <Button size="lg">Explore Products</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold">
            My Wishlist ({wishlistItems.length})
          </h1>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map(item => (
            <div key={item.id} className="bg-card border border-border rounded-lg overflow-hidden group">
              <div className="relative">
                <Link to={`/product/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 p-2 bg-background/90 rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>
              <div className="p-4">
                <Link to={`/product/${item.id}`}>
                  <h3 className="font-semibold mb-2 hover:text-accent transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-bold">₹{item.price.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{item.originalPrice.toLocaleString()}
                  </span>
                </div>
                <Button className="w-full" size="sm">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Move to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
