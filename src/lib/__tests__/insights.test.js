import { describe, expect, it } from "vitest";
import {
  average,
  filterRows,
  filterSectors,
  lowestExpense,
  planFilters,
  sectorStats,
  timeframes,
  topByAum,
} from "../insights.js";

const rows = [
  {
    schemeCode: "1",
    schemeName: "Alpha Direct Growth",
    returns: 10,
    metrics: { aum: 500, expenseRatio: 0.5, peRatio: 20, pbRatio: 3 },
  },
  {
    schemeCode: "2",
    schemeName: "Beta Regular IDCW",
    returns: -4,
    metrics: { aum: 900, expenseRatio: 1.5, peRatio: null, pbRatio: 5 },
  },
  {
    schemeCode: "3",
    schemeName: "Gamma Direct IDCW",
    returns: null,
    metrics: { aum: null, expenseRatio: null },
  },
  { schemeCode: "4", schemeName: undefined, returns: 2 },
];

describe("insights", () => {
  it("lists the return periods and plan filters", () => {
    expect(timeframes.map((item) => item.key)).toEqual(["oneYear", "threeYear", "fiveYear"]);
    expect(planFilters.map((item) => item.key)).toEqual(["direct", "regular", "growth", "idcw"]);
  });

  it("filters rows by name and by any chosen plan", () => {
    expect(filterRows(rows, "", [])).toHaveLength(4);
    expect(filterRows(rows, " alpha ", []).map((row) => row.schemeCode)).toEqual(["1"]);
    expect(filterRows(rows, "", ["idcw"]).map((row) => row.schemeCode)).toEqual(["2", "3"]);
    expect(filterRows(rows, "gamma", ["idcw", "growth"]).map((row) => row.schemeCode)).toEqual([
      "3",
    ]);
  });

  it("averages only real numbers", () => {
    expect(average([1, 2, null, undefined, Number.NaN, 3])).toBe(2);
    expect(average([null])).toBeNull();
  });

  it("summarises a sector", () => {
    expect(sectorStats(rows)).toEqual({
      averageReturn: 8 / 3,
      averagePe: 20,
      averagePb: 4,
      gainers: 2,
    });
  });

  it("finds the largest and the cheapest funds", () => {
    expect(topByAum(rows).map((row) => row.schemeCode)).toEqual(["2", "1"]);
    expect(topByAum(rows, 1)).toHaveLength(1);
    expect(lowestExpense(rows).map((row) => row.schemeCode)).toEqual(["1", "2"]);
  });

  it("filters sectors by name", () => {
    expect(filterSectors(["Banking", "Pharma"], "")).toEqual(["Banking", "Pharma"]);
    expect(filterSectors(["Banking", "Pharma"], " PHAR ")).toEqual(["Pharma"]);
  });
});
