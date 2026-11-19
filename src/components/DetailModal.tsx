'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { MCUEntry, SupportedLocale } from '@/types/mcu';
import { StarRating } from '@/components/StarRating';
import { Poster } from '@/components/Poster';
import { X, Youtube, Film, Tv, CheckCircle2, Circle, ExternalLink, User } from 'lucide-react';

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

export const DetailModal: React.FC<DetailModalProps> = ({
  entry,
  isOpen,
  locale,
  onClose,
  onToggleWatch,
  onRate,
}) => {
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loadingCast, setLoadingCast] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !entry?.tmdbId || !entry?.tmdbType) {
      setCast([]);
      return;
    }

    let isMounted = true;
    setLoadingCast(true);

    fetch(`/api/tmdb/credits?id=${entry.tmdbId}&type=${entry.tmdbType}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (isMounted) {
          if (data.cast && data.cast.length > 0) {
            setCast(data.cast);
          } else {
            setCast(
              entry.topCast.map((c, idx) => ({
                id: idx,
                name: c.name,
                character: c.character,
                photoUrl: null,
              }))
            );
          }
        }
      })
      .catch((err) => {
        console.warn('Errore recupero cast da TMDB, uso fallback:', err);
        if (isMounted) {
          setCast(
            entry.topCast.map((c, idx) => ({
              id: idx,
              name: c.name,
              character: c.character,
              photoUrl: null,
            }))
          );
        }
      })
      .finally(() => {
        if (isMounted) setLoadingCast(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, entry]);

  if (!isOpen || !entry) return null;

  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    entry.trailerQuery
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0D1017] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(226,27,36,0.15)] z-10 flex flex-col md:flex-row gap-6 p-5 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900/80 text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 transition-all z-20"
          aria-label="Chiudi finestra modale"
        >
          <X size={18} />
        </button>

        <div className="w-full md:w-5/12 flex flex-col items-center gap-4 flex-shrink-0">
          <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden border border-white/10 shadow-2xl group">
            <Poster entry={entry} locale={locale} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#E21B24] text-white text-[10px] font-black uppercase tracking-wider">
              {entry.phase}
            </span>
          </div>

          <button
            onClick={() => onToggleWatch(entry.id)}
            className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-wider transition-all border ${
              entry.watched
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-neutral-900 border-white/10 hover:border-white/30 text-neutral-200'
            }`}
          >
            {entry.watched ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            <span>
              {entry.watched
                ? locale === 'it'
                  ? 'Visto'
                  : 'Watched'
                : locale === 'it'
                ? 'Segna come Visto'
                : 'Mark as Watched'}
            </span>
          </button>

          <div className="w-full p-3 rounded-xl bg-neutral-900/60 border border-white/5 flex flex-col items-center gap-1.5">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400">
              {locale === 'it' ? 'Il tuo Voto (0.5 - 5)' : 'Your Rating (0.5 - 5)'}
            </span>
            <StarRating
              value={entry.rating}
              size="lg"
              onChange={(newRating) => onRate(entry.id, newRating)}
            />
          </div>
        </div>

        <div className="w-full md:w-7/12 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#E21B24] tracking-wider uppercase mb-1.5">
                {entry.type === 'movie' ? <Film size={14} /> : <Tv size={14} />}
                <span>{entry.type === 'movie' ? 'Marvel Studios Movie' : 'Disney+ Original Series'}</span>
              </div>
              <h2 id="modal-title" className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {entry.title[locale]}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-neutral-900/50 border border-white/5">
                <span className="text-neutral-400 block text-[10px] uppercase font-semibold">
                  {locale === 'it' ? 'Ordine Narrativo' : 'Timeline In-Universe'}
                </span>
                <span className="text-white font-bold text-sm">{entry.timelineYear}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-900/50 border border-white/5">
                <span className="text-neutral-400 block text-[10px] uppercase font-semibold">
                  {locale === 'it' ? 'Data di Uscita' : 'Release Date'}
                </span>
                <span className="text-white font-bold text-sm">
                  {new Date(entry.releaseDate).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-bold">
                {locale === 'it' ? 'Sinossi Ufficiale' : 'Official Synopsis'}
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                {entry.synopsis[locale]}
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-bold">
                  {locale === 'it' ? 'Cast Principale' : 'Key Cast'}
                </h3>
                {loadingCast && (
                  <span className="text-[10px] text-neutral-500 animate-pulse font-medium">
                    {locale === 'it' ? 'Caricamento foto TMDB...' : 'Loading TMDB photos...'}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {cast.map((actor) => (
                  <div
                    key={actor.id}
                    className="flex items-center gap-3 p-2 rounded-xl bg-neutral-900/70 border border-white/10 hover:border-white/20 transition-all shadow-sm group/actor"
                  >
                    <div className="relative w-11 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-800 border border-white/10 flex items-center justify-center">
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
                      <p className="text-xs font-bold text-white truncate leading-snug">{actor.name}</p>
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5 font-medium">
                        {actor.character || '—'}
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
                  locale === 'it' ? 'it-IT' : 'en-US'
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 border border-white/10 hover:border-[#01b4e4]/60 text-neutral-200 hover:text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
              >
                <ExternalLink size={15} className="text-[#01b4e4]" />
                <span>{locale === 'it' ? 'Scheda su TMDB' : 'View on TMDB'}</span>
              </a>
            )}
            <a
              href={youtubeSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#CC0000] to-[#E21B24] hover:from-[#B00000] hover:to-[#CC0000] text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(226,27,36,0.4)] transition-all"
            >
              <Youtube size={18} />
              <span>
                {locale === 'it' ? 'Guarda Trailer Ufficiale (Marvel IT)' : 'Watch Official Trailer (Marvel IT)'}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
