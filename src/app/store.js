import { configureStore } from "@reduxjs/toolkit";
import sectorsReducer from "../features/sectors/sectorSlice.js";
import fundsReducer from "../features/funds/fundSlice.js";

export const store = configureStore({
  reducer: {
    sectors: sectorsReducer,
    funds: fundsReducer,
  },
});
