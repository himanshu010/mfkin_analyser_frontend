import { motion } from "framer-motion";
import { Layers, RefreshCw, Search, Wallet } from "lucide-react";
import { timeframes } from "../lib/insights.js";
import { cn } from "../lib/cn.js";
import Logo from "./Logo.jsx";
import ThemeSelector from "./ThemeSelector.jsx";
import Button from "./ui/Button.jsx";
import SearchField from "./ui/SearchField.jsx";
import Segmented from "./ui/Segmented.jsx";

const modes = [
  { value: "sector", label: "Sector", icon: Layers },
  { value: "fund", label: "Fund", icon: Wallet },
];

const placeholders = {
  sector: "Search a sector, e.g. Banking",
  fund: "Search a fund by name or scheme code",
};

const Header = ({
  searchMode,
  onSearchModeChange,
  query,
  onQueryChange,
  onSearch,
  timeframe,
  onTimeframeChange,
  onRefresh,
  refreshing,
}) => (
  <motion.header
    animate={{ opacity: 1, y: 0 }}
    className="sticky top-0 z-30 border-b border-line bg-bg/80 backdrop-blur-xl"
    initial={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.4 }}
  >
    <div className="mx-auto flex max-w-[96rem] flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6">
      <Logo />
      <form
        className="order-3 flex w-full min-w-0 items-center gap-2 xl:order-none xl:ml-6 xl:w-auto xl:flex-1"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
        role="search"
      >
        <Segmented
          className="hidden shrink-0 md:inline-flex"
          label="Search for"
          onChange={onSearchModeChange}
          options={modes}
          value={searchMode}
        />
        <SearchField
          className="min-w-0 flex-1"
          label={searchMode === "sector" ? "Search sectors" : "Search funds"}
          onChange={onQueryChange}
          onClear={() => onQueryChange("")}
          id="global-search"
          placeholder={placeholders[searchMode]}
          value={query}
        />
        <Button
          aria-label="Search"
          className="sm:w-auto"
          disabled={!query.trim()}
          size="sm"
          type="submit"
        >
          <Search aria-hidden />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </form>
      <div className="order-4 flex w-full items-center gap-2 md:hidden">
        <Segmented
          className="flex-1"
          label="Search for"
          onChange={onSearchModeChange}
          options={modes}
          value={searchMode}
        />
        <Segmented
          className="flex-1"
          label="Return period"
          onChange={onTimeframeChange}
          options={timeframes.map(({ key, label }) => ({ value: key, label }))}
          value={timeframe}
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Segmented
          className="hidden md:inline-flex"
          label="Return period"
          onChange={onTimeframeChange}
          options={timeframes.map(({ key, label }) => ({ value: key, label }))}
          value={timeframe}
        />
        <ThemeSelector className="hidden sm:inline-flex" />
        <Button
          aria-label={refreshing ? "Refreshing data" : "Refresh data"}
          disabled={refreshing}
          onClick={onRefresh}
          size="sm"
          title="Rebuild the rankings on the server"
          variant="outline"
        >
          <RefreshCw aria-hidden className={cn(refreshing && "animate-spin")} />
          <span className="hidden sm:inline">{refreshing ? "Refreshing…" : "Refresh"}</span>
        </Button>
      </div>
    </div>
  </motion.header>
);

export default Header;
