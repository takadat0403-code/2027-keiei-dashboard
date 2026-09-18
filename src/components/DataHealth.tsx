import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/format";
import type { DataReadinessSummary, FreshnessSummary } from "@/lib/types";

interface DataHealthProps {
  readiness: DataReadinessSummary;
  freshness: FreshnessSummary;
}

export function DataHealth({ readiness, freshness }: DataHealthProps) {
  return (
    <section className="section data-health">
      <div className="section__header">
        <div>
          <h2>データ準備状況</h2>
          <p>未入力は0として扱わず、運用開始に必要な入力領域を明示</p>
        </div>
        <div className="data-health__summary">
          <strong>{readiness.readyCount}/{readiness.totalCount}</strong>
          <span>入力準備済み</span>
        </div>
      </div>
      <div className="section__body">
        <div className="freshness-row">
          <div>
            <span className="eyebrow">データ鮮度</span>
            <div className="freshness-row__value">
              <StatusBadge label={freshness.level} />
              <strong>{formatDate(freshness.sourceUpdatedAt)}</strong>
              <span>{freshness.daysOld}日経過</span>
            </div>
          </div>
          <p>{freshness.message}</p>
        </div>
        <div className="readiness-grid">
          {readiness.domains.map((domain) => (
            <Link
              href={domain.href}
              key={domain.key}
              className={`readiness-item ${domain.ready ? "readiness-item--ready" : "readiness-item--missing"}`}
            >
              <div className="readiness-item__top">
                <strong>{domain.label}</strong>
                <span>{domain.ready ? "準備済み" : "未入力"}</span>
              </div>
              <p>{domain.detail}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
