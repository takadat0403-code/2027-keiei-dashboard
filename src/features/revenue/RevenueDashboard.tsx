"use client";

import { useMemo, useState } from "react";
import { CsvExportButton } from "@/components/CsvExportButton";
import { EmptyState } from "@/components/EmptyState";
import { FilterBar } from "@/components/FilterBar";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { DashboardData } from "@/lib/types";

export function RevenueDashboard({ data }: { data: DashboardData }) {
  const [facility, setFacility] = useState("all");
  const [month, setMonth] = useState("all");
  const filtered = useMemo(() => data.revenue.filter((row) =>
    (facility === "all" || row.facility === facility) &&
    (month === "all" || row.month === Number(month))), [data, facility, month]);

  const hasActuals = filtered.some((row) => row.actualRevenue !== null || row.actualPlayers !== null || row.actualAvgPrice !== null);
  const hasBookingInputs = filtered.some((row) => row.capacitySlots !== null && row.bookedSlots !== null);
  const csvRows = filtered.map((row) => [row.year,row.month,row.facility,row.course,row.style,row.dayType,row.timeBand,row.basePrice,row.plannedPrice,row.capacitySlots,row.bookedSlots,row.bookingRate,row.actualPlayers,row.actualAvgPrice,row.actualRevenue,row.priceStage,row.note]);

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header__copy"><span className="eyebrow">REVENUE MANAGEMENT</span><h1>料金・収益</h1><p>月別 × コース × 曜日 × 予約率で、価格と1枠収益を管理する。</p></div>
        <div className="page-header__controls">
          <FilterBar facility={facility} month={month} onFacilityChange={setFacility} onMonthChange={setMonth} />
          <CsvExportButton filename={`料金収益_${facility}_${month}.csv`} headers={["年度","月","施設","コース","スタイル","曜日","時間帯","基本料金","計画販売価格","販売可能枠","予約済枠","予約率","実績人数","実績平均単価","実績売上","価格ステージ","備考"]} rows={csvRows} />
        </div>
      </header>
      <div className="callout"><strong>レベニューマネジメント基準</strong><p>予約率50%未満は割引検討、50〜80%は基本販売、80〜90%は割引停止、90%以上はプレミアム価格検討。会議資料上の例示ロジックを初期値としている。</p></div>
      {!hasActuals || !hasBookingInputs ? <EmptyState title="実績データはまだ登録されていません" description="計画価格は設定済みですが、販売可能枠・予約済枠・実績人数・実績単価は未入力です。入力後に予約率と売上KPIが有効になります。" /> : null}
      <section className="section">
        <div className="section__header"><div><h2>価格・販売枠一覧</h2><p>{filtered.length}行を表示 / CSVは現在の絞り込みを反映</p></div></div>
        <div className="section__body table-wrap">
          <table>
            <thead><tr><th>月</th><th>施設</th><th>コース</th><th>スタイル</th><th>曜日</th><th>時間帯</th><th>基本料金</th><th>計画販売価格</th><th>予約率</th><th>実績平均単価</th><th>価格ステージ</th></tr></thead>
            <tbody>{filtered.map((row) => <tr key={row.id}><td>{row.month}月</td><td>{row.facility}</td><td>{row.course}</td><td>{row.style}</td><td>{row.dayType}</td><td>{row.timeBand}</td><td className="number-cell">{formatCurrency(row.basePrice)}</td><td className="number-cell">{formatCurrency(row.plannedPrice)}</td><td className="number-cell">{formatPercent(row.bookingRate)}</td><td className="number-cell">{row.actualAvgPrice === null ? "未入力" : formatCurrency(row.actualAvgPrice)}</td><td><StatusBadge label={row.priceStage} /></td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
