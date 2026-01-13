import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSectors, getSectorRanking, preloadSectorFunds, API_BASE } from "../../app/api.js";

// Ensure "All Funds" option is always available in sector list
const ensureAllFunds = (sectors) => {
  if (!sectors.includes("All Funds")) {
    return ["All Funds", ...sectors];
  }
  return sectors;
};

// Track current EventSource and fetch controller for cancellation
let currentEventSource = null;
let currentFetchController = null;

// Cancel any ongoing fetch when user switches sectors
const cancelCurrentFetch = () => {
  if (currentEventSource) {
    currentEventSource.close();
    currentEventSource = null;
  }
  if (currentFetchController) {
    currentFetchController.abort();
    currentFetchController = null;
  }
};

// Fetch available sector list from API
export const fetchSectors = createAsyncThunk("sectors/fetchList", async () => {
  const response = await getSectors({ available: true });
  const sectors = response.data.sectors || [];
  return ensureAllFunds(sectors);
});

export const refreshSectorCatalog = createAsyncThunk("sectors/refreshCatalog", async () => {
  await preloadSectorFunds();
  const response = await getSectors({ available: true, refresh: true });
  const sectors = response.data.sectors || [];
  return ensureAllFunds(sectors);
});

// Fetch sector ranking with Server-Sent Events for real-time progress
// Supports cancellation when user switches to different sector
export const fetchSectorRanking = createAsyncThunk(
  "sectors/fetchRanking",
  async (sectorPayload, { dispatch, getState }) => {
    const sectorName = typeof sectorPayload === "string" ? sectorPayload : sectorPayload?.name;
    const forceRefresh = typeof sectorPayload === "object" && sectorPayload?.force;

    // Return cached data if available (unless forced)
    const state = getState();
    if (!forceRefresh && state.sectors.sectorCache[sectorName]) {
      return state.sectors.sectorCache[sectorName];
    }

    // Cancel any ongoing fetch - active sector takes priority
    cancelCurrentFetch();

    currentFetchController = new AbortController();

    return new Promise((resolve, reject) => {
      const encodedSector = encodeURIComponent(sectorName);
      const refreshParam = forceRefresh ? "?refresh=true" : "";
      const eventSource = new EventSource(
        `${API_BASE}/sector/${encodedSector}/stream${refreshParam}`
      );
      currentEventSource = eventSource;

      // Handle progress updates from SSE stream
      eventSource.addEventListener("progress", (event) => {
        try {
          const data = JSON.parse(event.data);
          dispatch(updateRankingProgress({ sector: sectorName, ...data }));
        } catch {
          // Ignore parse errors
        }
      });

      // Handle status updates from SSE stream
      eventSource.addEventListener("status", (event) => {
        try {
          const data = JSON.parse(event.data);
          dispatch(updateRankingProgress({ sector: sectorName, ...data }));
        } catch {
          // Ignore parse errors
        }
      });

      // Handle partial results - show active funds while inactive funds load
      eventSource.addEventListener("partial", (event) => {
        try {
          const data = JSON.parse(event.data);
          dispatch(setPartialRanking(data));
        } catch {
          // Ignore parse errors
        }
      });

      // Handle completion - final ranking data received
      eventSource.addEventListener("complete", (event) => {
        try {
          const data = JSON.parse(event.data);
          eventSource.close();
          currentEventSource = null;
          dispatch(cacheSectorData({ sector: sectorName, data }));
          resolve(data);
        } catch {
          eventSource.close();
          currentEventSource = null;
          reject(new Error("Failed to parse response"));
        }
      });

      // Handle errors - fallback to REST API if SSE fails
      eventSource.addEventListener("error", () => {
        eventSource.close();
        currentEventSource = null;

        // Don't fallback if cancelled due to sector switch
        if (currentFetchController?.signal?.aborted) {
          reject(new Error("Fetch cancelled"));
          return;
        }

        // Fallback to regular API
        getSectorRanking(sectorName, { refresh: forceRefresh })
          .then((response) => {
            const data = response.data;
            dispatch(cacheSectorData({ sector: sectorName, data }));
            resolve(data);
          })
          .catch((err) => reject(err));
      });

      // Timeout after 30 minutes for very large sectors like "All Funds"
      const timeout = setTimeout(
        () => {
          if (currentEventSource === eventSource) {
            eventSource.close();
            currentEventSource = null;
            reject(new Error("Request timed out"));
          }
        },
        30 * 60 * 1000
      );

      eventSource.addEventListener("complete", () => clearTimeout(timeout));
      eventSource.addEventListener("error", () => clearTimeout(timeout));
    });
  }
);

const sectorSlice = createSlice({
  name: "sectors",
  initialState: {
    list: [],
    listStatus: "idle",
    activeSector: "All Funds",
    ranking: null,
    rankingStatus: "idle",
    rankingProgress: null,
    sectorCache: {},
    error: null,
  },
  reducers: {
    // Set currently selected sector for priority queue
    setActiveSector(state, action) {
      state.activeSector = action.payload;
    },

    // Clear ranking data when switching sectors
    clearRanking(state) {
      state.ranking = null;
      state.rankingStatus = "idle";
      state.rankingProgress = null;
      state.error = null;
    },

    // Update progress only for active sector
    updateRankingProgress(state, action) {
      if (action.payload.sector === state.activeSector) {
        state.rankingProgress = action.payload;
      }
    },

    // Show partial results while full data loads
    setPartialRanking(state, action) {
      state.ranking = action.payload;
      state.rankingStatus = "partial";
    },

    // Cache sector data to avoid refetching
    cacheSectorData(state, action) {
      const { sector, data } = action.payload;
      state.sectorCache[sector] = data;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSectors.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchSectors.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchSectors.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(refreshSectorCatalog.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(refreshSectorCatalog.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload;
        state.sectorCache = {};
      })
      .addCase(refreshSectorCatalog.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchSectorRanking.pending, (state) => {
        state.rankingStatus = "loading";
        state.rankingProgress = null;
      })
      .addCase(fetchSectorRanking.fulfilled, (state, action) => {
        state.rankingStatus = "succeeded";
        state.ranking = action.payload;
      })
      .addCase(fetchSectorRanking.rejected, (state, action) => {
        // Don't mark as failed if cancelled due to sector switch
        if (action.error.message === "Fetch cancelled") {
          return;
        }
        state.rankingStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  setActiveSector,
  clearRanking,
  updateRankingProgress,
  setPartialRanking,
  cacheSectorData,
} = sectorSlice.actions;
export default sectorSlice.reducer;
