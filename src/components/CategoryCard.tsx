import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  title: string;
  image: string;
  link: string;
}

export const CategoryCard = ({ title, image, link }: CategoryCardProps) => {
  return (
    <Link to={link} className="group block">
      <div className="relative overflow-hidden rounded-sm aspect-square border border-border bg-card">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3">
          <h3 
            className="text-white text-xs sm:text-sm md:text-base font-bold uppercase font-sans drop-shadow-lg"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.9)' }}
          >
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
};
