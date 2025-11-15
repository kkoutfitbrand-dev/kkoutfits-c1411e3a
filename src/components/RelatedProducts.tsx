import { ProductCard } from "@/components/ProductCard";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product6 from "@/assets/product-6.jpg";

const relatedProducts = [
  {
    id: "2",
    name: "Royal Black Sherwani with Golden Embroidery",
    price: 24999,
    originalPrice: 34999,
    image: product2,
  },
  {
    id: "3",
    name: "Burgundy Velvet Bandhgala Jacket",
    price: 12999,
    originalPrice: 17999,
    image: product3,
  },
  {
    id: "4",
    name: "Emerald Green Silk Kurta with Gold Details",
    price: 7999,
    originalPrice: 11999,
    image: product4,
  },
  {
    id: "6",
    name: "Grey Indo-Western Kurta",
    price: 6999,
    originalPrice: 9999,
    image: product6,
  },
];

export const RelatedProducts = () => {
  return (
    <section className="container px-4 py-12 md:py-16 border-t border-border">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-3 md:mb-4">
          You May Also Like
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Similar products that complement your style
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
};
