"use client";

import { Loader2, Share2 } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { motivation, RankBadge, SagaBar } from "@/components/SagaProgress";
import { byTimeline, encodeChallenge, sagaProgress } from "@/lib/saga";
import type { MCUEntry, SupportedLocale } from "@/types/mcu";

const CARD_W = 360; // × 3 = 1080 px
const CARD_H = 640; // × 3 = 1920 px
const POSTERS = 12;

/** Locandina servita dallo stesso dominio (via /_next/image): il canvas non la blocca. */
const sameOriginPoster = (url: string) =>
  `/_next/image?url=${encodeURIComponent(url)}&w=256&q=75`;

/** Attende il caricamento di tutte le immagini dentro il nodo. */
async function imagesReady(node: HTMLElement) {
  const imgs = Array.from(node.querySelectorAll("img"));
  await Promise.all(
    imgs.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }),
    ),
  );
}

/**
 * Immagine 1080×1920 da condividere come storia.
 * Stesso stile del blocco progresso: fondo scuro, alone rosso, Impact, badge, barra.
 */
const ShareCard: React.FC<{
  entries: MCUEntry[];
  locale: SupportedLocale;
  host: string;
}> = ({ entries, locale, host }) => {
  const watched = entries.filter((e) => e.watched).length;
  const s = sagaProgress(watched, entries.length);
  const posters = byTimeline(entries).slice(0, POSTERS);
  const it = locale === "it";

  return (
    <div
      className="relative flex flex-col overflow-hidden bg-[#060709] px-6 py-8 font-sans text-neutral-100 antialiased"
      style={{ width: CARD_W, height: CARD_H }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-16 h-80 w-80 rounded-full bg-[#E21B24]/25 blur-3xl"
      />

      {/* Logo: identico all'header */}
      <div className="relative flex items-center gap-1">
        <div className="relative h-8 w-20.5 flex items-center shadow-[0_0_24px_rgba(226,27,36,0.45)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- serve un <img> semplice per l'export */}
          <img
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
      <p className="relative mt-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
        {it ? "La mia saga MCU" : "My MCU saga"}
      </p>

      <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/75 p-5 shadow-xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#E21B24]/20 blur-3xl"
        />
        <div className="relative leading-none">
          <span
            className="text-8xl font-black tracking-tighter text-white"
            style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
          >
            {s.pct}
          </span>
          <span className="text-4xl font-black text-[#E21B24]">%</span>
        </div>
        <div className="relative mt-4 flex items-center gap-2.5">
          <RankBadge rank={s.rank} celebrate={false} size={56} />
          <div>
            <p
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color: s.rank.color }}
            >
              {it ? "Grado" : "Rank"}: {s.rank[locale]}
            </p>
            <p className="text-sm font-semibold text-neutral-300">
              <span className="font-extrabold text-white">{s.watched}</span> /{" "}
              {s.total} {it ? "titoli visti" : "titles watched"}
            </p>
          </div>
        </div>
        <p className="relative mt-4 text-[13px] font-semibold text-neutral-200">
          {motivation(s, locale)}
        </p>
        <div className="relative mt-2">
          <SagaBar pct={s.pct} locale={locale} still />
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-6 gap-1.5">
        {posters.map((e) => (
          // eslint-disable-next-line @next/next/no-img-element -- serve un <img> semplice per l'export
          <img
            key={e.id}
            src={sameOriginPoster(e.posterUrl)}
            alt=""
            className={`aspect-2/3 w-full rounded-[3px] object-cover ${
              e.watched
                ? "ring-1 ring-[#E21B24]/70 shadow-[0_0_10px_rgba(226,27,36,0.45)]"
                : "opacity-35 grayscale"
            }`}
          />
        ))}
      </div>

      <div className="flex-1" />
      <p className="relative text-center text-lg font-black text-white">
        {it ? "E tu che grado sei?" : "What's your rank?"}
      </p>
      <p className="relative mt-1 text-center text-xs font-medium text-neutral-400">
        {host}
      </p>
    </div>
  );
};

