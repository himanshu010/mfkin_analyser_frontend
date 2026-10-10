import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatAum, formatNumber, formatPercent, formatReturn, trend } from "../lib/format.js";
import { cn } from "../lib/cn.js";
import { PHONE, useMediaQuery } from "../lib/useMediaQuery.js";
import Button from "./ui/Button.jsx";

export { formatPercent };

// Pagination only for very large lists (eg "All Funds" with 1,000+ entries).
const PAGINATION_THRESHOLD = 1000;
const PAGE_SIZES = [50, 100, 250, 500];

const tone = { up: "text-up", down: "text-down", flat: "" };
const dash = (value) => value || "—";

// accessorKey reads from row.metrics; the rest read from the row. `render(metrics, row)` gives the cell.
const columns = [
  { id: "rank", label: "#", align: "center" },
  { id: "schemeName", label: "Fund", align: "left" },
  { id: "returns", label: "Return", align: "right", render: (m, row) => formatReturn(row.returns) },
  { id: "aum", label: "AUM", align: "right", accessorKey: "aum", render: (m) => formatAum(m.aum) },
  { id: "isActive", label: "Status", align: "center", sortable: false },
  {
    id: "expenseRatio",
    label: "Expense",
    align: "right",
    accessorKey: "expenseRatio",
    render: (m) => formatPercent(m.expenseRatio),
  },
  {
    id: "category",
    label: "Category",
    align: "left",
    accessorKey: "category",
    render: (m) => dash(m.category),
  },
  {
    id: "peRatio",
    label: "P/E",
    align: "right",
    accessorKey: "peRatio",
    render: (m) => formatNumber(m.peRatio, 1),
  },
  {
    id: "pbRatio",
    label: "P/B",
    align: "right",
    accessorKey: "pbRatio",
    render: (m) => formatNumber(m.pbRatio, 1),
  },
  {
    id: "dividendYield",
    label: "Div yield",
    align: "right",
    accessorKey: "dividendYield",
    render: (m) => formatPercent(m.dividendYield),
  },
  {
    id: "turnoverRatio",
    label: "Turnover",
    align: "right",
    accessorKey: "turnoverRatio",
    render: (m) => formatNumber(m.turnoverRatio, 2),
  },
  {
    id: "sharpeRatio",
    label: "Sharpe",
    align: "right",
    accessorKey: "sharpeRatio",
    render: (m) => formatNumber(m.sharpeRatio, 2),
  },
  {
    id: "alpha",
    label: "Alpha",
    align: "right",
    accessorKey: "alpha",
    render: (m) => formatNumber(m.alpha, 2),
    tone: (m) => tone[trend(m.alpha)],
  },
  {
    id: "beta",
    label: "Beta",
    align: "right",
    accessorKey: "beta",
    render: (m) => formatNumber(m.beta, 2),
  },
  {
    id: "stdDev",
    label: "Std dev",
    align: "right",
    accessorKey: "standardDeviation",
    render: (m) => formatNumber(m.standardDeviation, 2),
  },
  {
    id: "sortinoRatio",
    label: "Sortino",
    align: "right",
    accessorKey: "sortinoRatio",
    render: (m) => formatNumber(m.sortinoRatio, 2),
  },
  {
    id: "treynorRatio",
    label: "Treynor",
    align: "right",
    accessorKey: "treynorRatio",
    render: (m) => formatNumber(m.treynorRatio, 2),
  },
  {
    id: "riskRating",
    label: "Risk",
    align: "left",
    accessorKey: "riskRating",
    render: (m) => dash(m.riskRating),
  },
  {
    id: "inceptionDate",
    label: "Since",
    align: "left",
    accessorKey: "inceptionDate",
    render: (m) => dash(m.inceptionDate),
  },
];

const getSortValue = (row, columnId) => {
  const column = columns.find((c) => c.id === columnId);
  return column?.accessorKey ? row.metrics?.[column.accessorKey] : row[columnId];
};

// Descending comparison; missing values always sort last.
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

const compare = (order, orderBy) => (a, b) => {
  const result = descendingComparator(a, b, orderBy);
  // Missing values stay last in both directions.
  const missing = [a, b].some(
    (row) => getSortValue(row, orderBy) === null || getSortValue(row, orderBy) === undefined
  );
  return order === "desc" || missing ? result : -result;
};

const medal = [
  "bg-accent text-[#1d1200]",
  "bg-line-strong text-fg",
  "bg-accent-soft text-accent-text",
];

const Status = ({ active }) => (
  <span
    className={cn(
      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
      active ? "bg-up-soft text-up" : "bg-surface-2 text-fg-muted"
    )}
  >
    {active ? "Active" : "Inactive"}
  </span>
);

const Rank = ({ rank }) =>
  rank <= 3 ? (
    <span
      className={cn(
        "num inline-grid size-7 place-items-center rounded-full text-xs font-bold",
        medal[rank - 1]
      )}
    >
      {rank}
    </span>
  ) : (
    <span className="num text-fg-muted">{rank}</span>
  );

