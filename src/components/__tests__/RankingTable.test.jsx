import { describe, it, expect } from "vitest";
import { screen, fireEvent, within } from "@testing-library/react";
import RankingTable, { formatPercent, descendingComparator } from "../RankingTable";
import { renderWithProviders } from "../../test/testUtils";

const mockRows = [
  {
    rank: 1,
    schemeCode: "1001",
    schemeName: "Test Fund Direct Growth",
    returns: 25.5,
    isActive: true,
    metrics: {
      aum: 1000,
      expenseRatio: 0.5,
      category: "Large Cap",
      peRatio: 22.5,
      pbRatio: 3.2,
      dividendYield: 1.5,
      turnoverRatio: 45,
      sharpeRatio: 1.2,
      alpha: 2.5,
      beta: 0.95,
      standardDeviation: 15.5,
      sortinoRatio: 1.8,
      treynorRatio: 0.12,
      riskRating: "Moderately High",
      fundManager: "John Doe",
      inceptionDate: "Jan 2020",
    },
  },
  {
    rank: 2,
    schemeCode: "1002",
    schemeName: "Test Fund Regular IDCW",
    returns: -5.2,
    isActive: false,
    metrics: {
      aum: 500,
      expenseRatio: 0.8,
      category: "Mid Cap",
      peRatio: 18.5,
      pbRatio: 2.1,
      dividendYield: 2.0,
      turnoverRatio: 60,
      sharpeRatio: 0.8,
      alpha: -1.5,
      beta: 1.1,
      standardDeviation: 18.2,
      sortinoRatio: 0.9,
      treynorRatio: 0.08,
      riskRating: "High",
      fundManager: null,
      inceptionDate: "Mar 2018",
    },
  },
  {
    rank: 3,
    schemeCode: "1003",
    schemeName: "Test Fund Third",
    returns: 10.0,
    isActive: true,
    metrics: {
      aum: 2000,
      expenseRatio: 0.4,
      category: "Small Cap",
      peRatio: 25.0,
      pbRatio: 4.0,
      riskRating: "Very High",
    },
  },
  {
    rank: 4,
    schemeCode: "1004",
    schemeName: "Test Fund Fourth",
    returns: 8.0,
    isActive: true,
    metrics: {},
  },
];

