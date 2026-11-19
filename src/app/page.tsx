'use client';

import React, { useState, useMemo, useRef } from 'react';
import { INITIAL_MCU_DATABASE, MCU_PHASES } from '@/data/mcu-canon';
import { useWatchlistStorage } from '@/hooks/useWatchlistStorage';
import { MCUEntry, SortMode, FilterType, FilterStatus } from '@/types/mcu';
import { CinematicBackground } from '@/components/CinematicBackground';
import { GlobalProgressHeader } from '@/components/GlobalProgressHeader';
import { DetailModal } from '@/components/DetailModal';
import { MCUCard } from '@/components/MCUCard';
import { exportToMCUExcel, parseMCUExcel } from '@/utils/excel-sync';
import { Search, Clock, Calendar } from 'lucide-react';

export default function MCUWatchlistApp() {
  const { entries, setEntries, locale, setLocale } = useWatchlistStorage(INITIAL_MCU_DATABASE);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('timeline');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeEntry, setActiveEntry] = useState<MCUEntry | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const watchedCount = useMemo(() => entries.filter((e) => e.watched).length, [entries]);
  const totalCount = entries.length;

  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => {
        if (filterType !== 'all' && entry.type !== filterType) return false;
        if (filterStatus === 'watched' && !entry.watched) return false;
        if (filterStatus === 'unwatched' && entry.watched) return false;
        if (selectedPhase !== 'all' && entry.phase !== selectedPhase) return false;
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchTitle = entry.title[locale].toLowerCase().includes(q);
          const matchYear = entry.timelineYear.toLowerCase().includes(q) || entry.releaseYear.toString().includes(q);
          if (!matchTitle && !matchYear) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortMode === 'timeline') {
          return a.timelineOrder - b.timelineOrder;
        }
        return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
      });
  }, [entries, filterType, filterStatus, selectedPhase, searchQuery, sortMode, locale]);

  const handleToggleWatch = (id: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, watched: !e.watched } : e))
    );
    if (activeEntry && activeEntry.id === id) {
      setActiveEntry((prev) => (prev ? { ...prev, watched: !prev.watched } : null));
    }
  };

  const handleRate = (id: string, rating: number) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, rating } : e))
    );
    if (activeEntry && activeEntry.id === id) {
      setActiveEntry((prev) => (prev ? { ...prev, rating } : null));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { entries: merged, matched } = await parseMCUExcel(file, entries);
      setEntries(merged);
      setImportMessage(
        locale === 'it' ? `Import completato: ${matched} titoli aggiornati.` : `Import complete: ${matched} titles updated.`
      );
    } catch (err) {
      console.error('Errore import Excel:', err);
      setImportMessage(locale === 'it' ? 'Errore: file Excel non valido.' : 'Error: invalid Excel file.');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="relative min-h-screen text-neutral-100 selection:bg-[#E21B24] selection:text-white font-sans">
      <CinematicBackground videoSrc="/Marvel-Opening-Theme.mp4" />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".xlsx, .xls"
        className="hidden"
      />

      <GlobalProgressHeader
        totalCount={totalCount}
        watchedCount={watchedCount}
        locale={locale}
        onToggleLocale={() => setLocale((prev) => (prev === 'it' ? 'en' : 'it'))}
        onExportXLSX={() => exportToMCUExcel(entries)}
        onTriggerImport={() => fileInputRef.current?.click()}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="p-4 sm:p-6 rounded-2xl bg-neutral-950/60 border border-white/10 cinematic-blur space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
              <input
                type="text"
                placeholder={locale === 'it' ? 'Cerca titolo o anno...' : 'Search title or year...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-900/80 border border-white/10 focus:border-[#E21B24] focus:outline-none text-xs font-mono text-white placeholder-neutral-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-900/80 border border-white/10 text-xs font-mono w-full md:w-auto justify-center">
              <button
                onClick={() => setSortMode('timeline')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  sortMode === 'timeline'
                    ? 'bg-[#E21B24] text-white font-bold shadow-[0_0_12px_rgba(226,27,36,0.6)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Clock size={13} />
                <span>{locale === 'it' ? 'Timeline Canonica' : 'MCU Timeline'}</span>
              </button>
              <button
                onClick={() => setSortMode('release')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  sortMode === 'release'
                    ? 'bg-[#E21B24] text-white font-bold shadow-[0_0_12px_rgba(226,27,36,0.6)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Calendar size={13} />
                <span>{locale === 'it' ? 'Data di Uscita' : 'Release Date'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-1">
              {(['all', 'movie', 'series'] as FilterType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    filterType === type
                      ? 'bg-neutral-800 text-white border border-white/20 font-bold'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {type === 'all' && (locale === 'it' ? 'Tutti' : 'All')}
                  {type === 'movie' && (locale === 'it' ? 'Solo Film' : 'Movies')}
                  {type === 'series' && (locale === 'it' ? 'Solo Serie TV' : 'TV Series')}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              {(['all', 'watched', 'unwatched'] as FilterStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    filterStatus === status
                      ? 'bg-neutral-800 text-white border border-white/20 font-bold'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {status === 'all' && (locale === 'it' ? 'Tutti gli stati' : 'All Status')}
                  {status === 'watched' && (locale === 'it' ? 'Visti' : 'Watched')}
                  {status === 'unwatched' && (locale === 'it' ? 'Da Vedere' : 'Unwatched')}
                </button>
              ))}
            </div>

            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="px-2.5 py-1 rounded-md bg-neutral-900 border border-white/10 text-neutral-300 text-xs font-mono focus:border-[#E21B24] focus:outline-none"
            >
              <option value="all">{locale === 'it' ? 'Tutte le Fasi' : 'All Phases'}</option>
              {MCU_PHASES.map((phase) => (
                <option key={phase} value={phase}>{phase}</option>
              ))}
            </select>
          </div>
        </section>

        {importMessage && (
          <div role="status" className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-neutral-950/70 border border-white/10 text-xs font-mono text-neutral-200">
            <span>{importMessage}</span>
            <button type="button" onClick={() => setImportMessage(null)} className="text-neutral-400 hover:text-white" aria-label="Chiudi">✕</button>
          </div>
        )}

        <section>
          {filteredEntries.length === 0 ? (
            <div className="py-24 text-center rounded-2xl bg-neutral-950/40 border border-white/5 cinematic-blur">
              <p className="text-neutral-400 font-mono text-sm">
                {locale === 'it' ? 'Nessun film o serie trovato con i criteri selezionati.' : 'No entries found matching the active criteria.'}
              </p>
            </div>
          ) : (
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
          )}
        </section>
      </main>

      <footer className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 text-center text-[10px] font-mono text-neutral-500">
        {locale === 'it' ? 'Poster e metadati da ' : 'Posters and metadata from '}
        <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="text-[#01b4e4] hover:underline">
          TMDB
        </a>
        {locale === 'it'
          ? '. Questo prodotto usa dati TMDB ma non è approvato né certificato da TMDB.'
          : '. This product uses TMDB data but is not endorsed or certified by TMDB.'}
      </footer>

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