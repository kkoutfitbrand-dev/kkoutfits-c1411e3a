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
      </Card>
    </Link>
  );
};
