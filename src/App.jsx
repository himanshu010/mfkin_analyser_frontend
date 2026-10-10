import { Coins, PiggyBank } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppPreloader from "./components/AppPreloader.jsx";
import Footer from "./components/Footer.jsx";
import FundSpotlight from "./components/FundSpotlight.jsx";
import Header from "./components/Header.jsx";
import InsightList from "./components/InsightList.jsx";
import Notice from "./components/Notice.jsx";
import RankingProgress from "./components/RankingProgress.jsx";
import RankingTable from "./components/RankingTable.jsx";
import SectorOverview from "./components/SectorOverview.jsx";
import SectorRail from "./components/SectorRail.jsx";
import TopFundsPanel from "./components/TopFundsPanel.jsx";
import Button from "./components/ui/Button.jsx";
import { clearFund, fetchFundDetails, fetchFundSectorRanking } from "./features/funds/fundSlice.js";
import {
  fetchSectorRanking,
  fetchSectors,
  refreshSectorCatalog,
  setActiveSector,
} from "./features/sectors/sectorSlice.js";
import { formatAum, formatPercent } from "./lib/format.js";
import {
  filterRows,
  filterSectors,
  lowestExpense,
  sectorStats,
  timeframes,
  topByAum,
} from "./lib/insights.js";

