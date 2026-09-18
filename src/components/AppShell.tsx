"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <span className="brand-block__eyebrow">SAPPORO COUNTRY CLUB</span>
          <strong>2027 経営改革</strong>
          <span>Executive Dashboard</span>
        </div>
        <nav className="side-nav" aria-label="メインナビゲーション">
          {navigation.map(([href, label]) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`side-nav__link ${active ? "side-nav__link--active" : ""}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar__footer">
          <span>運用モード</span>
          <strong>Phase A / 社内PC</strong>
          <span>データソース: 統合Excel土台</span>
        </div>
      </aside>

      <div className="content-shell">
        <div className="utility-bar no-print">
          <div className="utility-bar__status">
            <span className="utility-dot" />
            <strong>ローカル運用</strong>
            <span>Excel更新後は「update-data.bat」を実行</span>
          </div>
          <div className="utility-bar__actions">
            <button type="button" className="utility-button" onClick={() => window.location.reload()}>
              再読み込み
            </button>
            <button type="button" className="utility-button utility-button--primary" onClick={() => window.print()}>
              印刷
            </button>
          </div>
        </div>
        <main className="main-panel">{children}</main>
      </div>
    </div>
  );
}
