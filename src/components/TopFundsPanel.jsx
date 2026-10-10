import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { formatAum, formatNumber, formatPercent, formatReturn, trend } from "../lib/format.js";
import { cn } from "../lib/cn.js";
import BorderBeam from "./ui/BorderBeam.jsx";
import NumberTicker from "./ui/NumberTicker.jsx";

const timeframes = [
  { key: "oneYear", label: "1Y leader", period: "1-year" },
  { key: "threeYear", label: "3Y leader", period: "3-year" },
  { key: "fiveYear", label: "5Y leader", period: "5-year" },
];
const tone = { up: "text-up", down: "text-down", flat: "text-fg" };

const Metric = ({ label, value }) => (
  <div>
    <dt className="text-xs text-fg-muted">{label}</dt>
    <dd className="num text-sm font-medium">{value}</dd>
  </div>
);

// The best fund for each return period. The card for the period on show is marked; choosing a
// card switches the period.
const TopFundsPanel = ({ topFunds, activeTimeframe, onSelectTimeframe }) => {
  if (!topFunds) return null;
  return (
    <section aria-labelledby="leaders-title" className="grid gap-3 md:grid-cols-3">
      <h2 className="sr-only" id="leaders-title">
        Leaders
      </h2>
      {timeframes.map((timeframe, index) => {
        const entries = topFunds[timeframe.key] || [];
        const lead = entries[0];
        const active = activeTimeframe === timeframe.key;
        return (
          <motion.article
            animate={{ opacity: 1, y: 0 }}
            aria-label={timeframe.label}
            className={cn(
              "card relative flex min-w-0 flex-col overflow-hidden p-5 transition-colors duration-200",
              active ? "border-primary" : "hover:border-line-strong"
            )}
            initial={{ opacity: 0, y: 12 }}
            key={timeframe.key}
            transition={{ delay: index * 0.06, duration: 0.4 }}
          >
            {active ? <BorderBeam /> : null}
            {onSelectTimeframe ? (
              <button
                aria-label={`Rank by ${timeframe.period} return`}
                aria-pressed={active}
                className="absolute inset-0 z-10 rounded-[inherit]"
                onClick={() => onSelectTimeframe(timeframe.key)}
                type="button"
              />
            ) : null}
            <span className="flex items-center gap-2 text-xs font-semibold tracking-wide text-fg-muted uppercase">
              <Trophy aria-hidden className={cn("size-4", active ? "text-accent" : "")} />
              {timeframe.label}
            </span>
            {lead ? (
              <>
                <h3 className="mt-3 line-clamp-2 min-h-[2.75rem] font-semibold">
                  {lead.schemeName}
                </h3>
                {typeof lead.returns === "number" ? (
                  <NumberTicker
                    className={cn(
                      "num mt-3 text-3xl font-semibold tracking-tight",
                      tone[trend(lead.returns)]
                    )}
                    format={formatReturn}
                    value={lead.returns}
                  />
                ) : (
                  <span className="num mt-3 text-3xl font-semibold tracking-tight">—</span>
                )}
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-3 sm:grid-cols-4 md:grid-cols-2 xl:grid-cols-4">
                  <Metric label="AUM" value={formatAum(lead.metrics?.aum)} />
                  <Metric label="Expense" value={formatPercent(lead.metrics?.expenseRatio)} />
                  <Metric label="P/E" value={formatNumber(lead.metrics?.peRatio, 1)} />
                  <Metric label="P/B" value={formatNumber(lead.metrics?.pbRatio, 1)} />
                </dl>
                {entries.length > 1 ? (
                  <span className="mt-3 text-xs text-fg-muted">
                    Tied with{" "}
                    {entries
                      .slice(1, 3)
                      .map((fund) => fund.schemeName)
                      .join(", ")}
                  </span>
                ) : null}
              </>
            ) : (
              <span className="mt-3 text-sm text-fg-muted">No leader for this period yet.</span>
            )}
          </motion.article>
        );
      })}
    </section>
  );
};

export default TopFundsPanel;
