import { describe, it, expect } from "vitest";
import { store } from "../store";

describe("store.js", () => {
  it("is properly configured", () => {
    expect(store).toBeDefined();
    expect(store.getState).toBeDefined();
    expect(store.dispatch).toBeDefined();
  });

  it("has sectors reducer", () => {
    expect(store.getState().sectors).toBeDefined();
  });

  it("has funds reducer", () => {
    expect(store.getState().funds).toBeDefined();
  });

  it("has theme reducer", () => {
    expect(store.getState().theme).toBeDefined();
  });

  it("sectors has correct initial state", () => {
    const sectors = store.getState().sectors;
    expect(sectors.list).toEqual([]);
    expect(sectors.listStatus).toBe("idle");
    expect(sectors.activeSector).toBe("All Funds");
    expect(sectors.ranking).toBeNull();
    expect(sectors.rankingStatus).toBe("idle");
  });

  it("funds has correct initial state", () => {
    const funds = store.getState().funds;
    expect(funds.details).toBeNull();
    expect(funds.detailsStatus).toBe("idle");
    expect(funds.sectorRanking).toBeNull();
    expect(funds.sectorRankingStatus).toBe("idle");
  });

  it("theme has correct initial state", () => {
    const theme = store.getState().theme;
    expect(theme.current).toBe("light");
  });
});
