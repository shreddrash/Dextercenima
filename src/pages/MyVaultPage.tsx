import { Bookmark, Play, Shuffle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FavoriteItem, MediaSummary, PlayRecord } from '../shared/types';
import { buildPlayUrl, navigateTo } from '../lib/router';
import {
  clearAllPlayRecords,
  deletePlayRecord,
  getAllFavorites,
  getAllPlayRecords,
  removeFavoriteByKey,
  subscribeVaultUpdates,
} from '../lib/vaultStorage';
import PosterArtwork from '../components/PosterArtwork';

interface MyVaultPageProps {
  onInspect: (item: MediaSummary) => void;
}

export default function MyVaultPage({ onInspect }: MyVaultPageProps) {
  const [tab, setTab] = useState<'favorites' | 'history'>('favorites');
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => getAllFavorites());
  const [history, setHistory] = useState<PlayRecord[]>(() => getAllPlayRecords());
  const [mediaFilter, setMediaFilter] = useState<'all' | 'movie' | 'tv'>('all');

  useEffect(() => {
    return subscribeVaultUpdates(() => {
      setFavorites(getAllFavorites());
      setHistory(getAllPlayRecords());
    });
  }, []);

  const filteredFavorites = favorites.filter((f) =>
    mediaFilter === 'all' ? true : f.mediaType === mediaFilter,
  );

  const handleShufflePlay = () => {
    const pool = filteredFavorites.length > 0 ? filteredFavorites : favorites;
    if (pool.length === 0) return;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    navigateTo(
      buildPlayUrl({
        tmdbId: picked.tmdbId,
        mediaType: picked.mediaType,
        title: picked.title,
        year: picked.year,
        poster: picked.poster,
        score: picked.score,
      }),
    );
  };

  return (
    <div className="w-full px-4 pt-24 pb-10 sm:px-6 lg:px-12">
      <div className="flex flex-col justify-between gap-4 border-b border-purple-500/20 pb-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            My Vault
          </h1>
          <p className="mt-1 text-sm text-purple-200/75">
            Your saved watchlist and playback history — persisted directly in your vault
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-purple-500/25 bg-[#100721] p-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTab('favorites')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              tab === 'favorites'
                ? 'bg-purple-600 text-white'
                : 'text-purple-200/75 hover:text-white'
            }`}
          >
            Saved Watchlist ({favorites.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('history')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              tab === 'history'
                ? 'bg-purple-600 text-white'
                : 'text-purple-200/75 hover:text-white'
            }`}
          >
            Watch History ({history.length})
          </button>
        </div>
      </div>

      {tab === 'favorites' ? (
        <div className="mt-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {(['all', 'movie', 'tv'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMediaFilter(m)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    mediaFilter === m
                      ? 'border-purple-400 bg-purple-600 text-white'
                      : 'border-purple-500/25 bg-[#120924] text-purple-200/75 hover:text-white'
                  }`}
                >
                  {m === 'all' ? 'All Saved' : m === 'movie' ? 'Movies' : 'Series'}
                </button>
              ))}
            </div>

            {favorites.length > 0 && (
              <button
                type="button"
                onClick={handleShufflePlay}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-purple-600 px-4 text-xs font-semibold text-white hover:bg-purple-500 cursor-pointer"
              >
                <Shuffle className="h-3.5 w-3.5" />
                <span>Shuffle Play</span>
              </button>
            )}
          </div>

          {filteredFavorites.length === 0 ? (
            <div className="rounded-2xl border border-purple-500/20 bg-[#0d061a] p-12 text-center">
              <Bookmark className="mx-auto mb-3 h-8 w-8 text-purple-400/70" />
              <h2 className="font-display text-xl font-bold text-white">Your watchlist is empty</h2>
              <p className="mt-2 text-sm text-purple-300/75">
                Tap the bookmark icon on any movie, series, or anime to save it directly to your vault.
              </p>
              <button
                type="button"
                onClick={() => navigateTo('/discover?type=movie')}
                className="mt-5 h-10 rounded-lg bg-purple-600 px-5 text-sm font-semibold text-white hover:bg-purple-500 cursor-pointer"
              >
                Browse Titles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filteredFavorites.map((fav) => (
                <div
                  key={fav.key}
                  onClick={() =>
                    onInspect({
                      id: fav.tmdbId,
                      mediaType: fav.mediaType,
                      title: fav.title,
                      overview: '',
                      poster: fav.poster,
                      backdrop: '',
                      score: fav.score,
                      voteCount: 0,
                      year: fav.year,
                      releaseDate: '',
                      runtime: null,
                      seasons: null,
                      episodes: null,
                      genreIds: [],
                      genres: fav.genres,
                      language: 'en',
                      popularity: 0,
                    })
                  }
                  className="group relative cursor-pointer"
                >
                  <div className="dx-card-hover relative aspect-[2/3] overflow-hidden rounded-xl border border-purple-500/25 bg-[#120924]">
                    <PosterArtwork src={fav.poster} alt={fav.title} title={fav.title} subtitle={fav.year} />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05020b] via-transparent to-transparent" />
                    <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        aria-label={`Remove ${fav.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavoriteByKey(fav.key);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#05020b]/85 text-purple-200 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Play ${fav.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateTo(
                            buildPlayUrl({
                              tmdbId: fav.tmdbId,
                              mediaType: fav.mediaType,
                              title: fav.title,
                              year: fav.year,
                              poster: fav.poster,
                              score: fav.score,
                            }),
                          );
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white hover:bg-purple-500"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                      </button>
                    </div>
                    <div className="pointer-events-none absolute bottom-2.5 right-3 text-xs font-semibold text-purple-100 font-mono-num">
                      ★ {fav.score}
                    </div>
                  </div>
                  <h3 className="mt-2.5 truncate font-display text-sm font-semibold text-white">
                    {fav.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-purple-300/75 font-mono-num">
                    {fav.year} · {fav.mediaType === 'tv' ? 'Series' : 'Movie'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6">
          {history.length > 0 && (
            <div className="mb-5 flex justify-end">
              <button
                type="button"
                onClick={clearAllPlayRecords}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/35 bg-red-950/30 px-3.5 py-2 text-xs font-semibold text-red-200 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear Watch History</span>
              </button>
            </div>
          )}

          {history.length === 0 ? (
            <div className="rounded-2xl border border-purple-500/20 bg-[#0d061a] p-12 text-center">
              <Play className="mx-auto mb-3 h-8 w-8 text-purple-400/70" />
              <h2 className="font-display text-xl font-bold text-white">No playback history yet</h2>
              <p className="mt-2 text-sm text-purple-300/75">
                Start watching any title and Dexterx Cenima will track your episode and server automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {history.map((rec) => (
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
                  className="group flex cursor-pointer items-center gap-4 rounded-xl border border-purple-500/20 bg-[#120924] p-3.5 transition-colors hover:border-purple-400 hover:bg-[#190d32]"
                >
                  <div className="h-24 w-16 shrink-0 overflow-hidden rounded-lg border border-purple-500/25">
                    <PosterArtwork src={rec.poster} alt={rec.title} title={rec.title} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-base font-bold text-white">
                      {rec.title}
                    </h3>
                    <p className="mt-1 text-xs text-purple-300/80 font-mono-num">
                      {rec.mediaType === 'tv' ? `Season ${rec.season} · Episode ${rec.episode}` : 'Feature Film'}
                    </p>
                    <p className="mt-1 text-xs text-purple-300/60 capitalize">
                      Server: {rec.provider}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Delete ${rec.title} history`}
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlayRecord(rec.key);
                    }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-purple-300/60 hover:bg-red-600/20 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
