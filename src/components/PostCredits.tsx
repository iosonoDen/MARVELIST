"use client";

import { useUser } from "@clerk/nextjs";
import { Download, Loader2 } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { bebasNeue, greatVibes } from "@/app/fonts";
import { RANKS } from "@/lib/saga";
import type { SupportedLocale } from "@/types/mcu";

const W = 360; // × 3 = 1080 px
const H = 450; // × 3 = 1350 px
const AVENGER = RANKS[RANKS.length - 1];

/** Logo identico all'header (per il certificato). */
const Logo: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div className="flex items-center gap-1" style={{ transform: `scale(${scale})` }}>
    <div className="relative h-8 w-20.5 flex items-center shadow-[0_0_24px_rgba(226,27,36,0.45)]">
      {/* eslint-disable-next-line @next/next/no-img-element -- serve un <img> semplice per l'export */}
      <img src="/marvel-logo.svg" alt="Marvel Logo" width={82} height={32} className="h-full w-full object-contain" />
    </div>
    <span
      className="text-[32px] text-white uppercase select-none leading-none tracking-[-0.06em] scale-y-100"
      style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
    >
      IST
    </span>
  </div>
);

const today = (locale: SupportedLocale) =>
  new Date().toLocaleDateString(locale === "it" ? "it-IT" : "en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

/** Diploma di Laurea in Multiversologia (360×450, esportato a 1080×1350). */
export const CertificateCard: React.FC<{
  name: string;
  watched: number;
  total: number;
  locale: SupportedLocale;
}> = ({ name, watched, total, locale }) => {
  const it = locale === "it";
  const bebas = bebasNeue.className;
  const script = greatVibes.className;
  return (
    <div
      className="relative flex flex-col items-center overflow-hidden bg-[radial-gradient(circle_at_50%_30%,#2b2210,#0b0a08_70%)] px-6 pt-6 pb-5 text-center font-sans text-neutral-100 antialiased"
      style={{ width: W, height: H, border: "6px double rgba(242,169,0,0.6)" }}
    >
      <p className={`${bebas} text-sm tracking-[0.3em] text-[#F2A900]`}>
        {it ? "Università del Multiverso" : "University of the Multiverse"}
      </p>
      <div className="mt-2.5">
        <Logo scale={0.8} />
      </div>
      <p className="mt-4 text-xs text-neutral-300">{it ? "conferisce a" : "confers upon"}</p>
      <p className="mt-1 max-w-full truncate text-2xl font-black text-white">{name}</p>
      <p className="mt-2.5 text-xs text-neutral-300">
        {it ? "il Diploma di Laurea in" : "the Degree in"}
      </p>
      <p className={`${bebas} mt-1 text-[38px] leading-none text-[#F2A900] drop-shadow-[0_0_12px_rgba(242,169,0,0.45)]`}>
        {it ? "Multiversologia" : "Multiversology"}
      </p>
      <p className="mt-2.5 text-sm">
        {it ? "con " : "with "}
        <b>
          {watched}/{total}
        </b>
        {it ? " e lode" : " cum laude"}
      </p>
      <p className="mt-2 px-3 text-[10.5px] italic leading-snug text-neutral-400">
        {it
          ? "per aver resistito a 3 Spider-Man, 3 Hulk, un procione parlante e un'infinità di scene post-crediti"
          : "for surviving 3 Spider-Men, 3 Hulks, a talking raccoon and countless post-credits scenes"}
      </p>

      <div className="mt-auto flex w-full items-end justify-between">
        <div className="text-center">
          <p className={`${script} text-[26px] leading-none text-neutral-200`}>
            {it ? "Il Rettore" : "The Rector"}
          </p>
          <div className="mx-auto mt-1 w-28 border-t border-neutral-500" />
          <p className="mt-1 text-[9.5px] text-neutral-500">{it ? "del Multiverso" : "of the Multiverse"}</p>
        </div>
        <div className="flex h-[92px] w-[92px] items-center justify-center rounded-full border-2 border-dashed border-[#F2A900] shadow-[0_0_20px_rgba(242,169,0,0.35)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- serve un <img> semplice per l'export */}
          <img
            src={AVENGER.icon}
            alt=""
            className="h-[68px] w-[68px] object-contain"
            style={{ filter: "drop-shadow(0 0 8px rgba(242,169,0,0.8))" }}
          />
        </div>
        <div className="text-center">
          <p className={`${script} text-[26px] leading-none text-neutral-200`}>
            {it ? "Il Custode" : "The Keeper"}
          </p>
          <div className="mx-auto mt-1 w-28 border-t border-neutral-500" />
          <p className="mt-1 text-[9.5px] text-neutral-500">{it ? "della Timeline" : "of the Timeline"}</p>
        </div>
      </div>
      <p className="mt-3 text-[10px] text-neutral-500">{today(locale)}</p>
    </div>
  );
};

type Status = "idle" | "busy" | "done" | "error";
type Lock = "locked" | "opening" | "open";

const UNLOCK_SEEN = "marvelist:postcredits-unlocked:v1";
const UNLOCK_MS = 1300;

/** Lucchetto bianco: l'arco si alza e ruota quando si sblocca. */
const LockIcon: React.FC<{ opening: boolean }> = ({ opening }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`h-7 w-7 text-white ${opening ? "lock-away" : ""}`}
    aria-hidden="true"
  >
    <path d="M7 11V7a5 5 0 0 1 10 0v4" className={opening ? "lock-shackle-open" : ""} />
    <rect width="18" height="11" x="3" y="11" rx="2" />
  </svg>
);

