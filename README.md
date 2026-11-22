# MARVELIST

A watchlist for the **Marvel Cinematic Universe**: 57 titles across movies, series and Disney+ specials. Mark what you have watched and rate each title with half stars.
Available in English and Italian. Posters, cast and metadata come from [TMDB](https://www.themoviedb.org/).

## Features

- 39 movies and 18 series or specials, sorted by **canonical timeline** or **release date**
- Filters by type (movies or series), status (watched or unwatched) and phase, plus search by title or year
- **Grid** or **list** view
- Ratings from 0.5 to 5 stars and a saga progress bar
- A detail view for each title with synopsis, **cast with photos** and a direct link to the **official trailer** (Marvel Italia or Marvel Entertainment)
- Progress saved in your browser (`localStorage`), with no account
- **Excel export and import** (`.xlsx`) to back up your progress or move it to another device
- A background video with volume and visibility controls

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · SheetJS (`xlsx`) · lucide-react

## Requirements

- **Node.js 20.9 or later**
- A free **TMDB** account, for cast photos and English posters

## Getting started

```bash
git clone https://github.com/iosonoDen/MARVELIST.git
cd MARVELIST
npm install
```

### 1. Get a TMDB credential

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/signup).
2. Go to **Settings → API** ([direct link](https://www.themoviedb.org/settings/api)) and request an API key for personal, non-commercial use.
3. Copy **one** of the two credentials. Either one works:
   - **API Read Access Token**: the long one that starts with `eyJ…` (recommended)
   - **API Key**: the short one, 32 characters

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and paste your credential:

```env
TMDB_API_KEY=your_credential
```

> `.env.local` is ignored by git, so your key stays on your machine.
> The key is used only on the server, in the `/api/tmdb/*` routes, and is never sent to the browser.

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**The app works without a credential too.** Posters, lists, ratings and Excel all keep working. Only the cast photos are missing: the cast names show instead.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Check types with TypeScript |

## Deploy on Vercel

1. Import the repository on [Vercel](https://vercel.com/new).
2. In **Project Settings → Environment Variables**, add `TMDB_API_KEY` with your credential.
3. Deploy. If you add or change the variable later, deploy again.

## Project structure

```
src/
├─ app/
│  ├─ page.tsx              # main page
│  └─ api/tmdb/             # server routes: cast (credits) and posters
├─ components/              # cards, list rows, detail modal, header, video background…
├─ data/
│  ├─ mcu-canon.ts          # database of the 57 titles
│  ├─ tmdb.ts               # TMDB IDs and posters
│  ├─ trailers.ts           # official YouTube trailers (IT / EN)
│  └─ legacy-ids.ts         # migration of old IDs (do not edit)
├─ hooks/                   # saved progress and view mode
├─ lib/tmdb-server.ts       # TMDB requests (server only)
└─ utils/                   # Excel export/import, phase labels
```

### Adding a title

Add a row to `src/data/mcu-canon.ts`, its TMDB data to `src/data/tmdb.ts` and, if available, its YouTube trailer IDs to `src/data/trailers.ts`, all with the same slug.
Each title's ID is its **slug**, so adding or moving rows never affects saved progress.

## Credits and disclaimer

- This product uses the TMDB API but is not endorsed or certified by TMDB.
  Posters, cast photos and metadata © [TMDB](https://www.themoviedb.org/) and their respective owners.
- MARVELIST is an unofficial fan project. It is not affiliated with Marvel Studios or The Walt Disney Company.
  Marvel, its logos and characters are trademarks of their respective owners. The background video is Marvel material; consider replacing it before making the site public.
