# Operational Dashboard A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a Windows-PC operational version of the executive dashboard with source readiness/freshness, actionable hierarchy, CSV/print support, and a repository boundary for later B/C migration.

**Architecture:** Route pages load DashboardData through a repository interface. Client feature views receive snapshots as props. Domain derivations remain pure functions with tests. Local Windows scripts handle install/build/update without introducing a database.

**Tech Stack:** Next.js 15, React 19, TypeScript 5.8, Vitest, Python/openpyxl, Windows batch.

**Spec:** docs/superpowers/specs/2026-09-18-operational-dashboard-a-design.md

## Global Constraints

- Never invent operational actuals; null stays null and is rendered as 未入力/未設定.
- Takino pricing remains undecided until source data changes.
- Phase A is browser read-only and workbook-driven.
- No database, auth provider, or external chart dependency in this phase.
- CI must pass npm test, npm run typecheck, npm run build.

---

### Task 1: Repository boundary and domain readiness

**Files:**
- Create: `src/data/repository.ts`
- Modify: `src/lib/dashboard.ts`
- Modify: `src/lib/types.ts`
- Modify: `tests/dashboard-logic.test.ts`

**Interfaces:**
- Produces: `DashboardRepository.getSnapshot(): Promise<DashboardData>`
- Produces: `getDataReadiness(data): DataReadinessSummary`
- Produces: `getFreshness(data): FreshnessSummary`
- Produces: `getFacilitySummaries(data): FacilitySummary[]`

- [ ] Add failing tests asserting seven readiness domains, freshness band boundaries, and the three facility summaries.
- [ ] Add types for readiness, freshness, and facility summary.
- [ ] Implement pure calculations and StaticDashboardRepository.
- [ ] Run npm test and confirm all tests pass.
- [ ] Run npm run typecheck.

### Task 2: Move pages to repository-backed snapshots

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/revenue/page.tsx`
- Modify: `src/app/course-quality/page.tsx`
- Modify: `src/app/workforce/page.tsx`
- Modify: `src/app/dx/page.tsx`
- Modify: `src/app/roi/page.tsx`
- Modify: `src/app/actions/page.tsx`
- Modify: feature dashboard components under `src/features/**`

**Interfaces:**
- Consumes: `dashboardRepository.getSnapshot()`
- Produces: feature components accepting `data: DashboardData`

- [ ] Remove direct JSON imports from feature components.
- [ ] Make route pages async and pass repository snapshots.
- [ ] Keep current filtering behavior in client components.
- [ ] Run npm run typecheck.

### Task 3: Executive opening hierarchy

**Files:**
- Create: `src/components/DataHealth.tsx`
- Create: `src/components/FacilitySummaryCard.tsx`
- Modify: `src/features/overview/OverviewDashboard.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: readiness/freshness/facility summaries from Task 1.
- Produces: attention strip, readiness panel, three-facility comparison.

- [ ] Add top attention panel for overdue/upcoming actions, missing readiness domains, and freshness.
- [ ] Reorder KPI/operations sections per the design.
- [ ] Add three facility summary cards.
- [ ] Tighten spacing/typography for meeting display.
- [ ] Run npm run typecheck and npm run build.

### Task 4: CSV export and print mode

**Files:**
- Create: `src/lib/csv.ts`
- Create: `src/components/CsvExportButton.tsx`
- Modify: `src/features/revenue/RevenueDashboard.tsx`
- Modify: `src/features/actions/ActionsDashboard.tsx`
- Modify: `src/app/globals.css`
- Create: `tests/csv.test.ts`

**Interfaces:**
- Produces: `serializeCsv(headers, rows): string`
- Produces: `CsvExportButton`

- [ ] Add tests for UTF-8 BOM, quote escaping, null-as-blank.
- [ ] Implement CSV serializer and browser download component.
- [ ] Export currently filtered revenue rows and displayed action rows.
- [ ] Add print CSS hiding navigation/controls and removing shadows.
- [ ] Run npm test and npm run build.

### Task 5: Windows operational scripts and documentation

**Files:**
- Create: `start-dashboard.bat`
- Create: `update-data.bat`
- Modify: `README.md`

**Interfaces:**
- Produces: double-click local start and workbook refresh flows.

- [ ] Add prerequisite checks and Japanese error output.
- [ ] Add automatic install/build/start sequence.
- [ ] Add update flow: data:sync -> test -> typecheck -> build.
- [ ] Rewrite README opening section around a 3-step non-developer quick start.
- [ ] Verify batch syntax by inspection and CI verify application commands.

### Task 6: Final verification

**Files:** no functional changes unless verification finds a defect.

- [ ] Run npm test.
- [ ] Run npm run typecheck.
- [ ] Run npm run build.
- [ ] Inspect GitHub Actions job result for the feature branch and confirm every verification step is green.
