import { ProgressBar } from "@/components/ProgressBar";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, formatPercent } from "@/lib/format";
import type { DashboardData } from "@/lib/types";

export function DxDashboard({ data }: { data: DashboardData }) {
  const average = data.dx.length ? data.dx.reduce((sum, x) => sum + x.progress, 0) / data.dx.length : 0;
  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header__copy"><h1>DX・CRM</h1><p>経営戦略を回す「管理OS」として、施策の担当・進捗・次アクション・リスクを管理する。</p></div>
        <div className="page-header__meta">平均進捗 {formatPercent(average)}</div>
      </header>

      <section className="section">
        <div className="section__header"><div><h2>DX施策一覧</h2><p>{data.dx.length}施策</p></div></div>
        <div className="section__body card-list">
          {data.dx.map((item) => (
            <article className="list-card" key={item.id}>
              <div className="list-card__top">
                <div><h3>{item.initiative}</h3><p>{item.purpose}</p></div>
                <StatusBadge label={item.status} />
              </div>
              <ProgressBar value={item.progress} />
              <div className="list-card__meta">
                <span>カテゴリ: {item.category}</span><span>担当: {item.owner}</span><span>優先度: {item.priority}</span><span>期限: {formatDate(item.dueDate)}</span>
              </div>
              <div className="two-col">
                <div><p><strong>次アクション</strong><br />{item.nextAction}</p></div>
                <div><p><strong>課題・リスク</strong><br />{item.risk}</p></div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
