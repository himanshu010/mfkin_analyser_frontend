import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SectorOverview from "../SectorOverview";

const base = {
  name: "Banking",
  generatedAt: "2024-01-01T10:00:00Z",
  totalFunds: 10,
  stats: { averageReturn: 5.5, averagePe: 21.24, averagePb: 3.01, gainers: 7 },
  shownCount: 10,
  timeframeLong: "1 year",
  plans: [],
  onTogglePlan: () => {},
  filter: "",
  onFilterChange: () => {},
};

describe("SectorOverview", () => {
  it("shows the sector, when it was ranked and its numbers", () => {
    render(<SectorOverview {...base} />);
    expect(screen.getByRole("heading", { level: 1, name: "Banking" })).toBeInTheDocument();
    expect(screen.getByText(/^Ranked /)).toBeInTheDocument();
    expect(screen.getByText("+5.50%")).toHaveClass("text-up");
    expect(screen.getByText("7 gaining over 1 year")).toBeInTheDocument();
    expect(screen.getByText("21.2")).toBeInTheDocument();
    expect(screen.getByText("3.0")).toBeInTheDocument();
    expect(screen.queryByText(/match the filters|returns$/)).not.toBeInTheDocument();
  });

  it("explains a smaller count, with and without filters", () => {
    const { rerender } = render(<SectorOverview {...base} shownCount={8} />);
    expect(screen.getByText("8 with 1 year returns")).toBeInTheDocument();
    rerender(<SectorOverview {...base} filter="hdfc" shownCount={2} />);
    expect(screen.getByText("2 match the filters")).toBeInTheDocument();
  });

  it("toggles plans and filters funds", () => {
    const onTogglePlan = vi.fn();
    const onFilterChange = vi.fn();
    render(
      <SectorOverview
        {...base}
        filter="x"
        onFilterChange={onFilterChange}
        onTogglePlan={onTogglePlan}
        plans={["direct"]}
      />
    );
    expect(screen.getByRole("button", { name: "Direct" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "IDCW" }));
    expect(onTogglePlan).toHaveBeenCalledWith("idcw");
    fireEvent.change(screen.getByRole("searchbox", { name: "Filter funds" }), {
      target: { value: "y" },
    });
    expect(onFilterChange).toHaveBeenCalledWith("y");
    fireEvent.click(screen.getByRole("button", { name: "Clear filter funds" }));
    expect(onFilterChange).toHaveBeenLastCalledWith("");
  });

  it("handles a sector with no data yet", () => {
    render(
      <SectorOverview
        {...base}
        generatedAt={undefined}
        name=""
        stats={{ averageReturn: null, averagePe: null, averagePb: null, gainers: 0 }}
        totalFunds={undefined}
      />
    );
    expect(screen.getByRole("heading", { level: 1, name: "Choose a sector" })).toBeInTheDocument();
    expect(screen.getByText("Choose a sector above to see its rankings.")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getAllByText("—")).toHaveLength(3);
  });
});
