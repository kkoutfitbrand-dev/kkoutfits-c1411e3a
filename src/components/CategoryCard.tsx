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
      <div className="relative overflow-hidden rounded-lg aspect-square bg-card shadow-lg">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {/* Text with stroke effect */}
        <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4">
          <h3 
            className="text-white text-base sm:text-lg md:text-xl font-bold uppercase tracking-wider"
            style={{ 
              textShadow: '2px 2px 0 rgba(0,0,0,0.8), -1px -1px 0 rgba(0,0,0,0.8), 1px -1px 0 rgba(0,0,0,0.8), -1px 1px 0 rgba(0,0,0,0.8)'
            }}
          >
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
};
