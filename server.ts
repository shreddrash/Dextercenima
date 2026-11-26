import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  buildProviderUrl,
  getPlayerProvider,
  normalizePlayerMediaType,
  PLAYER_PROVIDERS,
} from './src/shared/playerSources';
import type {
  CastMember,
  EpisodeItem,
  MediaDetail,
  MediaSummary,
  MediaType,
  PersonResult,
  SeasonDetail,
} from './src/shared/types';
import {
  GENRE_MAP,
  getHeroVaultItems,
  getVaultDetail,
  getVaultPerson,
  queryVaultDiscover,
  searchVaultCatalog,
} from './src/shared/vaultCatalog';

const PORT = 3000;
const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMG_W500 = 'https://image.tmdb.org/t/p/w500';
const TMDB_IMG_ORIGINAL = 'https://image.tmdb.org/t/p/original';
const BINGR_API = 'https://api.bingr.one/api';

const BINGR_HEADERS = {
  Accept: 'application/json',
  'Accept-Language': 'en-US,en;q=0.9',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  Origin: 'https://bingr.one',
  Referer: 'https://bingr.one/',
};

// Simple TTL in-memory cache
const memoryCache = new Map<string, { value: any; expiresAt: number }>();

function getCached<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value as T;
}

function setCached(key: string, value: any, ttlMs = 15 * 60 * 1000): void {
  if (memoryCache.size > 500) {
    const firstKey = memoryCache.keys().next().value;
    if (firstKey) memoryCache.delete(firstKey);
  }
  memoryCache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

// Directory of notable actors & directors (automatically expanded as users browse titles)
const peopleDirectory = new Map<number, { id: number; name: string; department: string; profile?: string }>([
  [525, { id: 525, name: 'Christopher Nolan', department: 'Directing' }],
  [137427, { id: 137427, name: 'Denis Villeneuve', department: 'Directing' }],
  [7467, { id: 7467, name: 'David Fincher', department: 'Directing' }],
  [488, { id: 488, name: 'Steven Spielberg', department: 'Directing' }],
  [1032, { id: 1032, name: 'Martin Scorsese', department: 'Directing' }],
  [138, { id: 138, name: 'Quentin Tarantino', department: 'Directing' }],
  [35742, { id: 35742, name: 'Shah Rukh Khan', department: 'Acting' }],
  [42802, { id: 42802, name: 'Salman Khan', department: 'Acting' }],
  [52763, { id: 52763, name: 'Aamir Khan', department: 'Acting' }],
  [78749, { id: 78749, name: 'Hrithik Roshan', department: 'Acting' }],
  [85034, { id: 85034, name: 'Ranbir Kapoor', department: 'Acting' }],
  [146941, { id: 146941, name: 'Prabhas', department: 'Acting' }],
  [108215, { id: 108215, name: 'Allu Arjun', department: 'Acting' }],
  [1267992, { id: 1267992, name: 'Pankaj Tripathi', department: 'Acting' }],
  [110722, { id: 110722, name: 'Manoj Bajpayee', department: 'Acting' }],
  [53975, { id: 53975, name: 'Deepika Padukone', department: 'Acting' }],
  [1108120, { id: 1108120, name: 'Alia Bhatt', department: 'Acting' }],
  [6384, { id: 6384, name: 'Keanu Reeves', department: 'Acting' }],
  [6193, { id: 6193, name: 'Leonardo DiCaprio', department: 'Acting' }],
  [1190668, { id: 1190668, name: 'Timothee Chalamet', department: 'Acting' }],
  [505710, { id: 505710, name: 'Zendaya', department: 'Acting' }],
  [2037, { id: 2037, name: 'Cillian Murphy', department: 'Acting' }],
  [3223, { id: 3223, name: 'Robert Downey Jr.', department: 'Acting' }],
  [500, { id: 500, name: 'Tom Cruise', department: 'Acting' }],
  [1245, { id: 1245, name: 'Scarlett Johansson', department: 'Acting' }],
  [30614, { id: 30614, name: 'Ryan Gosling', department: 'Acting' }],
  [1253360, { id: 1253360, name: 'Pedro Pascal', department: 'Acting' }],
  [3894, { id: 3894, name: 'Christian Bale', department: 'Acting' }],
  [17419, { id: 17419, name: 'Bryan Cranston', department: 'Acting' }],
  [224513, { id: 224513, name: 'Ana de Armas', department: 'Acting' }],
  [11288, { id: 11288, name: 'Robert Pattinson', department: 'Acting' }],
  [287, { id: 287, name: 'Brad Pitt', department: 'Acting' }],
  [10297, { id: 10297, name: 'Matthew McConaughey', department: 'Acting' }],
  [2524, { id: 2524, name: 'Tom Hardy', department: 'Acting' }],
]);

function getTmdbApiKey(): string {
  return (process.env.TMDB_API_KEY || '').trim();
}

function toYear(dateStr?: string | number): string {
  const s = String(dateStr || '').slice(0, 4);
  return /^\d{4}$/.test(s) ? s : 'N/A';
}

function toScore(val?: number | string): string {
  const n = Number(val);
  if (!Number.isFinite(n) || n <= 0) return '7.5';
  return n.toFixed(1);
}

function mapTmdbItem(raw: Record<string, any>, fallbackMediaType: MediaType): MediaSummary | null {
  const id = Number(raw.id);
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  const mediaType: MediaType =
    raw.media_type === 'tv' || raw.type === 'tv' || fallbackMediaType === 'tv' ? 'tv' : 'movie';
  const title = String(raw.title || raw.name || '').trim();
  if (!title) return null;
  const releaseDate = String(raw.release_date || raw.first_air_date || '').trim();
  const genreIds: number[] = Array.isArray(raw.genre_ids) ? raw.genre_ids : [];
  const rawGenres: string[] = Array.isArray(raw.genres)
    ? raw.genres.map((g: any) => (typeof g === 'string' ? g : String(g?.name || ''))).filter(Boolean)
    : genreIds.map((gid) => GENRE_MAP[gid]).filter(Boolean);

  return {
    id,
    mediaType,
    category: genreIds.includes(16) ? 'anime' : mediaType,
    title,
    logo: typeof raw.logo === 'string' ? raw.logo : undefined,
    overview: String(raw.overview || '').trim(),
    poster: raw.poster
      ? String(raw.poster)
      : raw.poster_path
        ? `${TMDB_IMG_W500}${raw.poster_path}`
        : '',
    backdrop: raw.backdrop_original
      ? String(raw.backdrop_original)
      : raw.backdrop
        ? String(raw.backdrop)
        : raw.backdrop_path
          ? `${TMDB_IMG_ORIGINAL}${raw.backdrop_path}`
          : raw.poster
            ? String(raw.poster)
            : raw.poster_path
              ? `${TMDB_IMG_ORIGINAL}${raw.poster_path}`
              : '',
    score: toScore(raw.rating ?? raw.vote_average),
    voteCount: Number(raw.vote_count || 100),
    year: raw.year ? toYear(raw.year) : toYear(releaseDate),
    releaseDate,
    runtime: typeof raw.runtime === 'number' && raw.runtime > 0 ? raw.runtime : null,
    seasons: Array.isArray(raw.seasons)
      ? raw.seasons.filter((s: any) => Number(s.season) > 0).length
      : raw.number_of_seasons || null,
    episodes: Array.isArray(raw.seasons)
      ? raw.seasons
          .filter((s: any) => Number(s.season) > 0)
          .reduce((acc: number, s: any) => acc + Number(s.episodes || 0), 0)
      : raw.number_of_episodes || null,
    genreIds,
    genres: rawGenres.length > 0 ? rawGenres : [mediaType === 'tv' ? 'Series' : 'Cinema'],
    language: String(raw.original_language || 'en'),
    popularity: Number(raw.popularity || raw.rating || 50),
  };
}

async function fetchJsonWithTimeout(url: string, headers: Record<string, string> = {}, timeoutMs = 8000): Promise<any | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json', ...headers },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchTmdbJson(endpoint: string, params: URLSearchParams): Promise<any | null> {
  const apiKey = getTmdbApiKey();
  if (!apiKey) return null;
  params.set('api_key', apiKey);
  return fetchJsonWithTimeout(`${TMDB_BASE}${endpoint}?${params.toString()}`);
}

