/**
 * Ricerca per personaggio e per attore sui cast completi di TMDB.
 * I dati stanno in /public/search (creati da scripts/build-search-index.mts)
 * e si scaricano solo quando l'utente tocca la ricerca.
 */

export interface CastIndex {
  /** Nomi degli attori. */
  p: string[];
  /** slug → [[indice attore, personaggio], ...] */
  t: Record<string, Array<[number, string]>>;
}

export interface CastGroup {
  kind: "character" | "actor";
  key: string;
  /** Nome del personaggio o dell'attore. */
  label: string;
  /** Attore principale (per un personaggio) o personaggio principale (per un attore). */
  sub: string;
  /** Indice dell'attore da usare per la foto. */
  person: number;
  /** Quanti attori diversi hanno interpretato il personaggio. */
  people: number;
  /** Titoli in cui compare, con il motivo da mostrare sotto la card. */
  slugs: string[];
  why: Record<string, string>;
}

let indexPromise: Promise<CastIndex | null> | null = null;
let photosPromise: Promise<string[] | null> | null = null;

const getJson = <T>(url: string): Promise<T | null> =>
  fetch(url)
    .then((r) => (r.ok ? (r.json() as Promise<T>) : null))
    .catch(() => null);

/** Scarica l'indice una volta sola (anche se chiamato più volte). */
export function loadCastIndex(): Promise<CastIndex | null> {
  if (!indexPromise) {
    indexPromise = getJson<CastIndex>("/search/index.json").then((d) => {
      if (!d) indexPromise = null; // riprova alla prossima occasione
      return d;
    });
  }
  return indexPromise;
}

/** Foto degli attori, nello stesso ordine di CastIndex.p. */
export function loadCastPhotos(): Promise<string[] | null> {
  if (!photosPromise) {
    photosPromise = getJson<string[]>("/search/photos.json").then((d) => {
      if (!d) photosPromise = null;
      return d;
    });
  }
  return photosPromise;
}

export const profileUrl = (path: string | undefined, size: "w185" | "w45" = "w185") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

/** Minuscolo, senza accenti e senza punteggiatura: "Spider-Man" → "spider man". */
export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/**
 * Vero se la ricerca combacia con l'inizio di una parola del testo.
 * "loki" trova "Frost Giant Loki", "spiderman" trova "Spider-Man".
 */
export function matchesWords(text: string, q: string): boolean {
  if (!q) return false;
  const words = normalize(text).split(" ");
  const compactQ = q.replace(/ /g, "");
  for (let i = 0; i < words.length; i++) {
    const rest = words.slice(i).join(" ");
    if (rest.startsWith(q) || rest.replace(/ /g, "").startsWith(compactQ)) return true;
  }
  return false;
}

const byRelevance = (a: CastGroup, b: CastGroup) =>
  b.slugs.length - a.slugs.length || a.label.length - b.label.length;

/** Il più frequente in una mappa valore → conteggio. */
const top = <K>(counts: Map<K, number>): K =>
  [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];

/**
 * Personaggi e attori che combaciano con la ricerca.
 * `order` = slug ammessi dai filtri, già nell'ordine in cui mostrarli.
 */
export function searchCast(
  index: CastIndex,
  query: string,
  order: string[],
): { characters: CastGroup[]; actors: CastGroup[] } {
  const q = normalize(query);
  if (q.length < 2) return { characters: [], actors: [] };

  const chars = new Map<string, { label: string; people: Map<number, number>; why: Map<string, string> }>();
  const actors = new Map<number, { roles: Map<string, number>; why: Map<string, string> }>();
  const actorHit = new Map<number, boolean>();

  for (const slug of order) {
    for (const [person, character] of index.t[slug] ?? []) {
      // Un personaggio come "Peter Parker / Spider-Man" vale per entrambi i nomi
      for (const part of character.split(/\s+\/\s+/)) {
        if (!matchesWords(part, q)) continue;
        const key = normalize(part);
        let g = chars.get(key);
        if (!g) chars.set(key, (g = { label: part, people: new Map(), why: new Map() }));
        g.people.set(person, (g.people.get(person) ?? 0) + 1);
        if (!g.why.has(slug)) g.why.set(slug, `${part} · ${index.p[person]}`);
      }

      let hit = actorHit.get(person);
      if (hit === undefined) actorHit.set(person, (hit = matchesWords(index.p[person], q)));
      if (hit) {
        let a = actors.get(person);
        if (!a) actors.set(person, (a = { roles: new Map(), why: new Map() }));
        a.roles.set(character, (a.roles.get(character) ?? 0) + 1);
        if (!a.why.has(slug)) a.why.set(slug, character);
      }
    }
  }

  const characters: CastGroup[] = [...chars.entries()].map(([key, g]) => {
    const person = top(g.people);
    return {
      kind: "character",
      key: `c:${key}`,
      label: g.label,
      sub: index.p[person],
      person,
      people: g.people.size,
      slugs: [...g.why.keys()],
      why: Object.fromEntries(g.why),
    };
  });

  const actorGroups: CastGroup[] = [...actors.entries()].map(([person, a]) => ({
    kind: "actor",
    key: `a:${person}`,
    label: index.p[person],
    sub: top(a.roles),
    person,
    people: 1,
    slugs: [...a.why.keys()],
    why: Object.fromEntries(a.why),
  }));

  return { characters: characters.sort(byRelevance), actors: actorGroups.sort(byRelevance) };
}
