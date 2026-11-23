"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  byTimeline,
  MILESTONES,
  RANKS,
  type Rank,
  rankAt,
  type SagaProgressStats,
  sagaProgress,
} from "@/lib/saga";
import type { MCUEntry, SupportedLocale } from "@/types/mcu";
import { formatPhase } from "@/utils/phase";
import { ShareRankButton } from "@/components/ShareRankButton";

interface SagaProgressProps {
  entries: MCUEntry[];
  locale: SupportedLocale;
  onToggleWatch: (id: string) => void;
  onOpenDetail: (entry: MCUEntry) => void;
}

function useSagaStats(entries: MCUEntry[]) {
  return useMemo(() => {
    const watched = entries.filter((e) => e.watched).length;
    // Prossimo da vedere: il primo titolo non visto in ordine di timeline.
    const next = byTimeline(entries).find((e) => !e.watched) ?? null;
    return { ...sagaProgress(watched, entries.length), next };
  }, [entries]);
}

type Stats = SagaProgressStats;

/** Frase che cambia col progresso: spinge a guardare il prossimo titolo. */
export function motivation(s: Stats, locale: SupportedLocale): React.ReactNode {
  const it = locale === "it";
  if (s.watched === 0)
    return it
      ? "Il multiverso ti aspetta. Inizia dal primo titolo."
      : "The multiverse is waiting. Start with the first title.";
  if (s.watched === s.total)
    return it
      ? "Saga completata. Sei un vero Vendicatore."
      : "Saga complete. You are a true Avenger.";
  if (s.nextRank) {
    const n = s.toNextRank;
    const name = (
      <span className="font-extrabold" style={{ color: s.nextRank.color }}>
        {s.nextRank[locale]}
      </span>
    );
    return it ? (
      <>
        Ancora {n} {n === 1 ? "titolo" : "titoli"} per diventare {name}.
      </>
    ) : (
      <>
        {n} more {n === 1 ? "title" : "titles"} to become {name}.
      </>
    );
  }
  const left = s.total - s.watched;
  return it
    ? `Ancora ${left} ${left === 1 ? "titolo" : "titoli"} per completare la saga.`
    : `${left} more ${left === 1 ? "title" : "titles"} to complete the saga.`;
}

const NextUp: React.FC<{
  entry: MCUEntry | null;
  locale: SupportedLocale;
  onToggleWatch: (id: string) => void;
  onOpenDetail: (entry: MCUEntry) => void;
}> = ({ entry, locale, onToggleWatch, onOpenDetail }) => {
  if (!entry) return null;
  const it = locale === "it";
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-neutral-900/70 p-2.5 pr-3">
      <button
        type="button"
        onClick={() => onOpenDetail(entry)}
        className="relative h-16 w-11 shrink-0 overflow-hidden rounded-md border border-white/10"
        aria-label={entry.title[locale]}
      >
        <Image
          src={entry.posterUrl}
          alt=""
          fill
          sizes="44px"
          className="object-cover"
        />
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#E21B24]">
          {it ? "Prossimo da vedere" : "Up next"}
        </p>
        <p className="truncate text-sm font-extrabold text-white">
          {entry.title[locale]}
        </p>
        <p className="text-[11px] font-medium text-neutral-400">
          {formatPhase(entry.phase, locale)} · {entry.releaseYear}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onToggleWatch(entry.id)}
        className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#E21B24] px-3 py-2 text-xs font-bold text-white shadow-[0_0_14px_rgba(226,27,36,0.55)] transition-all hover:brightness-110"
      >
        <Check size={14} aria-hidden="true" />
        <span>{it ? "Visto" : "Watched"}</span>
      </button>
    </div>
  );
};

