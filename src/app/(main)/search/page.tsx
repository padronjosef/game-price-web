import { Suspense } from "react";
import { SearchTemplate } from "@/app/components/search/templates/SearchTemplate";
import { SearchFiltersSkeleton } from "@/app/components/search/molecules/SearchFiltersSkeleton";
import { PriceGridSkeleton } from "@/app/components/search/organisms/PriceGridSkeleton";

const SearchFallback = () => (
  <div className="flex-1 pb-4 relative z-10">
    <SearchFiltersSkeleton />
    <div className="max-w-5xl mx-auto px-4">
      <PriceGridSkeleton />
    </div>
  </div>
);

const SearchPage = () => (
  <Suspense fallback={<SearchFallback />}>
    <SearchTemplate />
  </Suspense>
);

export default SearchPage;
