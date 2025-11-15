import { ProductCard } from "@/components/ProductCard";
import { Flame } from "lucide-react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";

const trendingProducts = [
  {
    id: "1",
    name: "Cream Embroidered Kurta Pajama Set",
    price: 5999,
    originalPrice: 8999,
    image: product1,
    badge: "Trending",
  },
  {
    id: "2",
    name: "Royal Black Sherwani with Golden Embroidery",
    price: 24999,
    originalPrice: 34999,
    image: product2,
    badge: "Hot",
  },
  {
    id: "4",
    name: "Emerald Green Silk Kurta with Gold Details",
    price: 7999,
    originalPrice: 11999,
    image: product4,
    badge: "Popular",
  },
  {
    id: "5",
    name: "Premium Ivory Wedding Sherwani",
    price: 49999,
    originalPrice: 69999,
    image: product5,
    badge: "Best Seller",
  },
];

export const TrendingProducts = () => {
  return (
    <section className="container px-4 py-12 md:py-16">
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <Flame className="h-6 w-6 text-orange-500" />
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold">
            Trending Now
          </h2>
          <Flame className="h-6 w-6 text-orange-500" />
        </div>
        <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
          Most viewed and loved by customers this week
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trendingProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
};