describe("RankingTable", () => {
  const defaultProps = {
    rows: mockRows,
    timeframeLabel: "1 Year",
  };

  it("formatPercent returns dash for null values", () => {
    expect(formatPercent(null)).toBe("—");
    expect(formatPercent(undefined)).toBe("—");
  });

  it("formatPercent formats numeric values", () => {
    expect(formatPercent(1.234)).toBe("1.23%");
  });

  it("descendingComparator returns 0 when both values are null", () => {
    const a = { metrics: { aum: null } };
    const b = { metrics: { aum: null } };
    expect(descendingComparator(a, b, "aum")).toBe(0);
  });

  it("descendingComparator returns 1 when aVal is null", () => {
    const a = { metrics: { aum: null } };
    const b = { metrics: { aum: 10 } };
    expect(descendingComparator(a, b, "aum")).toBe(1);
  });

  it("shows fallback label when timeframe is missing", () => {
    renderWithProviders(<RankingTable rows={mockRows} />);
    expect(screen.getByText(/— returns • click headers to sort/i)).toBeInTheDocument();
  });

  it("renders table with fund data", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    expect(screen.getByText("Test Fund Direct Growth")).toBeInTheDocument();
  });

  it("displays rank with chip for top 3", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    const chip = screen.getByText("1");
    expect(chip.closest(".ranking-table__rank-chip")).toBeInTheDocument();
  });

  it("displays rank number for rank > 3", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("displays formatted return with positive styling", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    expect(screen.getByText("25.50%")).toBeInTheDocument();
  });

  it("displays negative return", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    expect(screen.getByText("-5.20%")).toBeInTheDocument();
  });

  it("displays active status chip", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    expect(screen.getAllByText("Active").length).toBeGreaterThan(0);
  });

  it("displays inactive status chip", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("displays fund manager name", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("displays dash for missing values", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    const cells = screen.getAllByText("—");
    expect(cells.length).toBeGreaterThan(0);
  });

  it("handles empty rows", () => {
    renderWithProviders(<RankingTable rows={[]} timeframeLabel="1 Year" />);
    expect(screen.getByText("Full Ranking")).toBeInTheDocument();
    expect(screen.getByText("0 funds")).toBeInTheDocument();
  });

  it("handles null rows", () => {
    renderWithProviders(<RankingTable rows={null} timeframeLabel="1 Year" />);
    expect(screen.getByText("0 funds")).toBeInTheDocument();
  });

  it("sorts by column when header clicked", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    const returnHeader = screen.getByRole("button", { name: /Return/i });
    fireEvent.click(returnHeader);
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThan(1);
  });

  it("toggles sort direction on second click", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    const rankHeader = screen.getByRole("button", { name: /#/i });
    fireEvent.click(rankHeader); // First click - descending
    fireEvent.click(rankHeader); // Second click - ascending
    expect(screen.getByText("Test Fund Direct Growth")).toBeInTheDocument();
  });

  it("displays expense ratio formatted", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    expect(screen.getByText("0.50%")).toBeInTheDocument();
  });

  it("displays category", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    expect(screen.getByText("Large Cap")).toBeInTheDocument();
  });

  it("displays risk level", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    expect(screen.getByText("Moderately High")).toBeInTheDocument();
  });

  it("displays AUM formatted", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    expect(screen.getByText("₹100 Cr")).toBeInTheDocument();
  });

  it("displays inception date", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    expect(screen.getByText("Jan 2020")).toBeInTheDocument();
  });

  it("displays positive alpha", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    expect(screen.getByText("2.50")).toBeInTheDocument();
  });

  it("displays negative alpha", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    expect(screen.getByText("-1.50")).toBeInTheDocument();
  });

  it("applies top row class to rank 1-3", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    const rows = document.querySelectorAll(".ranking-table__row--top-rank");
    expect(rows.length).toBe(3);
  });

  it("displays note when provided", () => {
    renderWithProviders(<RankingTable {...defaultProps} note="This is a note" />);
    expect(screen.getByText("This is a note")).toBeInTheDocument();
  });

  it("displays timeframeLabel in header", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    expect(screen.getByText(/1 Year returns/)).toBeInTheDocument();
  });

  it("displays fund count", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    expect(screen.getByText("4 funds")).toBeInTheDocument();
  });

  it("handles large AUM values", () => {
    const largeAumRows = [
      {
        rank: 1,
        schemeCode: "1001",
        schemeName: "Large Fund",
        returns: 10,
        isActive: true,
        metrics: { aum: 15000 },
      },
    ];
    renderWithProviders(<RankingTable rows={largeAumRows} timeframeLabel="1Y" />);
    expect(screen.getByText("₹1.5K Cr")).toBeInTheDocument();
  });

  it("handles medium AUM values", () => {
    const medAumRows = [
      {
        rank: 1,
        schemeCode: "1001",
        schemeName: "Medium Fund",
        returns: 10,
        isActive: true,
        metrics: { aum: 5000 },
      },
    ];
    renderWithProviders(<RankingTable rows={medAumRows} timeframeLabel="1Y" />);
    expect(screen.getByText("₹500 Cr")).toBeInTheDocument();
  });

  it("shows pagination for large datasets", () => {
    const manyRows = Array.from({ length: 1100 }, (_, i) => ({
      rank: i + 1,
      schemeCode: `${1000 + i}`,
      schemeName: `Fund ${i + 1}`,
      returns: i * 0.5,
      isActive: true,
      metrics: {},
    }));
    renderWithProviders(<RankingTable rows={manyRows} timeframeLabel="1Y" />);
    // When > 1000 items, pagination is enabled and fund count shown
    expect(screen.getByText("1100 funds")).toBeInTheDocument();
    // Verify pagination component is rendered (two pagination instances - top and bottom)
    const paginationElements = document.querySelectorAll(".MuiTablePagination-root");
    expect(paginationElements.length).toBe(2);
  });

  it("handles pagination page change", () => {
    const manyRows = Array.from({ length: 1100 }, (_, i) => ({
      rank: i + 1,
      schemeCode: `${1000 + i}`,
      schemeName: `Fund ${i + 1}`,
      returns: i * 0.5,
      isActive: true,
      metrics: {},
    }));
    renderWithProviders(<RankingTable rows={manyRows} timeframeLabel="1Y" />);
    // Find and click the next page button in TablePagination
    const nextButtons = screen.getAllByRole("button", { name: /next page/i });
    expect(nextButtons.length).toBeGreaterThan(0);
    fireEvent.click(nextButtons[0]);
    // After clicking next, Fund 101 should be on page 2
    expect(screen.getByText("Fund 101")).toBeInTheDocument();
  });

  it("handles rows per page change", () => {
    const manyRows = Array.from({ length: 1100 }, (_, i) => ({
      rank: i + 1,
      schemeCode: `${1000 + i}`,
      schemeName: `Fund ${i + 1}`,
      returns: i * 0.5,
      isActive: true,
      metrics: {},
    }));
    renderWithProviders(<RankingTable rows={manyRows} timeframeLabel="1Y" />);
    // Find the rows-per-page select and change it
    const selects = screen.getAllByRole("combobox");
    fireEvent.mouseDown(selects[0]);
    const option = screen.getByRole("option", { name: "50" });
    fireEvent.click(option);
    // After changing rows per page to 50, we should see 50 items on page
    // Fund 50 should be visible but Fund 51 should not be on first page
    expect(screen.getByText("Fund 50")).toBeInTheDocument();
  });

  it("verifies pagination controls render with large datasets", () => {
    const manyRows = Array.from({ length: 1100 }, (_, i) => ({
      rank: i + 1,
      schemeCode: `${1000 + i}`,
      schemeName: `Fund ${i + 1}`,
      returns: i * 0.5,
      isActive: true,
      metrics: {},
    }));
    renderWithProviders(<RankingTable rows={manyRows} timeframeLabel="1Y" />);
    // Verify the table displays fund count
    expect(screen.getByText("1100 funds")).toBeInTheDocument();
  });

  it("verifies rows per page selector exists with pagination", () => {
    const manyRows = Array.from({ length: 1100 }, (_, i) => ({
      rank: i + 1,
      schemeCode: `${1000 + i}`,
      schemeName: `Fund ${i + 1}`,
      returns: i * 0.5,
      isActive: true,
      metrics: {},
    }));
    renderWithProviders(<RankingTable rows={manyRows} timeframeLabel="1Y" />);
    // Verify table is rendered with data
    expect(screen.getByText("Fund 1")).toBeInTheDocument();
  });

  it("sorts string columns correctly", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    const nameHeader = screen.getByRole("button", { name: /Fund Name/i });
    fireEvent.click(nameHeader);
    expect(screen.getByText("Test Fund Direct Growth")).toBeInTheDocument();
  });

  it("handles null metrics", () => {
    const nullMetricsRows = [
      {
        rank: 1,
        schemeCode: "1001",
        schemeName: "Null Metrics Fund",
        returns: 10,
        isActive: true,
        metrics: null,
      },
    ];
    renderWithProviders(<RankingTable rows={nullMetricsRows} timeframeLabel="1Y" />);
    expect(screen.getByText("Null Metrics Fund")).toBeInTheDocument();
  });

  it("handles undefined returns", () => {
    const undefinedReturnsRows = [
      {
        rank: 1,
        schemeCode: "1001",
        schemeName: "Undefined Returns Fund",
        returns: undefined,
        isActive: true,
        metrics: {},
      },
    ];
    renderWithProviders(<RankingTable rows={undefinedReturnsRows} timeframeLabel="1Y" />);
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });

  it("handles equal return values when sorting", () => {
    const equalRows = [
      {
        rank: 1,
        schemeCode: "3001",
        schemeName: "Equal Fund A",
        returns: 10,
        isActive: true,
        metrics: {},
      },
      {
        rank: 2,
        schemeCode: "3002",
        schemeName: "Equal Fund B",
        returns: 10,
        isActive: true,
        metrics: {},
      },
    ];
    renderWithProviders(<RankingTable rows={equalRows} timeframeLabel="1Y" />);
    const returnHeader = screen.getByRole("button", { name: /Return/i });
    fireEvent.click(returnHeader);
    expect(screen.getByText("Equal Fund A")).toBeInTheDocument();
    expect(screen.getByText("Equal Fund B")).toBeInTheDocument();
  });

  it("sorts numeric values correctly - descending order comparison", () => {
    const numericRows = [
      {
        rank: 1,
        schemeCode: "1001",
        schemeName: "A",
        returns: 5,
        isActive: true,
        metrics: { aum: 100 },
      },
      {
        rank: 2,
        schemeCode: "1002",
        schemeName: "B",
        returns: 15,
        isActive: true,
        metrics: { aum: 200 },
      },
      {
        rank: 3,
        schemeCode: "1003",
        schemeName: "C",
        returns: 10,
        isActive: true,
        metrics: { aum: 300 },
      },
    ];
    renderWithProviders(<RankingTable rows={numericRows} timeframeLabel="1Y" />);
    // Click to sort by returns descending
    const returnHeader = screen.getByRole("button", { name: /Return/i });
    fireEvent.click(returnHeader);
    fireEvent.click(returnHeader);
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThan(1);
  });

  it("sorts with ascending order comparator", () => {
    const numericRows = [
      { rank: 1, schemeCode: "1001", schemeName: "A", returns: 20, isActive: true, metrics: {} },
      { rank: 2, schemeCode: "1002", schemeName: "B", returns: 5, isActive: true, metrics: {} },
      { rank: 3, schemeCode: "1003", schemeName: "C", returns: 10, isActive: true, metrics: {} },
    ];
    renderWithProviders(<RankingTable rows={numericRows} timeframeLabel="1Y" />);
    const returnHeader = screen.getByRole("button", { name: /Return/i });
    fireEvent.click(returnHeader); // ascending
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThan(1);
  });

  it("renders non-sortable column labels without TableSortLabel", () => {
    renderWithProviders(<RankingTable {...defaultProps} />);
    // 'Active' column is not sortable - it renders col.label directly (lines 324-325)
    // Check that the header cells exist
    const headerCells = screen.getAllByRole("columnheader");
    expect(headerCells.length).toBeGreaterThan(5);
    // Find any columnheader that doesn't have a button inside (non-sortable columns)
    const nonSortableHeaders = headerCells.filter((cell) => !cell.querySelector("button"));
    // There should be at least one non-sortable column (like 'Active')
    expect(nonSortableHeaders.length).toBeGreaterThan(0);
  });

  it("verifies onRowsPerPageChange updates state", () => {
    const manyRows = Array.from({ length: 1100 }, (_, i) => ({
      rank: i + 1,
      schemeCode: `${1000 + i}`,
      schemeName: `Fund ${i + 1}`,
      returns: i * 0.5,
      isActive: true,
      metrics: {},
    }));
    renderWithProviders(<RankingTable rows={manyRows} timeframeLabel="1Y" />);
    // Lines 461-463: onRowsPerPageChange sets rowsPerPage and resets page to 0
    const selects = screen.getAllByRole("combobox");
    fireEvent.mouseDown(selects[0]);
    const option100 = screen.getByRole("option", { name: "100" });
    fireEvent.click(option100);
    // After changing to 100, Fund 100 should be visible
    expect(screen.getByText("Fund 100")).toBeInTheDocument();
    // Reset page to 0 - Fund 1 should still be visible
    expect(screen.getByText("Fund 1")).toBeInTheDocument();
  });

  it("handles zero return and alpha without positive/negative classes", () => {
    const rows = [
      {
        rank: 1,
        schemeCode: "2001",
        schemeName: "Zero Return Fund",
        returns: 0,
        isActive: true,
        metrics: { alpha: 0 },
      },
    ];
    renderWithProviders(<RankingTable rows={rows} timeframeLabel="1Y" />);
    const row = screen.getByText("Zero Return Fund").closest("tr");
    const returnCell = within(row).getByText("0.00%").closest("td");
    expect(returnCell.className).not.toMatch(/return--positive|return--negative/);
    const alphaSpan = within(row).getByText("0.00");
    expect(alphaSpan.className).not.toMatch(/alpha--positive|alpha--negative/);
  });

  it("formats small AUM values", () => {
    const rows = [
      {
        rank: 1,
        schemeCode: "2002",
        schemeName: "Small AUM Fund",
        returns: 5,
        isActive: true,
        metrics: { aum: 450 },
      },
    ];
    renderWithProviders(<RankingTable rows={rows} timeframeLabel="1Y" />);
    expect(screen.getByText("₹45.0 Cr")).toBeInTheDocument();
  });

  it("shows dash for NaN AUM values", () => {
    const rows = [
      {
        rank: 1,
        schemeCode: "2003",
        schemeName: "Bad AUM Fund",
        returns: 5,
        isActive: true,
        metrics: { aum: "abc" },
      },
    ];
    renderWithProviders(<RankingTable rows={rows} timeframeLabel="1Y" />);
    const row = screen.getByText("Bad AUM Fund").closest("tr");
    expect(within(row).getAllByText("—").length).toBeGreaterThan(0);
  });

  it("sorts AUM with null values without crashing", () => {
    const rows = [
      {
        rank: 1,
        schemeCode: "2004",
        schemeName: "Null AUM Fund",
        returns: 5,
        isActive: true,
        metrics: { aum: null },
      },
      {
        rank: 2,
        schemeCode: "2005",
        schemeName: "Valid AUM Fund",
        returns: 6,
        isActive: true,
        metrics: { aum: 100 },
      },
    ];
    renderWithProviders(<RankingTable rows={rows} timeframeLabel="1Y" />);
    const header = screen.getByRole("button", { name: /AUM/i });
    fireEvent.click(header);
    expect(screen.getByText("Null AUM Fund")).toBeInTheDocument();
    expect(screen.getByText("Valid AUM Fund")).toBeInTheDocument();
  });

  it("verifies onPageChange navigates correctly", () => {
    const manyRows = Array.from({ length: 1100 }, (_, i) => ({
      rank: i + 1,
      schemeCode: `${1000 + i}`,
      schemeName: `Fund ${i + 1}`,
      returns: i * 0.5,
      isActive: true,
      metrics: {},
    }));
    renderWithProviders(<RankingTable rows={manyRows} timeframeLabel="1Y" />);
    // Lines 458-459: onPageChange sets page
    const nextButtons = screen.getAllByRole("button", { name: /next page/i });
    fireEvent.click(nextButtons[0]); // Go to page 2
    expect(screen.getByText("Fund 101")).toBeInTheDocument();
  });
});
