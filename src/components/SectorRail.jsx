import { useEffect, useRef } from "react";
import { sectorIcon } from "../lib/sectorIcons.js";
import Chip from "./ui/Chip.jsx";
import SearchField from "./ui/SearchField.jsx";

// Every sector as a chip: wrapped on wide screens, one swipeable row on phones (the chosen one is
// scrolled into view).
const SectorRail = ({ sectors, selected, onSelect, search, onSearchChange }) => {
  const row = useRef(null);

  // Scrolls the row itself: scrollIntoView would also move the page and the browser's Tab starting
  // point.
  useEffect(() => {
    const chip = row.current?.querySelector('[aria-pressed="true"]');
    if (!chip || row.current.scrollWidth <= row.current.clientWidth) return;
    row.current.scrollTo?.({
      left: chip.offsetLeft - (row.current.clientWidth - chip.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [selected]);

  return (
    <section aria-labelledby="sectors-title" className="card p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold" id="sectors-title">
          Sectors <span className="num font-normal text-fg-muted">{sectors.length}</span>
        </h2>
        <SearchField
          className="w-44 sm:w-56"
          label="Filter sectors"
          onChange={onSearchChange}
          onClear={() => onSearchChange("")}
          placeholder="Filter sectors"
          value={search}
        />
      </div>
      {sectors.length === 0 ? (
        <p className="text-sm text-fg-muted">No sector matches “{search}”.</p>
      ) : (
        <div
          className="scrollbar-thin -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
          ref={row}
        >
          {sectors.map((sector) => (
            <Chip
              className="snap-start"
              icon={sectorIcon(sector)}
              key={sector}
              onClick={() => onSelect(sector)}
              pressed={sector === selected}
            >
              {sector}
            </Chip>
          ))}
        </div>
      )}
    </section>
  );
};

export default SectorRail;
