export type TypeFilter = "all" | "game" | "dlc" | "bundle";
export type ViewMode = "grid" | "list";

export interface PriceResult {
  id: string;
  price: number;
  originalPrice?: number;
  currency: string;
  productUrl: string;
  gameName: string;
  gameType: string;
  imageUrl: string;
  backgroundUrl: string;
  releaseDate: string;
  storeName?: string;
  store?: { name: string; url: string };
}

export interface SearchResponse {
  game: { name: string; slug: string };
  prices: PriceResult[];
}
