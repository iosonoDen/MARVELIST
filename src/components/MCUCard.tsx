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
      className="group relative flex flex-col rounded-xl overflow-hidden bg-[#0A0D14]/90 border border-white/10 hover:border-[#E21B24]/60 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(226,27,36,0.25)] hover:-translate-y-1"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-950">
        <Poster
          entry={entry}
          locale={locale}
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-85" />

        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-[#E21B24] text-[9px] font-black tracking-wider uppercase font-mono border border-white/10">
          {entry.phase}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatch(entry.id);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white transition-all backdrop-blur-sm"
          title={entry.watched ? 'Segna come da vedere' : 'Segna come visto'}
          aria-label={entry.watched ? 'Segna come non visto' : 'Segna come visto'}
        >
          {entry.watched ? (
            <CheckCircle2 size={16} className="text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
          ) : (
            <Circle size={16} className="text-neutral-400 hover:text-white" />
          )}
        </button>

        <div className="absolute bottom-2 left-2 right-2 text-left pointer-events-none">
          <span className="text-[10px] font-mono text-neutral-400 block tracking-tight">
            {sortMode === 'timeline' ? entry.timelineYear : entry.releaseYear}
          </span>
          <h3 className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-1 group-hover:text-red-400 transition-colors">
            {entry.title[locale]}
          </h3>
        </div>
      </div>

      <div className="p-2.5 bg-neutral-950/80 border-t border-white/5 flex items-center justify-between">
        <div onClick={(e) => e.stopPropagation()}>
          <StarRating
            value={entry.rating}
            size="sm"
            onChange={(r) => onRate(entry.id, r)}
          />
        </div>
        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-semibold">
          {entry.type === 'movie' ? 'Film' : 'Serie'}
        </span>
      </div>
    </article>
  );
};