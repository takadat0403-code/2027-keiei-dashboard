"use client";

import { useMemo, useState } from "react";
import dataJson from "@/data/dashboard.json";
import { EmptyState } from "@/components/EmptyState";
import { FilterBar } from "@/components/FilterBar";
import type { DashboardData } from "@/lib/types";

const data = dataJson as DashboardData;

export function WorkforceDashboard() {
  const [facility, setFacility] = useState("all");
  const [month, setMonth] = useState("all");
  const filtered = useMemo(() => data.workforce.filter((row) => {
    if (facility !== "all" && row.facility !== facility) return false;
    if (month !== "all" && row.date) return Number(row.date.slice(5, 7)) === Number(month);
    return month === "all";
  }), [facility, month]);

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header__copy">
          <h1>労務・生産性</h1>
          <p>シフト、人員過不足、残業、打刻修正、有休、処理量を同じ粒度で確認する。</p>
        </div>
        <FilterBar facility={facility} month={month} onFacilityChange={setFacility} onMonthChange={setMonth} />
      </header>

      <div className="callout">
        <strong>将来のジョブカンAPI連携を前提</strong>
        <p>現時点のExcelには実績値が入っていないため、Web版でも0を実績として表示しない。APIまたはCSV連携後に残業・人数差・生産性を自動集計する。</p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="労務実績は未登録です" description="予定人数、実働人数、総労働時間、残業時間、打刻修正件数、処理件数を登録すると、人員過不足と生産性を表示できます。" />
      ) : (
        <section className="section">
          <div className="section__header"><div><h2>労務実績</h2><p>{filtered.length}件</p></div></div>
          <div className="section__body table-wrap">
            <table>
              <thead><tr><th>日付</th><th>施設</th><th>部門</th><th>予定人数</th><th>実働人数</th><th>残業時間</th><th>打刻修正</th><th>処理量</th></tr></thead>
              <tbody>{filtered.map((row, i) => <tr key={`${row.date}-${row.facility}-${row.department}-${i}`}><td>{row.date}</td><td>{row.facility}</td><td>{row.department}</td><td>{row.plannedHeadcount ?? "—"}</td><td>{row.actualHeadcount ?? "—"}</td><td>{row.overtimeHours ?? "—"}</td><td>{row.clockCorrections ?? "—"}</td><td>{row.throughput ?? "—"}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
