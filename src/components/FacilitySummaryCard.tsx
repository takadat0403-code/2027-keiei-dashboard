import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency } from "@/lib/format";
import type { FacilitySummary } from "@/lib/types";

export function FacilitySummaryCard({ summary }: { summary: FacilitySummary }) {
  return (
    <article className="facility-card">
      <div className="facility-card__header">
        <div>
          <span className="eyebrow">FACILITY</span>
          <h3>{summary.facility}</h3>
        </div>
        <StatusBadge label={summary.unsetPriceCount === 0 ? "料金設定済み" : "料金未設定あり"} />
      </div>

      <div className="facility-card__status-grid">
        <div>
          <span>予約入力</span>
          <strong>{summary.bookingInputRows}/{summary.revenueRows}</strong>
        </div>
        <div>
          <span>実績データ</span>
          <strong>{summary.hasActuals ? "データあり" : "未入力"}</strong>
        </div>
        <div>
          <span>未設定料金</span>
          <strong>{summary.unsetPriceCount}件</strong>
        </div>
      </div>

      <div className="facility-card__prices">
        {summary.pricePositions.map((position) => (
          <div className="facility-price-row" key={`${position.facility}-${position.course}`}>
            <div>
              <strong>{position.course}</strong>
              <span>{position.positioning} / {position.style}</span>
            </div>
            <div>
              <span>平日 {formatCurrency(position.weekdayPrice)}</span>
              <span>土日祝 {formatCurrency(position.weekendPrice)}</span>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
