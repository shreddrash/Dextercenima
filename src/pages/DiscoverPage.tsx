import { RotateCcw, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import MediaCard from '../components/MediaCard';
import { fetchDiscoverTitles } from '../lib/api';
import { navigateTo, useAppLocation } from '../lib/router';
import type {
  DiscoverCategoryFilter,
  MediaSummary,
  StreamingPlatform,
  UserProfile,
} from '../shared/types';
import { isAllowedOnPlatform } from '../shared/vaultCatalog';

interface DiscoverPageProps {
  platform: StreamingPlatform;
  activeProfile: UserProfile;
  onInspect: (item: MediaSummary) => void;
}

const ADULT_GENRES = [
  { id: 28, name: 'Action' },
  { id: 878, name: 'Sci-Fi' },
  { id: 18, name: 'Drama' },
  { id: 53, name: 'Thriller' },
  { id: 80, name: 'Crime' },
  { id: 16, name: 'Animation' },
  { id: 27, name: 'Horror' },
  { id: 35, name: 'Comedy' },
  { id: 10749, name: 'Romance' },
  { id: 12, name: 'Adventure' },
  { id: 9648, name: 'Mystery' },
  { id: 10751, name: 'Family' },
];

const ANIME_GENRES = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 10765, name: 'Fantasy & Sci-Fi' },
  { id: 18, name: 'Drama' },
  { id: 35, name: 'Comedy' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
];

const KIDS_GENRES = [
  { id: 16, name: 'Animation' },
  { id: 10751, name: 'Family' },
  { id: 12, name: 'Adventure' },
  { id: 35, name: 'Comedy' },
  { id: 14, name: 'Fantasy' },
  { id: 10402, name: 'Music' },
];

