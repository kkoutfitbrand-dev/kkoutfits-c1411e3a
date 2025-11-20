import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import productShirt from "@/assets/product-shirt-1.jpg";
import productTshirt from "@/assets/product-tshirt-1.jpg";
import productPants from "@/assets/product-pants-1.jpg";
import productJeans from "@/assets/product-jeans-1.jpg";
import productCasual from "@/assets/product-casual-1.jpg";
import productFormal from "@/assets/product-formal-1.jpg";

// Category-specific products
const categoryProducts = {
  "shirts": [
    { id: "shirt-1", name: "Classic Oxford Dress Shirt", price: 1999, originalPrice: 2999, image: productShirt, badge: "Bestseller", category: "shirts", color: "Blue", size: ["S", "M", "L", "XL", "XXL"] },
    { id: "shirt-2", name: "Premium Cotton Formal Shirt", price: 2499, originalPrice: 3499, image: productShirt, category: "shirts", color: "White", size: ["M", "L", "XL"] },
    { id: "shirt-3", name: "Slim Fit Business Shirt", price: 2199, originalPrice: 3199, image: productShirt, category: "shirts", color: "Light Blue", size: ["S", "M", "L", "XL"] },
  ],
  "tshirt": [
    { id: "tshirt-1", name: "Graphic Print T-Shirt", price: 799, originalPrice: 1299, image: productTshirt, badge: "New", category: "tshirt", color: "Black", size: ["S", "M", "L", "XL"] },
    { id: "tshirt-2", name: "Plain Cotton T-Shirt", price: 599, originalPrice: 999, image: productTshirt, category: "tshirt", color: "White", size: ["S", "M", "L", "XL", "XXL"] },
    { id: "tshirt-3", name: "V-Neck Basic Tee", price: 699, originalPrice: 1099, image: productTshirt, category: "tshirt", color: "Navy", size: ["M", "L", "XL"] },
  ],
  "pants-shorts": [
    { id: "pants-1", name: "Premium Chino Pants", price: 2499, originalPrice: 3499, image: productPants, badge: "Bestseller", category: "pants-shorts", color: "Khaki", size: ["30", "32", "34", "36"] },
    { id: "pants-2", name: "Slim Fit Trousers", price: 2799, originalPrice: 3999, image: productPants, category: "pants-shorts", color: "Grey", size: ["30", "32", "34", "36", "38"] },
    { id: "pants-3", name: "Casual Cotton Pants", price: 1999, originalPrice: 2999, image: productPants, category: "pants-shorts", color: "Beige", size: ["32", "34", "36"] },
    { id: "shorts-1", name: "Summer Cargo Shorts", price: 1499, originalPrice: 2199, image: productPants, category: "pants-shorts", color: "Olive", size: ["30", "32", "34", "36"] },
    { id: "shorts-2", name: "Classic Denim Shorts", price: 1299, originalPrice: 1899, image: productJeans, category: "pants-shorts", color: "Blue", size: ["30", "32", "34"] },
  ],
  "sarees": [
    { id: "saree-1", name: "Silk Banarasi Saree", price: 8999, originalPrice: 12999, image: productFormal, badge: "Premium", category: "sarees", color: "Red", size: ["One Size"] },
    { id: "saree-2", name: "Cotton Printed Saree", price: 2499, originalPrice: 3499, image: productCasual, category: "sarees", color: "Blue", size: ["One Size"] },
    { id: "saree-3", name: "Designer Party Wear Saree", price: 6999, originalPrice: 9999, image: productFormal, badge: "Bestseller", category: "sarees", color: "Gold", size: ["One Size"] },
    { id: "saree-4", name: "Traditional Handloom Saree", price: 3999, originalPrice: 5999, image: productCasual, category: "sarees", color: "Green", size: ["One Size"] },
  ],
  "churidar": [
    { id: "churidar-1", name: "Anarkali Churidar Set", price: 3999, originalPrice: 5999, image: productCasual, badge: "New", category: "churidar", color: "Pink", size: ["S", "M", "L", "XL"] },
    { id: "churidar-2", name: "Cotton Churidar Suit", price: 2499, originalPrice: 3499, image: productCasual, category: "churidar", color: "Blue", size: ["S", "M", "L", "XL", "XXL"] },
    { id: "churidar-3", name: "Embroidered Party Wear Churidar", price: 5999, originalPrice: 8999, image: productFormal, badge: "Premium", category: "churidar", color: "Maroon", size: ["M", "L", "XL"] },
    { id: "churidar-4", name: "Casual Daily Wear Churidar", price: 1999, originalPrice: 2999, image: productCasual, category: "churidar", color: "White", size: ["S", "M", "L", "XL"] },
  ],
};

const CategoryPage = () => {
  const { category } = useParams();
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popularity");
  
  // Get products for current category
  const categoryKey = category?.toLowerCase() || "";
  const products = categoryProducts[categoryKey as keyof typeof categoryProducts] || [];
  
  // Get unique colors and sizes for current category
  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach(product => {
      if (product.color) colors.add(product.color);
    });
    return Array.from(colors);
  }, [products]);

  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach(product => {
      product.size?.forEach(s => sizes.add(s));
    });
    return Array.from(sizes);
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesColor = selectedColors.length === 0 || selectedColors.includes(product.color || "");
      const matchesSize = selectedSizes.length === 0 || product.size?.some(s => selectedSizes.includes(s));
      return matchesPrice && matchesColor && matchesSize;
    });
  }, [products, priceRange, selectedColors, selectedSizes]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "newest":
        return sorted.reverse();
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  const handleClearFilters = () => {
    setPriceRange([0, 20000]);
    setSelectedColors([]);
    setSelectedSizes([]);
  };

  const getCategoryTitle = () => {
    return category?.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || 'Products';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl md:text-4xl font-serif font-bold">
            {getCategoryTitle()}
          </h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <div className="flex items-center justify-end mb-6">
                  <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                    Clear All
                  </Button>
                </div>

                {/* Price Range */}
                <div className="mb-6 pb-6 border-b border-border">
                  <h3 className="font-semibold mb-4">Price Range</h3>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={20000}
                    step={100}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm">
                    <span>₹{priceRange[0].toLocaleString()}</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                {/* Colors */}
                {availableColors.length > 0 && (
                  <div className="mb-6 pb-6 border-b border-border">
                    <h3 className="font-semibold mb-4">Color</h3>
                    <div className="space-y-3">
                      {availableColors.map(color => (
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
                )}

                {/* Sizes */}
                {availableSizes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-4">Size</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {availableSizes.map(size => (
                        <Button
                          key={size}
                          variant={selectedSizes.includes(size) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (selectedSizes.includes(size)) {
                              setSelectedSizes(selectedSizes.filter(s => s !== size));
                            } else {
                              setSelectedSizes([...selectedSizes, size]);
                            }
                          }}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <p className="text-muted-foreground mb-8">
          Showing {sortedProducts.length} of {products.length} products
        </p>

        <div className="grid grid-cols-1 gap-8">
          {/* Products Grid */}
          <div>
            {/* Sort and View Options */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {sortedProducts.length} products found
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    image={product.image}
                    badge={product.badge}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">
                  No products found matching your filters
                </p>
                <Button onClick={handleClearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
