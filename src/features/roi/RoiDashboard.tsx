import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { DashboardData } from "@/lib/types";

function ImpactScore({ label, value }: { label: string; value: number }) {
  return <div className="score-row"><span>{label}</span><div className="score-track"><div className="score-fill" style={{ width: `${value * 20}%` }} /></div><strong>{value}/5</strong></div>;
}

export function RoiDashboard({ data }: { data: DashboardData }) {
  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header__copy"><h1>投資ROI</h1><p>設備投資を「欲しい物リスト」にせず、費用・省人化・品質・BCPで比較する。</p></div>
        <div className="page-header__meta">登録案件 {data.investments.length}件</div>
      </header>

      <section className="section">
        <div className="section__header"><div><h2>投資案件</h2><p>金額・効果が未入力の案件は未設定として維持</p></div></div>
        <div className="section__body card-list">
          {data.investments.map((item) => (
            <article className="list-card" key={item.id}>
              <div className="list-card__top"><div><h3>{item.project}</h3><p>{item.purpose}</p></div><StatusBadge label={item.priority} /></div>
              <div className="three-col">
                <div className="price-card"><div className="price-card__sub">概算投資額</div><strong>{formatCurrency(item.estimatedCost)}</strong></div>
                <div className="price-card"><div className="price-card__sub">年間削減工数</div><strong>{item.savedHours === null ? "未設定" : formatNumber(item.savedHours, "h")}</strong></div>
                <div className="price-card"><div className="price-card__sub">単純回収年</div><strong>{item.paybackYears === null ? "未設定" : `${item.paybackYears.toFixed(1)}年`}</strong></div>
              </div>
              <ImpactScore label="品質効果" value={item.qualityImpact} />
              <ImpactScore label="BCP効果" value={item.bcpImpact} />
              <p>{item.note ?? "—"}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
