import seed from './data/films.json';

export type Progress = { watched: boolean; rating: number; notes: string };
export type Movie = Progress & { id: string; tmdbId: number; title: string; timeline: string; phase: number };
export type SavedProgress = Partial<Record<string, Partial<Progress>>>;
export type Status = 'all' | 'watched' | 'unwatched';
export type Order = 'sheet' | 'title' | 'rating';
export const movies: readonly Movie[] = seed;
export const storageKey = 'mcu-checklist:progress:v1';

export function readProgress(raw: string | null): SavedProgress {
  if (raw === null) return {};
  const parsed: unknown = JSON.parse(raw);
  if (typeof parsed !== 'object' || !parsed || Array.isArray(parsed)) throw new Error('Formato non valido');
  const progress: SavedProgress = {};
  const values = parsed as Record<string, unknown>;
  for (const { id } of movies) {
    const value = values[id];
    if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
    const { watched, rating, notes } = value as Record<string, unknown>;
    const entry: Partial<Progress> = {};
    if (typeof watched === 'boolean') entry.watched = watched;
    if (typeof rating === 'number' && Number.isInteger(rating) && rating >= 0 && rating <= 5) entry.rating = rating;
    if (typeof notes === 'string') entry.notes = notes;
    progress[id] = entry;
  }
  return progress;
}

export function getChecklist(progress: SavedProgress): Movie[] {
  return movies.map((movie) => ({ ...movie, ...progress[movie.id] }));
}

export function getTotals(list: readonly Movie[]) {
  const total = list.length;
  const watched = list.filter((movie) => movie.watched).length;
  return { total, watched, remaining: total - watched, percent: total ? Math.round(watched / total * 100) : 0 };
}

export function filterMovies(list: readonly Movie[], options: { query: string; phase: number; status: Status; order: Order }) {
  const query = options.query.trim().toLocaleLowerCase('it');
  const result = list.filter((movie) =>
    (!query || `${movie.title} ${movie.timeline}`.toLocaleLowerCase('it').includes(query)) &&
    (!options.phase || movie.phase === options.phase) &&
    (options.status === 'all' || movie.watched === (options.status === 'watched')));
  if (options.order === 'title') result.sort((a, b) => a.title.localeCompare(b.title, 'it'));
  if (options.order === 'rating') result.sort((a, b) => b.rating - a.rating);
  return result;
}
