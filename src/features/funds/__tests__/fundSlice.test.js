import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import fundsReducer, { fetchFundDetails, fetchFundSectorRanking, clearFund } from "../fundSlice";
import * as api from "../../../app/api";

vi.mock("../../../app/api");

const createTestStore = () => configureStore({ reducer: { funds: fundsReducer } });

describe("fundSlice", () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("has correct initial state", () => {
      const state = store.getState().funds;
      expect(state.details).toBeNull();
      expect(state.detailsStatus).toBe("idle");
      expect(state.sectorRanking).toBeNull();
      expect(state.sectorRankingStatus).toBe("idle");
      expect(state.error).toBeNull();
    });
  });

  describe("fetchFundDetails", () => {
    it("sets detailsStatus to loading when pending", () => {
      api.getFundDetails.mockReturnValue(new Promise(() => {}));
      store.dispatch(fetchFundDetails("1001"));
      expect(store.getState().funds.detailsStatus).toBe("loading");
    });

    it("sets details and status on success", async () => {
      const mockFund = { schemeCode: "1001", schemeName: "Test Fund" };
      api.getFundDetails.mockResolvedValue({ data: mockFund });
      await store.dispatch(fetchFundDetails("1001"));
      const state = store.getState().funds;
      expect(state.detailsStatus).toBe("succeeded");
      expect(state.details).toEqual(mockFund);
    });

    it("sets error on failure", async () => {
      api.getFundDetails.mockRejectedValue(new Error("Fund not found"));
      await store.dispatch(fetchFundDetails("invalid"));
      const state = store.getState().funds;
      expect(state.detailsStatus).toBe("failed");
      expect(state.error).toBe("Fund not found");
    });
  });

  describe("fetchFundSectorRanking", () => {
    it("sets sectorRankingStatus to loading when pending", () => {
      api.getFundSectorRanking.mockReturnValue(new Promise(() => {}));
      store.dispatch(fetchFundSectorRanking("1001"));
      expect(store.getState().funds.sectorRankingStatus).toBe("loading");
    });

    it("sets sectorRanking and status on success", async () => {
      const mockRanking = { fund: "Test Fund", ranking: 5 };
      api.getFundSectorRanking.mockResolvedValue({ data: mockRanking });
      await store.dispatch(fetchFundSectorRanking("1001"));
      const state = store.getState().funds;
      expect(state.sectorRankingStatus).toBe("succeeded");
      expect(state.sectorRanking).toEqual(mockRanking);
    });

    it("sets error on failure", async () => {
      api.getFundSectorRanking.mockRejectedValue(new Error("Ranking not found"));
      await store.dispatch(fetchFundSectorRanking("invalid"));
      const state = store.getState().funds;
      expect(state.sectorRankingStatus).toBe("failed");
      expect(state.error).toBe("Ranking not found");
    });
  });

  describe("clearFund", () => {
    it("clears fund state", async () => {
      const mockFund = { schemeCode: "1001", schemeName: "Test Fund" };
      api.getFundDetails.mockResolvedValue({ data: mockFund });
      await store.dispatch(fetchFundDetails("1001"));

      store.dispatch(clearFund());
      const state = store.getState().funds;
      expect(state.details).toBeNull();
      expect(state.detailsStatus).toBe("idle");
      expect(state.sectorRanking).toBeNull();
      expect(state.sectorRankingStatus).toBe("idle");
      expect(state.error).toBeNull();
    });
  });
});
