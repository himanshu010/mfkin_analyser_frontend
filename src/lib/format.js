const isMissing = (value) => value === null || value === undefined || Number.isNaN(Number(value));

// Return as a percentage with 2 decimals, signed so gains and losses read at a glance.
export const formatReturn = (value) => {
  if (isMissing(value)) return "—";
  const number = Number(value);
  return `${number > 0 ? "+" : ""}${number.toFixed(2)}%`;
};

// Percentage without a sign (expense ratio, dividend yield).
export const formatPercent = (value) => (isMissing(value) ? "—" : `${Number(value).toFixed(2)}%`);

export const formatNumber = (value, decimals = 2) =>
  isMissing(value) ? "—" : Number(value).toFixed(decimals);

// AUM in Indian notation. The backend sends tens of crores, so divide by 10 to get crores.
export const formatAum = (value) => {
  if (isMissing(value)) return "—";
  const crores = Number(value) / 10;
  if (crores >= 1000) return `₹${(crores / 1000).toFixed(1)}K Cr`;
  if (crores >= 100) return `₹${crores.toFixed(0)} Cr`;
  return `₹${crores.toFixed(1)} Cr`;
};

// "up", "down" or "flat", for colouring a return.
export const trend = (value) => {
  if (isMissing(value) || Number(value) === 0) return "flat";
  return Number(value) > 0 ? "up" : "down";
};

export const formatDateTime = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};