export default function DiscoverPage({
  platform,
  activeProfile,
  onInspect,
}: DiscoverPageProps) {
  const isKidsProfile = platform === 'netflix' && activeProfile.isKids;
  const isCrunchy = platform === 'crunchyroll';
  const isPrime = platform === 'prime';

  const loc = useAppLocation();
  const rawType =
    (loc.params.get('type') as DiscoverCategoryFilter) || (isKidsProfile ? 'kids' : 'all');
  const rawMedia = loc.params.get('media') || 'all';

  const [category, setCategory] = useState<DiscoverCategoryFilter>(
    isKidsProfile ? 'kids' : rawType,
  );
  const [kidsMediaSubFilter, setKidsMediaSubFilter] = useState<'all' | 'movie' | 'tv'>(
    rawMedia === 'tv' ? 'tv' : rawMedia === 'movie' ? 'movie' : 'all',
  );
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [language, setLanguage] = useState<string>(
    isCrunchy ? 'ja' : rawType === 'hindi' && !isKidsProfile ? 'hi' : 'all',
  );
  const [minRating, setMinRating] = useState<string>('0');
  const [yearFrom, setYearFrom] = useState<string>('1990');
  const [sortBy, setSortBy] = useState<string>('popularity.desc');
  const [items, setItems] = useState<MediaSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t =
      (loc.params.get('type') as DiscoverCategoryFilter) || (isKidsProfile ? 'kids' : 'all');
    const m = loc.params.get('media') || 'all';
    setCategory(isKidsProfile ? 'kids' : t);
    setKidsMediaSubFilter(m === 'tv' ? 'tv' : m === 'movie' ? 'movie' : 'all');
    setLanguage(isCrunchy ? 'ja' : t === 'hindi' && !isKidsProfile ? 'hi' : 'all');
    setPage(1);
  }, [loc.search, isKidsProfile, isCrunchy, platform]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const effectiveType = isKidsProfile ? 'kids' : category;
    const media = isCrunchy
      ? effectiveType === 'movie'
        ? 'movie'
        : 'tv'
      : effectiveType === 'tv' ||
          effectiveType === 'anime' ||
          effectiveType === 'show' ||
          (effectiveType === 'kids' && kidsMediaSubFilter === 'tv')
        ? 'tv'
        : effectiveType === 'kids' && kidsMediaSubFilter === 'all'
          ? 'all'
          : 'movie';

    const buildParams = (p: number) => {
      const apiType = isCrunchy
        ? effectiveType === 'movie'
          ? 'movie'
          : 'anime'
        : effectiveType === 'kids' && kidsMediaSubFilter === 'all'
          ? 'all'
          : effectiveType;
      const qs = new URLSearchParams({
        type: apiType,
        media: media === 'all' ? 'movie' : media,
        platform,
        sort_by: sortBy,
        page: String(p),
        yearMin: yearFrom,
        ratingMin: minRating,
      });
      if (isKidsProfile || effectiveType === 'kids') {
        qs.set('kids', '1');
      }
      if (language !== 'all' && !isCrunchy) {
        qs.set('language', language);
      }
      if (selectedGenres.length > 0) {
        qs.set('genres', selectedGenres.join(','));
      }
      return qs;
    };

    const load = async () => {
      try {
        if (page === 1) {
          const [p1, p2] = await Promise.all([
            fetchDiscoverTitles(buildParams(1), isKidsProfile || effectiveType === 'kids', platform),
            fetchDiscoverTitles(buildParams(2), isKidsProfile || effectiveType === 'kids', platform),
          ]);
          if (cancelled) return;
          const seen = new Set<string>();
          const merged = [...p1.list, ...p2.list].filter((item) => {
            if (!isAllowedOnPlatform(item, platform, isKidsProfile || effectiveType === 'kids')) {
              return false;
            }
            const k = `${item.mediaType}:${item.id}`;
            if (seen.has(k)) return false;
            seen.add(k);
            return true;
          });
          setItems(merged);
          setTotalPages(Math.max(p1.total_pages, p2.total_pages));
        } else {
          const data = await fetchDiscoverTitles(
            buildParams(page),
            isKidsProfile || effectiveType === 'kids',
            platform,
          );
          if (cancelled) return;
          setItems((prev) => {
            const seen = new Set(prev.map((i) => `${i.mediaType}:${i.id}`));
            const fresh = data.list.filter((item) => {
              if (!isAllowedOnPlatform(item, platform, isKidsProfile || effectiveType === 'kids')) {
                return false;
              }
              const k = `${item.mediaType}:${item.id}`;
              if (seen.has(k)) return false;
              seen.add(k);
              return true;
            });
            return [...prev, ...fresh];
          });
          setTotalPages(data.total_pages);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [
    category,
    kidsMediaSubFilter,
    isKidsProfile,
    isCrunchy,
    platform,
    selectedGenres,
    language,
    minRating,
    yearFrom,
    sortBy,
    page,
  ]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loading && page < totalPages) {
          setPage((p) => (p === 1 ? 3 : p + 1));
        }
      },
      { rootMargin: '400px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loading, page, totalPages]);

  const toggleGenre = (id: number) => {
    setPage(1);
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  };

  const resetFilters = () => {
    setSelectedGenres([]);
    setLanguage(isCrunchy ? 'ja' : category === 'hindi' && !isKidsProfile ? 'hi' : 'all');
    setMinRating('0');
    setYearFrom('1990');
    setSortBy('popularity.desc');
    setPage(1);
  };

  const availableGenres = isCrunchy
    ? ANIME_GENRES
    : isKidsProfile || category === 'kids'
      ? KIDS_GENRES
      : ADULT_GENRES;

  const tabs: Array<{ id: DiscoverCategoryFilter; label: string }> = isCrunchy
    ? [
        { id: 'all', label: 'All Anime' },
        { id: 'tv', label: 'Anime Series' },
        { id: 'movie', label: 'Anime Movies' },
      ]
    : isPrime
      ? [
          { id: 'all', label: 'All Prime' },
          { id: 'movie', label: 'Movies' },
          { id: 'tv', label: 'TV Shows' },
          { id: 'hindi', label: 'Hindi Originals' },
        ]
      : [
          { id: 'all', label: 'All Titles' },
          { id: 'movie', label: 'Movies' },
          { id: 'tv', label: 'TV Shows' },
          { id: 'hindi', label: 'Hindi' },
          { id: 'anime', label: 'Anime' },
          { id: 'kids', label: 'Kids' },
        ];

  return (
    <div className="w-full px-4 pt-24 pb-10 sm:px-6 lg:px-12 bg-[var(--dx-bg)]">
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {isCrunchy
                ? 'Crunchyroll Anime Library'
                : isPrime
                  ? 'Prime Video Catalog'
                  : isKidsProfile || category === 'kids'
                    ? 'Kids Movies & Cartoons'
                    : 'Browse All Titles'}
            </h1>
            {(isKidsProfile || category === 'kids') && (
              <span className="inline-flex items-center gap-1 rounded bg-sky-500/20 px-2 py-0.5 text-xs font-bold text-sky-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Kids Safe
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-[#b3b3b3]">
            {isCrunchy
              ? 'Strictly Japanese anime series, shonen simulcasts & anime films only'
              : isPrime
                ? 'Included with Prime: Amazon Originals, Hindi thrillers & 4K movies'
                : isKidsProfile
                  ? 'Strictly curated animated films, family classics & cartoons only'
                  : 'Every movie, Hindi blockbuster, TV series, anime, and kids title on Netflix'}
          </p>
        </div>

        {/* Category Tabs */}
        {isKidsProfile ? (
          <div className="flex items-center gap-1 rounded-[4px] border border-white/15 bg-[var(--dx-surface)] p-1 self-start sm:self-auto">
            {(
              [
                { id: 'all', label: 'All Kids' },
                { id: 'movie', label: 'Kids Movies' },
                { id: 'tv', label: 'Cartoons & TV' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setKidsMediaSubFilter(tab.id);
                  setPage(1);
                  navigateTo(
                    tab.id === 'all' ? '/discover?type=kids' : `/discover?type=kids&media=${tab.id}`,
                    true,
                  );
                }}
                className={`rounded-[3px] px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  kidsMediaSubFilter === tab.id
                    ? 'bg-[var(--dx-accent)] text-white'
                    : 'text-[#b3b3b3] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="no-scrollbar flex max-w-full items-center gap-1 overflow-x-auto rounded-[4px] border border-white/15 bg-[var(--dx-surface)] p-1 self-start sm:self-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setCategory(tab.id);
                  setLanguage(isCrunchy ? 'ja' : tab.id === 'hindi' ? 'hi' : 'all');
                  setPage(1);
                  navigateTo(`/discover?type=${tab.id}`, true);
                }}
                className={`rounded-[3px] px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  category === tab.id
                    ? 'bg-[var(--dx-accent)] text-white'
                    : 'text-[#b3b3b3] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="mt-6 rounded-[4px] border border-white/10 bg-[var(--dx-surface)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <SlidersHorizontal className="h-4 w-4 text-[var(--dx-accent)]" />
            <span>Filter Catalog</span>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {availableGenres.map((genre) => {
            const active = selectedGenres.includes(genre.id);
            return (
              <button
                key={genre.id}
                type="button"
                onClick={() => toggleGenre(genre.id)}
                className={`rounded-[3px] border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'border-[var(--dx-accent)] bg-[var(--dx-accent)] text-white'
                    : 'border-white/20 bg-[var(--dx-surface-card)] text-[#e5e5e5] hover:border-white'
                }`}
              >
                {genre.name}
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1.5 text-xs font-medium text-[#b3b3b3]">
            <span>Language</span>
            <select
              value={language}
              disabled={isCrunchy}
              onChange={(e) => {
                setLanguage(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-[4px] border border-white/20 bg-[var(--dx-surface-card)] px-3 text-sm text-white focus:border-white focus:outline-none disabled:opacity-60"
            >
              {isCrunchy ? (
                <option value="ja">Japanese Anime (Sub | Dub)</option>
              ) : (
                <>
                  <option value="all">All Languages</option>
                  <option value="hi">Hindi (Bollywood &amp; Indian)</option>
                  <option value="en">English</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                  <option value="es">Spanish</option>
                </>
              )}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-[#b3b3b3]">
            <span>Sort Order</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-[4px] border border-white/20 bg-[var(--dx-surface-card)] px-3 text-sm text-white focus:border-white focus:outline-none"
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="vote_average.desc">Highest Rated</option>
              <option value="primary_release_date.desc">Newest Release</option>
              <option value="revenue.desc">Box Office Titans</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-[#b3b3b3]">
            <span>Minimum Rating</span>
            <select
              value={minRating}
              onChange={(e) => {
                setMinRating(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-[4px] border border-white/20 bg-[var(--dx-surface-card)] px-3 text-sm text-white focus:border-white focus:outline-none"
            >
              <option value="0">Any Score</option>
              <option value="6.5">6.5+ Score</option>
              <option value="7.0">7.0+ Score</option>
              <option value="7.5">7.5+ Score</option>
              <option value="8.0">8.0+ Acclaimed</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-[#b3b3b3]">
            <span>Release Era</span>
            <select
              value={yearFrom}
              onChange={(e) => {
                setYearFrom(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-[4px] border border-white/20 bg-[var(--dx-surface-card)] px-3 text-sm text-white focus:border-white focus:outline-none"
            >
              <option value="1980">1980 — Present</option>
              <option value="1990">1990 — Present</option>
              <option value="2000">2000 — Present</option>
              <option value="2015">2015 — Present</option>
              <option value="2020">2020 — Present</option>
            </select>
          </label>
        </div>
      </div>

      {loading && items.length === 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
          {Array.from({ length: 18 }).map((_, idx) => (
            <div
              key={idx}
              className="aspect-[2/3] animate-pulse rounded-[4px] bg-[var(--dx-surface-card)]"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-12 rounded-[4px] border border-white/10 bg-[var(--dx-surface)] p-12 text-center">
          <p className="font-display text-xl font-bold text-white">No titles match these filters</p>
          <p className="mt-2 text-sm text-[#b3b3b3]">
            Adjust the genre, language, year range, or rating threshold to expand results.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 h-10 rounded-[4px] bg-[var(--dx-accent)] px-5 text-sm font-bold text-white hover:bg-[var(--dx-accent-hover)] cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="mt-6 flex items-center justify-between text-xs text-[#808080]">
            <span>Showing {items.length} titles</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
            {items.map((item) => (
              <MediaCard
                key={`${item.mediaType}-${item.id}`}
                item={item}
                variant="poster"
                platform={platform}
                onSelect={onInspect}
              />
            ))}
          </div>

          <div ref={sentinelRef} className="h-4 w-full" />

          {page < totalPages && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                disabled={loading}
                onClick={() => setPage((p) => (p === 1 ? 3 : p + 1))}
                className="h-10 rounded-[4px] border border-white/35 bg-[var(--dx-surface)] px-8 text-sm font-semibold text-white transition-colors hover:border-[var(--dx-accent)] hover:bg-[var(--dx-surface-elevated)] disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Loading more...' : 'Load More Titles'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
