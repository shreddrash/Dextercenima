import express from 'express';
import {
  buildProviderUrl,
  getPlayerProvider,
  normalizePlayerMediaType,
  PLAYER_PROVIDERS,
} from '../shared/playerSources';
import type {
  CastMember,
  EpisodeItem,
  MediaDetail,
  MediaSummary,
  MediaType,
  PersonResult,
  SeasonDetail,
  StreamingPlatform,
} from '../shared/types';
import {
  getPlatformCategories,
  type CuratedCategoryConfig,
} from '../shared/curatedCategories';
import {
  GENRE_MAP,
  getAllVaultItems,
  getHeroVaultItems,
  getVaultDetail,
  getVaultPerson,
  isAllowedOnPlatform,
  isAnimeMedia,
  isKidsSafeMedia,
  queryVaultDiscover,
  searchVaultCatalog,
} from '../shared/vaultCatalog';
import {
  CRICKET_ENGLISH_STREAMS,
  CRICKET_HINDI_STREAMS,
  FOOTBALL_ENGLISH_STREAMS,
  FOOTBALL_HINDI_STREAMS,
  SPORTS_IMAGES,
  VERIFIED_LIVE_SPORTS_CHANNELS,
} from '../shared/sportsCatalog';
import type { SportKind, SportMatch, SportStreamSource, WorldChannel } from '../shared/types';

const SPORTS_JSON_FEED_URL =
  'https://raw.githubusercontent.com/byte-capsule/FanCode-Hls-Fetcher/main/Fancode_hls_m3u8.Json';
const WORLD_CHANNELS_M3U_URL = 'https://iptv-org.github.io/iptv/categories/sports.m3u';
const ESPN_SOCCER_HEADER_URL =
  'https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=soccer';
const ESPN_CRICKET_HEADER_URL =
  'https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=cricket';

function cleanSportText(input: unknown): string {
  return String(input || '')
    .replace(/fan\s*code/gi, 'Dexterx Sports')
    .replace(/\bfc[-\s]?web\b/gi, '')
    .trim();
}

function classifySportKind(catRaw: string, tournament: string, title: string): SportKind {
  const hay = `${catRaw} ${tournament} ${title}`.toLowerCase();
  if (
    /\b(football|soccer|fifa|uefa|champions league|premier league|la liga|laliga|bundesliga|serie a|ligue 1|afc|isl|europa|copa|euro)\b/.test(
      hay,
    ) ||
    hay.includes('ft-flags')
  ) {
    return 'football';
  }
  if (
    /\b(cricket|t20|odi|test|ipl|bbl|psl|cpl|bpl|ranji|sheffield|shield|ashes|icc|bcci|super smash|hundred|blast|trophy|plunket|csa)\b/.test(
      hay,
    ) ||
    hay.includes('cr-flags')
  ) {
    return 'cricket';
  }
  return 'other';
}

function isSafePublicHttpUrl(rawUrl: string): URL | null {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
    if (parsed.username || parsed.password) return null;
    const host = parsed.hostname.toLowerCase();
    if (
      !host ||
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '::1' ||
      host.endsWith('.local') ||
      host.endsWith('.internal') ||
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) ||
      /^169\.254\./.test(host)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function encodeSportsAssetUrl(rawUrl?: string | null): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const safe = isSafePublicHttpUrl(rawUrl.trim());
  if (!safe) return '';
  const token = Buffer.from(safe.href, 'utf8').toString('base64url');
  return `/api/sports/asset?t=${encodeURIComponent(token)}`;
}

function normalizeAudioLangLabel(raw: string): string {
  const s = raw.trim().toLowerCase();
  if (!s) return '';
  if (s === 'en' || s === 'eng' || s.includes('english')) return 'English';
  if (s === 'hi' || s === 'hin' || s.includes('hindi')) return 'Hindi';
  if (s === 'es' || s === 'spa' || s.includes('spanish') || s.includes('espanol') || s.includes('español')) return 'Spanish';
  if (s === 'fr' || s === 'fra' || s === 'fre' || s.includes('french') || s.includes('fran')) return 'French';
  if (s === 'ar' || s === 'ara' || s.includes('arabic')) return 'Arabic';
  if (s === 'tr' || s === 'tur' || s.includes('turkish') || s.includes('türk')) return 'Turkish';
  if (s === 'ta' || s === 'tam' || s.includes('tamil')) return 'Tamil';
  if (s === 'te' || s === 'tel' || s.includes('telugu')) return 'Telugu';
  if (s === 'pt' || s === 'por' || s.includes('portug')) return 'Portuguese';
  return '';
}

async function probeHlsManifest(url: string): Promise<{ ok: boolean; languages: string[] }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3200);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        Accept: '*/*',
      },
    });
    if (!res.ok) return { ok: false, languages: [] };
    const text = await res.text();
    if (!text.includes('#EXTM3U')) return { ok: false, languages: [] };

    const detected = new Set<string>();
    for (const line of text.split(/\r?\n/)) {
      if (!line.includes('TYPE=AUDIO')) continue;
      const nameMatch = line.match(/NAME="([^"]+)"/i);
      const langMatch = line.match(/LANGUAGE="([^"]+)"/i);
      const parsed =
        normalizeAudioLangLabel(nameMatch?.[1] || '') ||
        normalizeAudioLangLabel(langMatch?.[1] || '');
      if (parsed) detected.add(parsed);
    }
    return { ok: true, languages: Array.from(detected) };
  } catch {
    return { ok: false, languages: [] };
  } finally {
    clearTimeout(timer);
  }
}

async function probeHlsPlayable(url: string): Promise<boolean> {
  const res = await probeHlsManifest(url);
  return res.ok;
}

function teamTokensMatch(a: string, b: string): boolean {
  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !['fc', 'sc', 'club', 'united', 'city', 'region'].includes(w));
  const ta = clean(a);
  const tb = clean(b);
  return ta.some((w) => tb.includes(w));
}

function parseHexTeamColor(raw?: unknown): string | undefined {
  if (typeof raw !== 'string') return undefined;
  const cleaned = raw.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{6}$/.test(cleaned) && cleaned.toLowerCase() !== 'ffffff' && cleaned.toLowerCase() !== '000000') {
    return `#${cleaned}`;
  }
  return undefined;
}

