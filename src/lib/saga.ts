import type { MCUEntry, SupportedLocale } from "@/types/mcu";

export interface Rank {
  min: number;
  it: string;
  en: string;
  /** Stemma del grado, già colorato: public/ranks/<nome>.png */
  icon: string;
  color: string;
}

/** 5 gradi, uno ogni 20% della saga. */
export const RANKS: Rank[] = [
  { min: 0, it: "Cadetto", en: "Cadet", icon: "/ranks/cadetto.png", color: "#9CA3AF" },
  { min: 20, it: "Recluta", en: "Recruit", icon: "/ranks/recluta.png", color: "#CD7F32" },
  { min: 40, it: "Agente", en: "Agent", icon: "/ranks/agente.png", color: "#3B82F6" },
  { min: 60, it: "Eroe", en: "Hero", icon: "/ranks/eroe.png", color: "#E21B24" },
  { min: 80, it: "Vendicatore", en: "Avenger", icon: "/ranks/vendicatore.png", color: "#F2A900" },
];

/** Tappe disegnate dentro la barra (100% è la fine della barra stessa). */
export const MILESTONES = [20, 40, 60, 80];

/** Colore del grado che si sblocca a una certa tappa (20, 40, 60, 80). */
export const rankAt = (m: number) =>
  RANKS.find((r) => r.min === m) ?? RANKS[0];

/** Grado, percentuale e titoli mancanti a partire da visti/totale. */
export function sagaProgress(watched: number, total: number) {
  // Percentuale esatta per il grado; arrotondata per difetto per il numero
  // a schermo, così "20%" compare solo quando il grado Recluta è raggiunto.
  const exact = total > 0 ? (watched / total) * 100 : 0;
  const pct = Math.floor(exact);
  const rankIndex = RANKS.findLastIndex((r) => exact >= r.min);
  const rank = RANKS[rankIndex];
  const nextRank = RANKS[rankIndex + 1] ?? null;
  const toNextRank = nextRank
    ? Math.ceil((nextRank.min / 100) * total) - watched
    : 0;
  return { watched, total, pct, rank, rankIndex, nextRank, toNextRank };
}

export type SagaProgressStats = ReturnType<typeof sagaProgress>;

/** Titoli in ordine di timeline canonica. */
export const byTimeline = (entries: MCUEntry[]) =>
  [...entries].sort((a, b) => a.timelineOrder - b.timelineOrder);

/* ───────── Link sfida: /s/it-24-57 ───────── */

export interface ChallengeCode {
  locale: SupportedLocale;
  watched: number;
  total: number;
}

export const encodeChallenge = ({ locale, watched, total }: ChallengeCode) =>
  `${locale}-${watched}-${total}`;

/** Legge il codice del link; null se non è valido. */
export function decodeChallenge(code: string): ChallengeCode | null {
  const m = /^(it|en)-(\d{1,3})-(\d{1,3})$/.exec(code);
  if (!m) return null;
  const watched = Number(m[2]);
  const total = Number(m[3]);
  if (total < 1 || watched > total) return null;
  return { locale: m[1] as SupportedLocale, watched, total };
}
