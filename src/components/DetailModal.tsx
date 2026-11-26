import { Bookmark, Film, Play, Tv, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { MediaDetail, MediaSummary } from '../shared/types';
import { buildPlayUrl, navigateTo } from '../lib/router';
import { isFavorited, subscribeVaultUpdates, toggleFavorite } from '../lib/vaultStorage';
import MediaCard from './MediaCard';
import PosterArtwork from './PosterArtwork';

interface DetailModalProps {
  item: MediaSummary | null;
  onClose: () => void;
  onSelectOther: (item: MediaSummary) => void;
}

export default function DetailModal({ item, onClose, onSelectOther }: DetailModalProps) {
  const [detail, setDetail] = useState<MediaDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    return subscribeVaultUpdates(() => setTick((t) => t + 1));
  }, []);

  useEffect(() => {
    if (!item) {
      setDetail(null);
      setShowTrailer(false);
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    let cancelled = false;
    setLoading(true);
    setShowTrailer(false);

    fetch(`/api/tmdb/detail?tmdbId=${item.id}&mediaType=${item.mediaType}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.detail) {
          setDetail(data.detail);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  const active = detail || {
    ...item,
    imdbId: '',
    contentRating: item.mediaType === 'tv' ? 'TV-14' : 'PG-13',
    directors: [],
    cast: [],
    recommendations: [],
  };

  const saved = isFavorited(active.mediaType, active.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={active.title}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="dx-glass-panel relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-purple-500/30 bg-[#0d061a]"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-lg border border-purple-400/30 bg-[#05020b]/85 text-purple-100 transition-colors hover:border-purple-300 hover:bg-purple-600 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Backdrop / Trailer Header */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#05020b]">
          {showTrailer && active.trailerEmbedUrl ? (
            <iframe
              src={active.trailerEmbedUrl}
              title={`${active.title} Trailer`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          ) : (
            <>
              <PosterArtwork
                src={active.backdrop || active.poster}
                alt={active.title}
                title={active.title}
                variant="backdrop"
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d061a] via-[#0d061a]/50 to-transparent"
              />
            </>
          )}
        </div>

        {/* Main Details Body */}
        <div className="relative -mt-12 px-6 pb-8 sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            <div className="hidden sm:block h-44 w-32 shrink-0 overflow-hidden rounded-xl border border-purple-400/30 bg-[#120924] shadow-2xl">
              <PosterArtwork src={active.poster} alt={active.title} title={active.title} />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-purple-300/90">
                <span className="font-mono-num text-purple-200">★ {active.score}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-num">{active.year}</span>
                <span aria-hidden="true">·</span>
                <span>{active.contentRating}</span>
                {active.runtime ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-num">{active.runtime} min</span>
                  </>
                ) : null}
                {active.seasons ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-num">
                      {active.seasons} Seasons / {active.episodes} Eps
                    </span>
                  </>
                ) : null}
              </div>

              {active.logo ? (
                <div className="mt-2 max-w-xs">
                  <img
                    src={active.logo}
                    alt={active.title}
                    referrerPolicy="no-referrer"
                    className="max-h-16 w-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
                  />
                </div>
              ) : (
                <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  {active.title}
                </h2>
              )}

              <p className="mt-1 text-xs text-purple-300/80">
                {active.genres.join(' · ')}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigateTo(
                      buildPlayUrl({
                        tmdbId: active.id,
                        mediaType: active.mediaType,
                        title: active.title,
                        year: active.year,
                        poster: active.poster,
                        score: active.score,
                      }),
                    );
                  }}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-purple-600 px-5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(147,51,234,0.5)] transition-colors hover:bg-purple-500 cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Watch Now</span>
                </button>

                {active.trailerEmbedUrl && (
                  <button
                    type="button"
                    onClick={() => setShowTrailer((prev) => !prev)}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-purple-400/35 bg-[#1b0e36] px-4 text-sm font-semibold text-purple-100 transition-colors hover:bg-purple-800/60 cursor-pointer"
                  >
                    <Film className="h-4 w-4" />
                    <span>{showTrailer ? 'Hide Trailer' : 'Watch Trailer'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    toggleFavorite(active);
                    setTick((t) => t + 1);
                  }}
                  className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors cursor-pointer ${
                    saved
                      ? 'border-purple-400 bg-purple-600/30 text-white'
                      : 'border-purple-500/30 bg-[#120924] text-purple-200 hover:border-purple-400'
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${saved ? 'fill-current text-purple-300' : ''}`} />
                  <span>{saved ? 'Saved in Vault' : 'Save to Vault'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <p className="mt-6 text-sm leading-relaxed text-purple-100/85 sm:text-base">
            {active.overview || 'No synopsis available for this title.'}
          </p>

          {loading && (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-lg bg-purple-950/60" />
              ))}
            </div>
          )}

          {/* Directors & Cast */}
          {(active.directors.length > 0 || active.cast.length > 0) && (
            <div className="mt-7 border-t border-purple-500/20 pt-6">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-purple-200">
                <Users className="h-4 w-4 text-purple-400" />
                <span>Creators &amp; Cast</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                {active.directors.map((dir) => (
                  <button
                    key={`dir-${dir.id}`}
                    type="button"
                    onClick={() => {
                      onClose();
                      navigateTo(`/person/${dir.id}`);
                    }}
                    className="flex items-center gap-3 rounded-xl border border-purple-400/35 bg-purple-900/30 p-2 text-left transition-colors hover:border-purple-300 hover:bg-purple-700/45 cursor-pointer"
                  >
                    {dir.profile ? (
                      <img
                        src={dir.profile}
                        alt={dir.name}
                        referrerPolicy="no-referrer"
                        className="h-10 w-10 shrink-0 rounded-lg object-cover border border-purple-400/40"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-700/50 font-display text-sm font-bold text-white">
                        {dir.name.slice(0, 1)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-white">{dir.name}</p>
                      <p className="truncate text-[11px] text-purple-300">Director</p>
                    </div>
                  </button>
                ))}
                {active.cast.slice(0, 10).map((actor) => (
                  <button
                    key={`cast-${actor.id}`}
                    type="button"
                    onClick={() => {
                      onClose();
                      navigateTo(`/person/${actor.id}`);
                    }}
                    className="flex items-center gap-3 rounded-xl border border-purple-500/20 bg-[#160b2e] p-2 text-left transition-colors hover:border-purple-400 hover:bg-[#1e0f3d] cursor-pointer"
                  >
                    {actor.profile ? (
                      <img
                        src={actor.profile}
                        alt={actor.name}
                        referrerPolicy="no-referrer"
                        className="h-10 w-10 shrink-0 rounded-lg object-cover border border-purple-500/30"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-900/60 font-display text-sm font-bold text-purple-200">
                        {actor.name.slice(0, 1)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-purple-50">{actor.name}</p>
                      {actor.character && (
                        <p className="truncate text-[11px] text-purple-300/75">{actor.character}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Series Episodes Preview */}
          {detail?.seasonsDetail && detail.seasonsDetail.length > 0 && (
            <div className="mt-7 border-t border-purple-500/20 pt-6">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-purple-200">
                <Tv className="h-4 w-4 text-purple-400" />
                <span>Quick Episode Launch · {detail.seasonsDetail[0].title}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {detail.seasonsDetail[0].episodes.slice(0, 10).map((ep) => (
                  <button
                    key={ep.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      navigateTo(
                        buildPlayUrl({
                          tmdbId: active.id,
                          mediaType: 'tv',
                          title: active.title,
                          year: active.year,
                          poster: active.poster,
                          score: active.score,
                          season: ep.seasonNumber,
                          episode: ep.episodeNumber,
                        }),
                      );
                    }}
                    className="flex flex-col items-start rounded-lg border border-purple-500/20 bg-[#140a29] p-2.5 text-left transition-colors hover:border-purple-400 hover:bg-purple-900/40 cursor-pointer"
                  >
                    <span className="font-mono-num text-xs font-bold text-purple-300">
                      S{ep.seasonNumber} · E{ep.episodeNumber}
                    </span>
                    <span className="mt-0.5 line-clamp-1 text-xs text-purple-100/80">
                      {ep.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Related Recommendations */}
          {detail?.recommendations && detail.recommendations.length > 0 && (
            <div className="mt-7 border-t border-purple-500/20 pt-6">
              <h3 className="mb-4 font-display text-lg font-bold text-white">
                More Like This
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5">
                {detail.recommendations.slice(0, 5).map((rec) => (
                  <MediaCard
                    key={`rec-${rec.mediaType}-${rec.id}`}
                    item={rec}
                    onSelect={(picked) => onSelectOther(picked)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