const App = () => {
  const dispatch = useDispatch();
  const {
    list,
    listStatus,
    ranking,
    rankingStatus,
    rankingProgress,
    error: sectorError,
  } = useSelector((state) => state.sectors);
  const { details, detailsStatus, sectorRanking, sectorRankingStatus } = useSelector(
    (state) => state.funds
  );

  const [selectedSector, setSelectedSector] = useState("");
  const [sectorSearch, setSectorSearch] = useState("");
  const [searchMode, setSearchMode] = useState("sector");
  const [globalSearch, setGlobalSearch] = useState("");
  const [fundQuery, setFundQuery] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [timeframe, setTimeframe] = useState("oneYear");
  const [tableFilter, setTableFilter] = useState("");
  const [activePlans, setActivePlans] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [catalogStalled, setCatalogStalled] = useState(false);

  useEffect(() => {
    if (listStatus === "idle") dispatch(fetchSectors());
  }, [dispatch, listStatus]);

  const isCatalogLoading = (listStatus === "idle" || listStatus === "loading") && list.length === 0;

  // A free host can take a while to wake; after 12 s say so and offer a retry.
  useEffect(() => {
    setCatalogStalled(false);
    if (!isCatalogLoading) return undefined;
    const timeoutId = setTimeout(() => setCatalogStalled(true), 12000);
    return () => clearTimeout(timeoutId);
  }, [isCatalogLoading]);

  const defaultSector = useMemo(() => {
    if (listStatus !== "succeeded" || list.length === 0) return "";
    return list.includes("Technology (IT)") ? "Technology (IT)" : list[0];
  }, [listStatus, list]);

  useEffect(() => {
    if (defaultSector && !selectedSector) {
      setSelectedSector(defaultSector);
      dispatch(setActiveSector(defaultSector));
      dispatch(fetchSectorRanking(defaultSector));
    }
  }, [dispatch, defaultSector, selectedSector]);

  // A fund search answers with the fund's sector; follow it.
  const fundSector = sectorRanking?.fund?.sector;
  useEffect(() => {
    if (fundSector) setSelectedSector(fundSector);
  }, [fundSector]);

  const handleSectorSelect = (sector, options = {}) => {
    setSelectedSector(sector);
    setSearchMessage("");
    dispatch(setActiveSector(sector));
    dispatch(clearFund());
    dispatch(fetchSectorRanking(options.force ? { name: sector, force: true } : sector));
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      const refreshedList = await dispatch(refreshSectorCatalog()).unwrap();
      const nextSector = refreshedList?.includes(selectedSector)
        ? selectedSector
        : refreshedList?.[0];
      if (nextSector) handleSectorSelect(nextSector, { force: true });
    } catch {
      // listStatus carries the failure.
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCatalogRetry = () => {
    setCatalogStalled(false);
    dispatch(fetchSectors());
  };

  const handleGlobalSearch = () => {
    const query = globalSearch.trim();
    if (!query) return;
    if (searchMode === "sector") {
      const lower = query.toLowerCase();
      const match =
        list.find((sector) => sector.toLowerCase() === lower) ||
        list.find((sector) => sector.toLowerCase().includes(lower));
      if (match) handleSectorSelect(match);
      else setSearchMessage(`No sector matches “${query}”. Pick one from the list.`);
      return;
    }
    setSearchMessage("");
    setFundQuery(query);
    dispatch(clearFund());
    dispatch(fetchFundDetails(query));
    dispatch(fetchFundSectorRanking(query));
  };

  const activeRanking = sectorRanking?.sectorRanking || ranking;
  const activeSectorName =
    sectorRanking?.fund?.sector || activeRanking?.sector || selectedSector || "";
  const isRankingLoading = rankingStatus === "loading" || sectorRankingStatus === "loading";
  const timeframeInfo = timeframes.find((item) => item.key === timeframe);

  const currentRows = useMemo(
    () => activeRanking?.rankings?.[timeframe] || [],
    [activeRanking, timeframe]
  );
  const filteredRows = useMemo(
    () => filterRows(currentRows, tableFilter, activePlans),
    [currentRows, tableFilter, activePlans]
  );
  const stats = useMemo(() => sectorStats(filteredRows), [filteredRows]);
  const aumLeaders = useMemo(() => topByAum(filteredRows), [filteredRows]);
  const cheapest = useMemo(() => lowestExpense(filteredRows), [filteredRows]);
  const sectorList = useMemo(() => filterSectors(list, sectorSearch), [list, sectorSearch]);
  const searchedRank = details
    ? currentRows.find((row) => row.schemeCode === String(details.schemeCode))?.rank
    : undefined;

  if (listStatus === "failed" && list.length === 0) {
    return (
      <AppPreloader
        actions={
          <Button onClick={handleCatalogRetry} size="sm">
            Retry
          </Button>
        }
        message={
          sectorError
            ? `Unable to load the sector catalog. ${sectorError}`
            : "Unable to load the sector catalog."
        }
      />
    );
  }

  if (isCatalogLoading) {
    return (
      <AppPreloader
        actions={
          catalogStalled ? (
            <Button onClick={handleCatalogRetry} size="sm">
              Retry
            </Button>
          ) : null
        }
        message={
          catalogStalled
            ? "Still loading the sector catalog. The server may be waking up."
            : "Loading the sector catalog…"
        }
      />
    );
  }

  return (
    <div className="min-h-dvh">
      <a
        className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-primary-fg focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        href="#main"
      >
        Skip to content
      </a>
      <Header
        onQueryChange={setGlobalSearch}
        onRefresh={handleRefresh}
        onSearch={handleGlobalSearch}
        onSearchModeChange={(mode) => {
          setSearchMode(mode);
          setSearchMessage("");
        }}
        onTimeframeChange={setTimeframe}
        query={globalSearch}
        refreshing={isRefreshing}
        searchMode={searchMode}
        timeframe={timeframe}
      />
      <main
        className="mx-auto min-h-dvh max-w-[96rem] space-y-4 px-4 py-5 sm:px-6"
        id="main"
        tabIndex={-1}
      >
        <SectorRail
          onSearchChange={setSectorSearch}
          onSelect={handleSectorSelect}
          search={sectorSearch}
          sectors={sectorList}
          selected={activeSectorName}
        />
        {searchMessage ? <Notice tone="error">{searchMessage}</Notice> : null}
        <FundSpotlight
          details={details}
          onClose={() => {
            dispatch(clearFund());
            document.getElementById("global-search")?.focus();
          }}
          query={fundQuery}
          rank={searchedRank}
          status={detailsStatus}
        />
        <SectorOverview
          filter={tableFilter}
          generatedAt={activeRanking?.generatedAt}
          name={activeSectorName}
          onFilterChange={setTableFilter}
          onTogglePlan={(plan) =>
            setActivePlans((prev) =>
              prev.includes(plan) ? prev.filter((item) => item !== plan) : [...prev, plan]
            )
          }
          plans={activePlans}
          shownCount={filteredRows.length}
          stats={stats}
          timeframeLong={timeframeInfo.long}
          totalFunds={activeRanking?.totalFunds}
        />
        {isRankingLoading || rankingStatus === "partial" ? (
          <RankingProgress progress={rankingProgress} sector={selectedSector} />
        ) : null}
        {rankingStatus === "partial" && activeRanking ? (
          <Notice>
            Showing {activeRanking.totalFunds} active funds. Loading{" "}
            {activeRanking.pendingInactive || 0} inactive funds in the background…
          </Notice>
        ) : null}
        {rankingStatus === "failed" ? (
          <Notice
            action={
              <Button
                onClick={() => handleSectorSelect(selectedSector, { force: true })}
                size="sm"
                variant="outline"
              >
                Try again
              </Button>
            }
            tone="error"
          >
            Couldn’t rank {selectedSector}. {sectorError}
          </Notice>
        ) : null}
        {activeRanking ? (
          <>
            <TopFundsPanel
              activeTimeframe={timeframe}
              onSelectTimeframe={setTimeframe}
              topFunds={activeRanking.topFunds}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <InsightList
                empty="No AUM figures for these funds."
                icon={Coins}
                items={aumLeaders.map((fund) => ({
                  key: fund.schemeCode,
                  name: fund.schemeName,
                  value: fund.metrics.aum,
                  display: formatAum(fund.metrics.aum),
                }))}
                title={`Largest by AUM in ${activeSectorName}`}
              />
              <InsightList
                empty="No expense ratios for these funds."
                icon={PiggyBank}
                items={cheapest.map((fund) => ({
                  key: fund.schemeCode,
                  name: fund.schemeName,
                  value: fund.metrics.expenseRatio,
                  display: formatPercent(fund.metrics.expenseRatio),
                }))}
                title="Lowest expense ratio"
              />
            </div>
            <RankingTable
              highlightCode={details ? String(details.schemeCode) : undefined}
              note="AUM and ratios are sourced from Kuvera when available."
              rows={filteredRows}
              timeframeLabel={timeframeInfo.label}
            />
          </>
        ) : null}
      </main>
      <Footer />
    </div>
  );
};

export default App;
