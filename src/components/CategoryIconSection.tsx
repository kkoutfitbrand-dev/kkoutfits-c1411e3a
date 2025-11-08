import { Link } from "react-router-dom";
import categoryKurta from "@/assets/category-kurta.jpg";
import categorySherwani from "@/assets/category-sherwani.jpg";
import categoryBandhgala from "@/assets/category-bandhgala.jpg";

const categories = [
  {
    title: "Bestsellers",
    image: categoryKurta,
    link: "/category/bestsellers",
  },
  {
    title: "Kurta",
    image: categoryKurta,
    link: "/category/kurta",
  },
  {
    title: "Sherwani",
    image: categorySherwani,
    link: "/category/sherwani",
  },
  {
    title: "Bandhgala",
    image: categoryBandhgala,
    link: "/category/bandhgala",
  },
  {
    title: "Indo Western",
    image: categoryBandhgala,
    link: "/category/indo-western",
  },
];

export const CategoryIconSection = () => {
  return (
    <div className="border-t border-border bg-background">
      <div className="container px-4 py-6">
        <div className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide justify-start md:justify-center">
          {categories.map((category) => (
            <Link
              key={category.title}
              to={category.link}
              className="flex flex-col items-center gap-2 min-w-[80px] md:min-w-[100px] group"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-border group-hover:border-accent transition-colors">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="text-xs md:text-sm font-medium text-center whitespace-nowrap">
                {category.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
