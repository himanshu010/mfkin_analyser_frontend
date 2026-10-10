import { Search, X } from "lucide-react";
import { cn } from "../../lib/cn.js";

// A labelled search input. Text is 16 px on touch screens, where smaller text makes iOS zoom in.
const SearchField = ({ label, value, onChange, onClear, className, inputClassName, ...props }) => (
  <div className={cn("relative", className)}>
    <Search
      aria-hidden
      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-faint"
    />
    <input
      aria-label={label}
      className={cn(
        "h-10 w-full rounded-xl border border-line bg-surface pr-9 pl-9 text-sm text-fg transition-colors placeholder:text-fg-faint hover:border-line-strong focus-visible:border-focus pointer-coarse:h-11 pointer-coarse:pr-12 pointer-coarse:text-base",
        inputClassName
      )}
      onChange={(event) => onChange(event.target.value)}
      type="search"
      value={value}
      {...props}
    />
    {value && onClear ? (
      <button
        aria-label={`Clear ${label.toLowerCase()}`}
        className="absolute top-1/2 right-1 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-fg-faint hover:bg-surface-2 hover:text-fg pointer-coarse:size-11"
        onClick={onClear}
        type="button"
      >
        <X aria-hidden className="size-4" />
      </button>
    ) : null}
  </div>
);

export default SearchField;
