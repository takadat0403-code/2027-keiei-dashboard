import type { ReactNode } from "react";

interface KpiCardProps {
  label: string;
  value: ReactNode;
  note?: string;
  tone?: "default" | "warning" | "danger" | "success";
}

export function KpiCard({ label, value, note, tone = "default" }: KpiCardProps) {
  return (
    <article className={`kpi-card kpi-card--${tone}`}>
      <p className="kpi-card__label">{label}</p>
      <div className="kpi-card__value">{value}</div>
      {note ? <p className="kpi-card__note">{note}</p> : null}
    </article>
  );
}
