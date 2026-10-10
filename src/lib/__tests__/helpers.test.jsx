import { act, render, screen } from "@testing-library/react";
import { LayoutGrid, Landmark, Layers } from "lucide-react";
import { describe, expect, it } from "vitest";
import { cn } from "../cn.js";
import { sectorIcon } from "../sectorIcons.js";
import { PHONE, useMediaQuery } from "../useMediaQuery.js";

const Probe = () => <p>{useMediaQuery(PHONE) ? "phone" : "wide"}</p>;

describe("helpers", () => {
  it("merges class names, later ones winning", () => {
    expect(cn("px-2", false, "px-4", ["text-sm"])).toBe("px-4 text-sm");
  });

  it("picks a sector icon by keyword, with a fallback", () => {
    expect(sectorIcon("All Funds")).toBe(Layers);
    expect(sectorIcon("Banking & Financial Services")).toBe(Landmark);
    expect(sectorIcon("Something else")).toBe(LayoutGrid);
  });

  it("follows a media query and its changes", () => {
    let listener;
    let matches = false;
    window.matchMedia.mockImplementation((query) => ({
      matches,
      media: query,
      addEventListener: (_, fn) => {
        listener = fn;
      },
      removeEventListener: () => {
        listener = undefined;
      },
    }));
    const { unmount } = render(<Probe />);
    expect(screen.getByText("wide")).toBeInTheDocument();
    matches = true;
    act(() => listener());
    expect(screen.getByText("phone")).toBeInTheDocument();
    unmount();
    expect(listener).toBeUndefined();
  });
});
