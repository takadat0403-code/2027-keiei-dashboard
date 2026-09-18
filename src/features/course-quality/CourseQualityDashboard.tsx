"use client";

import { useMemo, useState } from "react";
import dataJson from "@/data/dashboard.json";
import { EmptyState } from "@/components/EmptyState";
import { FilterBar } from "@/components/FilterBar";
import { StatusBadge } from "@/components/StatusBadge";
import type { DashboardData } from "@/lib/types";

const data = dataJson as DashboardData;

const indicators = [
  ["植物", "芝密度、根長、越冬率、病害症状"],
  ["根圏", "有機物量、サッチ厚、透水性、土壌硬度"],
  ["水分・温度", "根圏水分、地温、表面温度、散水均一性"],
  ["作業", "散水時間、薬剤・肥料費、更新作業時間"],
];

export function CourseQualityDashboard() {
  const [facility, setFacility] = useState("all");
  const [month, setMonth] = useState("all");
  const filtered = useMemo(() => data.courseQuality.filter((row) => {
    if (facility !== "all" && row.facility !== facility) return false;
    if (month !== "all" && row.date) {
      return Number(row.date.slice(5, 7)) === Number(month);
    }
    return month === "all";
  }), [facility, month]);

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header__copy">
          <h1>コース品質</h1>
          <p>経験中心の管理から、品種 × 根圏 × 水分 × 温度・風 × データの共通管理へ。</p>
        </div>
        <FilterBar facility={facility} month={month} onFacilityChange={setFacility} onMonthChange={setMonth} />
      </header>

      <section className="section">
        <div className="section__header"><div><h2>3コース共通指標</h2><p>2026年秋から現状データ取得を開始する前提</p></div></div>
        <div className="section__body three-col">
          {indicators.map(([title, description]) => (
            <article className="list-card" key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <EmptyState
          title="コース品質の実測値は未登録です"
          description="芝密度、根長、サッチ厚、根圏水分、地温、病害症状等の共通KPIを3コースで測定し始めると、この画面に弱点グリーンと推移を表示できます。"
        />
      ) : (
        <section className="section">
          <div className="section__header"><div><h2>測定結果</h2><p>{filtered.length}件</p></div></div>
          <div className="section__body table-wrap">
            <table>
              <thead><tr><th>日付</th><th>施設</th><th>コース</th><th>グリーン</th><th>芝密度</th><th>根長</th><th>根圏水分</th><th>病害</th><th>判定</th></tr></thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr key={`${row.date}-${row.facility}-${row.green}-${i}`}>
                    <td>{row.date}</td><td>{row.facility}</td><td>{row.course}</td><td>{row.green}</td>
                    <td>{row.turfDensity ?? "—"}</td><td>{row.rootLengthMm ?? "—"}</td><td>{row.rootZoneMoisturePct ?? "—"}</td><td>{row.diseaseScore ?? "—"}</td>
                    <td>{row.weaknessFlag ? <StatusBadge label={row.weaknessFlag} /> : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
