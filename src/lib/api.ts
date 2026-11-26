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
} from '../shared/types';
import {
  getHeroVaultItems,
  getVaultDetail,
  getVaultPerson,
  queryVaultDiscover,
  searchVaultCatalog,
} from '../shared/vaultCatalog';

async function fetchApiJson<T>(url: string, timeoutMs = 10000): Promise<T | null> {
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

export async function fetchHeroTitles(): Promise<MediaSummary[]> {
  const data = await fetchApiJson<{ results?: MediaSummary[] }>('/api/tmdb/hero');
  if (data && Array.isArray(data.results) && data.results.length > 0) {
    return data.results;
  }
  return getHeroVaultItems();
}

export async function fetchDiscoverTitles(params: URLSearchParams): Promise<{
  list: MediaSummary[];
  page: number;
  total_pages: number;
  total_results: number;
}> {
  const data = await fetchApiJson<{
    list?: MediaSummary[];
    page?: number;
    total_pages?: number;
    total_results?: number;
  }>(`/api/tmdb/discover?${params.toString()}`);

  if (data && Array.isArray(data.list)) {
    const hasStrictUserFilters = Boolean(
      params.get('genres') ||
        (params.get('ratingMin') && Number(params.get('ratingMin')) > 0) ||
        (params.get('yearMin') && Number(params.get('yearMin')) > 1995),
    );
    if (data.list.length > 0 || hasStrictUserFilters) {
      return {
        list: data.list,
        page: Number(data.page || 1),
        total_pages: Number(data.total_pages || 1),
        total_results: Number(data.total_results || data.list.length),
      };
    }
  }

  return queryVaultDiscover(params);
}

export async function fetchSearchTitles(query: string): Promise<{
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
  }>(`/api/tmdb/search?q=${encodeURIComponent(trimmed)}`);

  const vault = searchVaultCatalog(trimmed);
  if (data && (Array.isArray(data.results) || Array.isArray(data.people))) {
    const results = Array.isArray(data.results) && data.results.length > 0 ? data.results : vault.results;
    const people = Array.isArray(data.people) && data.people.length > 0 ? data.people : vault.people;
    return { results, people };
  }

  return vault;
}

export async function fetchTitleDetail(
  tmdbId: number,
  mediaType: MediaType,
): Promise<MediaDetail | null> {
  const data = await fetchApiJson<{ detail?: MediaDetail }>(
    `/api/tmdb/detail?tmdbId=${tmdbId}&mediaType=${mediaType}`,
  );
  if (data?.detail) return data.detail;
  return getVaultDetail(tmdbId, mediaType);
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
  const qs = new URLSearchParams({
    tmdbId: String(opts.tmdbId),
    type: normalizedType,
    provider: prov.id,
    season: String(opts.season),
    episode: String(opts.episode),
    color: '9333ea',
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
      accentColor: '9333ea',
      subtitleLang: 'en',
    }),
    seasonDetail: fallbackSeason,
    episodeCount: normalizedType === 'movie' ? 1 : fallbackSeason?.episodeCount || 10,
  };
}

export { PLAYER_PROVIDERS };
