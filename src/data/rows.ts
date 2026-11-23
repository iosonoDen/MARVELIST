import type { MCUPhase, MediaType } from "@/types/mcu";

/** Riga compatta del database titoli (vedi mcu-canon.ts e beyond-mcu.ts). */
export type Row = [
  slug: string,
  it: string,
  en: string,
  type: MediaType,
  phase: MCUPhase,
  releaseDate: string,
  timelineYear: string,
  /** Non usato: l'ordine della timeline è in timeline-order.ts. */
  timelineOrder: number,
  synIt: string,
  synEn: string,
  cast: [string, string][],
];
