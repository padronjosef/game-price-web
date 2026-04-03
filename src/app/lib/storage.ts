import type { CurrencyCode } from "../components/CurrencySelector";
import type { ViewMode } from "./stores";
import { HOME_BACKGROUNDS } from "./stores";

export function getStoredCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "USD";
  return (localStorage.getItem("currency") as CurrencyCode) || "USD";
}

export function getStoredViewMode(): ViewMode {
  if (typeof window === "undefined") return "grid";
  return (localStorage.getItem("view_mode") as ViewMode) || "grid";
}


export function getStoredCheapestOnly(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("cheapest_only") === "true";
}

export function getHomeBackground(): string {
  if (typeof window === "undefined") return HOME_BACKGROUNDS[0];
  const stored = sessionStorage.getItem("home_background");
  if (stored) return stored;
  const picked = HOME_BACKGROUNDS[Math.floor(Math.random() * HOME_BACKGROUNDS.length)];
  sessionStorage.setItem("home_background", picked);
  return picked;
}
