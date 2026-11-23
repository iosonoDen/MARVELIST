"use client";

import { Check, Trophy } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useMemo } from "react";
import type { MCUEntry, SupportedLocale } from "@/types/mcu";
import { formatPhase } from "@/utils/phase";

interface SagaProgressProps {
  entries: MCUEntry[];
  locale: SupportedLocale;
  onToggleWatch: (id: string) => void;
  onOpenDetail: (entry: MCUEntry) => void;
}

/** 4 gradi, uno per ogni quarto della saga: 0–25, 25–50, 50–75, 75–100%. */
const RANKS: { min: number; it: string; en: string }[] = [
  { min: 0, it: "Recluta", en: "Recruit" },
  { min: 25, it: "Agente", en: "Agent" },
  { min: 50, it: "Eroe", en: "Hero" },
  { min: 75, it: "Vendicatore", en: "Avenger" },
];

/** Tappe disegnate dentro la barra (100% è la fine della barra stessa). */
const MILESTONES = [25, 50, 75];

function useSagaStats(entries: MCUEntry[]) {
  return useMemo(() => {
    const total = entries.length;
    const watched = entries.filter((e) => e.watched).length;
    // Percentuale esatta per il grado; arrotondata per difetto per il numero
    // a schermo, così "25%" compare solo quando il grado Agente è davvero raggiunto.
    const exact = total > 0 ? (watched / total) * 100 : 0;
    const pct = Math.floor(exact);

    // Prossimo da vedere: il primo titolo non visto in ordine di timeline.
    const next =
      [...entries]
        .sort((a, b) => a.timelineOrder - b.timelineOrder)
        .find((e) => !e.watched) ?? null;

    const rankIndex = RANKS.findLastIndex((r) => exact >= r.min);
    const rank = RANKS[rankIndex];
    const nextRank = RANKS[rankIndex + 1] ?? null;
    // Titoli che mancano al grado successivo.
    const toNextRank = nextRank
      ? Math.ceil((nextRank.min / 100) * total) - watched
      : 0;

    return { total, watched, pct, next, rank, nextRank, toNextRank };
  }, [entries]);
}

type Stats = ReturnType<typeof useSagaStats>;

/** Frase che cambia col progresso: spinge a guardare il prossimo titolo. */
function motivation(s: Stats, locale: SupportedLocale): string {
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
    return it
      ? `Ancora ${n} ${n === 1 ? "titolo" : "titoli"} per diventare ${s.nextRank.it}.`
      : `${n} more ${n === 1 ? "title" : "titles"} to become ${s.nextRank.en}.`;
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

export const SagaProgress: React.FC<SagaProgressProps> = ({
  entries,
  locale,
  onToggleWatch,
  onOpenDetail,
}) => {
  const s = useSagaStats(entries);
  const it = locale === "it";

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/75 p-5 shadow-xl cinematic-blur sm:p-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#E21B24]/20 blur-3xl"
      />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
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
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#F2A900]">
              <Trophy size={13} aria-hidden="true" />
              {it ? "Grado" : "Rank"}: {s.rank[locale]}
            </p>
            <p className="mt-1 text-sm font-semibold text-neutral-300">
              <span className="font-extrabold text-white">{s.watched}</span> /{" "}
              {s.total} {it ? "titoli visti" : "titles watched"}
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-2.5">
          <p className="text-sm font-semibold text-neutral-200">
            {motivation(s, locale)}
          </p>
          <div className="pt-1">
            <div
              className="relative h-4 w-full overflow-hidden rounded-full border border-white/10 bg-neutral-900 p-0.5"
              role="progressbar"
              aria-valuenow={s.pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={it ? "Progresso saga" : "Saga progress"}
            >
              <div
                className="relative h-full rounded-full bg-linear-to-r from-[#8B0000] via-[#E21B24] to-[#FF4D4D] shadow-[0_0_18px_rgba(226,27,36,0.9)] transition-all duration-1000 ease-out"
                style={{ width: `${Math.max(s.pct, 2)}%` }}
              >
                <span className="absolute inset-0 animate-pulse rounded-full bg-white/15" />
              </div>
              {/* Tappe: linee sottili che restano dentro la barra */}
              {MILESTONES.map((m) => (
                <span
                  key={m}
                  aria-hidden="true"
                  className={`absolute inset-y-0.5 w-px -translate-x-1/2 ${
                    s.pct >= m ? "bg-[#F2A900]" : "bg-white/20"
                  }`}
                  style={{ left: `${m}%` }}
                />
              ))}
            </div>
            <div className="relative mt-1.5 h-4 text-[10px] font-bold">
              {[...MILESTONES, 100].map((m) => (
                <span
                  key={m}
                  className={`absolute ${
                    m === 100 ? "right-0" : "-translate-x-1/2"
                  } ${s.pct >= m ? "text-[#F2A900]" : "text-neutral-500"}`}
                  style={m === 100 ? undefined : { left: `${m}%` }}
                >
                  {m}%
                </span>
              ))}
            </div>
          </div>
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
