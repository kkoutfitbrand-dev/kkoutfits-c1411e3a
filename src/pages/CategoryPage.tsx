import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams } from "react-router-dom";
import { useState } from "react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const allProducts = [
  { id: "1", name: "Cream Embroidered Kurta Pajama Set", price: 5999, originalPrice: 8999, image: product1, badge: "Bestseller" },
  { id: "2", name: "Royal Black Sherwani with Golden Embroidery", price: 24999, originalPrice: 34999, image: product2, badge: "New" },
  { id: "3", name: "Burgundy Velvet Bandhgala Jacket", price: 12999, originalPrice: 17999, image: product3 },
  { id: "4", name: "Emerald Green Silk Kurta with Gold Details", price: 7999, originalPrice: 11999, image: product4 },
  { id: "5", name: "Premium Ivory Wedding Sherwani", price: 49999, originalPrice: 69999, image: product5, badge: "Premium" },
  { id: "6", name: "Grey Indo-Western Kurta", price: 6999, originalPrice: 9999, image: product6 },
];

const CategoryPage = () => {
  const { category } = useParams();
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popularity");
  
  const colors = ["Black", "White", "Cream", "Gold", "Green", "Burgundy"];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 capitalize">
          {category?.replace("-", " ")}
        </h1>
        <p className="text-muted-foreground mb-8">
          Showing {allProducts.length} products
        </p>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Filters</h2>
                <Button variant="ghost" size="sm">Clear All</Button>
              </div>

              {/* Price Range */}
              <div className="mb-6 pb-6 border-b border-border">
                <h3 className="font-semibold mb-4">Price Range</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={100000}
                  step={1000}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Colors */}
              <div className="mb-6 pb-6 border-b border-border">
                <h3 className="font-semibold mb-4">Color</h3>
                <div className="space-y-3">
                  {colors.map(color => (
                    <div key={color} className="flex items-center space-x-2">
                      <Checkbox
                        id={color}
                        checked={selectedColors.includes(color)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedColors([...selectedColors, color]);
                          } else {
                            setSelectedColors(selectedColors.filter(c => c !== color));
                          }
                        }}
                      />
                      <Label htmlFor={color} className="cursor-pointer">{color}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Occasion */}
              <div className="mb-6 pb-6 border-b border-border">
                <h3 className="font-semibold mb-4">Occasion</h3>
                <div className="space-y-3">
                  {["Wedding", "Festival", "Casual", "Party"].map(occasion => (
                    <div key={occasion} className="flex items-center space-x-2">
                      <Checkbox id={occasion} />
                      <Label htmlFor={occasion} className="cursor-pointer">{occasion}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fabric */}
              <div className="mb-6">
                <h3 className="font-semibold mb-4">Fabric</h3>
                <div className="space-y-3">
                  {["Silk", "Cotton", "Velvet", "Linen"].map(fabric => (
                    <div key={fabric} className="flex items-center space-x-2">
                      <Checkbox id={fabric} />
                      <Label htmlFor={fabric} className="cursor-pointer">{fabric}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">
                {allProducts.length} products
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="discount">Discount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProducts.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