async function fetchBingrJson(endpointPath: string): Promise<any | null> {
  const cacheKey = `bingr:${endpointPath}`;
  const cached = getCached<any>(cacheKey);
  if (cached) return cached;
  const data = await fetchJsonWithTimeout(`${BINGR_API}${endpointPath}`, BINGR_HEADERS, 8500);
  if (data) setCached(cacheKey, data);
  return data;
}

async function fetchBingrDetailMapped(mediaType: MediaType, id: number): Promise<MediaDetail | null> {
  const raw = await fetchBingrJson(`/details/${mediaType}/${id}`);
  if (!raw || !raw.id) return null;

  const base = mapTmdbItem(raw, mediaType);
  if (!base) return null;

  const directorsRaw = Array.isArray(raw.directors) && raw.directors.length > 0
    ? raw.directors
    : raw.director
      ? [raw.director]
      : [];

  const directors = directorsRaw
    .filter((d: any) => d && d.id && d.name)
    .map((d: any) => {
      const pid = Number(d.id);
      const photo = typeof d.photo === 'string' && d.photo ? d.photo : undefined;
      peopleDirectory.set(pid, { id: pid, name: String(d.name), department: 'Directing', profile: photo });
      return { id: pid, name: String(d.name), profile: photo };
    });

  const cast: CastMember[] = Array.isArray(raw.cast)
    ? raw.cast
        .filter((c: any) => c && c.id && c.name)
        .slice(0, 16)
        .map((c: any) => {
          const pid = Number(c.id);
          const photo = typeof c.photo === 'string' && c.photo ? c.photo : undefined;
          peopleDirectory.set(pid, { id: pid, name: String(c.name), department: 'Acting', profile: photo });
          return {
            id: pid,
            name: String(c.name),
            character: String(c.character || ''),
            profile: photo,
          };
        })
    : [];

  const recommendations: MediaSummary[] = Array.isArray(raw.similars)
    ? raw.similars
        .map((s: any) => mapTmdbItem(s, s.type === 'tv' ? 'tv' : mediaType))
        .filter(Boolean) as MediaSummary[]
    : [];

  const seasonsDetail: SeasonDetail[] = Array.isArray(raw.seasons)
    ? raw.seasons
        .filter((s: any) => Number(s.season) > 0)
        .map((s: any) => ({
          seasonNumber: Number(s.season),
          title: String(s.name || `Season ${s.season}`),
          overview: '',
          episodeCount: Number(s.episodes || 10),
          episodes: Array.from({ length: Math.min(Number(s.episodes || 10), 24) }, (_, idx) => ({
            id: id * 1000 + Number(s.season) * 100 + idx + 1,
            seasonNumber: Number(s.season),
            episodeNumber: idx + 1,
            title: `Episode ${idx + 1}`,
            overview: '',
            still: typeof s.poster === 'string' ? s.poster : base.backdrop,
            airDate: String(s.air_date || ''),
            runtime: base.runtime,
          })),
        }))
    : [];

  let trailerEmbedUrl: string | undefined;
  if (raw.trailer?.embed) {
    trailerEmbedUrl = `${raw.trailer.embed}${raw.trailer.embed.includes('?') ? '&' : '?'}autoplay=1&rel=0`;
  } else if (raw.trailer?.key) {
    trailerEmbedUrl = `https://www.youtube.com/embed/${raw.trailer.key}?autoplay=1&rel=0`;
  }

  return {
    ...base,
    imdbId: String(raw.imdb_id || ''),
    contentRating: String(raw.certification || (mediaType === 'tv' ? 'TV-14' : 'PG-13')),
    trailerEmbedUrl,
    directors,
    cast,
    recommendations,
    seasonsDetail,
    collection: raw.collection?.id
      ? {
          id: Number(raw.collection.id),
          name: String(raw.collection.name || 'Collection'),
          parts: [],
        }
      : undefined,
  };
}

