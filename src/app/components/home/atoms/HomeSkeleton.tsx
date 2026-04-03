import { Skeleton } from "../../shared/atoms/Skeleton";

export const HomeSkeleton = () => (
  <div className="animate-fade-in-up">
    {/* Recent searches skeleton */}
    <div className="w-full max-w-5xl mx-auto px-4 mb-6 relative z-10">
      <Skeleton className="h-7 w-44 mb-3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-12" />
        ))}
      </div>
    </div>

    {/* Featured carousel skeleton */}
    <div
      className="w-full relative z-10 mb-10 mx-auto"
      style={{ maxWidth: 1400 }}
    >
      <div className="max-w-5xl mx-auto px-4 mb-3">
        <Skeleton className="h-7 w-44" />
      </div>
      <div className="flex gap-3 px-4 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="shrink-0 w-65 md:w-100 aspect-video" />
        ))}
      </div>
    </div>

    {/* Upcoming games skeleton */}
    <div className="w-full max-w-5xl mx-auto px-4 mb-6 relative z-10">
      <Skeleton className="h-7 w-40 mb-3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[190px]" />
        ))}
      </div>
    </div>
  </div>
);
