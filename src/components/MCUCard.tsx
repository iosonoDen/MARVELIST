'use client';

import React from 'react';
import { MCUEntry, SupportedLocale, SortMode } from '@/types/mcu';
import { StarRating } from '@/components/StarRating';
import { Poster } from '@/components/Poster';
import { CheckCircle2, Circle } from 'lucide-react';

interface MCUCardProps {
  entry: MCUEntry;
  locale: SupportedLocale;
  sortMode: SortMode;
  onOpenDetail: (entry: MCUEntry) => void;
  onToggleWatch: (id: string) => void;
  onRate: (id: string, rating: number) => void;
}

export const MCUCard: React.FC<MCUCardProps> = ({
  entry,
  locale,
  sortMode,
  onOpenDetail,
  onToggleWatch,
  onRate,
}) => {
  return (
    <article
      onClick={() => onOpenDetail(entry)}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#0A0D14]/90 border border-white/10 hover:border-[#E21B24]/70 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_12px_32px_rgba(226,27,36,0.3)] hover:-translate-y-1 font-sans"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-950">
        <Poster
          entry={entry}
          locale={locale}
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[#E21B24] text-[10px] font-black tracking-wider uppercase border border-white/10 shadow-sm">
          {entry.phase}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatch(entry.id);
          }}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white transition-all backdrop-blur-sm"
          title={entry.watched ? 'Segna come da vedere' : 'Segna come visto'}
          aria-label={entry.watched ? 'Segna come non visto' : 'Segna come visto'}
        >
          {entry.watched ? (
            <CheckCircle2 size={18} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
          ) : (
            <Circle size={18} className="text-neutral-400 hover:text-white" />
          )}
        </button>

        <div className="absolute bottom-2.5 left-3 right-3 text-left pointer-events-none">
          <span className="text-[11px] font-semibold text-neutral-400 block tracking-wide uppercase mb-0.5">
            {sortMode === 'timeline' ? entry.timelineYear : entry.releaseYear}
          </span>
          <h3 className="text-sm font-extrabold text-white leading-snug line-clamp-1 group-hover:text-red-400 transition-colors tracking-tight">
            {entry.title[locale]}
          </h3>
        </div>
      </div>

      <div className="p-3 bg-neutral-950/85 border-t border-white/5 flex items-center justify-between">
        <div onClick={(e) => e.stopPropagation()}>
          <StarRating
            value={entry.rating}
            size="sm"
            onChange={(r) => onRate(entry.id, r)}
          />
        </div>
        <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold bg-neutral-900 px-2 py-0.5 rounded-md border border-white/5">
          {entry.type === 'movie' ? 'Film' : 'Serie'}
        </span>
      </div>
    </article>
  );
};
