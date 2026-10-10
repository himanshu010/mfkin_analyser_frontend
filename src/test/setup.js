import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";

// jsdom has no matchMedia: every query answers false unless a test says otherwise (mockMedia).
const defaultMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});
Object.defineProperty(window, "matchMedia", { writable: true, value: vi.fn(defaultMedia) });
afterEach(() => window.matchMedia.mockImplementation(defaultMedia));

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

window.scrollTo = vi.fn();

// Never reports an intersection, so in-view animations (NumberTicker) keep their final value.
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
