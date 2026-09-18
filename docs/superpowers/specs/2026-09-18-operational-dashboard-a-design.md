# 2026-09-18 Operational Dashboard A Design

## Goal

Turn the existing source-backed prototype into a Windows-PC operational dashboard that can be used immediately in management meetings, while preserving a clean migration path to B (hosted read-only web) and C (authenticated database-backed editing).

## Operating model

Phase A remains read-only in the browser. The source workbook remains the editable source of truth. A Windows operator updates the workbook, runs the data refresh command, and opens the dashboard locally. Unsupported values stay null and are rendered as 未入力/未設定.

Phase B will replace only the repository adapter and deployment/authentication layer. Phase C will replace the repository adapter with a database implementation and add edit workflows. Page and domain components must not depend directly on JSON imports.

## Architecture

- Add a DashboardRepository interface that returns a DashboardData snapshot.
- Phase A uses StaticDashboardRepository backed by src/data/dashboard.json.
- Server route pages load the snapshot and pass it into client feature components when filtering/export is required.
- Domain calculations stay in src/lib/dashboard.ts.
- Data readiness/freshness are derived values; they do not alter source observations.
- No database, authentication, or external API is introduced in Phase A.

## Default executive view

The opening view must answer, in this order:

1. 今日確認すべきこと: overdue/upcoming actions, critical missing inputs, stale-data warning.
2. 経営KPI: supported current values only.
3. 3コース状況: facility pricing/position and data readiness without inventing performance values.
4. 2027料金戦略: agreed base pricing and booking-rate rules.
5. DX / investment priorities.
6. Execution queue.

KPI cards are reserved for top-line metrics. Operational details remain in tables or action queues.

## Data readiness

The dashboard reports seven readiness domains:

- 予約枠: at least one revenue row has capacitySlots and bookedSlots.
- 売上実績: at least one revenue row has actualRevenue or actualPlayers/actualAvgPrice.
- コース品質: courseQuality has at least one row.
- 労務実績: workforce has at least one row.
- 料金確定: every price position has weekdayPrice and weekendPrice.
- 投資額: every 最優先/high-priority investment has estimatedCost.
- 責任者確定: no action/DX owner contains 要調整.

Readiness is informational. A missing domain is not converted to zero.

## Freshness

Use meta.sourceUpdatedAt as the source snapshot date. Compare it with meta.asOfDate.

- 0-3 days: 最新
- 4-7 days: 要確認
- 8+ days: 更新推奨

This is a snapshot freshness indicator, not a statement about real-world freshness beyond the file.

## Facility summary

Show 真駒内CC, 滝のCC, 羊ヶ丘CC side-by-side. Each card shows:
- pricing positions from source data,
- count of unset price values,
- count of revenue rows with booking inputs,
- notional availability of actual metrics as データあり/未入力.

No unsupported rank or performance comparison is shown.

## Windows operation

Add:
- start-dashboard.bat: verify Node/npm, install dependencies when missing, build when needed, launch http://localhost:3000, start production server.
- update-data.bat: verify Python/workbook, install Python requirement if needed, run data:sync, tests, typecheck, build; stop with a Japanese message on failure.
- README quick-start for non-developers.

## Export and printing

- Revenue and action tables get CSV export using the currently displayed rows.
- CSV must include UTF-8 BOM so it opens cleanly in Excel on Windows.
- Add print styles: hide sidebar/controls, remove shadows, keep readable page breaks.

## UI

Keep the white + deep green visual identity, but improve information hierarchy:
- sticky top utility bar inside content,
- active navigation state,
- clear readiness/freshness chips,
- attention panel above KPIs,
- denser but readable management-meeting layout,
- mobile/tablet remains usable.

## Error handling

- Local batch files stop on missing prerequisites or failed commands and display actionable Japanese text.
- Browser components never coerce missing values to zero.
- CSV export handles null as blank.

## Verification

Required CI:
- npm test
- npm run typecheck
- npm run build

Add unit tests for readiness, freshness, facility summaries, and CSV serialization.
