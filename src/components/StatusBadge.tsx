interface StatusBadgeProps {
  label: string;
}

export function StatusBadge({ label }: StatusBadgeProps) {
  const tone =
    label === "完了" || label === "達成"
      ? "success"
      : label === "遅延" || label === "未達"
        ? "danger"
        : label === "7日以内" || label === "要確認" || label === "最優先"
          ? "warning"
          : label === "進行中" || label === "基本販売" || label === "割引停止"
            ? "info"
            : "neutral";

  return <span className={`status-badge status-badge--${tone}`}>{label}</span>;
}
