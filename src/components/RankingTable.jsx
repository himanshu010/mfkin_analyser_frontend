import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Chip,
  Paper,
  Stack,
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
  useMediaQuery,
  useTheme,
} from "@mui/material";

// Format return value as percentage with 2 decimal places
const formatReturn = (value) =>
  value === null || value === undefined ? "—" : `${value.toFixed(2)}%`;

// Format numeric value with specified decimal places
const formatNumber = (value, decimals = 2) =>
  value === null || value === undefined ? "—" : Number(value).toFixed(decimals);

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

// Format value as percentage
export const formatPercent = (value) => {
  if (value === null || value === undefined) return "—";
  return `${Number(value).toFixed(2)}%`;
};

// Enable pagination only for very large datasets (eg: "All Funds" with 1000+ entries)
const PAGINATION_THRESHOLD = 1000;

// Table column definitions with sorting, width, and sticky positioning
const columns = [
  {
    id: "rank",
    label: "#",
    align: "center",
    sortable: true,
    sticky: true,
    cellClass: "ranking-table__cell--rank",
  },
  {
    id: "schemeName",
    label: "Fund Name",
    align: "left",
    sortable: true,
    sticky: true,
    cellClass: "ranking-table__cell--name",
  },
  {
    id: "returns",
    label: "Return",
    align: "right",
    sortable: true,
    sticky: true,
    cellClass: "ranking-table__cell--return",
  },
  {
    id: "aum",
    label: "AUM",
    align: "right",
    sortable: true,
    sticky: true,
    cellClass: "ranking-table__cell--aum",
    accessorKey: "aum",
  },
  {
    id: "isActive",
    label: "Status",
    align: "center",
    sortable: false,
    cellClass: "ranking-table__cell--status",
  },
  {
    id: "expenseRatio",
    label: "Expense",
    align: "right",
    sortable: true,
    cellClass: "ranking-table__cell--expense",
    accessorKey: "expenseRatio",
  },
  {
    id: "category",
    label: "Category",
    align: "center",
    sortable: true,
    cellClass: "ranking-table__cell--category",
    accessorKey: "category",
  },
  {
    id: "peRatio",
    label: "P/E",
    align: "right",
    sortable: true,
    cellClass: "ranking-table__cell--pe",
    accessorKey: "peRatio",
  },
  {
    id: "pbRatio",
    label: "P/B",
    align: "right",
    sortable: true,
    cellClass: "ranking-table__cell--pb",
    accessorKey: "pbRatio",
  },
  {
    id: "dividendYield",
    label: "Div Yld",
    align: "right",
    sortable: true,
    cellClass: "ranking-table__cell--dividend",
    accessorKey: "dividendYield",
  },
  {
    id: "turnoverRatio",
    label: "Turnover",
    align: "right",
    sortable: true,
    cellClass: "ranking-table__cell--turnover",
    accessorKey: "turnoverRatio",
  },
  {
    id: "sharpeRatio",
    label: "Sharpe",
    align: "right",
    sortable: true,
    cellClass: "ranking-table__cell--sharpe",
    accessorKey: "sharpeRatio",
  },
  {
    id: "alpha",
    label: "Alpha",
    align: "right",
    sortable: true,
    cellClass: "ranking-table__cell--alpha",
    accessorKey: "alpha",
  },
  {
    id: "beta",
    label: "Beta",
    align: "right",
    sortable: true,
    cellClass: "ranking-table__cell--beta",
    accessorKey: "beta",
  },
  {
    id: "stdDev",
    label: "Std Dev",
    align: "right",
    sortable: true,
    cellClass: "ranking-table__cell--stddev",
    accessorKey: "standardDeviation",
  },
  {
    id: "sortinoRatio",
    label: "Sortino",
    align: "right",
    sortable: true,
    cellClass: "ranking-table__cell--sortino",
    accessorKey: "sortinoRatio",
  },
  {
    id: "treynorRatio",
    label: "Treynor",
    align: "right",
    sortable: true,
    cellClass: "ranking-table__cell--treynor",
    accessorKey: "treynorRatio",
  },
  {
    id: "riskRating",
    label: "Risk",
    align: "center",
    sortable: true,
    cellClass: "ranking-table__cell--risk",
    accessorKey: "riskRating",
  },
  {
    id: "inceptionDate",
    label: "Inception",
    align: "center",
    sortable: true,
    cellClass: "ranking-table__cell--inception",
    accessorKey: "inceptionDate",
  },
];

// Get sortable value from row using column accessor or direct property
const getSortValue = (row, columnId) => {
  const column = columns.find((c) => c.id === columnId);
  if (column?.accessorKey) {
    return row.metrics?.[column.accessorKey];
  }
  return row[columnId];
};

