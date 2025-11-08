import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroSaree from "@/assets/hero-saree.jpg";
import heroLehenga from "@/assets/hero-lehenga.jpg";
import heroSalwar from "@/assets/hero-salwar.jpg";

const slides = [
  {
    image: heroSaree,
    title: "Drape Dynasty",
    subtitle: "Basking In Sun-kissed Sarees",
    cta: "Shop Now",
    link: "/category/sarees",
  },
  {
    image: heroLehenga,
    title: "Bridal Elegance",
    subtitle: "Luxury Lehenga Collection",
    cta: "Explore Collection",
    link: "/category/lehengas",
  },
  {
    image: heroSalwar,
    title: "Ethnic Grace",
    subtitle: "Designer Salwar Kameez",
    cta: "Discover More",
    link: "/category/salwar-kameez",
  },
];

export const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[600px] lg:h-[700px] overflow-hidden bg-muted">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container px-4">
              <div className="max-w-2xl text-primary-foreground">
                <h2 className="text-5xl lg:text-7xl font-serif font-bold mb-4 animate-in fade-in slide-in-from-left duration-700">
                  {slide.title}
                </h2>
                <p className="text-xl lg:text-2xl mb-8 animate-in fade-in slide-in-from-left duration-700 delay-150">
                  {slide.subtitle}
                </p>
                <Button
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold animate-in fade-in slide-in-from-left duration-700 delay-300"
                >
                  {slide.cta}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/20 hover:bg-background/40 text-primary-foreground backdrop-blur"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/20 hover:bg-background/40 text-primary-foreground backdrop-blur"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? "bg-primary-foreground w-8"
                : "bg-primary-foreground/50 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
