"use client";

import { Globe } from "lucide-react";
import Image from "next/image";
import type React from "react";
import type { SupportedLocale } from "@/types/mcu";

interface GlobalProgressHeaderProps {
  locale: SupportedLocale;
  onToggleLocale: () => void;
  /** Pulsante utente (login), mostrato dopo la lingua. */
  userSlot?: React.ReactNode;
}

export const GlobalProgressHeader: React.FC<GlobalProgressHeaderProps> = ({
  locale,
  onToggleLocale,
  userSlot,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#060709]/85 cinematic-blur transition-all font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-1.5 focus:outline-none">
            <div className="flex items-center gap-1 focus:outline-none">
              <div className="relative h-8 w-20.5 flex items-center shadow-[0_0_24px_rgba(226,27,36,0.45)]">
                <Image
                  src="/marvel-logo.svg"
                  alt="Marvel Logo"
                  width={82}
                  height={32}
                  priority
                  className="h-full w-full object-contain"
                />
              </div>
              <span
                className="text-[32px] text-white uppercase select-none leading-none tracking-[-0.06em] scale-y-100"
                style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
              >
                IST
              </span>
            </div>
          </div>
          <div className="hidden sm:block h-6 w-px bg-white/10 ml-1" />
          <p className="hidden sm:block text-xs font-semibold text-neutral-400 tracking-wide">
            {locale === "it"
              ? "Marvel Cinematic Universe Lista Visione"
              : "Marvel Cinematic Universe Watchlist"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleLocale}
            className="px-3 py-2 rounded-lg bg-neutral-900/90 border border-white/10 hover:border-white/30 text-neutral-200 text-xs font-bold flex items-center gap-1.5 transition-all"
            title={locale === "it" ? "Switch to English" : "Passa all’italiano"}
            aria-label={
              locale === "it" ? "Switch to English" : "Passa all’italiano"
            }
          >
            <Globe size={14} className="text-red-500" aria-hidden="true" />
            <span>{locale.toUpperCase()}</span>
          </button>

          {userSlot}
        </div>
      </div>

    </header>
  );
};
