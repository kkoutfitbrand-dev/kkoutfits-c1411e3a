import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RatingSummaryProps {
  averageRating: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export const RatingSummary = ({ 
  averageRating, 
  totalReviews, 
  distribution 
}: RatingSummaryProps) => {
  const getPercentage = (count: number) => (count / totalReviews) * 100;

  return (
    <div className="border border-border rounded-lg p-6">
      <div className="flex gap-8">
        {/* Average Rating */}
        <div className="flex flex-col items-center justify-center min-w-[120px]">
          <div className="text-4xl font-bold">{averageRating}</div>
          <div className="flex gap-0.5 my-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            {totalReviews.toLocaleString()} ratings
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = distribution[rating as keyof typeof distribution];
            const percentage = getPercentage(count);
            
            return (
              <div key={rating} className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 w-12">
                  <span className="font-medium">{rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress value={percentage} className="h-2 flex-1" />
                <div className="text-muted-foreground w-12 text-right">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
