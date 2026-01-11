import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";

const timeframes = [
  {
    key: "oneYear",
    label: "1Y Leaders",
    accent: "#F3D3A1",
    glow: "rgba(242, 178, 108, 0.35)",
  },
  {
    key: "threeYear",
    label: "3Y Leaders",
    accent: "#F7E6C1",
    glow: "rgba(233, 201, 138, 0.35)",
  },
  {
    key: "fiveYear",
    label: "5Y Leaders",
    accent: "#E6EDF8",
    glow: "rgba(127, 184, 194, 0.35)",
  },
];

const formatReturn = (value) =>
  value === null || value === undefined ? "N/A" : `${value.toFixed(2)}%`;

const formatAum = (value) => {
  if (value === null || value === undefined) return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return "—";
  const crores = num / 10;
  if (crores >= 1000) return `₹${(crores / 1000).toFixed(1)}K Cr`;
  if (crores >= 100) return `₹${crores.toFixed(0)} Cr`;
  return `₹${crores.toFixed(1)} Cr`;
};

const TopFundsPanel = ({ topFunds, activeTimeframe }) => {
  if (!topFunds) return null;

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
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
        return (
          <Paper
            key={timeframe.key}
            elevation={0}
            sx={{
              flex: 1,
              p: 2.5,
              position: "relative",
              overflow: "hidden",
              border:
                activeTimeframe === timeframe.key
                  ? "1px solid rgba(31,84,96,0.35)"
                  : "1px solid rgba(31,84,96,0.12)",
              background: `linear-gradient(140deg, ${timeframe.accent}, #FFF7F0)`,
              boxShadow: `0 20px 40px ${timeframe.glow}`,
            }}
          >
            <Stack spacing={2}>
              <Typography variant="subtitle1">{timeframe.label}</Typography>
              {lead ? (
                <>
                  <Typography
                    variant="h3"
                    sx={{
                      wordBreak: "break-word",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {lead.schemeName}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="flex-start" flexWrap="wrap">
                    <Typography variant="h2" color="primary.main" sx={{ flexShrink: 0 }}>
                      {formatReturn(lead.returns)}
                    </Typography>
                    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary">
                        AUM
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
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
              {entries.length > 1 && (
                <Box>
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
    </Stack>
  );
};

export default TopFundsPanel;
