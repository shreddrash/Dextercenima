import {
  CRICKET_ENGLISH_STREAMS,
  CRICKET_HINDI_STREAMS,
  FOOTBALL_ENGLISH_STREAMS,
  FOOTBALL_HINDI_STREAMS,
  SPORTS_IMAGES,
} from './sportsCatalog';
import type { SportMatch, SportStreamSource } from './types';

export function cleanSportText(input: unknown): string {
  return String(input || '')
    .replace(/fan\s*code/gi, 'Dexterx Sports')
    .replace(/\bfc[-\s]?web\b/gi, '')
    .trim();
}

export function teamTokensMatch(a: string, b: string): boolean {
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

export function parseHexTeamColor(raw?: unknown): string | undefined {
  if (typeof raw !== 'string') return undefined;
  const cleaned = raw.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{6}$/.test(cleaned) && cleaned.toLowerCase() !== 'ffffff' && cleaned.toLowerCase() !== '000000') {
    return `#${cleaned}`;
  }
  return undefined;
}

export function buildDualLanguageStreams(
  sport: 'football' | 'cricket',
  primaryStreams: SportStreamSource[],
  liveCricketEn: SportStreamSource[] = CRICKET_ENGLISH_STREAMS,
  liveCricketHi: SportStreamSource[] = CRICKET_HINDI_STREAMS,
  liveFootballEn: SportStreamSource[] = FOOTBALL_ENGLISH_STREAMS,
  liveFootballHi: SportStreamSource[] = FOOTBALL_HINDI_STREAMS,
): SportStreamSource[] {
  const enPool = sport === 'cricket' ? liveCricketEn : liveFootballEn;
  const hiPool = sport === 'cricket' ? liveCricketHi : liveFootballHi;
  const combined = [
    ...primaryStreams,
    ...enPool.slice(0, 1),
    ...hiPool.slice(0, 1),
    ...enPool.slice(1),
    ...hiPool.slice(1),
  ];
  const seenUrl = new Set<string>();
  const deduped: SportStreamSource[] = [];
  for (const s of combined) {
    if (!s.url || seenUrl.has(s.url)) continue;
    seenUrl.add(s.url);
    deduped.push(s);
  }
  return deduped;
}

export function parseEspnHeaderEvents(
  payload: any,
  sport: 'football' | 'cricket',
  upstreamLiveMatches: SportMatch[],
  livePools: {
    cricketEn: SportStreamSource[];
    cricketHi: SportStreamSource[];
    footballEn: SportStreamSource[];
    footballHi: SportStreamSource[];
  },
  wrapBadgeUrl: (rawUrl?: string | null) => string = (u) => (typeof u === 'string' ? u.trim() : ''),
): SportMatch[] {
  const leagues: any[] = payload?.sports?.[0]?.leagues || [];
  const results: SportMatch[] = [];
  const seenIds = new Set<string>();

  for (const league of leagues) {
    const tournament = cleanSportText(league?.name || (sport === 'football' ? 'Football' : 'Cricket'));
    const events: any[] = Array.isArray(league?.events) ? league.events : [];
    for (const ev of events) {
      const state = String(ev?.fullStatus?.type?.state || ev?.status || '').toLowerCase();
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
        team1Badge: wrapBadgeUrl(homeLogoRaw) || undefined,
        team2Badge: wrapBadgeUrl(awayLogoRaw) || undefined,
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

  results.sort((a, b) => {
    if (a.matchStatus !== b.matchStatus) return a.matchStatus === 'live' ? -1 : 1;
    const aHasLogos = a.team1Badge && a.team2Badge ? 1 : 0;
    const bHasLogos = b.team1Badge && b.team2Badge ? 1 : 0;
    if (aHasLogos !== bHasLogos && a.matchStatus === 'live') return bHasLogos - aHasLogos;
    return (a.kickoffTime || '').localeCompare(b.kickoffTime || '');
  });
  return results;
}
