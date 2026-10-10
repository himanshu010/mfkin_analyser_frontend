import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RankingProgress from "../RankingProgress";

const step = (name) => screen.getByText(name).closest("li");

describe("RankingProgress", () => {
  it("starts with a default message and the first step in progress", () => {
    render(<RankingProgress progress={null} sector="Banking" />);
    expect(screen.getByText("Crunching rankings for Banking…")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Ranking Banking" })).not.toHaveAttribute(
      "aria-valuenow"
    );
    expect(step("Load funds")).toHaveTextContent("(in progress)");
    expect(step("Fetch returns")).toHaveTextContent("(to do)");
    expect(screen.getByText("Starting…")).toBeInTheDocument();
  });

  it("shows counts, time left, failures and finished steps", () => {
    render(
      <RankingProgress
        progress={{
          phase: "ranking",
          message: "Building rankings…",
          percent: 90,
          processed: 9,
          total: 10,
          eta: 3,
          errors: 2,
        }}
        sector="Banking"
      />
    );
    expect(screen.getByText("Building rankings…")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "90");
    expect(screen.getByText("9 / 10")).toBeInTheDocument();
    expect(screen.getByText(/about 3s left/)).toBeInTheDocument();
    expect(screen.getByText("2 funds failed")).toBeInTheDocument();
    expect(step("Load funds")).toHaveTextContent("(done)");
    expect(step("Fetch returns")).toHaveTextContent("(done)");
    expect(step("Build rankings")).toHaveTextContent("(in progress)");
  });

  it("handles a single failure and no estimate", () => {
    render(
      <RankingProgress
        progress={{ phase: "processing", percent: 0, total: 4, errors: 1 }}
        sector="Auto"
      />
    );
    expect(screen.getByText("1 fund failed")).toBeInTheDocument();
    expect(screen.getByText("0 / 4")).toBeInTheDocument();
    expect(screen.queryByText(/left/)).not.toBeInTheDocument();
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
  });
});
