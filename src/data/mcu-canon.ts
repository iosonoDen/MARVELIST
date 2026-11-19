import { MCUEntry } from '@/types/mcu';

export const INITIAL_MCU_DATABASE: MCUEntry[] = [
  {
    id: 'mcu-01',
    slug: 'captain-america-the-first-avenger',
    title: { it: 'Captain America: The First Avenger', en: 'Captain America: The First Avenger' },
    type: 'movie',
    phase: 'Phase 1',
    releaseYear: 2011,
    releaseDate: '2011-07-22',
    timelineYear: '1942-1945',
    timelineOrder: 1,
    synopsis: {
      it: 'Capitolo canonico del Marvel Cinematic Universe incentrato su Captain America: The First Avenger.',
      en: 'Official Marvel Cinematic Universe chapter detailing Captain America: The First Avenger.'
    },
    posterUrl: 'https://image.tmdb.org/t/p/w500/vSNxAJTlD0r02V9sPY2IHiK2PfQ.jpg',
    trailerQuery: 'Captain America: The First Avenger Trailer Ufficiale Italiano Marvel IT',
    topCast: [
      { name: 'Marvel Hero', character: 'Protagonista', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&fit=crop&q=80' },
      { name: 'Key Ally', character: 'Alleato', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=185&fit=crop&q=80' },
      { name: 'Antagonist', character: 'Avversario', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=185&fit=crop&q=80' },
      { name: 'Supporting Role', character: 'Supporto', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=185&fit=crop&q=80' }
    ],
    watched: true,
    rating: 3.0,
    tmdbId: 1771
  },
  {
    id: 'mcu-02',
    slug: 'captain-marvel',
    title: { it: 'Captain Marvel', en: 'Captain Marvel' },
    type: 'movie',
    phase: 'Phase 3',
    releaseYear: 2019,
    releaseDate: '2019-03-08',
    timelineYear: '1995.0',
    timelineOrder: 2,
    synopsis: {
      it: 'Capitolo canonico del Marvel Cinematic Universe incentrato su Captain Marvel.',
      en: 'Official Marvel Cinematic Universe chapter detailing Captain Marvel.'
    },
    posterUrl: 'https://image.tmdb.org/t/p/w500/AtsgWhDnHTq68L0lLsUrCnM7TDC.jpg',
    trailerQuery: 'Captain Marvel Trailer Ufficiale Italiano Marvel IT',
    topCast: [
      { name: 'Marvel Hero', character: 'Protagonista', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&fit=crop&q=80' },
      { name: 'Key Ally', character: 'Alleato', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=185&fit=crop&q=80' },
      { name: 'Antagonist', character: 'Avversario', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=185&fit=crop&q=80' },
      { name: 'Supporting Role', character: 'Supporto', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=185&fit=crop&q=80' }
    ],
    watched: true,
    rating: 3.0,
    tmdbId: 299537
  },
  {
    id: 'mcu-03',
    slug: 'iron-man',
    title: { it: 'Iron Man', en: 'Iron Man' },
    type: 'movie',
    phase: 'Phase 1',
    releaseYear: 2008,
    releaseDate: '2008-05-02',
    timelineYear: '2010.0',
    timelineOrder: 3,
    synopsis: {
      it: 'Capitolo canonico del Marvel Cinematic Universe incentrato su Iron Man.',
      en: 'Official Marvel Cinematic Universe chapter detailing Iron Man.'
    },
    posterUrl: 'https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
    trailerQuery: 'Iron Man Trailer Ufficiale Italiano Marvel IT',
    topCast: [
      { name: 'Marvel Hero', character: 'Protagonista', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&fit=crop&q=80' },
      { name: 'Key Ally', character: 'Alleato', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=185&fit=crop&q=80' },
      { name: 'Antagonist', character: 'Avversario', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=185&fit=crop&q=80' },
      { name: 'Supporting Role', character: 'Supporto', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=185&fit=crop&q=80' }
    ],
    watched: true,
    rating: 5.0,
    tmdbId: 1726
  }
];
