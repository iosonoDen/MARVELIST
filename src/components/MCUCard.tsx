"use client";

import type { FC } from "react";
import { Poster } from "@/components/Poster";
import { StarRating } from "@/components/StarRating";
import { WatchStatusButton } from "@/components/WatchStatusButton";
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

export const MCUCard: FC<MCUCardProps> = ({
  entry,
  locale,
  sortMode,
  onOpenDetail,
  onToggleWatch,
  onRate,
}) => {
  const isItalian = locale === "it";

  const typeLabel =
    entry.type === "movie"
      ? isItalian
        ? "Film"
        : "Movie"
      : isItalian
        ? "Serie"
        : "Series";

  const borderClass = entry.watched
    ? "border-emerald-400/40 hover:border-emerald-400/70 hover:shadow-[0_12px_32px_rgba(16,185,129,0.25)]"
    : "border-white/10 hover:border-[#E21B24]/70 hover:shadow-[0_12px_32px_rgba(226,27,36,0.3)]";

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-[#0A0D14]/90 font-sans shadow-lg transition-all duration-300 hover:-translate-y-1 ${borderClass}`}
    >
      <div className="relative aspect-2/3 w-full overflow-hidden bg-neutral-950">
        <Poster
          entry={entry}
          locale={locale}
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-90" />

        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-emerald-500/25 shadow-[inset_0_0_0_2px_rgba(52,211,153,0.35)] transition-opacity duration-500 ease-out motion-reduce:transition-none ${
            entry.watched ? "opacity-100" : "opacity-0"
          }`}
        />

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

        <div className="pointer-events-none absolute right-3 bottom-2.5 left-3 text-left">
          <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
            {sortMode === "timeline" ? entry.timelineYear : entry.releaseYear}
          </span>
          <h3 className="line-clamp-1 text-sm font-extrabold leading-snug tracking-tight text-white transition-colors group-hover:text-red-400">
            {entry.title[locale]}
          </h3>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 border-t border-white/5 bg-neutral-950/85 p-3">
        <div className="flex items-center justify-between">
          <StarRating
            value={entry.rating}
            size="sm"
            onChange={(rating) => onRate(entry.id, rating)}
          />
          <span className="rounded-md border border-white/5 bg-neutral-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            {typeLabel}
          </span>
        </div>
        <WatchStatusButton
          watched={entry.watched}
          locale={locale}
          onToggle={() => onToggleWatch(entry.id)}
          className="w-full"
        />
      </div>
    </article>
  );
};
