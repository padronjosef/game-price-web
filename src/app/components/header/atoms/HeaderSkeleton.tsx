import { Skeleton } from "@/shared/UI/Skeleton";

export const HeaderSkeleton = ({ children }: { children?: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen relative">
    <div className="z-500 flex flex-col items-center mb-6">
      {/* Desktop header */}
      <div className="hidden md:flex w-full bg-background">
        <div className="w-full max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
          <Skeleton className="h-7 w-32" />
          <div className="flex items-center gap-2 flex-1 max-w-150 min-w-0">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="size-10" />
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden w-full flex flex-col bg-background">
        <div className="flex items-center justify-between px-4 pt-3 pb-4">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="size-10" />
        </div>
        <div className="bg-linear-to-b from-[#1a1a1a] to-[#111111] rounded-none! px-4 pt-4 pb-10 -mb-6">
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    </div>

    {children}
  </div>
);
