import { Navigation } from "@/components/Navigation";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { TrendingProducts } from "@/components/TrendingProducts";
import { OccasionShopping } from "@/components/OccasionShopping";
import { DealsBanner } from "@/components/DealsBanner";
import { BrandShowcase } from "@/components/BrandShowcase";
import { PromotionalBanner } from "@/components/PromotionalBanner";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BackToTop } from "@/components/BackToTop";
import { GoogleReviewsBanner } from "@/components/GoogleReviewsBanner";
import { ProductGridSkeleton, CategoryGridSkeleton } from "@/components/HomeSkeleton";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import categoryShirts from "@/assets/category-shirts.jpg";
import categoryPants from "@/assets/category-pants.jpg";
import categoryTshirts from "@/assets/category-tshirts.jpg";
import categorySaree from "@/assets/category-saree.jpg";
import categorySalwar from "@/assets/category-salwar.jpg";
import categoryKurta from "@/assets/category-kurta.jpg";
import categoryLehenga from "@/assets/category-lehenga.jpg";
import categoryJeans from "@/assets/category-jeans.jpg";

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

interface Product {
  id: string;
  title: string;
  price_cents: number;
  images: Json;
  slug: string;
  category: string | null;
  variants: Json;
}

const getFirstImage = (images: Json): string => {
  if (Array.isArray(images) && images.length > 0) {
    return images[0] as string;
  }
  return '/placeholder.svg';
};

const getSalePrice = (variants: Json): number | null => {
  if (variants && typeof variants === 'object' && 'sale_price_cents' in variants) {
    return (variants as { sale_price_cents?: number }).sale_price_cents || null;
  }
  return null;
};

const getDisplayPrice = (product: Product): { price: number; originalPrice?: number } => {
  const salePrice = getSalePrice(product.variants);
  if (salePrice && salePrice < product.price_cents) {
    return {
      price: salePrice / 100,
      originalPrice: product.price_cents / 100
    };
  }
  return { price: product.price_cents / 100 };
};

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price_cents, images, slug, category, variants')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setFeaturedProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <ScrollReveal>
        <HeroCarousel />
      </ScrollReveal>

      {/* Promotional Banner */}
      <ScrollReveal delay={0.1}>
        <PromotionalBanner 
          title="MEGA SALE - UP TO 70% OFF" 
          subtitle="End of Season Sale on All Products" 
          ctaText="Shop Now" 
          ctaLink="/category/all"
          badge="LIMITED TIME OFFER"
          showTimer={true}
        />
      </ScrollReveal>

      {/* Deals of the Day */}
      <ScrollReveal delay={0.1}>
        <section className="container px-4 py-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4 font-sans uppercase">
            Deals of the Day
          </h2>
          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {featuredProducts.map((product, index) => {
                const { price, originalPrice } = getDisplayPrice(product);
                return (
                  <ScrollReveal key={product.id} delay={index * 0.05} direction="up">
                    <ProductCard 
                      id={product.slug}
                      productId={product.id}
                      name={product.title}
                      price={price}
                      originalPrice={originalPrice}
                      image={getFirstImage(product.images)}
                      category={product.category}
                    />
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </section>
      </ScrollReveal>

      {/* Brand Showcase */}
      <ScrollReveal delay={0.1} direction="left">
        <BrandShowcase />
      </ScrollReveal>

      {/* Trending Products */}
      <ScrollReveal delay={0.1}>
        <TrendingProducts />
      </ScrollReveal>

      {/* Categories Section */}
      <ScrollReveal delay={0.1}>
        <section className="container px-4 py-8 md:py-12">
          <div className="text-center mb-8">
            <ScrollReveal delay={0.05}>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 font-sans text-foreground tracking-tight">
                Shop by Category
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
                Discover our curated collection across various styles and occasions
              </p>
            </ScrollReveal>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {categories.map((category, index) => (
              <ScrollReveal key={category.title} delay={index * 0.05} direction="up">
                <Link 
                  to={category.link} 
                  className="group relative overflow-hidden rounded-xl bg-card shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                  </div>
                  {/* Elegant gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-all duration-300" />
                  {/* Professional text with border accent */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 border-t border-white/20">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm md:text-base font-bold text-white uppercase tracking-widest">
                        {category.title}
                      </h3>
                      <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Occasion Shopping */}
      <ScrollReveal delay={0.1} direction="right">
        <OccasionShopping />
      </ScrollReveal>

      {/* Google Reviews */}
      <ScrollReveal delay={0.1}>
        <GoogleReviewsBanner />
      </ScrollReveal>

      {/* USP Section */}
      <ScrollReveal delay={0.1}>
        <section className="bg-muted py-8">
          <div className="container px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "M5 13l4 4L19 7", title: "100% Authentic", desc: "Genuine products" },
                { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "Fast Delivery", desc: "Quick shipping" },
                { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", title: "Easy Returns", desc: "7-day policy" },
                { icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", title: "Secure Payment", desc: "Multiple options" },
              ].map((item, index) => (
                <ScrollReveal key={item.title} delay={index * 0.1} direction="up">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-accent/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </div>
                    <h3 className="font-bold text-sm mb-1 font-sans">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
