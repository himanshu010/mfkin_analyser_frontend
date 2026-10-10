import { useSyncExternalStore } from "react";

export const useMediaQuery = (query) =>
  useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches
  );

export const PHONE = "(max-width: 639px)";