// Comparator for descending sort order, handles null values
export const descendingComparator = (a, b, orderBy) => {
  const aVal = getSortValue(a, orderBy);
  const bVal = getSortValue(b, orderBy);
  const aIsNull = aVal === null || aVal === undefined;
  const bIsNull = bVal === null || bVal === undefined;
  if (aIsNull && bIsNull) return 0;
  if (aIsNull) return 1;
  if (bIsNull) return -1;
  if (typeof aVal === "string" && typeof bVal === "string") return bVal.localeCompare(aVal);
  if (bVal < aVal) return -1;
  if (bVal > aVal) return 1;
  return 0;
};

// Get comparator function based on sort order
const getComparator = (order, orderBy) =>
  order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);

const RankingTable = ({ rows, timeframeLabel, note }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("rank");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const safeRows = useMemo(() => rows || [], [rows]);
  const usePagination = safeRows.length > PAGINATION_THRESHOLD;

  const handlePageChange = (_, nextPage) => setPage(nextPage);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Toggle sort order or change sort column
  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
    setPage(0);
  };

  const sortedRows = useMemo(
    () => [...safeRows].sort(getComparator(order, orderBy)),
    [safeRows, order, orderBy]
  );

  // Apply pagination if enabled
  const displayRows = useMemo(() => {
    if (!usePagination) return sortedRows;
    return sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedRows, page, rowsPerPage, usePagination]);

  // Reset to first page when data changes
  useEffect(() => setPage(0), [safeRows.length]);

  // Get return color class based on value
  const getReturnClass = (value) => {
    if (value > 0) return "ranking-table__return--positive";
    if (value < 0) return "ranking-table__return--negative";
    return "";
  };

  // Get alpha color class based on value
  const getAlphaClass = (value) => {
    if (value > 0) return "ranking-table__alpha--positive";
    if (value < 0) return "ranking-table__alpha--negative";
    return "";
  };

  return (
    <Paper elevation={0} className="ranking-table">
      <Box className="ranking-table__header">
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
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[50, 100, 250, 500]}
          className="ranking-table__pagination"
        />
      )}

      {isMobile ? (
        <Box className="ranking-table__mobile-list">
          {displayRows.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No funds to display.
            </Typography>
          ) : (
            displayRows.map((row) => {
              const m = row.metrics || {};
              const isTop3 = row.rank <= 3;
              const expenseRatio =
                m.expenseRatio !== null && m.expenseRatio !== undefined
                  ? formatPercent(m.expenseRatio)
                  : "—";

              return (
                <Paper
                  key={`${row.schemeCode}-${row.rank}`}
                  elevation={0}
                  className={`ranking-table__mobile-card ${isTop3 ? "ranking-table__mobile-card--top" : ""}`}
                >
                  <Stack spacing={1}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      className="ranking-table__mobile-header"
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        {isTop3 ? (
                          <Chip
                            label={row.rank}
                            size="small"
                            className="ranking-table__rank-chip"
                          />
                        ) : (
                          <Typography variant="subtitle2" className="ranking-table__mobile-rank">
                            #{row.rank}
                          </Typography>
                        )}
                        <Typography
                          variant="subtitle2"
                          className={`ranking-table__mobile-return ${getReturnClass(row.returns)}`}
                        >
                          {formatReturn(row.returns)}
                        </Typography>
                      </Stack>
                      <Chip
                        label={row.isActive ? "Active" : "Inactive"}
                        size="small"
                        className={`ranking-table__status-chip ${row.isActive ? "ranking-table__status-chip--active" : "ranking-table__status-chip--inactive"}`}
                      />
                    </Stack>

                    <Box>
                      <Typography variant="subtitle2" className="ranking-table__mobile-name">
                        {row.schemeName}
                      </Typography>
                      {m.fundManager && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          className="ranking-table__fund-manager"
                        >
                          {m.fundManager}
                        </Typography>
                      )}
                    </Box>

                    <Box className="ranking-table__mobile-metrics">
                      <Box className="ranking-table__mobile-metric">
                        <Typography variant="caption" color="text.secondary">
                          AUM
                        </Typography>
                        <Typography variant="body2">{formatAum(m.aum)}</Typography>
                      </Box>
                      <Box className="ranking-table__mobile-metric">
                        <Typography variant="caption" color="text.secondary">
                          Expense
                        </Typography>
                        <Typography variant="body2">{expenseRatio}</Typography>
                      </Box>
                      <Box className="ranking-table__mobile-metric">
                        <Typography variant="caption" color="text.secondary">
                          Category
                        </Typography>
                        <Typography variant="body2" noWrap>
                          {m.category || "—"}
                        </Typography>
                      </Box>
                      <Box className="ranking-table__mobile-metric">
                        <Typography variant="caption" color="text.secondary">
                          Risk
                        </Typography>
                        <Typography variant="body2" noWrap>
                          {m.riskRating || "—"}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Paper>
              );
            })
          )}
        </Box>
      ) : (
        <TableContainer
          className={`ranking-table__container ${usePagination ? "ranking-table__container--paginated" : "ranking-table__container--full"}`}
        >
          <Table size="small" stickyHeader className="ranking-table__table">
            <TableHead className="ranking-table__head">
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.id}
                    align={col.align}
                    className={`${col.cellClass} ${col.sticky ? "ranking-table__cell--sticky" : ""} ${col.sortable ? "ranking-table__cell--sortable" : ""}`}
                    sortDirection={orderBy === col.id ? order : false}
                  >
                    {col.sortable ? (
                      <TableSortLabel
                        active={orderBy === col.id}
                        direction={orderBy === col.id ? order : "asc"}
                        onClick={() => handleSort(col.id)}
                      >
                        {col.label}
                      </TableSortLabel>
                    ) : (
                      col.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayRows.map((row) => {
                const m = row.metrics || {};
                const isTop3 = row.rank <= 3;
                const bgClass = isTop3 ? "ranking-table__bg--top" : "ranking-table__bg--white";
                const rowClass = `ranking-table__row ${isTop3 ? "ranking-table__row--top-rank" : ""}`;

                return (
                  <TableRow key={`${row.schemeCode}-${row.rank}`} className={rowClass}>
                    <TableCell
                      align="center"
                      className={`ranking-table__body-cell--sticky ranking-table__body-cell--rank ${bgClass}`}
                    >
                      {isTop3 ? (
                        <Chip label={row.rank} size="small" className="ranking-table__rank-chip" />
                      ) : (
                        row.rank
                      )}
                    </TableCell>
                    <TableCell
                      className={`ranking-table__body-cell--sticky ranking-table__body-cell--name ${bgClass}`}
                    >
                      <Tooltip
                        title={`${row.schemeName}${m.fundManager ? ` • ${m.fundManager}` : ""}`}
                        placement="top-start"
                      >
                        <Box>
                          <Typography variant="body2" className="ranking-table__fund-name">
                            {row.schemeName}
                          </Typography>
                          {m.fundManager && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              className="ranking-table__fund-manager"
                            >
                              {m.fundManager}
                            </Typography>
                          )}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      align="right"
                      className={`ranking-table__body-cell--sticky ranking-table__body-cell--return ${bgClass} ${getReturnClass(row.returns)}`}
                    >
                      {formatReturn(row.returns)}
                    </TableCell>
                    <TableCell
                      align="right"
                      className={`ranking-table__body-cell--sticky ranking-table__body-cell--aum ${bgClass}`}
                    >
                      {formatAum(m.aum)}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={row.isActive ? "Active" : "Inactive"}
                        size="small"
                        className={`ranking-table__status-chip ${row.isActive ? "ranking-table__status-chip--active" : "ranking-table__status-chip--inactive"}`}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {m.expenseRatio !== null && m.expenseRatio !== undefined
                        ? formatPercent(m.expenseRatio)
                        : "—"}
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="caption" noWrap>
                        {m.category || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{formatNumber(m.peRatio, 1)}</TableCell>
                    <TableCell align="right">{formatNumber(m.pbRatio, 1)}</TableCell>
                    <TableCell align="right">
                      {m.dividendYield !== null && m.dividendYield !== undefined
                        ? formatPercent(m.dividendYield)
                        : "—"}
                    </TableCell>
                    <TableCell align="right">{formatNumber(m.turnoverRatio, 2)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Sharpe Ratio">
                        <span>{formatNumber(m.sharpeRatio, 2)}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Alpha">
                        <span className={getAlphaClass(m.alpha)}>{formatNumber(m.alpha, 2)}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Beta">
                        <span>{formatNumber(m.beta, 2)}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Standard Deviation">
                        <span>{formatNumber(m.standardDeviation, 2)}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Sortino Ratio">
                        <span>{formatNumber(m.sortinoRatio, 2)}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Treynor Ratio">
                        <span>{formatNumber(m.treynorRatio, 2)}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="caption" noWrap>
                        {m.riskRating || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="caption" noWrap>
                        {m.inceptionDate || "—"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {usePagination && !isMobile && (
        <TablePagination
          component="div"
          count={safeRows.length}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[50, 100, 250, 500]}
        />
      )}

      {note && (
        <Typography variant="caption" color="text.secondary" className="ranking-table__note">
          {note}
        </Typography>
      )}
    </Paper>
  );
};

export default RankingTable;
