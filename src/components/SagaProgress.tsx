"use client";

import { Check, Play, Trophy } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useMemo } from "react";
import type { MCUEntry, MCUPhase, SupportedLocale } from "@/types/mcu";
import { formatPhase } from "@/utils/phase";

export type SagaProgressVariant = "a" | "b" | "c";

interface SagaProgressProps {
  entries: MCUEntry[];
  phases: MCUPhase[];
  locale: SupportedLocale;
  variant: SagaProgressVariant;
  onToggleWatch: (id: string) => void;
  onOpenDetail: (entry: MCUEntry) => void;
}

/** Gradi in base alla percentuale: danno un motivo per salire di livello. */
const RANKS: { min: number; it: string; en: string }[] = [
  { min: 0, it: "Civile", en: "Civilian" },
  { min: 10, it: "Recluta", en: "Recruit" },
  { min: 25, it: "Agente", en: "Agent" },
  { min: 50, it: "Eroe", en: "Hero" },
  { min: 75, it: "Vendicatore", en: "Avenger" },
  { min: 100, it: "Leggenda", en: "Legend" },
];

const MILESTONES = [25, 50, 75, 100];

function useSagaStats(entries: MCUEntry[], phases: MCUPhase[]) {
  return useMemo(() => {
    const total = entries.length;
    const watched = entries.filter((e) => e.watched).length;
    const pct = total > 0 ? Math.round((watched / total) * 100) : 0;
    const timeline = [...entries].sort(
      (a, b) => a.timelineOrder - b.timelineOrder,
    );
    const next = timeline.find((e) => !e.watched) ?? null;
    const rankIndex = RANKS.findLastIndex((r) => pct >= r.min);
    const rank = RANKS[rankIndex];
    const nextRank = RANKS[rankIndex + 1] ?? null;
    const toNextRank = nextRank
      ? Math.max(1, Math.ceil((nextRank.min / 100) * total) - watched)
      : 0;
    const byPhase = phases.map((phase) => {
      const list = entries.filter((e) => e.phase === phase);
      const done = list.filter((e) => e.watched).length;
      return { phase, done, total: list.length };
    });
    return {
      total,
      watched,
      pct,
      timeline,
      next,
      rank,
      nextRank,
      toNextRank,
      byPhase,
    };
  }, [entries, phases]);
}

type Stats = ReturnType<typeof useSagaStats>;

/** Frase che cambia col progresso: spinge a guardare il prossimo titolo. */
function motivation(s: Stats, locale: SupportedLocale): string {
  const it = locale === "it";
  if (s.watched === 0)
    return it
      ? "Il multiverso ti aspetta. Inizia dal primo titolo."
      : "The multiverse is waiting. Start with the first title.";
  if (s.pct === 100)
    return it
      ? "Saga completata. Sei una leggenda."
      : "Saga complete. You are a legend.";
  if (s.nextRank)
    return it
      ? `Ancora ${s.toNextRank} ${s.toNextRank === 1 ? "titolo" : "titoli"} per diventare ${s.nextRank.it}.`
      : `${s.toNextRank} more ${s.toNextRank === 1 ? "title" : "titles"} to become ${s.nextRank.en}.`;
  return "";
}

