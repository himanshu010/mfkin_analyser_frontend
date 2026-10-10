# MFKIN Analyser Frontend

[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.x-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-14.x-0055FF?logo=framer&logoColor=white)](https://motion.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-1.x-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Coverage](https://img.shields.io/badge/Coverage-100%25_required-0B6E4F)](#testing-and-coverage)
[![License](https://img.shields.io/badge/License-MIT-222)](#license)

A clean, data-rich dashboard for the MFKIN Analyser backend. Think of it as a market command center: sector insights, fund rankings, and high-signal metrics in one glance. Built for speed, clarity, and a little bit of swagger.

## Highlights

- Sector-first discovery with ranked fund lists and time-window toggles (1Y / 3Y / 5Y)
- Leaders for each period, the largest funds by AUM and the cheapest by expense ratio, side by side
- Fund spotlight with NAV, returns, AUM, P/E, expense ratio, risk rating and the fund's rank in its sector
- Dense ranking table with sorting, sticky columns and paging for very long lists; sortable cards on phones
- Light, dark and funky themes, live ranking progress, and motion that respects "reduce motion"
- Strict 100% coverage enforcement on every push

## What You Can Do

- Browse sectors and instantly see the top performers per window
- Drill into a fund and view its sector context + ranking position
- Compare metrics like AUM and valuation ratios at a glance
- Filter and sort in the ranking table without leaving the page

## Quick Start

Prereqs:

- Node.js 20+ (Tailwind CSS 4 requirement; `.nvmrc` pins 22)
- npm

```bash
npm install
npm run dev
```

Open: http://localhost:5173

## Environment

Create or edit `.env`:

```
VITE_API_BASE_URL=http://localhost:3000
```

This should point to the MFKIN Analyser backend service.

## Backend API Contract (Required)

The UI expects the backend to expose:

- `GET /sectors?available=true`
- `GET /sector/:name`
- `GET /fund/:query`
- `GET /fund/:query/sector`

Key response fields used in UI:

- `rankings.oneYear|threeYear|fiveYear` with `schemeName`, `schemeCode`, `returns`, `metrics`
- `topFunds` for leaders
- `fund` + `sectorRanking` for fund lookup
- `metrics` fields: `aum`, `expenseRatio`, `peRatio`, `pbRatio`, `riskRating`, `fundManager`

## Data Refresh

- The Refresh button calls `POST /sectors/preload` to rebuild server caches and the rankings JSON.
- The backend also refreshes the rankings cache nightly at server-local midnight.

## Data Sources

This frontend does not call data providers directly. All data flows through the backend, which can aggregate MFAPI/AMFI and Kuvera (or other sources).

## Design + UX Notes

- Default view prioritizes sector intelligence and top-performer context.
- Ranking table is intentionally dense and sortable for analyst workflows.
- A data-dense dashboard style: Fira Sans for labels, Fira Code with tabular figures for numbers, blue for data and amber for highlights.
- Every theme's text holds a 4.5:1 contrast on every surface; controls are at least 44 px on touch screens and inputs use 16 px text there, so iOS doesn't zoom in.
- Motion (Framer Motion, plus Magic UI's number ticker and border beam and a Motion Primitives style sliding selection) stops when the system asks to reduce motion.

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - lint
- `npm run lint:fix` - lint and auto-fix
- `npm run format` - format all supported files
- `npm run format:check` - check formatting
- `npm run test` - run tests (watch)
- `npm run test:run` - run tests once
- `npm run test:coverage` - run tests with coverage gates
- `npm run setup:hooks` - enable pre-push quality gate (lint/format/coverage)

## Testing and Coverage

Coverage thresholds are enforced at 100% for lines, branches, functions, and statements.

```bash
npm run test:coverage
```

## Git Hooks (Pre-Push Quality Gate)

A pre-push hook runs `npm run lint`, `npm run format:check`, and `npm run test:coverage`. If any fail (including coverage below 100%), the push is blocked.

Set it up in a fresh clone:

```bash
npm run setup:hooks
```

## Project Structure

```
src/
  app/            # API client + store
  components/     # UI components (ui/ holds the shared primitives)
  features/       # Redux slices
  lib/            # Formatting, sector insights, media queries
  styles/         # Tailwind entry and the three themes
  test/           # Test setup
```

## State Management

- `features/sectors` manages available sectors, active sector, and ranking data.
- `features/funds` handles fund detail lookups and state.
- `features/theme` stores the UI theme choice and visual toggles.

## Deployment

```bash
npm run build
```

Host the `dist/` folder on any static hosting service (Netlify, Vercel, S3, etc.).

## Troubleshooting

- Blank UI: verify backend is running and `VITE_API_BASE_URL` is correct.
- CORS errors: ensure backend allows the frontend origin.
- Slow ranking loads: first request can be heavy; later calls hit cache.

## Contributing

1. Keep coverage at 100% (lines, branches, functions).
2. Run format + lint before pushing.
3. Keep UI consistent with the existing visual language.

## License

MIT License. See `LICENSE` for details.
