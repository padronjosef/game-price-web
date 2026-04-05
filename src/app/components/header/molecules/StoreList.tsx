"use client";

import { MAIN_STORES } from "@/shared/lib/stores";
import { StoreIcon } from "@/app/components/shared/atoms/StoreIcon";
import { Checkbox } from "@/app/components/shared/atoms/Checkbox";
import { useSearchStore } from "@/shared/stores/useSearchStore";

type StoreListProps = {
  allStoreNames: string[];
  selectedStores: Set<string>;
  allStoresSelected: boolean;
  noneSelected: boolean;
  storesWithResults: Set<string>;
  hasResults: boolean;
  onToggleStore: (store: string) => void;
  onToggleGroup: (stores: string[]) => void;
  layout: "columns" | "stacked";
}

export const StoreList = ({
  allStoreNames,
  selectedStores,
  allStoresSelected,
  noneSelected,
  storesWithResults,
  hasResults,
  onToggleStore,
  onToggleGroup,
  layout,
}: StoreListProps) => {
  const failedStores = useSearchStore((s) => s.failedStores);

  const groups = [
    {
      label: "Main stores",
      stores: allStoreNames.filter((s) => s in MAIN_STORES),
    },
    {
      label: "Other stores",
      stores: allStoreNames.filter((s) => !(s in MAIN_STORES)),
    },
  ];

  const currentSet = noneSelected
    ? new Set<string>()
    : selectedStores.size === 0
      ? new Set(allStoreNames)
      : selectedStores;

  return (
    <div className={layout === "columns" ? "flex" : ""}>
      {groups.map((group, gi) => {
        const allGroupSelected = group.stores.every((s) => currentSet.has(s));
        return (
          <div
            key={group.label}
            className={
              layout === "columns"
                ? `min-w-50 ${gi > 0 ? "border-l border-border" : ""}`
                : "mb-5"
            }
          >
            <div
              className={`flex items-center gap-2 cursor-pointer hover:bg-border ${
                layout === "columns" ? "px-3 pt-1 pb-1" : "py-1 mb-2"
              }`}
              onClick={() => onToggleGroup(group.stores)}
            >
              <Checkbox checked={allGroupSelected} size="sm" />
              <span
                className={`font-bold text-foreground uppercase tracking-wider ${
                  layout === "columns" ? "text-xs" : "text-sm"
                }`}
              >
                {group.label}
              </span>
            </div>
            <div className={layout === "stacked" ? "flex flex-col" : ""}>
              {group.stores.map((store) => {
                const storeHasResults = storesWithResults.has(store);
                const unavailable = hasResults && !storeHasResults;
                const isFailed = failedStores.has(store);
                const failReason = failedStores.get(store);
                const isSelected =
                  allStoresSelected ||
                  (!noneSelected && selectedStores.has(store));
                return (
                  <div
                    key={store}
                    title={
                      isFailed
                        ? `Scraper failed: ${failReason}`
                        : unavailable
                          ? "Not available for this game"
                          : undefined
                    }
                    className={`flex items-center gap-${layout === "stacked" ? "3" : "2"} px-${layout === "stacked" ? "2" : "3"} py-1.5 text-sm cursor-pointer hover:bg-border ${
                      layout === "stacked" ? "rounded" : ""
                    } ${isFailed ? "border border-red-500/60 rounded bg-red-500/5" : ""} ${unavailable && !isFailed ? "brightness-50" : ""}`}
                    onClick={() => onToggleStore(store)}
                  >
                    <Checkbox checked={isSelected} />
                    <StoreIcon storeName={store} />
                    <span
                      className={`${layout === "stacked" ? "truncate " : ""}${isFailed ? "text-red-400" : unavailable ? "text-muted-foreground" : "text-foreground"}`}
                    >
                      {store}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
