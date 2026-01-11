import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSectors, getSectorRanking, API_BASE } from "../../app/api.js";

// Ensure "All Funds" is always available
const ensureAllFunds = (sectors) => {
  if (!sectors.includes("All Funds")) {
    return ["All Funds", ...sectors];
  }
  return sectors;
};

// Track current EventSource to allow cancellation
let currentEventSource = null;
let currentFetchController = null;

// Cancel any ongoing fetch
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

export const fetchSectors = createAsyncThunk("sectors/fetchList", async () => {
  const response = await getSectors({ available: true });
  const sectors = response.data.sectors || [];
  return ensureAllFunds(sectors);
});

// Fetch sector ranking with SSE and cancellation support
export const fetchSectorRanking = createAsyncThunk(
  "sectors/fetchRanking",
  async (sectorName, { dispatch, getState, rejectWithValue }) => {
    // Check cache first
    const state = getState();
    if (state.sectors.sectorCache[sectorName]) {
      return state.sectors.sectorCache[sectorName];
    }
    
    // Cancel any ongoing fetch (active sector takes priority)
    cancelCurrentFetch();
    
    // Create new abort controller
    currentFetchController = new AbortController();
    
    return new Promise((resolve, reject) => {
      const encodedSector = encodeURIComponent(sectorName);
      const eventSource = new EventSource(`${API_BASE}/sector/${encodedSector}/stream`);
      currentEventSource = eventSource;
      
      eventSource.addEventListener("progress", (event) => {
        try {
          const data = JSON.parse(event.data);
          dispatch(updateRankingProgress({ sector: sectorName, ...data }));
        } catch (e) {
          // Ignore parse errors
        }
      });
      
      eventSource.addEventListener("status", (event) => {
        try {
          const data = JSON.parse(event.data);
          dispatch(updateRankingProgress({ sector: sectorName, ...data }));
        } catch (e) {
          // Ignore parse errors
        }
      });
      
      eventSource.addEventListener("partial", (event) => {
        try {
          const data = JSON.parse(event.data);
          // Show partial results immediately (active funds only)
          dispatch(setPartialRanking(data));
        } catch (e) {
          // Ignore parse errors
        }
      });
      
      eventSource.addEventListener("complete", (event) => {
        try {
          const data = JSON.parse(event.data);
          eventSource.close();
          currentEventSource = null;
          // Cache the result
          dispatch(cacheSectorData({ sector: sectorName, data }));
          resolve(data);
        } catch (e) {
          eventSource.close();
          currentEventSource = null;
          reject(new Error("Failed to parse response"));
        }
      });
      
      eventSource.addEventListener("error", (event) => {
        eventSource.close();
        currentEventSource = null;
        
        // If aborted due to sector switch, don't fall back
        if (currentFetchController?.signal?.aborted) {
          reject(new Error("Fetch cancelled"));
          return;
        }
        
        // Fallback to regular API if SSE fails
        getSectorRanking(sectorName)
          .then((response) => {
            const data = response.data;
            dispatch(cacheSectorData({ sector: sectorName, data }));
            resolve(data);
          })
          .catch((err) => reject(err));
      });
      
      // Timeout after 30 minutes for very large sectors
      const timeout = setTimeout(() => {
        if (currentEventSource === eventSource) {
          eventSource.close();
          currentEventSource = null;
          reject(new Error("Request timed out"));
        }
      }, 30 * 60 * 1000);
      
      // Clear timeout on completion
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
    sectorCache: {}, // Cache loaded sector data
    error: null,
  },
  reducers: {
    setActiveSector(state, action) {
      state.activeSector = action.payload;
    },
    clearRanking(state) {
      state.ranking = null;
      state.rankingStatus = "idle";
      state.rankingProgress = null;
      state.error = null;
    },
    updateRankingProgress(state, action) {
      // Only update if this is for the active sector
      if (action.payload.sector === state.activeSector) {
        state.rankingProgress = action.payload;
      }
    },
    setPartialRanking(state, action) {
      // Show active funds immediately while inactive funds load
      state.ranking = action.payload;
      state.rankingStatus = "partial";
    },
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
