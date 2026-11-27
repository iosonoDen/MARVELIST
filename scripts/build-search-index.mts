/**
 * Crea i file della ricerca per personaggio e per attore (cast completi da TMDB):
 * - public/search/index.json: nomi e personaggi, si scarica appena si tocca la ricerca
 * - public/search/photos.json: foto degli attori, nello stesso ordine di "p"
 *
 * Uso (serve la credenziale TMDB), da rilanciare dopo aver aggiunto titoli:
 *   TMDB_API_KEY=... npm run search-index
 *
 * Formato di index.json:
 *   p: [nome attore, ...]
 *   t: { slug: [[indice attore in p, personaggio], ...] }
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { TMDB_META } from "../src/data/tmdb.ts";

const KEY = (process.env.TMDB_API_KEY || process.env.TMDB_READ_ACCESS_TOKEN || "").trim();
if (!KEY) {
  console.error("Manca TMDB_API_KEY");
  process.exit(1);
}

async function tmdb(path: string): Promise<{ cast?: Person[] }> {
  const url = new URL(`https://api.themoviedb.org/3${path}`);
  url.searchParams.set("language", "en-US");
  const headers: Record<string, string> = { Accept: "application/json" };
  if (KEY.startsWith("eyJ")) headers.Authorization = `Bearer ${KEY}`;
  else url.searchParams.set("api_key", KEY);
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, { headers });
    if (res.ok) return res.json();
    if (res.status !== 429 && res.status < 500) throw new Error(`${path}: HTTP ${res.status}`);
    await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
  }
  throw new Error(`${path}: troppi tentativi`);
}

interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  character?: string;
  roles?: Array<{ character: string }>;
}

const MINOR = /additional voices?|^voices?$|^himself$|^herself$|^themselves$|^self$/i;
const clean = (c: string) =>
  c
    .replace(/\((?:uncredited|voice|archive footage|credit only)\)/gi, "")
    .replace(/\s+/g, " ")
    .trim();

const people: Array<[string, string]> = [];
const personIndex = new Map<number, number>();
const titles: Record<string, Array<[number, string]>> = {};

for (const [slug, meta] of Object.entries(TMDB_META)) {
  const path = meta.kind === "tv" ? `/tv/${meta.id}/aggregate_credits` : `/movie/${meta.id}/credits`;
  const data = await tmdb(path);
  const rows: Array<[number, string]> = [];
  for (const p of data.cast ?? []) {
    const roles = p.roles ? p.roles.map((r) => r.character) : [p.character ?? ""];
    for (const raw of roles) {
      const character = clean(raw ?? "");
      if (!character || MINOR.test(character)) continue;
      let i = personIndex.get(p.id);
      if (i === undefined) {
        i = people.length;
        people.push([p.name, p.profile_path ?? ""]);
        personIndex.set(p.id, i);
      }
      rows.push([i, character]);
    }
  }
  titles[slug] = rows;
  console.log(`${slug}: ${rows.length}`);
}

mkdirSync("public/search", { recursive: true });
writeFileSync("public/search/index.json", JSON.stringify({ p: people.map(([n]) => n), t: titles }));
writeFileSync("public/search/photos.json", JSON.stringify(people.map(([, ph]) => ph)));
console.log(`Fatto: ${Object.keys(titles).length} titoli, ${people.length} attori`);
