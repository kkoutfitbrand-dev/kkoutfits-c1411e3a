import { Skeleton } from "@/components/ui/skeleton";

export const HeroSkeleton = () => (
  <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
    <Skeleton className="w-full h-full" />
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-12 w-64 md:w-96" />
      <Skeleton className="h-10 w-32" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="space-y-3">
        <Skeleton className="aspect-[3/4] w-full rounded-lg" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    ))}
  </div>
);

export const CategoryGridSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
    {[...Array(8)].map((_, i) => (
      <Skeleton key={i} className="aspect-square rounded-xl" />
    ))}
  </div>
);

export const BannerSkeleton = () => (
  <div className="w-full py-8">
    <div className="container px-4">
      <Skeleton className="h-32 md:h-48 w-full rounded-xl" />
    </div>
  </div>
);

export const SectionSkeleton = () => (
  <div className="container px-4 py-8">
    <Skeleton className="h-8 w-48 mb-6" />
    <ProductGridSkeleton count={4} />
  </div>
);
