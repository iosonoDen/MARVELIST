'use client';

import React, { useEffect } from 'react';
import { MCUEntry, SupportedLocale } from '@/types/mcu';
import { StarRating } from '@/components/StarRating';
import { Poster } from '@/components/Poster';
import { X, Youtube, Film, Tv, CheckCircle2, Circle, ExternalLink } from 'lucide-react';

interface DetailModalProps {
  entry: MCUEntry | null;
  isOpen: boolean;
  locale: SupportedLocale;
  onClose: () => void;
  onToggleWatch: (id: string) => void;
  onRate: (id: string, rating: number) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  entry,
  isOpen,
  locale,
  onClose,
  onToggleWatch,
  onRate,
}) => {
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

  if (!isOpen || !entry) return null;

  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    entry.trailerQuery
  )}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0D1017] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(226,27,36,0.15)] z-10 flex flex-col md:flex-row gap-6 p-6 sm:p-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900/80 text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 transition-all"
          aria-label="Chiudi finestra modale"
        >
          <X size={18} />
        </button>

        <div className="w-full md:w-5/12 flex flex-col items-center gap-4 flex-shrink-0">
          <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden border border-white/10 shadow-2xl group">
            <Poster entry={entry} locale={locale} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#E21B24] text-white text-[10px] font-black uppercase tracking-wider font-mono">
              {entry.phase}
            </span>
          </div>

          <button
            onClick={() => onToggleWatch(entry.id)}
            className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all border ${
              entry.watched
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-neutral-900 border-white/10 hover:border-white/30 text-neutral-300'
            }`}
          >
            {entry.watched ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            <span>{entry.watched ? (locale === 'it' ? 'Visto' : 'Watched') : (locale === 'it' ? 'Segna come Visto' : 'Mark as Watched')}</span>
          </button>

          <div className="w-full p-3 rounded-xl bg-neutral-900/60 border border-white/5 flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-400">
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
              <div className="flex items-center gap-2 text-xs font-mono text-[#E21B24] tracking-wider uppercase mb-1">
                {entry.type === 'movie' ? <Film size={14} /> : <Tv size={14} />}
                <span>{entry.type === 'movie' ? 'Marvel Studios Movie' : 'Disney+ Original Series'}</span>
              </div>
              <h2 id="modal-title" className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {entry.title[locale]}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-neutral-900/50 border border-white/5">
                <span className="text-neutral-500 block text-[10px] uppercase">
                  {locale === 'it' ? 'Ordine Narrativo' : 'Timeline In-Universe'}
                </span>
                <span className="text-neutral-200 font-bold">{entry.timelineYear}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-900/50 border border-white/5">
                <span className="text-neutral-500 block text-[10px] uppercase">
                  {locale === 'it' ? 'Data di Uscita' : 'Release Date'}
                </span>
                <span className="text-neutral-200 font-bold">
                  {new Date(entry.releaseDate).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
                {locale === 'it' ? 'Sinossi Ufficiale' : 'Official Synopsis'}
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                {entry.synopsis[locale]}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
                {locale === 'it' ? 'Cast Principale' : 'Key Cast'}
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {entry.topCast.map((actor, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-2 rounded-lg bg-neutral-900/40 border border-white/5">
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-[11px] font-bold text-neutral-300 font-mono" aria-hidden="true">
                      {actor.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{actor.name}</p>
                      <p className="text-[10px] text-neutral-400 truncate font-mono">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
          {entry.tmdbId && entry.tmdbType && (
            <a
              href={`https://www.themoviedb.org/${entry.tmdbType}/${entry.tmdbId}?language=${locale === 'it' ? 'it-IT' : 'en-US'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 border border-white/10 hover:border-[#01b4e4]/60 text-neutral-200 hover:text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
            >
              <ExternalLink size={15} className="text-[#01b4e4]" />
              <span>{locale === 'it' ? 'Scheda su TMDB' : 'View on TMDB'}</span>
            </a>
          )}
          <a
            href={youtubeSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#CC0000] to-[#E21B24] hover:from-[#B00000] hover:to-[#CC0000] text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(226,27,36,0.4)] transition-all"
          >
            <Youtube size={18} />
            <span>{locale === 'it' ? 'Guarda Trailer Ufficiale (Marvel IT)' : 'Watch Official Trailer (Marvel IT)'}</span>
          </a>
          </div>
        </div>
      </div>
    </div>
  );
};