function buildDualLanguageStreams(
  sport: 'football' | 'cricket',
  primaryStreams: SportStreamSource[],
  liveCricketEn: SportStreamSource[],
  liveCricketHi: SportStreamSource[],
  liveFootballEn: SportStreamSource[],
  liveFootballHi: SportStreamSource[],
): SportStreamSource[] {
  const enPool = sport === 'cricket' ? liveCricketEn : liveFootballEn;
  const hiPool = sport === 'cricket' ? liveCricketHi : liveFootballHi;
  const combined = [...primaryStreams, ...enPool.slice(0, 1), ...hiPool.slice(0, 1), ...enPool.slice(1), ...hiPool.slice(1)];
  const seenUrl = new Set<string>();
  const deduped: SportStreamSource[] = [];
  for (const s of combined) {
    if (!s.url || seenUrl.has(s.url)) continue;
    seenUrl.add(s.url);
    deduped.push(s);
  }
  return deduped;
}

function parseEspnHeaderEvents(
  payload: any,
  sport: 'football' | 'cricket',
  upstreamLiveMatches: SportMatch[],
  livePools: {
    cricketEn: SportStreamSource[];
    cricketHi: SportStreamSource[];
    footballEn: SportStreamSource[];
    footballHi: SportStreamSource[];
  },
): SportMatch[] {
  const leagues: any[] = payload?.sports?.[0]?.leagues || [];
  const results: SportMatch[] = [];
  const seenIds = new Set<string>();

  for (const league of leagues) {
    const tournament = cleanSportText(league?.name || (sport === 'football' ? 'Football' : 'Cricket'));
    const events: any[] = Array.isArray(league?.events) ? league.events : [];
    for (const ev of events) {
      const state = String(ev?.fullStatus?.type?.state || ev?.status || '').toLowerCase();
      // STRICTLY LIVE ('in') OR UPCOMING ('pre') ONLY — NEVER past/completed ('post')
      if (state !== 'in' && state !== 'pre') continue;

      const evId = `${sport}-${ev.id}`;
      if (seenIds.has(evId)) continue;
      seenIds.add(evId);

      const comps: any[] = Array.isArray(ev?.competitors) ? ev.competitors : [];
      const home = comps[0] || {};
      const away = comps[1] || {};
      const team1 = cleanSportText(home.displayName || home.name || ev.shortName || 'Home');
      const team2 = cleanSportText(away.displayName || away.name || 'Away');
      const matchTitle =
        team1 && team2 && team2 !== 'Away' ? `${team1} vs ${team2}` : cleanSportText(ev.name || tournament);

      const s1 = home.score ? String(home.score).trim() : '';
      const s2 = away.score ? String(away.score).trim() : '';
      const scoreline =
        state === 'in' && (s1 || s2)
          ? `${home.abbreviation || team1} ${s1 || '0'} · ${away.abbreviation || team2} ${s2 || '0'}`
          : undefined;

      const rawDetail =
        ev?.fullStatus?.type?.shortDetail ||
        ev?.summary ||
        (state === 'in' ? 'LIVE' : 'Upcoming');

      const matchingUpstream = upstreamLiveMatches.find(
        (u) =>
          u.sport === sport &&
          ((teamTokensMatch(team1, u.team1) && teamTokensMatch(team2, u.team2)) ||
            (teamTokensMatch(team1, u.team2) && teamTokensMatch(team2, u.team1))),
      );

      const attachedStreams = buildDualLanguageStreams(
        sport,
        matchingUpstream ? matchingUpstream.streams : [],
        livePools.cricketEn,
        livePools.cricketHi,
        livePools.footballEn,
        livePools.footballHi,
      );

      const langs = Array.from(
        new Set(
          attachedStreams
            .map((s) => (s.language === 'Hindi' ? 'Hindi' : 'English'))
            .filter(Boolean),
        ),
      );

      const homeLogoRaw = home.logo || home.logos?.[0]?.href || home.logoDark;
      const awayLogoRaw = away.logo || away.logos?.[0]?.href || away.logoDark;

      results.push({
        id: evId,
        sport,
        isLive: state === 'in',
        matchStatus: state === 'in' ? 'live' : 'upcoming',
        kickoffTime: typeof ev.date === 'string' ? ev.date : undefined,
        statusDetail: cleanSportText(rawDetail),
        tournament,
        title: matchTitle,
        team1,
        team2,
        team1Badge: encodeSportsAssetUrl(homeLogoRaw) || undefined,
        team2Badge: encodeSportsAssetUrl(awayLogoRaw) || undefined,
        team1Color: parseHexTeamColor(home.color) || parseHexTeamColor(home.alternateColor),
        team2Color: parseHexTeamColor(away.color) || parseHexTeamColor(away.alternateColor),
        team1Score: s1 || undefined,
        team2Score: s2 || undefined,
        banner: sport === 'football' ? SPORTS_IMAGES.footballMatch : SPORTS_IMAGES.cricketMatch,
        scoreline,
        venue: cleanSportText(ev.location || '') || undefined,
        languages: langs.length > 0 ? langs : ['English', 'Hindi'],
        streams: attachedStreams,
      });
    }
  }

  // Live first, then upcoming soonest-first; prioritize fixtures with both club logos
  results.sort((a, b) => {
    if (a.matchStatus !== b.matchStatus) return a.matchStatus === 'live' ? -1 : 1;
    const aHasLogos = a.team1Badge && a.team2Badge ? 1 : 0;
    const bHasLogos = b.team1Badge && b.team2Badge ? 1 : 0;
    if (aHasLogos !== bHasLogos && a.matchStatus === 'live') return bHasLogos - aHasLogos;
    return (a.kickoffTime || '').localeCompare(b.kickoffTime || '');
  });
  return results;
}

function inferCountryFromTvgId(tvgId: string, rawCountry: string): string {
  if (rawCountry && /^[A-Za-z]{2}$/.test(rawCountry.trim())) {
    return rawCountry.trim().toUpperCase();
  }
  const m = tvgId.match(/\.([A-Za-z]{2})(?:@|$)/);
  if (m) return m[1].toUpperCase();
  return 'INTL';
}

function countryToRegion(code: string): string {
  const c = code.toUpperCase();
  if (['US', 'CA', 'MX'].includes(c)) return 'North America';
  if (['UK', 'GB', 'ES', 'FR', 'DE', 'IT', 'PT', 'NL', 'BE', 'TR', 'IL', 'GR', 'PL', 'SE', 'NO', 'RO', 'RU', 'HR', 'AT', 'CH'].includes(c)) {
    return 'UK & Europe';
  }
  if (['IN', 'PK', 'AU', 'NZ', 'BD', 'LK', 'JP', 'KR', 'CN', 'SG', 'TH', 'MY', 'ID', 'VN', 'PH', 'KH'].includes(c)) {
    return 'Asia & Cricket';
  }
  if (['BR', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'UY', 'PY'].includes(c)) {
    return 'Latin America';
  }
  if (['AE', 'SA', 'QA', 'EG', 'ZA', 'MA', 'KE', 'NG'].includes(c)) {
    return 'Middle East & Africa';
  }
  return 'Global';
}

