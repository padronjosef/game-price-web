import { Suspense } from "react";
import { SearchShell } from "./components/SearchShell";
import { InitSkeleton } from "./components/InitSkeleton";

export default function Home() {
  return (
    <Suspense fallback={<InitSkeleton />}>
      <SearchShell />
    </Suspense>
  );
}
