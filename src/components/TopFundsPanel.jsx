import React from "react";
import { Box, Paper, Stack, Typography, Chip } from "@mui/material";

const timeLabels = {
  oneYear: "1Y",
  threeYear: "3Y",
  fiveYear: "5Y",
};

const formatReturn = (value) =>
  value === null || value === undefined ? "N/A" : `${value.toFixed(2)}%`;

const TopFundsPanel = ({ topFunds }) => {
  if (!topFunds) return null;

  return (
    <Paper elevation={0} sx={{ p: 3, background: "#FDF2E2" }}>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Top Funds by Timeframe
      </Typography>
      <Stack spacing={2}>
        {Object.entries(timeLabels).map(([key, label]) => (
          <Box key={key}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {label} Leaders
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {(topFunds[key] || []).map((fund) => (
                <Chip
                  key={`${key}-${fund.schemeCode}`}
                  label={`${fund.schemeName} · ${formatReturn(fund.returns)}`}
                  sx={{ background: "#FFE3C2", fontWeight: 600 }}
                />
              ))}
              {(topFunds[key] || []).length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No data available
                </Typography>
              )}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

export default TopFundsPanel;
