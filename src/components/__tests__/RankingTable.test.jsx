import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import RankingTable, { descendingComparator, formatPercent } from "../RankingTable";
import { mockMedia } from "../../test/testUtils";

const full = {
  aum: 1500,
  expenseRatio: 0.5,
  category: "Sectoral",
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
  riskRating: "Very High",
  fundManager: "A Manager",
  inceptionDate: "Jan 2020",
};
const rows = [
  {
    rank: 1,
    schemeCode: "1",
    schemeName: "Alpha Fund",
    returns: 25.5,
    isActive: true,
    metrics: full,
  },
  {
    rank: 2,
    schemeCode: "2",
    schemeName: "Beta Fund",
    returns: -5.2,
    isActive: false,
    metrics: { aum: 500, alpha: -1.5, category: "Thematic", fundManager: null },
  },
  {
    rank: 3,
    schemeCode: "3",
    schemeName: "Gamma Fund",
    returns: 0,
    isActive: true,
    metrics: { aum: null, category: null },
  },
  { rank: 4, schemeCode: "4", schemeName: "Delta Fund", returns: 3, isActive: true },
];
const many = Array.from({ length: 1201 }, (_, i) => ({
  rank: i + 1,
  schemeCode: String(i + 1),
  schemeName: `Fund ${i + 1}`,
  returns: 100 - i / 10,
  isActive: true,
  metrics: {},
}));

const bodyNames = () =>
  within(screen.getByRole("table"))
    .getAllByRole("rowheader")
    .map((cell) => cell.textContent);

afterEach(() => {
  delete Element.prototype.scrollTo;
});

describe("helpers", () => {
  it("re-exports formatPercent", () => {
    expect(formatPercent(1)).toBe("1.00%");
  });

  it("compares descending with missing values last", () => {
    const a = { returns: 5, schemeName: "A", metrics: { aum: null } };
    const b = { returns: 3, schemeName: "B", metrics: { aum: 10 } };
    expect(descendingComparator(a, b, "returns")).toBe(-1);
    expect(descendingComparator(b, a, "returns")).toBe(1);
    expect(descendingComparator(a, a, "returns")).toBe(0);
    expect(descendingComparator(a, b, "schemeName")).toBeGreaterThan(0);
    expect(descendingComparator(a, b, "aum")).toBe(1);
    expect(descendingComparator(b, a, "aum")).toBe(-1);
    expect(descendingComparator(a, { metrics: {} }, "aum")).toBe(0);
  });
});

