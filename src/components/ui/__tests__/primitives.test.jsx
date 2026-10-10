import { fireEvent, render, screen } from "@testing-library/react";
import { Sun } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import Button, { buttonClass } from "../Button.jsx";
import Chip from "../Chip.jsx";
import ProgressBar from "../ProgressBar.jsx";
import SearchField from "../SearchField.jsx";
import Segmented from "../Segmented.jsx";

const options = [
  { value: "a", label: "Alpha", icon: Sun, title: "First" },
  { value: "b", label: "Beta" },
  { value: "c", ariaLabel: "Gamma" },
];

describe("Segmented", () => {
  it("is a radio group with the value checked", () => {
    render(<Segmented label="Pick" onChange={() => {}} options={options} value="b" />);
    expect(screen.getByRole("radiogroup", { name: "Pick" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Beta" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Beta" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("radio", { name: "Alpha" })).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("radio", { name: "Alpha" })).toHaveAttribute("title", "First");
    expect(screen.getByRole("radio", { name: "Gamma" })).toBeInTheDocument();
  });

  it("changes on click and with arrow keys, wrapping round", () => {
    const onChange = vi.fn();
    render(<Segmented label="Pick" onChange={onChange} options={options} size="sm" value="a" />);
    fireEvent.click(screen.getByRole("radio", { name: "Beta" }));
    expect(onChange).toHaveBeenLastCalledWith("b");
    fireEvent.keyDown(screen.getByRole("radio", { name: "Alpha" }), { key: "ArrowLeft" });
    expect(onChange).toHaveBeenLastCalledWith("c");
    expect(screen.getByRole("radio", { name: "Gamma" })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole("radio", { name: "Gamma" }), { key: "ArrowDown" });
    expect(onChange).toHaveBeenLastCalledWith("a");
    onChange.mockClear();
    fireEvent.keyDown(screen.getByRole("radio", { name: "Alpha" }), { key: "Enter" });
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("Button", () => {
  it("defaults to a primary button", () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole("button", { name: "Go" })).toHaveAttribute("type", "button");
    expect(buttonClass()).toContain("bg-primary");
    expect(buttonClass({ variant: "ghost", size: "icon" }, "extra")).toContain("extra");
  });
});

describe("Chip", () => {
  it("shows its pressed state, with or without an icon", () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <Chip icon={Sun} onClick={onClick} pressed>
        Sunny
      </Chip>
    );
    fireEvent.click(screen.getByRole("button", { name: "Sunny" }));
    expect(onClick).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Sunny" })).toHaveAttribute("aria-pressed", "true");
    rerender(<Chip pressed={false}>Plain</Chip>);
    expect(screen.getByRole("button", { name: "Plain" })).toHaveAttribute("aria-pressed", "false");
  });
});

describe("SearchField", () => {
  it("reports typing and offers a clear button once there is text", () => {
    const onChange = vi.fn();
    const onClear = vi.fn();
    const { rerender } = render(
      <SearchField label="Find" onChange={onChange} onClear={onClear} value="" />
    );
    expect(screen.queryByRole("button", { name: "Clear find" })).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox", { name: "Find" }), { target: { value: "abc" } });
    expect(onChange).toHaveBeenCalledWith("abc");
    rerender(<SearchField label="Find" onChange={onChange} onClear={onClear} value="abc" />);
    fireEvent.click(screen.getByRole("button", { name: "Clear find" }));
    expect(onClear).toHaveBeenCalled();
    rerender(<SearchField label="Find" onChange={onChange} value="abc" />);
    expect(screen.queryByRole("button", { name: "Clear find" })).not.toBeInTheDocument();
  });
});

describe("ProgressBar", () => {
  it("is determinate with a value, clamped to 0-100", () => {
    const { rerender } = render(<ProgressBar label="Work" value={140} />);
    const bar = screen.getByRole("progressbar", { name: "Work" });
    expect(bar).toHaveAttribute("aria-valuenow", "140");
    expect(bar.firstChild).toHaveStyle({ width: "100%" });
    rerender(<ProgressBar label="Work" value={-5} />);
    expect(screen.getByRole("progressbar").firstChild).toHaveStyle({ width: "0%" });
  });

  it("is indeterminate without one", () => {
    render(<ProgressBar label="Work" />);
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
  });
});
