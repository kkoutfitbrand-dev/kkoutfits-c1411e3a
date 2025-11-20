import { Link } from "react-router-dom";

const brands = [
  { name: "Nike", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" },
  { name: "Adidas", image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200&h=200&fit=crop" },
  { name: "Puma", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200&h=200&fit=crop" },
  { name: "Levi's", image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=200&h=200&fit=crop" },
  { name: "H&M", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop" },
  { name: "Zara", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop" },
  { name: "Mango", image: "https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?w=200&h=200&fit=crop" },
  { name: "Forever 21", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=200&fit=crop" },
];

export const BrandShowcase = () => {
  return (
    <section className="container px-4 py-8">
      <h2 className="text-xl md:text-2xl font-bold mb-6 font-sans uppercase">
        Shop by Brand
      </h2>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {brands.map((brand, index) => (
          <Link
            key={index}
            to={`/category/${brand.name.toLowerCase()}`}
            className="group"
          >
            <div className="aspect-square rounded-sm border border-border overflow-hidden bg-card transition-shadow hover:shadow-md">
              <img
                src={brand.image}
                alt={brand.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
