import { motion } from "framer-motion";

const ShimmerEffect = () => (
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-transparent via-background/30 to-transparent"
    animate={{ x: ["-100%", "100%"] }}
    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
  />
);

export const ProductDetailSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container px-4 py-8 md:py-12"
    >
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-12 bg-muted rounded animate-pulse relative overflow-hidden">
          <ShimmerEffect />
        </div>
        <div className="h-4 w-4 bg-muted rounded animate-pulse" />
        <div className="h-4 w-32 bg-muted rounded animate-pulse relative overflow-hidden">
          <ShimmerEffect />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery Skeleton */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="mb-4 rounded-lg overflow-hidden bg-muted aspect-[3/4] relative">
            <ShimmerEffect />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.3 }}
                className="rounded-lg overflow-hidden bg-muted aspect-[3/4] relative"
              >
                <ShimmerEffect />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Product Info Skeleton */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="space-y-6"
        >
          {/* Title */}
          <div className="space-y-2">
            <div className="h-10 bg-muted rounded w-3/4 relative overflow-hidden">
              <ShimmerEffect />
            </div>
            <div className="h-6 bg-muted rounded w-1/2 relative overflow-hidden">
              <ShimmerEffect />
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <div className="h-8 w-32 bg-muted rounded relative overflow-hidden">
              <ShimmerEffect />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded relative overflow-hidden">
              <ShimmerEffect />
            </div>
            <div className="h-4 bg-muted rounded w-5/6 relative overflow-hidden">
              <ShimmerEffect />
            </div>
            <div className="h-4 bg-muted rounded w-4/6 relative overflow-hidden">
              <ShimmerEffect />
            </div>
          </div>

          {/* Color Selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div className="h-5 w-24 bg-muted rounded mb-3 relative overflow-hidden">
              <ShimmerEffect />
            </div>
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-16 h-16 bg-muted rounded-lg relative overflow-hidden">
                  <ShimmerEffect />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Size Selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="p-6 bg-muted/30 rounded-lg border"
          >
            <div className="h-5 w-24 bg-muted rounded mb-4 relative overflow-hidden">
              <ShimmerEffect />
            </div>
            <div className="flex flex-wrap gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-16 h-12 bg-muted rounded-lg relative overflow-hidden">
                  <ShimmerEffect />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quantity */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <div className="h-5 w-20 bg-muted rounded mb-3 relative overflow-hidden">
              <ShimmerEffect />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-lg" />
              <div className="w-16 h-10 bg-muted rounded-lg" />
              <div className="w-10 h-10 bg-muted rounded-lg" />
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="flex gap-3"
          >
            <div className="flex-1 h-12 bg-muted rounded-lg relative overflow-hidden">
              <ShimmerEffect />
            </div>
            <div className="w-12 h-12 bg-muted rounded-lg" />
            <div className="w-12 h-12 bg-muted rounded-lg" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};
