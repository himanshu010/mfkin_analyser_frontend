import { motion } from "framer-motion";

// A short ranked list with a bar per entry, scaled to the largest value (a bar chart for comparing a
// few funds on one measure).
const InsightList = ({ title, icon: Icon, items, empty }) => {
  const max = Math.max(...items.map((item) => item.value), 0);
  return (
    <section aria-label={title} className="card min-w-0 p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <Icon aria-hidden className="size-4 text-primary" />
        {title}
      </h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-fg-muted">{empty}</p>
      ) : (
        <ol className="mt-4 space-y-3">
          {items.map((item, index) => (
            <li key={item.key}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate" title={item.name}>
                  {item.name}
                </span>
                <span className="num shrink-0 font-medium">{item.display}</span>
              </div>
              <div aria-hidden className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <motion.div
                  animate={{ width: `${max > 0 ? Math.max(4, (item.value / max) * 100) : 0}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};

export default InsightList;
