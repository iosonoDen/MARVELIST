"use client";

import { X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { RankBadge } from "@/components/SagaProgress";
import { sagaProgress } from "@/lib/saga";
import type { SupportedLocale } from "@/types/mcu";

/** Banner per chi apre un link sfida: mostra il grado dell'amico. */
export const ChallengeBanner: React.FC<{
  challenge: { watched: number; total: number };
  locale: SupportedLocale;
}> = ({ challenge, locale }) => {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  const s = sagaProgress(challenge.watched, challenge.total);
  const it = locale === "it";

  return (
    <section
      role="status"
      className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/75 p-4 pr-12 shadow-xl cinematic-blur sm:p-5 sm:pr-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[#E21B24]/20 blur-3xl"
      />
      <div className="relative">
        <RankBadge rank={s.rank} celebrate={false} />
      </div>
      <p className="relative text-sm font-semibold text-neutral-200">
        {it ? "Il tuo amico è " : "Your friend is "}
        <span className="font-extrabold" style={{ color: s.rank.color }}>
          {s.rank[locale]}
        </span>
        {": "}
        <span className="font-extrabold text-white">
          {s.watched}/{s.total}
        </span>{" "}
        ({s.pct}%).{" "}
        <span className="font-extrabold text-white">
          {it ? "Riesci a superarlo?" : "Can you beat them?"}
        </span>
      </p>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-neutral-400 transition-colors hover:text-white"
        aria-label={it ? "Chiudi" : "Close"}
      >
        <X size={16} aria-hidden="true" />
      </button>
    </section>
  );
};
