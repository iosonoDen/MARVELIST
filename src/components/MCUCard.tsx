"use client";

import { CheckCircle2, Circle } from "lucide-react";
import type React from "react";
import { Poster } from "@/components/Poster";
import { StarRating } from "@/components/StarRating";
import type { MCUEntry, SortMode, SupportedLocale } from "@/types/mcu";
import { formatPhase } from "@/utils/phase";

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
  const isItalian = locale === "it";

  const watchLabel = entry.watched
    ? isItalian
      ? "Segna come non visto"
      : "Mark as unwatched"
    : isItalian
      ? "Segna come visto"
      : "Mark as watched";

  const typeLabel =
    entry.type === "movie"
      ? isItalian
        ? "Film"
        : "Movie"
      : isItalian
        ? "Serie"
        : "Series";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0A0D14]/90 font-sans shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#E21B24]/70 hover:shadow-[0_12px_32px_rgba(226,27,36,0.3)]">
      <div className="relative aspect-2/3 w-full overflow-hidden bg-neutral-950">
        <Poster
          entry={entry}
          locale={locale}
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-90" />

        <button
          type="button"
          onClick={() => onOpenDetail(entry)}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer border-0 bg-transparent p-0"
          aria-label={
            isItalian
              ? `Apri i dettagli di ${entry.title[locale]}`
              : `Open details for ${entry.title[locale]}`
          }
        />

        <span className="pointer-events-none absolute top-2.5 left-2.5 rounded-md border border-white/10 bg-black/80 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#E21B24] shadow-sm backdrop-blur-md">
          {formatPhase(entry.phase, locale)}
        </span>

        <button
          type="button"
          onClick={() => onToggleWatch(entry.id)}
          className="absolute top-2.5 right-2.5 z-20 rounded-full bg-black/60 p-1.5 text-white/80 backdrop-blur-sm transition-all hover:bg-black/90 hover:text-white"
          title={watchLabel}
          aria-label={watchLabel}
        >
          {entry.watched ? (
            <CheckCircle2
              size={18}
              className="text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]"
            />
          ) : (
            <Circle size={18} className="text-neutral-400 hover:text-white" />
          )}
        </button>

        <div className="pointer-events-none absolute right-3 bottom-2.5 left-3 text-left">
          <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
            {sortMode === "timeline" ? entry.timelineYear : entry.releaseYear}
          </span>
          <h3 className="line-clamp-1 text-sm font-extrabold leading-snug tracking-tight text-white transition-colors group-hover:text-red-400">
            {entry.title[locale]}
          </h3>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 bg-neutral-950/85 p-3">
        <StarRating
          value={entry.rating}
          size="sm"
          onChange={(rating) => onRate(entry.id, rating)}
        />
        <span className="rounded-md border border-white/5 bg-neutral-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          {typeLabel}
        </span>
      </div>
    </article>
  );
};