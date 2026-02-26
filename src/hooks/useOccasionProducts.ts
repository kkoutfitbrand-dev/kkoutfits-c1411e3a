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
    const fetchAndClassify = async () => {
      try {
        setLoading(true);

        const { data: allProducts, error: dbError } = await supabase
          .from("products")
          .select("id, title, images, category, description, price_cents, slug")
          .eq("status", "published")
          .limit(50);

        if (dbError) throw dbError;

        if (allProducts) {
          const classified: ClassifiedProducts = {
            wedding: [],
            festival: [],
            party: [],
            casual: [],
          };

          for (const product of allProducts) {
            const title = product.title.toLowerCase();
            const desc = (product.description || "").toLowerCase();
            const category = (product.category || "").toLowerCase();

            if (title.includes("sherwani") || title.includes("lehenga") || title.includes("bridal") || category.includes("wedding") || desc.includes("wedding")) {
              classified.wedding.push(product);
            } else if (title.includes("kurta") || title.includes("saree") || title.includes("salwar") || title.includes("chudithar") || category.includes("ethnic") || category.includes("sarees") || category.includes("chudithar")) {
              classified.festival.push(product);
            } else if (title.includes("bandhgala") || title.includes("blazer") || title.includes("formal") || title.includes("party") || category.includes("formal") || category.includes("women")) {
              classified.party.push(product);
            } else {
              classified.casual.push(product);
            }
          }

          for (const key of Object.keys(classified) as (keyof ClassifiedProducts)[]) {
            classified[key] = classified[key].slice(0, 4);
          }

          setProducts(classified);
        }
      } catch (e) {
        console.error("Failed to fetch products:", e);
        setError(e instanceof Error ? e.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchAndClassify();
  }, []);

  return { products, loading, error };
};

export const getFirstImage = (images: Json): string => {
  if (Array.isArray(images) && images.length > 0 && typeof images[0] === "string") {
    return images[0];
  }
  return "/placeholder.svg";
};
