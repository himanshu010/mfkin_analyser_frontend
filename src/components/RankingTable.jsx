import React, { useState, useMemo } from "react";
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Tooltip,
  Typography,
} from "@mui/material";

const formatReturn = (value) =>
  value === null || value === undefined ? "—" : `${value.toFixed(2)}%`;

const formatNumber = (value, decimals = 2) =>
  value === null || value === undefined ? "—" : Number(value).toFixed(decimals);

const formatAum = (value) => {
  if (value === null || value === undefined) return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return "—";
  const crores = num / 10;
  if (crores >= 1000) return `₹${(crores / 1000).toFixed(1)}K Cr`;
  if (crores >= 100) return `₹${crores.toFixed(0)} Cr`;
  return `₹${crores.toFixed(1)} Cr`;
};

const formatPercent = (value) => {
  if (value === null || value === undefined) return "—";
  return `${Number(value).toFixed(2)}%`;
};

// Only enable pagination for very large datasets (1000+ funds like "All Funds")
const PAGINATION_THRESHOLD = 1000;

const columns = [
  { id: "rank", label: "#", align: "center", sortable: true, width: 50, sticky: true, left: 0 },
  { id: "schemeName", label: "Fund Name", align: "left", sortable: true, width: 300, sticky: true, left: 50 },
  { id: "returns", label: "Return", align: "right", sortable: true, width: 90, sticky: true, left: 350 },
  { id: "aum", label: "AUM", align: "right", sortable: true, width: 90, sticky: true, left: 440, accessor: (row) => row.metrics?.aum },
  { id: "isActive", label: "Status", align: "center", sortable: true, width: 80 },
  { id: "expenseRatio", label: "Expense", align: "right", sortable: true, width: 90, accessor: (row) => row.metrics?.expenseRatio },
  { id: "category", label: "Category", align: "center", sortable: true, width: 90, accessor: (row) => row.metrics?.category },
  { id: "peRatio", label: "P/E", align: "right", sortable: true, width: 70, accessor: (row) => row.metrics?.peRatio },
  { id: "pbRatio", label: "P/B", align: "right", sortable: true, width: 70, accessor: (row) => row.metrics?.pbRatio },
  { id: "dividendYield", label: "Div Yld", align: "right", sortable: true, width: 80, accessor: (row) => row.metrics?.dividendYield },
  { id: "turnoverRatio", label: "Turnover", align: "right", sortable: true, width: 90, accessor: (row) => row.metrics?.turnoverRatio },
  { id: "sharpeRatio", label: "Sharpe", align: "right", sortable: true, width: 80, accessor: (row) => row.metrics?.sharpeRatio },
  { id: "alpha", label: "Alpha", align: "right", sortable: true, width: 75, accessor: (row) => row.metrics?.alpha },
  { id: "beta", label: "Beta", align: "right", sortable: true, width: 70, accessor: (row) => row.metrics?.beta },
  { id: "stdDev", label: "Std Dev", align: "right", sortable: true, width: 85, accessor: (row) => row.metrics?.standardDeviation },
  { id: "sortinoRatio", label: "Sortino", align: "right", sortable: true, width: 80, accessor: (row) => row.metrics?.sortinoRatio },
  { id: "treynorRatio", label: "Treynor", align: "right", sortable: true, width: 85, accessor: (row) => row.metrics?.treynorRatio },
  { id: "riskRating", label: "Risk", align: "center", sortable: true, width: 110, accessor: (row) => row.metrics?.riskRating },
  { id: "inceptionDate", label: "Inception", align: "center", sortable: true, width: 100, accessor: (row) => row.metrics?.inceptionDate },
];

const getSortValue = (row, columnId) => {
  const column = columns.find((c) => c.id === columnId);
  if (column?.accessor) return column.accessor(row);
  return row[columnId];
};

const descendingComparator = (a, b, orderBy) => {
  const aVal = getSortValue(a, orderBy);
  const bVal = getSortValue(b, orderBy);
  if (aVal == null && bVal == null) return 0;
  if (aVal == null) return 1;
  if (bVal == null) return -1;
  if (typeof aVal === "string" && typeof bVal === "string") return bVal.localeCompare(aVal);
  if (bVal < aVal) return -1;
  if (bVal > aVal) return 1;
  return 0;
};

const getComparator = (order, orderBy) =>
  order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);

