import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import themeReducer, { setTheme, selectTheme } from '../themeSlice';

const createTestStore = (preloadedState) =>
  configureStore({ reducer: { theme: themeReducer }, preloadedState });

describe('themeSlice', () => {
  describe('initial state', () => {
    it('has light as default theme', () => {
      const store = createTestStore();
      expect(store.getState().theme.current).toBe('light');
    });
  });

  describe('setTheme', () => {
    it('sets theme to dark', () => {
      const store = createTestStore();
      store.dispatch(setTheme('dark'));
      expect(store.getState().theme.current).toBe('dark');
    });

    it('sets theme to funky', () => {
      const store = createTestStore();
      store.dispatch(setTheme('funky'));
      expect(store.getState().theme.current).toBe('funky');
    });

    it('sets theme back to light', () => {
      const store = createTestStore({ theme: { current: 'dark' } });
      store.dispatch(setTheme('light'));
      expect(store.getState().theme.current).toBe('light');
    });
  });

  describe('selectTheme', () => {
    it('selects current theme', () => {
      const store = createTestStore({ theme: { current: 'funky' } });
      const theme = selectTheme(store.getState());
      expect(theme).toBe('funky');
    });
  });
});
