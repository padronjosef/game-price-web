"use client";

import { Checkbox } from "./ui/Checkbox";
import { ChevronIcon } from "./ui/ChevronIcon";
import { StoreList } from "./StoreList";

interface StoreDropdownProps {
  open: boolean;
  onToggle: () => void;
  allStoresSelected: boolean;
  noneSelected: boolean;
  selectedStores: Set<string>;
  allStoreNames: string[];
  storesWithResults: Set<string>;
  hasResults: boolean;
  onToggleStore: (store: string) => void;
  onToggleAll: () => void;
  onToggleGroup: (stores: string[]) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export function StoreDropdown({
  open,
  onToggle,
  allStoresSelected,
  noneSelected,
  selectedStores,
  allStoreNames,
  storesWithResults,
  hasResults,
  onToggleStore,
  onToggleAll,
  onToggleGroup,
  dropdownRef,
}: StoreDropdownProps) {
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-2 px-3 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          allStoresSelected
            ? "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            : "bg-blue-600 text-white"
        }`}
      >
        Stores
        {!allStoresSelected && (
          <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {noneSelected ? 0 : selectedStores.size}
          </span>
        )}
        <ChevronIcon open={open} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-2xl z-100 py-1 animate-fade-in-up">
          <button
            type="button"
            onClick={onToggleAll}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-700 cursor-pointer"
          >
            <Checkbox checked={allStoresSelected} />
            <span className="text-zinc-200 font-medium">All stores</span>
          </button>

          <div className="h-px bg-zinc-700 mx-2 my-1" />

          <StoreList
            allStoreNames={allStoreNames}
            selectedStores={selectedStores}
            allStoresSelected={allStoresSelected}
            noneSelected={noneSelected}
            storesWithResults={storesWithResults}
            hasResults={hasResults}
            onToggleStore={onToggleStore}
            onToggleGroup={onToggleGroup}
            layout="columns"
          />
        </div>
      )}
    </div>
  );
}
