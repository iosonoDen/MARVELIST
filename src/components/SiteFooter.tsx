import Image from "next/image";
import type React from "react";
import { PostCredits } from "@/components/PostCredits";
import { INITIAL_MCU_DATABASE } from "@/data/mcu-canon";
import { byTimeline } from "@/lib/saga";
import type { SupportedLocale } from "@/types/mcu";

export const CONTACT_EMAIL = "marvel-its@support.com";

// Locandine dello sfondo, sfumate: le prime della timeline canonica
const POSTERS = byTimeline(INITIAL_MCU_DATABASE)
  .map((e) => e.posterUrl)
  .filter(Boolean)
  .slice(0, 42);

/** Footer "titoli di coda": logo, dati, contatti, note legali e scena post-crediti. */
export const SiteFooter: React.FC<{
  locale: SupportedLocale;
  /** Scena post-crediti sbloccata (grado Vendicatore). */
  postCreditsUnlocked: boolean;
  watched: number;
  total: number;
}> = ({ locale, postCreditsUnlocked, watched, total }) => {
  const it = locale === "it";
  return (
    <footer className="relative z-10 mt-8 overflow-hidden border-t border-white/10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-5 grid grid-cols-7 gap-1.5 opacity-[0.18] grayscale-[0.4] sm:grid-cols-14"
      >
        {POSTERS.map((src, i) => (
          <div key={src + i} className="relative aspect-2/3">
            <Image src={src} alt="" fill sizes="104px" className="object-cover" />
          </div>
        ))}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#060709] via-[#060709]/80 to-[#060709]"
      />

      <div className="relative mx-auto max-w-4xl px-6 pt-14 pb-10 text-center">
        {/* Logo: identico all'header */}
        <div className="flex justify-center">
          <div className="flex items-center gap-1 scale-125">
            <div className="relative h-8 w-20.5 flex items-center shadow-[0_0_24px_rgba(226,27,36,0.45)]">
              <Image
                src="/marvel-logo.svg"
                alt="Marvel Logo"
                width={82}
                height={32}
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

        <div className="mx-auto mt-8 grid max-w-lg grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              {it ? "Dati" : "Data"}
            </p>
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm font-bold text-[#01b4e4] hover:underline"
            >
              TMDB
            </a>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              {it ? "Contatti" : "Contact"}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-1 inline-block text-sm font-semibold text-neutral-200 hover:text-white hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        <div className="mx-auto mt-7 max-w-2xl space-y-1 text-[11px] leading-relaxed text-neutral-500">
          <p>{it ? "Locandine, cast e dati da TMDB." : "Posters, cast and data from TMDB."}</p>
          <p>
            {it
              ? "MARVELIST è un progetto fan non ufficiale, non affiliato a Marvel Studios o a The Walt Disney Company. Marvel e i suoi personaggi sono marchi dei rispettivi proprietari."
              : "MARVELIST is an unofficial fan project, not affiliated with Marvel Studios or The Walt Disney Company. Marvel and its characters are trademarks of their respective owners."}
          </p>
        </div>

        {/* Scena post-crediti: certificato da Vendicatore */}
        <PostCredits
          unlocked={postCreditsUnlocked}
          watched={watched}
          total={total}
          locale={locale}
        />

        <p className="mt-6 text-[11px] text-neutral-600">© 2026 MARVELIST</p>
      </div>
    </footer>
  );
};
