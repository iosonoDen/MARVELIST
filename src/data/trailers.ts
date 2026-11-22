/**
 * Trailer ufficiali su YouTube per ogni titolo.
 * - it: canale "Marvel Italia"
 * - en: canale "Marvel Entertainment"
 * Ogni ID è stato verificato con YouTube oEmbed (canale e disponibilità).
 * Se manca la versione italiana si usa quella inglese. Se mancano entrambe
 * (Iron Man, L'incredibile Hulk, Iron Man 2: nessun trailer sui canali Marvel)
 * il pulsante apre una ricerca su YouTube.
 */
export interface TrailerIds { it?: string; en?: string }

export const TRAILERS: Record<string, TrailerIds> = {
  // en: Thor - Trailer (OFFICIAL)
  'thor': { en: 'JOddp-nlNvQ' },
  // en: Captain America: The First Avenger - Trailer
  'captain-america-the-first-avenger': { en: 'JerVrbLldXw' },
  // it: Marvel's The Avengers (2012) Guarda il Trailer Ufficiale | HD  ·  en: Marvel's The Avengers- Trailer (OFFICIAL)
  'the-avengers': { it: '21-RSDPmLjg', en: 'eOrNdBpGMv8' },
  // it: Iron Man 3 -- Trailer Marvel Ufficiale | HD  ·  en: Marvel's Iron Man 3 Domestic Trailer (OFFICIAL)
  'iron-man-3': { it: 'GgDDXXeYJeI', en: 'f_h95mEd4TI' },
  // it: Thor: The Dark World - Trailer Ufficiale Italiano | HD  ·  en: Thor: The Dark World Official Trailer HD
  'thor-the-dark-world': { it: 'gIBSuYgRIm0', en: 'npvJ9FTgZbM' },
  // it: Captain America: The Winter Soldier -- Trailer Ufficiale Italiano | HD  ·  en: Marvel's Captain America: The Winter Soldier - Trailer 1 (OFFICIAL)
  'captain-america-the-winter-soldier': { it: 'rrazrrd-1ck', en: 'tbayiPxkUMM' },
  // it: Guardiani della Galassia - Trailer ufficiale italiano | HD  ·  en: Marvel's Guardians of the Galaxy - Trailer 1 (OFFICIAL)
  'guardians-of-the-galaxy': { it: 'PYcgR4iP8r8', en: 'd96cjJhvlMA' },
  // it: Marvel's Avengers: Age of Ultron - Extended Trailer Ufficiale | HD  ·  en: New Avengers Trailer Arrives - Marvel's Avengers: Age of Ultron Trailer 2
  'avengers-age-of-ultron': { it: '1WZwGFgxcP4', en: 'MZoO8QVMxkk' },
  // it: Marvel's Ant-Man - Trailer Ufficiale Italiano | HD  ·  en: Marvel's Ant-Man - Trailer 1
  'ant-man': { it: 'nbcbZlAbg9w', en: 'pWdKf3MneyI' },
  // it: Captain America: Civil War - Trailer Ufficiale | HD  ·  en: The Civil War Begins – 1st Trailer for Marvel’s “Captain America: Civil War”
  'captain-america-civil-war': { it: '60rieTQs1RM', en: '43NWzay3W4s' },
  // it: Marvel's Doctor Strange | Secondo Trailer Ufficiale Italiano | HD  ·  en: Doctor Strange Official Trailer 2
  'doctor-strange': { it: 'MnhDI8Qktuo', en: 'HSzx-zryEgM' },
  // it: Guardiani della Galassia Vol. 2 - Trailer Ufficiale Italiano  ·  en: Guardians of the Galaxy Vol. 2 - Trailer 3 (Official)
  'guardians-of-the-galaxy-vol-2': { it: 'zRmvEVSfElw', en: 'wUn05hdkhjM' },
  // it: Spider-Man: Homecoming - Trailer Italiano Ufficiale | HD  ·  en: Spider-Man: Homecoming - Trailer 1
  'spider-man-homecoming': { it: 'rs64hwoQSiI', en: '8wNgphPi5VM' },
  // it: Thor: Ragnarok - Trailer Ufficiale Italiano | HD  ·  en: "Thor: Ragnarok" Official Trailer
  'thor-ragnarok': { it: 'D7UpZmPmwSo', en: 'ue80QwXMRHg' },
  // it: Black Panther - Trailer Ufficiale Italiano | HD  ·  en: Marvel Studios' Black Panther - Official Trailer
  'black-panther': { it: 'Jd8rl7_u2As', en: 'xjDjIWPwcPU' },
  // it: Avengers: Infinity War – Trailer Ufficiale Italiano | HD  ·  en: Marvel Studios' Avengers: Infinity War Official Trailer
  'avengers-infinity-war': { it: 'gow1kuRimaQ', en: '6ZfuNTqbHE8' },
  // it: ANT-MAN AND THE WASP - Trailer Ufficiale Italiano | HD  ·  en: Marvel Studios' Ant-Man and the Wasp - Official Trailer #1
  'ant-man-and-the-wasp': { it: 'mIYQ3bpxcws', en: '8_rTIAOohas' },
  // it: Captain Marvel - NUOVO TRAILER ufficiale Italiano  ·  en: Marvel Studios' Captain Marvel - Official Trailer
  'captain-marvel': { it: 'RPqT-lFQZHY', en: 'Z1BCujX3pw8' },
  // it: Avengers: Endgame - TRAILER UFFICIALE ITALIANO | HD  ·  en: Marvel Studios' Avengers - Official Trailer
  'avengers-endgame': { it: 'vqWz0ZCpYBs', en: 'hA6hldpSTF8' },
  // it: Spider-Man: Far From Home - 2° Trailer ufficiale | Dal 10 luglio al cinema  ·  en: Spider-Man: Far From Home | Official Trailer
  'spider-man-far-from-home': { it: 't90CMbS_YGU', en: 'LFoz8ZJWmPs' },
  // it: Marvel Studios' Black Widow | Nuovo Trailer Ufficiale  ·  en: Marvel Studios' Black Widow | Official Trailer
  'black-widow': { it: 'sT2mSZCIpK4', en: 'ybji16u608U' },
  // it: Shang-Chi e la Leggenda dei Dieci Anelli | Trailer Ufficiale  ·  en: Marvel Studios’ Shang-Chi and the Legend of the Ten Rings | Official Trailer
  'shang-chi': { it: 'siWoO_0LSxM', en: '8YjFbMbfXaQ' },
  // it: Eternals | Trailer Finale  ·  en: Marvel Studios’ Eternals | Final Trailer
  'eternals': { it: 'NNivyq9gezI', en: 'x_me3xsvDgk' },
  // it: Spider-Man No Way Home: Teaser Trailer Ufficiale | A Natale al cinema  ·  en: SPIDER-MAN: NO WAY HOME - Official Trailer
  'spider-man-no-way-home': { it: 'jN7afGJn2aY', en: 'ZYzbalQ6Lg8' },
  // it: Doctor Strange nel Multiverso della Follia - Trailer Ufficiale  ·  en: Marvel Studios' Doctor Strange in the Multiverse of Madness | Official Trailer
  'doctor-strange-multiverse-of-madness': { it: 'DkqjdOIi6tk', en: 'aWzlQ2N6qqg' },
  // it: Thor: Love and Thunder | Trailer Ufficiale  ·  en: Marvel Studios' Thor: Love and Thunder | Official Trailer
  'thor-love-and-thunder': { it: '5mKjfZHDn_M', en: 'Go8nTmfrQd8' },
  // it: Black Panther: Wakanda Forever | Trailer Ufficiale  ·  en: Marvel Studios’ Black Panther: Wakanda Forever | Official Trailer
  'black-panther-wakanda-forever': { it: 'Tr0jSdADqjw', en: '_Z3QKkl1WyM' },
  // it: Ant-Man and the Wasp: Quantumania | Trailer Ufficiale  ·  en: Marvel Studios’ Ant-Man and The Wasp: Quantumania | Official Trailer
  'ant-man-and-the-wasp-quantumania': { it: 'zYb4tcBT8Uw', en: 'ZlNFpri-Y40' },
  // it: Marvel Studios’ Guardiani della Galassia Volume 3 | Trailer Ufficiale  ·  en: Marvel Studios’ Guardians of the Galaxy Vol. 3 | Official Trailer
  'guardians-of-the-galaxy-vol-3': { it: 'NXhrB7uZCV4', en: 'u3V5KDHRQvk' },
  // it: The Marvels | Trailer Ufficiale  ·  en: Marvel Studios' The Marvels | Official Trailer
  'the-marvels': { it: 'nrMX5IcQZpE', en: 'wS_qbDztgVY' },
  // it: Deadpool & Wolverine | Trailer Ufficiale  ·  en: Deadpool & Wolverine | Official Trailer | In Theaters July 26
  'deadpool-and-wolverine': { it: 'PDj4940Rw0E', en: '73_1biulkYk' },
  // it: Captain America: Brave New World | Trailer Ufficiale | Dal 12 Febbraio al Cinema  ·  en: Captain America: Brave New World | Official Trailer
  'captain-america-brave-new-world': { it: 'RSIkXjNpwTo', en: '1pHDWnXmK7Y' },
  // it: Thunderbolts* | Trailer Ufficiale | Dal 30 Aprile al Cinema  ·  en: Marvel Studios’ Thunderbolts* | Final Trailer | In Theaters May 2
  'thunderbolts': { it: 'MYj4iG7wOTk', en: '-sAOWhvheK8' },
  // it: I Fantastici Quattro: Gli Inizi | Trailer Ufficiale | Dal 23 Luglio al Cinema  ·  en: The Fantastic Four: First Steps | Official Trailer | Only in Theaters July 25
  'the-fantastic-four-first-steps': { it: 'oh4v714SEXk', en: 'pAsmrKyMqaA' },
  // en: SPIDER-MAN: BRAND NEW DAY – Final Trailer (Peter’s Journey) 4K
  'spider-man-brand-new-day': { en: 'daXaTug8rL4' },
  // it: Avengers: Doomsday | Trailer Ufficiale | Dal 16 Dicembre al Cinema  ·  en: Avengers: Doomsday | Official Trailer | In Theaters December 18
  'avengers-doomsday': { it: 'gUth3APCeyg', en: 'irVNGjRFZGk' },
  // it: Marvel Studios’ WandaVision | Trailer Ufficiale | Disney+  ·  en: WandaVision | Official Trailer | Disney+
  'wandavision': { it: 'FJt4pHxZo0s', en: 'sj9J2ecsSpo' },
  // it: Trailer Ufficiale | Marvel Studios’ The Falcon and the Winter Soldier | Disney+  ·  en: Official Trailer | The Falcon and the Winter Soldier | Disney+
  'the-falcon-and-the-winter-soldier': { it: 'dmnxU17AVhU', en: 'IWBsDaFWyTE' },
  // it: Loki | Trailer Ufficiale | Disney+  ·  en: Marvel Studios' Loki | Official Trailer | Disney+
  'loki': { it: 'qfaooHPiGgE', en: 'nW948Va-l10' },
  // it: Disney+ | What If...? - In Streaming dall'11 Agosto  ·  en: Marvel Studios' What If...? | Official Trailer | Disney+
  'what-if': { it: 'tNZf5ASC4Fk', en: 'x9D0uUKJ5KI' },
  // it: Disney+ | Hawkeye | Trailer Ufficiale - In Streaming dal 24 Novembre  ·  en: Marvel Studios’ Hawkeye | Official Trailer | Disney+
  'hawkeye': { it: 'z3MTcP2mJGc', en: '5VYb3B1ETlk' },
  // it: Disney+ | Moon Knight - In Esclusiva dal 30 Marzo  ·  en: Marvel Studios’ Moon Knight | Official Trailer | Disney+
  'moon-knight': { it: 'svFn1GD2izw', en: 'x7Krla_UxRg' },
  // it: Disney+ | Ms. Marvel - Disponibile in Esclusiva dall'8 Giugno  ·  en: Marvel Studios’ Ms. Marvel | Official Trailer | Disney+
  'ms-marvel': { it: 'hF4FWq6dUYA', en: 'm9EX0f6V11Y' },
  // it: Disney+ | She Hulk: Attorney at Law - Disponibile in Esclusiva dal 17 Agosto  ·  en: Official Trailer | She-Hulk: Attorney at Law | Disney+
  'she-hulk-attorney-at-law': { it: '1jaKLsJTviQ', en: 'gim2kprjL50' },
  // it: Disney+ | Marvel Studios Presenta: Licantropus - Disponibile in Esclusiva dal 7 Ottobre  ·  en: Marvel Studios’ Special Presentation: Werewolf By Night | Official Trailer | Disney+
  'werewolf-by-night': { it: '_Yh0GUxTyI4', en: 'bLEFqhS5WmI' },
  // it: Disney+ | Marvel Studios Presenta: Guardiani della Galassia Holiday Special - Dal 25 Novembre  ·  en: Marvel Studios’ Special Presentation: The Guardians of the Galaxy Holiday Special | Official Trailer
  'guardians-holiday-special': { it: '2Jc1rsg3UBA', en: 'OYhFFQl4fLs' },
  // it: Secret Invasion | Trailer Ufficiale | Disney+  ·  en: Marvel Studios’ Secret Invasion | Official Trailer | Disney+
  'secret-invasion': { it: 'aTR7HbDbIdU', en: 'qZVTkn2NjS0' },
  // it: Echo | Trailer Ufficiale | Disney+  ·  en: Marvel Studios' Echo | Official Trailer | Disney+ and Hulu
  'echo': { it: 'GtNehB32drU', en: 'AFUKnherhuw' },
  // it: Agatha All Along | Trailer Ufficiale | Disney+  ·  en: Marvel Television’s Agatha All Along | Official Trailer | Disney+
  'agatha-all-along': { it: 'wfzdGqrBPeg', en: 'R9pXbNz6Vbw' },
  // it: Daredevil: Rinascita | Trailer Ufficiale | Dal 5 Marzo su Disney+  ·  en: Marvel Television's Daredevil: Born Again | Official Trailer | Disney+
  'daredevil-born-again': { it: 'v-Q_ZvwFcik', en: '7xALolZzhSM' },
  // it: Ironheart | Trailer Ufficiale | Dal 25 Giugno su Disney+  ·  en: Marvel Television's Ironheart | Official Trailer | Disney+
  'ironheart': { it: 'S3TggWMQnbg', en: 'WpW36ldAqnM' },
  // it: Marvel Zombies | Trailer Ufficiale | Disney+  ·  en: Marvel Animation’s Marvel Zombies | Official Trailer | Disney+
  'marvel-zombies': { it: 'nj3HKSjV9W0', en: 'twHYF506-9Y' },
  // it: Wonder Man | Trailer Ufficiale | Dal 28 Gennaio su Disney+  ·  en: Marvel Television’s Wonder Man | Official Trailer | Disney+
  'wonder-man': { it: 'uKEjWr5sDoY', en: 'lgoxHC7WF9w' },
  // it: Il Vostro Amichevole Spider-Man di Quartiere | Trailer Ufficiale | Disney+  ·  en: Marvel Animation’s Your Friendly Neighborhood Spider-Man | Official Trailer | Disney+
  'your-friendly-neighborhood-spider-man': { it: 'B2HDro55Ci4', en: 'N3J2JRQg040' },
};

export const youtubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
