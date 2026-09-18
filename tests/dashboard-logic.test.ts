import { describe, expect, it } from "vitest";
import dataJson from "../src/data/dashboard.json";
import {
  actionTiming,
  calculateOverview,
  getDataReadiness,
  getFacilitySummaries,
  getFreshness,
  priceStage,
} from "../src/lib/dashboard";
import type { ActionItem, DashboardData } from "../src/lib/types";

const data = dataJson as DashboardData;

describe("dashboard domain logic", () => {
  it("keeps unsupported actual revenue KPIs as null", () => {
    const overview = calculateOverview(data);
    expect(overview.revenueAchievement).toBeNull();
    expect(overview.weightedBookingRate).toBeNull();
    expect(overview.actualAvgPrice).toBeNull();
    expect(overview.weakGreenCount).toBeNull();
    expect(overview.overtimeHours).toBeNull();
  });

  it("calculates DX average progress from registered initiatives", () => {
    const overview = calculateOverview(data);
    expect(overview.dxProgress).toBeCloseTo(0.3 / 7, 8);
  });

  it("classifies action timing from the source baseline date", () => {
    const action = data.actions.find((item) => item.id === 1) as ActionItem;
    expect(actionTiming(action, "2026-09-18")).toBe("7日以内");
    expect(actionTiming(action, "2026-09-21")).toBe("遅延");
  });

  it("maps booking rate to the agreed pricing stages", () => {
    const t = data.master.bookingThresholds;
    expect(priceStage(null, t)).toBe("未入力");
    expect(priceStage(0.49, t)).toBe("割引検討");
    expect(priceStage(0.5, t)).toBe("基本販売");
    expect(priceStage(0.85, t)).toBe("割引停止");
    expect(priceStage(0.9, t)).toBe("プレミアム価格検討");
  });

  it("reports the seven operational readiness domains without inventing data", () => {
    const readiness = getDataReadiness(data);
    expect(readiness.totalCount).toBe(7);
    expect(readiness.domains.map((item) => item.key)).toEqual([
      "booking",
      "revenue",
      "courseQuality",
      "workforce",
      "pricing",
      "investment",
      "owners",
    ]);
    expect(readiness.missingCount).toBe(7);
  });

  it("uses the documented freshness bands", () => {
    const sameDay = getFreshness(data);
    expect(sameDay.level).toBe("最新");
    expect(sameDay.daysOld).toBe(0);

    const fourDaysOld = getFreshness({
      ...data,
      meta: { ...data.meta, asOfDate: "2026-09-22" },
    });
    expect(fourDaysOld.level).toBe("要確認");

    const eightDaysOld = getFreshness({
      ...data,
      meta: { ...data.meta, asOfDate: "2026-09-26" },
    });
    expect(eightDaysOld.level).toBe("更新推奨");
  });

  it("builds facility summaries for the three operating facilities", () => {
    const summaries = getFacilitySummaries(data);
    expect(summaries.map((item) => item.facility)).toEqual([
      "真駒内CC",
      "滝のCC",
      "羊ヶ丘CC",
    ]);
    expect(summaries.find((item) => item.facility === "滝のCC")?.unsetPriceCount).toBe(2);
    expect(summaries.every((item) => item.hasActuals === false)).toBe(true);
  });
});
