# Repository working rules

## Purpose

This repository is the 2027 executive management dashboard for Sapporo Country Club. It converts the approved Excel foundation into a read-only web dashboard.

## Data safety rules

- Do not invent operational actuals, prices, costs, booking rates, course measurements, or workforce values.
- `null` is intentional when the source workbook has no supported value. Render it as `未入力` or `未設定`, not `0`.
- Takino CC base pricing is undecided in the source and must remain undecided until the source workbook is changed.
- The source of truth for the initial schema is `data/source/2027年度_経営改革ダッシュボード_土台.xlsx`.
- After changing the source workbook, run `npm run data:sync` and commit the generated `src/data/dashboard.json`.

## Architecture rules

- Keep business calculations in `src/lib/dashboard.ts`, not inside page markup.
- Keep pages thin; reusable UI belongs in `src/components` and domain views in `src/features`.
- Keep external integrations behind adapters that produce the existing `DashboardData` contract.
- Do not add chart libraries unless a visual requirement cannot be met with native HTML/CSS/SVG.

## Required checks

Before merging:

```bash
npm run data:sync
npm test
npm run typecheck
npm run build
```
