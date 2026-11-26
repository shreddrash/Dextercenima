import type { MediaType, StreamingPlatform } from './types';

export interface CuratedCategoryConfig {
  slug: string;
  title: string;
  subtitle: string;
  mediaType: MediaType;
  query: Record<string, string>;
  kidsOnly?: boolean;
  platform?: StreamingPlatform;
}

export const TOP_RATED_CATEGORIES: CuratedCategoryConfig[] = [
  {
    slug: 'top-rated-movies',
    title: 'Top 10 Movies on Netflix Today',
    subtitle: 'Critically acclaimed features ranked across Netflix',
    mediaType: 'movie',
    query: {
      sort_by: 'vote_average.desc',
      vote_average_gte: '7.0',
      vote_count_gte: '3000',
    },
  },
  {
    slug: 'top-rated-series',
    title: 'Top 10 TV Shows on Netflix Today',
    subtitle: 'Prestige television & binge-worthy originals',
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
    slug: 'netflix-exclusives',
    title: 'Only on Netflix',
    subtitle: 'Exclusive Netflix Originals & blockbuster series you will only find here',
    mediaType: 'tv',
    platform: 'netflix',
    query: { sort_by: 'popularity.desc' },
  },
  {
    slug: 'popular-movies',
    title: 'Trending Now',
    subtitle: 'Most watched movies around the world today',
    mediaType: 'movie',
    query: { vote_count_gte: '500', sort_by: 'popularity.desc' },
  },
  {
    slug: 'hindi-blockbusters',
    title: 'Hindi Movies & Bollywood',
    subtitle: 'Top Hindi blockbusters, action spectacles & classics',
    mediaType: 'movie',
    query: { language: 'hi', sort_by: 'popularity.desc' },
  },
  {
    slug: 'popular-series',
    title: 'Popular TV Shows',
    subtitle: 'Trending global drama, sci-fi & thriller series',
    mediaType: 'tv',
    query: { vote_count_gte: '100', sort_by: 'popularity.desc' },
  },
  {
    slug: 'hindi-series',
    title: 'Hindi Series on Netflix',
    subtitle: 'Acclaimed Indian crime, comedy & drama series',
    mediaType: 'tv',
    query: { language: 'hi', sort_by: 'popularity.desc' },
  },
  {
    slug: 'anime-dominion',
    title: 'Anime Collection',
    subtitle: 'Action-packed & critically acclaimed anime series',
    mediaType: 'tv',
    query: { type: 'anime', sort_by: 'popularity.desc' },
  },
  {
    slug: 'scifi-fantasy-movies',
    title: 'Sci-Fi & Fantasy',
    subtitle: 'Futuristic worlds, space odysseys & visual marvels',
    mediaType: 'movie',
    query: { with_genres: '878,14', sort_by: 'popularity.desc' },
  },
  {
    slug: 'action-thrillers',
    title: 'Action & Adventure',
    subtitle: 'High-stakes thrillers and adrenaline cinema',
    mediaType: 'movie',
    query: { with_genres: '28,53', sort_by: 'popularity.desc' },
  },
  {
    slug: 'crime-movies',
    title: 'Crime & Mystery',
    subtitle: 'Heists, neo-noir detectives & underworld sagas',
    mediaType: 'movie',
    query: { with_genres: '80,9648', sort_by: 'popularity.desc' },
  },
  {
    slug: 'horror-movies',
    title: 'Horror Movies',
    subtitle: 'Chilling midnight terror & supernatural suspense',
    mediaType: 'movie',
    query: { with_genres: '27', sort_by: 'popularity.desc' },
  },
  {
    slug: 'comedy-movies',
    title: 'Comedies',
    subtitle: 'Laugh-out-loud favorites & crowd-pleasers',
    mediaType: 'movie',
    query: { with_genres: '35', sort_by: 'popularity.desc' },
  },
  {
    slug: 'korean-cinema',
    title: 'Korean Cinema & K-Hits',
    subtitle: 'Acclaimed Korean thrillers and dramas',
    mediaType: 'movie',
    query: { language: 'ko', sort_by: 'popularity.desc' },
  },
  {
    slug: 'nolan-films',
    title: 'Christopher Nolan Films',
    subtitle: 'Time-bending architectural epics',
    mediaType: 'movie',
    query: { with_people: '525', sort_by: 'popularity.desc' },
  },
  {
    slug: 'villeneuve-films',
    title: 'Denis Villeneuve Films',
    subtitle: 'Atmospheric sci-fi and razor-sharp thrillers',
    mediaType: 'movie',
    query: { with_people: '27571', sort_by: 'popularity.desc' },
  },
  {
    slug: 'marvel-mcu',
    title: 'Superhero & Multiverse',
    subtitle: 'Blockbuster comic universe spectacles',
    mediaType: 'movie',
    query: { with_companies: '420', sort_by: 'popularity.desc' },
  },
  {
    slug: 'a24-films',
    title: 'Critically Acclaimed Indies',
    subtitle: 'Bold award-winning cinema',
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
    title: 'Box-Office Blockbusters',
    subtitle: 'Record-shattering global hits',
    mediaType: 'movie',
    query: { sort_by: 'revenue.desc' },
  },
];