// Curated TMDB IDs for authentic global & Hindi shelves
const CURATED_TMDB_IDS: Record<string, Array<{ id: number; type: MediaType }>> = {
  'top-rated-movies': [
    { id: 278, type: 'movie' },
    { id: 238, type: 'movie' },
    { id: 155, type: 'movie' },
    { id: 157336, type: 'movie' },
    { id: 496243, type: 'movie' },
    { id: 693134, type: 'movie' },
    { id: 27205, type: 'movie' },
    { id: 122, type: 'movie' },
    { id: 550, type: 'movie' },
    { id: 807, type: 'movie' },
  ],
  'top-rated-series': [
    { id: 1396, type: 'tv' },
    { id: 94605, type: 'tv' },
    { id: 87108, type: 'tv' },
    { id: 1429, type: 'tv' },
    { id: 100088, type: 'tv' },
    { id: 66732, type: 'tv' },
    { id: 95396, type: 'tv' },
    { id: 126308, type: 'tv' },
    { id: 95479, type: 'tv' },
    { id: 105248, type: 'tv' },
  ],
  'hindi-blockbusters': [
    { id: 872906, type: 'movie' }, // Jawan
    { id: 864692, type: 'movie' }, // Pathaan
    { id: 781732, type: 'movie' }, // Animal
    { id: 801688, type: 'movie' }, // Kalki 2898-AD
    { id: 579974, type: 'movie' }, // RRR
    { id: 20453, type: 'movie' },  // 3 Idiots
    { id: 360814, type: 'movie' }, // Dangal
    { id: 587412, type: 'movie' }, // KGF Chapter 2
    { id: 256040, type: 'movie' }, // Baahubali
    { id: 1163258, type: 'movie' }, // 12th Fail
    { id: 538858, type: 'movie' }, // Tumbbad
    { id: 297222, type: 'movie' }, // PK
  ],
  'hindi-series': [
    { id: 84105, type: 'tv' },  // Mirzapur
    { id: 79480, type: 'tv' },  // Sacred Games
    { id: 93352, type: 'tv' },  // The Family Man
    { id: 101352, type: 'tv' }, // Panchayat
    { id: 111188, type: 'tv' }, // Scam 1992
    { id: 119316, type: 'tv' }, // Farzi
    { id: 89113, type: 'tv' },  // Kota Factory
    { id: 124800, type: 'tv' }, // Aspirants
  ],
  'anime-dominion': [
    { id: 94605, type: 'tv' },
    { id: 127532, type: 'tv' },
    { id: 1429, type: 'tv' },
    { id: 95479, type: 'tv' },
    { id: 105248, type: 'tv' },
    { id: 85937, type: 'tv' },
    { id: 37854, type: 'tv' },
    { id: 31911, type: 'tv' },
    { id: 60574, type: 'tv' },
    { id: 95557, type: 'tv' },
  ],
  'nolan-films': [
    { id: 157336, type: 'movie' },
    { id: 27205, type: 'movie' },
    { id: 155, type: 'movie' },
    { id: 872585, type: 'movie' },
    { id: 49026, type: 'movie' },
    { id: 272, type: 'movie' },
    { id: 1124, type: 'movie' },
    { id: 77, type: 'movie' },
    { id: 374720, type: 'movie' },
    { id: 577922, type: 'movie' },
  ],
  'villeneuve-films': [
    { id: 693134, type: 'movie' },
    { id: 438631, type: 'movie' },
    { id: 335984, type: 'movie' },
    { id: 329865, type: 'movie' },
    { id: 273481, type: 'movie' },
    { id: 146233, type: 'movie' },
    { id: 46738, type: 'movie' },
  ],
  'marvel-mcu': [
    { id: 299534, type: 'movie' },
    { id: 299536, type: 'movie' },
    { id: 634649, type: 'movie' },
    { id: 533535, type: 'movie' },
    { id: 284053, type: 'movie' },
    { id: 24428, type: 'movie' },
    { id: 271110, type: 'movie' },
    { id: 118340, type: 'movie' },
  ],
  'a24-films': [
    { id: 545611, type: 'movie' },
    { id: 530385, type: 'movie' },
    { id: 530382, type: 'movie' },
    { id: 376867, type: 'movie' },
    { id: 264660, type: 'movie' },
    { id: 503919, type: 'movie' },
    { id: 310131, type: 'movie' },
    { id: 929590, type: 'movie' },
  ],
  'limited-series': [
    { id: 87108, type: 'tv' },
    { id: 126308, type: 'tv' },
    { id: 105248, type: 'tv' },
    { id: 87739, type: 'tv' },
    { id: 90462, type: 'tv' },
    { id: 119051, type: 'tv' },
    { id: 92749, type: 'tv' },
  ],
  'blockbuster-hits': [
    { id: 299534, type: 'movie' },
    { id: 299536, type: 'movie' },
    { id: 19995, type: 'movie' },
    { id: 76600, type: 'movie' },
    { id: 361743, type: 'movie' },
    { id: 634649, type: 'movie' },
    { id: 603692, type: 'movie' },
    { id: 414906, type: 'movie' },
    { id: 569094, type: 'movie' },
    { id: 76341, type: 'movie' },
  ],
};

