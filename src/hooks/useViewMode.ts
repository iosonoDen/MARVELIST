"use client";

import { useEffect, useState } from "react";

export type ViewMode = "grid" | "list";

const STORAGE_KEY = "marvelist:view-mode:v1";
const DEFAULT_VIEW_MODE: ViewMode = "grid";

const isViewMode = (value: unknown): value is ViewMode =>
  value === "grid" || value === "list";

export function useViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>(DEFAULT_VIEW_MODE);
  const [loaded, setLoaded] = useState<boolean>(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { mode?: unknown } | null;
        if (isViewMode(parsed?.mode)) setViewMode(parsed.mode);
      }
    } catch (err) {
      console.warn("Impossibile leggere la modalità di visualizzazione:", err);
    }
    setLoaded(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 1, mode: viewMode }),
      );
    } catch (err) {
      console.warn("Impossibile salvare la modalità di visualizzazione:", err);
    }
  }, [viewMode, loaded]);

  return { viewMode, setViewMode };
}