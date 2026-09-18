import { describe, expect, it } from "vitest";
import dataJson from "../src/data/dashboard.json";
import {
  actionTiming,
  calculateOverview,
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
});
