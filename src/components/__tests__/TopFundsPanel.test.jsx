import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TopFundsPanel from "../TopFundsPanel";

const fund = (code, name, returns, metrics = {}) => ({
  schemeCode: code,
  schemeName: name,
  returns,
  metrics,
});
const topFunds = {
  oneYear: [
    fund("1", "One Year Leader", 25.5, { aum: 1500, expenseRatio: 0.5, peRatio: 20, pbRatio: 3 }),
    fund("2", "Tied Fund A", 25.5),
    fund("3", "Tied Fund B", 25.5),
    fund("4", "Not Shown", 25.5),
  ],
  threeYear: [fund("5", "Three Year Leader", -2.4)],
  fiveYear: [],
};

describe("TopFundsPanel", () => {
  it("renders nothing without leaders", () => {
    const { container } = render(<TopFundsPanel activeTimeframe="oneYear" topFunds={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows each period's leader, its figures and ties", () => {
    render(<TopFundsPanel activeTimeframe="oneYear" topFunds={topFunds} />);
    const one = screen.getByRole("article", { name: "1Y leader" });
    expect(within(one).getByRole("heading", { name: "One Year Leader" })).toBeInTheDocument();
    expect(within(one).getByText("+25.50%")).toHaveClass("text-up");
    expect(within(one).getByText("₹150 Cr")).toBeInTheDocument();
    expect(within(one).getByText("0.50%")).toBeInTheDocument();
    expect(within(one).getByText("Tied with Tied Fund A, Tied Fund B")).toBeInTheDocument();
    expect(
      within(screen.getByRole("article", { name: "3Y leader" })).getByText("-2.40%")
    ).toHaveClass("text-down");
    expect(
      within(screen.getByRole("article", { name: "5Y leader" })).getByText(
        "No leader for this period yet."
      )
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("switches the period from a card", () => {
    const onSelect = vi.fn();
    render(
      <TopFundsPanel
        activeTimeframe="threeYear"
        onSelectTimeframe={onSelect}
        topFunds={{ ...topFunds, oneYear: [fund("9", "Flat", null)] }}
      />
    );
    expect(screen.getByRole("button", { name: "Rank by 3-year return" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    fireEvent.click(screen.getByRole("button", { name: "Rank by 1-year return" }));
    expect(onSelect).toHaveBeenCalledWith("oneYear");
    expect(
      within(screen.getByRole("article", { name: "1Y leader" })).getAllByText("—").length
    ).toBeGreaterThan(0);
  });

  it("copes with a period missing from the data", () => {
    render(<TopFundsPanel activeTimeframe="oneYear" topFunds={{ oneYear: topFunds.oneYear }} />);
    expect(screen.getAllByText("No leader for this period yet.")).toHaveLength(2);
  });
});
