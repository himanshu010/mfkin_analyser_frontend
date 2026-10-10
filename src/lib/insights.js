export const timeframes = [
  { key: "oneYear", label: "1Y", long: "1 year" },
  { key: "threeYear", label: "3Y", long: "3 years" },
  { key: "fiveYear", label: "5Y", long: "5 years" },
];

// Plan filters match words in the scheme name.
export const planFilters = [
  { key: "direct", label: "Direct" },
  { key: "regular", label: "Regular" },
  { key: "growth", label: "Growth" },
  { key: "idcw", label: "IDCW" },
];

export const filterRows = (rows, search, plans) => {
  const query = search.trim().toLowerCase();
  return rows.filter((row) => {
    const name = row.schemeName?.toLowerCase() || "";
    return (
      (!query || name.includes(query)) &&
      (plans.length === 0 || plans.some((plan) => name.includes(plan)))
    );
  });
};

const hasNumber = (value) => typeof value === "number" && !Number.isNaN(value);

export const average = (values) => {
  const numbers = values.filter(hasNumber);
  return numbers.length ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : null;
};

export const sectorStats = (rows) => ({
  averageReturn: average(rows.map((row) => row.returns)),
  averagePe: average(rows.map((row) => row.metrics?.peRatio)),
  averagePb: average(rows.map((row) => row.metrics?.pbRatio)),
  gainers: rows.filter((row) => hasNumber(row.returns) && row.returns > 0).length,
});

export const topByAum = (rows, count = 4) =>
  rows
    .filter((row) => hasNumber(row.metrics?.aum) && row.metrics.aum > 0)
    .sort((a, b) => b.metrics.aum - a.metrics.aum)
    .slice(0, count);

export const lowestExpense = (rows, count = 4) =>
  rows
    .filter((row) => hasNumber(row.metrics?.expenseRatio))
    .sort((a, b) => a.metrics.expenseRatio - b.metrics.expenseRatio)
    .slice(0, count);

export const filterSectors = (sectors, search) => {
  const query = search.trim().toLowerCase();
  return query ? sectors.filter((sector) => sector.toLowerCase().includes(query)) : sectors;
};