/** Stemma del grado: icona disegnata dall'autore, nel colore del grado, con bagliore. */
export const RankBadge: React.FC<{
  rank: Rank;
  celebrate: boolean;
  /** Lato in px (default 48). */
  size?: number;
}> = ({ rank, celebrate, size = 48 }) => {
  const { icon, color } = rank;
  const glow = { filter: `drop-shadow(0 0 6px ${color}b3)` };
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      {celebrate && (
        // eslint-disable-next-line @next/next/no-img-element -- stemma piccolo, serve anche all'export in immagine
        <img
          src={icon}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full animate-ping object-contain opacity-60"
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element -- stemma piccolo, serve anche all'export in immagine */}
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        className={`relative h-full w-full object-contain ${celebrate ? "rank-pop" : ""}`}
        style={glow}
      />
    </span>
  );
};

/** Barra della saga con le tappe colorate dentro e le percentuali sotto. */
export const SagaBar: React.FC<{
  pct: number;
  locale: SupportedLocale;
  /** Senza animazioni: per l'immagine da condividere. */
  still?: boolean;
}> = ({ pct, locale, still }) => {
  const it = locale === "it";
  return (
    <div className="pt-1">
      <div
        className="relative h-4 w-full overflow-hidden rounded-full border border-white/10 bg-neutral-900 p-0.5"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={it ? "Progresso saga" : "Saga progress"}
      >
        <div
          className="relative h-full rounded-full bg-linear-to-r from-[#8B0000] via-[#E21B24] to-[#FF4D4D] shadow-[0_0_18px_rgba(226,27,36,0.9)] transition-all duration-1000 ease-out"
          style={{ width: `${Math.max(pct, 2)}%` }}
        >
          {!still && (
            <span className="absolute inset-0 animate-pulse rounded-full bg-white/15" />
          )}
        </div>
        {/* Tappe: linee sottili che restano dentro la barra */}
        {MILESTONES.map((m) => (
          <span
            key={m}
            aria-hidden="true"
            className="absolute inset-y-0.5 w-0.5 -translate-x-1/2 rounded-full"
            style={{
              left: `${m}%`,
              backgroundColor:
                pct >= m ? rankAt(m).color : "rgba(255,255,255,0.2)",
              // Bordo scuro: la tacca rossa resta visibile sulla barra rossa.
              boxShadow: pct >= m ? "0 0 0 1px rgba(0,0,0,0.55)" : undefined,
            }}
          />
        ))}
      </div>
      <div className="relative mt-1.5 h-4 text-[10px] font-bold">
        {[...MILESTONES, 100].map((m) => {
          const reached = pct >= m;
          const color = m === 100 ? RANKS[RANKS.length - 1].color : rankAt(m).color;
          return (
            <span
              key={m}
              className={`absolute ${
                m === 100 ? "right-0" : "-translate-x-1/2"
              } ${reached ? "" : "text-neutral-500"}`}
              style={{
                ...(m === 100 ? {} : { left: `${m}%` }),
                ...(reached ? { color } : {}),
              }}
            >
              {m}%
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const SagaProgress: React.FC<SagaProgressProps> = ({
  entries,
  locale,
  onToggleWatch,
  onOpenDetail,
}) => {
  const s = useSagaStats(entries);
  const it = locale === "it";

  // Festa al cambio di grado: solo quando un singolo "Visto" fa salire di grado
  // (il caricamento dei salvataggi o un import Excel non la fanno partire).
  const [prev, setPrev] = useState({ watched: s.watched, rank: s.rankIndex });
  const [celebrating, setCelebrating] = useState(false);
  if (prev.watched !== s.watched) {
    if (s.watched === prev.watched + 1 && s.rankIndex > prev.rank) {
      setCelebrating(true);
    }
    setPrev({ watched: s.watched, rank: s.rankIndex });
  }
  useEffect(() => {
    if (!celebrating) return;
    const t = window.setTimeout(() => setCelebrating(false), 2600);
    return () => window.clearTimeout(t);
  }, [celebrating]);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/75 p-5 shadow-xl cinematic-blur sm:p-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#E21B24]/20 blur-3xl"
      />
      {celebrating && (
        <div
          role="status"
          className="rank-banner pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center"
        >
          <span
            className="mt-2 flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white"
            style={{
              borderColor: s.rank.color,
              backgroundColor: `${s.rank.color}33`,
              boxShadow: `0 0 24px ${s.rank.color}99`,
            }}
          >
            <RankBadge rank={s.rank} celebrate={false} size={22} />
            {it ? "Nuovo grado" : "New rank"}: {s.rank[locale]}
          </span>
        </div>
      )}
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-end gap-5">
            <div className="leading-none">
              <span
                className="text-7xl font-black tracking-tighter text-white sm:text-8xl"
                style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
              >
                {s.pct}
              </span>
              <span className="text-3xl font-black text-[#E21B24]">%</span>
            </div>
            <div className="pb-2">
              <div className="flex items-center gap-2.5">
                <RankBadge rank={s.rank} celebrate={celebrating} />
                <p
                  className="text-[11px] font-bold uppercase tracking-widest"
                  style={{ color: s.rank.color }}
                >
                  {it ? "Grado" : "Rank"}: {s.rank[locale]}
                </p>
              </div>
              <p className="mt-1 text-sm font-semibold text-neutral-300">
                <span className="font-extrabold text-white">{s.watched}</span> /{" "}
                {s.total} {it ? "titoli visti" : "titles watched"}
              </p>
            </div>
          </div>
          <ShareRankButton entries={entries} locale={locale} />
        </div>

        <div className="flex-1 space-y-2.5">
          <p className="text-sm font-semibold text-neutral-200">
            {motivation(s, locale)}
          </p>
          <SagaBar pct={s.pct} locale={locale} />
        </div>

        <div className="lg:w-80">
          <NextUp
            entry={s.next}
            locale={locale}
            onToggleWatch={onToggleWatch}
            onOpenDetail={onOpenDetail}
          />
        </div>
      </div>
    </section>
  );
};