/** Scena post-crediti del footer: bloccata, oppure il certificato da scaricare. */
export const PostCredits: React.FC<{
  unlocked: boolean;
  watched: number;
  total: number;
  locale: SupportedLocale;
}> = ({ unlocked, watched, total, locale }) => {
  const it = locale === "it";
  const { user } = useUser();
  const name = user?.fullName || user?.firstName || (it ? "Agente" : "Agent");
  const [status, setStatus] = useState<Status>("idle");
  const [lock, setLock] = useState<Lock>("locked");
  const exportRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Sblocco: la prima volta il lucchetto si apre quando il riquadro entra nello schermo
  useEffect(() => {
    if (!unlocked) return;
    let seen = false;
    try {
      seen = window.localStorage.getItem(UNLOCK_SEEN) === "1";
    } catch {
      /* storage non disponibile: animazione ogni volta */
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lettura una tantum dal browser
      setLock("open");
      return;
    }
    const node = boxRef.current;
    if (!node) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setLock("opening");
        timer = window.setTimeout(() => {
          setLock("open");
          try {
            window.localStorage.setItem(UNLOCK_SEEN, "1");
          } catch {
            /* ignora */
          }
        }, UNLOCK_MS);
      },
      { threshold: 0.6 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [unlocked]);
  const shown: Lock = unlocked ? lock : "locked";

  useEffect(() => {
    if (status !== "busy" || !exportRef.current) return;
    const node = exportRef.current;
    let cancelled = false;
    (async () => {
      try {
        await document.fonts.ready;
        await Promise.all(
          Array.from(node.querySelectorAll("img")).map((img) =>
            img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; }),
          ),
        );
        const { toBlob } = await import("html-to-image");
        const opts = { pixelRatio: 3, backgroundColor: "#0b0a08", includeQueryParams: true };
        await toBlob(node, opts); // primo giro a vuoto: Safari a volte salta le immagini
        const blob = await toBlob(node, opts);
        if (!blob || cancelled) throw new Error("export failed");
        const file = new File([blob], it ? "laurea-multiversologia.png" : "multiversology-degree.png", {
          type: "image/png",
        });
        const text = it
          ? `Mi sono laureato in Multiversologia su MARVELIST: ${watched}/${total} titoli Marvel! ${window.location.origin}`
          : `I graduated in Multiversology on MARVELIST: ${watched}/${total} Marvel titles! ${window.location.origin}`;
        if (navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({ files: [file], text });
          } catch (err) {
            if ((err as Error).name !== "AbortError") throw err;
          }
        } else {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = file.name;
          a.click();
          URL.revokeObjectURL(a.href);
        }
        if (!cancelled) setStatus("done");
      } catch (err) {
        console.error("Certificato non creato:", err);
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, watched, total, it]);

  return (
    <div ref={boxRef} className="mx-auto mt-7 max-w-md rounded-xl border border-dashed border-[#E21B24]/40 px-4 py-3">
      <p className={`${bebasNeue.className} text-lg uppercase tracking-[0.12em] text-[#F2A900]`}>
        {it ? "Scena post-crediti" : "Post-credits scene"}
      </p>
      {shown !== "open" ? (
        <div className="mt-2.5 flex flex-col items-center gap-1.5">
          <LockIcon opening={shown === "opening"} />
          <p className={`text-xs text-neutral-300 ${shown === "opening" ? "lock-text-away" : ""}`}>
            {it ? "Diventa Vendicatore per sbloccarla" : "Become an Avenger to unlock it"}
          </p>
        </div>
      ) : (
        <div className="rise-in mt-3 flex flex-col items-center gap-3">
          <p className="text-xs text-neutral-300">
            {it
              ? "Congratulazioni, Vendicatore: ti sei laureato in Multiversologia!"
              : "Congratulations, Avenger: you graduated in Multiversology!"}
          </p>
          {/* Anteprima ridotta */}
          <div className="overflow-hidden rounded-md" style={{ width: W * 0.5, height: H * 0.5 }}>
            <div style={{ transform: "scale(0.5)", transformOrigin: "top left" }}>
              <CertificateCard name={name} watched={watched} total={total} locale={locale} />
            </div>
          </div>
          <button
            type="button"
            disabled={status === "busy"}
            onClick={() => setStatus("busy")}
            className="flex items-center gap-1.5 rounded-lg bg-[#F2A900] px-3.5 py-2 text-xs font-bold text-neutral-900 shadow-[0_0_14px_rgba(242,169,0,0.45)] hover:brightness-110 disabled:opacity-70"
          >
            {status === "busy" ? (
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            ) : (
              <Download size={14} aria-hidden="true" />
            )}
            {it ? "Scarica il certificato" : "Download the certificate"}
          </button>
          {status === "error" && (
            <p role="status" className="text-[11px] text-amber-400">
              {it ? "Non è stato possibile creare l'immagine." : "Could not create the image."}
            </p>
          )}
        </div>
      )}

      {/* Copia a grandezza piena, fuori schermo, solo durante l'export */}
      {status === "busy" && (
        <div aria-hidden="true" className="pointer-events-none fixed top-0" style={{ left: -10000 }}>
          <div ref={exportRef}>
            <CertificateCard name={name} watched={watched} total={total} locale={locale} />
          </div>
        </div>
      )}
    </div>
  );
};
