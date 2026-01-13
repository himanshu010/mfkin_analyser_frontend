import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import ThemeSelector from "../ThemeSelector";
import { renderWithProviders } from "../../test/testUtils";

describe("ThemeSelector", () => {
  it("renders all theme options", () => {
    renderWithProviders(<ThemeSelector />);
    expect(screen.getByRole("button", { name: "Light" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dark" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Funky" })).toBeInTheDocument();
  });

  it("has light theme selected by default", () => {
    renderWithProviders(<ThemeSelector />);
    const lightButton = screen.getByRole("button", { name: "Light" });
    expect(lightButton).toHaveAttribute("aria-pressed", "true");
  });

  it("changes theme when clicking dark button", () => {
    const { store } = renderWithProviders(<ThemeSelector />);
    const darkButton = screen.getByRole("button", { name: "Dark" });
    fireEvent.click(darkButton);
    expect(store.getState().theme.current).toBe("dark");
  });

  it("changes theme when clicking funky button", () => {
    const { store } = renderWithProviders(<ThemeSelector />);
    const funkyButton = screen.getByRole("button", { name: "Funky" });
    fireEvent.click(funkyButton);
    expect(store.getState().theme.current).toBe("funky");
  });

  it("does not change theme when clicking already selected", () => {
    const { store } = renderWithProviders(<ThemeSelector />);
    const lightButton = screen.getByRole("button", { name: "Light" });
    fireEvent.click(lightButton);
    expect(store.getState().theme.current).toBe("light");
  });

  it("renders LightModeIcon", () => {
    renderWithProviders(<ThemeSelector />);
    expect(screen.getByTestId("LightModeIcon")).toBeInTheDocument();
  });

  it("renders DarkModeIcon", () => {
    renderWithProviders(<ThemeSelector />);
    expect(screen.getByTestId("DarkModeIcon")).toBeInTheDocument();
  });

  it("renders AutoAwesomeIcon", () => {
    renderWithProviders(<ThemeSelector />);
    expect(screen.getByTestId("AutoAwesomeIcon")).toBeInTheDocument();
  });
});
