import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroSherwani from "@/assets/hero-sherwani.jpg";
import heroKurta from "@/assets/hero-kurta.jpg";
import heroBandhgala from "@/assets/hero-bandhgala.jpg";
import heroSaree from "@/assets/hero-saree.jpg";

const occasions = [
  {
    title: "Wedding Collection",
    subtitle: "Royal sherwanis for your special day",
    image: heroSherwani,
    link: "/category/sherwanis",
  },
  {
    title: "Festival Wear",
    subtitle: "Traditional kurtas for celebrations",
    image: heroKurta,
    link: "/category/kurtas",
  },
  {
    title: "Party Essentials",
    subtitle: "Elegant bandhgalas for parties",
    image: heroBandhgala,
    link: "/category/bandhgalas",
  },
  {
    title: "Casual Collection",
    subtitle: "Comfortable daily wear",
    image: heroSaree,
    link: "/category/indo-western",
  },
];

export const OccasionShopping = () => {
  return (
    <section className="container px-4 py-12 md:py-16">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-3 md:mb-4">
          Shop by Occasion
        </h2>
        <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
          Find the perfect outfit for every celebration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {occasions.map((occasion, index) => (
          <Link
            key={index}
            to={occasion.link}
            className="group relative overflow-hidden rounded-lg aspect-[16/10] bg-muted"
          >
            <img
              src={occasion.image}
              alt={occasion.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                {occasion.title}
              </h3>
              <p className="text-sm md:text-base mb-4 text-white/90">
                {occasion.subtitle}
              </p>
              <Button variant="secondary" size="sm">
                Shop Now
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
