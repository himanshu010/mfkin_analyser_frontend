import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  InputAdornment,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ScienceIcon from "@mui/icons-material/Science";
import MemoryIcon from "@mui/icons-material/Memory";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ConstructionIcon from "@mui/icons-material/Construction";
import BoltIcon from "@mui/icons-material/Bolt";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import MovieIcon from "@mui/icons-material/Movie";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import FactoryIcon from "@mui/icons-material/Factory";
import ShieldIcon from "@mui/icons-material/Shield";
import PublicIcon from "@mui/icons-material/Public";
import SpaIcon from "@mui/icons-material/Spa";
import InsightsIcon from "@mui/icons-material/Insights";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSectors,
  fetchSectorRanking,
  refreshSectorCatalog,
  setActiveSector,
} from "./features/sectors/sectorSlice.js";
import { clearFund, fetchFundDetails, fetchFundSectorRanking } from "./features/funds/fundSlice.js";
import TopFundsPanel from "./components/TopFundsPanel.jsx";
import RankingTable from "./components/RankingTable.jsx";
import AppPreloader from "./components/AppPreloader.jsx";
import ThemeSelector from "./components/ThemeSelector.jsx";

// Timeframe options for return calculations
const timeframes = [
  { key: "oneYear", label: "1Y" },
  { key: "threeYear", label: "3Y" },
  { key: "fiveYear", label: "5Y" },
];

// Fund plan type filters
const planFilters = [
  { key: "direct", label: "Direct" },
  { key: "regular", label: "Regular" },
  { key: "growth", label: "Growth" },
  { key: "idcw", label: "IDCW" },
];

// Format return value as percentage with 2 decimal places
const formatReturn = (value) =>
  value === null || value === undefined ? "—" : `${value.toFixed(2)}%`;

// Format AUM in Indian notation (Crores)
// Input is in 10s of crores, so divide by 10 to get crores
const formatAum = (value) => {
  if (value === null || value === undefined) return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return "—";
  const crores = num / 10;
  if (crores >= 1000) return `₹${(crores / 1000).toFixed(1)}K Cr`;
  if (crores >= 100) return `₹${crores.toFixed(0)} Cr`;
  return `₹${crores.toFixed(1)} Cr`;
};

// Map sector names to appropriate icons based on keywords
const getSectorIcon = (sector) => {
  const key = sector.toLowerCase();
  if (key.includes("bank")) return <AccountBalanceIcon />;
  if (key.includes("pharma") || key.includes("health")) return <ScienceIcon />;
  if (key.includes("tech")) return <MemoryIcon />;
  if (key.includes("fmcg") || key.includes("consumer")) return <ShoppingBagIcon />;
  if (key.includes("infra") || key.includes("construction")) return <ConstructionIcon />;
  if (key.includes("energy") || key.includes("power")) return <BoltIcon />;
  if (key.includes("auto")) return <DirectionsCarIcon />;
  if (key.includes("real")) return <HomeWorkIcon />;
  if (key.includes("media")) return <MovieIcon />;
  if (key.includes("telecom")) return <PhoneAndroidIcon />;
  if (key.includes("manufacturing") || key.includes("industrial")) return <FactoryIcon />;
  if (key.includes("defense")) return <ShieldIcon />;
  if (key.includes("global") || key.includes("international")) return <PublicIcon />;
  if (key.includes("esg") || key.includes("sustain")) return <SpaIcon />;
  return <DashboardCustomizeIcon />;
};

