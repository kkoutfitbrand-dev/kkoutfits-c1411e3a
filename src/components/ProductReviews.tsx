import { useState, useEffect } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  title: string | null;
  review_text: string | null;
  created_at: string;
  profiles?: { name: string } | null;
}

interface ProductReviewsProps {
  productId: string;
}

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: "", text: "" });
  const [userReview, setUserReview] = useState<Review | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("product_reviews")
      .select(`
        id,
        user_id,
        rating,
        title,
        review_text,
        created_at
      `)
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      // Fetch profile names for each review
      const reviewsWithProfiles = await Promise.all(
        data.map(async (review) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", review.user_id)
            .maybeSingle();
          return { ...review, profiles: profile };
        })
      );
      
      setReviews(reviewsWithProfiles);
      
      // Check if current user has already reviewed
      if (user) {
        const existing = reviewsWithProfiles.find(r => r.user_id === user.id);
        setUserReview(existing || null);
      }
    }
    setLoading(false);
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    if (newReview.rating < 1 || newReview.rating > 5) {
      toast.error("Please select a rating between 1 and 5");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from("product_reviews")
      .upsert({
        product_id: productId,
        user_id: user.id,
        rating: newReview.rating,
        title: newReview.title || null,
        review_text: newReview.text || null,
      }, { onConflict: 'product_id,user_id' });

    if (error) {
      toast.error("Failed to submit review");
      console.error(error);
    } else {
      toast.success(userReview ? "Review updated!" : "Review submitted!");
      setDialogOpen(false);
      setNewReview({ rating: 5, title: "", text: "" });
      fetchReviews();
    }

    setSubmitting(false);
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const ratingCounts = [5, 4, 3, 2, 1].map(rating => 
    reviews.filter(r => r.rating === rating).length
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Customer Reviews</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              {userReview ? "Edit Your Review" : "Write a Review"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{userReview ? "Edit Your Review" : "Write a Review"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="p-1"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= newReview.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Title (optional)</label>
                <Input
                  placeholder="Summarize your experience"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Review (optional)</label>
                <Textarea
                  placeholder="Share your experience with this product..."
                  value={newReview.text}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                  rows={4}
                />
              </div>
              <Button onClick={handleSubmitReview} disabled={submitting} className="w-full">
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {userReview ? "Update Review" : "Submit Review"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : reviews.length > 0 ? (
        <>
          <div className="flex items-center gap-6 pb-6 border-b border-border">
            <div className="text-center">
              <div className="text-4xl font-bold mb-1">{averageRating}</div>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(Number(averageRating))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">{reviews.length} reviews</div>
            </div>

            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating, index) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm w-12">{rating} star</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ 
                        width: reviews.length > 0 
                          ? `${(ratingCounts[index] / reviews.length) * 100}%` 
                          : "0%" 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {ratingCounts[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-border pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">
                        {review.profiles?.name || "Anonymous"}
                      </span>
                      {review.user_id === user?.id && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          Your Review
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      {[...Array(5 - review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-muted-foreground" />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                  </span>
                </div>
                {review.title && (
                  <h4 className="font-medium mb-1">{review.title}</h4>
                )}
                {review.review_text && (
                  <p className="text-muted-foreground">{review.review_text}</p>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 border border-border rounded-lg">
          <Star className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h4 className="font-semibold mb-2">No reviews yet</h4>
          <p className="text-muted-foreground mb-4">Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
};
