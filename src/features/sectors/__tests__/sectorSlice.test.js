import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import sectorsReducer, {
  fetchSectors,
  fetchSectorRanking,
  clearRanking,
  setActiveSector,
  updateRankingProgress,
  setPartialRanking,
  cacheSectorData,
} from '../sectorSlice';
import * as api from '../../../app/api';

vi.mock('../../../app/api');

// Store event callbacks to trigger them in tests
let eventCallbacks = {};
let mockClose;
let mockEventSource;

class MockEventSource {
  constructor(url) {
    this.url = url;
    this.readyState = 1;
    eventCallbacks = {};
    mockClose = vi.fn(() => {
      this.readyState = 2;
    });
    this.close = mockClose;
    mockEventSource = this;
  }
  addEventListener(event, callback) {
    if (!eventCallbacks[event]) eventCallbacks[event] = [];
    eventCallbacks[event].push(callback);
  }
}

// Helper to trigger event
const triggerEvent = (event, data) => {
  if (eventCallbacks[event]) {
    eventCallbacks[event].forEach((cb) => cb({ data: JSON.stringify(data) }));
  }
};

const triggerEventRaw = (event, data) => {
  if (eventCallbacks[event]) {
    eventCallbacks[event].forEach((cb) => cb({ data }));
  }
};

const createTestStore = () => configureStore({ reducer: { sectors: sectorsReducer } });

