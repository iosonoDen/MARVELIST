"use client";

import type React from "react";
import { BackToList } from "@/components/BackLinks";
import { CookieSettingsButton } from "@/components/CookieConsent";
import { CONTACT_EMAIL } from "@/components/SiteFooter";
import { useStoredLocale } from "@/hooks/useStoredLocale";

const CONTACT = (
  <a href={`mailto:${CONTACT_EMAIL}`} className="text-white underline decoration-[#E21B24] underline-offset-4">
    {CONTACT_EMAIL}
  </a>
);

const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="mt-8 text-base font-bold text-white">{children}</h2>
);
const B: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <strong className="text-white">{children}</strong>
);

/** Informativa privacy nella lingua scelta nella lista. */
export function PrivacyContent() {
  const it = useStoredLocale() === "it";

  return (
    <main className="mx-auto max-w-2xl px-6 py-14 text-sm leading-relaxed text-neutral-300">
      <BackToList label={it ? "Torna alla lista" : "Back to the list"} />
      <h1 className="mt-6 text-3xl font-black text-white">{it ? "Informativa privacy" : "Privacy policy"}</h1>
      <p className="mt-2 text-xs text-neutral-500">
        {it ? "Ultimo aggiornamento: novembre 2026" : "Last updated: November 2026"}
      </p>

      <H2>{it ? "Chi siamo" : "Who we are"}</H2>
      <p className="mt-2">
        {it
          ? "MARVELIST è un progetto fan non ufficiale, non affiliato a Marvel Studios o a The Walt Disney Company. Per qualsiasi richiesta sulla privacy scrivi a "
          : "MARVELIST is an unofficial fan project, not affiliated with Marvel Studios or The Walt Disney Company. For any privacy request, write to "}
        {CONTACT}.
      </p>

      <H2>{it ? "Senza account" : "Without an account"}</H2>
      <p className="mt-2">
        {it
          ? "Puoi usare il sito senza registrarti. In questo caso i tuoi progressi (titoli visti e voti) restano solo nel tuo browser e non vengono inviati a noi."
          : "You can use the site without signing up. In that case your progress (watched titles and ratings) stays only in your browser and is not sent to us."}
      </p>

      <H2>{it ? "Con un account (facoltativo)" : "With an account (optional)"}</H2>
      <p className="mt-2">
        {it
          ? "Se accedi con Google raccogliamo nome, indirizzo email e foto del profilo forniti da Google, e salviamo nel tuo account i tuoi progressi (titoli visti e voti), per sincronizzarli tra i tuoi dispositivi. Salviamo anche l'username, il nome, il cognome e la foto che scegli nel tuo profilo. Non usiamo questi dati per pubblicità e non li vendiamo."
          : "If you sign in with Google we collect the name, email address and profile photo provided by Google, and we save your progress (watched titles and ratings) in your account to sync it across your devices. We also save the username, first name, last name and photo you choose in your profile. We do not use this data for advertising and we do not sell it."}
      </p>

      <H2>{it ? "Fornitori" : "Providers"}</H2>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>
          {it
            ? "Clerk, per la gestione degli accessi e dei dati dell'account."
            : "Clerk, to manage sign-in and account data."}
        </li>
        <li>
          {it
            ? "Vercel, per l'hosting del sito e le statistiche anonime delle visite."
            : "Vercel, to host the site and for anonymous visit statistics."}
        </li>
        <li>{it ? "Google, per l'accesso con il tuo account Google." : "Google, to sign in with your Google account."}</li>
        <li>
          {it
            ? "TMDB, da cui provengono locandine e informazioni sui titoli. Questo prodotto usa l'API di TMDB ma non è approvato né certificato da TMDB."
            : "TMDB, the source of posters and title information. This product uses the TMDB API but is not endorsed or certified by TMDB."}
        </li>
      </ul>
      <p className="mt-2">
        {it
          ? "Alcuni di questi fornitori possono trattare i dati fuori dall'Unione Europea, con le garanzie previste dalle loro condizioni."
          : "Some of these providers may process data outside the European Union, with the safeguards set out in their terms."}
      </p>

      <H2>{it ? "Cookie e dati nel browser" : "Cookies and browser data"}</H2>
      <p className="mt-2">
        {it
          ? "MARVELIST usa strumenti tecnici, necessari al funzionamento del sito, e statistiche anonime facoltative."
          : "MARVELIST uses technical tools needed for the site to work, and optional anonymous statistics."}
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>
          <B>{it ? "Memoria del browser (localStorage)" : "Browser storage (localStorage)"}</B>
          {it
            ? ": salva i tuoi progressi, la lingua, la vista a griglia o lista, le impostazioni del video di sfondo e se hai già visto l'invito ad accedere. Restano sul tuo dispositivo."
            : ": saves your progress, language, grid or list view, background video settings and whether you have already seen the sign-in prompt. It stays on your device."}
        </li>
        <li>
          <B>{it ? "Cookie di accesso (Clerk)" : "Sign-in cookies (Clerk)"}</B>
          {it
            ? ": solo se accedi con Google, servono a mantenerti collegato. Sono cookie tecnici."
            : ": only if you sign in with Google, they keep you signed in. They are technical cookies."}
        </li>
        <li>
          <B>{it ? "Statistiche (Vercel Web Analytics)" : "Statistics (Vercel Web Analytics)"}</B>
          {it
            ? ": contano le visite in forma anonima e aggregata (pagine viste, provenienza, tipo di dispositivo), senza cookie e senza profilare chi visita il sito. Solo se le accetti."
            : ": count visits in anonymous, aggregated form (page views, referrer, device type), without cookies and without profiling visitors. Only if you accept them."}
        </li>
      </ul>
      <p className="mt-2">
        {it
          ? "Non usiamo cookie pubblicitari o di profilazione. I trailer si aprono su YouTube: lì valgono le regole di YouTube. Le statistiche si attivano solo se scegli “Accetta tutti” nell'avviso dei cookie."
          : "We do not use advertising or profiling cookies. Trailers open on YouTube, where YouTube's rules apply. Statistics are enabled only if you choose “Accept all” in the cookie notice."}
      </p>
      <CookieSettingsButton label={it ? "Modifica le preferenze sui cookie" : "Change cookie preferences"} />

      <H2>{it ? "Per quanto tempo" : "How long"}</H2>
      <p className="mt-2">
        {it
          ? "Conserviamo i dati dell'account finché non chiedi di cancellarlo. Puoi chiederne la cancellazione, una copia o la correzione scrivendo a "
          : "We keep account data until you ask us to delete it. You can ask for deletion, a copy or a correction by writing to "}
        {CONTACT}.
      </p>

      <H2>{it ? "I tuoi diritti" : "Your rights"}</H2>
      <p className="mt-2">
        {it
          ? "Hai diritto di accesso, rettifica, cancellazione, limitazione, portabilità e opposizione, e di presentare reclamo al Garante per la protezione dei dati personali."
          : "You have the right of access, rectification, erasure, restriction, portability and objection, and the right to lodge a complaint with the Italian Data Protection Authority (Garante per la protezione dei dati personali)."}
      </p>
    </main>
  );
}
