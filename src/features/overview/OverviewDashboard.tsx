import { DataHealth } from "@/components/DataHealth";
import { FacilitySummaryCard } from "@/components/FacilitySummaryCard";
import { KpiCard } from "@/components/KpiCard";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusBadge } from "@/components/StatusBadge";
import {
  actionTiming,
  calculateOverview,
  getDataReadiness,
  getFacilitySummaries,
  getFreshness,
  sortActionsByUrgency,
} from "@/lib/dashboard";
import { formatCurrency, formatDate, formatNumber, formatPercent } from "@/lib/format";
import type { DashboardData } from "@/lib/types";

export function OverviewDashboard({ data }: { data: DashboardData }) {
  const metrics = calculateOverview(data);
  const readiness = getDataReadiness(data);
  const freshness = getFreshness(data);
  const facilities = getFacilitySummaries(data);
  const urgentActions = sortActionsByUrgency(data.actions, data.meta.asOfDate).slice(0, 6);
  const overdueCount = data.actions.filter(
    (action) => actionTiming(action, data.meta.asOfDate) === "遅延",
  ).length;
  const upcomingCount = data.actions.filter(
    (action) => actionTiming(action, data.meta.asOfDate) === "7日以内",
  ).length;

  return (
    <div className="page executive-page">
      <header className="page-header">
        <div className="page-header__copy">
          <span className="eyebrow">EXECUTIVE CONTROL</span>
          <h1>経営Dashboard</h1>
          <p>経営会議で先に確認すべき異常・未入力・期限接近を上段に集約。</p>
        </div>
        <div className="page-header__meta">
          データ基準日 {formatDate(data.meta.asOfDate)}<br />
          更新日 {formatDate(data.meta.sourceUpdatedAt)}<br />
          対象年度 {data.meta.targetYear}年度
        </div>
      </header>

      <section className="attention-panel" aria-label="今日確認すべきこと">
        <div className="attention-panel__lead">
          <span className="eyebrow">TODAY&apos;S ATTENTION</span>
          <h2>今日確認すべきこと</h2>
          <p>赤・橙・未入力を先に処理し、その後にKPIを見る運用です。</p>
        </div>
        <div className="attention-metrics">
          <div className={overdueCount > 0 ? "attention-metric attention-metric--danger" : "attention-metric"}>
            <span>期限超過</span><strong>{overdueCount}</strong><small>件</small>
          </div>
          <div className={upcomingCount > 0 ? "attention-metric attention-metric--warning" : "attention-metric"}>
            <span>7日以内</span><strong>{upcomingCount}</strong><small>件</small>
          </div>
          <div className={readiness.missingCount > 0 ? "attention-metric attention-metric--warning" : "attention-metric"}>
            <span>未入力領域</span><strong>{readiness.missingCount}</strong><small>/ {readiness.totalCount}</small>
          </div>
          <div className="attention-metric">
            <span>データ鮮度</span><strong className="attention-text-value">{freshness.level}</strong><small>{freshness.daysOld}日</small>
          </div>
        </div>
      </section>

      <DataHealth readiness={readiness} freshness={freshness} />

      <section className="kpi-grid" aria-label="主要KPI">
        <KpiCard label="売上計画達成率" value={formatPercent(metrics.revenueAchievement)} note={metrics.revenueAchievement === null ? "実績売上・計画売上が未入力" : "実績売上 ÷ 計画売上"} />
        <KpiCard label="加重平均予約率" value={formatPercent(metrics.weightedBookingRate)} note={metrics.weightedBookingRate === null ? "販売可能枠・予約済枠が未入力" : "予約済枠 ÷ 販売可能枠"} />
        <KpiCard label="実績平均客単価" value={metrics.actualAvgPrice === null ? "未入力" : formatCurrency(metrics.actualAvgPrice)} note="実績売上 ÷ 実績人数" />
        <KpiCard label="DX平均進捗率" value={formatPercent(metrics.dxProgress)} note={`${data.dx.length}施策を登録済み`} />
        <KpiCard label="要注意グリーン" value={metrics.weakGreenCount === null ? "未入力" : formatNumber(metrics.weakGreenCount, "件")} note="3コース共通測定値から判定" />
        <KpiCard label="残業時間合計" value={metrics.overtimeHours === null ? "未入力" : formatNumber(metrics.overtimeHours, "h")} note="ジョブカン連携前はExcel入力" />
        <KpiCard label="遅延件数" value={formatNumber(metrics.overdueActions, "件")} note={`基準日 ${formatDate(data.meta.asOfDate)} 時点`} tone={metrics.overdueActions > 0 ? "danger" : "success"} />
        <KpiCard label="アクション完了率" value={formatPercent(metrics.actionCompletionRate)} note={`${data.actions.length}件を一元管理`} tone={metrics.actionCompletionRate === 1 ? "success" : "default"} />
      </section>

      <section className="section">
        <div className="section__header"><div><h2>3コース状況</h2><p>優劣のランキングではなく、料金設定とデータ準備状況を並列比較</p></div></div>
        <div className="section__body facility-grid">
          {facilities.map((summary) => <FacilitySummaryCard key={summary.facility} summary={summary} />)}
        </div>
      </section>

      <div className="two-col">
        <section className="section">
          <div className="section__header"><div><h2>要対応アクション</h2><p>遅延・期限接近・優先度の順</p></div></div>
          <div className="section__body card-list">
            {urgentActions.map((action) => {
              const timing = actionTiming(action, data.meta.asOfDate);
              return (
                <article className="list-card" key={action.id}>
                  <div className="list-card__top"><div><h3>{action.action}</h3><p>{action.nextAction}</p></div><StatusBadge label={timing} /></div>
                  <div className="list-card__meta"><span>担当: {action.owner}</span><span>期限: {formatDate(action.dueDate)}</span><span>優先度: {action.priority}</span><span>領域: {action.area}</span></div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section">
          <div className="section__header"><div><h2>DX実装状況</h2><p>経営管理基盤の実装進捗</p></div><strong>{formatPercent(metrics.dxProgress)}</strong></div>
          <div className="section__body card-list">
            {data.dx.map((item) => (
              <article className="list-card" key={item.id}>
                <div className="list-card__top"><div><h3>{item.initiative}</h3><p>{item.nextAction}</p></div><StatusBadge label={item.status} /></div>
                <ProgressBar value={item.progress} />
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="section">
        <div className="section__header"><div><h2>2027料金戦略</h2><p>会議時点の基準価格。未決定値は未設定のまま表示。</p></div></div>
        <div className="section__body price-position-grid">
          {data.prices.map((item) => (
            <article className="price-card" key={`${item.facility}-${item.course}`}>
              <div className="price-card__head"><div><strong>{item.facility} / {item.course}</strong><div className="price-card__sub">{item.style}</div></div><StatusBadge label={item.positioning} /></div>
              <div className="price-grid"><div><span>平日基準</span><strong>{formatCurrency(item.weekdayPrice)}</strong></div><div><span>土日祝基準</span><strong>{formatCurrency(item.weekendPrice)}</strong></div></div>
              {item.note ? <p className="muted">{item.note}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__header"><div><h2>設備投資・ROI優先案件</h2><p>費用、省人化、品質、BCPを同じ画面で確認</p></div></div>
        <div className="section__body table-wrap">
          <table>
            <thead><tr><th>案件</th><th>分類</th><th>優先度</th><th>概算投資額</th><th>品質効果</th><th>BCP効果</th><th>備考</th></tr></thead>
            <tbody>{data.investments.map((item) => (
              <tr key={item.id}><td><strong>{item.project}</strong><br /><span className="muted">{item.purpose}</span></td><td>{item.category}</td><td><StatusBadge label={item.priority} /></td><td className="number-cell">{formatCurrency(item.estimatedCost)}</td><td className="number-cell">{item.qualityImpact}/5</td><td className="number-cell">{item.bcpImpact}/5</td><td>{item.note ?? "—"}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
