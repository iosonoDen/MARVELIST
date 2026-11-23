"use client";

import { useAuth } from "@clerk/nextjs";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { type CloudProgress, mergeCloud, parseCloud, toCloud } from "@/lib/progress-sync";
import type { MCUEntry } from "@/types/mcu";

export type SyncStatus = "off" | "syncing" | "saved" | "error";

const SAVE_DELAY_MS = 1500;

async function putProgress(progress: CloudProgress) {
  const res = await fetch("/api/progress", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ progress }),
  });
  if (!res.ok) throw new Error(`save failed: ${res.status}`);
}

/**
 * Sincronizza i progressi con l'account quando l'utente ha fatto l'accesso.
 * Al primo collegamento unisce browser + account; poi salva ogni modifica (con un breve ritardo).
 */
export function useCloudSync(
  entries: MCUEntry[],
  setEntries: React.Dispatch<React.SetStateAction<MCUEntry[]>>,
  hydrated: boolean,
): SyncStatus {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [status, setStatus] = useState<SyncStatus>("off");
  // Utente per cui l'unione iniziale è già fatta
  const mergedFor = useRef<string | null>(null);
  const lastSaved = useRef<string>("");
  // Ultimi progressi del browser, letti dall'unione iniziale
  const entriesRef = useRef(entries);
  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  // 1) Unione iniziale dopo l'accesso
  useEffect(() => {
    if (!isLoaded || !hydrated) return;
    if (!isSignedIn || !userId) {
      mergedFor.current = null;
      lastSaved.current = "";
      return;
    }
    if (mergedFor.current === userId) return;
    let cancelled = false;
    (async () => {
      setStatus("syncing");
      try {
        const res = await fetch("/api/progress");
        if (!res.ok) throw new Error(`load failed: ${res.status}`);
        const cloud = parseCloud((await res.json()).progress) ?? {};
        if (cancelled) return;
        const merged = mergeCloud(entriesRef.current, cloud);
        const payload = toCloud(merged);
        lastSaved.current = JSON.stringify(payload);
        mergedFor.current = userId;
        setEntries(merged);
        await putProgress(payload);
        if (!cancelled) setStatus("saved");
      } catch (err) {
        console.warn("Sincronizzazione non riuscita:", err);
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, userId, hydrated, setEntries]);

  // 2) Salvataggio delle modifiche successive
  useEffect(() => {
    if (!isSignedIn || !userId || mergedFor.current !== userId) return;
    const payload = toCloud(entries);
    const json = JSON.stringify(payload);
    if (json === lastSaved.current) return;
    const t = window.setTimeout(async () => {
      setStatus("syncing");
      try {
        await putProgress(payload);
        lastSaved.current = json;
        setStatus("saved");
      } catch (err) {
        console.warn("Salvataggio nell'account non riuscito:", err);
        setStatus("error");
      }
    }, SAVE_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [entries, isSignedIn, userId]);

  return isSignedIn ? status : "off";
}
