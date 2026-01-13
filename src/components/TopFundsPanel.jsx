import { Box, Paper, Stack, Typography } from "@mui/material";

// Timeframe configuration with CSS class mapping
const timeframes = [
  { key: "oneYear", label: "1Y Leaders", cssClass: "top-funds-card--one-year" },
  { key: "threeYear", label: "3Y Leaders", cssClass: "top-funds-card--three-year" },
  { key: "fiveYear", label: "5Y Leaders", cssClass: "top-funds-card--five-year" },
];

// Format return value as percentage with 2 decimal places
const formatReturn = (value) =>
  value === null || value === undefined ? "N/A" : `${value.toFixed(2)}%`;

// Format AUM in Indian notation (Crores)
// Input is in 10s of crores, so divide by 10 to get crores
const formatAum = (value) => {
  if (value === null || value === undefined) return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return "—";
  const crores = num / 10;
  if (crores >= 1000) return `₹${(crores / 1000).toFixed(1)}K Cr`;
  if (crores >= 100) return `₹${crores.toFixed(0)} Cr`;
  return `₹${crores.toFixed(1)} Cr`;
};

// Display top performing funds for each timeframe (1Y, 3Y, 5Y)
const TopFundsPanel = ({ topFunds, activeTimeframe }) => {
  if (!topFunds) return null;

  return (
    <Box className="top-funds-panel">
      {timeframes.map((timeframe) => {
        const entries = topFunds[timeframe.key] || [];
        const lead = entries[0];
        const expenseRatio =
          lead?.metrics?.expenseRatio === null || lead?.metrics?.expenseRatio === undefined
            ? "—"
            : `${lead.metrics.expenseRatio}%`;
        const peRatio =
          lead?.metrics?.peRatio === null || lead?.metrics?.peRatio === undefined
            ? "—"
            : lead.metrics.peRatio;
        const pbRatio =
          lead?.metrics?.pbRatio === null || lead?.metrics?.pbRatio === undefined
            ? "—"
            : lead.metrics.pbRatio;
        const isActive = activeTimeframe === timeframe.key;

        return (
          <Paper
            key={timeframe.key}
            elevation={0}
            className={`top-funds-card ${timeframe.cssClass} ${isActive ? "top-funds-card--active" : "top-funds-card--inactive"}`}
          >
            <Stack spacing={2}>
              <Typography variant="subtitle1">{timeframe.label}</Typography>
              {lead ? (
                <>
                  <Typography variant="h3" className="top-funds-card__name">
                    {lead.schemeName}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="flex-start" flexWrap="wrap">
                    <Typography
                      variant="h2"
                      color="primary.main"
                      className="top-funds-card__return"
                    >
                      {formatReturn(lead.returns)}
                    </Typography>
                    <Stack spacing={0.5} className="top-funds-card__aum-label">
                      <Typography variant="caption" color="text.secondary">
                        AUM
                      </Typography>
                      <Typography variant="body2" className="top-funds-card__aum-value">
                        {formatAum(lead.metrics?.aum)}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Typography variant="caption" color="text.secondary">
                      Expense: {expenseRatio}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      P/E: {peRatio}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      P/B: {pbRatio}
                    </Typography>
                  </Stack>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No leaders yet for this timeframe.
                </Typography>
              )}

              {/* Show additional tied leaders if multiple funds have same top return */}
              {entries.length > 1 && (
                <Box className="top-funds-card__tied">
                  <Typography variant="caption" color="text.secondary">
                    Tied leaders:
                  </Typography>
                  {entries.slice(1, 3).map((fund) => (
                    <Typography key={fund.schemeCode} variant="body2">
                      {fund.schemeName}
                    </Typography>
                  ))}
                </Box>
              )}
            </Stack>
          </Paper>
        );
      })}
    </Box>
  );
};

export default TopFundsPanel;
