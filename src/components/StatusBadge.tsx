interface StatusBadgeProps {
  label: string;
}

export function StatusBadge({ label }: StatusBadgeProps) {
  const tone =
    label === "完了" || label === "達成" || label === "最新" || label === "料金設定済み" || label === "準備済み"
      ? "success"
      : label === "遅延" || label === "未達" || label === "更新推奨"
        ? "danger"
        : label === "7日以内" || label === "要確認" || label === "最優先" || label === "料金未設定あり" || label === "未入力"
          ? "warning"
          : label === "進行中" || label === "基本販売" || label === "割引停止"
            ? "info"
            : "neutral";

  return <span className={`status-badge status-badge--${tone}`}>{label}</span>;
}
