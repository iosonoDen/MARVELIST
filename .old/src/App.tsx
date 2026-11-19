import { useEffect, useState } from 'react';
import { ArrowDownWideNarrow, Check, ChevronDown, Clapperboard, ExternalLink, Film, ListFilter, Search, Star, StickyNote, X } from 'lucide-react';
import { filterMovies, getChecklist, getTotals, readProgress, storageKey } from './checklist';
import type { Movie, Order, Progress, SavedProgress, Status } from './checklist';
import posterData from './data/posters.json';

const posters: Record<string, string> = posterData;
const hasPosters = Object.keys(posters).length > 0;
const phases = [1, 2, 3, 4, 5, 6];
const statuses: { id: Status; label: string }[] = [
  { id: 'all', label: 'Tutti' }, { id: 'watched', label: 'Visti' }, { id: 'unwatched', label: 'Da vedere' },
];
const logo = 'https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg';

function initialState(): { data: SavedProgress; error: string } {
  try { return { data: readProgress(localStorage.getItem(storageKey)), error: '' }; }
  catch { return { data: {}, error: 'Impossibile leggere i progressi salvati. Le modifiche restano in questa sessione.' }; }
}

function Poster({ movie }: { movie: Movie }) {
  const [failed, setFailed] = useState(false);
  return <a className="poster" data-phase={movie.phase} href={`https://www.themoviedb.org/movie/${movie.tmdbId}`}
    target="_blank" rel="noreferrer" aria-label={`Apri ${movie.title} su TMDB (nuova scheda)`}>
    {posters[movie.id] && !failed
      ? <img src={posters[movie.id]} alt="" loading="lazy" onError={() => setFailed(true)} />
      : <><Film size={17} strokeWidth={1.5} aria-hidden="true" /><span>{movie.id.slice(-2)}</span></>}
  </a>;
}

