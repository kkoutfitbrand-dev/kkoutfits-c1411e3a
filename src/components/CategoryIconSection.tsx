import { Link } from "react-router-dom";
import categoryShirts from "@/assets/category-shirts.jpg";
import categoryTshirts from "@/assets/category-tshirts.jpg";
import categoryPants from "@/assets/category-pants.jpg";
import categoryJeans from "@/assets/category-jeans.jpg";
import categoryCasual from "@/assets/category-casual.jpg";
import categoryFormal from "@/assets/category-formal.jpg";
const categories = [{
  title: "Shirts",
  image: categoryShirts,
  link: "/category/shirts"
}, {
  title: "T-Shirts",
  image: categoryTshirts,
  link: "/category/t-shirts"
}, {
  title: "Pants",
  image: categoryPants,
  link: "/category/pants"
}, {
  title: "Jeans",
  image: categoryJeans,
  link: "/category/jeans"
}, {
  title: "Casual Wear",
  image: categoryCasual,
  link: "/category/casual-wear"
}, {
  title: "Formal Wear",
  image: categoryFormal,
  link: "/category/formal-wear"
}];
export const CategoryIconSection = () => {
  return <div className="border-t border-border bg-background">
      
    </div>;
};