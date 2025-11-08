import { Navigation } from "@/components/Navigation";
import { HeroCarousel } from "@/components/HeroCarousel";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import categorySaree from "@/assets/category-saree.jpg";
import categoryLehenga from "@/assets/category-lehenga.jpg";
import categorySalwar from "@/assets/category-salwar.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const categories = [
  {
    title: "Sarees",
    image: categorySaree,
    link: "/category/sarees",
  },
  {
    title: "Lehengas",
    image: categoryLehenga,
    link: "/category/lehengas",
  },
  {
    title: "Salwar Kameez",
    image: categorySalwar,
    link: "/category/salwar-kameez",
  },
];

const featuredProducts = [
  {
    id: "1",
    name: "Burgundy Silk Saree with Golden Embroidery",
    price: 12999,
    originalPrice: 18999,
    image: product1,
    badge: "Bestseller",
  },
  {
    id: "2",
    name: "Royal Blue Designer Lehenga Choli",
    price: 24999,
    originalPrice: 34999,
    image: product2,
    badge: "New",
  },
  {
    id: "3",
    name: "Pink Anarkali Salwar Suit with Gold Work",
    price: 8999,
    originalPrice: 12999,
    image: product3,
  },
  {
    id: "4",
    name: "Emerald Green Silk Saree with Red Border",
    price: 15999,
    originalPrice: 21999,
    image: product4,
  },
  {
    id: "5",
    name: "Bridal Red Lehenga with Heavy Embroidery",
    price: 49999,
    originalPrice: 69999,
    image: product5,
    badge: "Premium",
  },
  {
    id: "6",
    name: "Purple Designer Anarkali Gown",
    price: 11999,
    originalPrice: 16999,
    image: product6,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <HeroCarousel />

      {/* Categories Section */}
      <section className="container px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-4">Shop by Category</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our exquisite collection of traditional Indian wear
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              image={category.image}
              link={category.link}
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-luxury-cream py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4">Featured Collection</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Handpicked pieces that define elegance and tradition
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          <div className="text-center">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="container px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">100% Authentic</h3>
            <p className="text-sm text-muted-foreground">
              Genuine products guaranteed
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground">
              Quick shipping across India
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Easy Returns</h3>
            <p className="text-sm text-muted-foreground">
              7-day return policy
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Secure Payment</h3>
            <p className="text-sm text-muted-foreground">
              Multiple payment options
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
