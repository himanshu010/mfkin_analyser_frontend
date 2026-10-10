import { describe, expect, it } from "vitest";
import {
  formatAum,
  formatDateTime,
  formatNumber,
  formatPercent,
  formatReturn,
  trend,
} from "../format.js";

describe("format", () => {
  it("signs returns and shows missing ones as a dash", () => {
    expect(formatReturn(12.345)).toBe("+12.35%");
    expect(formatReturn(-3.2)).toBe("-3.20%");
    expect(formatReturn(0)).toBe("0.00%");
    expect(formatReturn(null)).toBe("—");
    expect(formatReturn(undefined)).toBe("—");
    expect(formatReturn("abc")).toBe("—");
  });

  it("formats percentages and plain numbers", () => {
    expect(formatPercent(0.5)).toBe("0.50%");
    expect(formatPercent(null)).toBe("—");
    expect(formatNumber(1.234)).toBe("1.23");
    expect(formatNumber(1.25, 1)).toBe("1.3");
    expect(formatNumber(undefined)).toBe("—");
  });

  it("formats AUM (tens of crores) in crores", () => {
    expect(formatAum(150000)).toBe("₹15.0K Cr");
    expect(formatAum(1500)).toBe("₹150 Cr");
    expect(formatAum(55)).toBe("₹5.5 Cr");
    expect(formatAum(null)).toBe("—");
    expect(formatAum("n/a")).toBe("—");
  });

  it("tells the direction of a value", () => {
    expect(trend(2)).toBe("up");
    expect(trend(-2)).toBe("down");
    expect(trend(0)).toBe("flat");
    expect(trend(null)).toBe("flat");
  });

  it("formats dates and rejects bad ones", () => {
    expect(formatDateTime("2024-01-01T10:00:00Z")).toMatch(/2024/);
    expect(formatDateTime("not a date")).toBeNull();
    expect(formatDateTime(undefined)).toBeNull();
  });
});
