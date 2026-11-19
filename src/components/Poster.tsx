'use client';

import React, { useState } from 'react';
import { MCUEntry, SupportedLocale } from '@/types/mcu';

interface PosterProps {
  entry: MCUEntry;
  locale: SupportedLocale;
  className?: string;
}

/** Mostra il poster reale se disponibile, altrimenti una copertina generata con titolo e fase. */
export const Poster: React.FC<PosterProps> = ({ entry, locale, className = '' }) => {
  const [failed, setFailed] = useState(false);

  if (entry.posterUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={entry.posterUrl}
        alt={entry.title[locale]}
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={entry.title[locale]}
      className={`w-full h-full flex flex-col items-center justify-center gap-3 p-4 text-center bg-gradient-to-br from-[#2a0507] via-[#0D1017] to-[#060709] ${className}`}
    >
      <span className="bg-[#E21B24] px-2 py-0.5 text-white font-black tracking-tighter text-sm uppercase">MARVEL</span>
      <span className="text-white font-black text-sm sm:text-base leading-tight uppercase tracking-tight">
        {entry.title[locale]}
      </span>
      <span className="text-[10px] font-mono text-neutral-400">{entry.releaseYear}</span>
    </div>
  );
};
