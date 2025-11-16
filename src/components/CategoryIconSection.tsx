import { Link } from "react-router-dom";
import categoryShirts from "@/assets/category-shirts.jpg";
import categoryTshirts from "@/assets/category-tshirts.jpg";
import categoryPants from "@/assets/category-pants.jpg";
import categoryJeans from "@/assets/category-jeans.jpg";
import categoryCasual from "@/assets/category-casual.jpg";
import categoryFormal from "@/assets/category-formal.jpg";

const categories = [
  {
    title: "Shirts",
    image: categoryShirts,
    link: "/category/shirts",
  },
  {
    title: "T-Shirts",
    image: categoryTshirts,
    link: "/category/t-shirts",
  },
  {
    title: "Pants",
    image: categoryPants,
    link: "/category/pants",
  },
  {
    title: "Jeans",
    image: categoryJeans,
    link: "/category/jeans",
  },
  {
    title: "Casual Wear",
    image: categoryCasual,
    link: "/category/casual-wear",
  },
  {
    title: "Formal Wear",
    image: categoryFormal,
    link: "/category/formal-wear",
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
