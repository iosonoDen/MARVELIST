"use client";

import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MCUCard } from "@/components/MCUCard";
import { TMDB_META } from "@/data/tmdb";
import {
  type CastGroup,
  type CastIndex,
  loadCastIndex,
  loadCastPhotos,
  profileUrl,
} from "@/lib/cast-search";
import type { MCUEntry, SortMode, SupportedLocale } from "@/types/mcu";

const CLOSE_MS = 160;

/* ------------------------------------------------------------------ */
/* Dati: indice e foto, scaricati solo quando servono                  */
/* ------------------------------------------------------------------ */

export function useCastData() {
  const [index, setIndex] = useState<CastIndex | null>(null);
  const [photos, setPhotos] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    if (index) return;
    setLoading(true);
    loadCastIndex().then((d) => {
      setIndex(d);
      setLoading(false);
    });
    loadCastPhotos().then(setPhotos);
  }, [index]);

  return { index, photos, loading, load };
}

const titleCount = (n: number, it: boolean) =>
  `${n} ${it ? (n === 1 ? "titolo" : "titoli") : n === 1 ? "title" : "titles"}`;

/* ------------------------------------------------------------------ */
/* Pezzi comuni                                                        */
/* ------------------------------------------------------------------ */

/** Immagine che appare in dissolvenza quando è pronta. */
const FadeImg: React.FC<{ src: string; alt?: string; className?: string }> = ({
  src,
  alt = "",
  className = "",
}) => {
  const [loaded, setLoaded] = useState(false);
  return (
    // eslint-disable-next-line @next/next/no-img-element -- foto piccole da TMDB, già ridimensionate
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      ref={(el) => {
        if (el?.complete && el.naturalWidth > 0) setLoaded(true);
      }}
      className={`fade-img ${loaded ? "is-loaded" : ""} ${className}`}
    />
  );
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/** Faccia tonda piccola (testata delle file e chip). */
export const Avatar: React.FC<{ name: string; photo?: string; size?: string }> = ({
  name,
  photo,
  size = "h-8 w-8",
}) => {
  const url = profileUrl(photo, "w185");
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-800 text-[11px] font-bold text-neutral-400 ${size}`}
    >
      {initials(name)}
      {url && <FadeImg src={url} className="absolute inset-0 h-full w-full object-cover" />}
    </span>
  );
};

const Badge: React.FC<{ n: number }> = ({ n }) => (
  <span className="rounded-md bg-[#E21B24] px-1.5 py-px text-[11px] font-bold leading-4 text-white tabular-nums">
    {n}
  </span>
);

/** Fila che scorre di lato, con frecce su computer e bordi sfumati. */
const Strip: React.FC<{ children: React.ReactNode; className?: string; arrows?: boolean; it: boolean }> = ({
  children,
  className = "",
  arrows = true,
  it,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, [update]);

  const count = Array.isArray(children) ? children.length : 1;
  useEffect(update, [update, count]);

  const onArrow = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    const dir = Number(e.currentTarget.dataset.dir);
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  }, []);

  const mask =
    edges.left && edges.right ? "strip-mask-both" : edges.left ? "strip-mask-left" : edges.right ? "strip-mask-right" : "";

  return (
    <div className="group/strip relative">
      <div ref={ref} onScroll={update} className={`strip flex ${mask} ${className}`}>
        {children}
      </div>
      {arrows &&
        ([-1, 1] as const).map((dir) => {
          const show = dir === -1 ? edges.left : edges.right;
          return (
            <button
              key={dir}
              type="button"
              tabIndex={-1}
              aria-label={dir === -1 ? (it ? "Indietro" : "Back") : it ? "Avanti" : "Forward"}
              data-dir={dir}
              onClick={onArrow}
              className={`absolute top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-neutral-950/90 text-white transition-[opacity,background-color] duration-200 hover:bg-[#E21B24] md:flex ${
                dir === -1 ? "left-1" : "right-1"
              } ${show ? "opacity-0 group-hover/strip:opacity-100" : "pointer-events-none opacity-0"}`}
            >
              {dir === -1 ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          );
        })}
    </div>
  );
};

/** Tessera con la foto grande: personaggio o attore. */
const FaceCard: React.FC<{
  group: CastGroup;
  photo?: string;
  i: number;
  it: boolean;
  onPick: (g: CastGroup) => void;
}> = ({ group, photo, i, it, onPick }) => {
  const url = profileUrl(photo);
  const more = group.people > 1 ? (it ? ` e altri ${group.people - 1}` : ` +${group.people - 1}`) : "";
  return (
    <button
      type="button"
      onClick={() => onPick(group)}
      style={{ "--i": Math.min(i, 6) } as React.CSSProperties}
      className="rise-in group/face relative w-26 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-neutral-900 text-left transition-[transform,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#E21B24] focus-visible:border-[#E21B24] focus-visible:outline-none active:scale-[0.97] sm:w-28"
    >
      <span className="relative flex aspect-3/4 items-center justify-center bg-neutral-800 text-xl font-bold text-neutral-500">
        {initials(group.label)}
        {url && (
          <FadeImg
            src={url}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/face:scale-105"
          />
        )}
      </span>
      <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/75 to-transparent px-2 pt-6 pb-2">
        <span className="line-clamp-2 block text-xs font-bold leading-tight text-white">{group.label}</span>
        <span className="mt-0.5 line-clamp-1 block text-[11px] leading-tight text-neutral-300">
          {group.kind === "character" ? `${group.sub}${more}` : group.sub}
        </span>
        <span className="mt-0.5 block text-[11px] leading-tight text-neutral-400">
          {titleCount(group.slugs.length, it)}
        </span>
      </span>
    </button>
  );
};

/* ------------------------------------------------------------------ */
/* Barra di ricerca con il menu dei suggerimenti                       */
/* ------------------------------------------------------------------ */

interface SearchBoxProps {
  locale: SupportedLocale;
  query: string;
  onQuery: (q: string) => void;
  onFocusLoad: () => void;
  loading: boolean;
  characters: CastGroup[];
  actors: CastGroup[];
  titles: MCUEntry[];
  photos: string[] | null;
  onPick: (g: CastGroup) => void;
  onOpenTitle: (e: MCUEntry) => void;
  onSubmit: () => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  locale,
  query,
  onQuery,
  onFocusLoad,
  loading,
  characters,
  actors,
  titles,
  photos,
  onPick,
  onOpenTitle,
  onSubmit,
}) => {
  const it = locale === "it";
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const hasText = query.trim().length >= 2;
  const visible = (open || closing) && hasText;

  const openRef = useRef(false);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Chiusura con animazione: il menu resta montato per CLOSE_MS
  const close = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setOpen(false);
    setClosing(true);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setClosing(false), CLOSE_MS);
  }, []);

  const show = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setClosing(false);
    setOpen(true);
  };

  // Chiude toccando fuori
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, close]);

  useEffect(() => () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  const finish = () => {
    close();
    inputRef.current?.blur();
  };

  const pick = (g: CastGroup) => {
    finish();
    onPick(g);
  };

  const empty = !loading && !characters.length && !actors.length && !titles.length;

  return (
    <div ref={wrapRef} className="relative w-full md:w-96">
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
        size={16}
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        spellCheck={false}
        role="combobox"
        aria-expanded={visible && !closing}
        aria-controls="search-suggestions"
        aria-label={it ? "Cerca titolo, personaggio o attore" : "Search title, character or actor"}
        placeholder={it ? "Cerca titolo, personaggio o attore" : "Search title, character or actor"}
        value={query}
        onFocus={() => {
          onFocusLoad();
          show();
        }}
        onPointerEnter={onFocusLoad}
        onChange={(e) => {
          onQuery(e.target.value);
          show();
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault(); // il campo "search" altrimenti si svuota
            finish();
          }
          if (e.key === "Enter") {
            e.preventDefault();
            finish();
            onSubmit();
          }
        }}
        className="w-full rounded-xl border border-white/10 bg-neutral-900/80 py-2.5 pr-10 pl-10 text-xs font-medium text-white placeholder-neutral-500 transition-colors duration-200 focus:border-[#E21B24] focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            onQuery("");
            inputRef.current?.focus();
          }}
          aria-label={it ? "Cancella la ricerca" : "Clear search"}
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-500 transition-colors duration-150 hover:bg-white/10 hover:text-white"
        >
          <X size={14} />
        </button>
      )}

      {visible && (
        <div
          id="search-suggestions"
          className={`absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0d0e12] shadow-[0_24px_60px_rgba(0,0,0,0.75)] md:w-[min(560px,calc(100vw-4rem))] ${
            closing ? "search-out" : "search-in"
          }`}
        >
          <div className="max-h-[min(70vh,560px)] overflow-y-auto overscroll-contain p-3 sm:p-4">
            {loading && !characters.length && (
              <div className="flex gap-2" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="aspect-3/4 w-26 animate-pulse rounded-xl bg-neutral-800/70 sm:w-28" />
                ))}
              </div>
            )}

            {characters.length > 0 && (
              <section>
                <h3 className="mb-2 flex items-center gap-2 text-xs font-bold text-neutral-200">
                  {it ? "Personaggi" : "Characters"} <Badge n={characters.length} />
                </h3>
                <Strip it={it} arrows={false} className="gap-2 pb-1">
                  {characters.slice(0, 12).map((g, i) => (
                    <FaceCard key={g.key} group={g} photo={photos?.[g.person]} i={i} it={it} onPick={pick} />
                  ))}
                </Strip>
              </section>
            )}

            {actors.length > 0 && (
              <section className={characters.length ? "mt-4" : ""}>
                <h3 className="mb-2 flex items-center gap-2 text-xs font-bold text-neutral-200">
                  {it ? "Attori" : "Actors"} <Badge n={actors.length} />
                </h3>
                <Strip it={it} arrows={false} className="gap-2 pb-1">
                  {actors.slice(0, 12).map((g, i) => (
                    <FaceCard key={g.key} group={g} photo={photos?.[g.person]} i={i} it={it} onPick={pick} />
                  ))}
                </Strip>
              </section>
            )}

            {titles.length > 0 && (
              <section className={characters.length || actors.length ? "mt-4" : ""}>
                <h3 className="mb-1.5 flex items-center gap-2 text-xs font-bold text-neutral-200">
                  {it ? "Titoli" : "Titles"} <Badge n={titles.length} />
                </h3>
                <ul>
                  {titles.slice(0, 6).map((e, i) => {
                    const poster = TMDB_META[e.id]?.poster;
                    return (
                      <li key={e.id} className="rise-in" style={{ "--i": i } as React.CSSProperties}>
                        <button
                          type="button"
                          onClick={() => {
                            finish();
                            onOpenTitle(e);
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-1.5 py-1.5 text-left transition-colors duration-150 hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none"
                        >
                          <span className="h-12 w-8 shrink-0 overflow-hidden rounded bg-neutral-800">
                            {poster && (
                              <FadeImg
                                src={`https://image.tmdb.org/t/p/w92${poster}`}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-white">{e.title[locale]}</span>
                            <span className="block text-xs text-neutral-400">
                              {e.type === "movie" ? "Film" : it ? "Serie" : "Series"} · {e.releaseYear}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {empty && (
              <p className="py-6 text-center text-sm text-neutral-400">
                {it ? "Nessun risultato" : "No results"}
              </p>
            )}
          </div>
          {!empty && (
            <p className="hidden border-t border-white/5 px-4 py-2 text-[11px] text-neutral-500 md:block">
              {it ? "Invio per vedere tutti i risultati" : "Press Enter to see all results"}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Risultati divisi per gruppo: una fila che scorre per gruppo         */
/* ------------------------------------------------------------------ */

interface CardActions {
  locale: SupportedLocale;
  sortMode: SortMode;
  onOpenDetail: (e: MCUEntry) => void;
  onToggleWatch: (id: string) => void;
  onRate: (id: string, rating: number) => void;
}

interface SearchRowsProps extends CardActions {
  titles: MCUEntry[];
  groups: CastGroup[];
  byId: Map<string, MCUEntry>;
  photos: string[] | null;
  onPick: (g: CastGroup) => void;
}

const Row: React.FC<
  CardActions & {
    i: number;
    head: React.ReactNode;
    count: number;
    items: MCUEntry[];
    why?: Record<string, string>;
    onAll?: () => void;
  }
> = ({ i, head, count, items, why, onAll, ...card }) => {
  const it = card.locale === "it";
  return (
    <section className="rise-in" style={{ "--i": Math.min(i, 6) } as React.CSSProperties}>
      <div className="mb-3 flex items-center gap-2.5">
        {head}
        <Badge n={count} />
        {onAll && count > 1 && (
          <button
            type="button"
            onClick={onAll}
            className="ml-auto shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold text-neutral-400 transition-colors duration-150 hover:bg-white/5 hover:text-white"
          >
            {it ? "Vedi tutti" : "See all"}
          </button>
        )}
      </div>
      <Strip it={it} className="-mx-4 scroll-px-4 gap-3 px-4 pt-1 pb-2 sm:-mx-6 sm:scroll-px-6 sm:gap-4 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0">
        {items.map((e) => (
          <div key={e.id} className="w-36 shrink-0 sm:w-44 lg:w-48">
            <MCUCard entry={e} {...card} />
            {why?.[e.id] && (
              <p className="mt-2 line-clamp-2 px-1 text-xs leading-snug text-neutral-400">{why[e.id]}</p>
            )}
          </div>
        ))}
      </Strip>
    </section>
  );
};

export const SearchRows: React.FC<SearchRowsProps> = ({ titles, groups, byId, photos, onPick, ...card }) => {
  const it = card.locale === "it";
  let i = 0;
  return (
    <div className="space-y-8">
      {titles.length > 0 && (
        <Row
          {...card}
          i={i++}
          head={<h2 className="text-base font-bold text-white">{it ? "Titoli" : "Titles"}</h2>}
          count={titles.length}
          items={titles}
        />
      )}
      {groups.map((g) => {
        const items = g.slugs.map((s) => byId.get(s)).filter((e): e is MCUEntry => Boolean(e));
        return (
          <Row
            {...card}
            key={g.key}
            i={i++}
            head={
              <>
                <Avatar name={g.label} photo={photos?.[g.person]} />
                <h2 className="min-w-0 truncate text-base font-bold text-white">
                  <span className="font-normal text-neutral-400">
                    {g.kind === "character" ? (it ? "Personaggio " : "Character ") : it ? "Attore " : "Actor "}
                  </span>
                  {g.label}
                </h2>
              </>
            }
            count={items.length}
            items={items}
            why={g.why}
            onAll={() => onPick(g)}
          />
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Chip del personaggio o attore scelto                                */
/* ------------------------------------------------------------------ */

export const PickedChip: React.FC<{
  group: { kind: CastGroup["kind"]; label: string; sub: string; person: number };
  count: number;
  photo?: string;
  locale: SupportedLocale;
  onClear: () => void;
}> = ({ group, count, photo, locale, onClear }) => {
  const it = locale === "it";
  return (
    <div className="rise-in mb-5 flex items-center gap-3 rounded-2xl border border-[#E21B24]/40 bg-neutral-950/70 py-2 pr-2 pl-2 cinematic-blur sm:pr-3">
      <Avatar name={group.label} photo={photo} size="h-11 w-11" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-neutral-400">
          {group.kind === "character" ? (it ? "Personaggio" : "Character") : it ? "Attore" : "Actor"}
        </p>
        <p className="truncate text-sm font-bold text-white">
          {group.label}
          <span className="font-normal text-neutral-400">
            {" · "}
            {group.sub} · {titleCount(count, it)}
          </span>
        </p>
      </div>
      <button
        type="button"
        onClick={onClear}
        aria-label={it ? "Togli il filtro" : "Clear filter"}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-neutral-400 transition-colors duration-150 hover:bg-white/10 hover:text-white"
      >
        <X size={16} />
      </button>
    </div>
  );
};