async function hydrateCuratedList(items: Array<{ id: number; type: MediaType }>): Promise<MediaSummary[]> {
  const resolved = await Promise.all(
    items.map((entry) => fetchBingrDetailMapped(entry.type, entry.id)),
  );
  return resolved.filter(Boolean).map((detail) => {
    const {
      imdbId: _i,
      contentRating: _c,
      trailerEmbedUrl: _t,
      directors: _d,
      cast: _ca,
      collection: _co,
      recommendations: _r,
      seasonsDetail: _sd,
      ...summary
    } = detail!;
    return summary;
  });
}

const BINGR_MEDIA_HOSTS = new Set([
  'futurefocusedentrepreneurs.site',
  'remoteconsultinggroup.site',
  'digitalassetlaunchpad.site',
]);

function validateBingrMediaUrl(value: string): URL {
  const url = new URL(value);
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.port ||
    !BINGR_MEDIA_HOSTS.has(url.hostname)
  ) {
    throw new Error('Unsupported media host');
  }
  url.hash = '';
  return url;
}

function unwrapBingrMediaUrl(value: string): URL {
  let url = new URL(value);
  for (let depth = 0; depth < 4 && url.hostname === 'wormhole.filmu.in'; depth++) {
    const upstream = url.searchParams.get('url');
    if (!upstream) throw new Error('Missing upstream media URL');
    url = new URL(upstream);
  }
  return validateBingrMediaUrl(url.href);
}

