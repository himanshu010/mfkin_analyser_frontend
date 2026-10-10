import { fireEvent, render, screen } from "@testing-library/react";
import { Coins } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import Footer from "../Footer";
import FundSpotlight from "../FundSpotlight";
import InsightList from "../InsightList";
import Logo from "../Logo";
import Notice from "../Notice";
import { renderWithProviders } from "../../test/testUtils";

describe("InsightList", () => {
  it("lists entries with values", () => {
    render(
      <InsightList
        empty="None"
        icon={Coins}
        items={[
          { key: "1", name: "Big Fund", value: 10, display: "₹1 Cr" },
          { key: "2", name: "Small Fund", value: 0, display: "₹0 Cr" },
        ]}
        title="Largest"
      />
    );
    expect(screen.getByRole("region", { name: "Largest" })).toBeInTheDocument();
    expect(screen.getByText("Big Fund")).toHaveAttribute("title", "Big Fund");
    expect(screen.getByText("₹1 Cr")).toBeInTheDocument();
  });

  it("says when there is nothing to list", () => {
    render(<InsightList empty="Nothing here" icon={Coins} items={[]} title="Largest" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("draws empty bars when every value is zero", () => {
    render(
      <InsightList
        empty="None"
        icon={Coins}
        items={[{ key: "1", name: "Zero", value: 0, display: "0" }]}
        title="Largest"
      />
    );
    expect(screen.getByText("Zero")).toBeInTheDocument();
  });
});

describe("FundSpotlight", () => {
  const details = {
    schemeCode: 120594,
    schemeName: "ICICI Technology Fund",
    meta: { fund_house: "ICICI Prudential" },
    latestNav: "194.75",
    returns: { year1: 12.5, year3: -1, year5: null },
    metrics: { aum: 150000, expenseRatio: 1.1, peRatio: 30.25, riskRating: "Very High" },
  };

  it("shows a lookup in progress", () => {
    render(<FundSpotlight onClose={() => {}} query="icici" status="loading" />);
    expect(screen.getByRole("status")).toHaveTextContent("Looking up “icici”…");
  });

  it("says when no fund matches, and closes", () => {
    const onClose = vi.fn();
    render(<FundSpotlight onClose={onClose} query="nope" status="failed" />);
    expect(screen.getByRole("alert")).toHaveTextContent("No fund matches “nope”.");
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("renders nothing before a search", () => {
    const { container } = render(<FundSpotlight onClose={() => {}} status="idle" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the fund's figures and rank", () => {
    const onClose = vi.fn();
    render(<FundSpotlight details={details} onClose={onClose} rank={3} status="succeeded" />);
    expect(screen.getByRole("heading", { name: "ICICI Technology Fund" })).toBeInTheDocument();
    expect(
      screen.getByText("Scheme 120594 · ICICI Prudential · ranked #3 in its sector")
    ).toBeInTheDocument();
    expect(screen.getByText("₹194.75")).toBeInTheDocument();
    expect(screen.getByText("+12.50%")).toHaveClass("text-up");
    expect(screen.getByText("-1.00%")).toHaveClass("text-down");
    expect(screen.getByText("₹15.0K Cr")).toBeInTheDocument();
    expect(screen.getByText("Very High")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("copes with a fund missing most fields", () => {
    render(
      <FundSpotlight
        details={{ schemeCode: 1, schemeName: "Bare" }}
        onClose={() => {}}
        status="succeeded"
      />
    );
    expect(screen.getByText("Scheme 1")).toBeInTheDocument();
    expect(screen.getAllByText("—")).toHaveLength(8);
  });
});

describe("Notice", () => {
  it("shows information, optionally with a working bar", () => {
    render(<Notice busy>Loading more</Notice>);
    expect(screen.getByRole("status")).toHaveTextContent("Loading more");
    expect(screen.getByRole("progressbar", { name: "Loading" })).toBeInTheDocument();
  });

  it("shows an error with an action", () => {
    render(
      <Notice action={<button type="button">Retry</button>} tone="error">
        Failed
      </Notice>
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Failed");
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});

describe("Logo and Footer", () => {
  it("shows the name, with or without a subtitle", () => {
    const { rerender } = render(<Logo />);
    expect(screen.getByText("Sector intelligence and fund scouting")).toBeInTheDocument();
    rerender(<Logo subtitle="" />);
    expect(screen.queryByText("Sector intelligence and fund scouting")).not.toBeInTheDocument();
  });

  it("carries the data note and the phone theme switch", () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText(/Not investment advice/)).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: "Theme" })).toBeInTheDocument();
  });
});
