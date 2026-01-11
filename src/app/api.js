import axios from 'axios';

// API base URL from environment or default to localhost
export const getApiBase = (envBase) => envBase || 'http://localhost:3000';
export const API_BASE = getApiBase(import.meta.env.VITE_API_BASE_URL);

// Axios instance with 2 minute timeout for large sector queries
const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
});

// Fetch list of available sectors
export const getSectors = (options = {}) =>
  api.get('/sectors', {
    params: options.available ? { available: 'true' } : {},
  });

// Fetch ranking data for a specific sector
export const getSectorRanking = (sectorName) =>
  api.get(`/sector/${encodeURIComponent(sectorName)}`);

// Fetch individual fund details by scheme code or name
export const getFundDetails = (query) => api.get(`/fund/${encodeURIComponent(query)}`);

// Fetch sector ranking with fund's position highlighted
export const getFundSectorRanking = (query) => api.get(`/fund/${encodeURIComponent(query)}/sector`);

export default api;