async function fetchWorldChannelsFeed(): Promise<{
  channels: WorldChannel[];
  updatedAt: string;
}> {
  const cacheKey = 'worldchannels:iptv-v1';
  const cached = getCached<{ channels: WorldChannel[]; updatedAt: string }>(cacheKey);
  if (cached) return cached;

  const channels: WorldChannel[] = [];
  const seenUrls = new Set<string>();

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(WORLD_CHANNELS_M3U_URL, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 IPTV Proxy' },
    });
    clearTimeout(timer);

    if (res.ok) {
      const content = await res.text();
      const lines = content.split(/\r?\n/);

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
        if (!urlLine || !isSafePublicHttpUrl(urlLine) || seenUrls.has(urlLine)) continue;
        seenUrls.add(urlLine);

        const attr = (key: string) => {
          const match = line.match(new RegExp(`${key}="([^"]*)"`, 'i'));
          return match ? match[1].trim() : '';
        };

        const tvgId = attr('tvg-id');
        const tvgName = attr('tvg-name');
        const rawLogo = attr('tvg-logo');
        const rawCountry = attr('tvg-country');
        const group = attr('group-title') || 'World Sports';
        const commaIdx = line.lastIndexOf(',');
        const displayNameRaw = commaIdx !== -1 ? line.slice(commaIdx + 1).trim() : tvgName;
        const name = displayNameRaw || tvgName || `Channel ${channels.length + 1}`;
        const qMatch = name.match(/\((4K|1080p|720p|576p|480p|360p|SD|HD)\)/i);
        const quality = qMatch ? qMatch[1].toUpperCase() : 'LIVE';
        const country = inferCountryFromTvgId(tvgId, rawCountry);
        const region = countryToRegion(country);

        channels.push({
          id: tvgId ? `${tvgId}-${channels.length}` : `wc-${channels.length}`,
          name,
          logo: encodeSportsAssetUrl(rawLogo),
          country,
          region,
          quality,
          group,
          url: urlLine,
        });
      }
    }
  } catch {
    /* ignore */
  }

  const payload = {
    channels,
    updatedAt: new Date().toISOString(),
  };
  if (channels.length > 0) {
    setCached(cacheKey, payload, 5 * 60 * 1000);
  }
  return payload;
}

async function fetchLiveSportsFeed(): Promise<{
  football: SportMatch[];
  cricket: SportMatch[];
  channels: SportMatch[];
  languages: string[];
  updatedAt: string;
}> {
  const cacheKey = 'sports:live-upcoming-v6';
  const cached = getCached<{
    football: SportMatch[];
    cricket: SportMatch[];
    channels: SportMatch[];
    languages: string[];
    updatedAt: string;
  }>(cacheKey);
  if (cached) return cached;

  const probePool = async (pool: SportStreamSource[]): Promise<SportStreamSource[]> => {
    const checked = await Promise.all(
      pool.map(async (s) => ((await probeHlsPlayable(s.url)) ? s : null)),
    );
    const live = checked.filter((s): s is SportStreamSource => Boolean(s));
    return live.length > 0 ? live : pool;
  };

  // Probe live English & Hindi Football + Cricket broadcast streams + upstream JSON + ESPN fixtures
  const [
    liveCricketEn,
    liveCricketHi,
    liveFootballEn,
    liveFootballHi,
    jsonPayload,
    soccerHeader,
    cricketHeader,
  ] = await Promise.all([
    probePool(CRICKET_ENGLISH_STREAMS),
    probePool(CRICKET_HINDI_STREAMS),
    probePool(FOOTBALL_ENGLISH_STREAMS),
    probePool(FOOTBALL_HINDI_STREAMS),
    fetchJsonWithTimeout(SPORTS_JSON_FEED_URL, {}, 7000),
    fetchJsonWithTimeout(ESPN_SOCCER_HEADER_URL, {}, 7500),
    fetchJsonWithTimeout(ESPN_CRICKET_HEADER_URL, {}, 7500),
  ]);

  const inferEnOrHi = (raw: string): 'English' | 'Hindi' => {
    const low = raw.toLowerCase();
    return low.includes('hindi') || low.includes('hin') ? 'Hindi' : 'English';
  };

  // Check upstream single-match live streams; normalize strictly to English/Hindi and pair complementary audio
  const upstreamLiveStreams: SportMatch[] = [];
  if (jsonPayload && Array.isArray(jsonPayload.matches)) {
    const candidates = jsonPayload.matches.slice(0, 8);
    const probed = await Promise.all(
      candidates.map(async (m: Record<string, any>, idx: number): Promise<SportMatch | null> => {
        const streamUrl = String(m.adfree_url || m.stream_link || m.dai_url || '').trim();
        if (!streamUrl) return null;
        const manifest = await probeHlsManifest(streamUrl);
        if (!manifest.ok) return null;
        const tournament = cleanSportText(m.event_name || 'Live Tournament');
        const title = cleanSportText(m.match_name || `${m.team_1 || 'Team A'} vs ${m.team_2 || 'Team B'}`);
        const sportRaw = classifySportKind(
          String(m.event_catagory || m.event_category || ''),
          tournament,
          title,
        );
        const sport: 'football' | 'cricket' = sportRaw === 'cricket' ? 'cricket' : 'football';
        const explicitLang = inferEnOrHi(
          `${m.language || ''} ${m.audio_language || ''} ${title} ${tournament}`,
        );
        const primaryStream: SportStreamSource = {
          id: `primary-${explicitLang.toLowerCase()}-${idx}`,
          label: `Live HD (${explicitLang})`,
          language: explicitLang,
          quality: '1080p',
          url: streamUrl,
          kind: 'hls',
        };
        const streams = buildDualLanguageStreams(
          sport,
          [primaryStream],
          liveCricketEn,
          liveCricketHi,
          liveFootballEn,
          liveFootballHi,
        );
        const langs = Array.from(new Set(streams.map((s) => s.language)));

        return {
          id: `live-up-${m.match_id || idx}`,
          sport,
          isLive: true,
          matchStatus: 'live',
          statusDetail: `LIVE · ${langs.join(' & ')}`,
          tournament,
          title,
          team1: cleanSportText(m.team_1 || title.split(/\s+vs\s+/i)[0] || 'Home'),
          team2: cleanSportText(m.team_2 || title.split(/\s+vs\s+/i)[1] || 'Away'),
          team1Badge: encodeSportsAssetUrl(m.team_1_flag) || undefined,
          team2Badge: encodeSportsAssetUrl(m.team_2_flag) || undefined,
          banner:
            encodeSportsAssetUrl(m.banner || m.src) ||
            (sport === 'football' ? SPORTS_IMAGES.footballMatch : SPORTS_IMAGES.cricketMatch),
          languages: langs,
          streams,
        };
      }),
    );
    for (const item of probed) {
      if (item) upstreamLiveStreams.push(item);
    }
  }

  // Hydrate curated 24/7 English & Hindi broadcast channels with live probed streams
  const activeChannels: SportMatch[] = VERIFIED_LIVE_SPORTS_CHANNELS.map((ch) => {
    const sport: 'football' | 'cricket' = ch.sport === 'cricket' ? 'cricket' : 'football';
    const hasEn = ch.languages?.includes('English');
    const hasHi = ch.languages?.includes('Hindi');
    let streams: SportStreamSource[] = [];
    if (hasEn && hasHi) {
      streams = buildDualLanguageStreams(
        sport,
        [],
        liveCricketEn,
        liveCricketHi,
        liveFootballEn,
        liveFootballHi,
      );
    } else if (hasHi) {
      streams = sport === 'cricket' ? liveCricketHi : liveFootballHi;
    } else {
      streams = sport === 'cricket' ? liveCricketEn : liveFootballEn;
    }
    return {
      ...ch,
      languages: Array.from(new Set(streams.map((s) => s.language))),
      streams,
    };
  });

  const allLiveChannels = [...upstreamLiveStreams, ...activeChannels];

  const livePools = {
    cricketEn: liveCricketEn,
    cricketHi: liveCricketHi,
    footballEn: liveFootballEn,
    footballHi: liveFootballHi,
  };

  const footballFixtures = parseEspnHeaderEvents(
    soccerHeader,
    'football',
    upstreamLiveStreams,
    livePools,
  );
  const cricketFixtures = parseEspnHeaderEvents(
    cricketHeader,
    'cricket',
    upstreamLiveStreams,
    livePools,
  );

  // Live streaming broadcast channels first, followed by real live & upcoming fixtures (all playable live in EN & HI)
  const football = [
    ...allLiveChannels.filter((c) => c.sport === 'football'),
    ...footballFixtures,
  ];
  const cricket = [
    ...allLiveChannels.filter((c) => c.sport === 'cricket'),
    ...cricketFixtures,
  ];

  const payload = {
    football,
    cricket,
    channels: allLiveChannels,
    languages: ['English', 'Hindi'],
    updatedAt: new Date().toISOString(),
  };
  setCached(cacheKey, payload, 90 * 1000);
  return payload;
}

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

