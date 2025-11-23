import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface PromotionalBannerProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  bgGradient?: string;
  bgImage?: string;
  badge?: string;
  showTimer?: boolean;
}

export const PromotionalBanner = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  bgGradient = "from-primary/10 via-accent/10 to-secondary/10",
  bgImage,
  badge,
  showTimer = false,
}: PromotionalBannerProps) => {
  return (
    <section className="container px-4 py-6 md:py-8">
      <div className={`relative overflow-hidden rounded-lg border border-border ${bgImage ? 'bg-background' : `bg-gradient-to-r ${bgGradient}`} shadow-sm hover:shadow-md transition-shadow duration-300`}>
        {bgImage && (
          <>
            <img
              src={bgImage}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
          </>
        )}
        <div className="relative px-6 py-8 md:px-12 md:py-12 lg:py-16">
          <div className="max-w-2xl">
            {badge && (
              <Badge 
                variant="secondary" 
                className="mb-4 bg-primary text-primary-foreground font-semibold px-4 py-1 animate-fade-in"
              >
                {badge}
              </Badge>
            )}
            
            <h2 className={`text-3xl md:text-5xl lg:text-6xl font-bold mb-3 font-sans tracking-tight animate-fade-in ${bgImage ? 'text-white' : 'text-foreground'}`}>
              {title}
            </h2>
            
            <p className={`text-base md:text-xl mb-6 max-w-xl animate-fade-in ${bgImage ? 'text-white/90' : 'text-muted-foreground'}`}>
              {subtitle}
            </p>

            {showTimer && (
              <div className={`flex items-center gap-2 mb-6 ${bgImage ? 'text-white' : 'text-foreground'} animate-fade-in`}>
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Ends in 2 days</span>
              </div>
            )}
            
            <Link to={ctaLink} className="inline-block animate-scale-in">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-base md:text-lg hover:scale-105"
              >
                {ctaText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
