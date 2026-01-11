import { createSlice } from '@reduxjs/toolkit';

// Get initial theme from localStorage or default to 'light'
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme') || 'light';
  }
  return 'light';
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    current: getInitialTheme(),
  },
  reducers: {
    setTheme: (state, action) => {
      state.current = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
    },
  },
});

export const { setTheme } = themeSlice.actions;
export const selectTheme = (state) => state.theme.current;
export default themeSlice.reducer;