const Pagination = ({ label, page, pages, total, pageSize, onPage, onPageSize }) => (
  <nav
    aria-label={label}
    className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm"
  >
    <label className="flex items-center gap-2 text-fg-muted">
      Rows per page
      <select
        className="h-9 rounded-lg border border-line bg-surface px-2 text-fg pointer-coarse:h-11 pointer-coarse:text-base"
        onChange={(event) => onPageSize(Number(event.target.value))}
        value={pageSize}
      >
        {PAGE_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </label>
    <div className="flex items-center gap-2">
      <span className="num text-fg-muted">
        {page * pageSize + 1}–{Math.min(total, (page + 1) * pageSize)} of {total}
      </span>
      <Button
        aria-label="Previous page"
        disabled={page === 0}
        onClick={() => onPage(page - 1)}
        size="icon"
        variant="outline"
      >
        <ChevronLeft aria-hidden />
      </Button>
      <Button
        aria-label="Next page"
        disabled={page >= pages - 1}
        onClick={() => onPage(page + 1)}
        size="icon"
        variant="outline"
      >
        <ChevronRight aria-hidden />
      </Button>
    </div>
  </nav>
);

const phoneSorts = [
  { id: "rank", label: "Rank" },
  { id: "returns", label: "Return" },
  { id: "aum", label: "AUM" },
  { id: "expenseRatio", label: "Expense" },
  { id: "sharpeRatio", label: "Sharpe" },
];

const RankingTable = ({ rows, timeframeLabel, note, highlightCode }) => {
  const phone = useMediaQuery(PHONE);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("rank");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(100);
  const highlighted = useRef(null);
  const scroller = useRef(null);

  const safeRows = useMemo(() => rows || [], [rows]);
  const paginate = safeRows.length > PAGINATION_THRESHOLD;
  const pages = Math.ceil(safeRows.length / pageSize);

  useEffect(() => setPage(0), [safeRows.length]);

  const sorted = useMemo(
    () => [...safeRows].sort(compare(order, orderBy)),
    [safeRows, order, orderBy]
  );
  const shown = paginate ? sorted.slice(page * pageSize, page * pageSize + pageSize) : sorted;

  // Brings a searched fund's row into the middle of the table's own scroll area, leaving the page
  // (and the fund spotlight at its top) where it is.
  useEffect(() => {
    const row = highlighted.current;
    const area = scroller.current;
    if (!row || !area) return;
    area.scrollTo?.({
      top: row.offsetTop - (area.clientHeight - row.offsetHeight) / 2,
      behavior: "smooth",
    });
  }, [highlightCode]);

  const sortBy = (columnId) => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
    setPage(0);
  };

  const pagination = (label) =>
    paginate ? (
      <Pagination
        label={label}
        onPage={setPage}
        onPageSize={(size) => {
          setPageSize(size);
          setPage(0);
        }}
        page={page}
        pageSize={pageSize}
        pages={pages}
        total={safeRows.length}
      />
    ) : null;

  return (
    <section aria-labelledby="ranking-title" className="card overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-3 px-4 pt-4 pb-3 sm:px-5">
        <div>
          <h2 className="text-lg font-semibold tracking-tight" id="ranking-title">
            Full ranking
          </h2>
          <p className="text-sm text-fg-muted">
            {timeframeLabel || "—"} returns ·{" "}
            {phone ? "choose how to sort below" : "select a column to sort"}
          </p>
        </div>
        <span className="num rounded-full border border-line bg-surface-2 px-3 py-1 text-sm">
          {safeRows.length} funds
        </span>
      </div>

      {phone ? (
        <>
          <div className="flex items-center gap-2 border-t border-line px-4 py-3">
            <label className="flex flex-1 items-center gap-2 text-sm text-fg-muted">
              Sort by
              <select
                className="h-11 flex-1 rounded-lg border border-line bg-surface px-2 text-base text-fg"
                onChange={(event) => {
                  setOrderBy(event.target.value);
                  setPage(0);
                }}
                value={phoneSorts.some((sort) => sort.id === orderBy) ? orderBy : "rank"}
              >
                {phoneSorts.map((sort) => (
                  <option key={sort.id} value={sort.id}>
                    {sort.label}
                  </option>
                ))}
              </select>
            </label>
            <Button
              aria-label={
                order === "asc"
                  ? "Ascending; switch to descending"
                  : "Descending; switch to ascending"
              }
              onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
              size="icon"
              variant="outline"
            >
              {order === "asc" ? <ArrowUp aria-hidden /> : <ArrowDown aria-hidden />}
            </Button>
          </div>
          {pagination("Ranking pages")}
          {shown.length === 0 ? (
            <p className="border-t border-line px-4 py-6 text-sm text-fg-muted">
              No funds to show.
            </p>
          ) : (
            <ol className="divide-y divide-line border-t border-line">
              {shown.map((row) => {
                const m = row.metrics || {};
                const mark = row.schemeCode === highlightCode;
                return (
                  <li
                    className={cn("px-4 py-3", mark && "bg-primary-soft")}
                    key={`${row.schemeCode}-${row.rank}`}
                    ref={mark ? highlighted : null}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Rank rank={row.rank} />
                        <span className={cn("num font-semibold", tone[trend(row.returns)])}>
                          {formatReturn(row.returns)}
                        </span>
                      </div>
                      <Status active={row.isActive} />
                    </div>
                    <p className="mt-1.5 font-medium">{row.schemeName}</p>
                    {m.fundManager ? (
                      <p className="text-xs text-fg-muted">{m.fundManager}</p>
                    ) : null}
                    <dl className="mt-2 grid grid-cols-4 gap-2 text-sm">
                      {[
                        ["AUM", formatAum(m.aum)],
                        ["Expense", formatPercent(m.expenseRatio)],
                        ["Sharpe", formatNumber(m.sharpeRatio, 2)],
                        ["Risk", dash(m.riskRating)],
                      ].map(([label, value]) => (
                        <div className="min-w-0" key={label}>
                          <dt className="text-xs text-fg-muted">{label}</dt>
                          <dd className="num truncate">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </li>
                );
              })}
            </ol>
          )}
        </>
      ) : (
        <>
          {pagination("Ranking pages")}
          <div
            className="scrollbar-thin max-h-[75vh] overflow-auto border-t border-line"
            tabIndex={0}
            role="region"
            aria-label="Ranking table, scrolls in both directions"
            ref={scroller}
          >
            <table className="w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr>
                  {columns.map((col, index) => {
                    const sortable = col.sortable !== false;
                    const active = orderBy === col.id;
                    const Icon = active ? (order === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                    return (
                      <th
                        aria-sort={
                          active ? (order === "asc" ? "ascending" : "descending") : undefined
                        }
                        className={cn(
                          "sticky top-0 z-10 border-b border-line bg-surface-2 px-3 py-2.5 font-medium whitespace-nowrap text-fg-muted",
                          col.align === "right"
                            ? "text-right"
                            : col.align === "center"
                              ? "text-center"
                              : "text-left",
                          index === 0 && "left-0 z-20 w-14",
                          index === 1 && "left-14 z-20 min-w-[16rem] border-r"
                        )}
                        key={col.id}
                        scope="col"
                      >
                        {sortable ? (
                          <button
                            className={cn(
                              "inline-flex items-center gap-1 rounded hover:text-fg",
                              active && "text-fg",
                              col.align === "right" && "flex-row-reverse"
                            )}
                            onClick={() => sortBy(col.id)}
                            type="button"
                          >
                            {col.label}
                            <Icon aria-hidden className={cn("size-3.5", !active && "opacity-50")} />
                          </button>
                        ) : (
                          col.label
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {shown.map((row) => {
                  const m = row.metrics || {};
                  const mark = row.schemeCode === highlightCode;
                  const stickyBg = mark ? "bg-primary-soft" : "bg-surface group-hover:bg-surface-2";
                  return (
                    <tr
                      className={cn("group", mark && "bg-primary-soft")}
                      key={`${row.schemeCode}-${row.rank}`}
                      ref={mark ? highlighted : null}
                    >
                      <td
                        className={cn(
                          "sticky left-0 border-b border-line px-3 py-2 text-center",
                          stickyBg
                        )}
                      >
                        <Rank rank={row.rank} />
                      </td>
                      <th
                        className={cn(
                          "sticky left-14 max-w-[22rem] border-r border-b border-line px-3 py-2 text-left font-normal",
                          stickyBg
                        )}
                        scope="row"
                      >
                        <span className="line-clamp-2 font-medium" title={row.schemeName}>
                          {row.schemeName}
                        </span>
                        {m.fundManager ? (
                          <span className="block truncate text-xs text-fg-muted">
                            {m.fundManager}
                          </span>
                        ) : null}
                      </th>
                      {columns.slice(2).map((col) => (
                        <td
                          className={cn(
                            "border-b border-line px-3 py-2 whitespace-nowrap group-hover:bg-surface-2",
                            col.align === "right"
                              ? "num text-right"
                              : col.align === "center"
                                ? "text-center"
                                : "text-left",
                            col.id === "returns" && cn("font-semibold", tone[trend(row.returns)]),
                            col.tone?.(m)
                          )}
                          key={col.id}
                        >
                          {col.id === "isActive" ? (
                            <Status active={row.isActive} />
                          ) : (
                            col.render(m, row)
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {shown.length === 0 ? (
              <p className="px-4 py-6 text-sm text-fg-muted">No funds to show.</p>
            ) : null}
          </div>
        </>
      )}

      {phone ? null : pagination("Ranking pages, bottom")}
      {note ? (
        <p className="border-t border-line px-4 py-3 text-xs text-fg-muted sm:px-5">{note}</p>
      ) : null}
    </section>
  );
};

export default RankingTable;
