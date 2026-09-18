import type {
  ActionItem,
  BookingThresholds,
  DashboardData,
  OverviewMetrics,
  RevenueRow,
} from "./types";

export type ActionTiming = "完了" | "遅延" | "7日以内" | "正常" | "期限未設定";

const parseDate = (value: string): Date => new Date(`${value}T00:00:00+09:00`);

export function actionTiming(action: ActionItem, asOfDate: string): ActionTiming {
  if (action.status === "完了") return "完了";
  if (!action.dueDate) return "期限未設定";

  const due = parseDate(action.dueDate).getTime();
  const asOf = parseDate(asOfDate).getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const days = Math.ceil((due - asOf) / oneDay);

  if (days < 0) return "遅延";
  if (days <= 7) return "7日以内";
  return "正常";
}

export function priceStage(
  bookingRate: number | null,
  thresholds: BookingThresholds,
): string {
  if (bookingRate === null) return "未入力";
  if (bookingRate < thresholds.discountBelow) return "割引検討";
  if (bookingRate < thresholds.standardBelow) return "基本販売";
  if (bookingRate < thresholds.premiumFrom) return "割引停止";
  return "プレミアム価格検討";
}

export function hasRevenueActuals(rows: RevenueRow[]): boolean {
  return rows.some((row) => row.actualRevenue !== null || row.actualPlayers !== null || row.actualAvgPrice !== null);
}

export function calculateOverview(data: DashboardData): OverviewMetrics {
  const plannedRevenueValues = data.revenue
    .map((row) => row.plannedRevenue)
    .filter((value): value is number => value !== null);
  const actualRevenueValues = data.revenue
    .map((row) => row.actualRevenue)
    .filter((value): value is number => value !== null);

  const revenueAchievement =
    plannedRevenueValues.length > 0 && actualRevenueValues.length > 0
      ? actualRevenueValues.reduce((sum, value) => sum + value, 0) /
        plannedRevenueValues.reduce((sum, value) => sum + value, 0)
      : null;

  const capacity = data.revenue
    .map((row) => row.capacitySlots)
    .filter((value): value is number => value !== null)
    .reduce((sum, value) => sum + value, 0);
  const booked = data.revenue
    .map((row) => row.bookedSlots)
    .filter((value): value is number => value !== null)
    .reduce((sum, value) => sum + value, 0);
  const hasBookingInputs = data.revenue.some(
    (row) => row.capacitySlots !== null && row.bookedSlots !== null,
  );
  const weightedBookingRate = hasBookingInputs && capacity > 0 ? booked / capacity : null;

  const actualPlayers = data.revenue
    .map((row) => row.actualPlayers)
    .filter((value): value is number => value !== null)
    .reduce((sum, value) => sum + value, 0);
  const actualRevenue = actualRevenueValues.reduce((sum, value) => sum + value, 0);
  const actualAvgPrice = actualPlayers > 0 ? actualRevenue / actualPlayers : null;

  const weakGreenCount =
    data.courseQuality.length > 0
      ? data.courseQuality.filter((row) => row.weaknessFlag === "要注意").length
      : null;

  const overtimeValues = data.workforce
    .map((row) => row.overtimeHours)
    .filter((value): value is number => value !== null);
  const overtimeHours =
    data.workforce.length > 0 && overtimeValues.length > 0
      ? overtimeValues.reduce((sum, value) => sum + value, 0)
      : null;

  const dxProgress =
    data.dx.length > 0
      ? data.dx.reduce((sum, item) => sum + item.progress, 0) / data.dx.length
      : null;

  const overdueActions = data.actions.filter(
    (action) => actionTiming(action, data.meta.asOfDate) === "遅延",
  ).length;

  const actionCompletionRate =
    data.actions.length > 0
      ? data.actions.filter((action) => action.status === "完了").length / data.actions.length
      : null;

  return {
    revenueAchievement,
    weightedBookingRate,
    actualAvgPrice,
    weakGreenCount,
    overtimeHours,
    dxProgress,
    overdueActions,
    actionCompletionRate,
  };
}

export function sortActionsByUrgency(actions: ActionItem[], asOfDate: string): ActionItem[] {
  const timingRank: Record<ActionTiming, number> = {
    遅延: 0,
    "7日以内": 1,
    正常: 2,
    期限未設定: 3,
    完了: 4,
  };
  const priorityRank: Record<string, number> = {
    最優先: 0,
    高: 1,
    中: 2,
    低: 3,
  };

  return [...actions].sort((a, b) => {
    const timingDiff = timingRank[actionTiming(a, asOfDate)] - timingRank[actionTiming(b, asOfDate)];
    if (timingDiff !== 0) return timingDiff;
    const priorityDiff = (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9);
    if (priorityDiff !== 0) return priorityDiff;
    return (a.dueDate ?? "9999-12-31").localeCompare(b.dueDate ?? "9999-12-31");
  });
}
