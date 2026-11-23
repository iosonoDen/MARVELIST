import type { MCUEntry } from "@/types/mcu";

/**
 * Formato compatto dei progressi salvati nell'account (Clerk privateMetadata).
 * Solo i titoli visti o votati: slug → [visto 0|1, voto 0–5].
 */
export type CloudProgress = Record<string, [0 | 1, number]>;

export const MAX_CLOUD_ENTRIES = 300;
const SLUG = /^[a-z0-9-]{1,80}$/;

export function toCloud(entries: MCUEntry[]): CloudProgress {
  const out: CloudProgress = {};
  for (const e of entries) {
    if (e.watched || e.rating > 0) out[e.id] = [e.watched ? 1 : 0, e.rating];
  }
  return out;
}

/** Valida un oggetto ricevuto dal client o dall'account; null se non valido. */
export function parseCloud(value: unknown): CloudProgress | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length > MAX_CLOUD_ENTRIES) return null;
  const out: CloudProgress = {};
  for (const [slug, v] of entries) {
    if (!SLUG.test(slug) || !Array.isArray(v) || v.length !== 2) return null;
    const [w, r] = v;
    if ((w !== 0 && w !== 1) || typeof r !== "number" || !Number.isFinite(r)) return null;
    out[slug] = [w, Math.min(5, Math.max(0, Math.round(r * 2) / 2))];
  }
  return out;
}

/**
 * Unisce i progressi del browser con quelli dell'account:
 * visto se è visto da una delle due parti; il voto del browser vince se presente.
 */
export function mergeCloud(entries: MCUEntry[], cloud: CloudProgress): MCUEntry[] {
  return entries.map((e) => {
    const c = cloud[e.id];
    if (!c) return e;
    return {
      ...e,
      watched: e.watched || c[0] === 1,
      rating: e.rating > 0 ? e.rating : c[1],
    };
  });
}
