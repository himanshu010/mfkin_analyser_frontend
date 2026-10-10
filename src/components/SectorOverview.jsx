import { motion } from "framer-motion";
import { formatDateTime, formatNumber, formatReturn, trend } from "../lib/format.js";
import { planFilters } from "../lib/insights.js";
import { sectorIcon } from "../lib/sectorIcons.js";
import { cn } from "../lib/cn.js";
import Chip from "./ui/Chip.jsx";
import NumberTicker from "./ui/NumberTicker.jsx";
import SearchField from "./ui/SearchField.jsx";

const tone = { up: "text-up", down: "text-down", flat: "text-fg" };
const ratio = (value) => formatNumber(value, 1);

const Stat = ({ label, children, hint }) => (
  <div className="rounded-xl border border-line bg-surface-2/60 px-4 py-3">
    <p className="text-xs font-medium tracking-wide text-fg-muted uppercase">{label}</p>
    <p className="num mt-1 text-2xl font-semibold">{children}</p>
    {hint ? <p className="mt-0.5 text-xs text-fg-muted">{hint}</p> : null}
  </div>
);

// The chosen sector: its name, when it was ranked, the headline numbers, and the filters that
// narrow every panel below.
const SectorOverview = ({
  name,
  generatedAt,
  totalFunds,
  stats,
  shownCount,
  timeframeLong,
  plans,
  onTogglePlan,
  filter,
  onFilterChange,
}) => {
  const filtered = plans.length > 0 || filter.trim() !== "";
  const Icon = sectorIcon(name || "");
  const updated = formatDateTime(generatedAt);
  const avg = stats.averageReturn;
  return (
    <section aria-labelledby="sector-title" className="card p-4 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <motion.h1
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-2xl font-semibold tracking-tight sm:text-3xl"
            id="sector-title"
            initial={{ opacity: 0, x: -8 }}
            key={name}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <Icon aria-hidden className="size-5" />
            </span>
            <span className="min-w-0 break-words">{name || "Choose a sector"}</span>
          </motion.h1>
          <p className="mt-2 text-sm text-fg-muted">
            {updated ? `Ranked ${updated}` : "Choose a sector above to see its rankings."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[34rem]">
          <Stat
            hint={
              filtered
                ? `${shownCount} match the filters`
                : shownCount === totalFunds
                  ? null
                  : `${shownCount} with ${timeframeLong} returns`
            }
            label="Funds"
          >
            {totalFunds ?? 0}
          </Stat>
          <Stat hint={`${stats.gainers} gaining over ${timeframeLong}`} label="Avg return">
            {avg === null ? (
              "—"
            ) : (
              <NumberTicker className={tone[trend(avg)]} format={formatReturn} value={avg} />
            )}
          </Stat>
          <Stat label="Avg P/E">{ratio(stats.averagePe)}</Stat>
          <Stat label="Avg P/B">{ratio(stats.averagePb)}</Stat>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div aria-label="Plan" className="flex flex-wrap gap-2" role="group">
          {planFilters.map((plan) => (
            <Chip
              key={plan.key}
              onClick={() => onTogglePlan(plan.key)}
              pressed={plans.includes(plan.key)}
            >
              {plan.label}
            </Chip>
          ))}
        </div>
        <SearchField
          className={cn("w-full sm:w-72")}
          label="Filter funds"
          onChange={onFilterChange}
          onClear={() => onFilterChange("")}
          placeholder="Filter funds by name"
          value={filter}
        />
      </div>
    </section>
  );
};

export default SectorOverview;
