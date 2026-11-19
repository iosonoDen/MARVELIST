# MARVELIST — Cinematic MCU Watchlist & Architecture Tracker

> Release **v1.0.0** — Production Ready.

MARVELIST è una piattaforma web moderna creata per tracciare e gestire la visione canonica del Marvel Cinematic Universe (film e serie TV), arricchita da metadati cronologici ufficiali, preview trailer su Marvel IT, votazioni di precisione e sincronizzazione cloud su Vercel.

## Caratteristiche Tecniche
- **Next.js 15 (App Router)** con React 19 e TypeScript Strict Mode.
- **Design System Cinematografico:** Tema scuro perenne, accenti cremisi `#E21B24`, blur dinamico su video background.
- **57 Voci Canoniche:** Tutti i 40 film originali del file XLSX integrati con le 17 serie TV Disney+.
- **Doppio Ordinamento Nativo:** Timeline in-universe e data di uscita cinematografica reale.
- **Valutazione a 0.5 Stelle:** Slider WAI-ARIA conforme alle norme di accessibilità WCAG 2.1 AA.
- **Import/Export XLSX:** Compatibilità bidirezionale diretta con fogli di calcolo.
- **Proxy TMDB Edge Caching:** Recupero sicuro di poster e cast in alta risoluzione.
- **Sincronizzazione Multi-Dispositivo:** Supporto nativo per Vercel KV / Upstash Redis con fallback locale su `localStorage`.

## Installazione Locale

```bash
# Clona il repository
git clone https://github.com/iosonoDen/MARVELIST.git
cd MARVELIST

# Installa le dipendenze
npm install

# Avvia l'ambiente di sviluppo
npm run dev
```

Copia il file video `Marvel-Opening-Theme.mp4` nella cartella `public/` per attivare lo sfondo cinematografico animato.

## Licenza
Progetto personale ad uso didattico e dimostrativo. I marchi e i personaggi citati appartengono a Marvel Studios e The Walt Disney Company.