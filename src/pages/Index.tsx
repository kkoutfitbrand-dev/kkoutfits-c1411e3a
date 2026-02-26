import { Navigation } from "@/components/Navigation";
import { PromoTicker } from "@/components/PromoTicker";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { TrendingProducts } from "@/components/TrendingProducts";
import { OccasionShopping } from "@/components/OccasionShopping";
import { BrandShowcase } from "@/components/BrandShowcase";
import { ComboBanner } from "@/components/ComboBanner";
import { PongalOfferBanners } from "@/components/PongalOfferBanners";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BackToTop } from "@/components/BackToTop";
import { GoogleReviewsBanner } from "@/components/GoogleReviewsBanner";
import { ProductGridSkeleton } from "@/components/HomeSkeleton";
import { MegaSaleBanner } from "@/components/MegaSaleBanner";
import { ValentineGiftGuide } from "@/components/ValentineGiftGuide";
import { ValentineFloatingHearts } from "@/components/ValentineFloatingHearts";
import { ValentineCoupleSection } from "@/components/ValentineCoupleSection";
import { ValentineCountdownBanner } from "@/components/ValentineCountdownBanner";
import { ValentineLoveQuotes } from "@/components/ValentineLoveQuotes";
import { CategoryCardWithSubs } from "@/components/CategoryCardWithSubs";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
interface Subcategory {
  id: string;
  name: string;
  slug: string;
}
interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  subcategories: Subcategory[];
}
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
    return (variants as {
      sale_price_cents?: number;
    }).sale_price_cents || null;
  }
  return null;
};
const getDisplayPrice = (product: Product): {
  price: number;
  originalPrice?: number;
} => {
  const salePrice = getSalePrice(product.variants);
  if (salePrice && salePrice < product.price_cents) {
    return {
      price: salePrice / 100,
      originalPrice: product.price_cents / 100
    };
  }
  return {
    price: product.price_cents / 100
  };
};
const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    try {
      // Fetch parent categories
      const {
        data: parentCategories,
        error: parentError
      } = await supabase.from('categories').select('id, name, slug, image_url').eq('is_active', true).is('parent_id', null).order('display_order', {
        ascending: true
      }).limit(8);
      if (parentError) throw parentError;

      // Fetch all subcategories
      const {
        data: allSubcategories,
        error: subError
      } = await supabase.from('categories').select('id, name, slug, parent_id').eq('is_active', true).not('parent_id', 'is', null).order('display_order', {
        ascending: true
      });
      if (subError) throw subError;

      // Map subcategories to their parent categories
      const categoriesWithSubs: Category[] = (parentCategories || []).map((parent) => ({
        ...parent,
        subcategories: (allSubcategories || []).filter((sub) => sub.parent_id === parent.id).map((sub) => ({
          id: sub.id,
          name: sub.name,
          slug: sub.slug
        }))
      }));
      setCategories(categoriesWithSubs);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };
  const fetchProducts = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('products').select('id, title, price_cents, images, slug, category, variants').eq('status', 'published').order('created_at', {
        ascending: false
      }).limit(6);
      if (error) throw error;
      setFeaturedProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Promo Ticker Banner */}
      <PromoTicker />

      {/* Floating hearts background animation */}
      <ValentineFloatingHearts />
      
      <Navigation />
      
      {/* Valentine's Countdown Banner */}
      <ValentineCountdownBanner />
      
      {/* Hero Section */}
      <ScrollReveal>
        <HeroCarousel />
      </ScrollReveal>

      {/* Mega Sale Banner */}
      <ScrollReveal delay={0.1}>
        <MegaSaleBanner />
      </ScrollReveal>

      {/* Valentine's Gift Guide */}
      <ScrollReveal delay={0.1}>
        <ValentineGiftGuide />
      </ScrollReveal>
      
      {/* Valentine's Love Quotes */}
      <ValentineLoveQuotes />

      {/* Combo Offer Banner */}
      <ScrollReveal delay={0.1}>
        <ComboBanner />
      </ScrollReveal>

      {/* Pongal Offer Banners - placeholder */}

      {/* Deals of the Day */}
      <ScrollReveal delay={0.1}>
        <section className="container px-4 py-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4 font-sans uppercase">
            Deals of the Day
          </h2>
          {loading ? <ProductGridSkeleton count={6} /> : <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {featuredProducts.map((product, index) => {
            const {
              price,
              originalPrice
            } = getDisplayPrice(product);
            return <ScrollReveal key={product.id} delay={index * 0.05} direction="up">
                    <ProductCard id={product.slug} productId={product.id} name={product.title} price={price} originalPrice={originalPrice} image={getFirstImage(product.images)} category={product.category} />
                  </ScrollReveal>;
          })}
            </div>}
        </section>
      </ScrollReveal>

      {/* Brand Showcase - Empty for now */}

      {/* Another Pongal Offer - placeholder */}

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
            {categoriesLoading ?
          // Loading skeleton for categories
          Array.from({
            length: 8
          }).map((_, index) => <div key={index} className="aspect-square rounded-xl bg-muted animate-pulse" />) : categories.length === 0 ? <p className="col-span-full text-center text-muted-foreground">No categories available</p> : categories.map((category, index) => <ScrollReveal key={category.id} delay={index * 0.05} direction="up">
                  <CategoryCardWithSubs id={category.id} name={category.name} slug={category.slug} image_url={category.image_url} subcategories={category.subcategories} />
                </ScrollReveal>)}
          </div>
        </section>
      </ScrollReveal>

      {/* Valentine's Couple Section */}
      

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
              {[{
              icon: "M5 13l4 4L19 7",
              title: "100% Authentic",
              desc: "Genuine products"
            }, {
              icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
              title: "Fast Delivery",
              desc: "Quick shipping"
            }, {
              icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
              title: "Easy Returns",
              desc: "7-day policy"
            }, {
              icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
              title: "Secure Payment",
              desc: "Multiple options"
            }].map((item, index) => <ScrollReveal key={item.title} delay={index * 0.1} direction="up">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-accent/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </div>
                    <h3 className="font-bold text-sm mb-1 font-sans">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </ScrollReveal>)}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <Footer />
      <BackToTop />
    </div>;
};
export default Index;