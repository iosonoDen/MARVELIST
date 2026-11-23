import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { WatchlistApp } from "@/components/WatchlistApp";
import { decodeChallenge, sagaProgress } from "@/lib/saga";

type Props = { params: Promise<{ code: string }> };

/** Titolo e descrizione dell'anteprima, nella lingua di chi ha condiviso. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const challenge = decodeChallenge((await params).code);
  if (!challenge) return {};
  const { locale, watched, total } = challenge;
  const s = sagaProgress(watched, total);
  const it = locale === "it";
  const title = it
    ? `Il tuo amico è ${s.rank.it} su MARVELIST · ${s.pct}%`
    : `Your friend is ${s.rank.en} on MARVELIST · ${s.pct}%`;
  const description = it
    ? `${watched} titoli Marvel su ${total}. Riesci a superarlo?`
    : `${watched} of ${total} Marvel titles. Can you beat them?`;
  return {
    title,
    description,
    openGraph: { title, description, siteName: "MARVELIST", type: "website" },
    twitter: { card: "summary_large_image", title, description },
    // I link sfida non vanno indicizzati: sono tutti la stessa app.
    robots: { index: false, follow: true },
  };
}

export default async function ChallengePage({ params }: Props) {
  const challenge = decodeChallenge((await params).code);
  if (!challenge) redirect("/");
  return (
    <WatchlistApp
      challenge={{ watched: challenge.watched, total: challenge.total }}
    />
  );
}
