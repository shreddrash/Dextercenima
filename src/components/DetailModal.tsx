import { Check, Film, Play, Plus, ThumbsUp, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchTitleDetail } from '../lib/api';
import { buildPlayUrl, navigateTo } from '../lib/router';
import {
  isFavorited,
  isLiked,
  subscribeVaultUpdates,
  toggleFavorite,
  toggleLike,
} from '../lib/vaultStorage';
import type { MediaDetail, MediaSummary, StreamingPlatform } from '../shared/types';
import { isAllowedOnPlatform } from '../shared/vaultCatalog';
import PosterArtwork from './PosterArtwork';

interface DetailModalProps {
  item: MediaSummary | null;
  platform: StreamingPlatform;
  isKidsMode?: boolean;
  onClose: () => void;
  onSelectOther: (item: MediaSummary) => void;
}

export default function DetailModal({
  item,
  platform,
  isKidsMode = false,
  onClose,
  onSelectOther,
}: DetailModalProps) {
  const [detail, setDetail] = useState<MediaDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedSeasonIdx, setSelectedSeasonIdx] = useState(0);
  const [, setTick] = useState(0);

  const isPrime = platform === 'prime';
  const isCrunchy = platform === 'crunchyroll';

  useEffect(() => {
    return subscribeVaultUpdates(() => setTick((t) => t + 1));
  }, []);

  useEffect(() => {
    if (!item) {
      setDetail(null);
      setShowTrailer(false);
      setSelectedSeasonIdx(0);
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    let cancelled = false;
    setLoading(true);
    setShowTrailer(false);
    setSelectedSeasonIdx(0);

    fetchTitleDetail(item.id, item.mediaType, isKidsMode, platform)
      .then((data) => {
        if (!cancelled && data) {
          setDetail(data);
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
  }, [item, isKidsMode, platform, onClose]);

  if (!item) return null;

  const active = detail || {
    ...item,
    imdbId: '',
    contentRating:
      item.maturityRating || (isKidsMode ? 'U/A 7+' : item.mediaType === 'tv' ? 'TV-MA' : 'U/A 16+'),
    directors: [],
    cast: [],
    recommendations: [],
  };

  const saved = isFavorited(active.mediaType, active.id);
  const liked = isLiked(active.mediaType, active.id);
  const matchPercent = Math.min(99, Math.max(82, Math.round(Number(active.score || 8) * 11)));
  const seasons = detail?.seasonsDetail || [];
  const activeSeason = seasons[selectedSeasonIdx] || seasons[0];
  const recs = (detail?.recommendations || []).filter((r) =>
    isAllowedOnPlatform(r, platform, isKidsMode),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-2 pt-8 pb-12 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={active.title}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[850px] overflow-hidden rounded-md bg-[var(--dx-surface)] text-white shadow-[0_24px_80px_rgba(0,0,0,0.95)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--dx-surface)] text-white hover:bg-[var(--dx-surface-elevated)] cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Hero Preview Stage */}
        <div className="relative h-64 sm:h-[400px] w-full overflow-hidden bg-black">
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
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, var(--dx-surface) 2%, transparent 65%)',
                }}
              />

              <div className="absolute inset-x-0 bottom-0 px-6 pb-6 sm:px-10">
                {active.logo ? (
                  <img
                    src={active.logo}
                    alt={active.title}
                    referrerPolicy="no-referrer"
                    className="mb-4 max-h-20 sm:max-h-28 w-auto max-w-xs sm:max-w-sm object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
                  />
                ) : (
                  <h2 className="mb-4 font-display text-2xl sm:text-4xl font-black tracking-tight text-white drop-shadow">
                    {active.title}
                  </h2>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
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
                      className={`inline-flex h-10 items-center gap-2 px-6 text-sm font-bold transition-colors cursor-pointer ${
                        isPrime
                          ? 'rounded-lg bg-[#00A8E1] text-white hover:bg-[#1A98FF]'
                          : isCrunchy
                            ? 'rounded-[2px] bg-[#F47521] text-black hover:bg-[#FF8A34]'
                            : 'rounded-[4px] bg-white text-black hover:bg-neutral-200'
                      }`}
                    >
                      <Play className="h-4 w-4 fill-current" />
                      <span>{isCrunchy ? 'Watch Anime' : isPrime ? 'Watch with Prime' : 'Play'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        toggleFavorite(active);
                        setTick((t) => t + 1);
                      }}
                      aria-label={saved ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/60 bg-[#2a2a2a]/75 text-white hover:border-white cursor-pointer"
                    >
                      {saved ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        toggleLike(active.mediaType, active.id);
                        setTick((t) => t + 1);
                      }}
                      aria-label="Like title"
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 cursor-pointer ${
                        liked
                          ? 'border-white bg-white text-black'
                          : 'border-white/60 bg-[#2a2a2a]/75 text-white hover:border-white'
                      }`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                  </div>

                  {active.trailerEmbedUrl && (
                    <button
                      type="button"
                      onClick={() => setShowTrailer((prev) => !prev)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/40 bg-black/55 px-3.5 text-xs font-semibold text-white hover:border-white cursor-pointer"
                    >
                      <Film className="h-3.5 w-3.5" />
                      <span>{showTrailer ? 'Close Trailer' : 'Trailer'}</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 2-Column Metadata Section */}
        <div className="px-6 py-6 sm:px-10">
          {showTrailer && active.trailerEmbedUrl && (
            <div className="mb-5 flex flex-wrap items-center gap-2.5">
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
                className="inline-flex h-10 items-center gap-2 rounded-[4px] bg-[var(--dx-accent)] px-6 text-sm font-bold text-white hover:opacity-90 cursor-pointer"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Play Full Title</span>
              </button>
              <button
                type="button"
                onClick={() => setShowTrailer(false)}
                className="h-10 rounded-[4px] border border-white/30 px-4 text-xs font-semibold text-white hover:border-white cursor-pointer"
              >
                Hide Trailer
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="md:col-span-8">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {isPrime ? (
                  <span className="font-bold text-[#00A8E1]">✓ Included with Prime</span>
                ) : isCrunchy ? (
                  <span className="font-bold text-[#F47521]">Sub | Dub · ★ {active.score || '8.5'}</span>
                ) : (
                  <span className="font-bold text-[#46d369]">{matchPercent}% Match</span>
                )}
                <span className="text-[#bcbcbc]">{active.year}</span>
                <span className="border border-white/40 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white">
                  {active.contentRating}
                </span>
                {active.runtime ? <span className="text-[#bcbcbc]">{active.runtime}m</span> : null}
                {active.seasons ? (
                  <span className="text-[#bcbcbc]">
                    {active.seasons} Season{active.seasons > 1 ? 's' : ''}
                  </span>
                ) : null}
                <span className="rounded-[2px] border border-white/40 px-1 text-[10px] font-bold text-[#bcbcbc]">
                  HD
                </span>
              </div>

              <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-white/90">
                {active.overview || 'No synopsis available for this title.'}
              </p>
            </div>

            <div className="md:col-span-4 space-y-2.5 text-xs leading-relaxed">
              {active.cast.length > 0 && (
                <div>
                  <span className="text-[#777777]">Cast: </span>
                  {active.cast.slice(0, 5).map((actor, idx) => (
                    <span key={actor.id}>
                      {isKidsMode ? (
                        <span className="text-white">{actor.name}</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            navigateTo(`/person/${actor.id}`);
                          }}
                          className="text-white hover:underline cursor-pointer"
                        >
                          {actor.name}
                        </button>
                      )}
                      {idx < Math.min(4, active.cast.length - 1) ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}

              <div>
                <span className="text-[#777777]">Genres: </span>
                <span className="text-white">{active.genres.join(', ')}</span>
              </div>

              {active.directors.length > 0 && (
                <div>
                  <span className="text-[#777777]">Director: </span>
                  {active.directors.map((d, idx) => (
                    <span key={d.id}>
                      {isKidsMode ? (
                        <span className="text-white">{d.name}</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            navigateTo(`/person/${d.id}`);
                          }}
                          className="text-white hover:underline cursor-pointer"
                        >
                          {d.name}
                        </button>
                      )}
                      {idx < active.directors.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading && (
            <div className="mt-6 space-y-2">
              <div className="h-14 animate-pulse rounded bg-white/5" />
              <div className="h-14 animate-pulse rounded bg-white/5" />
            </div>
          )}

          {activeSeason && activeSeason.episodes.length > 0 && (
            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="font-display text-lg sm:text-xl font-bold text-white">Episodes</h3>

                {seasons.length > 1 ? (
                  <select
                    value={selectedSeasonIdx}
                    onChange={(e) => setSelectedSeasonIdx(Number(e.target.value))}
                    className="rounded border border-white/30 bg-[var(--dx-surface-elevated)] px-3 py-1.5 text-sm font-semibold text-white focus:outline-none"
                  >
                    {seasons.map((s, idx) => (
                      <option key={s.seasonNumber} value={idx}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-sm font-semibold text-[#bcbcbc]">
                    {activeSeason.title}
                  </span>
                )}
              </div>

              <div className="divide-y divide-white/10">
                {activeSeason.episodes.slice(0, 12).map((ep) => (
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
                    className="group flex w-full items-center gap-3.5 py-3.5 px-2 text-left transition-colors hover:bg-[var(--dx-surface-elevated)] rounded cursor-pointer"
                  >
                    <span className="w-6 shrink-0 text-center font-display text-lg font-bold text-[#d2d2d2]">
                      {ep.episodeNumber}
                    </span>

                    <div className="relative h-16 w-28 sm:h-20 sm:w-36 shrink-0 overflow-hidden rounded bg-[#2a2a2a]">
                      <PosterArtwork
                        src={ep.still || active.backdrop || active.poster}
                        alt={ep.title}
                        title={ep.title}
                        variant="backdrop"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white bg-black/60 text-white">
                          <Play className="h-4 w-4 fill-current" />
                        </span>
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-white">{ep.title}</p>
                        {ep.runtime && (
                          <span className="shrink-0 text-xs text-[#bcbcbc]">{ep.runtime}m</span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-[#a3a3a3]">
                        {ep.overview ||
                          `Watch ${active.title} — Season ${ep.seasonNumber}, Episode ${ep.episodeNumber}`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {recs.length > 0 && (
            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 className="mb-4 font-display text-lg sm:text-xl font-bold text-white">
                More Like This
              </h3>
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                {recs.slice(0, 6).map((rec) => {
                  const recMatch = Math.min(99, Math.max(82, Math.round(Number(rec.score || 8) * 11)));
                  const recSaved = isFavorited(rec.mediaType, rec.id);
                  return (
                    <div
                      key={`rec-${rec.mediaType}-${rec.id}`}
                      onClick={() => onSelectOther(rec)}
                      className="group cursor-pointer overflow-hidden rounded-[4px] bg-[var(--dx-surface-card)] transition-colors hover:bg-[var(--dx-surface-elevated)]"
                    >
                      <div className="relative aspect-video w-full bg-[#222]">
                        <PosterArtwork
                          src={rec.backdrop || rec.poster}
                          alt={rec.title}
                          title={rec.title}
                          variant="backdrop"
                        />
                        <span className="absolute right-2 top-2 text-[11px] font-semibold text-white drop-shadow">
                          {rec.seasons ? `${rec.seasons} Seasons` : rec.year}
                        </span>
                      </div>

                      <div className="p-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <span
                              className={`text-xs font-bold ${
                                isPrime
                                  ? 'text-[#00A8E1]'
                                  : isCrunchy
                                    ? 'text-[#F47521]'
                                    : 'text-[#46d369]'
                              }`}
                            >
                              {isPrime || isCrunchy ? `★ ${rec.score || '8.2'}` : `${recMatch}% Match`}
                            </span>
                            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#bcbcbc]">
                              <span className="border border-white/35 px-1 py-0 text-[9px] font-semibold">
                                {rec.isKids || isKidsMode ? 'U/A 7+' : 'U/A 16+'}
                              </span>
                              <span>{rec.year}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            aria-label={recSaved ? 'Remove from list' : 'Add to list'}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(rec);
                              setTick((t) => t + 1);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/50 text-white hover:border-white cursor-pointer"
                          >
                            {recSaved ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                          </button>
                        </div>

                        <p className="mt-2 truncate text-xs font-bold text-white">{rec.title}</p>
                        <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-[#b3b3b3]">
                          {rec.overview}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8 border-t border-white/10 pt-6">
            <h3 className="font-display text-lg font-bold text-white">
              About <span className="font-normal">{active.title}</span>
            </h3>
            <div className="mt-3 space-y-1.5 text-xs text-[#d2d2d2]">
              {active.directors.length > 0 && (
                <p>
                  <span className="text-[#777777]">Director: </span>
                  {active.directors.map((d) => d.name).join(', ')}
                </p>
              )}
              {active.cast.length > 0 && (
                <p>
                  <span className="text-[#777777]">Cast: </span>
                  {active.cast.slice(0, 8).map((c) => c.name).join(', ')}
                </p>
              )}
              <p>
                <span className="text-[#777777]">Genres: </span>
                {active.genres.join(', ')}
              </p>
              <p>
                <span className="text-[#777777]">Maturity Rating: </span>
                <span className="border border-white/35 px-1.5 py-0.5 text-[10px] font-semibold">
                  {active.contentRating}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
