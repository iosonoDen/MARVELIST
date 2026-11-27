<div align="center">

<sub><a href="README.md">English</a> · <b>Italiano</b></sub>

<br><br>

<img src=".github/logo.svg" alt="MARVELIST" height="120">

<br>

<h2>Sei per caso stanco di non ricordarti che film hai guardato?</h2>

La lista dei titoli dell’Universo Cinematografico Marvel e non solo è

<h1>FINALMENTE QUI!</h1>

100+ titoli, di cui 54 film e serie Marvel al di fuori dell’MCU (Spider-Man della Sony, X-Men della Fox, Netflix e altro ancora).

Tieni traccia di ciò che hai già visto e valuta ogni titolo. Disponibile in inglese e italiano. I poster, il cast e i metadati provengono da <a href="https://www.themoviedb.org/">TMDB</a>.

<br>

<h3>Il sito è finalmente visionabile qui</h3>

<a href="https://marvel-ist.vercel.app/"><img src="https://img.shields.io/badge/marvel--ist.vercel.app-E21B24?style=for-the-badge&logo=vercel&logoColor=white" alt="marvel-ist.vercel.app" height="56"></a>

</div>

<br>

---

<h3 align="center">NERD INFOS</h3>

---

## Coding Stack

<p>
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 16">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4">
  <img src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk">
  <img src="https://img.shields.io/badge/lucide--react-F56565?style=for-the-badge&logo=lucide&logoColor=white" alt="lucide--react">
</p>

## Struttura del progetto

```
src/
├─ app/
│  ├─ page.tsx                # pagina principale
│  ├─ layout.tsx              # struttura comune, font, cookie
│  ├─ api/
│  │  ├─ tmdb/                # cast e locandine da TMDB (solo server)
│  │  ├─ progress/            # progressi salvati nell'account
│  │  └─ profile/username/    # username, un cambio al mese
│  ├─ login-page/             # accesso con Google (Clerk)
│  ├─ signup-page/            # registrazione con Google (Clerk)
│  ├─ sso-callback/           # ritorno da Google
│  ├─ privacy/                # informativa privacy (IT / EN)
│  └─ s/[code]/               # link sfida condiviso, con immagine di anteprima
├─ assets/fonts/              # font per le immagini da condividere
├─ components/                # card, righe, scheda titolo, ricerca, header, profilo, certificato…
├─ data/
│  ├─ rows.ts                 # formato delle righe dei titoli
│  ├─ mcu-canon.ts            # titoli MCU (e costruisce il database completo)
│  ├─ beyond-mcu.ts           # titoli Marvel fuori dall'MCU
│  ├─ timeline-order.ts       # ordine della timeline canonica
│  ├─ tmdb.ts                 # ID e locandine TMDB
│  ├─ trailers.ts             # trailer ufficiali su YouTube (IT / EN)
│  ├─ producers.ts            # studio o rete di ogni titolo
│  └─ legacy-ids.ts           # migrazione dei vecchi ID (non modificare)
├─ hooks/                     # progressi salvati, sincronizzazione, lingua, vista
├─ lib/
│  ├─ saga.ts                 # gradi e progresso della saga
│  ├─ cast-search.ts          # ricerca per personaggio e attore
│  ├─ progress-sync.ts        # unione dei progressi locali e dell'account
│  ├─ username.ts             # regole dell'username
│  ├─ consent.ts              # scelta sui cookie
│  └─ tmdb-server.ts          # richieste a TMDB (solo server)
├─ types/                     # tipi TypeScript
└─ utils/                     # etichette di fasi e universi
public/search/                # cast completi per la ricerca, scaricati solo quando servono
scripts/build-search-index.mts  # rigenera i file della ricerca da TMDB
```

## Crediti e avvertenze

Questo prodotto usa l’API di TMDB. Locandine, foto del cast e metadati sono © [TMDB](https://www.themoviedb.org/) e dei rispettivi proprietari.

MARVELIST è un progetto fan non ufficiale. Non è affiliato a nessuno dei marchi presenti sul sito. Marvel, i suoi loghi e i suoi personaggi sono marchi registrati dei rispettivi proprietari. Il video di sfondo è materiale Marvel.