const App = () => {
  const dispatch = useDispatch();
  const { list, listStatus, ranking, rankingStatus } = useSelector((state) => state.sectors);
  const { details, detailsStatus, sectorRanking, sectorRankingStatus } = useSelector(
    (state) => state.funds
  );
  const rankingProgress = useSelector((state) => state.sectors.rankingProgress);

  const [selectedSector, setSelectedSector] = useState("");
  const [sectorSearch, setSectorSearch] = useState("");
  const [searchMode, setSearchMode] = useState("sector");
  const [globalSearch, setGlobalSearch] = useState("");
  const [timeframe, setTimeframe] = useState("oneYear");
  const [tableFilter, setTableFilter] = useState("");
  const [activePlans, setActivePlans] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch sector list on initial mount
  useEffect(() => {
    if (listStatus === "idle") {
      dispatch(fetchSectors());
    }
  }, [dispatch, listStatus]);

  // Default to Technology sector, or first available
  const defaultSector = useMemo(() => {
    if (listStatus === "succeeded" && list.length > 0) {
      return list.includes("Technology (IT)") ? "Technology (IT)" : list[0];
    }
    return "";
  }, [listStatus, list]);

  // Auto-select default sector when list loads
  useEffect(() => {
    if (defaultSector && !selectedSector) {
      setSelectedSector(defaultSector);
      dispatch(setActiveSector(defaultSector));
      dispatch(fetchSectorRanking(defaultSector));
    }
  }, [dispatch, defaultSector, selectedSector]);

  // Sync selected sector when fund search returns sector data
  const fundSector = sectorRanking?.fund?.sector;
  useEffect(() => {
    if (fundSector) {
      setSelectedSector(fundSector);
    }
  }, [fundSector]);

  // Handle sector selection from chip click
  // Sets active sector for SSE priority queue to cancel other pending requests
  const handleSectorSelect = (sector, options = {}) => {
    setSelectedSector(sector);
    dispatch(setActiveSector(sector));
    dispatch(clearFund());
    const payload = options.force ? { name: sector, force: true } : sector;
    dispatch(fetchSectorRanking(payload));
  };

  const handleRefresh = async () => {
    if (isRefreshing) {
      return;
    }
    setIsRefreshing(true);
    try {
      const refreshedList = await dispatch(refreshSectorCatalog()).unwrap();
      const nextSector =
        refreshedList && refreshedList.includes(selectedSector)
          ? selectedSector
          : refreshedList?.[0];
      if (nextSector) {
        handleSectorSelect(nextSector, { force: true });
      }
    } catch {
      // Ignore refresh errors for now; listStatus handles failure state
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle global search by sector name or fund code
  const handleGlobalSearch = () => {
    if (!globalSearch.trim()) return;

    if (searchMode === "sector") {
      const match = list.find(
        (sector) => sector.toLowerCase() === globalSearch.trim().toLowerCase()
      );
      if (match) {
        handleSectorSelect(match);
        return;
      }
      handleSectorSelect(globalSearch.trim());
      return;
    }

    // Fund search mode
    dispatch(clearFund());
    dispatch(fetchFundDetails(globalSearch.trim()));
    dispatch(fetchFundSectorRanking(globalSearch.trim()));
  };

  // Derived state for ranking display
  const activeRanking = sectorRanking?.sectorRanking || ranking;
  const activeSectorName =
    sectorRanking?.fund?.sector || activeRanking?.sector || selectedSector || "";
  const isRankingLoading = rankingStatus === "loading" || sectorRankingStatus === "loading";

  // Partial loading: active funds shown while inactive funds still loading
  const isPartialLoading = rankingStatus === "partial";

  const currentRows = useMemo(
    () => activeRanking?.rankings?.[timeframe] || [],
    [activeRanking, timeframe]
  );

  // Filter rows by search text and plan type filters
  const filteredRows = useMemo(() => {
    const search = tableFilter.trim().toLowerCase();
    return currentRows.filter((row) => {
      const name = row.schemeName?.toLowerCase() || "";
      const matchesSearch = !search || name.includes(search);
      const matchesPlans =
        activePlans.length === 0 || activePlans.some((plan) => name.includes(plan));
      return matchesSearch && matchesPlans;
    });
  }, [currentRows, tableFilter, activePlans]);

  // Top 4 funds by AUM
  const topAumFunds = useMemo(() => {
    return [...filteredRows]
      .filter((row) => row.metrics?.aum)
      .sort((a, b) => (b.metrics?.aum || 0) - (a.metrics?.aum || 0))
      .slice(0, 4);
  }, [filteredRows]);

  // Top 4 funds with lowest expense ratio
  const lowestExpense = useMemo(() => {
    return [...filteredRows]
      .filter(
        (row) => row.metrics?.expenseRatio !== null && row.metrics?.expenseRatio !== undefined
      )
      .sort((a, b) => (a.metrics?.expenseRatio || 0) - (b.metrics?.expenseRatio || 0))
      .slice(0, 4);
  }, [filteredRows]);

  // Sector aggregate metrics
  const averageReturn = useMemo(() => {
    const values = filteredRows
      .map((row) => row.returns)
      .filter((value) => typeof value === "number");
    if (values.length === 0) return null;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }, [filteredRows]);

  const averagePe = useMemo(() => {
    const values = filteredRows
      .map((row) => row.metrics?.peRatio)
      .filter((value) => typeof value === "number");
    if (values.length === 0) return null;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }, [filteredRows]);

  const averagePb = useMemo(() => {
    const values = filteredRows
      .map((row) => row.metrics?.pbRatio)
      .filter((value) => typeof value === "number");
    if (values.length === 0) return null;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }, [filteredRows]);

  // Filtered sector list for sector search
  const sectorList = useMemo(() => {
    const search = sectorSearch.trim().toLowerCase();
    if (!search) return list;
    return list.filter((sector) => sector.toLowerCase().includes(search));
  }, [list, sectorSearch]);

  if ((listStatus === "idle" || listStatus === "loading") && list.length === 0) {
    return <AppPreloader message="Loading sector catalog..." />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        transition: "background-color 0.3s ease",
      }}
    >
      {/* Header */}
      <AppBar position="sticky" elevation={0} sx={{ background: "transparent" }}>
        <Container maxWidth="xl" sx={{ py: { xs: 1.5, md: 2 } }}>
          <Paper sx={{ p: 1.5, backdropFilter: "blur(14px)" }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", md: "center" }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ width: { xs: "100%", md: "auto" } }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={<Chip size="small" label="Live" color="success" />}
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      bgcolor: "#FDE1C1",
                      color: "#1F5460",
                      width: 48,
                      height: 48,
                    }}
                  >
                    <InsightsIcon />
                  </Avatar>
                </Badge>
                <Box>
                  <Typography
                    variant="h2"
                    sx={{ fontSize: { xs: "1.5rem", sm: "1.7rem", md: "1.8rem" } }}
                  >
                    MFkin Analyser
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Sector intelligence and fund scouting
                  </Typography>
                </Box>
              </Stack>
              <Box sx={{ flex: 1, display: { xs: "none", md: "block" } }} />
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1.5}
                alignItems={{ xs: "stretch", md: "center" }}
                flexWrap="wrap"
                useFlexGap
                sx={{ maxWidth: "100%", width: { xs: "100%", md: "auto" } }}
              >
                <ToggleButtonGroup
                  value={searchMode}
                  exclusive
                  onChange={(_, value) => value && setSearchMode(value)}
                  size="small"
                  sx={{ width: { xs: "100%", sm: "auto" }, flexWrap: "wrap" }}
                >
                  <ToggleButton value="sector" sx={{ flex: { xs: 1, sm: "initial" } }}>
                    Sector
                  </ToggleButton>
                  <ToggleButton value="fund" sx={{ flex: { xs: 1, sm: "initial" } }}>
                    Fund
                  </ToggleButton>
                </ToggleButtonGroup>
                <TextField
                  size="small"
                  placeholder="Search fund, AMC, or sector"
                  value={globalSearch}
                  onChange={(event) => setGlobalSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleGlobalSearch();
                  }}
                  sx={{
                    minWidth: { xs: "100%", sm: 220 },
                    maxWidth: { xs: "100%", md: 320 },
                    flex: { md: 1 },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <ToggleButtonGroup
                  value={timeframe}
                  exclusive
                  onChange={(_, value) => value && setTimeframe(value)}
                  size="small"
                  sx={{ width: { xs: "100%", sm: "auto" }, flexWrap: "wrap" }}
                >
                  {timeframes.map((item) => (
                    <ToggleButton
                      key={item.key}
                      value={item.key}
                      sx={{ flex: { xs: 1, sm: "initial" } }}
                    >
                      {item.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                <Button
                  variant="contained"
                  onClick={handleGlobalSearch}
                  disabled={!globalSearch.trim()}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  Search
                </Button>
                <Box
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    display: "flex",
                    justifyContent: { xs: "center", sm: "flex-start" },
                  }}
                >
                  <ThemeSelector />
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  sx={{ flexShrink: 0, width: { xs: "100%", sm: "auto" } }}
                >
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 1.5, md: 2 } }}>
        {/* Sector Selector */}
        <Paper
          sx={{
            p: 2,
            mb: 2,
            animation: "floatIn 0.6s ease",
            animationFillMode: "both",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{ mb: 2 }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, minWidth: { xs: "auto", sm: 80 } }}
            >
              Sectors
            </Typography>
            <TextField
              size="small"
              placeholder="Search..."
              value={sectorSearch}
              onChange={(event) => setSectorSearch(event.target.value)}
              sx={{ width: { xs: "100%", sm: 150 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          <Box
            sx={{
              display: "flex",
              flexWrap: { xs: "nowrap", sm: "wrap" },
              gap: 1,
              overflowX: { xs: "auto", sm: "visible" },
              pb: { xs: 1, sm: 0 },
              WebkitOverflowScrolling: "touch",
            }}
          >
            {sectorList.map((sector) => (
              <Chip
                key={sector}
                icon={getSectorIcon(sector)}
                label={sector}
                onClick={() => handleSectorSelect(sector)}
                variant={sector === selectedSector ? "filled" : "outlined"}
                sx={{
                  flexShrink: 0,
                  fontWeight: sector === selectedSector ? 600 : 400,
                  bgcolor: sector === selectedSector ? "rgba(31,84,96,0.15)" : "transparent",
                  "&:hover": {
                    bgcolor: "rgba(31,84,96,0.1)",
                  },
                }}
              />
            ))}
          </Box>
        </Paper>

        {/* Sector Stats & Filters */}
        <Paper
          sx={{
            p: 2,
            mb: 2,
            animation: "floatIn 0.6s ease",
            animationDelay: "0.05s",
            animationFillMode: "both",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <Box flex={1}>
              <Typography
                variant="h1"
                sx={{ fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" } }}
              >
                {activeSectorName || "Select a sector"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activeRanking?.generatedAt
                  ? `Last refreshed ${new Date(activeRanking.generatedAt).toLocaleString()}`
                  : "Select a sector above to see rankings"}
              </Typography>
            </Box>
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              alignItems="center"
              useFlexGap
              sx={{ width: { xs: "100%", md: "auto" } }}
            >
              <Chip label={`${activeRanking?.totalFunds ?? 0} funds`} size="small" />
              <Chip label={`Avg: ${formatReturn(averageReturn)}`} size="small" />
              <Chip
                label={`P/E: ${averagePe === null ? "—" : averagePe.toFixed(1)}`}
                size="small"
              />
              <Chip
                label={`P/B: ${averagePb === null ? "—" : averagePb.toFixed(1)}`}
                size="small"
              />
              <Divider
                orientation="vertical"
                flexItem
                sx={{ display: { xs: "none", sm: "block" } }}
              />
              {planFilters.map((plan) => (
                <Chip
                  key={plan.key}
                  label={plan.label}
                  size="small"
                  variant={activePlans.includes(plan.key) ? "filled" : "outlined"}
                  onClick={() => {
                    setActivePlans((prev) =>
                      prev.includes(plan.key)
                        ? prev.filter((item) => item !== plan.key)
                        : [...prev, plan.key]
                    );
                  }}
                />
              ))}
              <TextField
                size="small"
                placeholder="Filter funds..."
                value={tableFilter}
                onChange={(event) => setTableFilter(event.target.value)}
                sx={{ width: { xs: "100%", sm: 160 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Stack>
        </Paper>

        {/* Loading Progress */}
        {isRankingLoading && (
          <Paper sx={{ p: 3, mb: 2 }}>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">
                  {rankingProgress?.message || `Crunching rankings for ${selectedSector}…`}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  {rankingProgress?.errors > 0 && (
                    <Chip label={`${rankingProgress.errors} errors`} size="small" color="warning" />
                  )}
                  <Chip
                    label={rankingProgress?.phase === "ranking" ? "Finishing" : "Processing"}
                    size="small"
                    color="primary"
                  />
                </Stack>
              </Stack>

              <LinearProgress
                variant={rankingProgress?.percent ? "determinate" : "indeterminate"}
                value={rankingProgress?.percent || 0}
                sx={{ height: 10, borderRadius: 5 }}
              />

              {rankingProgress?.total && (
                <Stack direction="row" spacing={3} alignItems="center" justifyContent="center">
                  <Typography variant="h4" color="primary.main">
                    {rankingProgress.processed || 0} / {rankingProgress.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    funds processed
                  </Typography>
                  {rankingProgress?.eta > 0 && (
                    <Chip
                      label={`~${rankingProgress.eta}s remaining`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Stack>
              )}

              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 1 }}>
                <Chip
                  icon={
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor:
                          rankingProgress?.phase === "loading_funds"
                            ? "primary.main"
                            : "success.main",
                      }}
                    />
                  }
                  label="Load funds"
                  size="small"
                  variant={rankingProgress?.phase === "loading_funds" ? "filled" : "outlined"}
                />
                <Chip
                  icon={
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor:
                          rankingProgress?.phase === "processing"
                            ? "primary.main"
                            : rankingProgress?.processed
                              ? "success.main"
                              : "grey.300",
                      }}
                    />
                  }
                  label="Fetch returns"
                  size="small"
                  variant={rankingProgress?.phase === "processing" ? "filled" : "outlined"}
                />
                <Chip
                  icon={
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: rankingProgress?.phase === "ranking" ? "primary.main" : "grey.300",
                      }}
                    />
                  }
                  label="Build rankings"
                  size="small"
                  variant={rankingProgress?.phase === "ranking" ? "filled" : "outlined"}
                />
              </Stack>
            </Stack>
          </Paper>
        )}

        {/* Partial Loading Indicator */}
        {isPartialLoading && activeRanking && (
          <Paper sx={{ p: 2, mb: 2, bgcolor: "info.light" }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" color="info.dark">
                Showing {activeRanking.totalFunds} active funds. Loading{" "}
                {activeRanking.pendingInactive || 0} inactive funds in background...
              </Typography>
              <LinearProgress sx={{ flex: 1, height: 6, borderRadius: 3 }} />
            </Stack>
          </Paper>
        )}

        {/* Top Funds & Quick Insights */}
        {activeRanking && (
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={8}>
              <TopFundsPanel topFunds={activeRanking.topFunds} activeTimeframe={timeframe} />
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                {/* Top AUM Panel */}
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                    Top AUM in {activeSectorName}
                  </Typography>
                  <Stack spacing={1}>
                    {topAumFunds.length === 0 && (
                      <Typography variant="caption" color="text.secondary">
                        No AUM data
                      </Typography>
                    )}
                    {topAumFunds.slice(0, 4).map((fund) => (
                      <Stack
                        key={fund.schemeCode}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {fund.schemeName?.substring(0, 35)}
                        </Typography>
                        <Chip label={formatAum(fund.metrics?.aum)} size="small" />
                      </Stack>
                    ))}
                  </Stack>
                </Paper>

                {/* Lowest Expense Panel */}
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                    Lowest Expense Ratio
                  </Typography>
                  <Stack spacing={1}>
                    {lowestExpense.length === 0 && (
                      <Typography variant="caption" color="text.secondary">
                        No expense data
                      </Typography>
                    )}
                    {lowestExpense.slice(0, 4).map((fund) => (
                      <Stack
                        key={fund.schemeCode}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {fund.schemeName?.substring(0, 35)}
                        </Typography>
                        <Chip
                          label={`${fund.metrics?.expenseRatio?.toFixed?.(2) ?? "—"}%`}
                          size="small"
                        />
                      </Stack>
                    ))}
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        )}

        {/* Fund Details Panel */}
        {detailsStatus === "loading" && (
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Fetching fund details…
            </Typography>
            <LinearProgress />
          </Paper>
        )}

        {details && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="flex-start">
              <Box flex={1}>
                <Typography variant="h3">{details.schemeName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Code: {details.schemeCode} · {details.meta?.fund_house || ""}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={`NAV: ${details.latestNav || "—"}`} />
                <Chip label={`1Y: ${formatReturn(details.returns?.year1)}`} />
                <Chip label={`3Y: ${formatReturn(details.returns?.year3)}`} />
                <Chip label={`5Y: ${formatReturn(details.returns?.year5)}`} />
                <Chip label={`AUM: ${formatAum(details.metrics?.aum)}`} />
                <Chip label={`P/E: ${details.metrics?.peRatio ?? "—"}`} />
              </Stack>
            </Stack>
          </Paper>
        )}
      </Container>

      {/* Full-width Ranking Table */}
      {activeRanking && (
        <Box
          sx={{
            width: "100%",
            px: { xs: 1, sm: 2 },
            pb: { xs: 3, sm: 4 },
            animation: "floatIn 0.6s ease",
            animationDelay: "0.2s",
            animationFillMode: "both",
          }}
        >
          <RankingTable
            rows={filteredRows}
            timeframeLabel={timeframes.find((item) => item.key === timeframe)?.label}
            note="AUM and ratios are sourced from Kuvera when available. Click column headers to sort."
          />
        </Box>
      )}
    </Box>
  );
};

export default App;