const RankingTable = ({ rows, timeframeLabel, note }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("rank");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const safeRows = rows || [];
  const usePagination = safeRows.length > PAGINATION_THRESHOLD;

  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
    setPage(0);
  };

  const sortedRows = useMemo(() => [...safeRows].sort(getComparator(order, orderBy)), [safeRows, order, orderBy]);
  const displayRows = useMemo(() => {
    if (!usePagination) return sortedRows;
    return sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedRows, page, rowsPerPage, usePagination]);

  React.useEffect(() => setPage(0), [safeRows.length]);

  return (
    <Paper elevation={0} sx={{ width: "100%", p: 0 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" px={2} py={1.5}>
        <Box>
          <Typography variant="h3">Full Ranking</Typography>
          <Typography variant="caption" color="text.secondary">
            {timeframeLabel || "—"} returns • Click headers to sort
            {usePagination && ` • Page ${page + 1} of ${Math.ceil(safeRows.length / rowsPerPage)}`}
          </Typography>
        </Box>
        <Chip label={`${safeRows.length} funds`} size="small" />
      </Box>

      {usePagination && (
        <TablePagination
          component="div"
          count={safeRows.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[50, 100, 250, 500]}
          sx={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
        />
      )}

      <TableContainer sx={{ maxHeight: usePagination ? "calc(100vh - 350px)" : "calc(100vh - 200px)", width: "100%" }}>
        <Table size="small" stickyHeader sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead sx={{ "& th": { backgroundColor: "#FFF7F0", fontSize: "0.75rem", fontWeight: 600, py: 1 } }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align}
                  sx={{
                    width: col.width,
                    minWidth: col.width,
                    cursor: col.sortable ? "pointer" : "default",
                    whiteSpace: "nowrap",
                    px: 1,
                    ...(col.sticky && {
                      position: "sticky",
                      left: col.left,
                      zIndex: 3,
                      backgroundColor: "#FFF7F0",
                      borderRight: col.id === "aum" ? "2px solid rgba(31,84,96,0.15)" : undefined,
                    }),
                  }}
                  sortDirection={orderBy === col.id ? order : false}
                >
                  {col.sortable ? (
                    <TableSortLabel active={orderBy === col.id} direction={orderBy === col.id ? order : "asc"} onClick={() => handleSort(col.id)}>
                      {col.label}
                    </TableSortLabel>
                  ) : col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayRows.map((row) => {
              const m = row.metrics || {};
              const isTop3 = row.rank <= 3;
              const bgColor = isTop3 ? "#FDF5EE" : "#fff";
              return (
                <TableRow
                  key={`${row.schemeCode}-${row.rank}`}
                  sx={{
                    "&:hover": { bgcolor: "rgba(31,84,96,0.06)" },
                    bgcolor: isTop3 ? "rgba(242, 178, 108, 0.12)" : "inherit",
                    "& td": { py: 0.75, px: 1, fontSize: "0.8rem" },
                  }}
                >
                  <TableCell align="center" sx={{ position: "sticky", left: 0, zIndex: 1, backgroundColor: bgColor }}>
                    {isTop3 ? <Chip label={row.rank} size="small" sx={{ fontWeight: 700, background: "#F2B26C", height: 22, fontSize: "0.75rem" }} /> : row.rank}
                  </TableCell>
                  <TableCell sx={{ overflow: "hidden", textOverflow: "ellipsis", position: "sticky", left: 50, zIndex: 1, backgroundColor: bgColor }}>
                    <Tooltip title={`${row.schemeName}${m.fundManager ? ` • ${m.fundManager}` : ""}`} placement="top-start">
                      <Box>
                        <Typography variant="body2" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.8rem", fontWeight: 500 }}>
                          {row.schemeName}
                        </Typography>
                        {m.fundManager && (
                          <Typography variant="caption" color="text.secondary" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", fontSize: "0.7rem" }}>
                            {m.fundManager}
                          </Typography>
                        )}
                      </Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, position: "sticky", left: 350, zIndex: 1, backgroundColor: bgColor, color: row.returns > 0 ? "success.main" : row.returns < 0 ? "error.main" : "inherit" }}>
                    {formatReturn(row.returns)}
                  </TableCell>
                  <TableCell align="right" sx={{ position: "sticky", left: 440, zIndex: 1, backgroundColor: bgColor, borderRight: "2px solid rgba(31,84,96,0.15)" }}>
                    {formatAum(m.aum)}
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={row.isActive ? "Active" : "Inactive"} size="small" sx={{ fontSize: "0.65rem", height: 20, bgcolor: row.isActive ? "success.light" : "grey.300", color: row.isActive ? "success.dark" : "text.secondary" }} />
                  </TableCell>
                  <TableCell align="right">{m.expenseRatio != null ? formatPercent(m.expenseRatio) : "—"}</TableCell>
                  <TableCell align="center"><Typography variant="caption" noWrap>{m.category || "—"}</Typography></TableCell>
                  <TableCell align="right">{formatNumber(m.peRatio, 1)}</TableCell>
                  <TableCell align="right">{formatNumber(m.pbRatio, 1)}</TableCell>
                  <TableCell align="right">{m.dividendYield != null ? formatPercent(m.dividendYield) : "—"}</TableCell>
                  <TableCell align="right">{formatNumber(m.turnoverRatio, 2)}</TableCell>
                  <TableCell align="right"><Tooltip title="Sharpe Ratio"><span>{formatNumber(m.sharpeRatio, 2)}</span></Tooltip></TableCell>
                  <TableCell align="right"><Tooltip title="Alpha"><span style={{ color: m.alpha > 0 ? "#2e7d32" : m.alpha < 0 ? "#c62828" : "inherit" }}>{formatNumber(m.alpha, 2)}</span></Tooltip></TableCell>
                  <TableCell align="right"><Tooltip title="Beta"><span>{formatNumber(m.beta, 2)}</span></Tooltip></TableCell>
                  <TableCell align="right"><Tooltip title="Standard Deviation"><span>{formatNumber(m.standardDeviation, 2)}</span></Tooltip></TableCell>
                  <TableCell align="right"><Tooltip title="Sortino Ratio"><span>{formatNumber(m.sortinoRatio, 2)}</span></Tooltip></TableCell>
                  <TableCell align="right"><Tooltip title="Treynor Ratio"><span>{formatNumber(m.treynorRatio, 2)}</span></Tooltip></TableCell>
                  <TableCell align="center"><Typography variant="caption" noWrap>{m.riskRating || "—"}</Typography></TableCell>
                  <TableCell align="center"><Typography variant="caption" noWrap>{m.inceptionDate || "—"}</Typography></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {usePagination && (
        <TablePagination
          component="div"
          count={safeRows.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[50, 100, 250, 500]}
        />
      )}

      {note && <Typography variant="caption" color="text.secondary" sx={{ mt: 1, px: 2, display: "block", pb: 1 }}>{note}</Typography>}
    </Paper>
  );
};

export default RankingTable;
