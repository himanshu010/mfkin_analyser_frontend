import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SectorRail from "../SectorRail";

describe("SectorRail", () => {
  it("lists sectors and marks the chosen one, without scrolling a row that fits", () => {
    const onSelect = vi.fn();
    const scrollTo = vi.fn();
    Element.prototype.scrollTo = scrollTo;
    render(
      <SectorRail
        onSearchChange={() => {}}
        onSelect={onSelect}
        search=""
        sectors={["All Funds", "Banking"]}
        selected="Banking"
      />
    );
    expect(screen.getByRole("heading", { name: "Sectors 2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Banking" })).toHaveAttribute("aria-pressed", "true");
    expect(scrollTo).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "All Funds" }));
    expect(onSelect).toHaveBeenCalledWith("All Funds");
    delete Element.prototype.scrollTo;
  });

  it("scrolls a row wider than the screen to centre the chosen chip", () => {
    const scrollTo = vi.fn();
    Element.prototype.scrollTo = scrollTo;
    const sizes = { scrollWidth: 800, clientWidth: 300, offsetLeft: 500, offsetWidth: 100 };
    const saved = Object.keys(sizes).map((key) => [
      key,
      Object.getOwnPropertyDescriptor(HTMLElement.prototype, key),
    ]);
    for (const [key, value] of Object.entries(sizes))
      Object.defineProperty(HTMLElement.prototype, key, { configurable: true, get: () => value });
    render(
      <SectorRail
        onSearchChange={() => {}}
        onSelect={() => {}}
        search=""
        sectors={["A", "B"]}
        selected="B"
      />
    );
    expect(scrollTo).toHaveBeenCalledWith({ left: 400, behavior: "smooth" });
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(HTMLElement.prototype, key, descriptor);
      else delete HTMLElement.prototype[key];
    }
    delete Element.prototype.scrollTo;
  });

  it("does nothing when no chip is chosen", () => {
    render(
      <SectorRail
        onSearchChange={() => {}}
        onSelect={() => {}}
        search=""
        sectors={["A"]}
        selected="Z"
      />
    );
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute("aria-pressed", "false");
  });

  it("filters, clears, and says when nothing matches", () => {
    const onSearchChange = vi.fn();
    const { rerender } = render(
      <SectorRail
        onSearchChange={onSearchChange}
        onSelect={() => {}}
        search=""
        sectors={["Banking"]}
        selected=""
      />
    );
    fireEvent.change(screen.getByRole("searchbox", { name: "Filter sectors" }), {
      target: { value: "zz" },
    });
    expect(onSearchChange).toHaveBeenCalledWith("zz");
    rerender(
      <SectorRail
        onSearchChange={onSearchChange}
        onSelect={() => {}}
        search="zz"
        sectors={[]}
        selected=""
      />
    );
    expect(screen.getByText("No sector matches “zz”.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear filter sectors" }));
    expect(onSearchChange).toHaveBeenLastCalledWith("");
  });
});
