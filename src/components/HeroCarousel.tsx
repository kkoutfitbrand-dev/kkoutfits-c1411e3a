import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroKurta from "@/assets/hero-kurta.jpg";
import heroSherwani from "@/assets/hero-sherwani.jpg";
import heroBandhgala from "@/assets/hero-bandhgala.jpg";
const slides = [{
  image: heroKurta,
  title: "Royal Kurta Collection",
  subtitle: "Timeless Elegance for Modern Men",
  cta: "Shop Now",
  link: "/category/kurtas"
}, {
  image: heroSherwani,
  title: "Wedding Sherwanis",
  subtitle: "Luxury Bridal Wear for Grooms",
  cta: "Explore Collection",
  link: "/category/sherwanis"
}, {
  image: heroBandhgala,
  title: "Contemporary Style",
  subtitle: "Designer Bandhgala Jackets",
  cta: "Discover More",
  link: "/category/bandhgalas"
}];
export const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };
  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };
  return <div className="relative h-[300px] md:h-[400px] overflow-hidden bg-muted">
      {slides.map((slide, index) => <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}>
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container px-4">
              <div className="max-w-xl text-primary-foreground">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 font-sans">
                  {slide.title}
                </h2>
                <p className="text-sm md:text-base mb-4">
                  {slide.subtitle}
                </p>
                <Link to={slide.link}>
                  <Button size="default" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold rounded-sm">
                    {slide.cta}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>)}

      {/* Navigation Buttons */}
      
      

      {/* Dots */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => <button key={index} onClick={() => setCurrentSlide(index)} className={`h-2 rounded-full transition-all ${index === currentSlide ? "bg-primary-foreground w-8" : "bg-primary-foreground/50 w-2"}`} />)}
      </div>
    </div>;
};