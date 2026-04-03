# Game Price Web

Frontend for Game Price Finder. Compares video game prices across 20+ stores in real-time.

## Tech Stack

- **Framework**: Next.js 16.2.2 (App Router, Turbopack)
- **UI**: React 19.2.4, Tailwind CSS 4
- **State**: Zustand 5 (3 stores, zero prop drilling)
- **Animations**: Motion 12 (enter/exit card animations)
- **Language**: TypeScript 5

## Architecture

The web app is the only service exposed to the internet. All API requests are proxied through Next.js route handlers to the internal NestJS backend. The browser never talks to the API directly.

```
Browser → Next.js (public) → NestJS API (internal) → PostgreSQL (internal)
```

### Routing

Two pages sharing a persistent layout:

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Featured carousel, upcoming games, recent searches |
| `/search?q=` | Search | SSE streaming results, price grid, filters |

The `AppShell` layout (header, search bar, filters, background, toasts) never re-mounts between page navigations. Uses Next.js route group `(main)` to wrap both pages.

### State Management

Three Zustand stores replaced the original 535-line SearchShell god component and eliminated all prop drilling:

| Store | Purpose |
|-------|---------|
| `useFilterStore` | Currency, view mode, cheapest only, type filter, game filter, store selection |
| `useSearchStore` | Query, results, loading, rates, EventSource streaming, recent searches |
| `useUIStore` | Mobile menu, input focus, header height, filter fade |

### Skeleton Loading

Each page has its own skeleton that shows during SSR hydration using `useSyncExternalStore`:

- `HeaderSkeleton` -- reused as wrapper by both page skeletons
- `HomeSkeleton` -- composes RecentSearchesSkeleton + FeaturedCarouselSkeleton + UpcomingGamesSkeleton
- `SearchSkeleton` -- composes GameNameFilterSkeleton + PriceGridSkeleton

Each skeleton lives next to its real component. Page-level skeletons are pure imports with zero skeleton markup.

## Component Structure

Domain-based atomic design. Each domain has its own atoms/molecules/organisms/templates. Components shared across 2+ domains live in `shared/`.

```
src/app/
  (main)/
    layout.tsx                    Route group layout → AppShell
    page.tsx                      Home page → HomeTemplate
    search/page.tsx               Search page → SearchTemplate (Suspense boundary)
  api/
    games/featured/route.ts       Proxy to backend
    games/upcoming/route.ts       Proxy to backend
    search/stream/route.ts        SSE proxy to backend
  components/
    shared/
      atoms/                      Button, CloseButton, Dropdown, FireIcon, Skeleton,
                                  Checkbox, ChevronIcon, CloseIcon, Collapse,
                                  BackgroundImage, StoreIcon
      molecules/                  GameCard, Toast
    header/
      atoms/                      BurgerIcon, CheapestButton, ViewToggle,
                                  HeaderSkeleton, InitSkeleton
      molecules/                  SearchForm, CurrencySelector, TypeFilterBar,
                                  GameNameFilter, ResultsToast, StoreList,
                                  StoreSection, GameNameFilterSkeleton
      organisms/                  AppShell, MobileMenu, StoreDropdown
    home/
      atoms/                      HomeSkeleton
      molecules/                  RecentSearches, RecentSearchesSkeleton
      organisms/                  FeaturedCarousel, FeaturedCarouselSkeleton,
                                  UpcomingGames, UpcomingGamesSkeleton
      templates/                  HomeTemplate
    search/
      atoms/                      SearchSkeleton
      molecules/                  PriceCard
      organisms/                  PriceGrid, PriceGridSkeleton
      templates/                  SearchTemplate
  stores/
    useFilterStore.ts             Currency, filters, store selection, localStorage persistence
    useSearchStore.ts             Search, EventSource SSE, recent searches, exchange rates
    useUIStore.ts                 Mobile menu, scroll-to-top on close, filter fade
  hooks/
    useMounted.ts                 Hydration-safe SSR/client detection via useSyncExternalStore
    useCrossfade.ts               Background image crossfade transitions
  lib/
    currency.ts                   GLOBAL_CURRENCIES, LATAM_CURRENCIES, conversion, symbols
    storage.ts                    localStorage helpers
    stores/                       Constants (API_URL, STORE_ICONS, TYPE_LABELS), types
```

## Key Features

- **SSE streaming search** -- progressive loading, fast sources first (Steam + CheapShark), slow scrapers after (Instant Gaming)
- **Multi-currency** -- 12 currencies split into Global (USD, EUR, GBP, JPY, CAD, AUD) and Latam (COP, BRL, MXN, ARS, CLP, PEN) with live exchange rates
- **Store filtering** -- 20+ stores with grouped checkboxes (main stores / other stores), select all/deselect all
- **Type filtering** -- All, Base Game, DLC, Bundle tabs
- **Game name filtering** -- collapsible row with "+X More Games" counter and animated chevron
- **Cheapest only** -- shows only the lowest price per game
- **Grid/list view** -- toggle with motion enter/exit animations on each GameCard (AnimatePresence)
- **Shared Button** -- 3 variants (default, outline, success) with 600ms transition, used everywhere
- **Shared Dropdown** -- generic atom with click-outside, chevron animation, useDropdownClose context for auto-close
- **CloseButton** -- consistent close button across all components
- **FireIcon** -- used in favicon, header title, and cheapest only button
- **Recent searches** -- localStorage persisted, grid with close buttons
- **Background crossfade** -- hero image transitions between game backgrounds
- **Mobile menu** -- collapsible with scroll-to-top on close, store section, currency selector
- **Version display** -- shown in desktop header (bottom-right) and mobile menu (separator between currency and stores)
- **Open Graph image** -- auto-generated with fire icon for link previews
- **Scrollbar stability** -- forced visible to prevent horizontal layout shift

## Getting Started

### Prerequisites

- Docker
- All 3 repos cloned as siblings:
  ```
  game-price-finder/
    game-price-web/
    game-price-api/
    game-price-infra/
  ```

### Development

```bash
cd game-price-infra
docker compose up
```

- Frontend: http://localhost:3003
- Do NOT run `npm run dev` directly

### Environment Variables

| Variable | Description |
|----------|-------------|
| `INTERNAL_API_URL` | Backend URL (server-side, default `http://api:3000` in Docker) |
| `NEXT_PUBLIC_APP_VERSION` | Auto-set from package.json via next.config.ts |

## Deployment

GitHub Actions on push to `main`:
1. Runs `scripts/bump-version.sh` (if commit has version prefix)
2. Amends commit with version bump + force push
3. Creates git tag and GitHub Release with changelog
4. SSH into EC2 and runs `deploy.sh web`

### Pre-push Hook (Husky)

Runs `npm run lint` + `npm run build` before every push.

### Auto-Versioning

Prefix commit messages to auto-bump:
- `[patch] fix typo` → 1.0.0 → 1.0.1
- `[minor] add feature` → 1.0.1 → 1.1.0
- `[major] breaking change` → 1.1.0 → 2.0.0
- No prefix → no bump, deploy only

## Related Repos

- [game-price-api](https://github.com/padronjosef/game-price-api) -- NestJS backend with scraping and caching
- [game-price-infra](https://github.com/padronjosef/game-price-infra) -- Docker Compose, Terraform, nginx, CI/CD
