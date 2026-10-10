import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Header from "../Header";
import { renderWithProviders } from "../../test/testUtils";

const setup = (props = {}) => {
  const handlers = {
    onSearchModeChange: vi.fn(),
    onQueryChange: vi.fn(),
    onSearch: vi.fn(),
    onTimeframeChange: vi.fn(),
    onRefresh: vi.fn(),
  };
  renderWithProviders(
    <Header
      query=""
      refreshing={false}
      searchMode="sector"
      timeframe="oneYear"
      {...handlers}
      {...props}
    />
  );
  return handlers;
};

describe("Header", () => {
  it("searches sectors, and only when there is a query", () => {
    const handlers = setup({ query: "bank" });
    const form = screen.getByRole("search");
    expect(within(form).getByRole("searchbox", { name: "Search sectors" })).toHaveAttribute(
      "placeholder",
      "Search a sector, e.g. Banking"
    );
    fireEvent.submit(form);
    expect(handlers.onSearch).toHaveBeenCalled();
    fireEvent.change(within(form).getByRole("searchbox"), { target: { value: "pharma" } });
    expect(handlers.onQueryChange).toHaveBeenCalledWith("pharma");
    fireEvent.click(within(form).getByRole("button", { name: "Clear search sectors" }));
    expect(handlers.onQueryChange).toHaveBeenLastCalledWith("");
  });

  it("disables Search for an empty query and labels fund mode", () => {
    setup({ query: "  ", searchMode: "fund" });
    expect(screen.getByRole("button", { name: "Search" })).toBeDisabled();
    expect(screen.getByRole("searchbox", { name: "Search funds" })).toHaveAttribute(
      "placeholder",
      "Search a fund by name or scheme code"
    );
  });

  it("switches mode and return period", () => {
    const handlers = setup();
    fireEvent.click(screen.getAllByRole("radio", { name: "Fund" })[0]);
    expect(handlers.onSearchModeChange).toHaveBeenCalledWith("fund");
    fireEvent.click(screen.getAllByRole("radio", { name: "5Y" })[0]);
    expect(handlers.onTimeframeChange).toHaveBeenCalledWith("fiveYear");
    expect(screen.getAllByRole("radiogroup", { name: "Return period" })).toHaveLength(2);
  });

  it("refreshes, and shows when it is busy", () => {
    const handlers = setup();
    fireEvent.click(screen.getByRole("button", { name: "Refresh data" }));
    expect(handlers.onRefresh).toHaveBeenCalled();
  });

  it("shows a refresh in progress", () => {
    setup({ refreshing: true });
    expect(screen.getByRole("button", { name: "Refreshing data" })).toBeDisabled();
    expect(screen.getByText("Refreshing…")).toBeInTheDocument();
  });
});
