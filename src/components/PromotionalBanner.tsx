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
      <div className={`relative overflow-hidden border border-border ${bgImage ? 'bg-background' : `bg-gradient-to-r ${bgGradient}`} shadow-sm hover:shadow-md transition-shadow duration-300`}>
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
        <div className="relative px-6 py-4 md:px-8 md:py-5 lg:py-6">
          <div className="max-w-2xl">
            {badge && (
              <Badge 
                variant="secondary" 
                className="mb-2 bg-primary text-primary-foreground font-semibold px-3 py-0.5 text-xs animate-fade-in"
              >
                {badge}
              </Badge>
            )}
            
            <h2 className={`text-xl md:text-3xl lg:text-4xl font-bold mb-2 font-sans tracking-tight animate-fade-in ${bgImage ? 'text-white' : 'text-foreground'}`}>
              {title}
            </h2>
            
            <p className={`text-sm md:text-base mb-3 max-w-xl animate-fade-in ${bgImage ? 'text-white/90' : 'text-muted-foreground'}`}>
              {subtitle}
            </p>

            {showTimer && (
              <div className={`flex items-center gap-2 mb-3 ${bgImage ? 'text-white' : 'text-foreground'} animate-fade-in`}>
                <Clock className="w-3 h-3" />
                <span className="text-xs font-medium">Ends in 2 days</span>
              </div>
            )}
            
            <Link to={ctaLink} className="inline-block animate-scale-in">
              <Button
                size="default"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2 text-sm md:text-base hover:scale-105"
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
