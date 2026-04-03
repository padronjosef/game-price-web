import { Suspense } from "react";
import { SearchTemplate } from "../../components/search/templates/SearchTemplate";
import { SearchSkeleton } from "../../components/search/atoms/SearchSkeleton";

const SearchPage = () => {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchTemplate />
    </Suspense>
  );
};

export default SearchPage;