/* ================= PRIME VIDEO CATEGORIES ================= */
export const PRIME_TOP_RATED_CATEGORIES: CuratedCategoryConfig[] = [
  {
    slug: 'prime-top-series',
    title: 'Top 10 Series on Prime Video',
    subtitle: 'Amazon Originals & top-rated Prime television',
    mediaType: 'tv',
    platform: 'prime',
    query: { sort_by: 'popularity.desc' },
  },
  {
    slug: 'top-rated-movies',
    title: 'Top 10 Movies Included with Prime',
    subtitle: 'Highest IMDb rated feature films on Prime Video',
    mediaType: 'movie',
    platform: 'prime',
    query: { sort_by: 'vote_average.desc', vote_average_gte: '7.0', vote_count_gte: '3000' },
  },
];

export const PRIME_CURATED_CATEGORIES: CuratedCategoryConfig[] = [
  {
    slug: 'prime-originals',
    title: 'Amazon Originals — Included with Prime',
    subtitle: 'The Boys, Fallout, Reacher, Invincible & Rings of Power',
    mediaType: 'tv',
    platform: 'prime',
    query: { sort_by: 'popularity.desc' },
  },
  {
    slug: 'prime-hindi-thrillers',
    title: 'Prime Video India Originals',
    subtitle: 'Mirzapur, The Family Man, Panchayat, Farzi & Paatal Lok',
    mediaType: 'tv',
    platform: 'prime',
    query: { language: 'hi', sort_by: 'popularity.desc' },
  },
  {
    slug: 'hindi-blockbusters',
    title: 'Bollywood & Indian Cinema on Prime',
    subtitle: 'Included with your Prime Video membership',
    mediaType: 'movie',
    platform: 'prime',
    query: { language: 'hi', sort_by: 'popularity.desc' },
  },
  {
    slug: 'action-thrillers',
    title: 'Action & Thrillers Included with Prime',
    subtitle: 'Adrenaline spy sagas, crime & survival cinema',
    mediaType: 'movie',
    platform: 'prime',
    query: { with_genres: '28,53', sort_by: 'popularity.desc' },
  },
  {
    slug: 'scifi-fantasy-movies',
    title: 'Sci-Fi & Fantasy Worlds',
    subtitle: 'Grand space epics and futuristic originals',
    mediaType: 'movie',
    platform: 'prime',
    query: { with_genres: '878,14', sort_by: 'popularity.desc' },
  },
  {
    slug: 'blockbuster-hits',
    title: '4K UHD Box-Office Hits',
    subtitle: 'Critically acclaimed global blockbusters',
    mediaType: 'movie',
    platform: 'prime',
    query: { sort_by: 'revenue.desc' },
  },
];

/* ================= CRUNCHYROLL CATEGORIES (100% ANIME ONLY) ================= */
export const CRUNCHYROLL_TOP_RATED_CATEGORIES: CuratedCategoryConfig[] = [
  {
    slug: 'crunchyroll-top-anime',
    title: 'Top 10 Anime on Crunchyroll',
    subtitle: 'Most popular simulcasts & highest-rated Japanese anime',
    mediaType: 'tv',
    platform: 'crunchyroll',
    query: { type: 'anime', sort_by: 'popularity.desc' },
  },
];

export const CRUNCHYROLL_CURATED_CATEGORIES: CuratedCategoryConfig[] = [
  {
    slug: 'crunchyroll-shonen',
    title: 'Shonen Action & Simulcast Hits',
    subtitle: 'Solo Leveling, Demon Slayer, Jujutsu Kaisen, One Piece & Naruto',
    mediaType: 'tv',
    platform: 'crunchyroll',
    query: { type: 'anime', with_genres: '16,10759', sort_by: 'popularity.desc' },
  },
  {
    slug: 'crunchyroll-dark-fantasy',
    title: 'Dark Fantasy & Seinen Essentials',
    subtitle: 'Attack on Titan, Chainsaw Man, Death Note & Vinland Saga',
    mediaType: 'tv',
    platform: 'crunchyroll',
    query: { type: 'anime', with_genres: '16,10765', sort_by: 'vote_average.desc' },
  },
  {
    slug: 'crunchyroll-anime-movies',
    title: 'Crunchyroll Anime Movies',
    subtitle: 'Your Name, Spirited Away, Jujutsu Kaisen 0, Mugen Train & Suzume',
    mediaType: 'movie',
    platform: 'crunchyroll',
    query: { type: 'anime', sort_by: 'popularity.desc' },
  },
  {
    slug: 'crunchyroll-classics',
    title: 'All-Time Fan Favorites',
    subtitle: 'Fullmetal Alchemist, Hunter x Hunter, Spy x Family & Frieren',
    mediaType: 'tv',
    platform: 'crunchyroll',
    query: { type: 'anime', sort_by: 'vote_average.desc' },
  },
];

