import {
  CheckCircle2,
  Clock,
  Globe2,
  Play,
  Radio,
  RefreshCw,
  Search,
  Tv,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEXTERX_LOGO_URL } from '../components/Navbar';
import WorldChannelPlayer from '../components/WorldChannelPlayer';
import { checkWorldChannelLive, fetchWorldChannelsFeed } from '../lib/api';
import { useAppLocation } from '../lib/router';
import { SPORTS_IMAGES } from '../shared/sportsCatalog';
import type { WorldChannel } from '../shared/types';

type RegionTab =
  | 'All'
  | 'North America'
  | 'UK & Europe'
  | 'Asia & Cricket'
  | 'Latin America'
  | 'Middle East & Africa'
  | 'Global';

const LAST_WATCHED_WC_KEY = 'dexterx_wc_recent_v1';

function countryFlagEmoji(code: string): string {
  if (!code || code.length !== 2) return '';
  if (!/^[A-Z]{2}$/.test(code.toUpperCase())) return '';
  const cc = code.toUpperCase() === 'UK' ? 'GB' : code.toUpperCase();
  return String.fromCodePoint(...cc.split('').map((ch) => 127397 + ch.charCodeAt(0)));
}

export default function LiveWorldChannelPage() {
  const loc = useAppLocation();
  const regionParam = loc.params.get('region') as RegionTab | null;

  const [channels, setChannels] = useState<WorldChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [regionTab, setRegionTab] = useState<RegionTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [workingOnly, setWorkingOnly] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, 'checking' | 'ok' | 'fail'>>({});
  const [checkingProgress, setCheckingProgress] = useState(false);
  const [activeChannel, setActiveChannel] = useState<WorldChannel | null>(null);
  const [recentChannels, setRecentChannels] = useState<WorldChannel[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(LAST_WATCHED_WC_KEY);
      return raw ? (JSON.parse(raw) as WorldChannel[]) : [];
    } catch {
      return [];
    }
  });
  const [visibleLimit, setVisibleLimit] = useState(72);

  useEffect(() => {
    if (regionParam) {
      setRegionTab(regionParam);
    }
  }, [regionParam]);

  const loadChannels = useCallback(async () => {
    setLoading(true);
    try {
      const feed = await fetchWorldChannelsFeed();
      setChannels(feed.channels);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  const handleOpenChannel = (ch: WorldChannel) => {
    setActiveChannel(ch);
    setRecentChannels((prev) => {
      const next = [ch, ...prev.filter((p) => p.id !== ch.id)].slice(0, 8);
      try {
        localStorage.setItem(LAST_WATCHED_WC_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  // Optional user-triggered live probe on currently filtered batch
  const runLiveHealthCheck = async (targetList: WorldChannel[]) => {
    if (checkingProgress || targetList.length === 0) return;
    setCheckingProgress(true);
    const batch = targetList.slice(0, 36);
    let idx = 0;

    const worker = async () => {
      while (idx < batch.length) {
        const ch = batch[idx++];
        if (!ch) break;
        setStatuses((prev) => ({ ...prev, [ch.id]: 'checking' }));
        const ok = await checkWorldChannelLive(ch.url);
        setStatuses((prev) => ({ ...prev, [ch.id]: ok ? 'ok' : 'fail' }));
      }
    };

    await Promise.all([worker(), worker(), worker(), worker()]);
    setCheckingProgress(false);
  };

  const regionTabs: RegionTab[] = [
    'All',
    'North America',
    'UK & Europe',
    'Asia & Cricket',
    'Latin America',
    'Middle East & Africa',
    'Global',
  ];

  const filteredChannels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return channels.filter((ch) => {
      if (regionTab !== 'All' && ch.region !== regionTab) return false;
      if (workingOnly && statuses[ch.id] !== 'ok') return false;
      if (!q) return true;
      return (
        ch.name.toLowerCase().includes(q) ||
        ch.country.toLowerCase().includes(q) ||
        ch.region.toLowerCase().includes(q) ||
        ch.quality.toLowerCase().includes(q)
      );
    });
  }, [channels, regionTab, workingOnly, statuses, searchQuery]);

  const featuredSpotlight = useMemo(() => {
    if (channels.length === 0) return null;
    const priority = channels.find((c) =>
      /fifa|bein|red bull|eurosport|fox sports|espn|cricket|a spor/i.test(c.name),
    );
    return priority || channels[0];
  }, [channels]);

  const featuredRow = useMemo(() => {
    return channels
      .filter((c) => c.logo)
      .slice(0, 14);
  }, [channels]);

  const visibleSlice = useMemo(
    () => filteredChannels.slice(0, visibleLimit),
    [filteredChannels, visibleLimit],
  );

  const okCount = useMemo(
    () => Object.values(statuses).filter((s) => s === 'ok').length,
    [statuses],
  );

  return (
    <div className="min-h-screen w-full bg-[var(--dx-bg)] text-white pb-20">
      {/* ================= CINEMATIC NETFLIX/PRIME-STYLE VIOLET HERO ================= */}
      <section className="relative flex min-h-[60vh] lg:min-h-[64vh] w-full items-end overflow-hidden pt-24 pb-10">
        <div className="absolute inset-0">
          <img
            src={SPORTS_IMAGES.heroStadium}
            alt="Live World Channel Broadcast Hub"
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07060C] via-[#07060C]/75 to-[#07060C]/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07060C] via-[#07060C]/85 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(139,92,246,0.22),transparent_55%)]" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-end px-4 sm:px-6 lg:px-12">
          <div className="flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-[0.2em]">
            <span className="inline-flex items-center gap-1.5 text-[#A78BFA]">
              <Globe2 className="h-3.5 w-3.5" />
              LIVE WORLD CHANNEL
            </span>
            <span className="text-white/30">·</span>
            <span className="font-mono-num text-[#FBBF24]">
              {channels.length} GLOBAL CHANNELS
            </span>
            <span className="text-white/30">·</span>
            <span className="text-white/70">ZERO LOGIN</span>
          </div>

          <h1 className="mt-3 max-w-3xl font-display text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.06]">
            {featuredSpotlight ? featuredSpotlight.name : 'World Sports & Global Broadcast TV'}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
            Stream international football, cricket, motorsport, and global sports networks live in Full HD across North America, UK, Europe, Asia, and Latin America.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm font-mono-num text-violet-200/85">
            <span>Global IPTV Network</span>
            <span className="text-white/30">·</span>
            <span className="text-[#FBBF24] font-semibold">HD &amp; 4K Feeds</span>
            <span className="text-white/30">·</span>
            <span>Instant Stream Relay</span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => featuredSpotlight && handleOpenChannel(featuredSpotlight)}
              disabled={!featuredSpotlight}
              className="inline-flex h-12 items-center gap-2.5 rounded-xl bg-[#8B5CF6] px-7 text-sm font-black text-white shadow-[0_12px_36px_rgba(139,92,246,0.45)] transition-all hover:bg-[#A78BFA] active:scale-[0.98] whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Watch Featured Live</span>
            </button>

            <button
              type="button"
              onClick={() =>
                document.getElementById('world-channels-catalog')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-md transition-colors hover:border-[#8B5CF6] hover:bg-white/15 whitespace-nowrap cursor-pointer"
            >
              <Tv className="h-4 w-4 text-[#FBBF24]" />
              <span>All {channels.length} Channels</span>
            </button>
          </div>
        </div>
      </section>

      <div id="world-channels-catalog" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-12 space-y-9">
        {/* ================= RECENTLY WATCHED HORIZONTAL RAIL ================= */}
        {recentChannels.length > 0 && (
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#A78BFA]" />
              <h2 className="font-display text-lg font-extrabold tracking-tight text-white">
                Recently Watched Channels
              </h2>
            </div>
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
              {recentChannels.map((ch) => (
                <button
                  key={`recent-${ch.id}`}
                  type="button"
                  onClick={() => handleOpenChannel(ch)}
                  className="group flex w-60 shrink-0 items-center gap-3 rounded-xl border border-violet-500/20 bg-[#100D1B] p-3 text-left transition-all hover:border-[#8B5CF6] hover:bg-[#171326] cursor-pointer"
                >
                  <div className="flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#07060C] p-1">
                    {ch.logo ? (
                      <img
                        src={ch.logo}
                        alt={ch.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Tv className="h-5 w-5 text-violet-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-white group-hover:text-violet-300">
                      {ch.name}
                    </p>
                    <p className="mt-0.5 font-mono-num text-[10px] text-white/55">
                      {countryFlagEmoji(ch.country)} {ch.country} · {ch.quality}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ================= FEATURED NETWORKS NETFLIX-STYLE CAROUSEL ================= */}
        {featuredRow.length > 0 && !searchQuery && regionTab === 'All' && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg sm:text-xl font-black tracking-tight text-white">
                Top International Broadcasters
              </h2>
              <span className="font-mono-num text-xs text-violet-300/75">
                Instant Live TV
              </span>
            </div>
            <div className="no-scrollbar flex gap-3.5 overflow-x-auto pb-2">
              {featuredRow.map((ch) => (
                <button
                  key={`feat-${ch.id}`}
                  type="button"
                  onClick={() => handleOpenChannel(ch)}
                  className="nf-card group relative flex w-44 sm:w-52 shrink-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#100D1B] text-left hover:border-[#8B5CF6]/70 cursor-pointer"
                >
                  <div className="relative flex aspect-video w-full items-center justify-center bg-gradient-to-br from-[#1A1430] to-[#080610] p-4">
                    <img
                      src={ch.logo}
                      alt={ch.name}
                      referrerPolicy="no-referrer"
                      className="max-h-14 max-w-[80%] object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                    <span className="absolute left-2 top-2 font-mono-num text-[10px] font-bold text-[#FBBF24]">
                      {ch.quality}
                    </span>
                    <span className="absolute right-2 top-2 font-mono-num text-[10px] font-semibold text-white/70">
                      {ch.country}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="truncate text-xs font-bold text-white group-hover:text-violet-300">
                      {ch.name}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-white/50">{ch.region}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ================= SEARCH, REGION FILTER & LIVE PROBE BAR ================= */}
        <section className="rounded-2xl border border-white/10 bg-[#100D1B] p-3.5 space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleLimit(72);
                }}
                placeholder="Search all channels (ESPN, beIN, Sky, Cricket, US, UK...)"
                className="h-11 w-full rounded-xl border border-white/15 bg-black/45 pl-10 pr-4 text-xs sm:text-sm text-white placeholder:text-white/40 focus:border-[#8B5CF6] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => runLiveHealthCheck(filteredChannels)}
                disabled={checkingProgress || filteredChannels.length === 0}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-violet-400/35 bg-[#8B5CF6]/15 px-3.5 text-xs font-bold text-violet-200 hover:bg-[#8B5CF6]/25 cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${checkingProgress ? 'animate-spin' : ''}`} />
                <span>{checkingProgress ? 'Testing Streams...' : 'Test Live Streams'}</span>
              </button>

              {okCount > 0 && (
                <button
                  type="button"
                  onClick={() => setWorkingOnly((w) => !w)}
                  className={`inline-flex h-10 items-center gap-1.5 rounded-xl border px-3.5 text-xs font-bold cursor-pointer whitespace-nowrap ${
                    workingOnly
                      ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                      : 'border-white/15 bg-white/5 text-white/75 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span className="font-mono-num">{okCount} Verified</span>
                </button>
              )}

              <button
                type="button"
                onClick={loadChannels}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 text-xs font-semibold text-white/80 hover:border-[#8B5CF6] cursor-pointer whitespace-nowrap"
              >
                <Radio className="h-3.5 w-3.5 text-[#FBBF24]" />
                <span>Sync Playlist</span>
              </button>
            </div>
          </div>

          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1">
            {regionTabs.map((tab) => {
              const active = regionTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setRegionTab(tab);
                    setVisibleLimit(72);
                  }}
                  className={`inline-flex min-h-[38px] items-center rounded-xl px-3.5 text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    active
                      ? 'bg-[#8B5CF6] text-white shadow-[0_4px_16px_rgba(139,92,246,0.4)]'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </section>

        {/* ================= ALL CHANNELS GRID ================= */}
        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-black tracking-tight text-white">
                {regionTab === 'All' ? 'All Live World Channels' : `${regionTab} Channels`}
              </h2>
              <p className="text-xs text-white/55">
                Click any channel to launch Full HD Live Broadcast
              </p>
            </div>
            <span className="font-mono-num text-xs text-violet-300">
              Showing {visibleSlice.length} of {filteredChannels.length} channels
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="h-44 animate-pulse rounded-xl border border-white/10 bg-[#100D1B]"
                />
              ))}
            </div>
          ) : filteredChannels.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#100D1B] p-10 text-center">
              <Tv className="mx-auto h-8 w-8 text-violet-400/70" />
              <p className="mt-3 font-display text-base font-bold text-white">
                No Channels Match Filter
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setRegionTab('All');
                  setWorkingOnly(false);
                }}
                className="mt-4 inline-flex h-10 items-center rounded-xl bg-[#8B5CF6] px-5 text-xs font-bold text-white cursor-pointer"
              >
                Show All {channels.length} Channels
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {visibleSlice.map((ch) => {
                  const st = statuses[ch.id];
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => handleOpenChannel(ch)}
                      className="nf-card group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#100D1B] text-left transition-all hover:border-[#8B5CF6]/80 hover:bg-[#171326] cursor-pointer"
                    >
                      <div className="relative flex aspect-video w-full items-center justify-center bg-gradient-to-br from-[#19142B] to-[#080610] p-3">
                        {ch.logo ? (
                          <img
                            src={ch.logo}
                            alt={ch.name}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            className="max-h-12 max-w-[78%] object-contain transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Tv className="h-7 w-7 text-violet-400/60" />
                        )}

                        <span className="absolute right-2 top-2 font-mono-num text-[10px] font-bold text-[#FBBF24]">
                          {ch.quality}
                        </span>

                        {st === 'ok' && (
                          <span
                            className="absolute left-2 top-2 h-2 w-2 rounded-full bg-emerald-400"
                            title="Stream verified"
                          />
                        )}
                        {st === 'fail' && (
                          <span
                            className="absolute left-2 top-2 h-2 w-2 rounded-full bg-red-400/70"
                            title="Unavailable in this region"
                          />
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-3">
                        <p className="line-clamp-2 text-xs font-bold text-white group-hover:text-violet-300">
                          {ch.name}
                        </p>
                        <div className="mt-2 flex items-center justify-between font-mono-num text-[10px] text-white/50">
                          <span>
                            {countryFlagEmoji(ch.country)} {ch.country}
                          </span>
                          <span className="text-violet-300/80 group-hover:text-white">
                            Watch →
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {visibleSlice.length < filteredChannels.length && (
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setVisibleLimit((n) => n + 72)}
                    className="h-11 rounded-xl border border-violet-400/40 bg-[#8B5CF6]/15 px-6 text-xs font-bold text-violet-200 hover:bg-[#8B5CF6]/25 cursor-pointer"
                  >
                    Load More Channels ({filteredChannels.length - visibleSlice.length} remaining)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibleLimit(filteredChannels.length)}
                    className="h-11 rounded-xl bg-[#8B5CF6] px-6 text-xs font-bold text-white hover:bg-[#A78BFA] cursor-pointer"
                  >
                    Show All {filteredChannels.length}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Compact Brand Footer Banner */}
        <section className="rounded-2xl border border-violet-500/20 bg-[#100D1B] p-5">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3.5">
              <img
                src={DEXTERX_LOGO_URL}
                alt="Live World Channel Crest"
                referrerPolicy="no-referrer"
                className="h-12 w-12 shrink-0 rounded-xl border border-[#8B5CF6]/40 object-cover"
              />
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#A78BFA]">
                  Live World Channel · Global Broadcast TV
                </p>
                <h2 className="font-display text-base sm:text-lg font-black text-white">
                  Engineered by Ghost Dexter
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="h-10 rounded-xl bg-[#8B5CF6] px-5 text-xs font-black text-white hover:bg-[#A78BFA] cursor-pointer"
            >
              Back to Top
            </button>
          </div>
        </section>
      </div>

      {/* World Channel Live Theater Player */}
      <WorldChannelPlayer
        channel={activeChannel}
        channels={channels}
        onClose={() => setActiveChannel(null)}
        onSelectChannel={(nextCh) => handleOpenChannel(nextCh)}
      />
    </div>
  );
}
