import { motion } from "framer-motion";
import { CircleAlert, X } from "lucide-react";
import { formatAum, formatNumber, formatPercent, formatReturn, trend } from "../lib/format.js";
import { cn } from "../lib/cn.js";
import Button from "./ui/Button.jsx";

const tone = { up: "text-up", down: "text-down", flat: "text-fg" };

const Figure = ({ label, value, toneClass }) => (
  <div className="rounded-xl border border-line bg-surface-2/60 px-3 py-2.5">
    <dt className="text-xs text-fg-muted">{label}</dt>
    <dd className={cn("num mt-0.5 font-semibold", toneClass)}>{value}</dd>
  </div>
);

// The result of a fund search: loading, not found, or the fund's figures.
const FundSpotlight = ({ status, details, query, rank, onClose }) => {
  if (status === "loading") {
    return (
      <section aria-busy="true" aria-label="Fund details" className="card p-5">
        <p className="text-sm text-fg-muted" role="status">
          Looking up “{query}”…
        </p>
        <div aria-hidden className="mt-4 h-6 w-2/3 animate-pulse rounded-lg bg-surface-2" />
        <div aria-hidden className="mt-3 h-4 w-1/3 animate-pulse rounded-lg bg-surface-2" />
      </section>
    );
  }
  if (status === "failed") {
    return (
      <section aria-label="Fund details" className="card flex items-start gap-3 p-5" role="alert">
        <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-down" />
        <div className="flex-1">
          <p className="font-medium">No fund matches “{query}”.</p>
          <p className="mt-1 text-sm text-fg-muted">
            Try part of the fund’s name, or its scheme code.
          </p>
        </div>
        <Button aria-label="Close" onClick={onClose} size="icon" variant="ghost">
          <X aria-hidden />
        </Button>
      </section>
    );
  }
  if (!details) return null;
  const m = details.metrics || {};
  const returns = details.returns || {};
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      aria-label="Fund details"
      className="card p-5 sm:p-6"
      initial={{ opacity: 0, y: 10 }}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            Fund spotlight
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">{details.schemeName}</h2>
          <p className="mt-1 text-sm text-fg-muted">
            Scheme {details.schemeCode}
            {details.meta?.fund_house ? ` · ${details.meta.fund_house}` : ""}
            {rank ? ` · ranked #${rank} in its sector` : ""}
          </p>
        </div>
        <Button aria-label="Close" onClick={onClose} size="icon" variant="ghost">
          <X aria-hidden />
        </Button>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        <Figure label="NAV" value={details.latestNav ? `₹${details.latestNav}` : "—"} />
        <Figure
          label="1Y"
          toneClass={tone[trend(returns.year1)]}
          value={formatReturn(returns.year1)}
        />
        <Figure
          label="3Y"
          toneClass={tone[trend(returns.year3)]}
          value={formatReturn(returns.year3)}
        />
        <Figure
          label="5Y"
          toneClass={tone[trend(returns.year5)]}
          value={formatReturn(returns.year5)}
        />
        <Figure label="AUM" value={formatAum(m.aum)} />
        <Figure label="Expense" value={formatPercent(m.expenseRatio)} />
        <Figure label="P/E" value={formatNumber(m.peRatio, 1)} />
        <Figure label="Risk" value={m.riskRating || "—"} />
      </dl>
    </motion.section>
  );
};

export default FundSpotlight;
