"use client";

import { Calendar, Clock, LayoutGrid, List, Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { CinematicBackground } from "@/components/CinematicBackground";
import { DetailModal } from "@/components/DetailModal";
import { GlobalProgressHeader } from "@/components/GlobalProgressHeader";
import { MCUCard } from "@/components/MCUCard";
import { MCUListItem } from "@/components/MCUListItem";
import { useAuth } from "@clerk/nextjs";
import { ChallengeBanner } from "@/components/ChallengeBanner";
import { SiteFooter } from "@/components/SiteFooter";
import { UserMenu } from "@/components/UserMenu";
import { useCloudSync } from "@/hooks/useCloudSync";
import { RANKS, sagaProgress } from "@/lib/saga";
import { SagaProgress } from "@/components/SagaProgress";
import { INITIAL_MCU_DATABASE, MCU_PHASES } from "@/data/mcu-canon";
import { useViewMode, type ViewMode } from "@/hooks/useViewMode";
import { useWatchlistStorage } from "@/hooks/useWatchlistStorage";
import type { FilterStatus, FilterType, MCUEntry, SortMode } from "@/types/mcu";
import { formatPhase } from "@/utils/phase";
import { matchesUniverse, UNIVERSE_OPTIONS, type UniverseFilter } from "@/utils/universe";

const NUDGE_AT = 3;
const NUDGE_FLAG = "marvelist:login-nudge:v1";
const readFlag = (k: string) => {
  try {
    return window.localStorage.getItem(k) === "1";
  } catch {
    return false;
  }
};
const writeFlag = (k: string) => {
  try {
    window.localStorage.setItem(k, "1");
  } catch {
    /* storage non disponibile: l'avviso potrà ricomparire */
  }
};

interface WatchlistAppProps {
  /** Progresso dell'amico che ha condiviso il link /s/… (mostra il banner sfida). */
  challenge?: { watched: number; total: number } | null;
}

export function WatchlistApp({ challenge = null }: WatchlistAppProps) {
  const { entries, setEntries, locale, setLocale, hydrated } =
    useWatchlistStorage(INITIAL_MCU_DATABASE);
  const { isSignedIn } = useAuth();
  const syncStatus = useCloudSync(entries, setEntries, hydrated);
  const { viewMode, setViewMode } = useViewMode();
  const [sortMode, setSortMode] = useState<SortMode>("timeline");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [selectedUniverse, setSelectedUniverse] = useState<UniverseFilter>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeEntry, setActiveEntry] = useState<MCUEntry | null>(null);

  // Avviso "Hai segnato 3 titoli!": una sola volta, solo senza account,
  // solo quando un singolo "Visto" porta a 3 (non al caricamento o all'import).
  const watchedCount = entries.filter((e) => e.watched).length;
  const [prevWatched, setPrevWatched] = useState(watchedCount);
  const [nudgeCount, setNudgeCount] = useState<number | null>(null);
  if (prevWatched !== watchedCount) {
    if (
      hydrated &&
      isSignedIn === false &&
      prevWatched === NUDGE_AT - 1 &&
      watchedCount === NUDGE_AT &&
      !readFlag(NUDGE_FLAG)
    ) {
      writeFlag(NUDGE_FLAG);
      setNudgeCount(watchedCount);
    }
    setPrevWatched(watchedCount);
  }
  const closeNudge = useCallback(() => setNudgeCount(null), []);


  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => {
        if (filterType !== "all" && entry.type !== filterType) return false;
        if (filterStatus === "watched" && !entry.watched) return false;
        if (filterStatus === "unwatched" && entry.watched) return false;
        if (selectedPhase !== "all" && entry.phase !== selectedPhase)
          return false;
        if (!matchesUniverse(entry.universe, selectedUniverse)) return false;
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const matchTitle = entry.title[locale].toLowerCase().includes(q);
          const matchYear =
            entry.timelineYear.toLowerCase().includes(q) ||
            entry.releaseYear.toString().includes(q);
          if (!matchTitle && !matchYear) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortMode === "timeline") {
          return a.timelineOrder - b.timelineOrder;
        }
        return (
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
        );
      });
  }, [
    entries,
    filterType,
    filterStatus,
    selectedPhase,
    selectedUniverse,
    searchQuery,
    sortMode,
    locale,
  ]);

  const handleToggleWatch = (id: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, watched: !e.watched } : e)),
    );
    if (activeEntry && activeEntry.id === id) {
      setActiveEntry((prev) =>
        prev ? { ...prev, watched: !prev.watched } : null,
      );
    }
  };

  const handleRate = (id: string, rating: number) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, rating } : e)));
    if (activeEntry && activeEntry.id === id) {
      setActiveEntry((prev) => (prev ? { ...prev, rating } : null));
    }
  };

  return (
    <div className="relative min-h-screen text-neutral-100 selection:bg-[#E21B24] selection:text-white font-sans">
      <CinematicBackground videoSrc="/Marvel-Opening-Theme.mp4" />

      <GlobalProgressHeader
        locale={locale}
        onToggleLocale={() =>
          setLocale((prev) => (prev === "it" ? "en" : "it"))
        }
        userSlot={
          <UserMenu
            locale={locale}
            syncStatus={syncStatus}
            nudgeCount={nudgeCount}
            onNudgeClose={closeNudge}
          />
        }
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {challenge && <ChallengeBanner challenge={challenge} locale={locale} />}

        <SagaProgress
          entries={entries}
          locale={locale}
          onToggleWatch={handleToggleWatch}
          onOpenDetail={setActiveEntry}
        />

        <section className="p-4 sm:p-6 rounded-2xl bg-neutral-950/70 border border-white/10 cinematic-blur space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
                size={16}
              />
              <input
                type="text"
                placeholder={
                  locale === "it"
                    ? "Cerca titolo o anno..."
                    : "Search title or year..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900/80 border border-white/10 focus:border-[#E21B24] focus:outline-none text-xs text-white placeholder-neutral-500 transition-all font-medium"
              />
            </div>

            <div className="flex w-full flex-wrap items-center justify-center gap-3 md:w-auto md:flex-nowrap">
              <div className="flex flex-1 items-center justify-center gap-1.5 p-1 rounded-xl bg-neutral-900/80 border border-white/10 text-xs md:flex-none">
                <button
                  type="button"
                  onClick={() => setSortMode("timeline")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all text-xs font-bold ${
                    sortMode === "timeline"
                      ? "bg-[#E21B24] text-white shadow-[0_0_12px_rgba(226,27,36,0.6)]"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Clock size={14} />
                  <span>
                    {locale === "it" ? "Timeline Canonica" : "MCU Timeline"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSortMode("release")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all text-xs font-bold ${
                    sortMode === "release"
                      ? "bg-[#E21B24] text-white shadow-[0_0_12px_rgba(226,27,36,0.6)]"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Calendar size={14} />
                  <span>
                    {locale === "it" ? "Data di Uscita" : "Release Date"}
                  </span>
                </button>
              </div>

              <fieldset
  aria-label={
    locale === "it" ? "Modalità di visualizzazione" : "View mode"
  }
  className="flex items-center gap-1 rounded-xl border border-white/10 bg-neutral-900/80 p-1"
>
                {(["grid", "list"] as ViewMode[]).map((mode) => {
                  const Icon = mode === "grid" ? LayoutGrid : List;
                  const label =
                    mode === "grid"
                      ? locale === "it"
                        ? "Griglia"
                        : "Grid"
                      : locale === "it"
                        ? "Lista"
                        : "List";
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setViewMode(mode)}
                      aria-pressed={viewMode === mode}
                      aria-label={label}
                      title={label}
                      className={`rounded-lg p-2 transition-all ${
                        viewMode === mode
                          ? "bg-[#E21B24] text-white shadow-[0_0_12px_rgba(226,27,36,0.6)]"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      <Icon size={16} aria-hidden="true" />
                    </button>
                  );
                })}
              </fieldset>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              {(["all", "movie", "series"] as FilterType[]).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterType === type
                      ? "bg-neutral-800 text-white border border-white/20 shadow-sm"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  {type === "all" && (locale === "it" ? "Tutti" : "All")}
                  {type === "movie" && (locale === "it" ? "Film" : "Movies")}
                  {type === "series" &&
                    (locale === "it" ? "Serie TV" : "TV Series")}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              {(["all", "watched", "unwatched"] as FilterStatus[]).map(
                (status) => (
                  <button
                    type="button"
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      filterStatus === status
                        ? "bg-neutral-800 text-white border border-white/20 shadow-sm"
                        : "text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    {status === "all" &&
                      (locale === "it" ? "Tutti gli stati" : "All Status")}
                    {status === "watched" &&
                      (locale === "it" ? "Visti" : "Watched")}
                    {status === "unwatched" &&
                      (locale === "it" ? "Da Vedere" : "Unwatched")}
                  </button>
                ),
              )}
            </div>

            <div className="flex items-center gap-2">
            <select
              value={selectedUniverse}
              onChange={(e) => setSelectedUniverse(e.target.value as UniverseFilter)}
              aria-label={locale === "it" ? "Universo" : "Universe"}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-neutral-200 text-xs font-semibold focus:border-[#E21B24] focus:outline-none"
            >
              {UNIVERSE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o[locale]}
                </option>
              ))}
            </select>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-neutral-200 text-xs font-semibold focus:border-[#E21B24] focus:outline-none"
            >
              <option value="all">
                {locale === "it" ? "Tutte le Fasi" : "All Phases"}
              </option>
              {MCU_PHASES.map((phase) => (
                <option key={phase} value={phase}>
                  {formatPhase(phase, locale)}
                </option>
              ))}
            </select>
            </div>
          </div>
        </section>

        <section>
          {filteredEntries.length === 0 ? (
            <div className="py-24 text-center rounded-2xl bg-neutral-950/40 border border-white/5 cinematic-blur">
              <p className="text-neutral-400 text-sm font-medium">
                {locale === "it"
                  ? "Nessun film o serie trovato con i criteri selezionati."
                  : "No entries found matching the active criteria."}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {filteredEntries.map((entry) => (
                <MCUCard
                  key={entry.id}
                  entry={entry}
                  locale={locale}
                  sortMode={sortMode}
                  onOpenDetail={setActiveEntry}
                  onToggleWatch={handleToggleWatch}
                  onRate={handleRate}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {filteredEntries.map((entry) => (
                <MCUListItem
                  key={entry.id}
                  entry={entry}
                  locale={locale}
                  sortMode={sortMode}
                  onOpenDetail={setActiveEntry}
                  onToggleWatch={handleToggleWatch}
                  onRate={handleRate}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter
        locale={locale}
        postCreditsUnlocked={sagaProgress(watchedCount, entries.length).rankIndex === RANKS.length - 1}
        watched={watchedCount}
        total={entries.length}
      />

      <DetailModal
        entry={activeEntry}
        isOpen={Boolean(activeEntry)}
        locale={locale}
        onClose={() => setActiveEntry(null)}
        onToggleWatch={handleToggleWatch}
        onRate={handleRate}
      />
    </div>
  );
}