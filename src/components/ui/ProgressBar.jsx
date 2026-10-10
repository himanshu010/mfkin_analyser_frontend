import { cn } from "../../lib/cn.js";

// Determinate when `value` (0-100) is given, otherwise a sliding indeterminate bar.
const ProgressBar = ({ value, label, className }) => {
  const determinate = typeof value === "number";
  return (
    <div
      aria-label={label}
      aria-valuemax={determinate ? 100 : undefined}
      aria-valuemin={determinate ? 0 : undefined}
      aria-valuenow={determinate ? Math.round(value) : undefined}
      className={cn("relative h-2 overflow-hidden rounded-full bg-surface-2", className)}
      role="progressbar"
    >
      {determinate ? (
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      ) : (
        <div className="absolute inset-y-0 w-2/5 rounded-full bg-gradient-to-r from-primary to-accent [animation:indeterminate_1.4s_ease-in-out_infinite]" />
      )}
    </div>
  );
};

export default ProgressBar;
