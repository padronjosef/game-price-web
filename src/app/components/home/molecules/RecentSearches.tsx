"use client";

import { useSyncExternalStore } from "react";
import { CloseButton } from "../../shared/atoms/CloseButton";
import { Skeleton } from "../../shared/atoms/Skeleton";
import { useSearchStore } from "../../../stores/useSearchStore";

type RecentSearchesProps = {
  onSelect: (term: string) => void;
  onRemove: (term: string) => void;
};

const subscribe = () => () => {};
const useMounted = () =>
  useSyncExternalStore(subscribe, () => true, () => false);

const SkeletonCard = () => <Skeleton className="h-12 rounded-lg" />;

export const RecentSearches = ({
  onSelect,
  onRemove,
}: RecentSearchesProps) => {
  const mounted = useMounted();
  const searches = useSearchStore((s) => s.recentSearches);

  if (mounted && searches.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mb-6 relative z-10">
      <h2 className="text-lg font-bold text-white mb-3">
        <span className="bg-black/70 px-2 py-1 rounded">Recent Searches</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {!mounted
          ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          : searches.map((term) => (
              <div
                key={term}
                className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700/50 rounded-lg group hover:border-zinc-600 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => onSelect(term)}
                  className="flex-1 text-left text-sm text-zinc-300 hover:text-white transition-colors cursor-pointer truncate"
                >
                  {term}
                </button>

                <CloseButton onClick={() => onRemove(term)} />
              </div>
            ))}
      </div>
    </div>
  );
};
