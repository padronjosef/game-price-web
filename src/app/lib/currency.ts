const STORAGE_KEY = "exchange_rates";
const CACHE_HOURS = 6;

interface CachedRates {
  rates: Record<string, number>;
  timestamp: number;
}

function getCachedRates(): Record<string, number> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const cached: CachedRates = JSON.parse(raw);
    const ageMs = Date.now() - cached.timestamp;
    if (ageMs > CACHE_HOURS * 60 * 60 * 1000) return null;
    return cached.rates;
  } catch {
    return null;
  }
}

export async function getExchangeRates(): Promise<Record<string, number>> {
  const cached = getCachedRates();
  if (cached) return cached;

  const res = await fetch("https://open.er-api.com/v6/latest/USD");
  const data = await res.json();

  const rates: Record<string, number> = data.rates;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ rates, timestamp: Date.now() }),
  );

  return rates;
}

export function convertPrice(
  amount: number,
  rates: Record<string, number>,
  to: string,
): number {
  if (to === "USD") return amount;
  const rate = rates[to] ?? 1;
  return Math.round(amount * rate * 100) / 100;
}
