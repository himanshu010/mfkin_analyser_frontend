# MFKIN Analyser Frontend

[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.x-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![MUI](https://img.shields.io/badge/MUI-5.x-007FFF?logo=mui&logoColor=white)](https://mui.com/)
[![Vitest](https://img.shields.io/badge/Vitest-1.x-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Coverage](https://img.shields.io/badge/Coverage-100%25_required-0B6E4F)](#testing-and-coverage)
[![License](https://img.shields.io/badge/License-MIT-222)](#license)

A clean, data-rich dashboard for the MFKIN Analyser backend. Think of it as a market command center: sector insights, fund rankings, and high-signal metrics in one glance. Built for speed, clarity, and a little bit of swagger.

<img width="1063" height="1763" alt="Screenshot 2026-01-11 at 11 46 51 PM" src="https://github.com/user-attachments/assets/7ef9d2b6-bad7-43c8-9208-c5a222518cfd" />

## Highlights

- Sector-first discovery with ranked fund lists and time-window toggles (1Y / 3Y / 5Y)
- Fund spotlight cards with NAV, AUM, PE/PB, expense ratio, risk rating, and return source
- Dense ranking table with sorting, sticky columns, and metadata-rich rows
- Soft gradients, modern typography, and structured spacing for an info-heavy UI
- Strict 100% coverage enforcement on every push

## What You Can Do

- Browse sectors and instantly see the top performers per window
- Drill into a fund and view its sector context + ranking position
- Compare metrics like AUM and valuation ratios at a glance
- Filter and sort in the ranking table without leaving the page

## Quick Start

Prereqs:

- Node.js 18+ (Vite 5 requirement)
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

## Data Sources

This frontend does not call data providers directly. All data flows through the backend, which can aggregate MFAPI/AMFI and Kuvera (or other sources).

## Design + UX Notes

- Default view prioritizes sector intelligence and top-performer context.
- Ranking table is intentionally dense and sortable for analyst workflows.
- Loading UI favors linear progress bars and skeleton strips to match the design language.
- The layout is built for fast scanning: leaders up top, table in the center, metrics on the side.

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
  components/     # UI components
  features/       # Redux slices
  test/           # Test setup
  theme/          # MUI theme
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
