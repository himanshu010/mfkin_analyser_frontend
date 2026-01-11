import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
});

export const getSectors = (options = {}) =>
  api.get("/sectors", {
    params: options.available ? { available: "true" } : {},
  });

export const getSectorRanking = (sectorName) =>
  api.get(`/sector/${encodeURIComponent(sectorName)}`);

export const getFundDetails = (query) =>
  api.get(`/fund/${encodeURIComponent(query)}`);

export const getFundSectorRanking = (query) =>
  api.get(`/fund/${encodeURIComponent(query)}/sector`);

export default api;
