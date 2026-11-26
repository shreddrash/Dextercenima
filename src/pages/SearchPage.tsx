import {
  Check,
  Info,
  Play,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import MediaCard from '../components/MediaCard';
import PosterArtwork from '../components/PosterArtwork';
import { fetchDiscoverTitles, fetchSearchTitles } from '../lib/api';
import { PLATFORM_THEMES } from '../lib/platform';
import { buildPlayUrl, navigateTo, useAppLocation } from '../lib/router';
import {
  addSearchHistory,
  clearSearchHistory,
  getSearchHistory,
  isFavorited,
  removeSearchHistory,
  subscribeVaultUpdates,
  toggleFavorite,
} from '../lib/vaultStorage';
import type { MediaSummary, PersonResult, StreamingPlatform, UserProfile } from '../shared/types';
import { getHeroVaultItems, isAllowedOnPlatform } from '../shared/vaultCatalog';

interface SearchPageProps {
  platform: StreamingPlatform;
  activeProfile: UserProfile;
  onInspect: (item: MediaSummary) => void;
}

const NETFLIX_TOPICS = [
  'Stranger Things',
  'Squid Game',
  'Money Heist',
  'Wednesday',
  'Sacred Games',
  'Breaking Bad',
  'Dune',
  'Jawan',
  'Arcane',
  'Shah Rukh Khan',
  'Sci-Fi',
  'Action',
];

const PRIME_TOPICS = [
  'The Boys',
  'Fallout',
  'Mirzapur',
  'The Family Man',
  'Reacher',
  'Panchayat',
  'Invincible',
  'Farzi',
  'Jawan',
  'Dune',
];

const CRUNCHYROLL_TOPICS = [
  'Solo Leveling',
  'Attack on Titan',
  'Demon Slayer',
  'Jujutsu Kaisen',
  'One Piece',
  'Chainsaw Man',
  'Frieren',
  'Naruto',
  'Death Note',
  'Your Name',
];

const KIDS_TOPICS = [
  'Inside Out',
  'Spider-Verse',
  'Frozen',
  'Toy Story',
  'Coco',
  'Bluey',
  'SpongeBob',
  'Pokemon',
  'Animation',
  'Family',
];

export default function SearchPage({
  platform,
  activeProfile,
  onInspect,
}: SearchPageProps) {
  const isKids = platform === 'netflix' && activeProfile.isKids;
  const isCrunchy = platform === 'crunchyroll';
  const isPrime = platform === 'prime';
  const theme = PLATFORM_THEMES[platform];

  const loc = useAppLocation();
  const initialQuery = loc.params.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [results, setResults] = useState<MediaSummary[]>([]);
  const [people, setPeople] = useState<PersonResult[]>([]);
  const [topSearches, setTopSearches] = useState<MediaSummary[]>(() =>
    getHeroVaultItems(isKids, platform),
  );
  const [filterTab, setFilterTab] = useState<'all' | 'movie' | 'tv' | 'people'>('all');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(() => getSearchHistory());
  const [, setTick] = useState(0);

  useEffect(() => {
    setHistory(getSearchHistory());
    return subscribeVaultUpdates(() => {
      setHistory(getSearchHistory());
      setTick((t) => t + 1);
    });
  }, [activeProfile.id, platform]);

  useEffect(() => {
    const q = loc.params.get('q') || '';
    setQuery(q);
    setDebouncedQuery(q);
  }, [loc.search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, 180);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      let cancelled = false;
      setLoading(true);
      fetchDiscoverTitles(
        new URLSearchParams({
          type: isCrunchy ? 'anime' : isKids ? 'kids' : 'all',
          media: isCrunchy ? 'tv' : 'movie',
          platform,
          sort_by: 'popularity.desc',
          ...(isKids ? { kids: '1' } : {}),
        }),
        isKids,
        platform,
      )
        .then((data) => {
          if (!cancelled) {
            const safe = data.list.filter((i) => isAllowedOnPlatform(i, platform, isKids));
            setTopSearches(safe.slice(0, 10));
            setResults(safe.slice(0, 24));
          }
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      setPeople([]);
      return () => {
        cancelled = true;
      };
    }

    let cancelled = false;
    setLoading(true);
    fetchSearchTitles(trimmed, isKids, platform)
      .then((data) => {
        if (!cancelled) {
          setResults(data.results.filter((i) => isAllowedOnPlatform(i, platform, isKids)));
          setPeople(isKids || isCrunchy ? [] : data.people);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, isKids, isCrunchy, platform]);

  const executeSearch = (term: string) => {
    const trimmed = term.trim();
    setQuery(term);
    setDebouncedQuery(term);
    if (trimmed) {
      addSearchHistory(trimmed);
      navigateTo(`/search?q=${encodeURIComponent(trimmed)}`, true);
    } else {
      navigateTo('/search', true);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const filteredMedia = results.filter((item) => {
    if (!isAllowedOnPlatform(item, platform, isKids)) return false;
    if (filterTab === 'movie') return item.mediaType === 'movie';
    if (filterTab === 'tv') return item.mediaType === 'tv';
    if (filterTab === 'people') return false;
    return true;
  });

  const showPeople =
    !isKids && !isCrunchy && (filterTab === 'all' || filterTab === 'people') && people.length > 0;
  const relatedTopics = isCrunchy
    ? CRUNCHYROLL_TOPICS
    : isPrime
      ? PRIME_TOPICS
      : isKids
        ? KIDS_TOPICS
        : NETFLIX_TOPICS;

  const heroMatch =
    debouncedQuery.trim() && filteredMedia.length > 0 && filterTab === 'all'
      ? filteredMedia[0]
      : null;
  const remainingGrid = heroMatch ? filteredMedia.slice(1) : filteredMedia;

  return (
    <div className="w-full px-4 pt-24 pb-12 sm:px-6 lg:px-12 bg-[var(--dx-bg)]">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {isCrunchy
                ? 'Search Crunchyroll Anime'
                : isPrime
                  ? 'Search Prime Video'
                  : isKids
                    ? 'Search Kids Vault'
                    : 'Search Netflix Vault'}
            </h1>
            {isKids && (
              <span className="inline-flex items-center gap-1 rounded bg-sky-500/20 px-2 py-0.5 text-xs font-bold text-sky-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Kids Safe
              </span>
            )}
          </div>
          <span className="hidden sm:inline text-xs text-[#808080]">
            Instant search inside {theme.name}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#b3b3b3]" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isCrunchy
                ? 'Search Solo Leveling, Demon Slayer, Attack on Titan, One Piece...'
                : isPrime
                  ? 'Search The Boys, Mirzapur, Fallout, Reacher, Panchayat...'
                  : isKids
                    ? 'Search Inside Out, Spider-Man, Frozen, Bluey, Pokemon...'
                    : 'Search Stranger Things, Squid Game, Jawan, Dune, actors...'
            }
            className="h-14 w-full rounded-[4px] border border-white/25 bg-[var(--dx-surface-card)] pl-12 pr-28 text-base sm:text-lg text-white placeholder:text-[#7a7a7a] focus:border-[var(--dx-accent)] focus:bg-[var(--dx-surface-elevated)] focus:outline-none transition-colors"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => executeSearch('')}
              className="absolute right-24 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[#b3b3b3] hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-[3px] bg-[var(--dx-accent)] px-5 text-sm font-bold text-white transition-colors hover:bg-[var(--dx-accent-hover)] cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-medium text-[#808080] whitespace-nowrap shrink-0">
            Explore titles related to:
          </span>
          {relatedTopics.map((topic) => {
            const active = debouncedQuery.trim().toLowerCase() === topic.toLowerCase();
            return (
              <button
                key={topic}
                type="button"
                onClick={() => executeSearch(topic)}
                className={`rounded-[3px] px-3 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-white text-black font-bold'
                    : 'bg-[var(--dx-surface-elevated)] text-[#d2d2d2] hover:text-white'
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>

        {history.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[#808080]">Recent:</span>
            {history.map((term) => (
              <div
                key={term}
                className="flex items-center overflow-hidden rounded-[3px] border border-white/15 bg-[var(--dx-surface)]"
              >
                <button
                  type="button"
                  onClick={() => executeSearch(term)}
                  className="px-3 py-1 text-xs text-white hover:bg-white/10 cursor-pointer"
                >
                  {term}
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${term}`}
                  onClick={() => removeSearchHistory(term)}
                  className="border-l border-white/10 px-1.5 py-1 text-[#808080] hover:text-white cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={clearSearchHistory}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs text-[#808080] hover:text-white cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>

      {debouncedQuery.trim() && (
        <div className="mt-7 flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
            {(
              [
                {
                  id: 'all',
                  label: `All Results (${results.length + (isKids || isCrunchy ? 0 : people.length)})`,
                },
                {
                  id: 'movie',
                  label: `${isCrunchy ? 'Anime Films' : 'Movies'} (${results.filter((r) => r.mediaType === 'movie').length})`,
                },
                {
                  id: 'tv',
                  label: `${isCrunchy ? 'Anime Series' : 'TV Shows'} (${results.filter((r) => r.mediaType === 'tv').length})`,
                },
                ...(!isKids && !isCrunchy
                  ? [{ id: 'people', label: `Cast & Directors (${people.length})` }]
                  : []),
              ] as Array<{ id: 'all' | 'movie' | 'tv' | 'people'; label: string }>
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTab(tab.id)}
                className={`rounded-[3px] px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filterTab === tab.id
                    ? 'bg-[var(--dx-accent)] text-white'
                    : 'bg-[var(--dx-surface-card)] text-[#b3b3b3] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {!debouncedQuery.trim() ? (
        <div className="mt-8 space-y-10">
          <section>
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[var(--dx-accent)]" />
              <h2 className="font-display text-lg sm:text-xl font-bold text-white">
                {isCrunchy
                  ? 'Top Anime Searches'
                  : isKids
                    ? 'Top Searches for Kids'
                    : `Top Searches on ${theme.shortName}`}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
              {topSearches.slice(0, 8).map((item) => (
                <div
                  key={`top-search-${item.mediaType}-${item.id}`}
                  onClick={() => onInspect(item)}
                  className="group flex items-center gap-3.5 rounded-[4px] bg-[var(--dx-surface)] p-2 pr-4 transition-colors hover:bg-[var(--dx-surface-elevated)] cursor-pointer"
                >
                  <div className="relative h-16 w-28 sm:h-20 sm:w-36 shrink-0 overflow-hidden rounded-[3px] bg-[#222]">
                    <PosterArtwork
                      src={item.backdrop || item.poster}
                      alt={item.title}
                      title={item.title}
                      variant="backdrop"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-sm sm:text-base font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-[#808080]">
                      {item.year} · {item.genres.slice(0, 2).join(' · ')}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Play ${item.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo(
                        buildPlayUrl({
                          tmdbId: item.id,
                          mediaType: item.mediaType,
                          title: item.title,
                          year: item.year,
                          poster: item.poster,
                          score: item.score,
                        }),
                      );
                    }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white/75 text-white transition-colors group-hover:bg-[var(--dx-accent)] group-hover:border-[var(--dx-accent)] cursor-pointer"
                  >
                    <Play className="h-4 w-4 fill-current" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-display text-lg sm:text-xl font-bold text-white">
              {isCrunchy
                ? 'Popular Anime on Crunchyroll'
                : isKids
                  ? 'More Kids Favorites'
                  : `Popular on ${theme.name}`}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
              {results.map((item) => (
                <MediaCard
                  key={`pop-${item.mediaType}-${item.id}`}
                  item={item}
                  variant="poster"
                  platform={platform}
                  onSelect={onInspect}
                />
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {heroMatch && !loading && (
            <section>
              <h2 className="mb-3 font-display text-lg font-bold text-white">Top Result</h2>
              <div
                onClick={() => onInspect(heroMatch)}
                className="relative overflow-hidden rounded-[4px] border border-white/15 bg-[var(--dx-surface)] cursor-pointer group"
              >
                <div className="grid grid-cols-1 md:grid-cols-12">
                  <div className="relative aspect-video md:aspect-auto md:h-64 md:col-span-6 overflow-hidden bg-black">
                    <PosterArtwork
                      src={heroMatch.backdrop || heroMatch.poster}
                      alt={heroMatch.title}
                      title={heroMatch.title}
                      variant="backdrop"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to right, transparent 35%, var(--dx-surface) 100%)',
                      }}
                    />
                  </div>

                  <div className="flex flex-col justify-center p-5 sm:p-7 md:col-span-6">
                    {heroMatch.logo ? (
                      <img
                        src={heroMatch.logo}
                        alt={heroMatch.title}
                        referrerPolicy="no-referrer"
                        className="mb-3 max-h-14 w-auto max-w-xs object-contain"
                      />
                    ) : (
                      <h3 className="font-display text-2xl sm:text-3xl font-black text-white">
                        {heroMatch.title}
                      </h3>
                    )}

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-[var(--dx-accent)]">
                        {isPrime || isCrunchy
                          ? `★ ${heroMatch.score || '8.4'}`
                          : `${Math.min(99, Math.max(82, Math.round(Number(heroMatch.score || 8) * 11)))}% Match`}
                      </span>
                      <span className="text-[#b3b3b3]">{heroMatch.year}</span>
                      <span className="border border-white/35 px-1 text-[10px] text-white">
                        {heroMatch.isKids || isKids
                          ? 'U/A 7+'
                          : heroMatch.mediaType === 'tv'
                            ? 'TV-MA'
                            : 'U/A 16+'}
                      </span>
                      <span className="text-[#808080]">
                        {heroMatch.genres.slice(0, 3).join(' · ')}
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-2 text-xs sm:text-sm text-[#d2d2d2]">
                      {heroMatch.overview}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateTo(
                            buildPlayUrl({
                              tmdbId: heroMatch.id,
                              mediaType: heroMatch.mediaType,
                              title: heroMatch.title,
                              year: heroMatch.year,
                              poster: heroMatch.poster,
                              score: heroMatch.score,
                            }),
                          );
                        }}
                        className="inline-flex h-9 items-center gap-2 rounded-[4px] bg-[var(--dx-accent)] px-5 text-xs sm:text-sm font-bold text-white hover:bg-[var(--dx-accent-hover)] cursor-pointer"
                      >
                        <Play className="h-4 w-4 fill-current" />
                        <span>Play</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(heroMatch);
                          setTick((t) => t + 1);
                        }}
                        className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-[#2a2a2a] px-4 text-xs font-semibold text-white hover:bg-[#383838] cursor-pointer"
                      >
                        {isFavorited(heroMatch.mediaType, heroMatch.id) ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                        <span>{isCrunchy ? 'Watchlist' : isPrime ? 'My Stuff' : 'My List'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onInspect(heroMatch);
                        }}
                        className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-white/30 px-4 text-xs font-semibold text-white hover:border-white cursor-pointer"
                      >
                        <Info className="h-4 w-4" />
                        <span>More Info</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {showPeople && (
            <section>
              <div className="mb-4 flex items-center gap-2 text-base font-bold text-white">
                <Users className="h-4 w-4 text-[var(--dx-accent)]" />
                <span>Cast &amp; Filmmakers</span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {people.map((person) => (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => navigateTo(`/person/${person.id}`)}
                    className="flex items-center gap-3 rounded-[4px] border border-white/10 bg-[var(--dx-surface)] p-3.5 text-left transition-colors hover:border-white/40 hover:bg-[var(--dx-surface-elevated)] cursor-pointer"
                  >
                    {person.profile ? (
                      <img
                        src={person.profile}
                        alt={person.name}
                        referrerPolicy="no-referrer"
                        className="h-14 w-14 shrink-0 rounded-full border border-white/20 object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#2a2a2a] font-display text-lg font-bold text-white">
                        {person.name.slice(0, 1)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-display text-sm font-bold text-white">
                        {person.name}
                      </p>
                      <p className="text-xs text-[#b3b3b3]">{person.department}</p>
                      {person.knownFor.length > 0 && (
                        <p className="mt-0.5 truncate text-xs text-[#737373]">
                          {person.knownFor.slice(0, 2).join(', ')}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          <section>
            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[2/3] animate-pulse rounded-[4px] bg-[var(--dx-surface-card)]"
                  />
                ))}
              </div>
            ) : filteredMedia.length === 0 && !showPeople ? (
              <div className="rounded-[4px] border border-white/10 bg-[var(--dx-surface)] p-12 text-center">
                <p className="font-display text-xl font-bold text-white">
                  No results on {theme.name} for &ldquo;{debouncedQuery}&rdquo;
                </p>
                <p className="mt-2 text-sm text-[#b3b3b3]">
                  {isCrunchy
                    ? 'Crunchyroll shows strictly Anime only. Try Solo Leveling, Attack on Titan, Demon Slayer, or One Piece.'
                    : isPrime
                      ? 'Try searching Prime titles like The Boys, Mirzapur, Fallout, Reacher, or Panchayat.'
                      : isKids
                        ? 'Kids Mode only shows family & kid-safe cartoons/movies. Try Inside Out, Frozen, Coco, or Bluey.'
                        : 'Try searching Stranger Things, Squid Game, Jawan, Dune, or an actor.'}
                </p>
              </div>
            ) : (
              remainingGrid.length > 0 && (
                <>
                  {heroMatch && (
                    <h2 className="mb-4 font-display text-lg font-bold text-white">
                      More Results for &ldquo;{debouncedQuery.trim()}&rdquo;
                    </h2>
                  )}
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
                    {remainingGrid.map((item) => (
                      <MediaCard
                        key={`${item.mediaType}-${item.id}`}
                        item={item}
                        variant="poster"
                        platform={platform}
                        onSelect={onInspect}
                      />
                    ))}
                  </div>
                </>
              )
            )}
          </section>
        </div>
      )}
    </div>
  );
}
