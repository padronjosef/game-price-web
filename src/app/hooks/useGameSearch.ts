"use client";

import { useState, useRef, useCallback } from "react";
import {
  getCountryForCurrency,
  type CurrencyCode,
} from "../components/CurrencySelector";
import { getExchangeRates } from "../lib/currency";
import { API_URL, type PriceResult, type SearchResponse } from "../lib/stores";

interface UseGameSearchOptions {
  currency: CurrencyCode;
  onSearchStart?: () => void;
}

export function useGameSearch({
  currency,
  onSearchStart,
}: UseGameSearchOptions) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);

  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 });
  const [initializing, setInitializing] = useState(true);
  const evtSourceRef = useRef<EventSource | null>(null);

  const doSearch = useCallback(
    (rawTerm: string) => {
      const term = rawTerm.replace(/\s+/g, " ").trim();
      if (term.length < 2) return;

      const url = new URL(window.location.href);
      if (url.searchParams.get("q") !== term) {
        url.searchParams.set("q", term);
        window.history.pushState({}, "", url.toString());
      }

      setResults(null);
      setShowRecent(false);
      setLoading(true);
      setScraping(false);
      setError("");
      onSearchStart?.();

      if (evtSourceRef.current) evtSourceRef.current.close();

      const evtSource = new EventSource(
        `${API_URL}/search/stream?q=${encodeURIComponent(term)}&cc=${getCountryForCurrency(currency)}`,
      );
      evtSourceRef.current = evtSource;

      evtSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "pending") {
          setScraping(true);
        }

        if (data.type === "fast") {
          setResults({ game: data.game, prices: data.prices });
          setLastUpdated(new Date());
          setLoading(false);
          if (data.prices && data.prices.length > 0) {
            const existing: string[] = JSON.parse(
              localStorage.getItem("recent_searches") || "[]",
            );
            const updated = [
              term,
              ...existing.filter(
                (s: string) => s.toLowerCase() !== term.toLowerCase(),
              ),
            ].slice(0, 6);
            setRecentSearches(updated);
            localStorage.setItem("recent_searches", JSON.stringify(updated));
          }
        }

        if (data.type === "slow") {
          setResults((prev) => {
            if (!prev) return prev;
            const all = [...prev.prices, ...data.prices];
            all.sort(
              (a: PriceResult, b: PriceResult) =>
                Number(a.price) - Number(b.price),
            );
            return { ...prev, prices: all };
          });
        }

        if (data.type === "done") {
          setScraping(false);
          evtSource.close();
        }
      };

      evtSource.onerror = () => {
        setError("Could not fetch prices. Make sure the API is running.");
        setLoading(false);
        setScraping(false);
        evtSource.close();
      };
    },
    [currency, onSearchStart],
  );

  function clearSearch() {
    setQuery("");
    setResults(null);
    setError("");
    setLastUpdated(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("q");
    window.history.pushState({}, "", url.toString());
  }

  function removeRecentSearch(term: string) {
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  }

  const initFromUrl = useCallback(() => {
    const saved = localStorage.getItem("recent_searches");
    if (saved) setRecentSearches(JSON.parse(saved));

    getExchangeRates()
      .then(setRates)
      .catch((err) => console.error("Failed to load rates:", err));

    const urlQ = new URLSearchParams(window.location.search).get("q");
    if (urlQ && urlQ.trim().length >= 2) {
      queueMicrotask(() => {
        setQuery(urlQ.trim());
        setLoading(true);
        setInitializing(false);
        doSearch(urlQ.trim());
      });
    } else {
      queueMicrotask(() => setInitializing(false));
    }
  }, [doSearch]);

  return {
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
  };
}
