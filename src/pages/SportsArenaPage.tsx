import { Clock, Globe, Play, Radio, RefreshCw, Search, Tv } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ClubLogo from '../components/ClubLogo';
import { DEXTERX_LOGO_URL } from '../components/Navbar';
import SportsArtwork from '../components/SportsArtwork';
import SportsBroadcastPlayer from '../components/SportsBroadcastPlayer';
import { fetchSportsFeed } from '../lib/api';
import { useAppLocation } from '../lib/router';
import { SPORTS_IMAGES } from '../shared/sportsCatalog';
import type { SportMatch } from '../shared/types';

type SportCategoryTab = 'all' | 'live' | 'football' | 'cricket';
type CommentaryFilter = 'All' | 'English' | 'Hindi';

function formatKickoff(iso?: string, fallback?: string): string {
  if (!iso) return fallback || 'Upcoming';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return fallback || 'Upcoming';
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (isToday) return `Today · ${timeStr}`;
  const dayStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  return `${dayStr} · ${timeStr}`;
}

export default function SportsArenaPage() {
  const loc = useAppLocation();
  const catParam = loc.params.get('cat') as SportCategoryTab | null;

  const [categoryTab, setCategoryTab] = useState<SportCategoryTab>(() =>
    catParam && ['all', 'live', 'football', 'cricket'].includes(catParam) ? catParam : 'all',
  );
  const [commentaryLang, setCommentaryLang] = useState<CommentaryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [footballMatches, setFootballMatches] = useState<SportMatch[]>([]);
  const [cricketMatches, setCricketMatches] = useState<SportMatch[]>([]);
  const [liveChannels, setLiveChannels] = useState<SportMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIdx, setHeroIdx] = useState(0);
  const [activeMatch, setActiveMatch] = useState<SportMatch | null>(null);

  useEffect(() => {
    if (catParam && ['all', 'live', 'football', 'cricket'].includes(catParam)) {
      setCategoryTab(catParam);
    }
  }, [catParam]);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    try {
      const feed = await fetchSportsFeed();
      setFootballMatches(feed.football);
      setCricketMatches(feed.cricket);
      setLiveChannels(feed.channels);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const allMatches = useMemo(
    () => [...footballMatches, ...cricketMatches],
    [footballMatches, cricketMatches],
  );

  const heroPool = useMemo(() => {
    if (liveChannels.length > 0) return liveChannels.slice(0, 6);
    return allMatches.slice(0, 5);
  }, [liveChannels, allMatches]);

  useEffect(() => {
    if (heroPool.length <= 1 || activeMatch) return;
    const t = window.setInterval(() => {
      setHeroIdx((i) => (i + 1) % heroPool.length);
    }, 6500);
    return () => window.clearInterval(t);
  }, [heroPool.length, activeMatch]);

  const featuredHero = heroPool[heroIdx % Math.max(1, heroPool.length)] || null;
  const qLower = searchQuery.trim().toLowerCase();

  const matchesFilter = useCallback(
    (m: SportMatch) => {
      if (categoryTab === 'live' && m.matchStatus !== 'live') return false;
      if (commentaryLang !== 'All') {
        const hasLang =
          (m.languages || []).includes(commentaryLang) ||
          m.streams.some((s) => s.language === commentaryLang);
        if (!hasLang) return false;
      }
      if (!qLower) return true;
      return (
        m.title.toLowerCase().includes(qLower) ||
        m.tournament.toLowerCase().includes(qLower) ||
        m.team1.toLowerCase().includes(qLower) ||
        m.team2.toLowerCase().includes(qLower) ||
        (m.venue || '').toLowerCase().includes(qLower)
      );
    },
    [categoryTab, commentaryLang, qLower],
  );

  const visibleChannels = useMemo(
    () =>
      liveChannels.filter((c) => {
        if (categoryTab === 'football' && c.sport !== 'football') return false;
        if (categoryTab === 'cricket' && c.sport !== 'cricket') return false;
        return matchesFilter(c);
      }),
    [liveChannels, categoryTab, matchesFilter],
  );

  const visibleFootball = useMemo(() => {
    if (categoryTab === 'cricket') return [];
    return footballMatches.filter(matchesFilter);
  }, [footballMatches, categoryTab, matchesFilter]);

  const visibleCricket = useMemo(() => {
    if (categoryTab === 'football') return [];
    return cricketMatches.filter(matchesFilter);
  }, [cricketMatches, categoryTab, matchesFilter]);

  const liveCount = useMemo(
    () => allMatches.filter((m) => m.matchStatus === 'live').length,
    [allMatches],
  );

  const counts = useMemo(
    () => ({
      all: allMatches.length,
      live: liveCount,
      upcoming: Math.max(0, allMatches.length - liveCount),
      football: footballMatches.length,
      cricket: cricketMatches.length,
    }),
    [allMatches.length, liveCount, footballMatches.length, cricketMatches.length],
  );

  const tabs: Array<{ id: SportCategoryTab; label: string; count: number }> = [
    { id: 'all', label: 'All Sports', count: counts.all },
    { id: 'live', label: 'Live Now', count: counts.live },
    { id: 'football', label: 'Football', count: counts.football },
    { id: 'cricket', label: 'Cricket', count: counts.cricket },
  ];

  const getCommentaryDisplay = (match: SportMatch): string => {
    const langs = (match.languages || []).filter((l) => l === 'English' || l === 'Hindi');
    if (commentaryLang !== 'All' && langs.includes(commentaryLang)) {
      return `Live · ${commentaryLang}`;
    }
    if (langs.length >= 2) return 'Live · English & Hindi';
    if (langs.length === 1) return `Live · ${langs[0]}`;
    return 'Live · English & Hindi';
  };

  const renderMatchCard = (match: SportMatch) => {
    const isLive = match.matchStatus === 'live';
    const isCricket = match.sport === 'cricket';

    return (
      <article
        key={match.id}
        onClick={() => setActiveMatch(match)}
        className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0A110E] p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#10B981]/65 hover:bg-[#0F1915] cursor-pointer"
      >
        <div>
          {/* Top Bar: Game Category + Tournament + Clock */}
          <div className="flex items-center justify-between gap-2 text-xs font-mono-num">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                  isCricket
                    ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                    : 'bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30'
                }`}
              >
                {isCricket ? 'Cricket' : 'Football'}
              </span>
              <span className="truncate font-semibold text-white/80">{match.tournament}</span>
            </div>

            {isLive ? (
              <span className="inline-flex shrink-0 items-center gap-1.5 font-extrabold text-red-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                LIVE
              </span>
            ) : (
              <span className="inline-flex shrink-0 items-center gap-1 font-bold text-amber-300">
                <Clock className="h-3.5 w-3.5" />
                {formatKickoff(match.kickoffTime, match.statusDetail)}
              </span>
            )}
          </div>

          {/* Club Logos & Live Scores */}
          <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="flex flex-col items-center text-center min-w-0">
              <ClubLogo
                src={match.team1Badge}
                name={match.team1}
                color={match.team1Color}
                size="md"
              />
              <p className="mt-2.5 w-full truncate font-display text-xs sm:text-sm font-bold text-white">
                {match.team1}
              </p>
              {match.team1Score && (
                <p className="mt-0.5 font-mono-num text-sm font-black text-emerald-300">
                  {match.team1Score}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center justify-center">
              <span className="font-display text-xs font-black tracking-widest text-white/30">
                VS
              </span>
            </div>

            <div className="flex flex-col items-center text-center min-w-0">
              <ClubLogo
                src={match.team2Badge}
                name={match.team2}
                color={match.team2Color}
                size="md"
              />
              <p className="mt-2.5 w-full truncate font-display text-xs sm:text-sm font-bold text-white/90">
                {match.team2}
              </p>
              {match.team2Score && (
                <p className="mt-0.5 font-mono-num text-sm font-black text-emerald-300">
                  {match.team2Score}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer: Hindi & English Commentary Label + Direct Watch Live Button (NEVER Scoreboard) */}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-3.5">
          <span className="inline-flex items-center gap-1.5 truncate text-[11px] font-bold text-amber-300/95">
            <Globe className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{getCommentaryDisplay(match)}</span>
          </span>

          <span className="inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-xl bg-[#10B981] px-3.5 text-xs font-black text-[#04140E] transition-colors group-hover:bg-[#34D399]">
            <Play className="h-3 w-3 fill-current" />
            <span>Watch Live</span>
          </span>
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#050807] text-white pb-16">
      {/* ================= FLAGSHIP STADIUM SPOTLIGHT HERO ================= */}
      <section className="relative flex min-h-[54vh] w-full items-end overflow-hidden pt-24 pb-10">
        <div className="absolute inset-0">
          <SportsArtwork
            src={featuredHero?.banner || SPORTS_IMAGES.heroStadium}
            alt="Dexterx Sports Live Stadium"
            sport={featuredHero?.sport || 'football'}
            className="h-full w-full object-cover opacity-45 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050807] via-[#050807]/75 to-black/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050807] via-[#050807]/88 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-stretch gap-6 px-4 sm:px-6 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-end">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-extrabold uppercase tracking-[0.18em]">
              <span className="text-[#10B981]">LIVE FOOTBALL &amp; CRICKET</span>
              <span className="text-white/30" aria-hidden="true">
                ·
              </span>
              <span className="text-amber-300">ENGLISH &amp; HINDI COMMENTARY</span>
              <span className="text-white/30" aria-hidden="true">
                ·
              </span>
              <span className="font-mono-num text-white/80">
                {counts.live} LIVE · {counts.upcoming} UPCOMING
              </span>
            </div>

            {featuredHero && (
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center -space-x-2.5 shrink-0">
                  <ClubLogo
                    src={featuredHero.team1Badge}
                    name={featuredHero.team1}
                    color={featuredHero.team1Color}
                    size="md"
                  />
                  <ClubLogo
                    src={featuredHero.team2Badge}
                    name={featuredHero.team2}
                    color={featuredHero.team2Color}
                    size="md"
                  />
                </div>
                <h1 className="max-w-3xl text-balance font-display text-2xl font-black tracking-tight text-white sm:text-5xl leading-[1.06]">
                  {featuredHero.title}
                </h1>
              </div>
            )}

            {featuredHero && (
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm font-mono-num text-emerald-100/90">
                <span
                  className={`font-bold ${
                    featuredHero.sport === 'cricket' ? 'text-amber-300' : 'text-[#10B981]'
                  }`}
                >
                  {featuredHero.sport === 'cricket' ? 'Cricket' : 'Football'}
                </span>
                <span className="text-white/30" aria-hidden="true">
                  ·
                </span>
                <span>{featuredHero.tournament}</span>
                <span className="text-white/30" aria-hidden="true">
                  ·
                </span>
                <span className="font-bold text-amber-300">
                  {getCommentaryDisplay(featuredHero)}
                </span>
                {featuredHero.scoreline && (
                  <>
                    <span className="text-white/30" aria-hidden="true">
                      ·
                    </span>
                    <span className="font-bold text-emerald-300">{featuredHero.scoreline}</span>
                  </>
                )}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => featuredHero && setActiveMatch(featuredHero)}
                disabled={!featuredHero}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#10B981] px-7 text-sm font-black text-[#04140E] shadow-[0_12px_36px_rgba(16,185,129,0.4)] transition-all hover:bg-[#34D399] whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Watch Live Now</span>
              </button>

              <button
                type="button"
                onClick={() => setCommentaryLang('English')}
                className={`inline-flex h-12 items-center gap-2 rounded-xl border px-5 text-sm font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  commentaryLang === 'English'
                    ? 'border-amber-400 bg-amber-400 text-[#04140E]'
                    : 'border-white/20 bg-white/10 text-white hover:border-amber-400'
                }`}
              >
                <Globe className="h-4 w-4" />
                <span>English Live</span>
              </button>

              <button
                type="button"
                onClick={() => setCommentaryLang('Hindi')}
                className={`inline-flex h-12 items-center gap-2 rounded-xl border px-5 text-sm font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  commentaryLang === 'Hindi'
                    ? 'border-amber-400 bg-amber-400 text-[#04140E]'
                    : 'border-white/20 bg-white/10 text-white hover:border-amber-400'
                }`}
              >
                <Globe className="h-4 w-4" />
                <span>Hindi Live</span>
              </button>
            </div>
          </div>

          {/* Right Instant Live Hindi & English Broadcast Dock */}
          <div className="lg:col-span-5 xl:col-span-4 flex">
            <div className="flex w-full flex-col justify-between rounded-2xl border border-emerald-500/20 bg-[#08100D]/92 p-4 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <Tv className="h-4 w-4 text-[#10B981]" />
                  <span className="font-display text-xs font-extrabold uppercase tracking-wider text-white">
                    Live Hindi &amp; English Feeds
                  </span>
                </div>
                <button
                  type="button"
                  onClick={loadFeed}
                  aria-label="Refresh matches"
                  className="inline-flex min-h-[36px] items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-white cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="mt-3 space-y-2">
                {heroPool.slice(0, 4).map((m, idx) => (
                  <button
                    key={`tick-${m.id}`}
                    type="button"
                    onClick={() => setActiveMatch(m)}
                    onMouseEnter={() => setHeroIdx(idx)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                      featuredHero?.id === m.id
                        ? 'border-[#10B981]/75 bg-[#10B981]/12'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ClubLogo
                        src={m.team1Badge}
                        name={m.team1}
                        color={m.team1Color}
                        size="xs"
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold font-mono-num text-emerald-300 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                          <span>{m.sport === 'cricket' ? 'Cricket' : 'Football'}</span>
                          <span className="text-white/30">·</span>
                          <span className="text-amber-300">
                            {(m.languages || ['English', 'Hindi']).join(' & ')}
                          </span>
                        </p>
                        <p className="mt-0.5 truncate text-xs font-bold text-white">{m.title}</p>
                      </div>
                    </div>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#10B981]/20 text-[#10B981]">
                      <Play className="h-3.5 w-3.5 fill-current" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORY + COMMENTARY (ENGLISH & HINDI) + SEARCH BAR ================= */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 space-y-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0A110E] p-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Game Category Tabs */}
          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {tabs.map((t) => {
              const active = categoryTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setCategoryTab(t.id)}
                  className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    active
                      ? 'bg-[#10B981] text-[#04140E] shadow-[0_4px_16px_rgba(16,185,129,0.35)]'
                      : 'bg-white/5 text-white/75 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{t.label}</span>
                  <span
                    className={`font-mono-num text-xs ${
                      active ? 'text-[#04140E]/80' : 'text-emerald-400/80'
                    }`}
                  >
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            {/* Strictly English & Hindi Commentary Switcher */}
            <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 p-1">
              <span className="hidden sm:inline-flex items-center gap-1 px-2 text-[11px] font-bold uppercase tracking-wider text-white/55">
                <Globe className="h-3.5 w-3.5 text-amber-300" />
                <span>Audio</span>
              </span>
              {(['All', 'English', 'Hindi'] as const).map((lang) => {
                const active = commentaryLang === lang;
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setCommentaryLang(lang)}
                    className={`min-h-[38px] rounded-lg px-3.5 text-xs font-extrabold whitespace-nowrap transition-colors cursor-pointer ${
                      active
                        ? 'bg-amber-400 text-[#050807]'
                        : 'text-white/75 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {lang === 'All' ? 'EN & HI' : lang}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400/75" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search team or league..."
                className="h-11 w-full rounded-xl border border-white/15 bg-black/40 pl-10 pr-4 text-xs sm:text-sm text-white placeholder:text-white/40 focus:border-[#10B981] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* ================= LIVE HINDI & ENGLISH CHANNELS DECK ================= */}
        {visibleChannels.length > 0 && (
          <section className="pt-2">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
                  <Tv className="h-3.5 w-3.5" />
                  <span>24/7 Live Broadcasts</span>
                </p>
                <h2 className="mt-0.5 font-display text-lg sm:text-xl font-black tracking-tight text-white">
                  Live English &amp; Hindi Commentary Channels
                </h2>
              </div>
              <span className="font-mono-num text-xs text-white/55">
                {visibleChannels.length} channels
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visibleChannels.map((ch) => (
                <button
                  key={`desk-${ch.id}`}
                  type="button"
                  onClick={() => setActiveMatch(ch)}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0A110E] p-3.5 text-left transition-all hover:border-[#10B981]/70 hover:bg-[#101C18] cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-black border border-white/10">
                      <SportsArtwork src={ch.banner} alt={ch.title} sport={ch.sport} />
                      <span className="absolute left-1 top-1 flex items-center gap-1 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-red-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                        LIVE
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                        <span
                          className={
                            ch.sport === 'cricket' ? 'text-amber-300' : 'text-[#34D399]'
                          }
                        >
                          {ch.sport === 'cricket' ? 'Cricket' : 'Football'}
                        </span>
                        <span className="text-white/25">·</span>
                        <span className="text-amber-300">
                          {(ch.languages || ['English', 'Hindi']).join(' & ')}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate font-display text-sm font-extrabold text-white group-hover:text-[#34D399]">
                        {ch.title}
                      </p>
                      <p className="truncate text-[11px] text-white/55">{ch.tournament}</p>
                    </div>
                  </div>
                  <span className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-[#10B981] px-3 text-xs font-black text-[#04140E] group-hover:bg-[#34D399]">
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span className="hidden sm:inline">Watch Live</span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ================= FOOTBALL CATEGORY (LIVE & UPCOMING — DIRECT WATCH LIVE) ================= */}
        {visibleFootball.length > 0 && (
          <section className="pt-4">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#10B981] flex items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5" />
                  <span>Football Category · English &amp; Hindi</span>
                </p>
                <h2 className="mt-0.5 font-display text-xl sm:text-2xl font-black tracking-tight text-white">
                  Live &amp; Upcoming Football
                </h2>
              </div>
              <span className="font-mono-num text-xs text-white/55">
                {visibleFootball.length} matches
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleFootball.map(renderMatchCard)}
            </div>
          </section>
        )}

        {/* ================= CRICKET CATEGORY (LIVE & UPCOMING — DIRECT WATCH LIVE) ================= */}
        {visibleCricket.length > 0 && (
          <section className="pt-6">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5" />
                  <span>Cricket Category · English &amp; Hindi</span>
                </p>
                <h2 className="mt-0.5 font-display text-xl sm:text-2xl font-black tracking-tight text-white">
                  Live &amp; Upcoming Cricket
                </h2>
              </div>
              <span className="font-mono-num text-xs text-white/55">
                {visibleCricket.length} matches
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleCricket.map(renderMatchCard)}
            </div>
          </section>
        )}

        {!loading && visibleFootball.length === 0 && visibleCricket.length === 0 && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#0A110E] p-10 text-center">
            <p className="font-display text-base font-bold text-white">
              No Matches Found for Selected Filter
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCategoryTab('all');
                setCommentaryLang('All');
              }}
              className="mt-4 h-11 rounded-xl bg-[#10B981] px-5 text-xs font-black text-[#04140E] cursor-pointer"
            >
              Show All Matches
            </button>
          </div>
        )}

        {/* Brand Footer Strip */}
        <section className="mt-12 rounded-2xl border border-white/10 bg-[#0A110E] p-5">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3.5">
              <img
                src={DEXTERX_LOGO_URL}
                alt="Dexterx Sports"
                referrerPolicy="no-referrer"
                className="h-12 w-12 shrink-0 rounded-xl border border-[#10B981]/35 object-cover"
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#10B981]">
                  Dexterx Sports · English &amp; Hindi Live
                </p>
                <h2 className="font-display text-base sm:text-lg font-black text-white">
                  Engineered by Ghost Dexter
                </h2>
              </div>
            </div>
            <p className="text-xs text-white/55">
              Direct Live Football &amp; Cricket · English &amp; Hindi Commentary · Zero Login
            </p>
          </div>
        </section>
      </div>

      {/* Direct Live Video Broadcast Player */}
      <SportsBroadcastPlayer
        match={activeMatch}
        playlist={allMatches}
        preferredLanguage={commentaryLang}
        onClose={() => setActiveMatch(null)}
        onSelectMatch={(m) => setActiveMatch(m)}
      />
    </div>
  );
}
