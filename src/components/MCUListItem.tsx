"use client";

import type { FC } from "react";
import { Poster } from "@/components/Poster";
import { StarRating } from "@/components/StarRating";
import { WatchStatusButton } from "@/components/WatchStatusButton";
import type { MCUEntry, SortMode, SupportedLocale } from "@/types/mcu";
import { formatPhase } from "@/utils/phase";

interface MCUListItemProps {
  entry: MCUEntry;
  locale: SupportedLocale;
  sortMode: SortMode;
  onOpenDetail: (entry: MCUEntry) => void;
  onToggleWatch: (id: string) => void;
  onRate: (id: string, rating: number) => void;
}

export const MCUListItem: FC<MCUListItemProps> = ({
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
    ? "border-emerald-400/50 hover:border-emerald-400/70"
    : "border-white/10 hover:border-[#E21B24]/70";

  const phaseClass = entry.watched
    ? "border-emerald-400/50 text-emerald-400"
    : "border-white/10 text-[#E21B24]";

  const titleClass = entry.watched
    ? "text-emerald-300 group-hover:text-emerald-200"
    : "text-white group-hover:text-red-400";

  const tintBase =
    "pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out motion-reduce:transition-none";
  const tintState = entry.watched ? "opacity-100" : "opacity-0";

  return (
    <article
      className={`group relative flex items-center gap-3 overflow-hidden rounded-xl border bg-[#0A0D14]/90 p-2.5 font-sans shadow-md transition-colors duration-300 sm:gap-4 sm:p-3 ${borderClass}`}
    >
      <div
        aria-hidden="true"
        className={`${tintBase} bg-emerald-500/5 ${tintState}`}
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

      <div className="relative aspect-2/3 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-950 sm:w-16">
        <Poster entry={entry} locale={locale} />
        <div
          aria-hidden="true"
          className={`${tintBase} bg-emerald-500/8 shadow-[inset_0_0_0_2px_rgba(52,211,153,0.45)] ${tintState}`}
        />
      </div>

      <div className="relative min-w-0 flex-1 text-left">
        <span className="block text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
          {sortMode === "timeline" ? entry.timelineYear : entry.releaseYear}
        </span>
        <h3
          className={`truncate text-sm font-extrabold leading-snug tracking-tight transition-colors duration-500 motion-reduce:transition-none sm:text-base ${titleClass}`}
        >
          {entry.title[locale]}
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span
            className={`rounded-md border bg-black/60 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider transition-colors duration-500 motion-reduce:transition-none ${phaseClass}`}
          >
            {formatPhase(entry.phase, locale)}
          </span>
          <span className="rounded-md border border-white/5 bg-neutral-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            {typeLabel}
          </span>
        </div>
      </div>

      <div className="relative z-20 flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-5">
        <StarRating
          value={entry.rating}
          size="sm"
          onChange={(rating) => onRate(entry.id, rating)}
        />
        <WatchStatusButton
          watched={entry.watched}
          locale={locale}
          onToggle={() => onToggleWatch(entry.id)}
        />
      </div>
    </article>
  );
};
