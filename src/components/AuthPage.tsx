"use client";

import { useAuth } from "@clerk/nextjs";
import { useSignIn, useSignUp } from "@clerk/nextjs/legacy";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { INITIAL_MCU_DATABASE } from "@/data/mcu-canon";
import { CloseToList } from "@/components/BackLinks";
import { useStoredLocale } from "@/hooks/useStoredLocale";
import { byTimeline } from "@/lib/saga";

type Mode = "login" | "signup";

const ROWS = 5;
/** Velocità di scorrimento (px al secondo), uguale per tutte le file. */
const SPEED = 38;
const POSTER_W = 150;
const GAP = 12;

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

/**
 * Muro di locandine: 5 file che scorrono in orizzontale, alternando il verso.
 * Pattern: i titoli in ordine di timeline sono distribuiti a rotazione sulle file
 * (1° → fila 1, 2° → fila 2, …), quindi ogni film compare una sola volta.
 * Ogni fila è molto più larga dello schermo: il giro ricomincia senza ripetizioni visibili.
 */
const PosterWall: React.FC = () => {
  const rows = useMemo(() => {
    // Versione piccola (185 px) direttamente dal CDN di TMDB: veloce e senza passare dall'ottimizzatore
    const posters = byTimeline(INITIAL_MCU_DATABASE)
      .map((e) => e.posterUrl.replace("/t/p/w500/", "/t/p/w185/"))
      .filter(Boolean);
    const dealt: string[][] = Array.from({ length: ROWS }, () => []);
    posters.forEach((src, i) => dealt[i % ROWS].push(src));
    // Copia doppia solo per chiudere il giro senza salti (translateX -50%)
    return dealt.map((row) => [...row, ...row]);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute -left-36 -top-28 flex w-[1100px] -rotate-[8deg] flex-col gap-3"
    >
      {rows.map((row, r) => (
        <div
          key={r}
          className={`poster-row flex w-max gap-3 ${r % 2 ? "reverse" : ""}`}
          // Durata = lunghezza di un giro / velocità (ogni fila un po' più lenta: effetto profondità)
          style={{
            animationDuration: `${Math.round(((row.length / 2) * (POSTER_W + GAP)) / (SPEED - r * 3))}s`,
          }}
        >
          {row.map((src, i) => (
            <div
              key={i}
              className="relative aspect-2/3 shrink-0 overflow-hidden rounded-md bg-neutral-900"
              style={{ width: POSTER_W }}
            >
              {/* Caricate subito (priorità bassa): con l'animazione il caricamento "pigro" arriva in ritardo */}
              {/* eslint-disable-next-line @next/next/no-img-element -- immagine già piccola dal CDN di TMDB */}
              <img
                src={src}
                alt=""
                loading="eager"
                fetchPriority="low"
                decoding="async"
                className="poster-fade h-full w-full object-cover"
                onLoad={(e) => e.currentTarget.classList.add("is-loaded")}
                // Già in cache: caricata prima che React colleghi onLoad
                ref={(el) => {
                  if (el?.complete && el.naturalWidth > 0) el.classList.add("is-loaded");
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const AuthPage: React.FC<{ mode: Mode }> = ({ mode }) => {
  const locale = useStoredLocale();
  const it = locale === "it";
  const router = useRouter();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded: signInLoaded, signIn } = useSignIn();
  const { isLoaded: signUpLoaded, signUp } = useSignUp();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chi ha già fatto l'accesso torna alla lista
  useEffect(() => {
    if (authLoaded && isSignedIn) router.replace("/");
  }, [authLoaded, isSignedIn, router]);

  const signup = mode === "signup";
  const ready = signup ? signUpLoaded : signInLoaded;

  const T = signup
    ? {
        tag: it ? "Registrati" : "Sign up",
        title: it ? "Inizia la tua saga" : "Start your saga",
        text: it
          ? "Crea un account gratuito: i tuoi progressi saranno salvati e sincronizzati su tutti i dispositivi."
          : "Create a free account: your progress will be saved and synced across all your devices.",
        button: it ? "Registrati con Google" : "Sign up with Google",
        altText: it ? "Hai già un account?" : "Already have an account?",
        altLink: it ? "Accedi" : "Log in",
        altHref: "/login-page",
      }
    : {
        tag: it ? "Accedi" : "Log in",
        title: it ? "Bentornato, agente" : "Welcome back, agent",
        text: it
          ? "Accedi per ritrovare i tuoi progressi su tutti i dispositivi."
          : "Log in to find your progress on all your devices.",
        button: it ? "Continua con Google" : "Continue with Google",
        altText: it ? "Non hai un account?" : "Don't have an account?",
        altLink: it ? "Registrati" : "Sign up",
        altHref: "/signup-page",
      };

  const startGoogle = async () => {
    setError(null);
    setBusy(true);
    try {
      const params = {
        strategy: "oauth_google" as const,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      };
      if (signup) await signUp?.authenticateWithRedirect(params);
      else await signIn?.authenticateWithRedirect(params);
    } catch (err) {
      console.error("Accesso con Google non riuscito:", err);
      setError(
        it
          ? "Non è stato possibile avviare l'accesso con Google. Riprova."
          : "Could not start Google sign-in. Please try again.",
      );
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-[#060709] text-neutral-100 lg:flex-row">
      <CloseToList
        label={it ? "Torna alla lista" : "Back to the list"}
        className="absolute top-4 right-4 z-30 sm:top-6 sm:right-6"
      />
      {/* Sinistra: locandine in movimento */}
      <section className="relative h-[42vh] overflow-hidden lg:h-auto lg:w-[53%]">
        <PosterWall />
        <div className="absolute inset-0 bg-linear-to-r from-[#060709]/30 via-[#060709]/55 to-[#060709]" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-[#060709] to-transparent" />
      </section>

      {/* Destra: modulo */}
      <section className="relative flex flex-1 flex-col items-center justify-center bg-[radial-gradient(circle_at_100%_0,#2a070a,#060709_55%)] px-6 py-10 text-center sm:px-14 lg:px-24">
        {/* Logo: identico all'header, porta alla lista */}
        <Link
          href="/"
          aria-label={it ? "Torna alla lista" : "Back to the list"}
          className="flex items-center gap-1"
        >
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
        </Link>

        {/* Linea di divisione tra logo e modulo */}
        <div
          aria-hidden="true"
          className="my-8 h-px w-24 bg-linear-to-r from-transparent via-[#E21B24] to-transparent shadow-[0_0_10px_rgba(226,27,36,0.8)]"
        />

        <div className="w-full max-w-[420px] text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#E21B24]">
            {T.tag}
          </p>
          <h1 className="mt-2 text-3xl font-black text-white">{T.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-neutral-400">{T.text}</p>

          <button
            type="button"
            onClick={startGoogle}
            disabled={!ready || busy}
            className="mt-7 flex w-full items-center justify-center gap-2.5 rounded-xl bg-white px-4 py-3 text-sm font-bold text-neutral-900 transition-all hover:bg-neutral-200 disabled:opacity-70"
          >
            {busy ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <GoogleIcon />}
            {T.button}
          </button>
          {error && (
            <p role="alert" className="mt-3 text-xs font-medium text-amber-400">
              {error}
            </p>
          )}

          <p className="mt-5 text-center text-sm text-neutral-400">
            {T.altText}{" "}
            <Link
              href={T.altHref}
              className="font-bold text-white underline decoration-[#E21B24] underline-offset-4"
            >
              {T.altLink}
            </Link>
          </p>

          <div className="my-6 h-px bg-white/10" />
          <p className="text-[11px] leading-relaxed text-neutral-500">
            {it ? "Continuando accetti l'" : "By continuing you accept the "}
            <Link href="/privacy" className="underline hover:text-neutral-300">
              {it ? "Informativa privacy" : "Privacy policy"}
            </Link>
            {it
              ? ". Usiamo il tuo account Google solo per salvare i progressi."
              : ". We only use your Google account to save your progress."}
          </p>
        </div>
      </section>
    </div>
  );
};
