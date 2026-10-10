import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AppPreloader from "../AppPreloader";

describe("AppPreloader", () => {
  it("shows the default message and a loading bar", () => {
    render(<AppPreloader />);
    expect(screen.getByRole("heading", { name: "MFkin Analyser" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Loading...");
    expect(
      screen.getByRole("progressbar", { name: "Loading the sector catalog" })
    ).toBeInTheDocument();
  });

  it("shows a custom message and actions", () => {
    render(
      <AppPreloader actions={<button type="button">Retry</button>} message="Still waking up" />
    );
    expect(screen.getByRole("status")).toHaveTextContent("Still waking up");
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
