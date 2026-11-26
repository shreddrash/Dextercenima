import type { MediaType } from './types';

export interface CuratedCategoryConfig {
  slug: string;
  title: string;
  subtitle: string;
  mediaType: MediaType;
  query: Record<string, string>;
}

export const TOP_RATED_CATEGORIES: CuratedCategoryConfig[] = [
  {
    slug: 'top-rated-movies',
    title: 'Top 10 Movies Today',
    subtitle: 'Critically acclaimed features ranked across Dexterx Cenima',
    mediaType: 'movie',
    query: {
      sort_by: 'vote_average.desc',
      vote_average_gte: '7.0',
      vote_count_gte: '3000',
    },
  },
  {
    slug: 'top-rated-series',
    title: 'Top 10 Series Today',
    subtitle: 'Prestige television & dark anime sagas',
    mediaType: 'tv',
    query: {
      sort_by: 'vote_average.desc',
      vote_average_gte: '7.0',
      vote_count_gte: '500',
    },
  },
];

export const HOME_CURATED_CATEGORIES: CuratedCategoryConfig[] = [
  {
    slug: 'popular-movies',
    title: 'Trending Movies Now',
    subtitle: 'Most streamed features worldwide',
    mediaType: 'movie',
    query: { vote_count_gte: '500', sort_by: 'popularity.desc' },
  },
  {
    slug: 'hindi-blockbusters',
    title: 'Hindi & Bollywood Blockbusters',
    subtitle: 'Top Hindi cinema, action spectacles & classics',
    mediaType: 'movie',
    query: { language: 'hi', sort_by: 'popularity.desc' },
  },
  {
    slug: 'popular-series',
    title: 'Binge-Worthy Series',
    subtitle: 'Trending global drama, sci-fi & thriller series',
    mediaType: 'tv',
    query: { vote_count_gte: '100', sort_by: 'popularity.desc' },
  },
  {
    slug: 'hindi-series',
    title: 'Hindi Web Series',
    subtitle: 'Acclaimed Indian crime, drama & thriller originals',
    mediaType: 'tv',
    query: { language: 'hi', sort_by: 'popularity.desc' },
  },
  {
    slug: 'anime-dominion',
    title: 'Anime Dominion',
    subtitle: 'Dark fantasy & high-octane animated series',
    mediaType: 'tv',
    query: { type: 'anime', sort_by: 'popularity.desc' },
  },
  {
    slug: 'scifi-fantasy-movies',
    title: 'Sci-Fi & Cyberpunk Vault',
    subtitle: 'Dystopian futures, cosmic odysseys, and neo-noir',
    mediaType: 'movie',
    query: { with_genres: '878,14', sort_by: 'popularity.desc' },
  },
  {
    slug: 'action-thrillers',
    title: 'High-Octane Action & Thrillers',
    subtitle: 'Adrenaline cinema & midnight suspense',
    mediaType: 'movie',
    query: { with_genres: '28,53', sort_by: 'popularity.desc' },
  },
  {
    slug: 'crime-movies',
    title: 'Crime & Mystery Vault',
    subtitle: 'Heists, neo-noir detectives & underworld sagas',
    mediaType: 'movie',
    query: { with_genres: '80,9648', sort_by: 'popularity.desc' },
  },
  {
    slug: 'horror-movies',
    title: 'Horror & Supernatural',
    subtitle: 'Chilling midnight terror',
    mediaType: 'movie',
    query: { with_genres: '27', sort_by: 'popularity.desc' },
  },
  {
    slug: 'comedy-movies',
    title: 'Comedy & Feel-Good Hits',
    subtitle: 'Smart comedies & crowd-pleasers',
    mediaType: 'movie',
    query: { with_genres: '35', sort_by: 'popularity.desc' },
  },
  {
    slug: 'korean-cinema',
    title: 'Korean Cinema & Thrillers',
    subtitle: 'Acclaimed K-Cinema masterpieces',
    mediaType: 'movie',
    query: { language: 'ko', sort_by: 'popularity.desc' },
  },
  {
    slug: 'nolan-films',
    title: 'Christopher Nolan Collection',
    subtitle: 'Time-bending architectural epics',
    mediaType: 'movie',
    query: { with_people: '525', sort_by: 'popularity.desc' },
  },
  {
    slug: 'villeneuve-films',
    title: 'Denis Villeneuve Collection',
    subtitle: 'Atmospheric sci-fi and razor-sharp thrillers',
    mediaType: 'movie',
    query: { with_people: '27571', sort_by: 'popularity.desc' },
  },
  {
    slug: 'marvel-mcu',
    title: 'Marvel Cinematic Universe',
    subtitle: 'Multiverse sagas & superhero epics',
    mediaType: 'movie',
    query: { with_companies: '420', sort_by: 'popularity.desc' },
  },
  {
    slug: 'a24-films',
    title: 'A24 & Visionary Cinema',
    subtitle: 'Bold independent filmmaking',
    mediaType: 'movie',
    query: { with_companies: '41077', sort_by: 'popularity.desc' },
  },
  {
    slug: 'limited-series',
    title: 'Limited & Mini-Series',
    subtitle: 'Self-contained prestige storytelling',
    mediaType: 'tv',
    query: { with_type: '2', sort_by: 'vote_average.desc' },
  },
  {
    slug: 'blockbuster-hits',
    title: 'Box-Office Titans',
    subtitle: 'Record-shattering IMAX spectacles',
    mediaType: 'movie',
    query: { sort_by: 'revenue.desc' },
  },
];

export const ALL_CURATED_CATEGORIES: CuratedCategoryConfig[] = [
  ...TOP_RATED_CATEGORIES,
  ...HOME_CURATED_CATEGORIES,
];

export function getCuratedCategoryBySlug(slug: string): CuratedCategoryConfig | null {
  return ALL_CURATED_CATEGORIES.find((c) => c.slug === slug) || null;
}
