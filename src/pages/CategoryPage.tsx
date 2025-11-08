import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useParams } from "react-router-dom";

const CategoryPage = () => {
  const { category } = useParams();
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container px-4 py-16">
        <h1 className="text-4xl font-serif font-bold mb-4 capitalize">
          {category?.replace("-", " ")}
        </h1>
        <p className="text-muted-foreground mb-8">
          This page will display all products in the {category} category.
        </p>
        <div className="bg-muted p-8 rounded-lg text-center">
          <p className="text-lg">Category listing page coming soon...</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
