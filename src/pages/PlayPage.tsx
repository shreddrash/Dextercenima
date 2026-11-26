import {
  ArrowLeft,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Layers,
  RefreshCw,
  Server,
  Tv,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import MediaCard from '../components/MediaCard';
import { fetchTitleDetail, resolvePlayerSession } from '../lib/api';
import { buildPlayUrl, navigateTo, useAppLocation } from '../lib/router';
import {
  isFavorited,
  savePlayRecord,
  setPreferredProvider,
  subscribeVaultUpdates,
  toggleFavorite,
} from '../lib/vaultStorage';
import {
  getPlayerSandbox,
  normalizePlayerMediaType,
  normalizePlayerProvider,
  PLAYER_PROVIDERS,
} from '../shared/playerSources';
import type {
  MediaDetail,
  MediaSummary,
  PlayerProviderId,
  SeasonDetail,
  StreamingPlatform,
  UserProfile,
} from '../shared/types';
import { isAllowedOnPlatform } from '../shared/vaultCatalog';
import DirectPlayerPage from './DirectPlayerPage';

interface PlayPageProps {
  platform: StreamingPlatform;
  activeProfile: UserProfile;
  onInspect: (item: MediaSummary) => void;
}

export default function PlayPage({ platform, activeProfile, onInspect }: PlayPageProps) {
  const isKids = platform === 'netflix' && activeProfile.isKids;
  const loc = useAppLocation();
  const tmdbId = Number(loc.params.get('tmdbId') || (isKids ? 1022789 : 693134));
  const mediaType = normalizePlayerMediaType(loc.params.get('type'));
  const provider = normalizePlayerProvider(loc.params.get('provider'));
  const season = Math.max(1, Number(loc.params.get('season') || 1));
  const episode = Math.max(1, Number(loc.params.get('episode') || 1));

  const [detail, setDetail] = useState<MediaDetail | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [seasonDetail, setSeasonDetail] = useState<SeasonDetail | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);
  const [, setTick] = useState(0);

  const fallbackTitle = loc.params.get('title') || 'Dexterx Feature';
  const fallbackYear = loc.params.get('year') || '';
  const fallbackPoster = loc.params.get('poster') || '';
  const fallbackScore = loc.params.get('score') || '8.0';

  useEffect(() => {
    return subscribeVaultUpdates(() => setTick((t) => t + 1));
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchTitleDetail(tmdbId, mediaType, isKids, platform)
      .then((data) => {
        if (!cancelled && data) {
          setDetail(data);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [tmdbId, mediaType, isKids, platform]);

  useEffect(() => {
    let cancelled = false;
    resolvePlayerSession({
      tmdbId,
      mediaType,
      provider,
      season,
      episode,
    })
      .then((data) => {
        if (!cancelled) {
          setEmbedUrl(data.embedUrl || '');
          setSeasonDetail(data.seasonDetail || null);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [tmdbId, mediaType, provider, season, episode, platform]);

  const title = detail?.title || fallbackTitle;
  const poster = detail?.poster || fallbackPoster;
  const backdrop = detail?.backdrop || poster;
  const year = detail?.year || fallbackYear;
  const score = detail?.score || fallbackScore;

  useEffect(() => {
    if (!tmdbId) return;
    savePlayRecord({
      tmdbId,
      mediaType,
      title,
      poster,
      backdrop,
      year,
      score,
      season,
      episode,
      totalEpisodes: seasonDetail?.episodeCount || detail?.episodes || 1,
      provider,
      progressSeconds: 0,
      durationSeconds: 0,
    });
  }, [
    tmdbId,
    mediaType,
    title,
    poster,
    backdrop,
    year,
    score,
    season,
    episode,
    provider,
    seasonDetail,
    detail,
  ]);

  const switchParams = (next: {
    provider?: PlayerProviderId;
    season?: number;
    episode?: number;
  }) => {
    const nextProvider = next.provider || provider;
    if (next.provider) setPreferredProvider(next.provider);
    navigateTo(
      buildPlayUrl({
        tmdbId,
        mediaType,
        title,
        year,
        poster,
        score,
        season: next.season ?? season,
        episode: next.episode ?? episode,
        provider: nextProvider,
      }),
      true,
    );
  };

  const saved = isFavorited(mediaType, tmdbId);
  const totalSeasons = detail?.seasons || 1;
  const totalEpisodes = seasonDetail?.episodeCount || 10;
  const safeRecs = (detail?.recommendations || []).filter((r) =>
    isAllowedOnPlatform(r, platform, isKids),
  );

  return (
    <div className="w-full px-4 pt-22 pb-10 sm:px-6 lg:px-12 bg-[var(--dx-bg)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border border-white/20 bg-[var(--dx-surface)] text-white hover:border-white cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate font-display text-xl font-extrabold text-white sm:text-2xl">
              {title}
            </h1>
            <p className="text-xs text-[#b3b3b3] font-mono-num">
              {mediaType === 'tv' ? `Season ${season} · Episode ${episode}` : 'Feature Presentation'}
              {year ? ` · ${year}` : ''}
              {score ? ` · ★ ${score}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setReloadNonce((n) => n + 1)}
            className="inline-flex h-10 items-center gap-2 rounded-[4px] border border-white/20 bg-[var(--dx-surface)] px-3.5 text-xs font-semibold text-white hover:border-white cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reload Stream</span>
          </button>

          <button
            type="button"
            onClick={() => {
              toggleFavorite({
                id: tmdbId,
                mediaType,
                title,
                overview: detail?.overview || '',
                poster,
                backdrop,
                score,
                voteCount: detail?.voteCount || 0,
                year,
                releaseDate: detail?.releaseDate || '',
                runtime: detail?.runtime || null,
                seasons: detail?.seasons || null,
                episodes: detail?.episodes || null,
                genreIds: detail?.genreIds || [],
                genres: detail?.genres || [],
                language: detail?.language || 'en',
                popularity: detail?.popularity || 0,
              });
              setTick((t) => t + 1);
            }}
            className={`inline-flex h-10 items-center gap-2 rounded-[4px] border px-4 text-xs font-semibold transition-colors cursor-pointer ${
              saved
                ? 'border-white bg-white text-black'
                : 'border-white/20 bg-[var(--dx-surface)] text-white hover:border-white'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${saved ? 'fill-current' : ''}`} />
            <span>
              {saved
                ? 'Saved'
                : platform === 'crunchyroll'
                  ? 'Watchlist'
                  : platform === 'prime'
                    ? 'My Stuff'
                    : 'My List'}
            </span>
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[4px] border border-white/15 bg-black shadow-2xl">
        <div className="aspect-video w-full bg-black">
          {provider === 'bingr' ? (
            <DirectPlayerPage
              key={`bingr-${tmdbId}-${mediaType}-${season}-${episode}-${reloadNonce}`}
              tmdbId={tmdbId}
              mediaType={mediaType}
              season={season}
              episode={episode}
            />
          ) : embedUrl ? (
            <iframe
              key={`${embedUrl}-${reloadNonce}`}
              src={embedUrl}
              title={`${title} Stream Player`}
              allowFullScreen
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              sandbox={getPlayerSandbox(provider)}
              referrerPolicy="no-referrer"
              className="h-full w-full border-0"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--dx-accent)] border-t-transparent" />
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-[4px] border border-white/10 bg-[var(--dx-surface)] p-4 sm:p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Server className="h-4 w-4 text-[var(--dx-accent)]" />
            <span>Streaming Servers</span>
          </div>

          {mediaType === 'tv' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={episode <= 1}
                onClick={() => switchParams({ episode: Math.max(1, episode - 1) })}
                className="inline-flex h-9 items-center gap-1 rounded-[4px] border border-white/20 bg-[var(--dx-surface-card)] px-3 text-xs font-semibold text-white hover:border-white disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev Ep</span>
              </button>
              <button
                type="button"
                disabled={episode >= totalEpisodes}
                onClick={() => switchParams({ episode: episode + 1 })}
                className="inline-flex h-9 items-center gap-1 rounded-[4px] border border-white/20 bg-[var(--dx-surface-card)] px-3 text-xs font-semibold text-white hover:border-white disabled:opacity-40 cursor-pointer"
              >
                <span>Next Ep</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {PLAYER_PROVIDERS.map((p) => {
            const active = p.id === provider;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => switchParams({ provider: p.id })}
                className={`flex flex-col items-start rounded-[4px] border px-4 py-2 text-left transition-colors cursor-pointer ${
                  active
                    ? 'border-[var(--dx-accent)] bg-[var(--dx-accent)] text-white'
                    : 'border-white/15 bg-[var(--dx-surface-card)] text-[#e5e5e5] hover:border-white'
                }`}
              >
                <span className="text-xs font-bold">{p.label}</span>
                <span className={`text-[11px] ${active ? 'text-white/90' : 'text-[#808080]'}`}>
                  {p.tagline}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {mediaType === 'tv' && (
        <div className="mt-6 rounded-[4px] border border-white/10 bg-[var(--dx-surface)] p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-base font-bold text-white">
              <Tv className="h-4 w-4 text-[var(--dx-accent)]" />
              <span>Episodes</span>
            </div>

            {totalSeasons > 1 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <Layers className="mr-1 h-4 w-4 text-[#808080]" />
                {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((sNum) => (
                  <button
                    key={sNum}
                    type="button"
                    onClick={() => switchParams({ season: sNum, episode: 1 })}
                    className={`rounded-[3px] px-3 py-1.5 text-xs font-semibold font-mono-num transition-colors cursor-pointer ${
                      season === sNum
                        ? 'bg-[var(--dx-accent)] text-white'
                        : 'bg-[var(--dx-surface-elevated)] text-[#b3b3b3] hover:text-white'
                    }`}
                  >
                    S{sNum}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {(seasonDetail?.episodes || []).map((ep) => {
              const isCurrent = ep.episodeNumber === episode;
              return (
                <button
                  key={ep.id}
                  type="button"
                  onClick={() => switchParams({ episode: ep.episodeNumber })}
                  className={`flex items-center gap-3 rounded-[4px] border p-2.5 text-left transition-colors cursor-pointer ${
                    isCurrent
                      ? 'border-[var(--dx-accent)] bg-[var(--dx-accent)]/20 text-white'
                      : 'border-white/10 bg-[var(--dx-surface-card)] text-[#e5e5e5] hover:border-white/40'
                  }`}
                >
                  {ep.still && (
                    <img
                      src={ep.still}
                      alt={ep.title}
                      referrerPolicy="no-referrer"
                      className="h-14 w-24 shrink-0 rounded-[2px] object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <span className="font-mono-num text-xs font-bold text-[var(--dx-accent)]">
                      Episode {ep.episodeNumber}
                    </span>
                    <p className="mt-0.5 line-clamp-1 text-xs font-semibold text-white">
                      {ep.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {detail && (
        <div className="mt-8 space-y-8">
          <div className="rounded-[4px] border border-white/10 bg-[var(--dx-surface)] p-6">
            <h2 className="font-display text-lg font-bold text-white">About {detail.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#d2d2d2]">{detail.overview}</p>
            {detail.cast.length > 0 && !isKids && platform !== 'crunchyroll' && (
              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {detail.cast.slice(0, 8).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => navigateTo(`/person/${c.id}`)}
                    className="flex items-center gap-2.5 rounded-[4px] border border-white/10 bg-[var(--dx-surface-card)] p-2 text-left hover:border-white/40 cursor-pointer"
                  >
                    {c.profile ? (
                      <img
                        src={c.profile}
                        alt={c.name}
                        referrerPolicy="no-referrer"
                        className="h-9 w-9 shrink-0 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[#333] font-display text-xs font-bold text-white">
                        {c.name.slice(0, 1)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-white">{c.name}</p>
                      {c.character && (
                        <p className="truncate text-[11px] text-[#808080]">{c.character}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {safeRecs.length > 0 && (
            <section>
              <h2 className="mb-4 font-display text-xl font-bold text-white">More Like This</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
                {safeRecs.slice(0, 6).map((rec) => (
                  <MediaCard
                    key={`${rec.mediaType}-${rec.id}`}
                    item={rec}
                    variant="poster"
                    platform={platform}
                    onSelect={onInspect}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