describe("RankingTable on wide screens", () => {
  it("shows every fund with its figures", () => {
    render(<RankingTable note="Data note" rows={rows} timeframeLabel="1Y" />);
    expect(screen.getByRole("heading", { name: "Full ranking" })).toBeInTheDocument();
    expect(screen.getByText("1Y returns · select a column to sort")).toBeInTheDocument();
    expect(screen.getByText("4 funds")).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")).toHaveLength(19);
    const alpha = screen.getByRole("row", { name: /Alpha Fund/ });
    expect(within(alpha).getByText("+25.50%")).toHaveClass("text-up");
    expect(within(alpha).getByText("₹150 Cr")).toBeInTheDocument();
    expect(within(alpha).getByText("Active")).toBeInTheDocument();
    expect(within(alpha).getByText("A Manager")).toBeInTheDocument();
    expect(within(alpha).getByText("2.50")).toHaveClass("text-up");
    const beta = screen.getByRole("row", { name: /Beta Fund/ });
    expect(within(beta).getByText("-5.20%")).toHaveClass("text-down");
    expect(within(beta).getByText("-1.50")).toHaveClass("text-down");
    expect(within(beta).getByText("Inactive")).toBeInTheDocument();
    expect(screen.getByText("Data note")).toBeInTheDocument();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("sorts by a column, flipping on a second click, missing values last", () => {
    render(<RankingTable rows={rows} />);
    expect(screen.getByText("— returns · select a column to sort")).toBeInTheDocument();
    const aum = screen.getByRole("button", { name: "AUM" });
    fireEvent.click(aum);
    expect(screen.getByRole("columnheader", { name: "AUM" })).toHaveAttribute(
      "aria-sort",
      "ascending"
    );
    expect(bodyNames()[0]).toContain("Beta Fund");
    expect(bodyNames().slice(-2).join()).toMatch(/Gamma Fund|Delta Fund/);
    fireEvent.click(aum);
    expect(screen.getByRole("columnheader", { name: "AUM" })).toHaveAttribute(
      "aria-sort",
      "descending"
    );
    expect(bodyNames()[0]).toContain("Alpha Fund");
    fireEvent.click(screen.getByRole("button", { name: "Fund" }));
    expect(bodyNames()[0]).toContain("Alpha Fund");
    expect(screen.getByRole("columnheader", { name: "Status" })).not.toHaveAttribute("aria-sort");
  });

  it("marks a searched fund and scrolls the table, not the page, to it", () => {
    const scrolled = [];
    Element.prototype.scrollTo = function scrollTo() {
      scrolled.push(this);
    };
    render(<RankingTable highlightCode="2" rows={rows} />);
    expect(screen.getByRole("row", { name: /Beta Fund/ })).toHaveClass("bg-primary-soft");
    expect(scrolled).toEqual([
      screen.getByRole("region", { name: "Ranking table, scrolls in both directions" }),
    ]);
    delete Element.prototype.scrollTo;
  });

  it("says when there is nothing to show", () => {
    render(<RankingTable rows={undefined} />);
    expect(screen.getByText("No funds to show.")).toBeInTheDocument();
    expect(screen.getByText("0 funds")).toBeInTheDocument();
  });

  it("pages very long lists", () => {
    const { rerender } = render(<RankingTable rows={many} />);
    const [top, bottom] = screen.getAllByRole("navigation");
    expect(top).toHaveAccessibleName("Ranking pages");
    expect(bottom).toHaveAccessibleName("Ranking pages, bottom");
    expect(within(top).getByText("1–100 of 1201")).toBeInTheDocument();
    expect(within(top).getByRole("button", { name: "Previous page" })).toBeDisabled();
    fireEvent.click(within(top).getByRole("button", { name: "Next page" }));
    expect(within(top).getByText("101–200 of 1201")).toBeInTheDocument();
    fireEvent.change(within(top).getByRole("combobox", { name: "Rows per page" }), {
      target: { value: "500" },
    });
    expect(within(top).getByText("1–500 of 1201")).toBeInTheDocument();
    fireEvent.click(within(top).getByRole("button", { name: "Next page" }));
    fireEvent.click(within(top).getByRole("button", { name: "Next page" }));
    expect(within(top).getByText("1001–1201 of 1201")).toBeInTheDocument();
    expect(within(top).getByRole("button", { name: "Next page" })).toBeDisabled();
    fireEvent.click(within(top).getByRole("button", { name: "Previous page" }));
    expect(within(top).getByText("501–1000 of 1201")).toBeInTheDocument();
    rerender(<RankingTable rows={many.slice(0, 1100)} />);
    expect(
      within(screen.getAllByRole("navigation")[0]).getByText("1–500 of 1100")
    ).toBeInTheDocument();
  });
});

describe("RankingTable on phones", () => {
  it("shows cards with a sort control", () => {
    mockMedia("max-width: 639px");
    render(<RankingTable highlightCode="3" rows={rows} timeframeLabel="3Y" />);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByText("3Y returns · choose how to sort below")).toBeInTheDocument();
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(within(items[0]).getByText("A Manager")).toBeInTheDocument();
    expect(items[2]).toHaveClass("bg-primary-soft");
    fireEvent.change(screen.getByRole("combobox", { name: "Sort by" }), {
      target: { value: "returns" },
    });
    expect(within(screen.getAllByRole("listitem")[0]).getByText("Beta Fund")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Ascending; switch to descending" }));
    expect(within(screen.getAllByRole("listitem")[0]).getByText("Alpha Fund")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Descending; switch to ascending" }));
    expect(within(screen.getAllByRole("listitem")[0]).getByText("Beta Fund")).toBeInTheDocument();
  });

  it("keeps a wide-screen sort the phone list cannot show", () => {
    const { rerender } = render(<RankingTable rows={rows} />);
    fireEvent.click(screen.getByRole("button", { name: "Beta" }));
    mockMedia("max-width: 639px");
    rerender(<RankingTable rows={[...rows]} />);
    expect(screen.getByRole("combobox", { name: "Sort by" })).toHaveValue("rank");
  });

  it("pages and handles an empty list", () => {
    mockMedia("max-width: 639px");
    const { rerender } = render(<RankingTable rows={many} />);
    expect(screen.getAllByRole("navigation")).toHaveLength(1);
    rerender(<RankingTable rows={[]} />);
    expect(screen.getByText("No funds to show.")).toBeInTheDocument();
  });
});
