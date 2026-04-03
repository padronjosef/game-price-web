"use client";

import { Collapse } from "./Collapse";
import { CheapestButton } from "./CheapestButton";
import { ViewToggle } from "./ViewToggle";
import { CurrencySelector, type CurrencyCode } from "./CurrencySelector";
import { StoreList } from "./StoreList";
import type { ViewMode } from "../lib/stores";

interface MobileMenuProps {
  open: boolean;
  cheapestOnly: boolean;
  onCheapestOnlyChange: (value: boolean) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  rates: Record<string, number>;
  allStoresSelected: boolean;
  noneSelected: boolean;
  selectedStores: Set<string>;
  allStoreNames: string[];
  storesWithResults: Set<string>;
  hasResults: boolean;
  onToggleStore: (store: string) => void;
  onToggleAll: () => void;
  onToggleGroup: (stores: string[]) => void;
  onClose: () => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export function MobileMenu({
  open,
  cheapestOnly,
  onCheapestOnlyChange,
  viewMode,
  onViewModeChange,
  currency,
  onCurrencyChange,
  rates,
  allStoresSelected,
  noneSelected,
  selectedStores,
  allStoreNames,
  storesWithResults,
  hasResults,
  onToggleStore,
  onToggleAll,
  onToggleGroup,
  onClose,
  dropdownRef,
}: MobileMenuProps) {
  return (
    <Collapse
      open={open}
      maxHeight="70vh"
      duration={200}
      className="absolute left-0 right-0 top-full mt-1 z-400"
    >
      <div
        className="bg-zinc-800 border border-zinc-600/50 rounded-lg px-4 py-4 flex flex-col gap-4 shadow-2xl max-h-[70vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <CheapestButton
            active={cheapestOnly}
            onClick={() => {
              onCheapestOnlyChange(!cheapestOnly);
              onClose();
            }}
          />

          <ViewToggle
            value={viewMode}
            onChange={(m) => {
              onViewModeChange(m);
              onClose();
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-white uppercase tracking-wider">
            Currency
          </span>
          <CurrencySelector
            value={currency}
            onChange={(c) => {
              onCurrencyChange(c);
              onClose();
            }}
            availableRates={rates}
          />
        </div>

        <hr className="border-zinc-600" />

        <div ref={dropdownRef}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              Stores
            </span>
            <button
              type="button"
              onClick={onToggleAll}
              className={`text-xs px-2 py-1 rounded border border-zinc-600/50 cursor-pointer ${
                allStoresSelected
                  ? "text-zinc-400 hover:text-zinc-200"
                  : "text-blue-400 hover:text-blue-300"
              }`}
            >
              {allStoresSelected ? "Deselect all" : "Select all"}
            </button>
          </div>
          <StoreList
            allStoreNames={allStoreNames}
            selectedStores={selectedStores}
            allStoresSelected={allStoresSelected}
            noneSelected={noneSelected}
            storesWithResults={storesWithResults}
            hasResults={hasResults}
            onToggleStore={onToggleStore}
            onToggleGroup={onToggleGroup}
            layout="stacked"
          />
        </div>
      </div>
    </Collapse>
  );
}
