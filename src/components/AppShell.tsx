import Link from "next/link";
import type { ReactNode } from "react";

const navigation = [
  ["/", "経営Dashboard"],
  ["/revenue", "料金・収益"],
  ["/course-quality", "コース品質"],
  ["/workforce", "労務・生産性"],
  ["/dx", "DX・CRM"],
  ["/roi", "投資ROI"],
  ["/actions", "アクション管理"],
] as const;

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <span className="brand-block__eyebrow">SAPPORO COUNTRY CLUB</span>
          <strong>2027 経営改革</strong>
          <span>Executive Dashboard</span>
        </div>
        <nav className="side-nav" aria-label="メインナビゲーション">
          {navigation.map(([href, label]) => (
            <Link key={href} href={href} className="side-nav__link">
              {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar__footer">
          <span>データソース</span>
          <strong>統合Excel土台</strong>
        </div>
      </aside>
      <main className="main-panel">{children}</main>
    </div>
  );
}
