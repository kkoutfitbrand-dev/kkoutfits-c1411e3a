import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroStore from "@/assets/hero-store.png";

export const HeroCarousel = () => {
  return (
    <div className="relative h-[300px] md:h-[400px] overflow-hidden bg-muted">
      <img src={heroStore} alt="Our Store" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      <div className="absolute inset-0 flex items-center">
        <div className="container px-4">
          <div className="max-w-xl text-primary-foreground">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 font-sans">
              Welcome to Our Store
            </h2>
            <p className="text-sm md:text-base mb-4">
              Discover Our Latest Collection
            </p>
            <Link to="/search">
              <Button size="default" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold rounded-sm">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};