const NextUp: React.FC<{
  entry: MCUEntry | null;
  locale: SupportedLocale;
  onToggleWatch: (id: string) => void;
  onOpenDetail: (entry: MCUEntry) => void;
  compact?: boolean;
}> = ({ entry, locale, onToggleWatch, onOpenDetail, compact }) => {
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
        {!compact && (
          <p className="text-[11px] font-medium text-neutral-400">
            {formatPhase(entry.phase, locale)} · {entry.releaseYear}
          </p>
        )}
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

/* ───────── A · HERO: numero gigante, grado, traguardi ───────── */
const VariantHero: React.FC<{ s: Stats } & Omit<SagaProgressProps, "variant" | "entries" | "phases">> = ({
  s,
  locale,
  onToggleWatch,
  onOpenDetail,
}) => {
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
          <div className="relative pt-1 pb-5">
            <div
              className="h-4 w-full overflow-hidden rounded-full border border-white/10 bg-neutral-900 p-0.5"
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
            </div>
            {MILESTONES.map((m) => {
              const reached = s.pct >= m;
              return (
                <div
                  key={m}
                  className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
                  style={{ left: `${m === 100 ? 99 : m}%` }}
                >
                  <span
                    className={`h-6 w-0.5 rounded ${reached ? "bg-[#F2A900]" : "bg-white/25"}`}
                  />
                  <span
                    className={`mt-0.5 text-[10px] font-bold ${reached ? "text-[#F2A900]" : "text-neutral-500"}`}
                  >
                    {m}%
                  </span>
                </div>
              );
            })}
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

/* ───────── B · FASI: una barra per ogni fase ───────── */
const VariantPhases: React.FC<{ s: Stats } & Omit<SagaProgressProps, "variant" | "entries" | "phases">> = ({
  s,
  locale,
  onToggleWatch,
  onOpenDetail,
}) => {
  const it = locale === "it";
  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-950/75 p-5 shadow-xl cinematic-blur sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
            {it ? "Progresso Saga" : "Saga Completion"}
          </p>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{s.pct}%</span>
            <span className="text-sm font-semibold text-neutral-400">
              {s.watched}/{s.total} · {s.rank[locale]}
            </span>
          </p>
          <p className="mt-1 text-xs font-medium text-neutral-300">
            {motivation(s, locale)}
          </p>
        </div>
        <div className="md:w-96">
          <NextUp
            entry={s.next}
            locale={locale}
            onToggleWatch={onToggleWatch}
            onOpenDetail={onOpenDetail}
            compact
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {s.byPhase.map(({ phase, done, total }) => {
          const p = total > 0 ? Math.round((done / total) * 100) : 0;
          const complete = done === total && total > 0;
          return (
            <div
              key={phase}
              className={`rounded-xl border p-3 transition-all ${
                complete
                  ? "border-[#F2A900]/60 bg-[#F2A900]/10 shadow-[0_0_18px_rgba(242,169,0,0.25)]"
                  : "border-white/10 bg-neutral-900/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-extrabold ${complete ? "text-[#F2A900]" : "text-white"}`}
                >
                  {formatPhase(phase, locale)}
                </span>
                {complete && (
                  <Trophy size={14} className="text-[#F2A900]" aria-hidden="true" />
                )}
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-800">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    complete
                      ? "bg-[#F2A900]"
                      : "bg-linear-to-r from-[#8B0000] to-[#E21B24]"
                  }`}
                  style={{ width: `${p}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] font-semibold text-neutral-400">
                {done}/{total}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* ───────── C · MOSAICO: 57 locandine che si accendono ───────── */
const VariantMosaic: React.FC<{ s: Stats } & Omit<SagaProgressProps, "variant" | "entries" | "phases">> = ({
  s,
  locale,
  onToggleWatch,
  onOpenDetail,
}) => {
  const it = locale === "it";
  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-950/75 p-4 shadow-xl cinematic-blur sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
            {it ? "La tua saga" : "Your saga"}
          </p>
          <p className="mt-1 text-2xl font-black text-white">
            {s.watched}
            <span className="text-neutral-500">/{s.total}</span>{" "}
            <span className="text-[#E21B24]">{s.pct}%</span>
          </p>
          <p className="text-xs font-medium text-neutral-300">
            {motivation(s, locale)}
          </p>
        </div>
        {s.next && (
          <button
            type="button"
            onClick={() => onToggleWatch(s.next!.id)}
            className="flex items-center gap-2 self-start rounded-lg bg-[#E21B24] px-3.5 py-2 text-xs font-bold text-white shadow-[0_0_14px_rgba(226,27,36,0.55)] hover:brightness-110 sm:self-auto"
          >
            <Play size={14} aria-hidden="true" />
            <span className="max-w-56 truncate">
              {it ? "Visto: " : "Watched: "}
              {s.next.title[locale]}
            </span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-10 gap-1 sm:grid-cols-[repeat(19,minmax(0,1fr))] sm:gap-1.5">
        {s.timeline.map((e) => {
          const isNext = s.next?.id === e.id;
          return (
            <button
              type="button"
              key={e.id}
              onClick={() => onOpenDetail(e)}
              title={e.title[locale]}
              aria-label={`${e.title[locale]}${e.watched ? (it ? " (visto)" : " (watched)") : ""}`}
              className={`relative aspect-2/3 overflow-hidden rounded-[3px] transition-all duration-500 hover:z-10 hover:scale-125 ${
                e.watched
                  ? "ring-1 ring-[#E21B24]/70 shadow-[0_0_10px_rgba(226,27,36,0.45)]"
                  : isNext
                    ? "ring-2 ring-white animate-pulse"
                    : "opacity-35 grayscale"
              }`}
            >
              <Image
                src={e.posterUrl}
                alt=""
                fill
                sizes="60px"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-neutral-900">
        <div
          className="h-full rounded-full bg-linear-to-r from-[#8B0000] via-[#E21B24] to-[#FF4D4D] transition-all duration-1000"
          style={{ width: `${s.pct}%` }}
        />
      </div>
    </section>
  );
};

export const SagaProgress: React.FC<SagaProgressProps> = (props) => {
  const s = useSagaStats(props.entries, props.phases);
  const shared = {
    s,
    locale: props.locale,
    onToggleWatch: props.onToggleWatch,
    onOpenDetail: props.onOpenDetail,
  };
  if (props.variant === "b") return <VariantPhases {...shared} />;
  if (props.variant === "c") return <VariantMosaic {...shared} />;
  return <VariantHero {...shared} />;
};
