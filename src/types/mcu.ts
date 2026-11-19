export type MediaType = 'movie' | 'series';
export type MCUPhase = 'Phase 1' | 'Phase 2' | 'Phase 3' | 'Phase 4' | 'Phase 5' | 'Phase 6';

export interface CastMember {
  name: string;
  character: string;
  avatarUrl?: string;
}

export interface MCUEntry {
  id: string;
  slug: string;
  title: { it: string; en: string; };
  type: MediaType;
  phase: MCUPhase;
  releaseYear: number;
  releaseDate: string;
  timelineYear: string;
  timelineOrder: number;
  synopsis: { it: string; en: string; };
  posterUrl: string;
  trailerQuery: string;
  topCast: CastMember[];
  watched: boolean;
  rating: number;
  tmdbId?: number;
  tmdbType?: 'movie' | 'tv';
}

export type SortMode = 'timeline' | 'release';
export type FilterType = 'all' | 'movie' | 'series';
export type FilterStatus = 'all' | 'watched' | 'unwatched';
export type SupportedLocale = 'it' | 'en';