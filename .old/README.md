# MCU Checklist

Versione web locale del file `MCU-Check-List.xlsx`. React, TypeScript, Tailwind CSS e Vite. Non serve un backend, un database o un account per usare la checklist.

## Avvio su Mac

Usa Node.js 22.12 o superiore (consigliato un ramo LTS). Nella cartella del progetto:

```sh
node -v
npm install
npm run dev
```

Apri **http://localhost:5173**. Arresta il server con `Ctrl+C`. La porta è fissa: se è già in uso, libera la 5173 o avvia con `npm run dev -- --port 5174`. Cambiando porta accederai a uno spazio di salvataggio distinto.

## Dati e comportamento

- 40 film, 22 già visti (55%): importati titoli, ordine, ambientazioni, fasi, spunte e voti. Le ambientazioni rappresentano le indicazioni del foglio, non gli anni di uscita ufficiali. I dati iniziali sono in `src/data/films.json`.
- Ogni spunta aggiorna barra e contatori per l’intero catalogo. I filtri e l’ordinamento cambiano solo le righe mostrate.
- Puoi segnare o togliere un visto, impostare un voto da 1 a 5 o rimuoverlo con la X e annotare ogni film. Lo stato visto e il voto sono indipendenti.
- Le modifiche si salvano nel `localStorage` di questo browser, per indirizzo e porta. Non aggiornano l’Excel e non si sincronizzano su altri dispositivi. Cancellare i dati del sito rimuove le modifiche e ripristina il punto di partenza alla ricarica.
- Prova rapida: spunta `Ant-Man and the Wasp`, assegna un voto e scrivi una nota. Il conteggio passa a 23/40. Ricarica per controllare che le tre modifiche siano ancora presenti.

## Locandine TMDB (opzionale)

Le miniature iniziali sono segnaposto cliccabili che rimandano alle schede TMDB. Per mostrare le locandine remote, usa l’**API Read Access Token** di TMDB dalle impostazioni del tuo account:

```sh
cp .env.example .env.local
```

Inserisci il token dopo `TMDB_READ_TOKEN=` in `.env.local`, quindi esegui:

```sh
npm run posters
```

Il comando usa il token solo in Node.js per salvare gli URL pubblici delle locandine in `src/data/posters.json`; il file `.env.local` è escluso da Git. Non usare un prefisso `VITE_` per il token. Riavvia il server se hai già l’app aperta o rigenera la build. Non serve ripetere lo script a ogni avvio. Il browser carica dal CDN le immagini disponibili; per quelle mancanti o non raggiungibili resta il segnaposto. L’app mostra i crediti TMDB quando sono presenti locandine.

## Verifiche

```sh
npm test
npm run build
```

I test controllano import e contatori, filtri e salvataggi (lettura e validazione). La build controlla i tipi e genera il sito in `dist/`.
