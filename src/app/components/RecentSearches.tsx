"use client";

import { CloseIcon } from "./ui/CloseIcon";

interface RecentSearchesProps {
  searches: string[];
  onSelect: (term: string) => void;
  onRemove: (term: string) => void;
}

export function RecentSearches({
  searches,
  onSelect,
  onRemove,
}: RecentSearchesProps) {
  if (searches.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mb-6 relative z-10">
      <h2 className="text-lg font-bold text-white mb-3">
        <span className="bg-black/70 px-2 py-1 rounded">Recent Searches</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {searches.map((term) => (
          <div
            key={term}
            className="flex items-center bg-zinc-800 border border-zinc-700/50 rounded-lg overflow-hidden group hover:border-zinc-600 transition-colors"
          >
            <button
              type="button"
              onClick={() => onSelect(term)}
              className="flex-1 text-left px-4 py-3 text-sm text-zinc-300 hover:text-white transition-colors cursor-pointer truncate"
            >
              {term}
            </button>
            <button
              type="button"
              onClick={() => onRemove(term)}
              className="px-3 py-3 text-zinc-600 hover:text-red-400 cursor-pointer transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
