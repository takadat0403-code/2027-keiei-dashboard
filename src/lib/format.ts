export function formatPercent(value: number | null, digits = 0): string {
  if (value === null) return "未入力";
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatCurrency(value: number | null): string {
  if (value === null) return "未設定";
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number | null, suffix = ""): string {
  if (value === null) return "未入力";
  return `${new Intl.NumberFormat("ja-JP").format(value)}${suffix}`;
}

export function formatDate(value: string | null): string {
  if (!value) return "未設定";
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(`${value}T00:00:00+09:00`));
}
