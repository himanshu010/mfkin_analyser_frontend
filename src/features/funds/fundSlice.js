import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFundDetails, getFundSectorRanking } from '../../app/api.js';

// Fetch individual fund details by scheme code or name
export const fetchFundDetails = createAsyncThunk('funds/fetchDetails', async (query) => {
  const response = await getFundDetails(query);
  return response.data;
});

// Fetch ranking data for a fund's sector to show fund position among peers
export const fetchFundSectorRanking = createAsyncThunk(
  'funds/fetchSectorRanking',
  async (query) => {
    const response = await getFundSectorRanking(query);
    return response.data;
  }
);

const fundSlice = createSlice({
  name: 'funds',
  initialState: {
    details: null,
    detailsStatus: 'idle',
    sectorRanking: null,
    sectorRankingStatus: 'idle',
    error: null,
  },
  reducers: {
    // Reset fund state when switching searches
    clearFund(state) {
      state.details = null;
      state.detailsStatus = 'idle';
      state.sectorRanking = null;
      state.sectorRankingStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFundDetails.pending, (state) => {
        state.detailsStatus = 'loading';
      })
      .addCase(fetchFundDetails.fulfilled, (state, action) => {
        state.detailsStatus = 'succeeded';
        state.details = action.payload;
      })
      .addCase(fetchFundDetails.rejected, (state, action) => {
        state.detailsStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchFundSectorRanking.pending, (state) => {
        state.sectorRankingStatus = 'loading';
      })
      .addCase(fetchFundSectorRanking.fulfilled, (state, action) => {
        state.sectorRankingStatus = 'succeeded';
        state.sectorRanking = action.payload;
      })
      .addCase(fetchFundSectorRanking.rejected, (state, action) => {
        state.sectorRankingStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearFund } = fundSlice.actions;
export default fundSlice.reducer;
