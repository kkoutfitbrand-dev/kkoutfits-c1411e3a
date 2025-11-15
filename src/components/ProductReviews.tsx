import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const reviews = [
  {
    id: 1,
    author: "Rajesh Kumar",
    rating: 5,
    date: "2 weeks ago",
    comment: "Excellent quality! The fabric is premium and the stitching is perfect. Highly recommended for weddings.",
    verified: true,
  },
  {
    id: 2,
    author: "Amit Sharma",
    rating: 5,
    date: "1 month ago",
    comment: "Beautiful embroidery work. Got so many compliments at the wedding. Worth every penny!",
    verified: true,
  },
  {
    id: 3,
    author: "Pradeep Singh",
    rating: 4,
    date: "1 month ago",
    comment: "Good product overall. The fit is slightly loose but the quality is great.",
    verified: true,
  },
];

export const ProductReviews = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Customer Reviews</h3>
        <Button variant="outline">Write a Review</Button>
      </div>

      <div className="flex items-center gap-6 pb-6 border-b border-border">
        <div className="text-center">
          <div className="text-4xl font-bold mb-1">4.8</div>
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <div className="text-sm text-muted-foreground">128 reviews</div>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm w-12">{rating} star</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400"
                  style={{ width: `${rating === 5 ? 85 : rating === 4 ? 12 : 3}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-8">
                {rating === 5 ? 109 : rating === 4 ? 15 : 4}
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
                  <span className="font-semibold">{review.author}</span>
                  {review.verified && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{review.date}</span>
            </div>
            <p className="text-muted-foreground">{review.comment}</p>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full">
        Load More Reviews
      </Button>
    </div>
  );
};
