import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

interface Product {
  id: string;
  title: string;
  images: Json;
  category: string | null;
  description: string | null;
  price_cents: number;
  slug: string;
}

interface ClassifiedProducts {
  wedding: Product[];
  festival: Product[];
  party: Product[];
  casual: Product[];
}

export const useOccasionProducts = () => {
  const [products, setProducts] = useState<ClassifiedProducts>({
    wedding: [],
    festival: [],
    party: [],
    casual: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassifiedProducts = async () => {
      try {
        setLoading(true);
        
        const { data, error: fnError } = await supabase.functions.invoke("classify-products");
        
        if (fnError) {
          throw fnError;
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        if (data?.classified) {
          setProducts(data.classified);
        }
      } catch (e) {
        console.error("Failed to fetch classified products:", e);
        setError(e instanceof Error ? e.message : "Failed to load products");
        
        // Fallback: fetch products directly without ML classification
        try {
          const { data: fallbackProducts } = await supabase
            .from("products")
            .select("id, title, images, category, description, price_cents, slug")
            .eq("status", "published")
            .limit(16);

          if (fallbackProducts) {
            // Simple rule-based fallback classification
            const classified: ClassifiedProducts = {
              wedding: [],
              festival: [],
              party: [],
              casual: [],
            };

            for (const product of fallbackProducts) {
              const title = product.title.toLowerCase();
              const category = (product.category || "").toLowerCase();
              
              if (title.includes("sherwani") || title.includes("lehenga") || title.includes("bridal") || category.includes("wedding")) {
                classified.wedding.push(product);
              } else if (title.includes("kurta") || title.includes("saree") || title.includes("salwar") || category.includes("ethnic")) {
                classified.festival.push(product);
              } else if (title.includes("bandhgala") || title.includes("blazer") || title.includes("formal") || category.includes("formal")) {
                classified.party.push(product);
              } else {
                classified.casual.push(product);
              }
            }

            // Limit each category
            for (const key of Object.keys(classified) as (keyof ClassifiedProducts)[]) {
              classified[key] = classified[key].slice(0, 4);
            }

            setProducts(classified);
            setError(null);
          }
        } catch (fallbackError) {
          console.error("Fallback fetch failed:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClassifiedProducts();
  }, []);

  return { products, loading, error };
};

export const getFirstImage = (images: Json): string => {
  if (Array.isArray(images) && images.length > 0 && typeof images[0] === "string") {
    return images[0];
  }
  return "/placeholder.svg";
};
