import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  AppBar,
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InsightsIcon from "@mui/icons-material/Insights";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useDispatch, useSelector } from "react-redux";
import { fetchSectors, fetchSectorRanking } from "./features/sectors/sectorSlice.js";
import {
  clearFund,
  fetchFundDetails,
  fetchFundSectorRanking,
} from "./features/funds/fundSlice.js";
import TopFundsPanel from "./components/TopFundsPanel.jsx";
import RankingTable from "./components/RankingTable.jsx";
import AppPreloader from "./components/AppPreloader.jsx";
import { getPreloadStatus, triggerPreload, getSectorRankingStream } from "./app/api.js";

const formatReturn = (value) =>
  value === null || value === undefined ? "N/A" : `${value.toFixed(2)}%`;

const App = () => {
  const dispatch = useDispatch();
  const { list, listStatus, ranking, rankingStatus } = useSelector(
    (state) => state.sectors
  );
  const {
    details,
    detailsStatus,
    sectorRanking,
    sectorRankingStatus,
  } = useSelector((state) => state.funds);

  const [tab, setTab] = useState("sector");
  const [sectorInput, setSectorInput] = useState("");
  const [fundInput, setFundInput] = useState("");
  
  // Preload state
  const [preloadStatus, setPreloadStatus] = useState(null);
  const [isPreloading, setIsPreloading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  // Streaming progress state
  const [progress, setProgress] = useState(null);
  const [streamingRanking, setStreamingRanking] = useState(null);

  const highlightedSectors = useMemo(() => list.slice(0, 6), [list]);

  // Fetch preload status on mount
  useEffect(() => {
    getPreloadStatus()
      .then((res) => setPreloadStatus(res.data))
      .catch(() => setPreloadStatus(null));
  }, []);

  const handlePreload = useCallback(async () => {
    setIsPreloading(true);
    try {
      const res = await triggerPreload();
      setPreloadStatus({ preloaded: true, metadata: res.data });
      setSnackbar({
        open: true,
        message: `Preload complete! ${res.data.classifiedFunds} funds classified.`,
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Preload failed: ${err.message}`,
        severity: "error",
      });
    } finally {
      setIsPreloading(false);
    }
  }, []);

  const formatPreloadDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  useEffect(() => {
    if (listStatus === "idle") {
      dispatch(fetchSectors());
    }
  }, [dispatch, listStatus]);

  // Show preloader while initial sectors are loading
  if (listStatus === "idle" || listStatus === "loading") {
    return <AppPreloader message="Loading sector catalog..." />;
  }

  const handleSectorSearch = async () => {
    if (!sectorInput) return;
    
    // Clear previous results and start streaming
    setStreamingRanking(null);
    setProgress({ percent: 0, message: "Starting...", total: 0, processed: 0 });
    
    try {
      const result = await getSectorRankingStream(sectorInput, {
        onStatus: (data) => {
          setProgress((prev) => ({ ...prev, message: data.message, phase: data.phase }));
        },
        onProgress: (data) => {
          setProgress({
            percent: data.percent,
            message: data.message,
            total: data.total,
            processed: data.processed,
            eta: data.eta,
            errors: data.errors,
            phase: data.phase,
          });
        },
        onComplete: (data) => {
          setStreamingRanking(data);
          setProgress(null);
        },
        onError: (err) => {
          setSnackbar({ open: true, message: `Error: ${err.message}`, severity: "error" });
          setProgress(null);
        },
      });
      
      // Handle result from Promise (especially for cached JSON responses)
      if (result) {
        setStreamingRanking(result);
        setProgress(null);
      }
    } catch (err) {
      setSnackbar({ open: true, message: `Error: ${err.message}`, severity: "error" });
      setProgress(null);
    }
  };

  const handleFundSearch = () => {
    if (!fundInput) return;
    dispatch(clearFund());
    dispatch(fetchFundDetails(fundInput));
    dispatch(fetchFundSectorRanking(fundInput));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #FCE8C8 0%, #F5F0E6 45%, #EDF2F3 100%)",
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{ background: "transparent", color: "#0F4C5C" }}
      >
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton
              sx={{
                background: "#FFE3C2",
                color: "#0F4C5C",
                borderRadius: 3,
              }}
            >
              <DashboardIcon />
            </IconButton>
            <Box>
              <Typography variant="h2">MF Analyser</Typography>
              <Typography variant="body2" color="text.secondary">
                Sector intelligence for Indian mutual funds
              </Typography>
            </Box>
          </Stack>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4} alignItems="stretch">
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 3, height: "100%" }}>
              <Stack spacing={2}>
                <Typography variant="h1">
                  Decode sectors. Discover leaders.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Search by sector or mutual fund to surface top performers across
                  1Y, 3Y, and 5Y return windows.
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {highlightedSectors.map((sector) => (
                    <Chip
                      key={sector}
                      label={sector}
                      onClick={() => {
                        setSectorInput(sector);
                        setTab("sector");
                      }}
                    />
                  ))}
                </Stack>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: 3, height: "100%" }}>
              <Tabs
                value={tab}
                onChange={(_, value) => setTab(value)}
                textColor="primary"
                indicatorColor="primary"
                sx={{ mb: 2 }}
              >
                <Tab label="Sector ranking" value="sector" />
                <Tab label="Fund lookup" value="fund" />
              </Tabs>

              {tab === "sector" && (
                <Stack spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel id="sector-select-label">Select sector</InputLabel>
                    <Select
                      labelId="sector-select-label"
                      value={sectorInput}
                      label="Select sector"
                      onChange={(event) => setSectorInput(event.target.value)}
                    >
                      {list.map((sector) => (
                        <MenuItem key={sector} value={sector}>
                          {sector}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    endIcon={<SearchIcon />}
                    onClick={handleSectorSearch}
                  >
                    Get sector ranking
                  </Button>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        {listStatus === "loading"
                          ? "Loading sector catalog..."
                          : `${list.length} sectors available`}
                      </Typography>
                      {preloadStatus?.preloaded && (
                        <Tooltip title={`Last refreshed: ${formatPreloadDate(preloadStatus.metadata?.generatedAt)}`}>
                          <CheckCircleIcon sx={{ fontSize: 16, color: "success.main" }} />
                        </Tooltip>
                      )}
                    </Stack>
                    <Tooltip title={preloadStatus?.preloaded 
                      ? `${preloadStatus.metadata?.classifiedFunds || 0} funds pre-classified. Click to refresh.` 
                      : "Pre-compute sector data for faster searches"}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={isPreloading ? <CircularProgress size={16} /> : <RefreshIcon />}
                        onClick={handlePreload}
                        disabled={isPreloading}
                        sx={{ minWidth: 120 }}
                      >
                        {isPreloading ? "Refreshing..." : "Refresh Data"}
                      </Button>
                    </Tooltip>
                  </Stack>
                </Stack>
              )}

              {tab === "fund" && (
                <Stack spacing={2}>
                  <TextField
                    label="Fund name or code"
                    placeholder="HDFC Pharma Fund or 120466"
                    value={fundInput}
                    onChange={(event) => setFundInput(event.target.value)}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    endIcon={<InsightsIcon />}
                    onClick={handleFundSearch}
                  >
                    Get fund details
                  </Button>
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Loading overlay for sector ranking with progress */}
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            flexDirection: "column",
            gap: 2,
          }}
          open={progress !== null || rankingStatus === "loading" || sectorRankingStatus === "loading"}
        >
          {progress ? (
            <Stack spacing={2} alignItems="center" sx={{ width: "80%", maxWidth: 400 }}>
              <Typography variant="h6">
                {progress.message || "Analyzing sector funds..."}
              </Typography>
              
              {/* Progress bar */}
              <Box sx={{ width: "100%", position: "relative" }}>
                <Box
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${progress.percent || 0}%`,
                      backgroundColor: "#4caf50",
                      borderRadius: 4,
                      transition: "width 0.3s ease",
                    }}
                  />
                </Box>
              </Box>
              
              {/* Progress details */}
              <Stack direction="row" spacing={3} justifyContent="center">
                <Typography variant="body2">
                  {progress.percent || 0}%
                </Typography>
                {progress.total > 0 && (
                  <Typography variant="body2">
                    {progress.processed || 0} / {progress.total} funds
                  </Typography>
                )}
                {progress.eta > 0 && (
                  <Typography variant="body2">
                    ~{progress.eta}s remaining
                  </Typography>
                )}
              </Stack>
              
              {progress.errors > 0 && (
                <Typography variant="caption" sx={{ color: "warning.light" }}>
                  {progress.errors} fund(s) skipped due to errors
                </Typography>
              )}
            </Stack>
          ) : (
            <>
              <CircularProgress color="inherit" />
              <Typography variant="h6">
                {rankingStatus === "loading" 
                  ? "Analyzing sector funds... This may take a moment."
                  : "Loading fund sector ranking..."}
              </Typography>
            </>
          )}
        </Backdrop>

        {tab === "sector" && (
          <Stack spacing={3}>
            {(streamingRanking || ranking) && (
              <>
                <Typography variant="h2">{(streamingRanking || ranking).sector}</Typography>
                <TopFundsPanel topFunds={(streamingRanking || ranking).topFunds} />
                <RankingTable rankings={(streamingRanking || ranking).rankings} />
              </>
            )}
          </Stack>
        )}

        {tab === "fund" && (
          <Stack spacing={3}>
            {detailsStatus === "loading" && (
              <Typography variant="body1">Loading fund details...</Typography>
            )}
            {details && (
              <Paper elevation={0} sx={{ p: 3 }}>
                <Stack spacing={1}>
                  <Typography variant="h2">{details.schemeName}</Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Scheme code: {details.schemeCode}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip label={`Sector: ${details.sector || "Unknown"}`} />
                    <Chip label={`NAV: ${details.latestNav || "N/A"}`} />
                    <Chip label={`NAV Date: ${details.navDate || "N/A"}`} />
                  </Stack>
                  <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 2 }}>
                    <Chip label={`1Y: ${formatReturn(details.returns?.year1)}`} />
                    <Chip label={`3Y: ${formatReturn(details.returns?.year3)}`} />
                    <Chip label={`5Y: ${formatReturn(details.returns?.year5)}`} />
                  </Stack>
                </Stack>
              </Paper>
            )}

            {sectorRankingStatus === "loading" && (
              <Typography variant="body1">Loading sector ranking...</Typography>
            )}
            {sectorRanking && (
              <>
                <Typography variant="h2">
                  {sectorRanking.fund?.sector} sector ranking
                </Typography>
                <TopFundsPanel topFunds={sectorRanking.sectorRanking?.topFunds} />
                <RankingTable rankings={sectorRanking.sectorRanking?.rankings} />
              </>
            )}
          </Stack>
        )}
      </Container>

      {/* Snackbar for preload notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default App;
