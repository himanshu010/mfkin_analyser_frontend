import { motion } from "framer-motion";
import { useId, useRef } from "react";
import { cn } from "../../lib/cn.js";

// An exclusive choice (radio group) whose selection pill slides between options, after Motion
// Primitives' AnimatedBackground. Arrow keys move the choice, as in a native radio group.
const Segmented = ({ label, options, value, onChange, className, size = "md" }) => {
  const id = useId();
  const refs = useRef([]);

  const onKeyDown = (event, index) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (index + step + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div
      aria-label={label}
      className={cn(
        "relative inline-flex rounded-xl border border-line bg-surface-2 p-1",
        className
      )}
      role="radiogroup"
    >
      {options.map((option, index) => {
        const selected = option.value === value;
        const Icon = option.icon;
        return (
          <button
            aria-checked={selected}
            aria-label={option.ariaLabel}
            className={cn(
              "relative z-0 inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg font-medium whitespace-nowrap transition-colors duration-200",
              size === "sm"
                ? "h-8 px-2.5 text-xs pointer-coarse:h-11 pointer-coarse:min-w-11"
                : "h-9 px-3 text-sm pointer-coarse:h-11",
              selected ? "text-fg" : "text-fg-muted hover:text-fg"
            )}
            key={option.value}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
            ref={(element) => {
              refs.current[index] = element;
            }}
            role="radio"
            tabIndex={selected ? 0 : -1}
            title={option.title}
            type="button"
          >
            {selected ? (
              <motion.span
                className="absolute inset-0 -z-10 rounded-lg border border-line-strong bg-surface shadow-sm"
                layoutId={`${id}-pill`}
                transition={{ type: "spring", bounce: 0.18, duration: 0.4 }}
              />
            ) : null}
            {Icon ? <Icon aria-hidden className="size-4 shrink-0" /> : null}
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default Segmented;
