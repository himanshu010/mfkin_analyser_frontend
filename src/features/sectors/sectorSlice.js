import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSectors, getSectorRanking } from "../../app/api.js";

export const fetchSectors = createAsyncThunk("sectors/fetchList", async () => {
  const response = await getSectors({ available: true });
  return response.data.sectors || [];
});

export const fetchSectorRanking = createAsyncThunk(
  "sectors/fetchRanking",
  async (sectorName) => {
    const response = await getSectorRanking(sectorName);
    return response.data;
  }
);

const sectorSlice = createSlice({
  name: "sectors",
  initialState: {
    list: [],
    listStatus: "idle",
    ranking: null,
    rankingStatus: "idle",
    error: null,
  },
  reducers: {
    clearRanking(state) {
      state.ranking = null;
      state.rankingStatus = "idle";
      state.error = null;
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
      })
      .addCase(fetchSectorRanking.fulfilled, (state, action) => {
        state.rankingStatus = "succeeded";
        state.ranking = action.payload;
      })
      .addCase(fetchSectorRanking.rejected, (state, action) => {
        state.rankingStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearRanking } = sectorSlice.actions;
export default sectorSlice.reducer;