function rewriteBingrPlaylist(body: string, base: URL): string {
  if (!body.trimStart().startsWith('#EXTM3U')) {
    throw new Error('Invalid playlist');
  }
  const rewrite = (uri: string) =>
    `/api/player/media?url=${encodeURIComponent(validateBingrMediaUrl(new URL(uri, base).href).href)}`;
  return body
    .split(/\r?\n/)
    .map((line) => {
      if (!line || !line.trim()) return line;
      if (line.startsWith('#')) {
        return line.replace(/URI="([^"]+)"/g, (_, uri: string) => `URI="${rewrite(uri)}"`);
      }
      return rewrite(line.trim());
    })
    .join('\n');
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      name: 'Dexterx Cenima',
      developer: 'Ghost Dexter',
      liveCatalog: true,
      liveTmdb: Boolean(getTmdbApiKey()),
    });
  });

  app.get('/api/tmdb/hero', async (req, res) => {
    const media: MediaType = req.query.media === 'tv' ? 'tv' : 'movie';
    const apiKey = getTmdbApiKey();

    if (apiKey) {
      const data = await fetchTmdbJson(
        `/trending/${media}/week`,
        new URLSearchParams({ language: 'en-US', page: '1' }),
      );
      if (data && Array.isArray(data.results)) {
        const mapped = data.results
          .map((item: any) => mapTmdbItem(item, media))
          .filter(Boolean)
          .slice(0, 6);
        if (mapped.length > 0) {
          return res.json({ results: mapped, source: 'tmdb' });
        }
      }
    }

    const bingrTrending = await fetchBingrJson(`/trending/${media}`);
    if (bingrTrending && Array.isArray(bingrTrending.results)) {
      const topIds = bingrTrending.results
        .filter((r: any) => r.backdrop && r.poster)
        .slice(0, 6)
        .map((r: any) => ({ id: Number(r.id), type: (r.type === 'tv' ? 'tv' : media) as MediaType }));

      const hydrated = await hydrateCuratedList(topIds);
      if (hydrated.length > 0) {
        return res.json({ results: hydrated, source: 'live' });
      }
    }

    return res.json({ results: getHeroVaultItems(), source: 'vault' });
  });

  app.get('/api/tmdb/discover', async (req, res) => {
    const params = new URLSearchParams();
    Object.entries(req.query).forEach(([k, v]) => {
      if (typeof v === 'string' && v.trim()) params.set(k, v.trim());
    });

    const type = params.get('type');
    const language = (params.get('language') || '').trim().toLowerCase();
    const media: MediaType =
      type === 'tv' || type === 'anime' || type === 'show' || params.get('media') === 'tv'
        ? 'tv'
        : 'movie';
    const page = Math.max(1, Number(params.get('page') || 1));

    const apiKey = getTmdbApiKey();
    if (apiKey) {
      const tmdbParams = new URLSearchParams({
        language: 'en-US',
        include_adult: 'false',
        page: String(page),
        sort_by: params.get('sort_by') || 'popularity.desc',
      });
      const withGenres = params.get('with_genres') || params.get('genres') || '';
      if (type === 'anime' && !withGenres) {
        tmdbParams.set('with_genres', '16');
        tmdbParams.set('with_original_language', 'ja');
      } else if (type === 'hindi') {
        tmdbParams.set('with_original_language', 'hi');
      } else if (withGenres) {
        tmdbParams.set('with_genres', withGenres);
      }
      if (language && language !== 'all') {
        tmdbParams.set('with_original_language', language);
      }
      if (params.get('without_genres')) tmdbParams.set('without_genres', params.get('without_genres')!);
      if (params.get('yearMin')) {
        tmdbParams.set(
          media === 'tv' ? 'first_air_date.gte' : 'primary_release_date.gte',
          `${params.get('yearMin')}-01-01`,
        );
      }
      if (params.get('yearMax')) {
        tmdbParams.set(
          media === 'tv' ? 'first_air_date.lte' : 'primary_release_date.lte',
          `${params.get('yearMax')}-12-31`,
        );
      }
      if (params.get('ratingMin') || params.get('vote_average_gte')) {
        tmdbParams.set('vote_average.gte', params.get('ratingMin') || params.get('vote_average_gte')!);
      }
      if (params.get('minVoteCount') || params.get('vote_count_gte')) {
        tmdbParams.set('vote_count.gte', params.get('minVoteCount') || params.get('vote_count_gte')!);
      }
      if (params.get('with_people')) tmdbParams.set('with_people', params.get('with_people')!);
      if (params.get('with_companies')) tmdbParams.set('with_companies', params.get('with_companies')!);

      const data = await fetchTmdbJson(`/discover/${media}`, tmdbParams);
      if (data && Array.isArray(data.results)) {
        const list = data.results.map((item: any) => mapTmdbItem(item, media)).filter(Boolean);
        return res.json({
          list,
          page: Number(data.page || 1),
          total_pages: Number(data.total_pages || 1),
          total_results: Number(data.total_results || list.length),
          source: 'tmdb',
        });
      }
    }

    const withPeople = params.get('with_people');
    const withCompanies = params.get('with_companies');
    const withType = params.get('with_type');
    const sortBy = params.get('sort_by') || 'popularity.desc';
    const minVoteCount = Number(params.get('vote_count_gte') || 0);
    const hasFilterQuery = Boolean(params.get('genres') || params.get('yearMin') || params.get('ratingMin'));

    let curatedKey: string | null = null;
    if (page === 1 && !hasFilterQuery) {
      if (withPeople === '525') curatedKey = 'nolan-films';
      else if (withPeople === '27571') curatedKey = 'villeneuve-films';
      else if (withCompanies === '41077') curatedKey = 'a24-films';
      else if (withCompanies === '420') curatedKey = 'marvel-mcu';
      else if (withType === '2') curatedKey = 'limited-series';
      else if (type === 'anime') curatedKey = 'anime-dominion';
      else if ((type === 'hindi' || language === 'hi') && media === 'movie') curatedKey = 'hindi-blockbusters';
      else if (language === 'hi' && media === 'tv') curatedKey = 'hindi-series';
      else if (sortBy === 'revenue.desc') curatedKey = 'blockbuster-hits';
      else if (sortBy === 'vote_average.desc' && minVoteCount >= 500) {
        curatedKey = media === 'tv' ? 'top-rated-series' : 'top-rated-movies';
      }
    }

    if (curatedKey && CURATED_TMDB_IDS[curatedKey]) {
      const curated = await hydrateCuratedList(CURATED_TMDB_IDS[curatedKey]);
      if (curated.length > 0) {
        return res.json({
          list: curated,
          page: 1,
          total_pages: type === 'hindi' ? 10 : 1,
          total_results: curated.length,
          source: 'live-curated',
        });
      }
    }

    const bingrParams = new URLSearchParams({ page: String(page) });
    const rawGenres = (params.get('with_genres') || params.get('genres') || '').replace(/\|/g, ',');
    if (type === 'anime' && !rawGenres) {
      bingrParams.set('with_genres', '16');
    } else if (type === 'show' && !rawGenres) {
      bingrParams.set('with_genres', '10764,10767');
    } else if (rawGenres) {
      bingrParams.set('with_genres', rawGenres);
    }

    if (type === 'hindi' || language === 'hi') {
      bingrParams.set('with_original_language', 'hi');
    } else if (language && language !== 'all') {
      bingrParams.set('with_original_language', language);
    }

    if (sortBy === 'primary_release_date.desc' || sortBy === 'date') {
      bingrParams.set('sort_by', media === 'tv' ? 'first_air_date.desc' : 'primary_release_date.desc');
    } else if (sortBy === 'vote_average.desc') {
      bingrParams.set('sort_by', 'vote_average.desc');
    } else {
      bingrParams.set('sort_by', 'popularity.desc');
    }

    const useTrending =
      page === 1 &&
      !bingrParams.get('with_genres') &&
      !bingrParams.get('with_original_language') &&
      bingrParams.get('sort_by') === 'popularity.desc' &&
      !params.get('yearMin') &&
      !params.get('ratingMin');

    const endpoint = useTrending
      ? `/trending/${media}`
      : `/discover/${media}?${bingrParams.toString()}`;

    const liveData = await fetchBingrJson(endpoint);
    if (liveData && Array.isArray(liveData.results)) {
      const yearMin = Number(params.get('yearMin') || 0);
      const ratingMin = Number(params.get('ratingMin') || 0);

      let list = liveData.results
        .map((item: any) => mapTmdbItem(item, media))
        .filter((m: MediaSummary | null): m is MediaSummary => Boolean(m && m.poster));

      if (yearMin > 0) {
        list = list.filter((m: MediaSummary) => {
          const y = Number(m.year);
          return !y || y >= yearMin;
        });
      }
      if (ratingMin > 0) {
        list = list.filter((m: MediaSummary) => Number(m.score) >= ratingMin);
      }
      if (sortBy === 'vote_average.desc') {
        list.sort((a: MediaSummary, b: MediaSummary) => Number(b.score) - Number(a.score));
      } else if (sortBy === 'primary_release_date.desc') {
        list.sort((a: MediaSummary, b: MediaSummary) => Number(b.year || 0) - Number(a.year || 0));
      }

      if (list.length > 0) {
        return res.json({
          list,
          page: Number(liveData.page || page),
          total_pages: Number(liveData.total_pages || 10),
          total_results: list.length * Number(liveData.total_pages || 1),
          source: 'live',
        });
      }
    }

    return res.json({ ...queryVaultDiscover(params), source: 'vault' });
  });

  // Live Multi-Title + People Avatar Search
  app.get('/api/tmdb/search', async (req, res) => {
    const q = String(req.query.q || '').trim();
    if (!q) {
      return res.json({ results: [], people: [], source: 'live' });
    }

    const apiKey = getTmdbApiKey();
    if (apiKey) {
      const [movieData, tvData, peopleData] = await Promise.all([
        fetchTmdbJson('/search/movie', new URLSearchParams({ query: q, include_adult: 'false', language: 'en-US' })),
        fetchTmdbJson('/search/tv', new URLSearchParams({ query: q, include_adult: 'false', language: 'en-US' })),
        fetchTmdbJson('/search/person', new URLSearchParams({ query: q, include_adult: 'false', language: 'en-US' })),
      ]);

      if (movieData || tvData) {
        const movies = (movieData?.results || []).map((m: any) => mapTmdbItem(m, 'movie')).filter(Boolean);
        const tv = (tvData?.results || []).map((t: any) => mapTmdbItem(t, 'tv')).filter(Boolean);
        const results = [...movies, ...tv].sort((a: any, b: any) => b.popularity - a.popularity);
        const people: PersonResult[] = (peopleData?.results || []).slice(0, 12).map((p: any) => ({
          id: Number(p.id),
          name: String(p.name || ''),
          profile: p.profile_path ? `${TMDB_IMG_W500}${p.profile_path}` : '',
          popularity: Number(p.popularity || 0),
          department: String(p.known_for_department || 'Acting'),
          knownFor: Array.isArray(p.known_for)
            ? p.known_for.map((k: any) => String(k.title || k.name || '')).filter(Boolean)
            : [],
        }));
        return res.json({ results, people, source: 'tmdb' });
      }
    }

    const qLower = q.toLowerCase();
    const matchedDirectory = Array.from(peopleDirectory.values())
      .filter((p) => p.name.toLowerCase().includes(qLower))
      .slice(0, 8);

    const [bingrSearch, hydratedPeople] = await Promise.all([
      fetchBingrJson(`/search?q=${encodeURIComponent(q)}`),
      Promise.all(
        matchedDirectory.map(async (p) => {
          const liveP = await fetchBingrJson(`/person/${p.id}`);
          if (liveP && liveP.id) {
            const credits = [
              ...(Array.isArray(liveP.directed) ? liveP.directed : []),
              ...(Array.isArray(liveP.filmography) ? liveP.filmography : []),
            ];
            return {
              id: Number(liveP.id),
              name: String(liveP.name || p.name),
              profile: typeof liveP.photo === 'string' ? liveP.photo : p.profile || '',
              popularity: 95,
              department: String(liveP.known_for_department || p.department),
              knownFor: credits.slice(0, 3).map((c: any) => String(c.title || c.name || '')).filter(Boolean),
            } as PersonResult;
          }
          return {
            id: p.id,
            name: p.name,
            profile: p.profile || '',
            popularity: 80,
            department: p.department,
            knownFor: [],
          } as PersonResult;
        }),
      ),
    ]);

    if (bingrSearch && Array.isArray(bingrSearch.results)) {
      const results = bingrSearch.results
        .map((item: any) => mapTmdbItem(item, item.type === 'tv' ? 'tv' : 'movie'))
        .filter((m: MediaSummary | null): m is MediaSummary => Boolean(m && m.poster));

      return res.json({
        results,
        people: hydratedPeople,
        source: 'live',
      });
    }

    const vaultMatch = searchVaultCatalog(q);
    return res.json({
      results: vaultMatch.results,
      people: hydratedPeople.length > 0 ? hydratedPeople : vaultMatch.people,
      source: 'vault',
    });
  });

  app.get('/api/tmdb/detail', async (req, res) => {
    const id = Number(req.query.tmdbId || req.query.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid tmdbId' });
    }
    const mediaType: MediaType = req.query.mediaType === 'tv' || req.query.type === 'tv' ? 'tv' : 'movie';

    const apiKey = getTmdbApiKey();
    if (apiKey) {
      const raw = await fetchTmdbJson(
        `/${mediaType}/${id}`,
        new URLSearchParams({
          language: 'en-US',
          append_to_response: 'credits,videos,recommendations,external_ids,images',
        }),
      );
      if (raw && raw.id) {
        const trailer = (raw.videos?.results || []).find(
          (v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser') && v.key,
        );
        const enLogo = (raw.images?.logos || []).find((l: any) => l.iso_639_1 === 'en') || raw.images?.logos?.[0];
        const detail: MediaDetail = {
          id: Number(raw.id),
          mediaType,
          imdbId: String(raw.external_ids?.imdb_id || raw.imdb_id || ''),
          title: String(raw.title || raw.name || ''),
          logo: enLogo?.file_path ? `${TMDB_IMG_W500}${enLogo.file_path}` : undefined,
          overview: String(raw.overview || ''),
          poster: raw.poster_path ? `${TMDB_IMG_W500}${raw.poster_path}` : '',
          backdrop: raw.backdrop_path ? `${TMDB_IMG_ORIGINAL}${raw.backdrop_path}` : '',
          score: toScore(raw.vote_average),
          voteCount: Number(raw.vote_count || 0),
          year: toYear(raw.release_date || raw.first_air_date),
          releaseDate: String(raw.release_date || raw.first_air_date || ''),
          runtime: Number(raw.runtime || raw.episode_run_time?.[0] || 0) || null,
          seasons: raw.number_of_seasons || null,
          episodes: raw.number_of_episodes || null,
          contentRating: mediaType === 'tv' ? 'TV-MA' : 'PG-13',
          genreIds: (raw.genres || []).map((g: any) => Number(g.id)),
          genres: (raw.genres || []).map((g: any) => String(g.name)),
          language: String(raw.original_language || 'en'),
          popularity: Number(raw.popularity || 0),
          trailerEmbedUrl: trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0` : undefined,
          directors: (raw.credits?.crew || [])
            .filter((c: any) => c.job === 'Director')
            .slice(0, 3)
            .map((c: any) => ({
              id: Number(c.id),
              name: String(c.name),
              profile: c.profile_path ? `${TMDB_IMG_W500}${c.profile_path}` : undefined,
            })),
          cast: (raw.credits?.cast || []).slice(0, 14).map((c: any) => ({
            id: Number(c.id),
            name: String(c.name),
            character: String(c.character || ''),
            profile: c.profile_path ? `${TMDB_IMG_W500}${c.profile_path}` : undefined,
          })),
          recommendations: (raw.recommendations?.results || [])
            .slice(0, 12)
            .map((r: any) => mapTmdbItem(r, mediaType))
            .filter(Boolean) as MediaSummary[],
        };
        return res.json({ detail, source: 'tmdb' });
      }
    }

    const liveDetail = await fetchBingrDetailMapped(mediaType, id);
    if (liveDetail) {
      return res.json({ detail: liveDetail, source: 'live' });
    }

    const vaultDetail = getVaultDetail(id, mediaType);
    if (!vaultDetail) {
      return res.status(404).json({ error: 'Title not found' });
    }
    return res.json({ detail: vaultDetail, source: 'vault' });
  });

  app.get('/api/tmdb/person/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid person id' });
    }

    const apiKey = getTmdbApiKey();
    if (apiKey) {
      const raw = await fetchTmdbJson(
        `/person/${id}`,
        new URLSearchParams({ language: 'en-US', append_to_response: 'combined_credits' }),
      );
      if (raw && raw.id) {
        const credits = [...(raw.combined_credits?.cast || []), ...(raw.combined_credits?.crew || [])]
          .map((c: any) => mapTmdbItem(c, c.media_type === 'tv' ? 'tv' : 'movie'))
          .filter(Boolean) as MediaSummary[];
        const uniqueCredits = Array.from(new Map(credits.map((c) => [`${c.mediaType}-${c.id}`, c])).values()).slice(0, 20);
        const person: PersonResult = {
          id: Number(raw.id),
          name: String(raw.name || ''),
          profile: raw.profile_path ? `${TMDB_IMG_W500}${raw.profile_path}` : '',
          popularity: Number(raw.popularity || 0),
          department: String(raw.known_for_department || 'Acting'),
          knownFor: uniqueCredits.slice(0, 4).map((c) => c.title),
          biography: String(raw.biography || ''),
          birthday: String(raw.birthday || ''),
          placeOfBirth: String(raw.place_of_birth || ''),
          credits: uniqueCredits,
        };
        return res.json({ person, source: 'tmdb' });
      }
    }

    const bingrPerson = await fetchBingrJson(`/person/${id}`);
    if (bingrPerson && bingrPerson.id) {
      const combined = [
        ...(Array.isArray(bingrPerson.directed) ? bingrPerson.directed : []),
        ...(Array.isArray(bingrPerson.filmography) ? bingrPerson.filmography : []),
      ]
        .map((c: any) => mapTmdbItem(c, c.type === 'tv' ? 'tv' : 'movie'))
        .filter((m: MediaSummary | null): m is MediaSummary => Boolean(m && m.poster));

      const uniqueCredits = Array.from(
        new Map(combined.map((c) => [`${c.mediaType}-${c.id}`, c])).values(),
      ).slice(0, 24);

      const person: PersonResult = {
        id: Number(bingrPerson.id),
        name: String(bingrPerson.name || ''),
        profile: typeof bingrPerson.photo === 'string' ? bingrPerson.photo : '',
        popularity: 95,
        department: String(bingrPerson.known_for_department || 'Acting'),
        knownFor: uniqueCredits.slice(0, 4).map((c) => c.title),
        biography: String(bingrPerson.biography || ''),
        birthday: String(bingrPerson.birthday || ''),
        placeOfBirth: String(bingrPerson.place_of_birth || ''),
        credits: uniqueCredits,
      };
      return res.json({ person, source: 'live' });
    }

    const vaultPerson = getVaultPerson(id);
    if (!vaultPerson) {
      return res.status(404).json({ error: 'Person not found' });
    }
    return res.json({ person: vaultPerson, source: 'vault' });
  });

  app.get('/api/player/resolve', async (req, res) => {
    const tmdbId = Number(req.query.tmdbId || req.query.id);
    if (!Number.isSafeInteger(tmdbId) || tmdbId <= 0) {
      return res.status(400).json({ error: 'Invalid tmdbId' });
    }

    const mediaType = normalizePlayerMediaType(String(req.query.type || req.query.mediaType || 'movie'));
    const provider = getPlayerProvider(String(req.query.provider || 'cinesrc'));
    const season = Math.max(1, Number(req.query.season || 1));
    const episode = Math.max(1, Number(req.query.episode || 1));

    let seasonDetail: SeasonDetail | null = null;
    if (mediaType === 'tv') {
      const apiKey = getTmdbApiKey();
      if (apiKey) {
        const rawSeason = await fetchTmdbJson(
          `/tv/${tmdbId}/season/${season}`,
          new URLSearchParams({ language: 'en-US' }),
        );
        if (rawSeason && Array.isArray(rawSeason.episodes)) {
          seasonDetail = {
            seasonNumber: Number(rawSeason.season_number || season),
            title: String(rawSeason.name || `Season ${season}`),
            overview: String(rawSeason.overview || ''),
            episodeCount: rawSeason.episodes.length,
            episodes: rawSeason.episodes.map((ep: any) => ({
              id: Number(ep.id || ep.episode_number),
              seasonNumber: Number(ep.season_number || season),
              episodeNumber: Number(ep.episode_number),
              title: String(ep.name || `Episode ${ep.episode_number}`),
              overview: String(ep.overview || ''),
              still: ep.still_path ? `${TMDB_IMG_W500}${ep.still_path}` : undefined,
              airDate: String(ep.air_date || ''),
              runtime: typeof ep.runtime === 'number' ? ep.runtime : null,
            })),
          };
        }
      }

      if (!seasonDetail) {
        const bingrSeason = await fetchBingrJson(`/episodes/${tmdbId}/${season}`);
        if (bingrSeason && Array.isArray(bingrSeason.episodes) && bingrSeason.episodes.length > 0) {
          seasonDetail = {
            seasonNumber: Number(bingrSeason.season || season),
            title: `Season ${bingrSeason.season || season}`,
            overview: '',
            episodeCount: bingrSeason.episodes.length,
            episodes: bingrSeason.episodes.map((ep: any): EpisodeItem => ({
              id: tmdbId * 1000 + season * 100 + Number(ep.episode),
              seasonNumber: season,
              episodeNumber: Number(ep.episode),
              title: String(ep.title || `Episode ${ep.episode}`),
              overview: String(ep.overview || ''),
              still: typeof ep.still === 'string' && ep.still ? ep.still : undefined,
              airDate: String(ep.air_date || ''),
              runtime: null,
            })),
          };
        }
      }

      if (!seasonDetail) {
        const detail = getVaultDetail(tmdbId, 'tv');
        seasonDetail =
          detail?.seasonsDetail?.find((s) => s.seasonNumber === season) ||
          detail?.seasonsDetail?.[0] || {
            seasonNumber: season,
            title: `Season ${season}`,
            overview: '',
            episodeCount: 10,
            episodes: Array.from({ length: 10 }, (_, idx) => ({
              id: tmdbId * 100 + idx + 1,
              seasonNumber: season,
              episodeNumber: idx + 1,
              title: `Episode ${idx + 1}`,
              overview: `Season ${season}, Episode ${idx + 1}`,
              runtime: 45,
            })),
          };
      }
    }

    const embedUrl = buildProviderUrl({
      provider: provider.id,
      mediaType,
      tmdbId,
      season,
      episode,
      accentColor: String(req.query.color || '9333ea'),
      subtitleLang: String(req.query.subtitleLang || 'en'),
    });

    return res.json({
      provider,
      providers: PLAYER_PROVIDERS,
      embedUrl,
      tmdbId,
      mediaType,
      season,
      episode,
      episodeCount: mediaType === 'movie' ? 1 : seasonDetail?.episodeCount || 10,
      seasonDetail,
    });
  });

  app.get('/api/player/bingr', async (req, res) => {
    const tmdbId = Number(req.query.tmdbId);
    if (!Number.isSafeInteger(tmdbId) || tmdbId <= 0) {
      return res.status(400).json({ error: 'Invalid TMDB ID' });
    }
    const mediaType = normalizePlayerMediaType(String(req.query.type || 'movie'));

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const detailsResponse = await fetch(`${BINGR_API}/details/${mediaType}/${tmdbId}`, {
        signal: controller.signal,
        headers: BINGR_HEADERS,
      });
      if (!detailsResponse.ok) throw new Error('Metadata unavailable');
      const details = (await detailsResponse.json()) as { title?: string; year?: string; imdb_id?: string };
      const query: Record<string, string | number> = {};
      if (typeof details.title === 'string') query.title = details.title.slice(0, 300);
      if (typeof details.year === 'string') query.year = details.year.slice(0, 10);
      if (typeof details.imdb_id === 'string') query.imdb_id = details.imdb_id.slice(0, 30);
      if (mediaType === 'tv') {
        query.season = Math.max(1, Number(req.query.season || 1));
        query.episode = Math.max(1, Number(req.query.episode || 1));
      }

      const streamResponse = await fetch(`${BINGR_API}/stream`, {
        signal: controller.signal,
        method: 'POST',
        headers: { ...BINGR_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ srv: 's3', t: mediaType, id: String(tmdbId), query }),
      });
      if (!streamResponse.ok) throw new Error('Stream unavailable');
      const payload = (await streamResponse.json()) as {
        sources?: Array<{ url?: string; type?: string }>;
      };

      for (const source of (payload.sources || []).slice(0, 8)) {
        if (typeof source.url !== 'string' || !/mpegurl|hls/i.test(source.type || '')) continue;
        try {
          const url = unwrapBingrMediaUrl(source.url);
          return res.json({
            streamUrl: `/api/player/media?url=${encodeURIComponent(url.href)}`,
            title: details.title,
          });
        } catch {
          /* continue */
        }
      }
      return res.status(502).json({ error: 'Direct HLS stream unavailable for this title. Switch to CineSrc or VidFast.' });
    } catch {
      return res.status(502).json({ error: 'Bingr direct stream is unavailable right now. Please select CineSrc or VidFast.' });
    } finally {
      clearTimeout(timer);
    }
  });

  app.get('/api/player/media', async (req, res) => {
    const rawUrl = String(req.query.url || '');
    let target: URL;
    try {
      target = validateBingrMediaUrl(rawUrl);
    } catch {
      return res.status(400).send('Invalid media URL');
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const upstream = await fetch(target.href, { signal: controller.signal });
      if (!upstream.ok || !upstream.body) {
        return res.status(upstream.status || 502).send('Media unavailable');
      }
      const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
      const isPlaylist =
        target.pathname.endsWith('.m3u8') ||
        contentType.includes('mpegurl') ||
        contentType.includes('x-mpegURL');
      if (isPlaylist) {
        const text = await upstream.text();
        const rewritten = rewriteBingrPlaylist(text, target);
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        res.setHeader('Cache-Control', 'no-store');
        return res.send(rewritten);
      }
      res.setHeader('Content-Type', contentType);
      const buffer = Buffer.from(await upstream.arrayBuffer());
      return res.send(buffer);
    } catch {
      return res.status(502).send('Upstream media relay failed');
    } finally {
      clearTimeout(timer);
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dexterx Cenima running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
