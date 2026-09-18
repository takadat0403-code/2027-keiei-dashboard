import { CsvExportButton } from "@/components/CsvExportButton";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusBadge } from "@/components/StatusBadge";
import { actionTiming, sortActionsByUrgency } from "@/lib/dashboard";
import { formatDate } from "@/lib/format";
import type { DashboardData } from "@/lib/types";

export function ActionsDashboard({ data }: { data: DashboardData }) {
  const actions = sortActionsByUrgency(data.actions, data.meta.asOfDate);
  const csvRows = actions.map((item) => [actionTiming(item, data.meta.asOfDate),item.area,item.action,item.owner,item.dueDate,item.priority,item.status,item.progress,item.deliverableKpi,item.dependencies,item.nextAction,item.updatedAt,item.note,item.source]);

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header__copy"><span className="eyebrow">EXECUTION CONTROL</span><h1>アクション管理</h1><p>会議横断の決定事項を、担当・期限・進捗・成果物まで一元管理する。</p></div>
        <div className="page-header__controls"><div className="page-header__meta">基準日 {formatDate(data.meta.asOfDate)}<br />登録 {actions.length}件</div><CsvExportButton filename="アクション管理.csv" headers={["判定","領域","アクション","担当","期限","優先度","状態","進捗","成果物KPI","依存","次アクション","更新日","備考","出典"]} rows={csvRows} /></div>
      </header>
      <section className="section">
        <div className="section__header"><div><h2>優先順一覧</h2><p>遅延 → 7日以内 → 通常、同順位では優先度と期限順</p></div></div>
        <div className="section__body table-wrap">
          <table>
            <thead><tr><th>判定</th><th>領域</th><th>アクション</th><th>担当</th><th>期限</th><th>優先度</th><th>状態</th><th>進捗</th><th>次アクション</th></tr></thead>
            <tbody>{actions.map((item) => { const timing = actionTiming(item, data.meta.asOfDate); return <tr key={item.id}><td><StatusBadge label={timing} /></td><td>{item.area}</td><td><strong>{item.action}</strong><br /><span className="muted">成果物: {item.deliverableKpi}</span></td><td>{item.owner}</td><td>{formatDate(item.dueDate)}</td><td>{item.priority}</td><td><StatusBadge label={item.status} /></td><td style={{ minWidth: 150 }}><ProgressBar value={item.progress} /></td><td>{item.nextAction}</td></tr>; })}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
