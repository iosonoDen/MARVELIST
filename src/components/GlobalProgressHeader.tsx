'use client';

import React from 'react';
import { SupportedLocale } from '@/types/mcu';
import { Globe, Download, Upload } from 'lucide-react';

interface GlobalProgressHeaderProps {
  totalCount: number;
  watchedCount: number;
  locale: SupportedLocale;
  onToggleLocale: () => void;
  onExportXLSX: () => void;
  onTriggerImport: () => void;
}

export const GlobalProgressHeader: React.FC<GlobalProgressHeaderProps> = ({
  totalCount,
  watchedCount,
  locale,
  onToggleLocale,
  onExportXLSX,
  onTriggerImport,
}) => {
  const percentage = totalCount > 0 ? Math.round((watchedCount / totalCount) * 100) : 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#060709]/80 cinematic-blur transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#E21B24] px-2.5 py-1 text-white font-black tracking-tighter text-xl uppercase shadow-[0_0_20px_rgba(226,27,36,0.6)]">
            MARVEL
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest text-neutral-200 uppercase font-mono">
              MARVELIST
            </h1>
            <p className="text-[10px] text-neutral-500 font-mono tracking-wider">
              {locale === 'it' ? 'Checklist di Visione Canonica' : 'Canonical Watchlist Tracker'} • v1.2.0
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-md hidden md:flex flex-col gap-1.5 px-4">
          <div className="flex justify-between items-baseline font-mono text-xs">
            <span className="text-neutral-400 font-medium tracking-wider">
              {locale === 'it' ? 'PROGRESSO SAGA' : 'SAGA COMPLETION'}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold">{watchedCount}</span>
              <span className="text-neutral-600">/</span>
              <span className="text-neutral-400">{totalCount}</span>
              <span className="text-[#E21B24] font-black ml-1">{percentage}%</span>
            </div>
          </div>
          <div 
            className="w-full h-2 rounded-full bg-neutral-900 border border-white/5 overflow-hidden p-[1px]"
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#8B0000] via-[#E21B24] to-[#FF4D4D] transition-all duration-700 ease-out shadow-[0_0_12px_rgba(226,27,36,0.8)]"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportXLSX}
            className="p-2 rounded-md bg-neutral-900/90 border border-white/10 hover:border-red-600/40 text-neutral-400 hover:text-white transition-all text-xs font-mono flex items-center gap-1.5"
            title={locale === 'it' ? "Esporta come file .xlsx" : "Export as .xlsx"}
          >
            <Download size={14} />
            <span className="hidden sm:inline">.XLSX</span>
          </button>

          <button
            onClick={onTriggerImport}
            className="p-2 rounded-md bg-neutral-900/90 border border-white/10 hover:border-red-600/40 text-neutral-400 hover:text-white transition-all text-xs font-mono flex items-center gap-1.5"
            title={locale === 'it' ? "Importa file .xlsx" : "Import .xlsx"}
          >
            <Upload size={14} />
            <span className="hidden sm:inline">Import</span>
          </button>

          <button
            onClick={onToggleLocale}
            className="px-2.5 py-1.5 rounded-md bg-neutral-900/90 border border-white/10 hover:border-white/30 text-neutral-300 font-mono text-xs flex items-center gap-1.5 transition-all"
            title={locale === 'it' ? "Switch to English" : "Passa all'Italiano"}
          >
            <Globe size={14} className="text-red-500" />
            <span className="font-bold">{locale.toUpperCase()}</span>
          </button>
        </div>
      </div>

      <div className="md:hidden w-full h-1 bg-neutral-950">
        <div
          className="h-full bg-[#E21B24] transition-all duration-500 shadow-[0_0_8px_#E21B24]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </header>
  );
};