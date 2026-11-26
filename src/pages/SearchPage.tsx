import { Search, Trash2, Users, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import type { MediaSummary, PersonResult } from '../shared/types';
import { navigateTo, useAppLocation } from '../lib/router';
import {
  addSearchHistory,
  clearSearchHistory,
  getSearchHistory,
  removeSearchHistory,
  subscribeVaultUpdates,
} from '../lib/vaultStorage';
import MediaCard from '../components/MediaCard';

interface SearchPageProps {
  onInspect: (item: MediaSummary) => void;
}

export default function SearchPage({ onInspect }: SearchPageProps) {
  const loc = useAppLocation();
  const initialQuery = loc.params.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [results, setResults] = useState<MediaSummary[]>([]);
  const [people, setPeople] = useState<PersonResult[]>([]);
  const [filterTab, setFilterTab] = useState<'all' | 'movie' | 'tv' | 'people'>('all');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(() => getSearchHistory());

  useEffect(() => {
    return subscribeVaultUpdates(() => setHistory(getSearchHistory()));
  }, []);

  useEffect(() => {
    const q = loc.params.get('q') || '';
    setQuery(q);
    setSubmittedQuery(q);
  }, [loc.search]);

  useEffect(() => {
    const trimmed = submittedQuery.trim();
    if (!trimmed) {
      fetch('/api/tmdb/discover?media=movie&sort_by=popularity.desc')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data?.list)) {
            setResults(data.list.slice(0, 12));
          }
        })
        .catch(() => {});
      setPeople([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetch(`/api/tmdb/search?q=${encodeURIComponent(trimmed)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          setResults(Array.isArray(data.results) ? data.results : []);
          setPeople(Array.isArray(data.people) ? data.people : []);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [submittedQuery]);

  const executeSearch = (term: string) => {
    const trimmed = term.trim();
    setQuery(trimmed);
    setSubmittedQuery(trimmed);
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
    if (filterTab === 'movie') return item.mediaType === 'movie';
    if (filterTab === 'tv') return item.mediaType === 'tv';
    if (filterTab === 'people') return false;
    return true;
  });

  const showPeople = (filterTab === 'all' || filterTab === 'people') && people.length > 0;

  return (
    <div className="w-full px-4 pt-24 pb-10 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl text-center">
          Search Dexterx Cenima
        </h1>
        <p className="mt-2 text-center text-sm text-purple-200/75">
          Search Hindi movies, Hollywood blockbusters, series, anime, and cast avatars
        </p>

        <form onSubmit={handleSubmit} className="relative mt-6">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSubmittedQuery(e.target.value);
            }}
            placeholder="Search Jawan, Dune, Shah Rukh Khan, Mirzapur, Arcane..."
            className="h-14 w-full rounded-2xl border border-purple-500/35 bg-[#100721] pl-12 pr-28 text-base text-white placeholder:text-purple-300/45 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => executeSearch('')}
              className="absolute right-24 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-purple-300 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-xl bg-purple-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-purple-500 cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Recent Searches */}
        {history.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-purple-300/70">Recent:</span>
            {history.map((term) => (
              <div
                key={term}
                className="flex items-center overflow-hidden rounded-lg border border-purple-500/25 bg-[#120924]"
              >
                <button
                  type="button"
                  onClick={() => executeSearch(term)}
                  className="px-3 py-1 text-xs text-purple-100 hover:bg-purple-700/40 cursor-pointer"
                >
                  {term}
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${term}`}
                  onClick={() => removeSearchHistory(term)}
                  className="border-l border-purple-500/20 px-1.5 py-1 text-purple-300/70 hover:text-white cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={clearSearchHistory}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs text-purple-300/60 hover:text-purple-200 cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      {submittedQuery.trim() && (
        <div className="mt-8 flex items-center justify-between border-b border-purple-500/20 pb-4">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
            {(
              [
                { id: 'all', label: `All (${results.length + people.length})` },
                {
                  id: 'movie',
                  label: `Movies (${results.filter((r) => r.mediaType === 'movie').length})`,
                },
                {
                  id: 'tv',
                  label: `Series (${results.filter((r) => r.mediaType === 'tv').length})`,
                },
                { id: 'people', label: `Cast & Directors (${people.length})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTab(tab.id)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filterTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#120924] text-purple-200/75 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* People Results with Real Portrait Avatars */}
      {showPeople && (
        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2 text-base font-bold text-white">
            <Users className="h-4 w-4 text-purple-400" />
            <span>Cast &amp; Filmmakers</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {people.map((person) => (
              <button
                key={person.id}
                type="button"
                onClick={() => navigateTo(`/person/${person.id}`)}
                className="flex items-center gap-3 rounded-xl border border-purple-500/25 bg-[#120924] p-3.5 text-left transition-colors hover:border-purple-400 hover:bg-[#1a0d33] cursor-pointer"
              >
                {person.profile ? (
                  <img
                    src={person.profile}
                    alt={person.name}
                    referrerPolicy="no-referrer"
                    className="h-14 w-14 shrink-0 rounded-full border border-purple-400/45 object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-purple-700/40 font-display text-lg font-bold text-purple-200">
                    {person.name.slice(0, 1)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-bold text-white">
                    {person.name}
                  </p>
                  <p className="text-xs text-purple-300/80">{person.department}</p>
                  {person.knownFor.length > 0 && (
                    <p className="mt-0.5 truncate text-xs text-purple-200/60">
                      {person.knownFor.slice(0, 2).join(', ')}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Media Results */}
      <section className="mt-8">
        {!submittedQuery.trim() && (
          <h2 className="mb-4 font-display text-xl font-bold text-white">
            Trending in Vault
          </h2>
        )}

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] animate-pulse rounded-xl bg-[#120924]" />
            ))}
          </div>
        ) : filteredMedia.length === 0 && !showPeople ? (
          <div className="rounded-2xl border border-purple-500/20 bg-[#0d061a] p-12 text-center">
            <p className="font-display text-xl font-bold text-white">
              No results found for &ldquo;{submittedQuery}&rdquo;
            </p>
            <p className="mt-2 text-sm text-purple-300/75">
              Try searching a title like Jawan, Dune, Mirzapur, or an actor like Shah Rukh Khan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
            {filteredMedia.map((item) => (
              <MediaCard key={`${item.mediaType}-${item.id}`} item={item} onSelect={onInspect} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
