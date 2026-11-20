"use client";

import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Film,
  Tv,
  User,
  X,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { Poster } from "@/components/Poster";
import { StarRating } from "@/components/StarRating";

import type { MCUEntry, SupportedLocale } from "@/types/mcu";

interface DetailModalProps {
  entry: MCUEntry | null;
  isOpen: boolean;
  locale: SupportedLocale;
  onClose: () => void;
  onToggleWatch: (id: string) => void;
  onRate: (id: string, rating: number) => void;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  photoUrl: string | null;
}

export function DetailModal({
  entry,
  isOpen,
  locale,
  onClose,
  onToggleWatch,
  onRate,
}: DetailModalProps): ReactElement | null {
  const [castResult, setCastResult] = useState<{
    key: string;
    cast: CastMember[];
  } | null>(null);

  const tmdbId = entry?.tmdbId;
  const tmdbType = entry?.tmdbType;

  const castKey =
    tmdbId && tmdbType ? JSON.stringify([tmdbType, tmdbId]) : null;

  const fallbackCast: CastMember[] = (entry?.topCast ?? []).map(
    (actor, index) => ({
      id: index,
      name: actor.name,
      character: actor.character,
      photoUrl: null,
    }),
  );

  const currentResult =
    castKey !== null && castResult?.key === castKey ? castResult : null;

  const cast =
    currentResult && currentResult.cast.length > 0
      ? currentResult.cast
      : fallbackCast;

  const loadingCast = isOpen && castKey !== null && currentResult === null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !tmdbId || !tmdbType || castKey === null) {
      return;
    }

    const controller = new AbortController();
    const requestKey = castKey;
    let ignore = false;

    async function loadCast() {
      try {
        const params = new URLSearchParams({
          id: String(tmdbId),
          type: String(tmdbType),
        });

        const response = await fetch(`/api/tmdb/credits?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`TMDB credits: HTTP ${response.status}`);
        }

        const data: { cast?: CastMember[] } = await response.json();

        if (!ignore) {
          setCastResult({
            key: requestKey,
            cast: Array.isArray(data.cast) ? data.cast : [],
          });
        }
      } catch (error) {
        if (ignore || controller.signal.aborted) return;

        console.warn("Errore recupero cast da TMDB, uso fallback:", error);

        setCastResult({
          key: requestKey,
          cast: [],
        });
      }
    }

    void loadCast();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [isOpen, tmdbId, tmdbType, castKey]);

  if (!isOpen || !entry) return null;

  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    entry.trailerQuery,
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 font-sans sm:p-6 lg:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 z-0 h-full w-full cursor-default border-0 bg-black/85 p-0 backdrop-blur-md"
        aria-label={locale === "it" ? "Chiudi finestra modale" : "Close dialog"}
        tabIndex={-1}
      />

      <div className="relative z-10 grid max-h-[92dvh] w-full max-w-4xl grid-cols-1 gap-6 overflow-y-auto overscroll-contain rounded-2xl border border-white/15 bg-[#0D1017] p-5 shadow-2xl sm:p-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-neutral-900 text-neutral-400 transition-colors hover:border-white/30 hover:text-white"
          aria-label={
            locale === "it" ? "Chiudi finestra modale" : "Close dialog"
          }
        >
          <X size={18} />
        </button>

        {/* Colonna sinistra */}
        <div className="flex min-w-0 w-full flex-col items-center gap-4">
          <div className="group relative aspect-2/3 w-full max-w-sm overflow-hidden rounded-xl border border-white/10 shadow-2xl">
            <Poster entry={entry} locale={locale} />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60" />
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#E21B24] text-white text-[10px] font-black uppercase tracking-wider">
              {entry.phase}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onToggleWatch(entry.id)}
            className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-wider transition-all border ${
              entry.watched
                ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                : "bg-neutral-900 border-white/10 hover:border-white/30 text-neutral-200"
            }`}
          >
            {entry.watched ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            <span>
              {entry.watched
                ? locale === "it"
                  ? "Visto"
                  : "Watched"
                : locale === "it"
                  ? "Segna come Visto"
                  : "Mark as Watched"}
            </span>
          </button>

          <div className="w-full p-3 rounded-xl bg-neutral-900/60 border border-white/5 flex flex-col items-center gap-1.5">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400">
              {locale === "it"
                ? "Il tuo Voto (0.5 - 5)"
                : "Your Rating (0.5 - 5)"}
            </span>
            <StarRating
              value={entry.rating}
              size="lg"
              onChange={(newRating) => onRate(entry.id, newRating)}
            />
          </div>
        </div>

        {/* Colonna destra */}
        <div className="flex min-w-0 w-full flex-col justify-between gap-5 pt-8 md:pt-0 md:pr-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#E21B24] tracking-wider uppercase mb-1.5">
                {entry.type === "movie" ? <Film size={14} /> : <Tv size={14} />}
                <span>
                  {entry.type === "movie"
                    ? "Marvel Studios Movie"
                    : "Disney+ Original Series"}
                </span>
              </div>
              <h2
                id="modal-title"
                className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight"
              >
                {entry.title[locale]}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-neutral-900/50 border border-white/5">
                <span className="text-neutral-400 block text-[10px] uppercase font-semibold">
                  {locale === "it"
                    ? "Ordine Narrativo"
                    : "Timeline In-Universe"}
                </span>
                <span className="text-white font-bold text-sm">
                  {entry.timelineYear}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-900/50 border border-white/5">
                <span className="text-neutral-400 block text-[10px] uppercase font-semibold">
                  {locale === "it" ? "Data di Uscita" : "Release Date"}
                </span>
                <span className="text-white font-bold text-sm">
                  {new Date(entry.releaseDate).toLocaleDateString(
                    locale === "it" ? "it-IT" : "en-US",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-bold">
                {locale === "it" ? "Sinossi Ufficiale" : "Official Synopsis"}
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                {entry.synopsis[locale]}
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-bold">
                  {locale === "it" ? "Cast Principale" : "Key Cast"}
                </h3>
                {loadingCast && (
                  <span className="text-[10px] text-neutral-500 animate-pulse font-medium">
                    {locale === "it"
                      ? "Caricamento foto TMDB..."
                      : "Loading TMDB photos..."}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {cast.map((actor) => (
                  <div
                    key={actor.id}
                    className="flex items-center gap-3 p-2 rounded-xl bg-neutral-900/70 border border-white/10 hover:border-white/20 transition-all shadow-sm group/actor"
                  >
                    <div className="relative w-11 h-14 shrink-0 rounded-lg overflow-hidden bg-neutral-800 border border-white/10 flex items-center justify-center">
                      {actor.photoUrl ? (
                        <Image
                          src={actor.photoUrl}
                          alt={actor.name}
                          fill
                          sizes="48px"
                          className="object-cover transition-transform duration-300 group-hover/actor:scale-105"
                        />
                      ) : (
                        <User size={20} className="text-neutral-500" />
                      )}
                    </div>
                    <div className="min-w-0 pr-1">
                      <p className="text-xs font-bold text-white truncate leading-snug">
                        {actor.name}
                      </p>
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5 font-medium">
                        {actor.character || "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {entry.tmdbId && entry.tmdbType && (
              <a
                href={`https://www.themoviedb.org/${entry.tmdbType}/${entry.tmdbId}?language=${
                  locale === "it" ? "it-IT" : "en-US"
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 border border-white/10 hover:border-[#01b4e4]/60 text-neutral-200 hover:text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
              >
                <ExternalLink size={15} className="text-[#01b4e4]" />
                <span>
                  {locale === "it" ? "Scheda su TMDB" : "View on TMDB"}
                </span>
              </a>
            )}
            <a
              href={youtubeSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-[#CC0000] to-[#E21B24] hover:from-[#B00000] hover:to-[#CC0000] text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(226,27,36,0.4)] transition-all"
            >
              <Youtube size={18} />
              <span>
                {locale === "it"
                  ? "Guarda Trailer Ufficiale (Marvel IT)"
                  : "Watch Official Trailer (Marvel EN)"}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}