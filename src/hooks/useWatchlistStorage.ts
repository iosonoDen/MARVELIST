'use client';

import { useEffect, useRef, useState } from 'react';
import { resolveLegacyId } from '@/data/legacy-ids';
import { MCUEntry, SupportedLocale } from '@/types/mcu';

const STORAGE_KEY = 'marvelist:progress:v1';

type ProgressMap = Record<string, { watched: boolean; rating: number }>;

interface StoredProgress {
  /** v1: chiavi `mcu-NN` (posizionali). v2: chiavi = slug. */
  version: 1 | 2;
  locale?: SupportedLocale;
  entries: ProgressMap;
}

/** Converte le chiavi dei vecchi salvataggi (`mcu-NN`) negli slug attuali. */
const migrateKeys = (saved: ProgressMap): ProgressMap =>
  Object.fromEntries(Object.entries(saved).map(([id, p]) => [resolveLegacyId(id), p]));

/** Applica i progressi salvati (visto/voto) al database di base, ignorando id sconosciuti. */
const mergeProgress = (base: MCUEntry[], saved: StoredProgress['entries']): MCUEntry[] =>
  base.map((e) => {
    const p = saved[e.id];
    if (!p) return e;
    const rating = Number.isFinite(p.rating) ? Math.min(5, Math.max(0, Math.round(p.rating * 2) / 2)) : e.rating;
    return { ...e, watched: Boolean(p.watched), rating };
  });

/**
 * Stato della watchlist persistito in localStorage.
 * Il primo render usa i dati di base (identici a server e client), poi idrata dal browser.
 */
export function useWatchlistStorage(base: MCUEntry[]) {
  const [entries, setEntries] = useState<MCUEntry[]>(base);
  const [locale, setLocale] = useState<SupportedLocale>('it');
  const hydrated = useRef(false);

  // Idratazione da localStorage dopo il mount: evita mismatch tra HTML pre-renderizzato e client.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredProgress;
        if (parsed?.entries) setEntries(mergeProgress(base, migrateKeys(parsed.entries)));
        if (parsed?.locale === 'it' || parsed?.locale === 'en') setLocale(parsed.locale);
      }
    } catch (err) {
      console.warn('Impossibile leggere i progressi salvati:', err);
    }
    hydrated.current = true;
  }, [base]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated.current) return;
    const payload: StoredProgress = {
      version: 2,
      locale,
      entries: Object.fromEntries(entries.map((e) => [e.id, { watched: e.watched, rating: e.rating }])),
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn('Impossibile salvare i progressi:', err);
    }
  }, [entries, locale]);

  return { entries, setEntries, locale, setLocale };
}
