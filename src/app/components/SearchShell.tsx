"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { getCurrencySymbol, type CurrencyCode } from "./CurrencySelector";
import { convertPrice } from "../lib/currency";
import { BackgroundImage } from "./BackgroundImage";
import { useCrossfade } from "../hooks/useCrossfade";
import { Toast, ToastContainer } from "./Toast";
import { PriceGrid } from "./PriceGrid";
import {
  HOME_BACKGROUNDS,
  type TypeFilter,
  type ViewMode,
  type PriceResult,
} from "../lib/stores";
import {
  getStoredCurrency,
  getStoredViewMode,
  getStoredCheapestOnly,
  getHomeBackground,
} from "../lib/storage";
import { useGameSearch } from "../hooks/useGameSearch";
import { useStoreSelection } from "../hooks/useStoreSelection";
import { TypeFilterBar } from "./TypeFilterBar";
import { ResultsToast } from "./ResultsToast";
import { RecentSearches } from "./RecentSearches";
import { SearchForm } from "./SearchForm";
import { GameNameFilter } from "./GameNameFilter";
import { InitSkeleton } from "./InitSkeleton";
import { ViewToggle } from "./ViewToggle";
import { BurgerIcon } from "./BurgerIcon";

const CurrencySelector = dynamic(() =>
  import("./CurrencySelector").then((m) => ({ default: m.CurrencySelector })),
);
const FeaturedCarousel = dynamic(() =>
  import("./FeaturedCarousel").then((m) => ({ default: m.FeaturedCarousel })),
);
const UpcomingGames = dynamic(() =>
  import("./UpcomingGames").then((m) => ({ default: m.UpcomingGames })),
);
const MobileMenu = dynamic(
  () => import("./MobileMenu").then((m) => ({ default: m.MobileMenu })),
  { ssr: false },
);
const StoreDropdown = dynamic(() =>
  import("./StoreDropdown").then((m) => ({ default: m.StoreDropdown })),
);
import { CheapestButton } from "./CheapestButton";

const ITEMS_PER_PAGE = 21;

