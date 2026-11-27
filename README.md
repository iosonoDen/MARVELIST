<div align="center">

<sub><b>English</b> · <a href="README_it.md">Italiano</a></sub>

<br><br>

<img src=".github/logo.svg" alt="MARVELIST" height="120">

<br>

<h2>Tired of forgetting which movies you have already watched?</h2>

The list of Marvel Cinematic Universe titles, and more, is

<h1>FINALLY HERE!</h1>

100+ titles, including 54 Marvel movies and series outside the MCU (Sony’s Spider-Man, Fox’s X-Men, Netflix and more).

Keep track of what you have already watched and rate every title. Available in English and Italian. Posters, cast and metadata come from <a href="https://www.themoviedb.org/">TMDB</a>.

<br>

<h3>The site is finally live here</h3>

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

## Project structure

```
src/
├─ app/
│  ├─ page.tsx                # main page
│  ├─ layout.tsx              # shared layout, fonts, cookies
│  ├─ api/
│  │  ├─ tmdb/                # cast and posters from TMDB (server only)
│  │  ├─ progress/            # progress saved in the account
│  │  └─ profile/username/    # username, one change per month
│  ├─ login-page/             # Google sign-in (Clerk)
│  ├─ signup-page/            # Google sign-up (Clerk)
│  ├─ sso-callback/           # return from Google
│  ├─ privacy/                # privacy policy (IT / EN)
│  └─ s/[code]/               # shared challenge link, with preview image
├─ assets/fonts/              # fonts for the share images
├─ components/                # cards, list rows, title details, search, header, profile, certificate…
├─ data/
│  ├─ rows.ts                 # title row format
│  ├─ mcu-canon.ts            # MCU titles (and builds the full database)
│  ├─ beyond-mcu.ts           # Marvel titles outside the MCU
│  ├─ timeline-order.ts       # canonical timeline order
│  ├─ tmdb.ts                 # TMDB IDs and posters
│  ├─ trailers.ts             # official YouTube trailers (IT / EN)
│  ├─ producers.ts            # studio or network of each title
│  └─ legacy-ids.ts           # migration of old IDs (do not edit)
├─ hooks/                     # saved progress, sync, language, view mode
├─ lib/
│  ├─ saga.ts                 # ranks and saga progress
│  ├─ cast-search.ts          # search by character and actor
│  ├─ progress-sync.ts        # merges local and account progress
│  ├─ username.ts             # username rules
│  ├─ consent.ts              # cookie choice
│  └─ tmdb-server.ts          # TMDB requests (server only)
├─ types/                     # TypeScript types
└─ utils/                     # phase and universe labels
public/search/                # full casts for the search, downloaded only when needed
scripts/build-search-index.mts  # rebuilds the search files from TMDB
```

## Credits and disclaimer

This product uses the TMDB API. Posters, cast photos and metadata are © [TMDB](https://www.themoviedb.org/) and their respective owners.

MARVELIST is an unofficial fan project. It is not affiliated with any of the brands featured on the site. Marvel, its logos and its characters are registered trademarks of their respective owners. The background video is Marvel material.
