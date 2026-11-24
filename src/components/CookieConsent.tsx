"use client";

import { Analytics } from "@vercel/analytics/next";
import Link from "next/link";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStoredLocale } from "@/hooks/useStoredLocale";
import { CONSENT_EVENT, type Consent, readConsent, writeConsent } from "@/lib/consent";

const MINIMIZE_AFTER_MS = 7000;
const EXIT_MS = 650;

/** Biscotto a linee, nello stile degli stemmi dei gradi. */
export const CookieIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="32" cy="28" r="22" />
    <path d="M32 9.5a18.5 18.5 0 1 0 18.3 21.2 5 5 0 0 1-6.3-5.6 5 5 0 0 1-5.5-6.4A5 5 0 0 1 32 9.5Z" />
    <circle cx="24" cy="22" r="1.6" fill="currentColor" />
    <circle cx="21" cy="32" r="1.4" fill="currentColor" />
    <circle cx="30" cy="38" r="1.6" fill="currentColor" />
    <circle cx="38" cy="33" r="1.3" fill="currentColor" />
    <circle cx="30" cy="27" r="1.1" fill="currentColor" />
    <path d="M14 52l6 4M50 52l-6 4M22 58l10 5 10-5" />
  </svg>
);

type View = "hidden" | "open" | "mini" | "leaving";

/**
 * Avviso cookie in basso a destra.
 * - Si apre alla prima visita; se non viene toccato per 7 s si riduce a un biscotto che pulsa.
 * - Dopo una scelta esce con un'animazione e non ricompare (si può cambiare da /privacy).
 * - Le statistiche anonime (Vercel) partono solo con "Accetta tutti".
 */
export const CookieConsent: React.FC = () => {
  const locale = useStoredLocale();
  const it = locale === "it";
  const [consent, setConsent] = useState<Consent | null>(null);
  const [view, setView] = useState<View>("hidden");
  const [interacting, setInteracting] = useState(false);
  const timer = useRef<number | null>(null);

  // Legge la scelta salvata (anche quando cambia da /privacy)
  useEffect(() => {
    const sync = () => {
      const c = readConsent();
      setConsent(c);
      setView((v) => (c ? "hidden" : v === "hidden" ? "open" : v));
    };
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  // Timer di 7 secondi: si ferma mentre l'utente ci passa sopra o lo usa
  useEffect(() => {
    if (view !== "open" || interacting) return;
    timer.current = window.setTimeout(() => setView("mini"), MINIMIZE_AFTER_MS);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [view, interacting]);

  const choose = useCallback((value: Consent) => {
    setView("leaving");
    // Salva la scelta a fine animazione: il biscotto esce e non torna
    window.setTimeout(() => writeConsent(value), EXIT_MS);
  }, []);

  return (
    <>
      {consent === "all" && <Analytics />}

      {view === "mini" && (
        <button
          type="button"
          onClick={() => setView("open")}
          aria-label={it ? "Preferenze cookie" : "Cookie preferences"}
          className="cookie-pulse fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-[#F2A900]/45 bg-[#0d0e12]/95 text-[#F2A900] shadow-[0_0_18px_rgba(242,169,0,0.3)] cinematic-blur"
        >
          <CookieIcon className="h-9 w-9 drop-shadow-[0_0_6px_rgba(242,169,0,0.7)]" />
        </button>
      )}

      {(view === "open" || view === "leaving") && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label={it ? "Cookie" : "Cookies"}
          onMouseEnter={() => setInteracting(true)}
          onMouseLeave={() => setInteracting(false)}
          onFocus={() => setInteracting(true)}
          onBlur={() => setInteracting(false)}
          className={`fixed bottom-6 right-6 z-50 w-[min(360px,calc(100vw-3rem))] rounded-2xl border border-[#F2A900]/35 bg-[#0d0e12]/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(242,169,0,0.13)] cinematic-blur ${
            view === "leaving" ? "cookie-leave" : "cookie-enter"
          }`}
        >
          <div className="flex items-start gap-3.5">
            <CookieIcon className="h-13 w-13 shrink-0 text-[#F2A900] drop-shadow-[0_0_8px_rgba(242,169,0,0.65)]" />
            <div>
              <p className="text-sm font-extrabold text-white">
                {it ? "Un biscotto, agente?" : "A cookie, agent?"}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                {it
                  ? "Usiamo cookie tecnici per il login e, se accetti, statistiche anonime delle visite (Vercel). "
                  : "We use technical cookies for login and, if you accept, anonymous visit statistics (Vercel). "}
                <Link href="/privacy" className="underline hover:text-neutral-200">
                  {it ? "Privacy e cookie" : "Privacy & cookies"}
                </Link>
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            <button
              type="button"
              onClick={() => choose("all")}
              className="rounded-lg bg-[#E21B24] px-3 py-2.5 text-xs font-bold text-white shadow-[0_0_14px_rgba(226,27,36,0.55)] hover:brightness-110"
            >
              {it ? "Accetta tutti" : "Accept all"}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => choose("necessary")}
                className="rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-xs font-bold text-neutral-200 hover:border-white/30"
              >
                {it ? "Solo necessari" : "Necessary only"}
              </button>
              <button
                type="button"
                onClick={() => choose("none")}
                className="rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-xs font-bold text-neutral-200 hover:border-white/30"
              >
                {it ? "Rifiuta tutti" : "Reject all"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/** Pulsante per /privacy: cancella la scelta e riapre l'avviso. */
export const CookieSettingsButton: React.FC<{ label: string }> = ({ label }) => (
  <button
    type="button"
    onClick={() => writeConsent(null)}
    className="mt-3 rounded-lg border border-[#F2A900]/40 px-3 py-2 text-xs font-bold text-[#F2A900] hover:bg-[#F2A900]/10"
  >
    {label}
  </button>
);
