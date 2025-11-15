import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Rahul Sharma",
    location: "Mumbai",
    rating: 5,
    comment: "Exceptional quality and craftsmanship! The sherwani I purchased was perfect for my wedding. Highly recommended!",
    verified: true,
  },
  {
    name: "Arjun Patel",
    location: "Delhi",
    rating: 5,
    comment: "The custom tailoring service is outstanding. They took precise measurements and delivered exactly what I wanted.",
    verified: true,
  },
  {
    name: "Vikram Singh",
    location: "Jaipur",
    rating: 5,
    comment: "Best ethnic wear collection I've found online. Fast delivery and excellent customer service.",
    verified: true,
  },
  {
    name: "Karan Mehta",
    location: "Bangalore",
    rating: 5,
    comment: "The fabric quality is premium and the embroidery work is exquisite. Worth every rupee!",
    verified: true,
  },
];

export const TestimonialsCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="bg-muted/30 py-12 md:py-16">
      <div className="container px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-3 md:mb-4">
            What Our Customers Say
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by thousands across India
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-opacity duration-500 ${
                  index === current ? "opacity-100" : "opacity-0 absolute inset-0"
                }`}
              >
                <div className="bg-background rounded-lg p-6 md:p-8 shadow-sm">
                  <div className="flex gap-1 mb-4 justify-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-base md:text-lg text-center mb-6 italic text-foreground">
                    "{testimonial.comment}"
                  </p>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    {testimonial.verified && (
                      <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Verified Buyer
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-2 rounded-full transition-all ${
                  index === current ? "bg-accent w-8" : "bg-muted-foreground/30 w-2"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
