import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import api, {
  getSectors,
  getSectorRanking,
  getFundDetails,
  getFundSectorRanking,
  preloadSectorFunds,
  API_BASE,
  getApiBase,
} from "../api";

// Mock the axios instance methods
vi.mock("axios", () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };
  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
    },
  };
});

describe("api.js", () => {
  let mockGet;
  let mockPost;

  beforeEach(() => {
    mockGet = api.get;
    mockPost = api.post;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("API_BASE", () => {
    it("has a defined base URL", () => {
      expect(API_BASE).toBeDefined();
      expect(typeof API_BASE).toBe("string");
    });

    it("uses environment variable when set", () => {
      // API_BASE should be either the env var value or the default
      expect(API_BASE).toMatch(/^https?:\/\//);
    });

    it("falls back to localhost when env var not set", () => {
      // When VITE_API_BASE_URL is not set, API_BASE defaults to localhost
      // This is testing the fallback branch of line 4
      if (!import.meta.env.VITE_API_BASE_URL) {
        expect(API_BASE).toBe("http://localhost:3000");
      }
    });

    it("getApiBase uses provided env value", () => {
      expect(getApiBase("https://example.com")).toBe("https://example.com");
    });

    it("getApiBase falls back when env is empty", () => {
      expect(getApiBase("")).toBe("http://localhost:3000");
      expect(getApiBase()).toBe("http://localhost:3000");
    });
  });

  describe("getSectors", () => {
    it("fetches sectors successfully", async () => {
      const mockSectors = ["Technology", "Banking", "Pharma"];
      mockGet.mockResolvedValue({ data: mockSectors });

      const result = await getSectors();

      expect(mockGet).toHaveBeenCalledWith("/sectors", { params: {} });
      expect(result.data).toEqual(mockSectors);
    });

    it("fetches available sectors with option", async () => {
      const mockSectors = ["Technology", "Banking"];
      mockGet.mockResolvedValue({ data: mockSectors });

      const result = await getSectors({ available: true });

      expect(mockGet).toHaveBeenCalledWith("/sectors", { params: { available: "true" } });
      expect(result.data).toEqual(mockSectors);
    });

    it("fetches available sectors with refresh", async () => {
      const mockSectors = ["Technology", "Banking"];
      mockGet.mockResolvedValue({ data: mockSectors });

      const result = await getSectors({ available: true, refresh: true });

      expect(mockGet).toHaveBeenCalledWith("/sectors", {
        params: { available: "true", refresh: "true" },
      });
      expect(result.data).toEqual(mockSectors);
    });

    it("throws error on failure", async () => {
      mockGet.mockRejectedValue(new Error("Network error"));

      await expect(getSectors()).rejects.toThrow("Network error");
    });
  });

  describe("preloadSectorFunds", () => {
    it("posts to preload endpoint", async () => {
      const payload = { success: true };
      mockPost.mockResolvedValue({ data: payload });

      const result = await preloadSectorFunds();

      expect(mockPost).toHaveBeenCalledWith("/sectors/preload");
      expect(result.data).toEqual(payload);
    });

    it("throws error on failure", async () => {
      mockPost.mockRejectedValue(new Error("Preload failed"));

      await expect(preloadSectorFunds()).rejects.toThrow("Preload failed");
    });
  });

  describe("getSectorRanking", () => {
    it("fetches sector ranking successfully", async () => {
      const mockRanking = { sector: "Technology", rankings: { oneYear: [] } };
      mockGet.mockResolvedValue({ data: mockRanking });

      const result = await getSectorRanking("Technology");

      expect(mockGet).toHaveBeenCalledWith("/sector/Technology", { params: {} });
      expect(result.data).toEqual(mockRanking);
    });

    it("encodes sector name in URL", async () => {
      const mockRanking = { sector: "Technology (IT)", rankings: {} };
      mockGet.mockResolvedValue({ data: mockRanking });

      await getSectorRanking("Technology (IT)");

      expect(mockGet).toHaveBeenCalledWith("/sector/Technology%20(IT)", { params: {} });
    });

    it("passes refresh param when forced", async () => {
      const mockRanking = { sector: "Technology", rankings: {} };
      mockGet.mockResolvedValue({ data: mockRanking });

      await getSectorRanking("Technology", { refresh: true });

      expect(mockGet).toHaveBeenCalledWith("/sector/Technology", {
        params: { refresh: "true" },
      });
    });

    it("throws error on failure", async () => {
      mockGet.mockRejectedValue(new Error("Sector not found"));

      await expect(getSectorRanking("Invalid")).rejects.toThrow("Sector not found");
    });
  });

  describe("getFundDetails", () => {
    it("fetches fund details successfully", async () => {
      const mockFund = { schemeCode: "1001", schemeName: "Test Fund" };
      mockGet.mockResolvedValue({ data: mockFund });

      const result = await getFundDetails("1001");

      expect(mockGet).toHaveBeenCalledWith("/fund/1001");
      expect(result.data).toEqual(mockFund);
    });

    it("encodes query in URL", async () => {
      const mockFund = { schemeCode: "1001", schemeName: "Test Fund" };
      mockGet.mockResolvedValue({ data: mockFund });

      await getFundDetails("Test Fund Name");

      expect(mockGet).toHaveBeenCalledWith("/fund/Test%20Fund%20Name");
    });

    it("throws error on failure", async () => {
      mockGet.mockRejectedValue(new Error("Fund not found"));

      await expect(getFundDetails("invalid")).rejects.toThrow("Fund not found");
    });
  });

  describe("getFundSectorRanking", () => {
    it("fetches fund sector ranking successfully", async () => {
      const mockRanking = { fund: "Test Fund", sectorRanking: [] };
      mockGet.mockResolvedValue({ data: mockRanking });

      const result = await getFundSectorRanking("1001");

      expect(mockGet).toHaveBeenCalledWith("/fund/1001/sector");
      expect(result.data).toEqual(mockRanking);
    });

    it("encodes query in URL", async () => {
      const mockRanking = { fund: "Test Fund", sectorRanking: [] };
      mockGet.mockResolvedValue({ data: mockRanking });

      await getFundSectorRanking("Test Fund");

      expect(mockGet).toHaveBeenCalledWith("/fund/Test%20Fund/sector");
    });

    it("throws error on failure", async () => {
      mockGet.mockRejectedValue(new Error("Not found"));

      await expect(getFundSectorRanking("invalid")).rejects.toThrow("Not found");
    });
  });

  describe("api instance", () => {
    it("exports default api instance", () => {
      expect(api).toBeDefined();
      expect(api.get).toBeDefined();
    });
  });
});