describe('sectorSlice', () => {
  let store;
  let originalEventSource;

  beforeEach(() => {
    store = createTestStore();
    vi.clearAllMocks();
    eventCallbacks = {};
    mockClose = null;
    mockEventSource = null;
    originalEventSource = global.EventSource;
    global.EventSource = MockEventSource;
  });

  afterEach(() => {
    global.EventSource = originalEventSource;
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('has correct initial state', () => {
      const state = store.getState().sectors;
      expect(state.list).toEqual([]);
      expect(state.listStatus).toBe('idle');
      expect(state.error).toBeNull();
      expect(state.ranking).toBeNull();
      expect(state.rankingStatus).toBe('idle');
      expect(state.activeSector).toBe('All Funds');
      expect(state.sectorCache).toEqual({});
      expect(state.rankingProgress).toBeNull();
    });
  });

  describe('fetchSectors', () => {
    it('sets listStatus to loading when pending', () => {
      api.getSectors.mockReturnValue(new Promise(() => {}));
      store.dispatch(fetchSectors());
      expect(store.getState().sectors.listStatus).toBe('loading');
    });

    it('sets list and status on success', async () => {
      const mockSectors = ['Technology', 'Banking', 'Pharma'];
      api.getSectors.mockResolvedValue({ data: { sectors: mockSectors } });
      await store.dispatch(fetchSectors());
      const state = store.getState().sectors;
      expect(state.listStatus).toBe('succeeded');
      expect(state.list).toContain('All Funds');
      expect(state.list).toContain('Technology');
    });

    it('adds All Funds if not present', async () => {
      api.getSectors.mockResolvedValue({ data: { sectors: ['Technology'] } });
      await store.dispatch(fetchSectors());
      const state = store.getState().sectors;
      expect(state.list[0]).toBe('All Funds');
    });

    it('keeps All Funds if already present', async () => {
      api.getSectors.mockResolvedValue({ data: { sectors: ['All Funds', 'Banking'] } });
      await store.dispatch(fetchSectors());
      const state = store.getState().sectors;
      expect(state.list.filter((s) => s === 'All Funds')).toHaveLength(1);
    });

    it('handles empty sectors response', async () => {
      api.getSectors.mockResolvedValue({ data: {} });
      await store.dispatch(fetchSectors());
      const state = store.getState().sectors;
      expect(state.list).toContain('All Funds');
    });

    it('sets error on failure', async () => {
      api.getSectors.mockRejectedValue(new Error('Network error'));
      await store.dispatch(fetchSectors());
      const state = store.getState().sectors;
      expect(state.listStatus).toBe('failed');
      expect(state.error).toBe('Network error');
    });
  });

  describe('fetchSectorRanking', () => {
    it('returns cached data if available', async () => {
      const cachedData = { sector: 'Technology', rankings: { oneYear: [] } };
      store.dispatch(cacheSectorData({ sector: 'Technology', data: cachedData }));

      await store.dispatch(fetchSectorRanking('Technology'));
      const state = store.getState().sectors;
      expect(state.ranking).toEqual(cachedData);
      expect(state.rankingStatus).toBe('succeeded');
    });

    it('sets rankingStatus to loading when pending', () => {
      store.dispatch(fetchSectorRanking('Technology'));
      expect(store.getState().sectors.rankingStatus).toBe('loading');
    });

    it('creates EventSource with correct URL', () => {
      store.dispatch(fetchSectorRanking('Technology'));
      expect(mockEventSource.url).toContain('/sector/Technology/stream');
    });

    it('handles URL encoding for special characters', () => {
      store.dispatch(fetchSectorRanking('All Funds'));
      expect(mockEventSource.url).toContain('/sector/All%20Funds/stream');
    });

    it('sets ranking on SSE complete', async () => {
      const mockRanking = { sector: 'Technology', rankings: { oneYear: [] } };
      const promise = store.dispatch(fetchSectorRanking('Technology'));

      // Trigger complete event
      triggerEvent('complete', mockRanking);

      await promise;
      const state = store.getState().sectors;
      expect(state.rankingStatus).toBe('succeeded');
      expect(state.ranking).toEqual(mockRanking);
      expect(mockClose).toHaveBeenCalled();
    });

    it('caches data on SSE complete', async () => {
      const mockRanking = { sector: 'Technology', rankings: [] };
      const promise = store.dispatch(fetchSectorRanking('Technology'));
      triggerEvent('complete', mockRanking);
      await promise;
      expect(store.getState().sectors.sectorCache['Technology']).toEqual(mockRanking);
    });

    it('handles JSON parse error on complete', async () => {
      const promise = store.dispatch(fetchSectorRanking('Technology'));
      triggerEventRaw('complete', 'invalid json');

      try {
        await promise;
      } catch (e) {
        expect(e.message).toBe('Rejected');
      }
      expect(mockClose).toHaveBeenCalled();
    });

    it('falls back to REST API on SSE error', async () => {
      const mockRanking = { sector: 'Technology', rankings: {} };
      api.getSectorRanking.mockResolvedValue({ data: mockRanking });

      const promise = store.dispatch(fetchSectorRanking('Technology'));

      // Trigger error event
      if (eventCallbacks.error) {
        eventCallbacks.error.forEach((cb) => cb({}));
      }

      await promise;
      const state = store.getState().sectors;
      expect(state.rankingStatus).toBe('succeeded');
      expect(api.getSectorRanking).toHaveBeenCalledWith('Technology');
    });

    it('sets error when REST fallback fails', async () => {
      api.getSectorRanking.mockRejectedValue(new Error('Sector not found'));

      const promise = store.dispatch(fetchSectorRanking('InvalidSector'));

      // Trigger error event
      if (eventCallbacks.error) {
        eventCallbacks.error.forEach((cb) => cb({}));
      }

      await promise;
      const state = store.getState().sectors;
      expect(state.rankingStatus).toBe('failed');
      expect(state.error).toBe('Sector not found');
    });

    it('handles progress events for active sector', async () => {
      store.dispatch(setActiveSector('Technology'));
      const promise = store.dispatch(fetchSectorRanking('Technology'));

      triggerEvent('progress', { processed: 50, total: 100 });

      let state = store.getState().sectors;
      expect(state.rankingProgress).toMatchObject({ processed: 50, total: 100 });

      triggerEvent('complete', { sector: 'Technology', rankings: [] });
      await promise;
    });

    it('ignores progress events for non-active sector', async () => {
      store.dispatch(setActiveSector('Banking'));
      const promise = store.dispatch(fetchSectorRanking('Technology'));

      triggerEvent('progress', { sector: 'Different', processed: 50, total: 100 });

      const state = store.getState().sectors;
      expect(state.rankingProgress).toBeNull();

      triggerEvent('complete', { sector: 'Technology', rankings: [] });
      await promise;
    });

    it('handles status events', async () => {
      store.dispatch(setActiveSector('Technology'));
      const promise = store.dispatch(fetchSectorRanking('Technology'));

      triggerEvent('status', { message: 'Loading...' });

      let state = store.getState().sectors;
      expect(state.rankingProgress).toMatchObject({ message: 'Loading...' });

      triggerEvent('complete', { sector: 'Technology', rankings: [] });
      await promise;
    });

    it('handles partial results', async () => {
      const partialData = { rankings: [{ name: 'Fund 1' }] };
      const promise = store.dispatch(fetchSectorRanking('Technology'));

      triggerEvent('partial', partialData);

      let state = store.getState().sectors;
      expect(state.ranking).toEqual(partialData);
      expect(state.rankingStatus).toBe('partial');

      triggerEvent('complete', { sector: 'Technology', rankings: [] });
      await promise;
    });

    it('handles progress parse errors gracefully', async () => {
      store.dispatch(setActiveSector('Technology'));
      const promise = store.dispatch(fetchSectorRanking('Technology'));

      triggerEventRaw('progress', 'invalid');
      triggerEvent('complete', { sector: 'Technology', rankings: [] });
      await promise;
    });

    it('handles status parse errors gracefully', async () => {
      const promise = store.dispatch(fetchSectorRanking('Technology'));
      triggerEventRaw('status', 'invalid');
      triggerEvent('complete', { sector: 'Technology', rankings: [] });
      await promise;
    });

    it('handles partial parse errors gracefully', async () => {
      const promise = store.dispatch(fetchSectorRanking('Technology'));
      triggerEventRaw('partial', 'invalid');
      triggerEvent('complete', { sector: 'Technology', rankings: [] });
      await promise;
    });
  });

  describe('clearRanking', () => {
    it('clears ranking state', () => {
      store.dispatch(setPartialRanking({ rankings: [] }));
      store.dispatch(clearRanking());

      const state = store.getState().sectors;
      expect(state.ranking).toBeNull();
      expect(state.rankingStatus).toBe('idle');
      expect(state.rankingProgress).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('setActiveSector', () => {
    it('sets the active sector', () => {
      store.dispatch(setActiveSector('Banking'));
      expect(store.getState().sectors.activeSector).toBe('Banking');
    });
  });

  describe('updateRankingProgress', () => {
    it('updates progress for active sector', () => {
      store.dispatch(setActiveSector('Technology'));
      store.dispatch(updateRankingProgress({ sector: 'Technology', progress: 50 }));
      expect(store.getState().sectors.rankingProgress).toEqual({
        sector: 'Technology',
        progress: 50,
      });
    });

    it('ignores progress for non-active sector', () => {
      store.dispatch(setActiveSector('Banking'));
      store.dispatch(updateRankingProgress({ sector: 'Technology', progress: 50 }));
      expect(store.getState().sectors.rankingProgress).toBeNull();
    });
  });

  describe('setPartialRanking', () => {
    it('sets partial ranking and status', () => {
      store.dispatch(setPartialRanking({ rankings: [{ name: 'Fund' }] }));
      const state = store.getState().sectors;
      expect(state.ranking).toEqual({ rankings: [{ name: 'Fund' }] });
      expect(state.rankingStatus).toBe('partial');
    });
  });

  describe('cacheSectorData', () => {
    it('caches sector data', () => {
      const data = { sector: 'Technology', rankings: [] };
      store.dispatch(cacheSectorData({ sector: 'Technology', data }));
      expect(store.getState().sectors.sectorCache['Technology']).toEqual(data);
    });
  });

  describe('fetchSectorRanking cancelled', () => {
    it('does not mark as failed if cancelled due to sector switch', async () => {
      const promise1 = store.dispatch(fetchSectorRanking('Technology'));

      // Dispatch another fetch which cancels the first
      const promise2 = store.dispatch(fetchSectorRanking('Banking'));

      // Complete the second one
      triggerEvent('complete', { sector: 'Banking', rankings: [] });

      await promise2;
      const state = store.getState().sectors;
      expect(state.rankingStatus).toBe('succeeded');
      expect(state.ranking).toEqual({ sector: 'Banking', rankings: [] });
    });

    it('rejects with Fetch cancelled when aborted before error', async () => {
      const mockAbortController = {
        signal: {
          aborted: false,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        },
        abort: vi.fn(function () {
          this.signal.aborted = true;
        }),
      };
      const originalAbortController = global.AbortController;
      global.AbortController = vi.fn(() => mockAbortController);

      const promise = store.dispatch(fetchSectorRanking('Technology'));
      mockAbortController.abort();

      if (eventCallbacks.error) {
        eventCallbacks.error.forEach((cb) => cb({}));
      }

      const result = await promise;
      expect(result.type).toBe('sectors/fetchRanking/rejected');
      expect(result.error.message).toBe('Fetch cancelled');
      expect(api.getSectorRanking).not.toHaveBeenCalled();

      global.AbortController = originalAbortController;
    });

    it('handles Fetch cancelled rejection in reducer by early return', () => {
      // Directly test the rejected reducer behavior with 'Fetch cancelled' message
      // by dispatching a manually crafted rejected action
      const action = {
        type: 'sectors/fetchRanking/rejected',
        error: { message: 'Fetch cancelled' },
      };

      // Get initial state
      const initialState = store.getState().sectors;
      store.dispatch(action);
      const finalState = store.getState().sectors;

      // State should be unchanged (early return in reducer)
      expect(finalState.rankingStatus).toBe(initialState.rankingStatus);
      expect(finalState.error).toBe(initialState.error);
    });
  });

  describe('fetchSectorRanking timeout', () => {
    it('times out after delay', async () => {
      vi.useFakeTimers();

      const promise = store.dispatch(fetchSectorRanking('Technology'));

      // Fast forward 30 minutes
      vi.advanceTimersByTime(30 * 60 * 1000);

      try {
        await promise;
      } catch (e) {
        // Expected
      }

      vi.useRealTimers();
    });
  });
});
