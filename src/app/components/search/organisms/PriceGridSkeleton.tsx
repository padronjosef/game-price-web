import { SkeletonCard } from "@/app/components/shared/molecules/GameCard";
import { Skeleton } from "@/shared/UI/Skeleton";

export const PriceGridSkeleton = () => (
  <>
    <Skeleton className="h-8 w-28 mb-4" />
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {[...Array(9)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </>
);
