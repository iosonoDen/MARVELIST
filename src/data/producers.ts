import type { MCUEntry, SupportedLocale } from "@/types/mcu";

/**
 * Chi ha prodotto o trasmesso i titoli fuori dall'MCU (casa di produzione/distribuzione o rete TV).
 * Fonte: TMDB (production companies / networks). I titoli MCU usano "Marvel Studios".
 */
const PRODUCER: Record<string, string> = {
  // Film
  "howard-the-duck": "Universal Pictures",
  "the-punisher-1989": "New World Pictures",
  "captain-america-1990": "21st Century Film",
  blade: "New Line Cinema",
  "blade-ii": "New Line Cinema",
  "blade-trinity": "New Line Cinema",
  "x-men": "20th Century Fox",
  x2: "20th Century Fox",
  "x-men-the-last-stand": "20th Century Fox",
  "x-men-origins-wolverine": "20th Century Fox",
  "x-men-first-class": "20th Century Fox",
  "the-wolverine": "20th Century Fox",
  "x-men-days-of-future-past": "20th Century Fox",
  deadpool: "20th Century Fox",
  "x-men-apocalypse": "20th Century Fox",
  logan: "20th Century Fox",
  "deadpool-2": "20th Century Fox",
  "dark-phoenix": "20th Century Fox",
  "the-new-mutants": "20th Century Studios",
  "daredevil-2003": "20th Century Fox",
  elektra: "20th Century Fox",
  "fantastic-four-2005": "20th Century Fox",
  "fantastic-four-rise-of-the-silver-surfer": "20th Century Fox",
  "fantastic-four-2015": "20th Century Fox",
  "hulk-2003": "Universal Pictures",
  "the-punisher-2004": "Lionsgate",
  "punisher-war-zone": "Lionsgate",
  "spider-man-2002": "Sony Pictures",
  "spider-man-2": "Sony Pictures",
  "spider-man-3": "Sony Pictures",
  "the-amazing-spider-man": "Sony Pictures",
  "the-amazing-spider-man-2": "Sony Pictures",
  "ghost-rider": "Sony Pictures",
  "ghost-rider-spirit-of-vengeance": "Sony Pictures",
  venom: "Sony Pictures",
  "venom-let-there-be-carnage": "Sony Pictures",
  morbius: "Sony Pictures",
  "madame-web": "Sony Pictures",
  "venom-the-last-dance": "Sony Pictures",
  "kraven-the-hunter": "Sony Pictures",
  // Serie (rete TV)
  daredevil: "Netflix",
  "jessica-jones": "Netflix",
  "luke-cage": "Netflix",
  "iron-fist": "Netflix",
  "the-defenders": "Netflix",
  "the-punisher": "Netflix",
  "agents-of-shield": "ABC",
  "agent-carter": "ABC",
  inhumans: "ABC",
  runaways: "Hulu",
  helstrom: "Hulu",
  "cloak-and-dagger": "Freeform",
  legion: "FX",
  "the-gifted": "FOX",
};

/** Etichetta della scheda: "Sony Pictures · Film", "Netflix · Serie", "Marvel Studios · Disney+"… */
export function producerLabel(entry: MCUEntry, locale: SupportedLocale): string {
  const kind = entry.type === "movie" ? "Film" : locale === "it" ? "Serie" : "Series";
  const producer = PRODUCER[entry.id];
  if (producer) return `${producer} · ${kind}`;
  if (entry.id.startsWith("one-shot-")) return "Marvel One-Shot";
  return entry.type === "movie" ? `Marvel Studios · ${kind}` : "Marvel Studios · Disney+";
}
