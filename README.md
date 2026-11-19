# MARVELIST — Cinematic MCU Watchlist

> Versione **1.2.0**

MARVELIST è una web app per tracciare la visione del Marvel Cinematic Universe (film e serie Disney+), con doppio ordinamento, voti a mezza stella e import/export Excel.

## Funzionalità

- **Next.js 16 (App Router)**, React 19, TypeScript in strict mode.
- **57 titoli**: 39 film (da *Iron Man* ad *Avengers: Doomsday*) e 18 serie e speciali Disney+.
- **Due ordinamenti**: cronologia interna al MCU (ordine Disney+, approssimato per le uscite più recenti) e data di uscita.
- **Filtri** per tipo, stato di visione e fase; ricerca per titolo o anno.
- **Voti da 0,5 a 5 stelle**. Cliccando di nuovo sullo stesso voto lo azzeri.
- **Salvataggio automatico** di "visto" e voti nel browser (`localStorage`, chiave `marvelist:progress:v1`).
- **Import/Export XLSX** con colonna `Voto` numerica: le mezze stelle non si perdono. I file esportati da versioni precedenti restano importabili.
- **Poster ufficiali da [TMDB](https://www.themoviedb.org/)** in versione italiana per tutti i 57 titoli, con link alla scheda TMDB nel dettaglio. ID e percorsi sono in `src/data/tmdb.ts`.
- **Interfaccia IT/EN**.

## Limiti attuali

- I dati restano nel singolo browser: non c'è ancora sincronizzazione tra dispositivi né login.
- Se un poster TMDB non carica, viene mostrata una copertina generata.
- Il pulsante trailer apre una ricerca su YouTube.

## Installazione locale

Richiede **Node.js 20.9 o superiore**.

```bash
git clone https://github.com/iosonoDen/MARVELIST.git
cd MARVELIST
npm install
npm run dev
```

Altri comandi: `npm run build`, `npm run lint`, `npm run typecheck`.

### Video di sfondo (opzionale)

Lo sfondo animato cerca `public/Marvel-Opening-Theme.mp4`, che **non è incluso nel repository**. Se manca, la pagina mostra un gradiente scuro. Usa solo video di cui hai i diritti.

## Crediti

Poster e metadati: [The Movie Database (TMDB)](https://www.themoviedb.org/). Questo prodotto usa dati TMDB ma non è approvato né certificato da TMDB.

## Licenza

Progetto personale a scopo didattico e dimostrativo. Marchi e personaggi appartengono a Marvel Studios e a The Walt Disney Company.