export function SearchShell() {
  // UI state
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [gameFilter, setGameFilter] = useState<string>("all");
  const [viewMode, setViewModeState] = useState<ViewMode>("grid");
  const [filterFade, setFilterFade] = useState(false);
  const filterFadeRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [homeBg, setHomeBg] = useState<string | null>(HOME_BACKGROUNDS[0]);
  const [rateLimited, setRateLimited] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const { layers: bgLayers, setImage: setBgImage } = useCrossfade();
  const [cheapestOnly, setCheapestOnlyState] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const storeDropdownRef = useRef<HTMLDivElement>(null);
  const storeDropdownMobileRef = useRef<HTMLDivElement>(null);

  // Hooks
  const onSearchStart = useCallback(() => {
    setGameFilter("all");
    setVisibleCount(ITEMS_PER_PAGE);
  }, []);

  const search = useGameSearch({
    currency,
    onSearchStart,
  });
  const {
    query,
    setQuery,
    results,
    loading,
    scraping,
    error,
    setError,
    lastUpdated,
    recentSearches,
    showRecent,
    setShowRecent,
    rates,
    initializing,
    doSearch,
    clearSearch,
    removeRecentSearch,
    initFromUrl,
  } = search;

  const stores = useStoreSelection();
  const {
    selectedStores,
    noneSelected,
    allStoreNames,
    allStoresSelected,
    showStoreDropdown,
    setShowStoreDropdown,
    toggleStore,
    toggleAllStores,
    toggleGroup,
    hydrateStores,
  } = stores;

  // Actions
  function setViewMode(mode: ViewMode) {
    setViewModeState(mode);
    localStorage.setItem("view_mode", mode);
  }

  function setCheapestOnly(value: boolean) {
    setCheapestOnlyState(value);
    localStorage.setItem("cheapest_only", String(value));
  }

  function handleCurrencyChange(c: CurrencyCode) {
    setCurrency(c);
    localStorage.setItem("currency", c);
  }

  function onSubmitSearch(e: React.FormEvent) {
    e.preventDefault();
    inputRef.current?.blur();
    doSearch(query.trim());
  }

  const handleTypeChange = (type: TypeFilter) => {
    setTypeFilter(type);
    setVisibleCount(ITEMS_PER_PAGE);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Derived data
  const symbol = getCurrencySymbol(currency);

  const displayPrice = useCallback(
    (amount: number, from = "USD"): string => {
      const converted = convertPrice(amount, rates, currency, from);
      return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },
    [rates, currency, symbol],
  );

  const storesWithResults = useMemo(
    () =>
      new Set(
        results
          ? results.prices
              .map((p) => p.store?.name || p.storeName || "")
              .filter(Boolean)
          : [],
      ),
    [results],
  );

  const gameNames = useMemo(() => {
    if (!results) return [];
    const seen = new Map<string, string>();
    for (const p of results.prices) {
      if (p.gameType === "game" && !seen.has(p.gameName)) {
        seen.set(p.gameName, p.releaseDate);
      }
    }
    return [...seen.entries()]
      .sort((a, b) => new Date(b[1]).getTime() - new Date(a[1]).getTime())
      .map(([name]) => name);
  }, [results]);

  const heroImage = useMemo(
    () =>
      results?.prices.find(
        (p) =>
          p.backgroundUrl &&
          (gameFilter === "all"
            ? p.gameType === "game"
            : p.gameName === gameFilter),
      )?.backgroundUrl,
    [results, gameFilter],
  );

  const filteredPrices = useMemo(
    () =>
      results?.prices.filter((p) => {
        const matchesType = typeFilter === "all" || p.gameType === typeFilter;
        const storeName = p.store?.name || p.storeName || "";
        const matchesStore = allStoresSelected || selectedStores.has(storeName);
        if (gameFilter === "all") return matchesType && matchesStore;
        return matchesType && matchesStore && p.gameName === gameFilter;
      }),
    [results, typeFilter, allStoresSelected, selectedStores, gameFilter],
  );

  const displayPrices = useMemo(
    () =>
      cheapestOnly && filteredPrices
        ? [
            ...filteredPrices
              .reduce((acc, p) => {
                const key = `${p.gameName}::${p.gameType}`;
                if (
                  !acc.has(key) ||
                  Number(p.price) < Number(acc.get(key)!.price)
                ) {
                  acc.set(key, p);
                }
                return acc;
              }, new Map<string, PriceResult>())
              .values(),
          ]
        : filteredPrices,
    [cheapestOnly, filteredPrices],
  );

  // Effects
  useEffect(() => {
    requestAnimationFrame(() => {
      setCurrency(getStoredCurrency());
      setViewModeState(getStoredViewMode());
      setHomeBg(getHomeBackground());
      hydrateStores();
      setCheapestOnlyState(getStoredCheapestOnly());
    });
    initFromUrl();
    const ro = new ResizeObserver(([entry]) =>
      setHeaderHeight(entry.contentRect.height),
    );
    if (headerRef.current) ro.observe(headerRef.current);
    return () => ro.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only initialization
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!showStoreDropdown) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        !storeDropdownRef.current?.contains(target) &&
        !storeDropdownMobileRef.current?.contains(target)
      ) {
        setShowStoreDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showStoreDropdown]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting)
          setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const img = heroImage || homeBg;
    if (img) setBgImage(img);
  }, [heroImage, homeBg, setBgImage]);

  useEffect(() => {
    queueMicrotask(() => {
      setFilterFade(true);
      clearTimeout(filterFadeRef.current);
      filterFadeRef.current = setTimeout(() => setFilterFade(false), 200);
    });
  }, [selectedStores, cheapestOnly, typeFilter, gameFilter]);

  // Render
  if (initializing) return <InitSkeleton />;

  return (
    <div className="flex flex-col min-h-screen relative">
      <div
        className="fixed left-0 right-0 bottom-0 z-0 bg-zinc-950"
        style={{ top: headerHeight }}
      >
        <BackgroundImage crossfade={bgLayers} opacity={0.5} />
      </div>

      {/* Mobile menu backdrop */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`md:hidden fixed inset-0 bg-black/50 z-499 transition-opacity duration-200 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sticky header */}
      <div
        ref={headerRef}
        className="sticky top-0 z-500 pt-4 pb-4 flex justify-center bg-zinc-950"
      >
        <BackgroundImage crossfade={bgLayers} opacity={0.5} />
        <div className="w-full max-w-5xl px-4 flex flex-col items-center">
          {/* Desktop header */}
          <header className="hidden md:flex w-full text-center mb-4 relative flex-col items-center bg-black/70 rounded-lg px-5 py-3">
            <div className="absolute top-2 right-2 z-10">
              <ViewToggle value={viewMode} onChange={setViewMode} />
            </div>
            <h1 className="text-3xl font-bold mb-1">Game Price Finder</h1>
            <p className="text-zinc-200 text-sm">
              Find the cheapest price across multiple stores
            </p>
          </header>

          {/* Mobile header bar */}
          <div
            className="md:hidden w-full mb-3 relative z-400 flex items-center bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 cursor-pointer"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            <BurgerIcon open={mobileMenuOpen} />
            <h1 className="text-lg font-bold text-white flex-1 text-center">
              Game Price Finder
            </h1>
            <div className="w-8.5 h-8.5" />
            <MobileMenu
              open={mobileMenuOpen}
              cheapestOnly={cheapestOnly}
              onCheapestOnlyChange={setCheapestOnly}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              currency={currency}
              onCurrencyChange={handleCurrencyChange}
              rates={rates}
              allStoresSelected={allStoresSelected}
              noneSelected={noneSelected}
              selectedStores={selectedStores}
              allStoreNames={allStoreNames}
              storesWithResults={storesWithResults}
              hasResults={!!results}
              onToggleStore={toggleStore}
              onToggleAll={toggleAllStores}
              onToggleGroup={toggleGroup}
              onClose={() => setMobileMenuOpen(false)}
              dropdownRef={storeDropdownMobileRef}
            />
          </div>

          {/* Desktop filter row */}
          <div className="hidden md:flex gap-2 w-full mb-4 relative items-center">
            <TypeFilterBar value={typeFilter} onChange={handleTypeChange} />
            <CheapestButton
              active={cheapestOnly}
              onClick={() => setCheapestOnly(!cheapestOnly)}
              className="ml-auto"
            />
            <CurrencySelector
              value={currency}
              onChange={handleCurrencyChange}
              availableRates={rates}
            />
            <StoreDropdown
              open={showStoreDropdown}
              onToggle={() => setShowStoreDropdown((v) => !v)}
              allStoresSelected={allStoresSelected}
              noneSelected={noneSelected}
              selectedStores={selectedStores}
              allStoreNames={allStoreNames}
              storesWithResults={storesWithResults}
              hasResults={!!results}
              onToggleStore={toggleStore}
              onToggleAll={toggleAllStores}
              onToggleGroup={toggleGroup}
              dropdownRef={storeDropdownRef}
            />
          </div>

          {/* Desktop search */}
          <SearchForm
            query={query}
            onQueryChange={setQuery}
            onSubmit={onSubmitSearch}
            onClear={clearSearch}
            onSelectRecent={doSearch}
            loading={loading}
            inputFocused={inputFocused}
            onFocusChange={setInputFocused}
            recentSearches={recentSearches}
            showRecent={showRecent}
            onShowRecentChange={setShowRecent}
            inputRef={inputRef}
            variant="desktop"
            className="hidden md:block w-full mb-5 relative"
          />

          {/* Mobile type filters */}
          <TypeFilterBar
            value={typeFilter}
            onChange={handleTypeChange}
            className="md:hidden w-full mb-3 relative"
          />

          {/* Mobile search */}
          <SearchForm
            query={query}
            onQueryChange={setQuery}
            onSubmit={onSubmitSearch}
            onClear={clearSearch}
            onSelectRecent={doSearch}
            loading={loading}
            inputFocused={inputFocused}
            onFocusChange={setInputFocused}
            recentSearches={recentSearches}
            showRecent={showRecent}
            onShowRecentChange={setShowRecent}
            variant="mobile"
            className="md:hidden w-full mb-4 relative"
          />

          {/* Game name filters */}
          <GameNameFilter
            gameNames={gameNames}
            activeFilter={gameFilter}
            onFilterChange={setGameFilter}
          />
        </div>
      </div>

      {/* Home sections */}
      {!results && !loading && (
        <div className="animate-fade-in-up">
          <RecentSearches
            searches={recentSearches}
            onSelect={(term) => {
              setQuery(term);
              doSearch(term);
            }}
            onRemove={removeRecentSearch}
          />
          <div className="w-full relative z-10">
            <FeaturedCarousel
              onSelect={(name) => {
                setQuery(name);
                doSearch(name);
              }}
              onRateLimited={() => setRateLimited(true)}
            />
          </div>
          <UpcomingGames
            onRateLimited={() => setRateLimited(true)}
            viewMode={viewMode}
          />
        </div>
      )}

      {/* Results */}
      <div className="flex-1 pb-4 relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-[5px] border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
              <p className="mt-6 text-zinc-400 text-lg">
                Searching for the best prices...
              </p>
            </div>
          )}

          {!loading && results && (
            <>
              <PriceGrid
                prices={displayPrices || []}
                viewMode={viewMode}
                filterFade={filterFade}
                displayPrice={displayPrice}
                visibleCount={visibleCount}
                typeFilter={typeFilter}
              />
              {displayPrices && displayPrices.length > visibleCount && (
                <div
                  ref={sentinelRef}
                  className="flex items-center justify-center gap-3 bg-zinc-900 rounded-lg mx-auto max-w-xs px-6 py-4"
                >
                  <div className="w-6 h-6 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
                  <span className="text-base text-zinc-300 font-medium">
                    Loading more...
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ResultsToast
        resultCount={displayPrices?.length || 0}
        scraping={scraping}
        lastUpdated={lastUpdated}
        visible={!loading && !!displayPrices && displayPrices.length > 0}
      />

      <ToastContainer position="bottom-right">
        {error && (
          <Toast variant="error" message={error} onClose={() => setError("")} />
        )}
        {rateLimited && (
          <Toast
            variant="warning"
            message="Steam rate limit reached. Some data may be unavailable."
            onClose={() => setRateLimited(false)}
          />
        )}
      </ToastContainer>
    </div>
  );
}
