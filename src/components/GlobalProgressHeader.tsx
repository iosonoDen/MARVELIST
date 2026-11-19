'use client';

import React from 'react';
import Image from 'next/image';
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
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#060709]/85 cinematic-blur transition-all font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-1.5 focus:outline-none">
            <div className="relative h-7 w-[72px] sm:h-8 sm:w-[82px] flex items-center shadow-[0_0_24px_rgba(226,27,36,0.45)] rounded-sm overflow-hidden">
              <Image
                src="/marvel-logo.svg"
                alt="Marvel Logo"
                width={82}
                height={32}
                priority
                className="h-full w-full object-contain object-left"
              />
            </div>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase select-none leading-none">
              IST
            </span>
          </div>
          <div className="hidden sm:block h-6 w-px bg-white/10 ml-1" />
          <p className="hidden sm:block text-xs font-semibold text-neutral-400 tracking-wide">
            {locale === 'it' ? 'MCU Canon Watchlist' : 'MCU Canon Watchlist'}
          </p>
        </div>

        <div className="flex-1 max-w-md hidden md:flex flex-col gap-1.5 px-4">
          <div className="flex justify-between items-baseline text-xs font-semibold tracking-wide">
            <span className="text-neutral-400 uppercase text-[11px]">
              {locale === 'it' ? 'Progresso Saga' : 'Saga Completion'}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-extrabold text-sm">{watchedCount}</span>
              <span className="text-neutral-600">/</span>
              <span className="text-neutral-400 font-medium">{totalCount}</span>
              <span className="text-[#E21B24] font-black text-sm ml-1">{percentage}%</span>
            </div>
          </div>
          <div
            className="w-full h-2 rounded-full bg-neutral-900 border border-white/10 overflow-hidden p-[1px]"
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
            className="p-2 sm:px-3 sm:py-2 rounded-lg bg-neutral-900/90 border border-white/10 hover:border-red-600/40 text-neutral-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
            title={locale === 'it' ? 'Esporta come file .xlsx' : 'Export as .xlsx'}
          >
            <Download size={14} className="text-neutral-400" />
            <span className="hidden sm:inline">.XLSX</span>
          </button>

          <button
            onClick={onTriggerImport}
            className="p-2 sm:px-3 sm:py-2 rounded-lg bg-neutral-900/90 border border-white/10 hover:border-red-600/40 text-neutral-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
            title={locale === 'it' ? 'Importa file .xlsx' : 'Import .xlsx'}
          >
            <Upload size={14} className="text-neutral-400" />
            <span className="hidden sm:inline">Import</span>
          </button>

          <button
            onClick={onToggleLocale}
            className="px-3 py-2 rounded-lg bg-neutral-900/90 border border-white/10 hover:border-white/30 text-neutral-200 text-xs font-bold flex items-center gap-1.5 transition-all"
            title={locale === 'it' ? 'Switch to English' : "Passa all'Italiano"}
          >
            <Globe size={14} className="text-red-500" />
            <span>{locale.toUpperCase()}</span>
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
