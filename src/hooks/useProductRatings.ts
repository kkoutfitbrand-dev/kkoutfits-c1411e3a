import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProductRating {
  average_rating: number;
  review_count: number;
}

interface RatingsCache {
  [productId: string]: ProductRating;
}

// Global cache for ratings
let ratingsCache: RatingsCache = {};
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useProductRatings = (productIds: string[]) => {
  const [ratings, setRatings] = useState<RatingsCache>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      if (productIds.length === 0) {
        setLoading(false);
        return;
      }

      // Check if cache is still valid
      const now = Date.now();
      const uncachedIds = productIds.filter(
        (id) => !ratingsCache[id] || now - cacheTimestamp > CACHE_DURATION
      );

      if (uncachedIds.length === 0) {
        setRatings(ratingsCache);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("product_reviews")
        .select("product_id, rating")
        .in("product_id", uncachedIds);

      if (!error && data) {
        // Calculate averages and counts
        const newRatings: RatingsCache = {};
        const grouped: { [key: string]: number[] } = {};

        data.forEach((review) => {
          if (!grouped[review.product_id]) {
            grouped[review.product_id] = [];
          }
          grouped[review.product_id].push(review.rating);
        });

        uncachedIds.forEach((id) => {
          if (grouped[id] && grouped[id].length > 0) {
            const ratings = grouped[id];
            newRatings[id] = {
              average_rating: Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10,
              review_count: ratings.length,
            };
          } else {
            newRatings[id] = { average_rating: 0, review_count: 0 };
          }
        });

        // Update cache
        ratingsCache = { ...ratingsCache, ...newRatings };
        cacheTimestamp = now;
        setRatings({ ...ratingsCache });
      }

      setLoading(false);
    };

    fetchRatings();
  }, [productIds.join(",")]);

  return { ratings, loading };
};

export const useProductRating = (productId: string) => {
  const [rating, setRating] = useState<ProductRating>({ average_rating: 0, review_count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRating = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      // Check cache first
      if (ratingsCache[productId] && Date.now() - cacheTimestamp < CACHE_DURATION) {
        setRating(ratingsCache[productId]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("product_reviews")
        .select("rating")
        .eq("product_id", productId);

      if (!error && data && data.length > 0) {
        const ratings = data.map((r) => r.rating);
        const avg = Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10;
        const result = { average_rating: avg, review_count: ratings.length };
        ratingsCache[productId] = result;
        cacheTimestamp = Date.now();
        setRating(result);
      }

      setLoading(false);
    };

    fetchRating();
  }, [productId]);

  return { rating, loading };
};
