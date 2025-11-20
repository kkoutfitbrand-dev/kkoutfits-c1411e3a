import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PromotionalBannerProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  bgGradient?: string;
  bgImage?: string;
}

export const PromotionalBanner = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  bgGradient = "from-myntra-pink to-myntra-orange",
  bgImage,
}: PromotionalBannerProps) => {
  return (
    <section className="container px-4 py-8">
      <div className={`relative overflow-hidden rounded-md ${bgImage ? '' : `bg-gradient-to-r ${bgGradient}`} h-48 md:h-64`}>
        {bgImage && (
          <>
            <img
              src={bgImage}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </>
        )}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 text-white">
          <h2 className="text-2xl md:text-4xl font-bold mb-2 font-sans">
            {title}
          </h2>
          <p className="text-sm md:text-lg mb-4 opacity-90">
            {subtitle}
          </p>
          <Link to={ctaLink}>
            <Button
              size="lg"
              className="bg-white text-foreground hover:bg-white/90 font-bold"
            >
              {ctaText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
