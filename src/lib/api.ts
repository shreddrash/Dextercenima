import { getPlatformCategories } from '../shared/curatedCategories';
import {
  buildProviderUrl,
  getPlayerProvider,
  normalizePlayerMediaType,
  PLAYER_PROVIDERS,
} from '../shared/playerSources';
import type {
  MediaDetail,
  MediaSummary,
  MediaType,
  PersonResult,
  PlayerProviderId,
  SeasonDetail,
  StreamingPlatform,
} from '../shared/types';
import {
  getAllVaultItems,
  getHeroVaultItems,
  getVaultDetail,
  getVaultPerson,
  isAllowedOnPlatform,
  queryVaultDiscover,
  searchVaultCatalog,
} from '../shared/vaultCatalog';
import { getActivePlatform, PLATFORM_THEMES } from './platform';

async function fetchApiJson<T>(url: string, timeoutMs = 12000): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (!ct.includes('application/json')) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function enforcePlatformList(
  items: MediaSummary[],
  platform: StreamingPlatform,
  kidsOnly: boolean,
): MediaSummary[] {
  return items.filter((item) => isAllowedOnPlatform(item, platform, kidsOnly));
}

export async function fetchHeroTitles(
  kidsOnly = false,
  platform: StreamingPlatform = getActivePlatform(),
): Promise<MediaSummary[]> {
  const data = await fetchApiJson<{ results?: MediaSummary[] }>(
    `/api/tmdb/hero?platform=${platform}&kids=${kidsOnly ? '1' : '0'}`,
  );
  if (data && Array.isArray(data.results)) {
    const filtered = enforcePlatformList(data.results, platform, kidsOnly);
    if (filtered.length > 0) return filtered;
  }
  return getHeroVaultItems(kidsOnly, platform);
}

export async function fetchHomeFeed(
  kidsOnly = false,
  platform: StreamingPlatform = getActivePlatform(),
): Promise<{
  hero: MediaSummary[];
  rails: Record<string, MediaSummary[]>;
  allSeed: MediaSummary[];
}> {
  const data = await fetchApiJson<{
    hero?: MediaSummary[];
    rails?: Record<string, MediaSummary[]>;
    allSeed?: MediaSummary[];
  }>(`/api/tmdb/home-feed?platform=${platform}&kids=${kidsOnly ? '1' : '0'}`, 16000);

  if (data && data.rails && Object.keys(data.rails).length > 0) {
    const safeRails: Record<string, MediaSummary[]> = {};
    for (const [slug, list] of Object.entries(data.rails)) {
      safeRails[slug] = enforcePlatformList(Array.isArray(list) ? list : [], platform, kidsOnly);
    }
    const hero = enforcePlatformList(data.hero || [], platform, kidsOnly);
    const allSeed = enforcePlatformList(data.allSeed || [], platform, kidsOnly);
    return {
      hero: hero.length > 0 ? hero : getHeroVaultItems(kidsOnly, platform),
      rails: safeRails,
      allSeed:
        allSeed.length > 0
          ? allSeed
          : enforcePlatformList(getAllVaultItems(), platform, kidsOnly),
    };
  }

  const { top, curated } = getPlatformCategories(platform, kidsOnly);
  const cats = [...top, ...curated];
  const fallbackRails: Record<string, MediaSummary[]> = {};
  for (const cat of cats) {
    const qs = new URLSearchParams({
      media: cat.mediaType,
      curatedSlug: cat.slug,
      platform,
      ...(kidsOnly ? { kids: '1' } : {}),
      ...cat.query,
    });
    fallbackRails[cat.slug] = enforcePlatformList(queryVaultDiscover(qs).list, platform, kidsOnly);
  }

  return {
    hero: getHeroVaultItems(kidsOnly, platform),
    rails: fallbackRails,
    allSeed: enforcePlatformList(getAllVaultItems(), platform, kidsOnly),
  };
}

export async function fetchDiscoverTitles(
  params: URLSearchParams,
  kidsOnly = false,
  platform: StreamingPlatform = getActivePlatform(),
): Promise<{
  list: MediaSummary[];
  page: number;
  total_pages: number;
  total_results: number;
}> {
  const effectiveParams = new URLSearchParams(params);
  effectiveParams.set('platform', platform);
  if (kidsOnly && platform === 'netflix') {
    effectiveParams.set('kids', '1');
  }

  const data = await fetchApiJson<{
    list?: MediaSummary[];
    page?: number;
    total_pages?: number;
    total_results?: number;
  }>(`/api/tmdb/discover?${effectiveParams.toString()}`);

  if (data && Array.isArray(data.list)) {
    const filteredList = enforcePlatformList(data.list, platform, kidsOnly);
    const hasStrictUserFilters = Boolean(
      effectiveParams.get('genres') ||
        (effectiveParams.get('ratingMin') && Number(effectiveParams.get('ratingMin')) > 0) ||
        (effectiveParams.get('yearMin') && Number(effectiveParams.get('yearMin')) > 1995),
    );
    if (filteredList.length > 0 || hasStrictUserFilters) {
      return {
        list: filteredList,
        page: Number(data.page || 1),
        total_pages: Number(data.total_pages || 1),
        total_results: Number(data.total_results || filteredList.length),
      };
    }
  }

  return queryVaultDiscover(effectiveParams);
}

