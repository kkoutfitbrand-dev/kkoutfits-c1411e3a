import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  title: string;
  image: string;
  link: string;
}

export const CategoryCard = ({ title, image, link }: CategoryCardProps) => {
  return (
    <Link to={link}>
      <Card className="group relative overflow-hidden border-0 rounded-lg h-[400px] cursor-pointer">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
          <h3 className="text-2xl font-serif font-semibold mb-2">{title}</h3>
          <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity">
            Shop Collection →
          </p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/60">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              View Collection
            </button>
          </div>
        </div>
      </Card>
    </Link>
  );
};