const peopleDirectory = new Map<number, { id: number; name: string; department: string; profile?: string }>([
  [525, { id: 525, name: 'Christopher Nolan', department: 'Directing' }],
  [137427, { id: 137427, name: 'Denis Villeneuve', department: 'Directing' }],
  [7467, { id: 7467, name: 'David Fincher', department: 'Directing' }],
  [488, { id: 488, name: 'Steven Spielberg', department: 'Directing' }],
  [1032, { id: 1032, name: 'Martin Scorsese', department: 'Directing' }],
  [138, { id: 138, name: 'Quentin Tarantino', department: 'Directing' }],
  [147021, { id: 147021, name: 'S. S. Rajamouli', department: 'Directing' }],
  [85675, { id: 85675, name: 'Rajkumar Hirani', department: 'Directing' }],
  [35742, { id: 35742, name: 'Shah Rukh Khan', department: 'Acting' }],
  [42802, { id: 42802, name: 'Salman Khan', department: 'Acting' }],
  [52763, { id: 52763, name: 'Aamir Khan', department: 'Acting' }],
  [78749, { id: 78749, name: 'Hrithik Roshan', department: 'Acting' }],
  [85034, { id: 85034, name: 'Ranbir Kapoor', department: 'Acting' }],
  [237045, { id: 237045, name: 'Prabhas', department: 'Acting' }],
  [108215, { id: 108215, name: 'Allu Arjun', department: 'Acting' }],
  [1179460, { id: 1179460, name: 'Pankaj Tripathi', department: 'Acting' }],
  [35782, { id: 35782, name: 'Manoj Bajpayee', department: 'Acting' }],
  [35780, { id: 35780, name: 'Amitabh Bachchan', department: 'Acting' }],
  [1293681, { id: 1293681, name: 'Yash', department: 'Acting' }],
  [1208682, { id: 1208682, name: 'Vikrant Massey', department: 'Acting' }],
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

async function fetchJsonWithTimeout(
  url: string,
  headers: Record<string, string> = {},
  timeoutMs = 7500,
): Promise<any | null> {
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
  const data = await fetchJsonWithTimeout(`${BINGR_API}${endpointPath}`, BINGR_HEADERS, 7500);
  if (data) setCached(cacheKey, data);
  return data;
}

async function fetchBingrDetailMapped(mediaType: MediaType, id: number): Promise<MediaDetail | null> {
  const raw = await fetchBingrJson(`/details/${mediaType}/${id}`);
  if (!raw || !raw.id) return null;

  const base = mapTmdbItem(raw, mediaType);
  if (!base) return null;

  const directorsRaw =
    Array.isArray(raw.directors) && raw.directors.length > 0
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
    ? (raw.similars
        .map((s: any) => mapTmdbItem(s, s.type === 'tv' ? 'tv' : mediaType))
        .filter(Boolean) as MediaSummary[])
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
    { id: 872906, type: 'movie' },
    { id: 864692, type: 'movie' },
    { id: 781732, type: 'movie' },
    { id: 801688, type: 'movie' },
    { id: 579974, type: 'movie' },
    { id: 20453, type: 'movie' },
    { id: 360814, type: 'movie' },
    { id: 587412, type: 'movie' },
    { id: 256040, type: 'movie' },
    { id: 1163258, type: 'movie' },
    { id: 538858, type: 'movie' },
    { id: 297222, type: 'movie' },
  ],
  'hindi-series': [
    { id: 84105, type: 'tv' },
    { id: 79352, type: 'tv' },
    { id: 93352, type: 'tv' },
    { id: 101352, type: 'tv' },
    { id: 111188, type: 'tv' },
    { id: 132117, type: 'tv' },
    { id: 89113, type: 'tv' },
    { id: 124411, type: 'tv' },
    { id: 103051, type: 'tv' },
    { id: 100911, type: 'tv' },
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
  'netflix-exclusives': [
    { id: 66732, type: 'tv' },
    { id: 93405, type: 'tv' },
    { id: 71446, type: 'tv' },
    { id: 119051, type: 'tv' },
    { id: 94605, type: 'tv' },
    { id: 70523, type: 'tv' },
    { id: 79352, type: 'tv' },
    { id: 89113, type: 'tv' },
    { id: 545609, type: 'movie' },
    { id: 512195, type: 'movie' },
    { id: 661374, type: 'movie' },
    { id: 725201, type: 'movie' },
  ],
  'prime-top-series': [
    { id: 76479, type: 'tv' },
    { id: 106379, type: 'tv' },
    { id: 84105, type: 'tv' },
    { id: 93352, type: 'tv' },
    { id: 108978, type: 'tv' },
    { id: 95557, type: 'tv' },
    { id: 101352, type: 'tv' },
    { id: 132117, type: 'tv' },
    { id: 84773, type: 'tv' },
    { id: 73375, type: 'tv' },
  ],
  'prime-originals': [
    { id: 76479, type: 'tv' },
    { id: 106379, type: 'tv' },
    { id: 108978, type: 'tv' },
    { id: 95557, type: 'tv' },
    { id: 84773, type: 'tv' },
    { id: 73375, type: 'tv' },
    { id: 588228, type: 'movie' },
    { id: 937278, type: 'movie' },
  ],
  'prime-hindi-thrillers': [
    { id: 84105, type: 'tv' },
    { id: 93352, type: 'tv' },
    { id: 101352, type: 'tv' },
    { id: 132117, type: 'tv' },
    { id: 103051, type: 'tv' },
    { id: 124411, type: 'tv' },
    { id: 111188, type: 'tv' },
    { id: 100911, type: 'tv' },
  ],
  'crunchyroll-top-anime': [
    { id: 127532, type: 'tv' },
    { id: 1429, type: 'tv' },
    { id: 85937, type: 'tv' },
    { id: 95479, type: 'tv' },
    { id: 209867, type: 'tv' },
    { id: 37854, type: 'tv' },
    { id: 114410, type: 'tv' },
    { id: 31911, type: 'tv' },
    { id: 120089, type: 'tv' },
    { id: 207468, type: 'tv' },
  ],
  'crunchyroll-shonen': [
    { id: 127532, type: 'tv' },
    { id: 85937, type: 'tv' },
    { id: 95479, type: 'tv' },
    { id: 37854, type: 'tv' },
    { id: 31910, type: 'tv' },
    { id: 65930, type: 'tv' },
    { id: 46298, type: 'tv' },
    { id: 207468, type: 'tv' },
  ],
  'crunchyroll-dark-fantasy': [
    { id: 1429, type: 'tv' },
    { id: 114410, type: 'tv' },
    { id: 13916, type: 'tv' },
    { id: 88803, type: 'tv' },
    { id: 95479, type: 'tv' },
    { id: 127532, type: 'tv' },
  ],
  'crunchyroll-anime-movies': [
    { id: 372058, type: 'movie' },
    { id: 129, type: 'movie' },
    { id: 810693, type: 'movie' },
    { id: 635302, type: 'movie' },
    { id: 916224, type: 'movie' },
  ],
  'crunchyroll-classics': [
    { id: 31911, type: 'tv' },
    { id: 209867, type: 'tv' },
    { id: 120089, type: 'tv' },
    { id: 46298, type: 'tv' },
    { id: 13916, type: 'tv' },
    { id: 88803, type: 'tv' },
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
  'top-rated-kids-movies': [
    { id: 1022789, type: 'movie' },
    { id: 324857, type: 'movie' },
    { id: 569094, type: 'movie' },
    { id: 354912, type: 'movie' },
    { id: 8587, type: 'movie' },
    { id: 862, type: 'movie' },
    { id: 315162, type: 'movie' },
    { id: 1011985, type: 'movie' },
    { id: 502356, type: 'movie' },
    { id: 12, type: 'movie' },
  ],
  'top-rated-kids-series': [
    { id: 246, type: 'tv' },
    { id: 82728, type: 'tv' },
    { id: 387, type: 'tv' },
    { id: 60572, type: 'tv' },
    { id: 65334, type: 'tv' },
    { id: 40075, type: 'tv' },
    { id: 15260, type: 'tv' },
    { id: 4686, type: 'tv' },
  ],
  'kids-disney-pixar': [
    { id: 1022789, type: 'movie' },
    { id: 354912, type: 'movie' },
    { id: 109445, type: 'movie' },
    { id: 277834, type: 'movie' },
    { id: 862, type: 'movie' },
    { id: 12, type: 'movie' },
    { id: 8587, type: 'movie' },
    { id: 150540, type: 'movie' },
  ],
  'kids-superheroes-adventure': [
    { id: 324857, type: 'movie' },
    { id: 569094, type: 'movie' },
    { id: 1011985, type: 'movie' },
    { id: 502356, type: 'movie' },
    { id: 315162, type: 'movie' },
    { id: 9806, type: 'movie' },
  ],
  'kids-comedy-animals': [
    { id: 519182, type: 'movie' },
    { id: 1011985, type: 'movie' },
    { id: 315162, type: 'movie' },
    { id: 502356, type: 'movie' },
    { id: 12, type: 'movie' },
    { id: 862, type: 'movie' },
  ],
  'kids-cartoons-series': [
    { id: 82728, type: 'tv' },
    { id: 387, type: 'tv' },
    { id: 60572, type: 'tv' },
    { id: 65334, type: 'tv' },
    { id: 40075, type: 'tv' },
    { id: 15260, type: 'tv' },
    { id: 246, type: 'tv' },
    { id: 4686, type: 'tv' },
  ],
};

async function hydrateCuratedList(items: Array<{ id: number; type: MediaType }>): Promise<MediaSummary[]> {
  const settled = await Promise.allSettled(
    items.map((entry) => fetchBingrDetailMapped(entry.type, entry.id)),
  );
  return settled
    .filter((r): r is PromiseFulfilledResult<MediaDetail | null> => r.status === 'fulfilled' && Boolean(r.value))
    .map((r) => {
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
      } = r.value!;
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

function normalizePlatformQuery(val?: string | null): StreamingPlatform {
  if (val === 'prime' || val === 'crunchyroll' || val === 'netflix' || val === 'sports') return val;
  return 'netflix';
}

async function resolveDiscoverPayload(params: URLSearchParams): Promise<{
  list: MediaSummary[];
  page: number;
  total_pages: number;
  total_results: number;
  source: string;
}> {
  const type = params.get('type');
  const platform = normalizePlatformQuery(params.get('platform'));
  const kidsOnly = (params.get('kids') === '1' || type === 'kids') && platform === 'netflix';
  const language = (params.get('language') || '').trim().toLowerCase();
  const effectiveType = platform === 'crunchyroll' ? 'anime' : type;
  const media: MediaType =
    effectiveType === 'tv' || effectiveType === 'anime' || effectiveType === 'show' || params.get('media') === 'tv'
      ? 'tv'
      : 'movie';
  const page = Math.max(1, Number(params.get('page') || 1));

  if (type === 'all') {
    const movieParams = new URLSearchParams(params);
    movieParams.set('type', platform === 'crunchyroll' ? 'anime' : 'movie');
    movieParams.set('media', 'movie');
    const tvParams = new URLSearchParams(params);
    tvParams.set('type', platform === 'crunchyroll' ? 'anime' : 'tv');
    tvParams.set('media', 'tv');
    const [mRes, tRes] = await Promise.all([
      resolveDiscoverPayload(movieParams),
      resolveDiscoverPayload(tvParams),
    ]);
    const combined: MediaSummary[] = [];
    const seen = new Set<string>();
    const maxLen = Math.max(mRes.list.length, tRes.list.length);
    for (let i = 0; i < maxLen; i++) {
      for (const candidate of [mRes.list[i], tRes.list[i]]) {
        if (!candidate) continue;
        if (!isAllowedOnPlatform(candidate, platform, kidsOnly)) continue;
        const k = `${candidate.mediaType}:${candidate.id}`;
        if (!seen.has(k)) {
          seen.add(k);
          combined.push(candidate);
        }
      }
    }
    if (page === 1) {
      for (const seed of getAllVaultItems()) {
        if (!isAllowedOnPlatform(seed, platform, kidsOnly)) continue;
        const k = `${seed.mediaType}:${seed.id}`;
        if (!seen.has(k) && combined.length < 48) {
          seen.add(k);
          combined.push(seed);
        }
      }
    }
    return {
      list: combined,
      page,
      total_pages: Math.max(mRes.total_pages, tRes.total_pages, 10),
      total_results: mRes.total_results + tRes.total_results,
      source: mRes.source,
    };
  }

  const filterIfKids = (items: MediaSummary[]) =>
    items.filter((item) => isAllowedOnPlatform(item, platform, kidsOnly) && (platform !== 'crunchyroll' || isAnimeMedia(item)));

  const apiKey = getTmdbApiKey();
  if (apiKey) {
    const tmdbParams = new URLSearchParams({
      language: 'en-US',
      include_adult: 'false',
      page: String(page),
      sort_by: params.get('sort_by') || 'popularity.desc',
    });
    const withGenres = params.get('with_genres') || params.get('genres') || '';
    if (kidsOnly && !withGenres) {
      tmdbParams.set('with_genres', media === 'tv' ? '16,10762' : '16,10751');
      tmdbParams.set('without_genres', '27,80,53,10752');
    } else if (type === 'anime' && !withGenres) {
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
      const list = filterIfKids(data.results.map((item: any) => mapTmdbItem(item, media)).filter(Boolean));
      return {
        list,
        page: Number(data.page || 1),
        total_pages: Number(data.total_pages || 1),
        total_results: Number(data.total_results || list.length),
        source: 'tmdb',
      };
    }
  }

  const withPeople = params.get('with_people');
  const withCompanies = params.get('with_companies');
  const withType = params.get('with_type');
  const sortBy = params.get('sort_by') || 'popularity.desc';
  const minVoteCount = Number(params.get('vote_count_gte') || 0);
  const curatedSlugParam = params.get('curatedSlug') || '';
  const hasFilterQuery = Boolean(params.get('genres') || params.get('yearMin') || params.get('ratingMin'));

  let curatedKey: string | null = curatedSlugParam && CURATED_TMDB_IDS[curatedSlugParam] ? curatedSlugParam : null;
  if (!curatedKey && page === 1 && !hasFilterQuery) {
    if (kidsOnly && media === 'tv' && sortBy === 'popularity.desc') curatedKey = 'top-rated-kids-series';
    else if (kidsOnly && media === 'movie' && sortBy === 'popularity.desc') curatedKey = 'top-rated-kids-movies';
    else if (kidsOnly && media === 'movie') curatedKey = 'kids-disney-pixar';
    else if (withPeople === '525') curatedKey = 'nolan-films';
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
    const curated = filterIfKids(await hydrateCuratedList(CURATED_TMDB_IDS[curatedKey]));
    if (curated.length > 0) {
      return {
        list: curated,
        page: 1,
        total_pages: type === 'hindi' || kidsOnly ? 6 : 1,
        total_results: curated.length,
        source: 'live-curated',
      };
    }
  }

  const bingrParams = new URLSearchParams({ page: String(page) });
  const rawGenres = (params.get('with_genres') || params.get('genres') || '').replace(/\|/g, ',');
  if (kidsOnly && !rawGenres) {
    bingrParams.set('with_genres', media === 'tv' ? '16,10762' : '16,10751');
  } else if (type === 'anime' && !rawGenres) {
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
    !kidsOnly &&
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

    let list = filterIfKids(
      liveData.results
        .map((item: any) => mapTmdbItem(item, media))
        .filter((m: MediaSummary | null): m is MediaSummary => Boolean(m && m.poster)),
    );

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

    if (kidsOnly && list.length < 8) {
      const vaultKids = queryVaultDiscover(params).list;
      const seen = new Set(list.map((i) => `${i.mediaType}:${i.id}`));
      for (const vk of vaultKids) {
        if (!seen.has(`${vk.mediaType}:${vk.id}`)) {
          list.push(vk);
          seen.add(`${vk.mediaType}:${vk.id}`);
        }
      }
    }

    if (list.length > 0) {
      return {
        list,
        page: Number(liveData.page || page),
        total_pages: Number(liveData.total_pages || 10),
        total_results: list.length * Number(liveData.total_pages || 1),
        source: 'live',
      };
    }
  }

  return { ...queryVaultDiscover(params), source: 'vault' };
}

export function createApiRouter(): express.Router {
  const router = express.Router();

  router.get('/health', (_req, res) => {
    res.json({
      ok: true,
      name: 'Dexterx Cenima',
      developer: 'Ghost Dexter',
      liveCatalog: true,
      liveTmdb: Boolean(getTmdbApiKey()),
    });
  });

  router.get('/tmdb/hero', async (req, res) => {
    const platform = normalizePlatformQuery(String(req.query.platform || 'netflix'));
    const kidsOnly = req.query.kids === '1' && platform === 'netflix';

    if (platform === 'crunchyroll') {
      const animeHero = await hydrateCuratedList(CURATED_TMDB_IDS['crunchyroll-top-anime'].slice(0, 6));
      const safe = animeHero.filter((item) => isAnimeMedia(item));
      return res.json({
        results: safe.length > 0 ? safe : getHeroVaultItems(false, 'crunchyroll'),
        source: safe.length > 0 ? 'live-crunchyroll' : 'vault-crunchyroll',
      });
    }

    if (platform === 'prime') {
      const primeHero = await hydrateCuratedList(CURATED_TMDB_IDS['prime-top-series'].slice(0, 6));
      const safe = primeHero.filter((item) => isAllowedOnPlatform(item, 'prime', false));
      return res.json({
        results: safe.length > 0 ? safe : getHeroVaultItems(false, 'prime'),
        source: safe.length > 0 ? 'live-prime' : 'vault-prime',
      });
    }

    if (kidsOnly) {
      const kidsSeed = await hydrateCuratedList(CURATED_TMDB_IDS['top-rated-kids-movies'].slice(0, 6));
      const safeKids = kidsSeed.filter((item) => isKidsSafeMedia(item));
      return res.json({
        results: safeKids.length > 0 ? safeKids : getHeroVaultItems(true, 'netflix'),
        source: safeKids.length > 0 ? 'live-kids' : 'vault-kids',
      });
    }

    const nfHero = await hydrateCuratedList(CURATED_TMDB_IDS['netflix-exclusives'].slice(0, 6));
    if (nfHero.length > 0) {
      return res.json({ results: nfHero, source: 'live-netflix' });
    }

    return res.json({ results: getHeroVaultItems(false, 'netflix'), source: 'vault' });
  });

  router.get('/tmdb/home-feed', async (req, res) => {
    const platform = normalizePlatformQuery(String(req.query.platform || 'netflix'));
    const kidsOnly = req.query.kids === '1' && platform === 'netflix';
    const cacheKey = `home-feed:${platform}:${kidsOnly ? 'kids' : 'adult'}`;
    const cached = getCached<{
      hero: MediaSummary[];
      rails: Record<string, MediaSummary[]>;
      allSeed: MediaSummary[];
      source: string;
    }>(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const heroPromise =
      platform === 'crunchyroll'
        ? hydrateCuratedList(CURATED_TMDB_IDS['crunchyroll-top-anime'].slice(0, 6)).then((list) => {
            const safe = list.filter((i) => isAnimeMedia(i));
            return safe.length > 0 ? safe : getHeroVaultItems(false, 'crunchyroll');
          })
        : platform === 'prime'
          ? hydrateCuratedList(CURATED_TMDB_IDS['prime-top-series'].slice(0, 6)).then((list) => {
              const safe = list.filter((i) => isAllowedOnPlatform(i, 'prime', false));
              return safe.length > 0 ? safe : getHeroVaultItems(false, 'prime');
            })
          : kidsOnly
            ? hydrateCuratedList(CURATED_TMDB_IDS['top-rated-kids-movies'].slice(0, 6)).then((list) => {
                const safe = list.filter((i) => isKidsSafeMedia(i));
                return safe.length > 0 ? safe : getHeroVaultItems(true, 'netflix');
              })
            : hydrateCuratedList(CURATED_TMDB_IDS['netflix-exclusives'].slice(0, 6)).then((list) => {
                const safe = list.filter((i) => isAllowedOnPlatform(i, 'netflix', false));
                return safe.length > 0 ? safe : getHeroVaultItems(false, 'netflix');
              });

    const { top, curated } = getPlatformCategories(platform, kidsOnly);
    const cats: CuratedCategoryConfig[] = [...top, ...curated];

    const rails: Record<string, MediaSummary[]> = {};
    const batchSize = 4;
    for (let i = 0; i < cats.length; i += batchSize) {
      const batch = cats.slice(i, i + batchSize);
      const settled = await Promise.allSettled(
        batch.map(async (cat) => {
          const qs = new URLSearchParams({
            media: cat.mediaType,
            curatedSlug: cat.slug,
            platform,
            ...(kidsOnly ? { kids: '1' } : {}),
            ...cat.query,
          });
          const data = await resolveDiscoverPayload(qs);
          return { slug: cat.slug, list: data.list };
        }),
      );
      for (const r of settled) {
        if (r.status === 'fulfilled') {
          rails[r.value.slug] = r.value.list;
        }
      }
    }

    const hero = await heroPromise;
    const seedMap = new Map<string, MediaSummary>();
    for (const item of getAllVaultItems()) {
      if (!isAllowedOnPlatform(item, platform, kidsOnly)) continue;
      seedMap.set(`${item.mediaType}:${item.id}`, item);
    }
    for (const list of Object.values(rails)) {
      for (const item of list) {
        if (!isAllowedOnPlatform(item, platform, kidsOnly)) continue;
        seedMap.set(`${item.mediaType}:${item.id}`, item);
      }
    }

    const payload = {
      hero,
      rails,
      allSeed: Array.from(seedMap.values()),
      source: 'live-batched',
    };
    setCached(cacheKey, payload, 15 * 60 * 1000);
    return res.json(payload);
  });

  router.get('/tmdb/discover', async (req, res) => {
    const params = new URLSearchParams();
    Object.entries(req.query).forEach(([k, v]) => {
      if (typeof v === 'string' && v.trim()) params.set(k, v.trim());
    });
    const payload = await resolveDiscoverPayload(params);
    return res.json(payload);
  });

  router.get('/tmdb/search', async (req, res) => {
    const q = String(req.query.q || '').trim();
    const platform = normalizePlatformQuery(String(req.query.platform || 'netflix'));
    const kidsOnly = req.query.kids === '1' && platform === 'netflix';
    if (!q) {
      return res.json({ results: [], people: [], source: 'live' });
    }

    const filterPlatform = (items: MediaSummary[]) =>
      items.filter((item) => isAllowedOnPlatform(item, platform, kidsOnly));

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
        const results = filterPlatform([...movies, ...tv].sort((a: any, b: any) => b.popularity - a.popularity));
        const people: PersonResult[] =
          kidsOnly || platform === 'crunchyroll'
            ? []
            : (peopleData?.results || []).slice(0, 12).map((p: any) => ({
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
    const matchedDirectory =
      kidsOnly || platform === 'crunchyroll'
        ? []
        : Array.from(peopleDirectory.values())
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

    const vaultMatch = searchVaultCatalog(q, kidsOnly, platform);

    if (bingrSearch && Array.isArray(bingrSearch.results)) {
      const results = filterPlatform(
        bingrSearch.results
          .map((item: any) => mapTmdbItem(item, item.type === 'tv' ? 'tv' : 'movie'))
          .filter((m: MediaSummary | null): m is MediaSummary => Boolean(m && m.poster)),
      );

      return res.json({
        results: results.length > 0 ? results : vaultMatch.results,
        people: hydratedPeople.length > 0 ? hydratedPeople : vaultMatch.people,
        source: results.length > 0 ? 'live' : 'vault',
      });
    }

    return res.json({
      results: vaultMatch.results,
      people: hydratedPeople.length > 0 ? hydratedPeople : vaultMatch.people,
      source: 'vault',
    });
  });

  router.get('/tmdb/detail', async (req, res) => {
    const id = Number(req.query.tmdbId || req.query.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid tmdbId' });
    }
    const mediaType: MediaType = req.query.mediaType === 'tv' || req.query.type === 'tv' ? 'tv' : 'movie';
    const kidsOnly = req.query.kids === '1';

    const sanitizeDetail = (d: MediaDetail): MediaDetail => {
      if (!kidsOnly) return d;
      return {
        ...d,
        recommendations: (d.recommendations || []).filter((r) => isKidsSafeMedia(r)),
      };
    };

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
        return res.json({ detail: sanitizeDetail(detail), source: 'tmdb' });
      }
    }

    const liveDetail = await fetchBingrDetailMapped(mediaType, id);
    if (liveDetail) {
      return res.json({ detail: sanitizeDetail(liveDetail), source: 'live' });
    }

    const vaultDetail = getVaultDetail(id, mediaType);
    if (!vaultDetail) {
      return res.status(404).json({ error: 'Title not found' });
    }
    return res.json({ detail: sanitizeDetail(vaultDetail), source: 'vault' });
  });

  router.get('/tmdb/person/:id', async (req, res) => {
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

  router.get('/player/resolve', async (req, res) => {
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

  router.get('/player/bingr', async (req, res) => {
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

  router.get('/player/media', async (req, res) => {
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

  // ================= DEXTERX SPORTS API (LIVE & UPCOMING + COMMENTARY LANGUAGES) =================
  router.get('/sports/feed', async (_req, res) => {
    const feed = await fetchLiveSportsFeed();
    return res.json({
      football: feed.football,
      cricket: feed.cricket,
      channels: feed.channels,
      languages: feed.languages,
      updatedAt: feed.updatedAt,
      counts: {
        live: [...feed.football, ...feed.cricket].filter((m) => m.matchStatus === 'live').length,
        upcoming: [...feed.football, ...feed.cricket].filter((m) => m.matchStatus === 'upcoming').length,
        football: feed.football.length,
        cricket: feed.cricket.length,
      },
    });
  });

  // ================= LIVE WORLD CHANNEL API (FIFA-WORLD-CUP-2026 REPO) =================
  router.get('/world-channels/feed', async (_req, res) => {
    const feed = await fetchWorldChannelsFeed();
    return res.json({
      channels: feed.channels,
      total: feed.channels.length,
      updatedAt: feed.updatedAt,
    });
  });

  router.get('/world-channels/check', async (req, res) => {
    const rawUrl = String(req.query.url || '');
    const target = isSafePublicHttpUrl(rawUrl);
    if (!target) return res.status(400).json({ ok: false });
    const ok = await probeHlsPlayable(target.href);
    return res.json({ ok });
  });

  router.get('/sports/asset', async (req, res) => {
    const token = String(req.query.t || '');
    if (!token) return res.status(400).send('Missing asset token');
    let decodedUrl = '';
    try {
      decodedUrl = Buffer.from(token, 'base64url').toString('utf8');
    } catch {
      return res.status(400).send('Invalid asset token');
    }
    const target = isSafePublicHttpUrl(decodedUrl);
    if (!target) return res.status(400).send('Unsupported asset URL');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const upstream = await fetch(target.href, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        },
      });
      if (!upstream.ok) return res.status(404).send('Asset unavailable');
      const ct = upstream.headers.get('content-type') || 'image/jpeg';
      if (!ct.toLowerCase().startsWith('image/')) return res.status(400).send('Not an image');
      res.setHeader('Content-Type', ct);
      res.setHeader('Cache-Control', 'public, max-age=3600');
      const buf = Buffer.from(await upstream.arrayBuffer());
      return res.send(buf);
    } catch {
      return res.status(404).send('Asset fetch error');
    } finally {
      clearTimeout(timer);
    }
  });

  router.get('/sports/hls-proxy', async (req, res) => {
    const rawUrl = String(req.query.url || '');
    const target = isSafePublicHttpUrl(rawUrl);
    if (!target) return res.status(400).send('Invalid stream URL');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 14000);
    try {
      const upstream = await fetch(target.href, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          Accept: '*/*',
        },
      });
      if (!upstream.ok) {
        return res.status(upstream.status || 502).send('Stream unavailable');
      }
      const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
      const finalUrl = new URL(upstream.url || target.href);
      const isPlaylist =
        finalUrl.pathname.endsWith('.m3u8') ||
        contentType.toLowerCase().includes('mpegurl') ||
        contentType.toLowerCase().includes('vnd.apple');

      if (isPlaylist) {
        const text = await upstream.text();
        if (!text.trimStart().startsWith('#EXTM3U')) {
          return res.status(502).send('Invalid HLS manifest');
        }
        const rewriteUri = (uri: string) => {
          try {
            const abs = new URL(uri, finalUrl);
            if (!isSafePublicHttpUrl(abs.href)) return uri;
            return `/api/sports/hls-proxy?url=${encodeURIComponent(abs.href)}`;
          } catch {
            return uri;
          }
        };
        const rewritten = text
          .split(/\r?\n/)
          .map((line) => {
            const trimmed = line.trim();
            if (!trimmed) return line;
            if (trimmed.startsWith('#')) {
              return line.replace(/URI="([^"]+)"/g, (_, u: string) => `URI="${rewriteUri(u)}"`);
            }
            return rewriteUri(trimmed);
          })
          .join('\n');
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        res.setHeader('Cache-Control', 'no-store');
        return res.send(rewritten);
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'no-store');
      const buf = Buffer.from(await upstream.arrayBuffer());
      return res.send(buf);
    } catch {
      return res.status(502).send('Live stream relay unavailable');
    } finally {
      clearTimeout(timer);
    }
  });

  return router;
}
