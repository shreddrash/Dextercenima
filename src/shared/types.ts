export type MediaType = 'movie' | 'tv';
export type DiscoverCategoryFilter = 'movie' | 'tv' | 'anime' | 'hindi' | 'show';
export type PlayerProviderId =
  | 'cinesrc'
  | 'vidfast'
  | 'vidsrc-buzz'
  | 'vidsrc-wtf'
  | 'bingr';

export interface MediaSummary {
  id: number;
  mediaType: MediaType;
  category?: DiscoverCategoryFilter;
  title: string;
  logo?: string;
  overview: string;
  poster: string;
  backdrop: string;
  score: string;
  voteCount: number;
  year: string;
  releaseDate: string;
  runtime: number | null;
  seasons: number | null;
  episodes: number | null;
  genreIds: number[];
  genres: string[];
  language: string;
  popularity: number;
  revenue?: number;
  country?: string;
  companyIds?: number[];
  directorIds?: number[];
  isLimitedSeries?: boolean;
  posterTheme?: 'cosmic' | 'anime' | 'thriller' | 'obsidian' | 'noir';
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile?: string;
  department?: string;
}

export interface EpisodeItem {
  id: number;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  overview: string;
  still?: string;
  airDate?: string;
  runtime: number | null;
}

export interface SeasonDetail {
  seasonNumber: number;
  title: string;
  overview: string;
  episodeCount: number;
  episodes: EpisodeItem[];
}

export interface MediaDetail extends MediaSummary {
  imdbId: string;
  contentRating: string;
  trailerEmbedUrl?: string;
  directors: Array<{ id: number; name: string; profile?: string }>;
  cast: CastMember[];
  collection?: {
    id: number;
    name: string;
    parts: MediaSummary[];
  };
  recommendations: MediaSummary[];
  seasonsDetail?: SeasonDetail[];
}

export interface PersonResult {
  id: number;
  name: string;
  profile: string;
  popularity: number;
  department: string;
  knownFor: string[];
  biography?: string;
  birthday?: string;
  placeOfBirth?: string;
  credits?: MediaSummary[];
}

export interface PlayRecord {
  key: string;
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  poster: string;
  backdrop?: string;
  year: string;
  score: string;
  season: number;
  episode: number;
  totalEpisodes: number;
  provider: PlayerProviderId;
  progressSeconds: number;
  durationSeconds: number;
  updatedAt: number;
}

export interface FavoriteItem {
  key: string;
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  poster: string;
  year: string;
  score: string;
  genres: string[];
  savedAt: number;
}
