import { configureStore } from "@reduxjs/toolkit";
import sectorsReducer from "../features/sectors/sectorSlice.js";
import fundsReducer from "../features/funds/fundSlice.js";
import themeReducer from "../features/theme/themeSlice.js";

// Redux store configuration with sector, fund, and theme slices
export const store = configureStore({
  reducer: {
    sectors: sectorsReducer,
    funds: fundsReducer,
    theme: themeReducer,
  },
});
