import { readFile, rename, writeFile } from 'node:fs/promises';

const token = process.env.TMDB_READ_TOKEN?.trim();
const filmsPath = new URL('../src/data/films.json', import.meta.url);
const postersPath = new URL('../src/data/posters.json', import.meta.url);
const temporaryPath = new URL(`../src/data/posters.${process.pid}.tmp`, import.meta.url);
const posterFile = /^\/[a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|webp)$/;

async function tmdb(path) {
  const res = await fetch(`https://api.themoviedb.org/3${path}`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function main() {
  if (!token) throw new Error('Imposta TMDB_READ_TOKEN in .env.local (API Read Access Token di TMDB).');
  const films = JSON.parse(await readFile(filmsPath, 'utf8'));
  const previous = JSON.parse(await readFile(postersPath, 'utf8'));
  const { images } = await tmdb('/configuration');
  const base = new URL(images.secure_base_url);
  if (base.origin !== 'https://image.tmdb.org') throw new Error('Origine CDN TMDB imprevista.');
  const size = ['w185', 'w342', 'w500'].find((choice) => images.poster_sizes.includes(choice));
  if (!size) throw new Error('Nessuna dimensione poster compatibile.');
  const gathered = new Map();
  let failed = 0;
  for (let i = 0; i < films.length; i += 4) {
    await Promise.all(films.slice(i, i + 4).map(async (film) => {
      try {
        const { poster_path } = await tmdb(`/movie/${film.tmdbId}?language=en-US`);
        if (typeof poster_path === 'string' && posterFile.test(poster_path)) {
          gathered.set(film.id, new URL(`${size}${poster_path}`, base).href);
        }
      } catch (error) {
        failed++;
        if (previous[film.id]) gathered.set(film.id, previous[film.id]);
        console.warn(`${film.title}: ${error.message}`);
      }
    }));
  }
  const sorted = Object.fromEntries(films.filter((film) => gathered.has(film.id)).map((film) => [film.id, gathered.get(film.id)]));
  await writeFile(temporaryPath, JSON.stringify(sorted, null, 2) + '\n');
  await rename(temporaryPath, postersPath);
  console.log(`Locandine disponibili: ${gathered.size}/${films.length}. Errori: ${failed}.`);
  if (failed) process.exitCode = 1;
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
