import { Suspense } from "react";
import { SearchTemplate } from "@/app/components/search/templates/SearchTemplate";

const SearchPage = () => (
  <Suspense>
    <SearchTemplate />
  </Suspense>
);

export default SearchPage;
