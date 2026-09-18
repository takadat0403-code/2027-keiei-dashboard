import dataJson from "@/data/dashboard.json";
import { KpiCard } from "@/components/KpiCard";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusBadge } from "@/components/StatusBadge";
import { actionTiming, calculateOverview, sortActionsByUrgency } from "@/lib/dashboard";
import { formatCurrency, formatDate, formatNumber, formatPercent } from "@/lib/format";
import type { DashboardData } from "@/lib/types";

const data = dataJson as DashboardData;

export function OverviewDashboard() {
  const metrics = calculateOverview(data);
  const urgentActions = sortActionsByUrgency(data.actions, data.meta.asOfDate).slice(0, 6);
  const dxAverage = metrics.dxProgress ?? 0;

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header__copy">
          <h1>経営Dashboard</h1>
          <p>価格・CS・収益を一体で管理し、重要な遅延と未入力を先に把握する。</p>
        </div>
        <div className="page-header__meta">
          データ基準日 {formatDate(data.meta.asOfDate)}<br />
          対象年度 {data.meta.targetYear}年度
        </div>
      </header>

      <section className="kpi-grid" aria-label="主要KPI">
        <KpiCard
          label="売上計画達成率"
          value={formatPercent(metrics.revenueAchievement)}
          note={metrics.revenueAchievement === null ? "実績売上・計画人数が未入力" : "実績売上 ÷ 計画売上"}
        />
        <KpiCard
          label="加重平均予約率"
          value={formatPercent(metrics.weightedBookingRate)}
          note={metrics.weightedBookingRate === null ? "販売可能枠・予約済枠が未入力" : "予約済枠 ÷ 販売可能枠"}
        />
        <KpiCard
          label="実績平均客単価"
          value={metrics.actualAvgPrice === null ? "未入力" : formatCurrency(metrics.actualAvgPrice)}
          note="実績売上 ÷ 実績人数"
        />
        <KpiCard
          label="要注意グリーン"
          value={metrics.weakGreenCount === null ? "未入力" : formatNumber(metrics.weakGreenCount, "件")}
          note="2026年秋から3コース共通計測を開始する前提"
        />
        <KpiCard
          label="残業時間合計"
          value={metrics.overtimeHours === null ? "未入力" : formatNumber(metrics.overtimeHours, "h")}
          note="ジョブカン連携前のため実績未登録"
        />
        <KpiCard
          label="DX平均進捗率"
          value={formatPercent(metrics.dxProgress)}
          note={`${data.dx.length}施策を登録済み`}
        />
        <KpiCard
          label="遅延件数"
          value={formatNumber(metrics.overdueActions, "件")}
          note={`基準日 ${formatDate(data.meta.asOfDate)} 時点`}
          tone={metrics.overdueActions > 0 ? "danger" : "success"}
        />
        <KpiCard
          label="アクション完了率"
          value={formatPercent(metrics.actionCompletionRate)}
          note={`${data.actions.length}件を一元管理`}
          tone={metrics.actionCompletionRate === 1 ? "success" : "default"}
        />
      </section>

      <div className="two-col">
        <section className="section">
          <div className="section__header">
            <div>
              <h2>要対応アクション</h2>
              <p>遅延・期限接近・優先度の順で表示</p>
            </div>
          </div>
          <div className="section__body card-list">
            {urgentActions.map((action) => {
              const timing = actionTiming(action, data.meta.asOfDate);
              return (
                <article className="list-card" key={action.id}>
                  <div className="list-card__top">
                    <div>
                      <h3>{action.action}</h3>
                      <p>{action.nextAction}</p>
                    </div>
                    <StatusBadge label={timing} />
                  </div>
                  <div className="list-card__meta">
                    <span>担当: {action.owner}</span>
                    <span>期限: {formatDate(action.dueDate)}</span>
                    <span>優先度: {action.priority}</span>
                    <span>領域: {action.area}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section">
          <div className="section__header">
            <div>
              <h2>DX実装状況</h2>
              <p>料金戦略・人員配置・営業・CSを支える管理基盤</p>
            </div>
            <strong>{formatPercent(dxAverage)}</strong>
          </div>
          <div className="section__body card-list">
            {data.dx.map((item) => (
              <article className="list-card" key={item.id}>
                <div className="list-card__top">
                  <div>
                    <h3>{item.initiative}</h3>
                    <p>{item.nextAction}</p>
                  </div>
                  <StatusBadge label={item.status} />
                </div>
                <ProgressBar value={item.progress} />
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="section">
        <div className="section__header">
          <div>
            <h2>コース別ポジショニングと基準価格</h2>
            <p>料金会議で示された会議時点の基準。未決定値は未設定のまま表示。</p>
          </div>
        </div>
        <div className="section__body three-col">
          {data.prices.map((item) => (
            <article className="price-card" key={`${item.facility}-${item.course}`}>
              <div className="price-card__head">
                <div>
                  <strong>{item.facility} / {item.course}</strong>
                  <div className="price-card__sub">{item.style}</div>
                </div>
                <StatusBadge label={item.positioning} />
              </div>
              <div className="price-grid">
                <div><span>平日基準</span><strong>{formatCurrency(item.weekdayPrice)}</strong></div>
                <div><span>土日祝基準</span><strong>{formatCurrency(item.weekendPrice)}</strong></div>
              </div>
              {item.note ? <p className="muted">{item.note}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <div>
            <h2>設備投資・ROI優先案件</h2>
            <p>概算費用だけでなく、品質・BCP・省人化で比較する。</p>
          </div>
        </div>
        <div className="section__body table-wrap">
          <table>
            <thead>
              <tr>
                <th>案件</th>
                <th>分類</th>
                <th>優先度</th>
                <th>概算投資額</th>
                <th>品質効果</th>
                <th>BCP効果</th>
                <th>備考</th>
              </tr>
            </thead>
            <tbody>
              {data.investments.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.project}</strong><br /><span className="muted">{item.purpose}</span></td>
                  <td>{item.category}</td>
                  <td><StatusBadge label={item.priority} /></td>
                  <td className="number-cell">{formatCurrency(item.estimatedCost)}</td>
                  <td className="number-cell">{item.qualityImpact}/5</td>
                  <td className="number-cell">{item.bcpImpact}/5</td>
                  <td>{item.note ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
