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
      <div className="relative overflow-hidden rounded-lg aspect-square border border-border bg-card shadow-md">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Professional dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        {/* Text container with solid background */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm px-3 py-2 md:px-4 md:py-3">
          <h3 className="text-white text-sm sm:text-base md:text-lg font-bold uppercase tracking-wide">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
};
