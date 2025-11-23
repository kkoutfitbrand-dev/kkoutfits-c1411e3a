import { Navigation } from "@/components/Navigation";
import { HeroCarousel } from "@/components/HeroCarousel";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { TrendingProducts } from "@/components/TrendingProducts";
import { OccasionShopping } from "@/components/OccasionShopping";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { DealsBanner } from "@/components/DealsBanner";
import { BrandShowcase } from "@/components/BrandShowcase";
import { PromotionalBanner } from "@/components/PromotionalBanner";
import { Link } from "react-router-dom";
import categoryShirts from "@/assets/category-shirts.jpg";
import categoryPants from "@/assets/category-pants.jpg";
import categoryTshirts from "@/assets/category-tshirts.jpg";
import categorySaree from "@/assets/category-saree.jpg";
import categorySalwar from "@/assets/category-salwar.jpg";
import categoryKurta from "@/assets/category-kurta.jpg";
import categoryLehenga from "@/assets/category-lehenga.jpg";
import categoryJeans from "@/assets/category-jeans.jpg";
import productShirt from "@/assets/product-shirt-1.jpg";
import productTshirt from "@/assets/product-tshirt-1.jpg";
import productPants from "@/assets/product-pants-1.jpg";
import productJeans from "@/assets/product-jeans-1.jpg";
import productCasual from "@/assets/product-casual-1.jpg";
import productFormal from "@/assets/product-formal-1.jpg";
const categories = [{
  title: "Shirts",
  image: categoryShirts,
  link: "/category/shirts"
}, {
  title: "T-Shirts",
  image: categoryTshirts,
  link: "/category/tshirt"
}, {
  title: "Pants",
  image: categoryPants,
  link: "/category/pants-shorts"
}, {
  title: "Jeans",
  image: categoryJeans,
  link: "/category/jeans"
}, {
  title: "Kurtas",
  image: categoryKurta,
  link: "/category/kurtas"
}, {
  title: "Sarees",
  image: categorySaree,
  link: "/category/sarees"
}, {
  title: "Lehengas",
  image: categoryLehenga,
  link: "/category/lehengas"
}, {
  title: "Churidar",
  image: categorySalwar,
  link: "/category/churidar"
}];
const featuredProducts = [{
  id: "shirt-1",
  name: "Classic Oxford Cotton Shirt",
  price: 1999,
  originalPrice: 2999,
  image: productShirt,
  badge: "Bestseller"
}, {
  id: "tshirt-1",
  name: "Premium Cotton Crew Neck T-Shirt",
  price: 899,
  originalPrice: 1499,
  image: productTshirt,
  badge: "New"
}, {
  id: "pants-1",
  name: "Slim Fit Chino Pants",
  price: 2499,
  originalPrice: 3499,
  image: productPants
}, {
  id: "jeans-1",
  name: "Dark Wash Stretch Denim Jeans",
  price: 2999,
  originalPrice: 4499,
  image: productJeans
}, {
  id: "casual-1",
  name: "Relaxed Fit Casual Jacket",
  price: 3999,
  originalPrice: 5999,
  image: productCasual,
  badge: "Trending"
}, {
  id: "formal-1",
  name: "Tailored Business Suit",
  price: 8999,
  originalPrice: 12999,
  image: productFormal,
  badge: "Premium"
}];
const Index = () => {
  return <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <HeroCarousel />

      {/* Deals Banner */}
      

      {/* Categories Section */}
      <section className="container px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-sans text-foreground">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map(category => (
            <Link 
              key={category.title} 
              to={category.link} 
              className="group relative overflow-hidden rounded-lg bg-card border border-border hover:border-primary transition-all duration-300 hover:shadow-lg"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span className="text-sm md:text-base font-semibold text-white drop-shadow-lg">
                  {category.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <PromotionalBanner title="MEGA SALE - UP TO 70% OFF" subtitle="End of Season Sale on All Products" ctaText="Shop Now" ctaLink="/category/all" />

      {/* Deals of the Day */}
      <section className="container px-4 py-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4 font-sans uppercase">
          Deals of the Day
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {featuredProducts.map(product => <ProductCard key={product.id} {...product} />)}
        </div>
      </section>

      {/* Brand Showcase */}
      <BrandShowcase />

      {/* Trending Products */}
      <TrendingProducts />

      {/* Occasion Shopping */}
      <OccasionShopping />

      {/* USP Section */}
      <section className="bg-muted py-8">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-accent/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-bold text-sm mb-1 font-sans">100% Authentic</h3>
              <p className="text-xs text-muted-foreground">
                Genuine products
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-accent/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-sm mb-1 font-sans">Fast Delivery</h3>
              <p className="text-xs text-muted-foreground">
                Quick shipping
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-accent/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-bold text-sm mb-1 font-sans">Easy Returns</h3>
              <p className="text-xs text-muted-foreground">
                7-day policy
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-accent/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-bold text-sm mb-1 font-sans">Secure Payment</h3>
              <p className="text-xs text-muted-foreground">
                Multiple options
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Popup */}
      <NewsletterPopup />

      <Footer />
    </div>;
};
export default Index;