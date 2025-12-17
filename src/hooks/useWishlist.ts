import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useWishlist = () => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlistIds();
    } else {
      setWishlistIds([]);
    }
  }, [user]);

  const fetchWishlistIds = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("user_id", user.id);

      if (error) throw error;
      setWishlistIds(data.map(item => item.product_id));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const addToWishlist = async (productId: string, productName?: string) => {
    if (!user) {
      toast.error("Please log in to add items to wishlist");
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("wishlists")
        .insert({ user_id: user.id, product_id: productId });

      if (error) {
        if (error.code === "23505") {
          toast.info("Already in wishlist");
          return true;
        }
        throw error;
      }

      setWishlistIds(prev => [...prev, productId]);
      toast.success(productName ? `${productName} added to wishlist` : "Added to wishlist");
      return true;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) throw error;

      setWishlistIds(prev => prev.filter(id => id !== productId));
      toast.success("Removed from wishlist");
      return true;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId: string, productName?: string) => {
    if (isInWishlist(productId)) {
      return removeFromWishlist(productId);
    } else {
      return addToWishlist(productId, productName);
    }
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  return {
    wishlistIds,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    refetch: fetchWishlistIds
  };
};
