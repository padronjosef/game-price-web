import type { TypeFilter } from "./types";

export const API_URL = "/api";

export const MAIN_STORES = new Set([
  "Blizzard Shop",
  "Epic Games Store",
  "GOG",
  "Humble Store",
  "Instant Gaming",
  "Origin",
  "Steam",
  "Uplay",
]);

export const TYPE_LABELS: Record<TypeFilter, string> = {
  all: "All",
  game: "Base Game",
  dlc: "DLC",
  bundle: "Bundle",
};

export const STORE_ICONS: Record<string, { file: string; ext: "png" | "svg" }> = {
  "Steam": { file: "steam", ext: "png" },
  "GOG": { file: "gog", ext: "png" },
  "Epic Games Store": { file: "epicgames", ext: "svg" },
  "Humble Store": { file: "humble", ext: "png" },
  "Fanatical": { file: "fanatical", ext: "png" },
  "GreenManGaming": { file: "greenmangaming", ext: "svg" },
  "Origin": { file: "origin", ext: "svg" },
  "Uplay": { file: "ubisoft", ext: "svg" },
  "GamersGate": { file: "gamersgate", ext: "png" },
  "IndieGala": { file: "indiegala", ext: "png" },
  "Blizzard Shop": { file: "blizzard", ext: "png" },
  "2Game": { file: "2game", ext: "svg" },
  "GameBillet": { file: "gamebillet", ext: "png" },
  "Games Planet": { file: "gamesplanet", ext: "png" },
  "WinGameStore": { file: "wingamestore", ext: "png" },
  "Gamesload": { file: "gamesload", ext: "svg" },
  "DLGamer": { file: "dlgamer", ext: "png" },
  "Noctre": { file: "noctre", ext: "png" },
  "DreamGame": { file: "dreamgame", ext: "svg" },
  "Instant Gaming": { file: "instantgaming", ext: "png" },
};

export const HOME_BACKGROUNDS = [
  "/home-backgrounds/home-background-1.jpg",
  "/home-backgrounds/home-background-2.jpg",
  "/home-backgrounds/home-background-3.png",
  "/home-backgrounds/home-background-4.jpg",
  "/home-backgrounds/home-background-5.jpg",
];
