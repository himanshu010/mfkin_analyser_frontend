import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 120000, // 2 minutes - sector ranking can take time on first load
});

export const getSectors = (options = {}) =>
  api.get("/sectors", {
    params: options.available ? { available: "true" } : {},
  });
export const getSectorRanking = (sectorName) =>
  api.get(`/sector/${encodeURIComponent(sectorName)}`);

// Streaming endpoint for sector ranking with progress
export const getSectorRankingStream = async (sectorName, callbacks = {}) => {
  const { onProgress, onStatus, onComplete, onError } = callbacks;
  const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const url = `${baseURL}/sector/${encodeURIComponent(sectorName)}/stream`;

  return new Promise((resolve, reject) => {
    const eventSource = new EventSource(url);
    let completed = false;
    let hasReceivedData = false;

    eventSource.addEventListener("progress", (event) => {
      hasReceivedData = true;
      const data = JSON.parse(event.data);
      if (onProgress) onProgress(data);
    });

    eventSource.addEventListener("status", (event) => {
      hasReceivedData = true;
      const data = JSON.parse(event.data);
      if (onStatus) onStatus(data);
    });

    eventSource.addEventListener("complete", (event) => {
      completed = true;
      hasReceivedData = true;
      const data = JSON.parse(event.data);
      eventSource.close();
      if (onComplete) onComplete(data);
      resolve(data);
    });

    eventSource.addEventListener("error", (event) => {
      if (completed) return;
      eventSource.close();
      if (event.data) {
        const data = JSON.parse(event.data);
        if (onError) onError(data);
        reject(new Error(data.message || "Stream error"));
      } else if (!hasReceivedData) {
        // Connection failed before any data - might be CORS or network issue
        if (onError) onError({ message: "Connection failed" });
        reject(new Error("Connection failed"));
      }
      // Otherwise silently ignore - connection closed normally
    });

    eventSource.onerror = () => {
      if (completed) return;
      // Don't immediately reject - wait a bit for complete event
      setTimeout(() => {
        if (!completed && !hasReceivedData) {
          eventSource.close();
          if (onError) onError({ message: "Connection closed" });
          reject(new Error("Connection closed"));
        }
      }, 500);
    };
  });
};
export const getFundDetails = (query) =>
  api.get(`/fund/${encodeURIComponent(query)}`);
export const getFundSectorRanking = (query) =>
  api.get(`/fund/${encodeURIComponent(query)}/sector`);

// Preload API
export const getPreloadStatus = () => api.get("/sectors/preload/status");
export const triggerPreload = () => api.post("/sectors/preload");

export default api;
