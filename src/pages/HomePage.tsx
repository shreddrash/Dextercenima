import { ChevronDown, Play, Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import HeroSpotlight from '../components/HeroSpotlight';
import HorizontalRail from '../components/HorizontalRail';
import MediaCard from '../components/MediaCard';
import { DEXTERX_LOGO_URL } from '../components/Navbar';
import PosterArtwork from '../components/PosterArtwork';
import { fetchDiscoverTitles, fetchHomeFeed } from '../lib/api';
import { PLATFORM_THEMES } from '../lib/platform';
import { buildPlayUrl, navigateTo } from '../lib/router';
import { deletePlayRecord, getAllPlayRecords, subscribeVaultUpdates } from '../lib/vaultStorage';
import { getPlatformCategories } from '../shared/curatedCategories';
import type { MediaSummary, PlayRecord, StreamingPlatform, UserProfile } from '../shared/types';
import { isAllowedOnPlatform } from '../shared/vaultCatalog';

interface HomePageProps {
  platform: StreamingPlatform;
  activeProfile: UserProfile;
  onInspect: (item: MediaSummary) => void;
}

export default function HomePage({ platform, activeProfile, onInspect }: HomePageProps) {
  const isKids = platform === 'netflix' && activeProfile.isKids;
  const theme = PLATFORM_THEMES[platform];

  const [heroItems, setHeroItems] = useState<MediaSummary[]>([]);
  const [rails, setRails] = useState<Record<string, MediaSummary[]>>({});
  const [allCatalog, setAllCatalog] = useState<MediaSummary[]>([]);
  const [catalogPage, setCatalogPage] = useState(1);
  const [loadingMoreCatalog, setLoadingMoreCatalog] = useState(false);
  const [history, setHistory] = useState<PlayRecord[]>(() => getAllPlayRecords());

  useEffect(() => {
    setHistory(getAllPlayRecords());
    return subscribeVaultUpdates(() => {
      setHistory(getAllPlayRecords());
    });
  }, [activeProfile.id, platform]);

  useEffect(() => {
    let cancelled = false;
    setCatalogPage(1);

    fetchHomeFeed(isKids, platform)
      .then((feed) => {
        if (!cancelled) {
          setHeroItems(feed.hero);
          setRails(feed.rails);
          setAllCatalog(feed.allSeed);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [isKids, platform]);

  const loadMoreCatalog = async () => {
    if (loadingMoreCatalog) return;
    setLoadingMoreCatalog(true);
    const nextPage = catalogPage + 1;
    try {
      const qs = new URLSearchParams({
        type: platform === 'crunchyroll' ? 'anime' : isKids ? 'kids' : 'all',
        platform,
        page: String(nextPage),
        sort_by: 'popularity.desc',
      });
      const res = await fetchDiscoverTitles(qs, isKids, platform);
      setAllCatalog((prev) => {
        const seen = new Set(prev.map((i) => `${i.mediaType}:${i.id}`));
        const additions = res.list.filter((item) => {
          if (!isAllowedOnPlatform(item, platform, isKids)) return false;
          const key = `${item.mediaType}:${item.id}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        return [...prev, ...additions];
      });
      setCatalogPage(nextPage);
    } finally {
      setLoadingMoreCatalog(false);
    }
  };

  const { top: topCategories, curated: curatedCategories } = getPlatformCategories(
    platform,
    isKids,
  );

  return (
    <div className="w-full bg-[var(--dx-bg)]">
      <HeroSpotlight
        items={heroItems}
        platform={platform}
        isKidsMode={isKids}
        onInspect={onInspect}
      />

      <div className="relative z-20 w-full px-4 sm:px-6 lg:px-12 md:-mt-28">
        {isKids && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-sky-400/30 bg-sky-950/35 px-4 py-2.5 text-xs sm:text-sm text-sky-100">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sky-400 shrink-0" />
              <span>
                <strong>Kids Mode Active</strong> — Showing strictly verified kids movies &amp; cartoons for{' '}
                <strong>{activeProfile.name}</strong>.
              </span>
            </div>
          </div>
        )}

        {platform === 'crunchyroll' && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-[#F47521]/35 bg-[#F47521]/10 px-4 py-2.5 text-xs sm:text-sm text-orange-100">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#F47521]" />
              <span>
                <strong>Crunchyroll Anime Mode</strong> — Streaming strictly verified anime series &amp; anime films only.
              </span>
            </div>
          </div>
        )}

        {/* Continue Watching */}
        {history.length > 0 && (
          <section className="py-4">
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className="font-display text-base sm:text-xl font-bold tracking-tight text-[#e5e5e5]">
                Continue Watching for {activeProfile.name}
              </h2>
              <button
                type="button"
                onClick={() => navigateTo('/my')}
                className="text-xs font-semibold text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
              >
                {platform === 'crunchyroll' ? 'Manage Watchlist' : 'Manage My List'}
              </button>
            </div>

            <div className="no-scrollbar flex gap-2 sm:gap-2.5 overflow-x-auto pb-2">
              {history.slice(0, 12).map((rec) => (
                <div
                  key={rec.key}
                  onClick={() =>
                    navigateTo(
                      buildPlayUrl({
                        tmdbId: rec.tmdbId,
                        mediaType: rec.mediaType,
                        title: rec.title,
                        year: rec.year,
                        poster: rec.poster,
                        score: rec.score,
                        season: rec.season,
                        episode: rec.episode,
                        provider: rec.provider,
                      }),
                    )
                  }
                  className="group relative w-[220px] sm:w-[255px] shrink-0 cursor-pointer overflow-hidden rounded-[4px] bg-[var(--dx-surface)] transition-transform duration-200 hover:scale-[1.04]"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-[#1a1a1a]">
                    <PosterArtwork
                      src={rec.backdrop || rec.poster}
                      alt={rec.title}
                      title={rec.title}
                      variant="backdrop"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-black/65 text-white shadow-xl">
                        <Play className="h-5 w-5 fill-current" />
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${rec.title} from history`}
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePlayRecord(rec.key);
                      }}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/80 text-neutral-300 opacity-0 transition-opacity hover:bg-[var(--dx-accent)] hover:text-white group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="h-[3px] w-full bg-[#4d4d4d]">
                    <div className="h-full w-2/5 bg-[var(--dx-accent)]" />
                  </div>

                  <div className="px-2.5 py-2">
                    <p className="truncate text-xs font-semibold text-white">{rec.title}</p>
                    <p className="mt-0.5 text-[11px] text-[#808080]">
                      {rec.mediaType === 'tv' ? `S${rec.season}:E${rec.episode}` : 'Resume Title'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Top 10 Ranked Rows */}
        {topCategories.map((cat) => (
          <HorizontalRail
            key={cat.slug}
            title={cat.title}
            items={(rails[cat.slug] || []).slice(0, 10)}
            ranked
            platform={platform}
            viewAllHref={`/curated/${cat.slug}`}
            onSelect={onInspect}
          />
        ))}

        {/* Curated Platform Rows */}
        {curatedCategories.map((cat) => (
          <HorizontalRail
            key={cat.slug}
            title={cat.title}
            items={rails[cat.slug] || []}
            platform={platform}
            viewAllHref={`/curated/${cat.slug}`}
            onSelect={onInspect}
          />
        ))}

        {/* Complete Full Catalog Grid */}
        {allCatalog.length > 0 && (
          <section className="mt-8 border-t border-white/10 pt-8">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {platform === 'crunchyroll'
                    ? 'All Anime Series & Movies'
                    : platform === 'prime'
                      ? 'All Titles Included with Prime'
                      : isKids
                        ? 'All Kids Movies & Cartoons'
                        : 'All Movies & Shows on Netflix'}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#b3b3b3]">
                  {theme.tagline}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigateTo(isKids ? '/discover?type=kids' : '/discover?type=all')}
                className="rounded-[4px] border border-white/30 px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-[var(--dx-accent)] hover:bg-white/10 cursor-pointer whitespace-nowrap"
              >
                Open Full Filter Catalog
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
              {allCatalog
                .filter((item) => isAllowedOnPlatform(item, platform, isKids))
                .map((item) => (
                  <MediaCard
                    key={`all-${item.mediaType}-${item.id}`}
                    item={item}
                    variant="poster"
                    platform={platform}
                    onSelect={onInspect}
                  />
                ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                disabled={loadingMoreCatalog}
                onClick={loadMoreCatalog}
                className="inline-flex h-10 items-center gap-2 rounded-[4px] border border-white/40 bg-[var(--dx-surface)] px-7 text-sm font-semibold text-white transition-colors hover:border-[var(--dx-accent)] hover:bg-[var(--dx-surface-elevated)] disabled:opacity-50 cursor-pointer"
              >
                <span>
                  {loadingMoreCatalog
                    ? 'Loading more titles...'
                    : platform === 'crunchyroll'
                      ? 'Load More Anime'
                      : 'Load More Titles'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        {/* Ghost Dexter Brand Strip */}
        <section className="mt-12 rounded-md border border-white/10 bg-[var(--dx-surface)] p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <img
                src={DEXTERX_LOGO_URL}
                alt="Dexterx Cenima Emblem"
                referrerPolicy="no-referrer"
                className="h-16 w-16 shrink-0 rounded-md border border-white/15 object-cover"
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--dx-accent)]">
                  Dexterx {theme.name}
                </p>
                <h2 className="mt-0.5 font-display text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  Engineered by Ghost Dexter
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#b3b3b3]">
                  {theme.tagline} — switch universes anytime from the top bar.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigateTo(isKids ? '/discover?type=kids' : '/discover?type=all')}
                className="h-10 rounded-[4px] bg-[var(--dx-accent)] px-5 text-sm font-bold text-white transition-colors hover:bg-[var(--dx-accent-hover)] whitespace-nowrap cursor-pointer"
              >
                {platform === 'crunchyroll'
                  ? 'Browse All Anime'
                  : isKids
                    ? 'Browse All Kids'
                    : 'Browse All Titles'}
              </button>
              <button
                type="button"
                onClick={() => navigateTo('/my')}
                className="h-10 rounded-[4px] border border-white/35 bg-[var(--dx-surface-elevated)] px-5 text-sm font-semibold text-white transition-colors hover:border-white whitespace-nowrap cursor-pointer"
              >
                {platform === 'crunchyroll' ? 'Watchlist' : platform === 'prime' ? 'My Stuff' : 'My List'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
