# Game Price Web

Frontend for Game Price Finder — a web app that compares video game prices across multiple online stores.

## Features

- **Real-time search** with progressive loading via SSE (fast results appear instantly, slow scrapers fill in after)
- **Featured carousel** and **upcoming games** on the home page
- **Price comparison** across Steam, GOG, Humble, Fanatical, GreenManGaming, Epic, Instant Gaming, and 15+ more stores
- **Filters** by game type (base game, DLC, bundle), store, and cheapest-only toggle
- **Multi-currency support** with automatic detection based on user location
- **Infinite scroll** for large result sets
- **Grid and list views** for browsing results
- **Toast notifications** for errors, scraping status, and rate limit warnings
- **Image fallback** with gamepad icon when store images aren't available

## Tech Stack

- **Next.js 16** with App Router
- **React 19**
- **Tailwind CSS 4**
- **TypeScript**

## Setup

```bash
npm install
npm run dev
```

The app runs on `http://localhost:3000` by default.

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3002/api` | Backend API URL |
| `PORT` | `3000` | Dev server port |

## Related Repos

This project is part of a multi-repo setup. All three repos are needed to run the full stack:

| Repo | Description |
|------|-------------|
| [game-price-api](https://github.com/padronjosef/game-price-api) | Backend API (NestJS) |
| **game-price-web** (this repo) | Frontend |
| [game-price-infra](https://github.com/padronjosef/game-price-infra) | Docker Compose and infrastructure |

> The easiest way to get everything running is via Docker Compose in the [infra repo](https://github.com/padronjosef/game-price-infra). Clone all three repos as siblings and run `docker compose up` from `game-price-infra/`.

## Project Structure

```
src/app/
  page.tsx                # Main search page
  components/
    BackgroundImage.tsx    # Dynamic background based on selected game
    CurrencySelector.tsx   # Currency picker with auto-detection
    FeaturedCarousel.tsx   # Horizontal carousel of featured games
    GameCard.tsx           # Game card (grid mode) and skeleton loader
    Toast.tsx              # Toast notification system
    UpcomingGames.tsx      # Upcoming games grid
  lib/
    currency.ts            # Exchange rate fetching and conversion
```
