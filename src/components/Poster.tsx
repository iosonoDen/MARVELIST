"use client";

import type React from "react";
import { useEffect, useState } from "react";

import type { MCUEntry, SupportedLocale } from "@/types/mcu";

interface PosterProps {
  entry: MCUEntry;
  locale: SupportedLocale;
  className?: string;
}

const englishPosterCache = new Map<string, string | null>();
const inflight = new Map<string, Promise<string | null>>();

function loadEnglishPoster(
  key: string,
  id: number,
  type: string,
): Promise<string | null> {
  const pending = inflight.get(key);
  if (pending) return pending;

  const request = fetch(`/api/tmdb/poster?id=${id}&type=${type}`)
    .then((res) => (res.ok ? res.json() : { posterUrl: null }))
    .then((data: { posterUrl: string | null }) => data.posterUrl ?? null)
    .catch(() => null)
    .then((url) => {
      englishPosterCache.set(key, url);
      inflight.delete(key);
      return url;
    });

  inflight.set(key, request);
  return request;
}

export const Poster: React.FC<PosterProps> = ({
  entry,
  locale,
  className = "",
}) => {
  const { tmdbId, tmdbType } = entry;
  const key =
    locale === "en" && tmdbId && tmdbType ? `${tmdbType}:${tmdbId}` : null;

  const [resolved, setResolved] = useState<{
    key: string;
    url: string | null;
  } | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!key || !tmdbId || !tmdbType || englishPosterCache.has(key)) return;

    let ignore = false;
    loadEnglishPoster(key, tmdbId, tmdbType).then((url) => {
      if (!ignore) setResolved({ key, url });
    });

    return () => {
      ignore = true;
    };
  }, [key, tmdbId, tmdbType]);

  const englishUrl = key
    ? (englishPosterCache.get(key) ??
      (resolved?.key === key ? resolved.url : null))
    : null;

  const src = englishUrl ?? entry.posterUrl;

  if (src && failedSrc !== src) {
    return (
      <img
        src={src}
        alt={entry.title[locale]}
        className={`h-full w-full object-cover ${className}`}
        loading="lazy"
        onError={() => setFailedSrc(src)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={entry.title[locale]}
      className={`flex h-full w-full flex-col items-center justify-center gap-3 bg-linear-to-br from-[#2a0507] via-[#0D1017] to-[#060709] p-4 text-center ${className}`}
    >
      <span className="bg-[#E21B24] px-2 py-0.5 text-sm font-black uppercase tracking-tighter text-white">
        MARVEL
      </span>
      <span className="text-sm font-black uppercase leading-tight tracking-tight text-white sm:text-base">
        {entry.title[locale]}
      </span>
      <span className="font-mono text-[10px] text-neutral-400">
        {entry.releaseYear}
      </span>
    </div>
  );
};