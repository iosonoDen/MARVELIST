import type { Metadata } from "next";
import Link from "next/link";
import { CookieSettingsButton } from "@/components/CookieConsent";
import { CONTACT_EMAIL } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Informativa privacy · MARVELIST",
};

// Contatto per richieste sulla privacy.
const CONTACT = (
  <a href={`mailto:${CONTACT_EMAIL}`} className="text-white underline decoration-[#E21B24] underline-offset-4">
    {CONTACT_EMAIL}
  </a>
);

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-14 text-sm leading-relaxed text-neutral-300">
      <Link href="/" className="text-xs text-neutral-500 hover:text-white">
        ← Torna alla lista
      </Link>
      <h1 className="mt-6 text-3xl font-black text-white">Informativa privacy</h1>
      <p className="mt-2 text-xs text-neutral-500">Ultimo aggiornamento: novembre 2026</p>

      <h2 className="mt-8 text-base font-bold text-white">Chi siamo</h2>
      <p className="mt-2">
        MARVELIST è un progetto fan non ufficiale, non affiliato a Marvel Studios o a The Walt
        Disney Company. Per qualsiasi richiesta sulla privacy scrivi a {CONTACT}.
      </p>

      <h2 className="mt-8 text-base font-bold text-white">Senza account</h2>
      <p className="mt-2">
        Puoi usare il sito senza registrarti. In questo caso i tuoi progressi (titoli visti e
        voti) restano solo nel tuo browser e non vengono inviati a noi.
      </p>

      <h2 className="mt-8 text-base font-bold text-white">Con un account (facoltativo)</h2>
      <p className="mt-2">
        Se accedi con Google raccogliamo nome, indirizzo email e foto del profilo forniti da
        Google, e salviamo nel tuo account i tuoi progressi (titoli visti e voti), per
        sincronizzarli tra i tuoi dispositivi. Non usiamo questi dati per pubblicità e non li
        vendiamo.
      </p>

      <h2 className="mt-8 text-base font-bold text-white">Fornitori</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>Clerk, per la gestione degli accessi e dei dati dell&apos;account.</li>
        <li>Vercel, per l&apos;hosting del sito e le statistiche anonime delle visite.</li>
        <li>Google, per l&apos;accesso con il tuo account Google.</li>
        <li>
          TMDB, da cui provengono locandine e informazioni sui titoli. Questo prodotto usa
          l&apos;API di TMDB ma non è approvato né certificato da TMDB.
        </li>
      </ul>
      <p className="mt-2">
        Alcuni di questi fornitori possono trattare i dati fuori dall&apos;Unione Europea, con le
        garanzie previste dalle loro condizioni.
      </p>

      <h2 className="mt-8 text-base font-bold text-white">Cookie e dati nel browser</h2>
      <p className="mt-2">
        MARVELIST usa strumenti tecnici, necessari al funzionamento del sito, e statistiche
        anonime facoltative.
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>
          <strong className="text-white">Memoria del browser (localStorage)</strong>: salva i tuoi
          progressi, la lingua, la vista a griglia o lista, le impostazioni del video di sfondo e
          se hai già visto l&apos;invito ad accedere. Restano sul tuo dispositivo.
        </li>
        <li>
          <strong className="text-white">Cookie di accesso (Clerk)</strong>: solo se accedi con
          Google, servono a mantenerti collegato. Sono cookie tecnici.
        </li>
        <li>
          <strong className="text-white">Statistiche (Vercel Web Analytics)</strong>: contano le
          visite in forma anonima e aggregata (pagine viste, provenienza, tipo di dispositivo),
          senza cookie e senza profilare chi visita il sito. Solo se le accetti.
        </li>
      </ul>
      <p className="mt-2">
        Non usiamo cookie pubblicitari o di profilazione. I trailer si aprono su YouTube: lì
        valgono le regole di YouTube. Le statistiche si attivano solo se scegli &quot;Accetta
        tutti&quot; nell&apos;avviso dei cookie.
      </p>
      <CookieSettingsButton label="Modifica le preferenze sui cookie" />

      <h2 className="mt-8 text-base font-bold text-white">Per quanto tempo</h2>
      <p className="mt-2">
        Conserviamo i dati dell&apos;account finché non chiedi di cancellarlo. Puoi chiederne la
        cancellazione, una copia o la correzione scrivendo a {CONTACT}.
      </p>

      <h2 className="mt-8 text-base font-bold text-white">I tuoi diritti</h2>
      <p className="mt-2">
        Hai diritto di accesso, rettifica, cancellazione, limitazione, portabilità e opposizione,
        e di presentare reclamo al Garante per la protezione dei dati personali.
      </p>
    </main>
  );
}
