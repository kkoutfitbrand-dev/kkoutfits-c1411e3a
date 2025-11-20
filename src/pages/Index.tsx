import { Navigation } from "@/components/Navigation";
import { HeroCarousel } from "@/components/HeroCarousel";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { TrendingProducts } from "@/components/TrendingProducts";
import { InstagramFeed } from "@/components/InstagramFeed";
import { OccasionShopping } from "@/components/OccasionShopping";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { VideoBanner } from "@/components/VideoBanner";
import categoryShirts from "@/assets/category-shirts.jpg";
import categoryPants from "@/assets/category-pants.jpg";
import categoryTshirts from "@/assets/category-tshirts.jpg";
import categorySaree from "@/assets/category-saree.jpg";
import categorySalwar from "@/assets/category-salwar.jpg";
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
  title: "Pants and Shorts",
  image: categoryPants,
  link: "/category/pants-shorts"
}, {
  title: "T-Shirt",
  image: categoryTshirts,
  link: "/category/tshirt"
}, {
  title: "Sarees",
  image: categorySaree,
  link: "/category/sarees"
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

      {/* Categories Section */}
      <section className="container px-4 py-12 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-3 md:mb-4">Shop by Category</h2>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our premium collection for men and women
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map(category => <CategoryCard key={category.title} title={category.title} image={category.image} link={category.link} />)}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-luxury-cream py-12 md:py-16">
        <div className="container px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-3 md:mb-4">Featured Collection</h2>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Handpicked pieces that define elegance and tradition
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8">
            {featuredProducts.map(product => <ProductCard key={product.id} {...product} />)}
          </div>
          <div className="text-center">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Video Banner - Craftsmanship Showcase */}
      

      {/* Trending Products */}
      <TrendingProducts />

      {/* Occasion Shopping */}
      <OccasionShopping />

      {/* Testimonials */}
      <TestimonialsCarousel />

      {/* Instagram Feed */}
      <InstagramFeed />

      {/* USP Section */}
      <section className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">100% Authentic</h3>
            <p className="text-sm text-muted-foreground">
              Genuine products guaranteed
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground">
              Quick shipping across India
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Easy Returns</h3>
            <p className="text-sm text-muted-foreground">
              7-day return policy
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Secure Payment</h3>
            <p className="text-sm text-muted-foreground">
              Multiple payment options
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Popup */}
      <NewsletterPopup />

      <Footer />
    </div>;
};
export default Index;