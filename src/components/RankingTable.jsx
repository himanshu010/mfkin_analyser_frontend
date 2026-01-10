import React, { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Chip,
} from "@mui/material";

const timeframes = [
  { key: "oneYear", label: "1Y" },
  { key: "threeYear", label: "3Y" },
  { key: "fiveYear", label: "5Y" },
];

const formatReturn = (value) =>
  value === null || value === undefined ? "—" : `${value.toFixed(2)}%`;

const formatNumber = (value, decimals = 2) =>
  value === null || value === undefined ? "—" : Number(value).toFixed(decimals);

// AUM from Kuvera API is in Lakhs (divide by 10 to get Crores)
const formatAum = (value) => {
  if (value === null || value === undefined) return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return "—";
  const crores = num / 10; // Convert lakhs to crores
  if (crores >= 10000) return `₹${(crores / 1000).toFixed(0)}K Cr`;
  if (crores >= 1000) return `₹${(crores / 1000).toFixed(1)}K Cr`;
  if (crores >= 100) return `₹${crores.toFixed(0)} Cr`;
  return `₹${crores.toFixed(1)} Cr`;
};

const RankingTable = ({ rankings }) => {
  const [timeframe, setTimeframe] = useState("oneYear");

  const rows = useMemo(() => rankings?.[timeframe] || [], [rankings, timeframe]);

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h3">Full Ranking</Typography>
        <ToggleButtonGroup
          value={timeframe}
          exclusive
          onChange={(_, value) => value && setTimeframe(value)}
          size="small"
        >
          {timeframes.map((item) => (
            <ToggleButton key={item.key} value={item.key}>
              {item.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, minWidth: 50 }}>Rank</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 250 }}>Fund</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, minWidth: 80 }}>
                <Tooltip title="Return for selected timeframe">
                  <span>Return</span>
                </Tooltip>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, minWidth: 80 }}>
                <Tooltip title="Assets Under Management (in Crores)">
                  <span>AUM</span>
                </Tooltip>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, minWidth: 60 }}>
                <Tooltip title="Portfolio Price-to-Earnings Ratio">
                  <span>P/E</span>
                </Tooltip>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, minWidth: 70 }}>
                <Tooltip title="Total Expense Ratio - annual fee charged (lower is better)">
                  <span>Exp%</span>
                </Tooltip>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, minWidth: 70 }}>
                <Tooltip title="Sharpe Ratio - risk-adjusted return (higher is better, >1 is good)">
                  <span>Sharpe</span>
                </Tooltip>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, minWidth: 70 }}>
                <Tooltip title="Sortino Ratio - downside-risk-adjusted return (higher is better)">
                  <span>Sortino</span>
                </Tooltip>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, minWidth: 70 }}>
                <Tooltip title="Standard Deviation (annualized) - volatility (lower = more stable)">
                  <span>StdDev</span>
                </Tooltip>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, minWidth: 75 }}>
                <Tooltip title="Maximum Drawdown - largest decline from peak (lower is better)">
                  <span>MaxDD</span>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const m = row.metrics || {};
              return (
                <TableRow 
                  key={`${timeframe}-${row.schemeCode}`}
                  sx={{ 
                    "&:hover": { bgcolor: "action.hover" },
                    bgcolor: row.rank <= 3 ? "success.lighter" : "inherit"
                  }}
                >
                  <TableCell>
                    {row.rank <= 3 ? (
                      <Chip 
                        label={row.rank} 
                        size="small" 
                        color={row.rank === 1 ? "success" : "default"}
                        sx={{ fontWeight: 600, minWidth: 28 }}
                      />
                    ) : row.rank}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 280 }}>
                    <Tooltip title={row.schemeName}>
                      <Typography variant="body2" noWrap>
                        {row.schemeName}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      fontWeight: 600,
                      color: row.returns > 0 ? "success.main" : row.returns < 0 ? "error.main" : "inherit"
                    }}
                  >
                    {formatReturn(row.returns)}
                  </TableCell>
                  <TableCell align="right">{formatAum(m.aum)}</TableCell>
                  <TableCell align="right">{formatNumber(m.peRatio, 1)}</TableCell>
                  <TableCell 
                    align="right"
                    sx={{ color: m.expenseRatio > 2 ? "error.main" : m.expenseRatio < 1 ? "success.main" : "inherit" }}
                  >
                    {m.expenseRatio != null ? `${formatNumber(m.expenseRatio)}%` : "—"}
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ color: m.sharpeRatio > 1 ? "success.main" : m.sharpeRatio < 0 ? "error.main" : "inherit" }}
                  >
                    {formatNumber(m.sharpeRatio)}
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ color: m.sortinoRatio > 1 ? "success.main" : m.sortinoRatio < 0 ? "error.main" : "inherit" }}
                  >
                    {formatNumber(m.sortinoRatio)}
                  </TableCell>
                  <TableCell align="right">{formatNumber(m.standardDeviation)}</TableCell>
                  <TableCell 
                    align="right"
                    sx={{ color: m.maxDrawdown > 20 ? "error.main" : m.maxDrawdown > 10 ? "warning.main" : "success.main" }}
                  >
                    {m.maxDrawdown !== null && m.maxDrawdown !== undefined ? `${formatNumber(m.maxDrawdown)}%` : "—"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {rows.length > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
          Showing {rows.length} funds • AUM/P/E/Expense from Kuvera, Risk metrics from NAV history • "—" = data unavailable
        </Typography>
      )}
    </Paper>
  );
};

export default RankingTable;
