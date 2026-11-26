import { Bookmark, Play, Shuffle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import PosterArtwork from '../components/PosterArtwork';
import ProfileAvatar from '../components/ProfileAvatar';
import { buildPlayUrl, navigateTo } from '../lib/router';
import {
  clearAllPlayRecords,
  deletePlayRecord,
  getAllFavorites,
  getAllPlayRecords,
  removeFavoriteByKey,
  subscribeVaultUpdates,
} from '../lib/vaultStorage';
import type {
  FavoriteItem,
  MediaSummary,
  PlayRecord,
  StreamingPlatform,
  UserProfile,
} from '../shared/types';

interface MyVaultPageProps {
  platform: StreamingPlatform;
  activeProfile: UserProfile;
  onInspect: (item: MediaSummary) => void;
}

export default function MyVaultPage({
  platform,
  activeProfile,
  onInspect,
}: MyVaultPageProps) {
  const [tab, setTab] = useState<'favorites' | 'history'>('favorites');
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => getAllFavorites());
  const [history, setHistory] = useState<PlayRecord[]>(() => getAllPlayRecords());
  const [mediaFilter, setMediaFilter] = useState<'all' | 'movie' | 'tv'>('all');

  const listLabel =
    platform === 'crunchyroll' ? 'Watchlist' : platform === 'prime' ? 'My Stuff' : 'My List';

  useEffect(() => {
    setFavorites(getAllFavorites());
    setHistory(getAllPlayRecords());
    return subscribeVaultUpdates(() => {
      setFavorites(getAllFavorites());
      setHistory(getAllPlayRecords());
    });
  }, [activeProfile.id, platform]);

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
    <div className="w-full px-4 pt-24 pb-10 sm:px-6 lg:px-12 bg-[var(--dx-bg)]">
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
        <div className="flex items-center gap-4">
          <ProfileAvatar
            avatarId={activeProfile.avatarId}
            name={activeProfile.name}
            size="md"
            className={platform === 'prime' ? '!rounded-full ring-2 ring-[#00A8E1]' : ''}
          />
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {listLabel}
            </h1>
            <p className="mt-1 text-sm text-[#b3b3b3]">
              Saved titles &amp; watch history for{' '}
              <span className="font-semibold text-white">{activeProfile.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-[4px] border border-white/15 bg-[var(--dx-surface)] p-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTab('favorites')}
            className={`rounded-[3px] px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              tab === 'favorites'
                ? 'bg-[var(--dx-accent)] text-white'
                : 'text-[#b3b3b3] hover:text-white'
            }`}
          >
            {listLabel} ({favorites.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('history')}
            className={`rounded-[3px] px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              tab === 'history'
                ? 'bg-[var(--dx-accent)] text-white'
                : 'text-[#b3b3b3] hover:text-white'
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
                  className={`rounded-[3px] border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    mediaFilter === m
                      ? 'border-white bg-white text-black'
                      : 'border-white/20 bg-[var(--dx-surface)] text-[#b3b3b3] hover:text-white'
                  }`}
                >
                  {m === 'all' ? 'All Saved' : m === 'movie' ? 'Movies' : 'TV Shows'}
                </button>
              ))}
            </div>

            {favorites.length > 0 && (
              <button
                type="button"
                onClick={handleShufflePlay}
                className="inline-flex h-9 items-center gap-2 rounded-[4px] bg-white px-4 text-xs font-bold text-black hover:bg-neutral-200 cursor-pointer"
              >
                <Shuffle className="h-3.5 w-3.5" />
                <span>Play Random Title</span>
              </button>
            )}
          </div>

          {filteredFavorites.length === 0 ? (
            <div className="rounded-[4px] border border-white/10 bg-[var(--dx-surface)] p-12 text-center">
              <Bookmark className="mx-auto mb-3 h-8 w-8 text-[#808080]" />
              <h2 className="font-display text-xl font-bold text-white">Your list is empty</h2>
              <p className="mt-2 text-sm text-[#b3b3b3]">
                Tap the + button on any movie or series to save it to {activeProfile.name}&apos;s list.
              </p>
              <button
                type="button"
                onClick={() =>
                  navigateTo(
                    platform === 'netflix' && activeProfile.isKids
                      ? '/discover?type=kids'
                      : '/discover?type=all',
                  )
                }
                className="mt-5 h-10 rounded-[4px] bg-[var(--dx-accent)] px-5 text-sm font-bold text-white hover:bg-[var(--dx-accent-hover)] cursor-pointer"
              >
                Browse Titles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
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
                  <div className="relative aspect-[2/3] overflow-hidden rounded-[4px] bg-[var(--dx-surface-card)] transition-transform duration-200 group-hover:scale-[1.04]">
                    <PosterArtwork
                      src={fav.poster}
                      alt={fav.title}
                      title={fav.title}
                      subtitle={fav.year}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                    <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        aria-label={`Remove ${fav.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavoriteByKey(fav.key);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-white hover:bg-[var(--dx-accent)]"
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
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:bg-neutral-200"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                      </button>
                    </div>
                  </div>
                  <h3 className="mt-2 truncate text-xs font-semibold text-white">{fav.title}</h3>
                  <p className="text-[11px] text-[#808080]">
                    {fav.year} · {fav.mediaType === 'tv' ? 'Series' : 'Film'}
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
                className="inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--dx-accent)]/40 bg-[var(--dx-accent)]/15 px-3.5 py-2 text-xs font-semibold text-white hover:bg-[var(--dx-accent)] transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear Watch History</span>
              </button>
            </div>
          )}

          {history.length === 0 ? (
            <div className="rounded-[4px] border border-white/10 bg-[var(--dx-surface)] p-12 text-center">
              <Play className="mx-auto mb-3 h-8 w-8 text-[#808080]" />
              <h2 className="font-display text-xl font-bold text-white">No playback history yet</h2>
              <p className="mt-2 text-sm text-[#b3b3b3]">
                Start watching any title and {activeProfile.name}&apos;s progress will be saved here.
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
                  className="group flex cursor-pointer items-center gap-4 rounded-[4px] border border-white/10 bg-[var(--dx-surface)] p-3.5 transition-colors hover:border-white/35 hover:bg-[var(--dx-surface-elevated)]"
                >
                  <div className="h-24 w-16 shrink-0 overflow-hidden rounded-[3px]">
                    <PosterArtwork src={rec.poster} alt={rec.title} title={rec.title} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-base font-bold text-white">
                      {rec.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#b3b3b3]">
                      {rec.mediaType === 'tv'
                        ? `Season ${rec.season} · Episode ${rec.episode}`
                        : 'Feature Film'}
                    </p>
                    <p className="mt-1 text-xs text-[#808080] capitalize">
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
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#808080] hover:bg-[var(--dx-accent)] hover:text-white"
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
