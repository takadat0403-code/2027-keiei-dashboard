import { describe, expect, it } from "vitest";
import data from "../src/data/dashboard.json";

describe("dashboard data contract", () => {
  it("contains the expected source collections", () => {
    expect(Array.isArray(data.revenue)).toBe(true);
    expect(Array.isArray(data.dx)).toBe(true);
    expect(Array.isArray(data.investments)).toBe(true);
    expect(Array.isArray(data.actions)).toBe(true);
  });

  it("preserves Takino pricing as undecided", () => {
    const takino = data.prices.find((row) => row.facility === "滝のCC");
    expect(takino?.weekdayPrice).toBeNull();
    expect(takino?.weekendPrice).toBeNull();
    expect(takino?.positioning).toBe("調整中");
  });

  it("does not invent measured course-quality or workforce data", () => {
    expect(data.courseQuality).toHaveLength(0);
    expect(data.workforce).toHaveLength(0);
  });
});
