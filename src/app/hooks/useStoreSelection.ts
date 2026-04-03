"use client";

import { useState, useCallback } from "react";
import { STORE_ICONS, MAIN_STORES } from "../lib/stores";
import type { SearchResponse } from "../lib/stores";

export function useStoreSelection() {
  const [selectedStores, setSelectedStoresState] = useState<Set<string>>(
    new Set(),
  );
  const [noneSelected, setNoneSelected] = useState(false);
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);

  const allStoreNames = Object.keys(STORE_ICONS).sort();

  function setSelectedStores(
    updater: Set<string> | ((prev: Set<string>) => Set<string>),
  ) {
    setSelectedStoresState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      localStorage.setItem(
        "selected_stores",
        JSON.stringify({ stores: [...next], noneSelected: false }),
      );
      return next;
    });
  }

  function selectNone() {
    setNoneSelected(true);
    setSelectedStoresState(new Set());
    localStorage.setItem(
      "selected_stores",
      JSON.stringify({ stores: [], noneSelected: true }),
    );
  }

  function selectAll() {
    setNoneSelected(false);
    setSelectedStoresState(new Set());
    localStorage.setItem(
      "selected_stores",
      JSON.stringify({ stores: [], noneSelected: false }),
    );
  }

  const allStoresSelected =
    !noneSelected &&
    (selectedStores.size === 0 || selectedStores.size === allStoreNames.length);

  function toggleStore(store: string) {
    if (noneSelected) {
      setNoneSelected(false);
      const next = new Set([store]);
      setSelectedStoresState(next);
      localStorage.setItem(
        "selected_stores",
        JSON.stringify({ stores: [...next], noneSelected: false }),
      );
      return;
    }

    setSelectedStores((prev) => {
      const current = prev.size === 0 ? new Set(allStoreNames) : new Set(prev);
      if (current.has(store)) current.delete(store);
      else current.add(store);
      if (current.size === allStoreNames.length) return new Set();
      if (current.size === 0) {
        // Will need to set noneSelected separately
        queueMicrotask(() => selectNone());
        return new Set();
      }
      return current;
    });
  }

  function toggleAllStores() {
    if (allStoresSelected) {
      selectNone();
    } else {
      selectAll();
    }
  }

  function toggleGroup(groupStores: string[]) {
    if (noneSelected) {
      setNoneSelected(false);
      const next = new Set(groupStores);
      setSelectedStoresState(next);
      localStorage.setItem(
        "selected_stores",
        JSON.stringify({ stores: [...next], noneSelected: false }),
      );
      return;
    }

    setSelectedStores((prev) => {
      const current = prev.size === 0 ? new Set(allStoreNames) : new Set(prev);
      const allInGroup = groupStores.every((s) => current.has(s));
      if (allInGroup) {
        groupStores.forEach((s) => current.delete(s));
      } else {
        groupStores.forEach((s) => current.add(s));
      }
      if (current.size === allStoreNames.length) return new Set();
      if (current.size === 0) {
        queueMicrotask(() => selectNone());
        return new Set();
      }
      return current;
    });
  }

  function getStoresWithResults(results: SearchResponse | null) {
    return new Set(
      results
        ? results.prices
            .map((p) => p.store?.name || p.storeName || "")
            .filter(Boolean)
        : [],
    );
  }

  const hydrateStores = useCallback(() => {
    const saved = localStorage.getItem("selected_stores");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrate old format (plain array) to new format
        if (Array.isArray(parsed)) {
          if (parsed.length === 1 && parsed[0] === "__none__") {
            setNoneSelected(true);
            setSelectedStoresState(new Set());
          } else {
            setNoneSelected(false);
            setSelectedStoresState(new Set(parsed));
          }
        } else {
          setNoneSelected(parsed.noneSelected ?? false);
          setSelectedStoresState(new Set(parsed.stores ?? []));
        }
      } catch {
        setSelectedStoresState(new Set(MAIN_STORES));
      }
    } else {
      setSelectedStoresState(new Set(MAIN_STORES));
    }
  }, []);

  function isStoreSelected(store: string): boolean {
    if (noneSelected) return false;
    if (allStoresSelected) return true;
    return selectedStores.has(store);
  }

  return {
    selectedStores,
    noneSelected,
    allStoreNames,
    allStoresSelected,
    showStoreDropdown,
    setShowStoreDropdown,
    toggleStore,
    toggleAllStores,
    toggleGroup,
    getStoresWithResults,
    hydrateStores,
    isStoreSelected,
  };
}
