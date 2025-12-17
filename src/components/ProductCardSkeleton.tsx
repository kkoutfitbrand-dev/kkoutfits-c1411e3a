import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardSkeletonProps {
  index?: number;
}

export const ProductCardSkeleton = ({ index = 0 }: ProductCardSkeletonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card className="overflow-hidden border border-border">
        <div className="relative overflow-hidden aspect-[3/4]">
          <div className="w-full h-full bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </div>
        </div>
        <CardContent className="p-3 space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-background/30 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.2 }}
            />
          </div>
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-background/30 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.3 }}
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <div className="h-5 w-12 bg-muted rounded animate-pulse" />
            <div className="h-4 w-8 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-20 bg-muted rounded animate-pulse" />
            <div className="h-4 w-16 bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
