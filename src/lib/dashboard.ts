import type {
  ActionItem,
  BookingThresholds,
  DashboardData,
  DataReadinessSummary,
  FacilitySummary,
  FreshnessSummary,
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
  return rows.some(
    (row) =>
      row.actualRevenue !== null ||
      row.actualPlayers !== null ||
      row.actualAvgPrice !== null,
  );
}

export function getDataReadiness(data: DashboardData): DataReadinessSummary {
  const bookingReady = data.revenue.some(
    (row) => row.capacitySlots !== null && row.bookedSlots !== null,
  );
  const revenueReady = hasRevenueActuals(data.revenue);
  const courseReady = data.courseQuality.length > 0;
  const workforceReady = data.workforce.length > 0;
  const pricingReady = data.prices.every(
    (row) => row.weekdayPrice !== null && row.weekendPrice !== null,
  );
  const priorityInvestments = data.investments.filter(
    (item) => item.priority === "最優先" || item.priority === "高",
  );
  const investmentReady =
    priorityInvestments.length > 0 &&
    priorityInvestments.every((item) => item.estimatedCost !== null);
  const ownersReady = [...data.actions, ...data.dx].every(
    (item) => !item.owner.includes("要調整"),
  );

  const domains = [
    {
      key: "booking" as const,
      label: "予約枠",
      ready: bookingReady,
      detail: bookingReady ? "予約率を算出可能" : "販売可能枠・予約済枠が未入力",
      href: "/revenue",
    },
    {
      key: "revenue" as const,
      label: "売上実績",
      ready: revenueReady,
      detail: revenueReady ? "実績KPIを算出可能" : "実績人数・単価・売上が未入力",
      href: "/revenue",
    },
    {
      key: "courseQuality" as const,
      label: "コース品質",
      ready: courseReady,
      detail: courseReady ? "測定値あり" : "3コース共通KPIの実測値が未入力",
      href: "/course-quality",
    },
    {
      key: "workforce" as const,
      label: "労務実績",
      ready: workforceReady,
      detail: workforceReady ? "労務KPIを算出可能" : "残業・実働等が未入力",
      href: "/workforce",
    },
    {
      key: "pricing" as const,
      label: "料金確定",
      ready: pricingReady,
      detail: pricingReady ? "全料金が設定済み" : "未確定のコース料金あり",
      href: "/revenue",
    },
    {
      key: "investment" as const,
      label: "投資額",
      ready: investmentReady,
      detail: investmentReady ? "高優先度案件の概算あり" : "高優先度案件に未見積あり",
      href: "/roi",
    },
    {
      key: "owners" as const,
      label: "責任者",
      ready: ownersReady,
      detail: ownersReady ? "責任者設定済み" : "要調整の責任者あり",
      href: "/actions",
    },
  ];

  const readyCount = domains.filter((domain) => domain.ready).length;

  return {
    readyCount,
    missingCount: domains.length - readyCount,
    totalCount: domains.length,
    domains,
  };
}

export function getFreshness(data: DashboardData): FreshnessSummary {
  const asOf = parseDate(data.meta.asOfDate).getTime();
  const source = parseDate(data.meta.sourceUpdatedAt).getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const daysOld = Math.max(0, Math.floor((asOf - source) / oneDay));

  const level = daysOld <= 3 ? "最新" : daysOld <= 7 ? "要確認" : "更新推奨";
  const message =
    level === "最新"
      ? "基準日に対して新しいスナップショットです"
      : level === "要確認"
        ? "更新から4日以上経過しています"
        : "更新から8日以上経過しています";

  return {
    daysOld,
    level,
    sourceUpdatedAt: data.meta.sourceUpdatedAt,
    message,
  };
}

export function getFacilitySummaries(data: DashboardData): FacilitySummary[] {
  const facilities: FacilitySummary["facility"][] = ["真駒内CC", "滝のCC", "羊ヶ丘CC"];

  return facilities.map((facility) => {
    const pricePositions = data.prices.filter((item) => item.facility === facility);
    const revenueRows = data.revenue.filter((item) => item.facility === facility);
    const unsetPriceCount = pricePositions.reduce(
      (count, item) =>
        count +
        (item.weekdayPrice === null ? 1 : 0) +
        (item.weekendPrice === null ? 1 : 0),
      0,
    );
    const bookingInputRows = revenueRows.filter(
      (item) => item.capacitySlots !== null && item.bookedSlots !== null,
    ).length;

    return {
      facility,
      pricePositions,
      unsetPriceCount,
      bookingInputRows,
      revenueRows: revenueRows.length,
      hasActuals: hasRevenueActuals(revenueRows),
    };
  });
}

export function calculateOverview(data: DashboardData): OverviewMetrics {
  const plannedRevenueValues = data.revenue
    .map((row) => row.plannedRevenue)
    .filter((value): value is number => value !== null);
  const actualRevenueValues = data.revenue
    .map((row) => row.actualRevenue)
    .filter((value): value is number => value !== null);

  const plannedRevenue = plannedRevenueValues.reduce((sum, value) => sum + value, 0);
  const actualRevenue = actualRevenueValues.reduce((sum, value) => sum + value, 0);
  const revenueAchievement =
    plannedRevenueValues.length > 0 &&
    actualRevenueValues.length > 0 &&
    plannedRevenue > 0
      ? actualRevenue / plannedRevenue
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
    const timingDiff =
      timingRank[actionTiming(a, asOfDate)] - timingRank[actionTiming(b, asOfDate)];
    if (timingDiff !== 0) return timingDiff;
    const priorityDiff =
      (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9);
    if (priorityDiff !== 0) return priorityDiff;
    return (a.dueDate ?? "9999-12-31").localeCompare(b.dueDate ?? "9999-12-31");
  });
}
