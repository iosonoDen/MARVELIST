import type { Universe } from "@/types/mcu";

/** Valori del filtro "Universo": tutti, solo MCU, tutto ciò che è fuori MCU, o un gruppo. */
export type UniverseFilter = "all" | "beyond" | Universe;

export const UNIVERSE_OPTIONS: { value: UniverseFilter; it: string; en: string }[] = [
  { value: "all", it: "Tutti gli universi", en: "All universes" },
  { value: "mcu", it: "Solo MCU", en: "MCU only" },
  { value: "beyond", it: "Fuori MCU (tutti)", en: "Beyond the MCU (all)" },
  { value: "netflix", it: "Marvel · Netflix", en: "Marvel · Netflix" },
  { value: "x-men", it: "X-Men · Fox", en: "X-Men · Fox" },
  { value: "spider-man-sony", it: "Spider-Man · Sony", en: "Spider-Man · Sony" },
  { value: "sony", it: "Universo Sony", en: "Sony Universe" },
  { value: "fantastic-four", it: "Fantastici 4 · Fox", en: "Fantastic Four · Fox" },
  { value: "marvel-tv", it: "Marvel Television", en: "Marvel Television" },
  { value: "other", it: "Altri film Marvel", en: "Other Marvel films" },
];

export function matchesUniverse(universe: Universe, filter: UniverseFilter): boolean {
  if (filter === "all") return true;
  if (filter === "beyond") return universe !== "mcu";
  return universe === filter;
}

