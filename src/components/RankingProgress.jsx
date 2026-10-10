import { Check, LoaderCircle, TriangleAlert } from "lucide-react";
import { cn } from "../lib/cn.js";
import ProgressBar from "./ui/ProgressBar.jsx";

const steps = [
  { phase: "loading_funds", label: "Load funds" },
  { phase: "processing", label: "Fetch returns" },
  { phase: "ranking", label: "Build rankings" },
];

const stateOf = (index, current) => {
  if (current < 0) return index === 0 ? "current" : "todo";
  if (index < current) return "done";
  return index === current ? "current" : "todo";
};

// The server streams its progress while it ranks a sector; this shows it as three steps and a bar.
const RankingProgress = ({ progress, sector }) => {
  const current = steps.findIndex((step) => step.phase === progress?.phase);
  const percent =
    typeof progress?.percent === "number" && progress.percent > 0 ? progress.percent : undefined;
  return (
    <section aria-live="polite" className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-medium">{progress?.message || `Crunching rankings for ${sector}…`}</p>
        {progress?.errors > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent-text">
            <TriangleAlert aria-hidden className="size-3.5" />
            {progress.errors} {progress.errors === 1 ? "fund" : "funds"} failed
          </span>
        ) : null}
      </div>
      <ProgressBar className="mt-4" label={`Ranking ${sector}`} value={percent} />
      {/* Always one line, so the steps below don't jump when the first count arrives. */}
      <p className="mt-3 text-sm text-fg-muted">
        {progress?.total ? (
          <>
            <span className="num font-semibold text-fg">
              {progress.processed || 0} / {progress.total}
            </span>{" "}
            funds processed{progress.eta > 0 ? ` · about ${progress.eta}s left` : ""}
          </>
        ) : (
          "Starting…"
        )}
      </p>
      <ol className="mt-5 grid gap-2 sm:grid-cols-3">
        {steps.map((step, index) => {
          const state = stateOf(index, current);
          return (
            <li
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm",
                state === "current"
                  ? "border-primary bg-primary-soft text-fg"
                  : "border-line text-fg-muted",
                state === "done" && "text-fg"
              )}
              key={step.phase}
            >
              {state === "done" ? (
                <Check aria-hidden className="size-4 text-up" />
              ) : state === "current" ? (
                <LoaderCircle aria-hidden className="size-4 animate-spin text-primary" />
              ) : (
                <span aria-hidden className="size-4 rounded-full border border-line-strong" />
              )}
              {step.label}
              <span className="sr-only">
                {state === "done" ? "(done)" : state === "current" ? "(in progress)" : "(to do)"}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default RankingProgress;