export async function fetchSearchTitles(
  query: string,
  kidsOnly = false,
  platform: StreamingPlatform = getActivePlatform(),
): Promise<{
  results: MediaSummary[];
  people: PersonResult[];
}> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { results: [], people: [] };
  }

  const data = await fetchApiJson<{
    results?: MediaSummary[];
    people?: PersonResult[];
  }>(
    `/api/tmdb/search?q=${encodeURIComponent(trimmed)}&platform=${platform}&kids=${kidsOnly ? '1' : '0'}`,
  );

  const vault = searchVaultCatalog(trimmed, kidsOnly, platform);
  if (data && (Array.isArray(data.results) || Array.isArray(data.people))) {
    const apiResults = enforcePlatformList(
      Array.isArray(data.results) ? data.results : [],
      platform,
      kidsOnly,
    );
    const results = apiResults.length > 0 ? apiResults : vault.results;
    const people =
      kidsOnly || platform === 'crunchyroll'
        ? []
        : Array.isArray(data.people) && data.people.length > 0
          ? data.people
          : vault.people;
    return { results, people };
  }

  return vault;
}

export async function fetchTitleDetail(
  tmdbId: number,
  mediaType: MediaType,
  kidsOnly = false,
  platform: StreamingPlatform = getActivePlatform(),
): Promise<MediaDetail | null> {
  const data = await fetchApiJson<{ detail?: MediaDetail }>(
    `/api/tmdb/detail?tmdbId=${tmdbId}&mediaType=${mediaType}&platform=${platform}&kids=${kidsOnly ? '1' : '0'}`,
  );
  if (data?.detail) {
    return {
      ...data.detail,
      recommendations: enforcePlatformList(data.detail.recommendations || [], platform, kidsOnly),
    };
  }
  const vaultDetail = getVaultDetail(tmdbId, mediaType);
  if (vaultDetail) {
    return {
      ...vaultDetail,
      recommendations: enforcePlatformList(vaultDetail.recommendations || [], platform, kidsOnly),
    };
  }
  return null;
}

export async function fetchPersonDetail(personId: number): Promise<PersonResult | null> {
  const data = await fetchApiJson<{ person?: PersonResult }>(`/api/tmdb/person/${personId}`);
  if (data?.person) return data.person;
  return getVaultPerson(personId);
}

export async function resolvePlayerSession(opts: {
  tmdbId: number;
  mediaType: MediaType;
  provider: PlayerProviderId;
  season: number;
  episode: number;
}): Promise<{
  embedUrl: string;
  seasonDetail: SeasonDetail | null;
  episodeCount: number;
}> {
  const normalizedType = normalizePlayerMediaType(opts.mediaType);
  const prov = getPlayerProvider(opts.provider);
  const accentColor = PLATFORM_THEMES[getActivePlatform()].accentHexNoHash;
  const qs = new URLSearchParams({
    tmdbId: String(opts.tmdbId),
    type: normalizedType,
    provider: prov.id,
    season: String(opts.season),
    episode: String(opts.episode),
    color: accentColor,
  });

  const data = await fetchApiJson<{
    embedUrl?: string;
    seasonDetail?: SeasonDetail | null;
    episodeCount?: number;
  }>(`/api/player/resolve?${qs.toString()}`);

  if (data?.embedUrl) {
    return {
      embedUrl: data.embedUrl,
      seasonDetail: data.seasonDetail || null,
      episodeCount: Number(data.episodeCount || 10),
    };
  }

  const fallbackDetail = normalizedType === 'tv' ? getVaultDetail(opts.tmdbId, 'tv') : null;
  const fallbackSeason =
    fallbackDetail?.seasonsDetail?.find((s) => s.seasonNumber === opts.season) ||
    fallbackDetail?.seasonsDetail?.[0] ||
    (normalizedType === 'tv'
      ? {
          seasonNumber: opts.season,
          title: `Season ${opts.season}`,
          overview: '',
          episodeCount: 10,
          episodes: Array.from({ length: 10 }, (_, idx) => ({
            id: opts.tmdbId * 100 + idx + 1,
            seasonNumber: opts.season,
            episodeNumber: idx + 1,
            title: `Episode ${idx + 1}`,
            overview: `Season ${opts.season}, Episode ${idx + 1}`,
            runtime: 45,
          })),
        }
      : null);

  return {
    embedUrl: buildProviderUrl({
      provider: prov.id,
      mediaType: normalizedType,
      tmdbId: opts.tmdbId,
      season: opts.season,
      episode: opts.episode,
      accentColor,
      subtitleLang: 'en',
    }),
    seasonDetail: fallbackSeason,
    episodeCount: normalizedType === 'movie' ? 1 : fallbackSeason?.episodeCount || 10,
  };
}

export { PLAYER_PROVIDERS };
