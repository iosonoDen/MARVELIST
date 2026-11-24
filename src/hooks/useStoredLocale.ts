"use client";

import { useEffect, useState } from "react";
import type { SupportedLocale } from "@/types/mcu";

const STORAGE_KEY = "marvelist:progress:v1";

/** Lingua scelta nella lista (salvata nel browser), per le parti fuori dalla lista. */
export function useStoredLocale(): SupportedLocale {
  const [locale, setLocale] = useState<SupportedLocale>("it");
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lettura una tantum dal browser dopo il mount
      if (saved?.locale === "en" || saved?.locale === "it") setLocale(saved.locale);
    } catch {
      /* lingua predefinita */
    }
  }, []);
  return locale;
}
