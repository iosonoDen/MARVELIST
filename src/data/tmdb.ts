/**
 * Metadati TMDB (https://www.themoviedb.org) per ogni voce del database.
 * id = ID TMDB, kind = 'movie' | 'tv', poster = file_path del poster (lingua it-IT).
 * Rigenerabili da themoviedb.org: /{kind}/{id} → immagine og:image.
 */
export interface TMDBMeta { id: number; kind: 'movie' | 'tv'; poster: string }

export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/';

export const tmdbPosterUrl = (path: string, size: 'w342' | 'w500' | 'w780' | 'original' = 'w500') =>
  path ? `${TMDB_IMAGE_BASE}${size}${path}` : '';

export const tmdbPageUrl = (meta: TMDBMeta, locale: 'it' | 'en' = 'it') =>
  `https://www.themoviedb.org/${meta.kind}/${meta.id}?language=${locale === 'it' ? 'it-IT' : 'en-US'}`;

export const TMDB_META: Record<string, TMDBMeta> = {
  'iron-man': { id: 1726, kind: 'movie', poster: '/xWXuFC4FY0inQ1QsnDrE7fGwFEd.jpg' },
  'the-incredible-hulk': { id: 1724, kind: 'movie', poster: '/xaegYELleYoOMH0a8SMQ4nQnhSm.jpg' },
  'iron-man-2': { id: 10138, kind: 'movie', poster: '/lWSyc4wVNQyjlCtcZSIDauJTInI.jpg' },
  'thor': { id: 10195, kind: 'movie', poster: '/vW6R9uQuuFaPyasAPlXTy7H202G.jpg' },
  'captain-america-the-first-avenger': { id: 1771, kind: 'movie', poster: '/8kIQzFBgbcTs8ALH0xSAFTwzacH.jpg' },
  'the-avengers': { id: 24428, kind: 'movie', poster: '/o6IvnjWsAjPja21JA1EHo0XcYTy.jpg' },
  'iron-man-3': { id: 68721, kind: 'movie', poster: '/zJ1ET3yE9SIkiZLTY6r9BjCvt1i.jpg' },
  'thor-the-dark-world': { id: 76338, kind: 'movie', poster: '/6jHwW0zavzqJssGbAW451nk2qPq.jpg' },
  'captain-america-the-winter-soldier': { id: 100402, kind: 'movie', poster: '/t8i8kRBQbRHapK317bEYr8F3lpQ.jpg' },
  'guardians-of-the-galaxy': { id: 118340, kind: 'movie', poster: '/km1QPJeX93KCp6fqAcBf4Urijtc.jpg' },
  'avengers-age-of-ultron': { id: 99861, kind: 'movie', poster: '/pYEHarIwyYSM1bXs5FtpL2GZELy.jpg' },
  'ant-man': { id: 102899, kind: 'movie', poster: '/c9QcbZHv0DZ2nm2sS2akqqrir8y.jpg' },
  'captain-america-civil-war': { id: 271110, kind: 'movie', poster: '/pgHro44BXVY03C3sEj88fpLS06m.jpg' },
  'doctor-strange': { id: 284052, kind: 'movie', poster: '/xSFDetkEgs2omBgLWtxpo2WgU71.jpg' },
  'guardians-of-the-galaxy-vol-2': { id: 283995, kind: 'movie', poster: '/zB9PgHUepL1aP6TJyZYuKTTUgWD.jpg' },
  'spider-man-homecoming': { id: 315635, kind: 'movie', poster: '/qudkR3ZlpG6PVGWUaf0G70KWl65.jpg' },
  'thor-ragnarok': { id: 284053, kind: 'movie', poster: '/iunkSeLonYKVmp89zCJuJVptUTU.jpg' },
  'black-panther': { id: 284054, kind: 'movie', poster: '/5mxlzNZFeuWRcAZV6ECOwYfN7oZ.jpg' },
  'avengers-infinity-war': { id: 299536, kind: 'movie', poster: '/t24aimjQLa0dyoZQEbSws7XK1U0.jpg' },
  'ant-man-and-the-wasp': { id: 363088, kind: 'movie', poster: '/J4n3Cf4okqEuAH4esQKOnuYcZR.jpg' },
  'captain-marvel': { id: 299537, kind: 'movie', poster: '/ndo3IkcvMhhE4g6ZIlxZpwdT5ve.jpg' },
  'avengers-endgame': { id: 299534, kind: 'movie', poster: '/8miyORCKx1lMYtc5YmqHyiVLwDF.jpg' },
  'spider-man-far-from-home': { id: 429617, kind: 'movie', poster: '/blWCg2gs0uQiEl4e3ml6j3yDSKg.jpg' },
  'black-widow': { id: 497698, kind: 'movie', poster: '/uvQOOzAQWEj8MUkqdwQEfDgzXfd.jpg' },
  'shang-chi': { id: 566525, kind: 'movie', poster: '/rhW4Uo7iVdAf2wgAjpIgkkObBE8.jpg' },
  'eternals': { id: 524434, kind: 'movie', poster: '/753WHOCaelFNYtUlcYZtNDhD9ZC.jpg' },
  'spider-man-no-way-home': { id: 634649, kind: 'movie', poster: '/xLnZ0DB06H0MuGXcF0uhJxr6b8y.jpg' },
  'doctor-strange-multiverse-of-madness': { id: 453395, kind: 'movie', poster: '/fh62tD1EuavkTpEgVA7U4V7d2Yj.jpg' },
  'thor-love-and-thunder': { id: 616037, kind: 'movie', poster: '/AdJ1CM122jyAhWps7qhRvcmDn87.jpg' },
  'black-panther-wakanda-forever': { id: 505642, kind: 'movie', poster: '/jcDnXDBMj11W4jfa8oeUON1lcut.jpg' },
  'ant-man-and-the-wasp-quantumania': { id: 640146, kind: 'movie', poster: '/4cSf5MRlzkRX7oluXo0N6v8H1uH.jpg' },
  'guardians-of-the-galaxy-vol-3': { id: 447365, kind: 'movie', poster: '/5N35QH1v65wDIQie4kAMtLaQFP6.jpg' },
  'the-marvels': { id: 609681, kind: 'movie', poster: '/loFp0xOdy4VxLzC2OthMcNz5pA5.jpg' },
  'deadpool-and-wolverine': { id: 533535, kind: 'movie', poster: '/tDYG0QPL54nUKDUoBPdvtsmzbBI.jpg' },
  'captain-america-brave-new-world': { id: 822119, kind: 'movie', poster: '/ypQnN8NuMXN9PzFt4b7tVtGtb2y.jpg' },
  'thunderbolts': { id: 986056, kind: 'movie', poster: '/2q16SeTsXCgigsl8uV85qDN4375.jpg' },
  'the-fantastic-four-first-steps': { id: 617126, kind: 'movie', poster: '/lnatQ2ZgpTJet7jqjGPRo2h9Xuw.jpg' },
  'spider-man-brand-new-day': { id: 969681, kind: 'movie', poster: '/1GI1iyqqsaykl7LNKVwHLiorDhE.jpg' },
  'avengers-doomsday': { id: 1003596, kind: 'movie', poster: '/6uOkzW0gF1ANWz2flhwXfTUQuLY.jpg' },
  'wandavision': { id: 85271, kind: 'tv', poster: '/ijWWwINc8h71NQ8j1LTJMFSj5wr.jpg' },
  'the-falcon-and-the-winter-soldier': { id: 88396, kind: 'tv', poster: '/6kbAMLteGO8yyewYau6bJ683sw7.jpg' },
  'loki': { id: 84958, kind: 'tv', poster: '/qLcQc2Emc3GZfZAhHpf8wAbM0d2.jpg' },
  'what-if': { id: 91363, kind: 'tv', poster: '/blQIK1T9DxluV867Sm3McMbDC3L.jpg' },
  'hawkeye': { id: 88329, kind: 'tv', poster: '/2hVSIuRLmYsguq2oAoIaInwMVyT.jpg' },
  'moon-knight': { id: 92749, kind: 'tv', poster: '/oQ8D99pDbsLxcdCMqErm6qVMh3C.jpg' },
  'ms-marvel': { id: 92782, kind: 'tv', poster: '/3HWWh92kZbD7odwJX7nKmXNZsYo.jpg' },
  'she-hulk-attorney-at-law': { id: 92783, kind: 'tv', poster: '/5rAEXNru5V0b8lmBbEaqjfnq8XR.jpg' },
  'werewolf-by-night': { id: 894205, kind: 'movie', poster: '/3b5Ue7CygC7yFGSHITnCUwVXapF.jpg' },
  'guardians-holiday-special': { id: 774752, kind: 'movie', poster: '/o33yop9j5rVmdqqSU07FnrDlEEO.jpg' },
  'secret-invasion': { id: 114472, kind: 'tv', poster: '/3rINdUPSy9AklJg74jWHOyUXuZd.jpg' },
  'echo': { id: 122226, kind: 'tv', poster: '/vFyJH630cF68LohVYjQW49074Sy.jpg' },
  'agatha-all-along': { id: 138501, kind: 'tv', poster: '/jefhjbhbeLhgfbrO9SRhw1cS50H.jpg' },
  'daredevil-born-again': { id: 202555, kind: 'tv', poster: '/ixvUubkN1Nlizw3N4zYcQnkZ3Pm.jpg' },
  'ironheart': { id: 114471, kind: 'tv', poster: '/nDdesJoWpvCoAwPO0EsPz0NruOU.jpg' },
  'marvel-zombies': { id: 138505, kind: 'tv', poster: '/mwKj9ERGFXsWot0nXgQ5yMQf9I7.jpg' },
  'wonder-man': { id: 198178, kind: 'tv', poster: '/6yy9nQlFt2l6UVWzrfhszFCaZ5C.jpg' },
  'your-friendly-neighborhood-spider-man': { id: 138503, kind: 'tv', poster: '/bsBzQ4MlUKZFib477jQzG8cEkuG.jpg' },
};
