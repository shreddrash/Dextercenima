export type MediaType = 'movie' | 'tv';

export type StreamingPlatform =
  | 'netflix'
  | 'prime'
  | 'crunchyroll'
  | 'sports'
  | 'worldchannels';

export type SportKind = 'football' | 'cricket' | 'other';

export interface SportStreamSource {
  id: string;
  label: string;
  language: string;
  quality?: string;
  url: string;
  kind: 'hls';
}

export interface SportMatch {
  id: string;
  sport: SportKind;
  isLive: boolean;
  matchStatus: 'live' | 'upcoming';
  kickoffTime?: string;
  statusDetail?: string;
  tournament: string;
  title: string;
  team1: string;
  team2: string;
  team1Badge?: string;
  team2Badge?: string;
  team1Color?: string;
  team2Color?: string;
  team1Score?: string;
  team2Score?: string;
  banner: string;
  scoreline?: string;
  venue?: string;
  languages?: string[];
  streams: SportStreamSource[];
}

export interface WorldChannel {
  id: string;
  name: string;
  logo: string;
  country: string;
  region: string;
  quality: string;
  group: string;
  url: string;
}

export type DiscoverCategoryFilter = 'all' | 'movie' | 'tv' | 'anime' | 'hindi' | 'kids' | 'show';

export interface MediaSummary {
  id: number;
  mediaType: MediaType;
  category?: 'movie' | 'tv' | 'anime' | 'show' | 'kids';
  platforms?: StreamingPlatform[];
  exclusiveOn?: StreamingPlatform;
  title: string;
  logo?: string;
  overview: string;
  poster: string;
  backdrop: string;
  posterTheme?: 'obsidian' | 'cosmic' | 'noir' | 'anime' | 'thriller';
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
  country?: string;
  popularity: number;
  revenue?: number;
  companyIds?: number[];
  directorIds?: number[];
  isLimitedSeries?: boolean;
  isKids?: boolean;
  maturityRating?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile?: string;
}

export interface EpisodeItem {
  id: number;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  overview: string;
  still?: string;
  airDate?: string;
  runtime?: number | null;
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

export type PlayerProviderId = 'cinesrc' | 'bingr' | 'vidfast' | 'vidsrc-buzz' | 'vidsrc-wtf';

export interface PlayerProviderInfo {
  id: PlayerProviderId;
  label: string;
  tagline: string;
}

export interface PlayRecord {
  key: string;
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  poster: string;
  backdrop: string;
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

export type ProfileAvatarId =
  | 'dexter-crest'
  | 'netflix-red'
  | 'netflix-blue'
  | 'netflix-gold'
  | 'netflix-emerald'
  | 'netflix-purple'
  | 'netflix-kids'
  | 'prime-ghost'
  | 'crunchyroll-orange'
  | 'sports-emerald';

export interface UserProfile {
  id: string;
  name: string;
  avatarId: ProfileAvatarId;
  isKids: boolean;
  platform?: StreamingPlatform;
  preferredLanguage?: string;
  createdAt: number;
}
