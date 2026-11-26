import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { DiscoverCategoryFilter, MediaSummary } from '../shared/types';
import { fetchDiscoverTitles } from '../lib/api';
import { navigateTo, useAppLocation } from '../lib/router';
import MediaCard from '../components/MediaCard';

interface DiscoverPageProps {
  onInspect: (item: MediaSummary) => void;
}

const GENRES = [
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
];

export default function DiscoverPage({ onInspect }: DiscoverPageProps) {
  const loc = useAppLocation();
  const initialType = (loc.params.get('type') as DiscoverCategoryFilter) || 'movie';

  const [category, setCategory] = useState<DiscoverCategoryFilter>(initialType);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [language, setLanguage] = useState<string>(initialType === 'hindi' ? 'hi' : 'all');
  const [minRating, setMinRating] = useState<string>('0');
  const [yearFrom, setYearFrom] = useState<string>('1990');
  const [sortBy, setSortBy] = useState<string>('popularity.desc');
  const [items, setItems] = useState<MediaSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const t = (loc.params.get('type') as DiscoverCategoryFilter) || 'movie';
    setCategory(t);
    setLanguage(t === 'hindi' ? 'hi' : 'all');
    setPage(1);
  }, [loc.search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const media =
      category === 'tv' || category === 'anime' || category === 'show' ? 'tv' : 'movie';

    const qs = new URLSearchParams({
      type: category,
      media,
      sort_by: sortBy,
      page: String(page),
      yearMin: yearFrom,
      ratingMin: minRating,
    });
    if (language !== 'all') {
      qs.set('language', language);
    }
    if (selectedGenres.length > 0) {
      qs.set('genres', selectedGenres.join(','));
    }

    fetchDiscoverTitles(qs)
      .then((data) => {
        if (!cancelled) {
          setItems((prev) => (page === 1 ? data.list : [...prev, ...data.list]));
          setTotalPages(data.total_pages);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category, selectedGenres, language, minRating, yearFrom, sortBy, page]);

  const toggleGenre = (id: number) => {
    setPage(1);
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  };

  const resetFilters = () => {
    setSelectedGenres([]);
    setLanguage(category === 'hindi' ? 'hi' : 'all');
    setMinRating('0');
    setYearFrom('1990');
    setSortBy('popularity.desc');
    setPage(1);
  };

  return (
    <div className="w-full px-4 pt-24 pb-10 sm:px-6 lg:px-12">
      <div className="flex flex-col justify-between gap-4 border-b border-purple-500/20 pb-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Discover Vault
          </h1>
          <p className="mt-1 text-sm text-purple-200/75">
            Explore global cinema, Hindi blockbusters, series, anime, and shows
          </p>
        </div>

        {/* Category Segmented Tabs */}
        <div className="no-scrollbar flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-purple-500/25 bg-[#100721] p-1 self-start sm:self-auto">
          {(
            [
              { id: 'movie', label: 'Movies' },
              { id: 'tv', label: 'Series' },
              { id: 'anime', label: 'Anime' },
              { id: 'hindi', label: 'Hindi' },
              { id: 'show', label: 'Shows' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setCategory(tab.id);
                setLanguage(tab.id === 'hindi' ? 'hi' : 'all');
                setPage(1);
                navigateTo(`/discover?type=${tab.id}`, true);
              }}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                category === tab.id
                  ? 'bg-purple-600 text-white shadow-[0_0_16px_rgba(147,51,234,0.45)]'
                  : 'text-purple-200/70 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="mt-6 rounded-2xl border border-purple-500/20 bg-[#0d061a]/90 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-purple-200">
            <SlidersHorizontal className="h-4 w-4 text-purple-400" />
            <span>Vault Filters</span>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-300 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Genre Buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          {GENRES.map((genre) => {
            const active = selectedGenres.includes(genre.id);
            return (
              <button
                key={genre.id}
                type="button"
                onClick={() => toggleGenre(genre.id)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'border-purple-400 bg-purple-600 text-white'
                    : 'border-purple-500/25 bg-[#140a29] text-purple-200/80 hover:border-purple-400/60 hover:text-white'
                }`}
              >
                {genre.name}
              </button>
            );
          })}
        </div>

        {/* Select Controls */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1.5 text-xs font-medium text-purple-300">
            <span>Language</span>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-lg border border-purple-500/30 bg-[#140a29] px-3 text-sm text-white focus:border-purple-400 focus:outline-none"
            >
              <option value="all">All Languages</option>
              <option value="hi">Hindi (Bollywood &amp; Indian)</option>
              <option value="en">English</option>
              <option value="ja">Japanese (Anime)</option>
              <option value="ko">Korean</option>
              <option value="es">Spanish</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-purple-300">
            <span>Sort Order</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-lg border border-purple-500/30 bg-[#140a29] px-3 text-sm text-white focus:border-purple-400 focus:outline-none"
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="vote_average.desc">Highest Rated</option>
              <option value="primary_release_date.desc">Newest Release</option>
              <option value="revenue.desc">Box Office Titans</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-purple-300">
            <span>Minimum Rating</span>
            <select
              value={minRating}
              onChange={(e) => {
                setMinRating(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-lg border border-purple-500/30 bg-[#140a29] px-3 text-sm text-white focus:border-purple-400 focus:outline-none"
            >
              <option value="0">Any Score</option>
              <option value="6.5">6.5+ Score</option>
              <option value="7.0">7.0+ Score</option>
              <option value="7.5">7.5+ Score</option>
              <option value="8.0">8.0+ Acclaimed</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-purple-300">
            <span>Release Era</span>
            <select
              value={yearFrom}
              onChange={(e) => {
                setYearFrom(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-lg border border-purple-500/30 bg-[#140a29] px-3 text-sm text-white focus:border-purple-400 focus:outline-none"
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

      {/* Results Grid */}
      {loading && items.length === 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div
              key={idx}
              className="aspect-[2/3] animate-pulse rounded-xl border border-purple-500/15 bg-[#120924]"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-purple-500/20 bg-[#0d061a] p-12 text-center">
          <p className="font-display text-xl font-bold text-white">No titles match these filters</p>
          <p className="mt-2 text-sm text-purple-300/75">
            Adjust the genre, language, year range, or rating threshold to expand results.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 h-10 rounded-lg bg-purple-600 px-5 text-sm font-semibold text-white hover:bg-purple-500 cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
            {items.map((item) => (
              <MediaCard key={`${item.mediaType}-${item.id}`} item={item} onSelect={onInspect} />
            ))}
          </div>

          {page < totalPages && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                disabled={loading}
                onClick={() => setPage((p) => p + 1)}
                className="h-11 rounded-lg border border-purple-400/35 bg-[#140a29] px-8 text-sm font-semibold text-purple-100 transition-colors hover:bg-purple-600 hover:text-white disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Loading...' : 'Load More Titles'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
