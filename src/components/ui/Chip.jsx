import { cn } from "../../lib/cn.js";

// A toggle chip (aria-pressed) for filters and sector choices.
const Chip = ({ pressed, icon: Icon, children, className, ...props }) => (
  <button
    aria-pressed={pressed}
    className={cn(
      "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm whitespace-nowrap transition-colors duration-200 pointer-coarse:h-11 pointer-coarse:px-4",
      pressed
        ? "border-primary bg-primary-soft font-medium text-fg"
        : "border-line bg-surface text-fg-muted hover:border-line-strong hover:text-fg",
      className
    )}
    type="button"
    {...props}
  >
    {Icon ? <Icon aria-hidden className={cn("size-4", pressed ? "text-primary" : "")} /> : null}
    {children}
  </button>
);

export default Chip;