function MovieRow({ movie, update }: { movie: Movie; update: (patch: Partial<Progress>) => void }) {
  const [showNote, setShowNote] = useState(false);
  return <li className="movie-row" data-watched={movie.watched}>
    <div className="movie-grid">
      <div className="movie-main">
        <label className="check-wrap" title={movie.watched ? 'Segna come da vedere' : 'Segna come visto'}>
          <input type="checkbox" checked={movie.watched} aria-label={`${movie.title}: visto`}
            onChange={(event) => update({ watched: event.target.checked })} />
          <span className="check-shell" aria-hidden="true"><Check size={14} strokeWidth={3} /></span>
        </label>
        <Poster movie={movie} />
        <div className="min-w-0">
          <h3 className="font-semibold leading-snug text-ink">{movie.title}</h3>
          <p className="timeline-mobile mt-1 text-xs text-muted">{movie.timeline}</p>
        </div>
      </div>
      <p className="timeline-desktop text-sm text-muted">{movie.timeline}</p>
      <div className="phase-slot"><span className="phase-badge">Fase {movie.phase}</span></div>
      <div className="rating" role="group" aria-label={`Voto per ${movie.title}: ${movie.rating ? `${movie.rating} su 5` : 'nessun voto'}`}>
        {[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" className="star"
          title={`${star} su 5`} aria-label={`Imposta voto ${star} su 5 per ${movie.title}`} aria-pressed={movie.rating === star}
          onClick={() => update({ rating: star })}>
          <Star size={16} fill={star <= movie.rating ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>)}
        <button type="button" className="icon-button clear-rating" disabled={!movie.rating}
          title="Rimuovi voto" aria-label={`Rimuovi voto per ${movie.title}`} onClick={() => update({ rating: 0 })}>
          <X size={13} aria-hidden="true" />
        </button>
      </div>
      <button type="button" className="icon-button note-button" data-filled={!!movie.notes.trim()}
        aria-expanded={showNote} aria-controls={`${movie.id}-notes`} aria-label={`Note per ${movie.title}`} title="Note"
        onClick={() => setShowNote(!showNote)}><StickyNote size={17} aria-hidden="true" /></button>
    </div>
    <div className="note-panel" id={`${movie.id}-notes`} hidden={!showNote}>
      <label className="block mb-2 text-xs font-semibold text-muted" htmlFor={`${movie.id}-input`}>Note personali</label>
      <textarea id={`${movie.id}-input`} rows={2} value={movie.notes} placeholder="Scrivi cosa vuoi ricordare…"
        onChange={(event) => update({ notes: event.target.value })} />
    </div>
  </li>;
}

export default function App() {
  const [saved, setSaved] = useState(initialState);
  const [writeError, setWriteError] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [query, setQuery] = useState('');
  const [phase, setPhase] = useState(0);
  const [status, setStatus] = useState<Status>('all');
  const [order, setOrder] = useState<Order>('sheet');
  const checklist = getChecklist(saved.data);
  const { total, watched, remaining, percent } = getTotals(checklist);
  const visible = filterMovies(checklist, { query, phase, status, order });

  useEffect(() => {
    if (!dirty || saved.error) return;
    try { localStorage.setItem(storageKey, JSON.stringify(saved.data)); setWriteError(false); }
    catch { setWriteError(true); }
  }, [dirty, saved]);

  function update(id: string, patch: Partial<Progress>) {
    setSaved((current) => ({ ...current, data: { ...current.data, [id]: { ...current.data[id], ...patch } } }));
    setDirty(true);
  }

  function resetFilters() { setQuery(''); setPhase(0); setStatus('all'); setOrder('sheet'); }
  const filtered = !!query.trim() || !!phase || status !== 'all';
  const storageError = saved.error || (writeError ? 'Salvataggio non riuscito. Le modifiche potrebbero andare perse ricaricando.' : '');

  return <>
    <a className="skip-link" href="#checklist">Vai alla checklist</a>
    <header className="topbar">
      <div className="shell flex min-h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="brand-mark"><Clapperboard size={19} aria-hidden="true" /></span>
          <span className="text-sm font-bold tracking-wide">MCU <span className="text-muted font-medium">CHECKLIST</span></span>
        </div>
        <span className="local-badge"><span aria-hidden="true" /> In locale</span>
      </div>
    </header>
    <main className="shell py-7 sm:py-10" id="main-content">
      <section className="hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow"><span aria-hidden="true" /> Marvel Cinematic Universe</p>
          <h1 id="page-title">La tua maratona <em>MCU<span>.</span></em></h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">Segna i film che hai visto, dai un voto e segui la timeline una visione alla volta.</p>
        </div>
        <div className="hero-progress">
          <p className="eyebrow text-muted">Progresso</p>
          <div className="mt-2 flex items-baseline justify-between gap-4">
            <p className="text-5xl font-black tracking-tight tabular-nums">{percent}<span className="text-2xl text-accent">%</span></p>
            <p className="text-sm text-muted"><strong className="text-ink tabular-nums">{watched}</strong> / {total} visti</p>
          </div>
          <progress className="progress-bar mt-4" value={watched} max={total} aria-label="Progresso delle visioni" />
          <p className="mt-2 text-xs text-muted" role="status">{remaining ? `${remaining} film da vedere` : 'Maratona completata.'}</p>
        </div>
      </section>
      {storageError && <p role="alert" className="mt-4 rounded-xl border border-amber-800 bg-amber-950/40 p-3 text-sm text-amber-200">{storageError}</p>}
      <section id="checklist" tabIndex={-1} className="mt-10" aria-labelledby="checklist-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow mb-2 text-accent">Il tuo catalogo</p>
            <h2 id="checklist-title" className="text-2xl font-bold tracking-tight sm:text-3xl">Checklist film</h2>
          </div>
          <p className="text-sm text-muted" role="status">{visible.length} di {total} film</p>
        </div>
        <div className="toolbar" aria-label="Filtri e ordinamento">
          <div className="field search-field">
            <Search size={17} aria-hidden="true" />
            <input type="search" aria-label="Cerca per titolo o ambientazione" placeholder="Cerca un film…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="segments" role="group" aria-label="Stato visione">
            {statuses.map((item) => <button type="button" key={item.id} aria-pressed={status === item.id} onClick={() => setStatus(item.id)}>{item.label}</button>)}
          </div>
          <div className="selects flex gap-2">
            <div className="field select-field">
              <ListFilter size={16} aria-hidden="true" />
              <select aria-label="Filtra per fase" value={phase} onChange={(e) => setPhase(Number(e.target.value))}>
                <option value={0}>Tutte le fasi</option>
                {phases.map((p) => <option key={p} value={p}>Fase {p}</option>)}
              </select><ChevronDown size={14} aria-hidden="true" />
            </div>
            <div className="field select-field">
              <ArrowDownWideNarrow size={16} aria-hidden="true" />
              <select aria-label="Ordinamento" value={order} onChange={(e) => setOrder(e.target.value as Order)}>
                <option value="sheet">Ordine del foglio</option><option value="title">Titolo A–Z</option><option value="rating">Voto più alto</option>
              </select><ChevronDown size={14} aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="catalog mt-4">
          <div aria-hidden="true" className="movie-grid table-head"><span>Film</span><span>Ambientazione</span><span>Fase</span><span>Voto</span><span>Note</span></div>
          {visible.length ? <ul aria-label="Film MCU">
            {visible.map((movie) => <MovieRow key={movie.id} movie={movie} update={(patch) => update(movie.id, patch)} />)}
          </ul> : <div className="empty">
            <Film size={26} aria-hidden="true" /><h3 className="text-lg font-semibold text-ink">Nessun film trovato</h3>
            <p className="text-sm">Prova un titolo diverso o rimuovi i filtri.</p>
            {filtered && <button className="reset-button" type="button" onClick={resetFilters}>Azzera i filtri</button>}
          </div>}
        </div>
      </section>
      <footer className="footer mt-8" aria-label="Informazioni e crediti">
        <p>MCU Checklist <span className="px-2" aria-hidden="true">·</span> Progressi salvati in questo browser</p>
        <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">The Movie Database <ExternalLink size={13} aria-hidden="true" /></a>
        {hasPosters && <div className="credits"><img alt="TMDB" src={logo} width="40" height="29" /> <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p></div>}
      </footer>
    </main>
  </>;
}