/* ================= KIDS CATEGORIES ================= */
export const KIDS_TOP_RATED_CATEGORIES: CuratedCategoryConfig[] = [
  {
    slug: 'top-rated-kids-movies',
    title: 'Top 10 Kids Movies Today',
    subtitle: 'Beloved animated & family favorites for kids',
    mediaType: 'movie',
    kidsOnly: true,
    query: { type: 'kids', kids: '1', sort_by: 'popularity.desc' },
  },
  {
    slug: 'top-rated-kids-series',
    title: 'Top 10 Cartoons & Kids TV',
    subtitle: 'Most-watched animated adventures for kids',
    mediaType: 'tv',
    kidsOnly: true,
    query: { type: 'kids', kids: '1', sort_by: 'popularity.desc' },
  },
];

export const KIDS_CURATED_CATEGORIES: CuratedCategoryConfig[] = [
  {
    slug: 'kids-disney-pixar',
    title: 'Animated Family Magic',
    subtitle: 'Heartwarming Pixar, Disney & DreamWorks worlds',
    mediaType: 'movie',
    kidsOnly: true,
    query: { type: 'kids', kids: '1', with_genres: '16,10751', sort_by: 'vote_average.desc' },
  },
  {
    slug: 'kids-superheroes-adventure',
    title: 'Action & Heroes for Kids',
    subtitle: 'Fun hero adventures safe for all ages',
    mediaType: 'movie',
    kidsOnly: true,
    query: { type: 'kids', kids: '1', with_genres: '12,16', sort_by: 'popularity.desc' },
  },
  {
    slug: 'kids-comedy-animals',
    title: 'Laugh-Out-Loud Kids Comedies',
    subtitle: 'Silly animals, minions & family fun',
    mediaType: 'movie',
    kidsOnly: true,
    query: { type: 'kids', kids: '1', with_genres: '35,10751', sort_by: 'popularity.desc' },
  },
  {
    slug: 'kids-cartoons-series',
    title: 'Cartoon Series & Adventures',
    subtitle: 'Episodes kids love to watch again and again',
    mediaType: 'tv',
    kidsOnly: true,
    query: { type: 'kids', kids: '1', with_genres: '16,10762', sort_by: 'popularity.desc' },
  },
];

export const ALL_CURATED_CATEGORIES: CuratedCategoryConfig[] = [
  ...TOP_RATED_CATEGORIES,
  ...HOME_CURATED_CATEGORIES,
  ...PRIME_TOP_RATED_CATEGORIES,
  ...PRIME_CURATED_CATEGORIES,
  ...CRUNCHYROLL_TOP_RATED_CATEGORIES,
  ...CRUNCHYROLL_CURATED_CATEGORIES,
  ...KIDS_TOP_RATED_CATEGORIES,
  ...KIDS_CURATED_CATEGORIES,
];

export function getCuratedCategoryBySlug(slug: string): CuratedCategoryConfig | null {
  return ALL_CURATED_CATEGORIES.find((c) => c.slug === slug) || null;
}

export function getPlatformCategories(platform: StreamingPlatform, kidsOnly: boolean): {
  top: CuratedCategoryConfig[];
  curated: CuratedCategoryConfig[];
} {
  if (kidsOnly && platform === 'netflix') {
    return { top: KIDS_TOP_RATED_CATEGORIES, curated: KIDS_CURATED_CATEGORIES };
  }
  if (platform === 'prime') {
    return { top: PRIME_TOP_RATED_CATEGORIES, curated: PRIME_CURATED_CATEGORIES };
  }
  if (platform === 'crunchyroll') {
    return { top: CRUNCHYROLL_TOP_RATED_CATEGORIES, curated: CRUNCHYROLL_CURATED_CATEGORIES };
  }
  return { top: TOP_RATED_CATEGORIES, curated: HOME_CURATED_CATEGORIES };
}
