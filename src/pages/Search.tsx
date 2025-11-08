import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product4 from "@/assets/product-4.jpg";

const searchResults = [
  {
    id: "1",
    name: "Cream Embroidered Kurta Pajama Set",
    price: 5999,
    originalPrice: 8999,
    image: product1,
    badge: "Bestseller",
  },
  {
    id: "2",
    name: "Royal Black Sherwani with Golden Embroidery",
    price: 24999,
    originalPrice: 34999,
    image: product2,
    badge: "New",
  },
  {
    id: "4",
    name: "Emerald Green Silk Kurta with Gold Details",
    price: 7999,
    originalPrice: 11999,
    image: product4,
  },
];

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 py-8 md:py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="pl-12 h-14 text-lg"
            />
          </div>
        </div>

        {query && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                Search results for "{query}"
              </h1>
              <p className="text-muted-foreground">
                {searchResults.length} products found
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </>
        )}

        {!query && (
          <div className="text-center py-16">
            <SearchIcon className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-2xl font-serif font-bold mb-4">Start Searching</h2>
            <p className="text-muted-foreground">
              Enter a keyword to find products
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Search;