type Status = "idle" | "busy" | "downloaded" | "error";

/** Pulsante "Condividi il tuo grado": crea l'immagine e apre il menu nativo. */
export const ShareRankButton: React.FC<{
  entries: MCUEntry[];
  locale: SupportedLocale;
}> = ({ entries, locale }) => {
  const it = locale === "it";
  const [status, setStatus] = useState<Status>("idle");
  const cardRef = useRef<HTMLDivElement>(null);
  const [host, setHost] = useState("");

  useEffect(() => {
    if (status !== "busy" || !cardRef.current) return;
    const node = cardRef.current;
    let cancelled = false;

    (async () => {
      const watched = entries.filter((e) => e.watched).length;
      const s = sagaProgress(watched, entries.length);
      const url = `${window.location.origin}/s/${encodeChallenge({
        locale,
        watched,
        total: entries.length,
      })}`;
      const text = it
        ? `Sono ${s.rank.it} su MARVELIST: ${watched}/${entries.length} titoli Marvel visti. E tu che grado sei?`
        : `I'm ${s.rank.en} on MARVELIST: ${watched}/${entries.length} Marvel titles watched. What's your rank?`;

      try {
        await imagesReady(node);
        const { toBlob } = await import("html-to-image");
        // includeQueryParams: le locandine differiscono solo per "?url=…".
        const opts = {
          pixelRatio: 3,
          backgroundColor: "#060709",
          includeQueryParams: true,
        };
        // Primo giro a vuoto: Safari a volte salta le immagini al primo export.
        await toBlob(node, opts);
        const blob = await toBlob(node, opts);
        if (!blob || cancelled) throw new Error("export failed");

        const file = new File([blob], "marvelist-grado.png", {
          type: "image/png",
        });
        if (navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({ files: [file], text: `${text} ${url}` });
          } catch (err) {
            // Chiuso dall'utente: non è un errore.
            if ((err as Error).name !== "AbortError") throw err;
          }
          if (!cancelled) setStatus("idle");
          return;
        }

        // Computer: scarica l'immagine e copia il link.
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(a.href);
        await navigator.clipboard?.writeText(`${text} ${url}`).catch(() => {});
        if (!cancelled) setStatus("downloaded");
      } catch (err) {
        console.error("Condivisione non riuscita:", err);
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, entries, locale, it]);

  // I messaggi spariscono da soli.
  useEffect(() => {
    if (status !== "downloaded" && status !== "error") return;
    const t = window.setTimeout(() => setStatus("idle"), 4000);
    return () => window.clearTimeout(t);
  }, [status]);

  const busy = status === "busy";

  return (
    <div className="mt-3">
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          setHost(window.location.host);
          setStatus("busy");
        }}
        className="flex items-center gap-1.5 rounded-lg bg-[#E21B24] px-3 py-2 text-xs font-bold text-white shadow-[0_0_14px_rgba(226,27,36,0.55)] transition-all hover:brightness-110 disabled:opacity-70"
      >
        {busy ? (
          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
        ) : (
          <Share2 size={14} aria-hidden="true" />
        )}
        <span>{it ? "Condividi il tuo grado" : "Share your rank"}</span>
      </button>
      {(status === "downloaded" || status === "error") && (
        <p role="status" className="mt-1.5 text-[11px] font-medium text-neutral-400">
          {status === "downloaded"
            ? it
              ? "Immagine scaricata e link copiato."
              : "Image downloaded and link copied."
            : it
              ? "Non è stato possibile creare l'immagine."
              : "Could not create the image."}
        </p>
      )}

      {/* Immagine fuori schermo, creata solo durante la condivisione */}
      {busy && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-0"
          style={{ left: -10000 }}
        >
          <div ref={cardRef}>
            <ShareCard entries={entries} locale={locale} host={host} />
          </div>
        </div>
      )}
    </div>
  );
};
