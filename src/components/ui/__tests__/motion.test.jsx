import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const motion = vi.hoisted(() => ({ inView: false, reduce: false, set: vi.fn(), listener: null }));

vi.mock("framer-motion", async (importOriginal) => ({
  ...(await importOriginal()),
  useInView: () => motion.inView,
  useReducedMotion: () => motion.reduce,
  useMotionValue: () => ({ set: motion.set }),
  useSpring: () => ({
    on: (_, fn) => {
      motion.listener = fn;
      return () => {};
    },
  }),
}));

const { default: NumberTicker } = await import("../NumberTicker.jsx");
const { default: BorderBeam } = await import("../BorderBeam.jsx");

const format = (n) => `#${n}`;

describe("NumberTicker", () => {
  it("shows the final value before any animation", () => {
    Object.assign(motion, { inView: false, reduce: false });
    motion.set.mockClear();
    render(<NumberTicker format={format} value={10} />);
    expect(screen.getByText("#10")).toBeInTheDocument();
    expect(motion.set).not.toHaveBeenCalled();
  });

  it("counts to the value once in view, writing each frame's number", () => {
    Object.assign(motion, { inView: true, reduce: false });
    motion.set.mockClear();
    render(<NumberTicker format={format} value={10} />);
    expect(motion.set).toHaveBeenCalledWith(10);
    motion.listener(4);
    expect(screen.getByText("#4")).toBeInTheDocument();
  });

  it("stays still when motion is reduced", () => {
    Object.assign(motion, { inView: true, reduce: true });
    motion.set.mockClear();
    const { unmount } = render(<NumberTicker format={format} value={10} />);
    expect(motion.set).not.toHaveBeenCalled();
    unmount();
    motion.listener(3);
  });
});

describe("BorderBeam", () => {
  it("draws a beam, or nothing when motion is reduced", () => {
    motion.reduce = false;
    const { container, rerender } = render(<BorderBeam />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    motion.reduce = true;
    rerender(<BorderBeam />);
    expect(container.firstChild).toBeNull();
  });
});
