import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOccasionProducts, getFirstImage } from "@/hooks/useOccasionProducts";
import heroSherwani from "@/assets/hero-sherwani.jpg";
import heroKurta from "@/assets/hero-kurta.jpg";
import heroBandhgala from "@/assets/hero-bandhgala.jpg";
import heroSaree from "@/assets/hero-saree.jpg";

const occasionMeta = {
  wedding: {
    title: "Wedding Collection",
    subtitle: "Royal sherwanis for your special day",
    fallbackImage: heroSherwani,
    link: "/category/sherwanis",
  },
  festival: {
    title: "Festival Wear",
    subtitle: "Traditional kurtas for celebrations",
    fallbackImage: heroKurta,
    link: "/category/kurtas",
  },
  party: {
    title: "Party Essentials",
    subtitle: "Elegant bandhgalas for parties",
    fallbackImage: heroBandhgala,
    link: "/category/bandhgalas",
  },
  casual: {
    title: "Casual Collection",
    subtitle: "Comfortable daily wear",
    fallbackImage: heroSaree,
    link: "/category/indo-western",
  },
};

type OccasionKey = keyof typeof occasionMeta;

export const OccasionShopping = () => {
  const { products, loading } = useOccasionProducts();

  const occasions: OccasionKey[] = ["wedding", "festival", "party", "casual"];

  return (
    <section className="container px-4 py-12 md:py-16">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-3 md:mb-4">
          Shop by Occasion
        </h2>
        <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
          Find the perfect outfit for every celebration - AI curated for you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {occasions.map((occasionKey) => {
          const meta = occasionMeta[occasionKey];
          const occasionProducts = products[occasionKey];
          const hasProducts = occasionProducts && occasionProducts.length > 0;

          if (loading) {
            return (
              <div key={occasionKey} className="relative overflow-hidden rounded-lg aspect-[16/10] bg-muted">
                <Skeleton className="w-full h-full" />
              </div>
            );
          }

          return (
            <div
              key={occasionKey}
              className="group relative overflow-hidden rounded-lg bg-muted"
            >
              {/* Main occasion card with first product or fallback */}
              <Link
                to={meta.link}
                className="block relative aspect-[16/10]"
              >
                <img
                  src={hasProducts ? getFirstImage(occasionProducts[0].images) : meta.fallbackImage}
                  alt={meta.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                    {meta.title}
                  </h3>
                  <p className="text-sm md:text-base mb-4 text-white/90">
                    {meta.subtitle}
                  </p>
                  <Button variant="secondary" size="sm">
                    Shop Now
                  </Button>
                </div>
              </Link>

              {/* Product thumbnails - ML classified products */}
              {hasProducts && occasionProducts.length > 1 && (
                <div className="absolute top-3 right-3 flex gap-2">
                  {occasionProducts.slice(1, 4).map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      className="w-12 h-12 md:w-14 md:h-14 rounded-md overflow-hidden border-2 border-white/50 shadow-lg hover:border-white transition-colors bg-white/10 backdrop-blur-sm"
                    >
                      <img
                        src={getFirstImage(product.images)}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  ))}
                </div>
              )}

              {/* AI badge */}
              {hasProducts && (
                <div className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                  AI Curated
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
