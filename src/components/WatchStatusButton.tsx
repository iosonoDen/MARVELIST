"use client";

import { Check, Circle } from "lucide-react";
import type { FC } from "react";
import type { SupportedLocale } from "@/types/mcu";

interface WatchStatusButtonProps {
  watched: boolean;
  locale: SupportedLocale;
  onToggle: () => void;
  className?: string;
}

const LABELS = [
  { locale: "it", watched: false, text: "Da guardare" },
  { locale: "it", watched: true, text: "Guardato" },
  { locale: "en", watched: false, text: "To Watch" },
  { locale: "en", watched: true, text: "Watched" },
] as const;

export const WatchStatusButton: FC<WatchStatusButtonProps> = ({
  watched,
  locale,
  onToggle,
  className = "",
}) => {
  const isItalian = locale === "it";
  const actionLabel = watched
    ? isItalian
      ? "Segna come da guardare"
      : "Mark as to watch"
    : isItalian
      ? "Segna come guardato"
      : "Mark as watched";

  const stateClass = watched
    ? "border-emerald-400/35 bg-transparent text-emerald-300 hover:bg-emerald-500/10"
    : "border-white/15 bg-neutral-900 text-neutral-300 hover:border-white/40 hover:text-white";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={watched}
      title={actionLabel}
      className={`inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-[11px] font-bold uppercase tracking-wide transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-emerald-400 motion-reduce:transition-none ${stateClass} ${className}`}
    >
      {watched ? (
        <Check size={13} aria-hidden="true" className="shrink-0" />
      ) : (
        <Circle size={13} aria-hidden="true" className="shrink-0" />
      )}
      <span className="inline-grid">
        {LABELS.map(({ locale: l, watched: w, text }) => {
          const active = l === locale && w === watched;
          return (
            <span
              key={`${l}-${w}`}
              className={`col-start-1 row-start-1 text-center ${active ? "" : "invisible"}`}
            >
              {text}
            </span>
          );
        })}
      </span>
    </button>
  );
};