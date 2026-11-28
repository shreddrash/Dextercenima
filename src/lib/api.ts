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
  SportMatch,
  StreamingPlatform,
  WorldChannel,
} from '../shared/types';
import {
  CRICKET_ENGLISH_STREAMS,
  CRICKET_HINDI_STREAMS,
  FOOTBALL_ENGLISH_STREAMS,
  FOOTBALL_HINDI_STREAMS,
  VERIFIED_LIVE_SPORTS_CHANNELS,
} from '../shared/sportsCatalog';
import { parseEspnHeaderEvents } from '../shared/sportsFeedParser';
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

export async function fetchSportsFeed(): Promise<{
  football: SportMatch[];
  cricket: SportMatch[];
  channels: SportMatch[];
  languages: string[];
  updatedAt: string;
  counts: {
    live: number;
    upcoming: number;
    football: number;
    cricket: number;
  };
}> {
  const data = await fetchApiJson<{
    football?: SportMatch[];
    cricket?: SportMatch[];
    channels?: SportMatch[];
    languages?: string[];
    updatedAt?: string;
    counts?: {
      live: number;
      upcoming: number;
      football: number;
      cricket: number;
    };
  }>('/api/sports/feed', 14000);

  if (data && Array.isArray(data.football) && Array.isArray(data.cricket)) {
    const channels = Array.isArray(data.channels) ? data.channels : VERIFIED_LIVE_SPORTS_CHANNELS;
    const languages = Array.isArray(data.languages)
      ? data.languages
      : ['English', 'Hindi'];
    return {
      football: data.football,
      cricket: data.cricket,
      channels,
      languages,
      updatedAt: data.updatedAt || new Date().toISOString(),
      counts: data.counts || {
        live: [...data.football, ...data.cricket].filter((m) => m.matchStatus === 'live').length,
        upcoming: [...data.football, ...data.cricket].filter((m) => m.matchStatus === 'upcoming').length,
        football: data.football.length,
        cricket: data.cricket.length,
      },
    };
  }

  try {
    const [soccerRes, cricketRes] = await Promise.all([
      fetch('https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=soccer'),
      fetch('https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=cricket'),
    ]);
    const soccerJson = soccerRes.ok ? await soccerRes.json() : null;
    const cricketJson = cricketRes.ok ? await cricketRes.json() : null;
    const livePools = {
      cricketEn: CRICKET_ENGLISH_STREAMS,
      cricketHi: CRICKET_HINDI_STREAMS,
      footballEn: FOOTBALL_ENGLISH_STREAMS,
      footballHi: FOOTBALL_HINDI_STREAMS,
    };
    const footballFixtures = soccerJson
      ? parseEspnHeaderEvents(soccerJson, 'football', [], livePools)
      : [];
    const cricketFixtures = cricketJson
      ? parseEspnHeaderEvents(cricketJson, 'cricket', [], livePools)
      : [];

    const football = [
      ...VERIFIED_LIVE_SPORTS_CHANNELS.filter((c) => c.sport === 'football'),
      ...footballFixtures,
    ];
    const cricket = [
      ...VERIFIED_LIVE_SPORTS_CHANNELS.filter((c) => c.sport === 'cricket'),
      ...cricketFixtures,
    ];

    return {
      football,
      cricket,
      channels: VERIFIED_LIVE_SPORTS_CHANNELS,
      languages: ['English', 'Hindi'],
      updatedAt: new Date().toISOString(),
      counts: {
        live: [...football, ...cricket].filter((m) => m.matchStatus === 'live').length,
        upcoming: [...football, ...cricket].filter((m) => m.matchStatus === 'upcoming').length,
        football: football.length,
        cricket: cricket.length,
      },
    };
  } catch {
    /* fallback below */
  }

  const football = VERIFIED_LIVE_SPORTS_CHANNELS.filter((c) => c.sport === 'football');
  const cricket = VERIFIED_LIVE_SPORTS_CHANNELS.filter((c) => c.sport === 'cricket');
  return {
    football,
    cricket,
    channels: VERIFIED_LIVE_SPORTS_CHANNELS,
    languages: ['English', 'Hindi'],
    updatedAt: new Date().toISOString(),
    counts: {
      live: VERIFIED_LIVE_SPORTS_CHANNELS.length,
      upcoming: 0,
      football: football.length,
      cricket: cricket.length,
    },
  };
}

export async function fetchWorldChannelsFeed(): Promise<{
  channels: WorldChannel[];
  total: number;
  updatedAt: string;
}> {
  const data = await fetchApiJson<{
    channels?: WorldChannel[];
    total?: number;
    updatedAt?: string;
  }>('/api/world-channels/feed', 15000);

  if (data && Array.isArray(data.channels) && data.channels.length > 0) {
    return {
      channels: data.channels,
      total: data.total ?? data.channels.length,
      updatedAt: data.updatedAt || new Date().toISOString(),
    };
  }

  try {
    const res = await fetch('https://iptv-org.github.io/iptv/categories/sports.m3u');
    if (res.ok) {
      const content = await res.text();
      const lines = content.split(/\r?\n/);
      const channels: WorldChannel[] = [];
      const seenUrls = new Set<string>();
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line.startsWith('#EXTINF:')) continue;
        let urlLine = '';
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j].trim();
          if (nextLine && !nextLine.startsWith('#')) {
            urlLine = nextLine;
            break;
          }
        }
        if (!urlLine || !/^https?:\/\//i.test(urlLine) || seenUrls.has(urlLine)) continue;
        seenUrls.add(urlLine);
        const attr = (key: string) => {
          const m = line.match(new RegExp(`${key}="([^"]*)"`, 'i'));
          return m ? m[1].trim() : '';
        };
        const tvgId = attr('tvg-id');
        const tvgName = attr('tvg-name');
        const logo = attr('tvg-logo');
        const group = attr('group-title') || 'World Sports';
        const commaIdx = line.lastIndexOf(',');
        const name = (commaIdx !== -1 ? line.slice(commaIdx + 1).trim() : tvgName) || `Channel ${channels.length + 1}`;
        const qMatch = name.match(/\((4K|1080p|720p|576p|480p|360p|SD|HD)\)/i);
        const cMatch = tvgId.match(/\.([A-Za-z]{2})(?:@|$)/);
        const country = cMatch ? cMatch[1].toUpperCase() : 'INTL';
        channels.push({
          id: tvgId ? `${tvgId}-${channels.length}` : `wc-${channels.length}`,
          name,
          logo,
          country,
          region: 'Global',
          quality: qMatch ? qMatch[1].toUpperCase() : 'LIVE',
          group,
          url: urlLine,
        });
      }
      return {
        channels,
        total: channels.length,
        updatedAt: new Date().toISOString(),
      };
    }
  } catch {
    /* ignore */
  }

  return {
    channels: [],
    total: 0,
    updatedAt: new Date().toISOString(),
  };
}

export async function checkWorldChannelLive(url: string): Promise<boolean> {
  const data = await fetchApiJson<{ ok?: boolean }>(
    `/api/world-channels/check?url=${encodeURIComponent(url)}`,
    6000,
  );
  return Boolean(data?.ok);
}

export { PLAYER_PROVIDERS };
