import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { motion } from "framer-motion";

export const HeroSkeleton = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]"
  >
    <Skeleton className="w-full h-full" />
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-12 w-64 md:w-96" />
      <Skeleton className="h-10 w-32" />
    </div>
  </motion.div>
);

export const ProductGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
    {[...Array(count)].map((_, i) => (
      <ProductCardSkeleton key={i} index={i} />
    ))}
  </div>
);

export const CategoryGridSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.05, duration: 0.3 }}
      >
        <Skeleton className="aspect-square rounded-xl" />
      </motion.div>
    ))}
  </div>
);

export const BannerSkeleton = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full py-8"
  >
    <div className="container px-4">
      <Skeleton className="h-32 md:h-48 w-full rounded-xl" />
    </div>
  </motion.div>
);

export const SectionSkeleton = () => (
  <div className="container px-4 py-8">
    <Skeleton className="h-8 w-48 mb-6" />
    <ProductGridSkeleton count={4} />
  </div>
);
