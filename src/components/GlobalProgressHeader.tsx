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
  const scrollToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#060709]/85 cinematic-blur transition-all font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={scrollToTop}
            aria-label={locale === "it" ? "Torna in cima" : "Back to top"}
            title={locale === "it" ? "Torna in cima" : "Back to top"}
            className="group/logo relative flex items-center gap-1.5 rounded-xl p-1 -m-1 focus-visible:outline-2 focus-visible:outline-[#E21B24]"
          >
            {/* Luce rossa soffusa che si allarga dal centro al passaggio del cursore */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-8 -inset-y-5 scale-50 rounded-full bg-[radial-gradient(closest-side,rgba(226,27,36,0.85),rgba(226,27,36,0.45)_50%,rgba(226,27,36,0))] opacity-0 blur-md transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/logo:scale-100 group-hover/logo:opacity-100 group-focus-visible/logo:scale-100 group-focus-visible/logo:opacity-100 motion-reduce:transition-none"
            />
            <div className="relative flex items-center gap-1 focus:outline-none">
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
          </button>
          <div className="hidden sm:block h-6 w-px bg-white/10 ml-1" />
          <p className="hidden sm:block text-xs font-semibold text-neutral-400 tracking-wide">
            {locale === "it"
              ? "Marvel Cinematic Universe · La mia lista"
              : "Marvel Cinematic Universe · Watchlist"}
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
