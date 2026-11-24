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
import { bebasNeue } from "@/app/fonts";
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
    <div className="flex w-full items-center gap-4 rounded-xl border border-white/10 bg-neutral-900/70 p-3 pr-4">
      <button
        type="button"
        onClick={() => onOpenDetail(entry)}
        className="relative aspect-2/3 w-[84px] shrink-0 overflow-hidden rounded-lg border border-white/10"
        aria-label={entry.title[locale]}
      >
        <Image
          src={entry.posterUrl}
          alt=""
          fill
          sizes="84px"
          className="object-cover"
        />
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#E21B24]">
          {it ? "Prossimo da vedere" : "Up next"}
        </p>
        <p className="mt-1 truncate text-base font-extrabold text-white">
          {entry.title[locale]}
        </p>
        <p className="text-xs font-medium text-neutral-400">
          {formatPhase(entry.phase, locale)} · {entry.releaseYear}
        </p>
        <button
          type="button"
          onClick={() => onToggleWatch(entry.id)}
          className="mt-3 flex items-center gap-1.5 rounded-lg bg-[#E21B24] px-3 py-2 text-xs font-bold text-white shadow-[0_0_14px_rgba(226,27,36,0.55)] transition-all hover:brightness-110"
        >
          <Check size={14} aria-hidden="true" />
          <span>{it ? "Visto" : "Watched"}</span>
        </button>
      </div>
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

/** Percentuale grande: numero sfumato bianco→rosso con bagliore, "%" in alto. */
export const BigPercent: React.FC<{ pct: number; large?: boolean }> = ({
  pct,
  large,
}) => (
  <div className="flex items-end leading-[0.85]">
    <span
      className={`font-black tracking-tighter text-white [text-shadow:0_0_40px_rgba(226,27,36,0.35)] ${
        large ? "text-8xl" : "text-8xl lg:text-[150px]"
      }`}
      style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
    >
      {pct}
    </span>
    <span className={`font-black text-[#E21B24] ${large ? "text-4xl" : "text-4xl lg:text-5xl"}`}>
      %
    </span>
  </div>
);

/**
 * Barra a 5 segmenti, uno per grado, con lo stemma di ogni grado sotto.
 * Gradi superati: stemma acceso. Grado attuale: posto vuoto (lo stemma è salito accanto a "Grado").
 * Gradi futuri: stemma spento.
 */
export const RankSegmentsBar: React.FC<{
  pct: number;
  rankIndex: number;
  locale: SupportedLocale;
}> = ({ pct, rankIndex, locale }) => {
  const it = locale === "it";
  return (
    <div
      className="grid w-full grid-cols-5 gap-1.5"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={it ? "Progresso saga" : "Saga progress"}
    >
      {RANKS.map((rank, i) => {
        const lo = rank.min;
        const hi = RANKS[i + 1]?.min ?? 100;
        const fill = Math.max(0, Math.min(1, (pct - lo) / (hi - lo)));
        const passed = i < rankIndex;
        const current = i === rankIndex;
        return (
          <div key={rank.it}>
            <div className="h-3 overflow-hidden rounded border border-white/[0.07] bg-neutral-900">
              <div
                className="h-full bg-linear-to-r from-[#8B0000] to-[#E21B24] shadow-[0_0_12px_rgba(226,27,36,0.65)] transition-all duration-1000 ease-out"
                style={{ width: `${fill * 100}%` }}
              />
            </div>
            <div className="mt-1.5 flex h-6 justify-center">
              {!current && (
                // eslint-disable-next-line @next/next/no-img-element -- stemma piccolo
                <img
                  src={rank.icon}
                  alt=""
                  title={rank[locale]}
                  className="h-6 w-6 object-contain transition-all duration-500"
                  style={
                    passed
                      ? { filter: `drop-shadow(0 0 4px ${rank.color})` }
                      : { opacity: 0.25, filter: "grayscale(1)" }
                  }
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
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
              // Colori tenui: il grado al 60%, le tappe future quasi invisibili
              backgroundColor:
                pct >= m ? `${rankAt(m).color}99` : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
      <div className="relative mt-1.5 h-4 text-[10px] font-bold">
        {MILESTONES.map((m) => (
          <span
            key={m}
            className="absolute -translate-x-1/2"
            style={{
              left: `${m}%`,
              color: pct >= m ? `${rankAt(m).color}99` : "rgba(255,255,255,0.25)",
            }}
          >
            {m}%
          </span>
        ))}
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
  // (il caricamento dei salvataggi o la sincronizzazione non la fanno partire).
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
          className="rank-banner pointer-events-none absolute inset-x-0 top-2 z-10 flex justify-center lg:inset-x-auto lg:left-5 lg:top-auto lg:bottom-3 lg:justify-start"
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
      <div className="relative grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[auto_1fr_340px] lg:gap-8">
        {/* Sinistra: percentuale */}
        <div className="flex items-center justify-center lg:justify-start">
          <BigPercent pct={s.pct} />
        </div>

        {/* Centro: grado, frase, barra a segmenti, condividi */}
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-3">
            <span
              className={`${bebasNeue.className} text-xl tracking-wider text-neutral-400`}
            >
              {it ? "Grado" : "Rank"}
            </span>
            <span key={s.rankIndex} className={celebrating ? "rank-rise" : ""}>
              <RankBadge rank={s.rank} celebrate={celebrating} size={46} />
            </span>
            <span
              className={`${bebasNeue.className} text-3xl uppercase tracking-wider`}
              style={{ color: s.rank.color, textShadow: `0 0 14px ${s.rank.color}99` }}
            >
              {s.rank[locale]}
            </span>
          </div>
          <p className="text-sm font-semibold text-neutral-200">{motivation(s, locale)}</p>
          <div className="w-full max-w-[520px]">
            <RankSegmentsBar pct={s.pct} rankIndex={s.rankIndex} locale={locale} />
          </div>
          <ShareRankButton entries={entries} locale={locale} />
        </div>

        {/* Destra: prossimo da vedere */}
        <div className="flex">
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
