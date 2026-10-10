import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ThemeSelector from "../ThemeSelector";
import { renderWithProviders } from "../../test/testUtils";

describe("ThemeSelector", () => {
  it("offers the three themes with the current one checked", () => {
    renderWithProviders(<ThemeSelector />, { preloadedState: { theme: { current: "light" } } });
    expect(screen.getByRole("radiogroup", { name: "Theme" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Light" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Dark" })).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("radio", { name: "Funky" })).toBeInTheDocument();
  });

  it("switches and remembers the theme", () => {
    const { store } = renderWithProviders(<ThemeSelector />, {
      preloadedState: { theme: { current: "light" } },
    });
    fireEvent.click(screen.getByRole("radio", { name: "Funky" }));
    expect(store.getState().theme.current).toBe("funky");
    expect(localStorage.getItem("theme")).toBe("funky");
    fireEvent.keyDown(screen.getByRole("radio", { name: "Funky" }), { key: "ArrowRight" });
    expect(store.getState().theme.current).toBe("light");
  });
});
