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
import {
  getPlayerSandbox,
  normalizePlayerMediaType,
  normalizePlayerProvider,
  PLAYER_PROVIDERS,
} from '../shared/playerSources';
import type { MediaDetail, MediaSummary, PlayerProviderId, SeasonDetail } from '../shared/types';
import { fetchTitleDetail, resolvePlayerSession } from '../lib/api';
import { buildPlayUrl, navigateTo, useAppLocation } from '../lib/router';
import {
  isFavorited,
  savePlayRecord,
  setPreferredProvider,
  subscribeVaultUpdates,
  toggleFavorite,
} from '../lib/vaultStorage';
import MediaCard from '../components/MediaCard';
import DirectPlayerPage from './DirectPlayerPage';

interface PlayPageProps {
  onInspect: (item: MediaSummary) => void;
}

export default function PlayPage({ onInspect }: PlayPageProps) {
  const loc = useAppLocation();
  const tmdbId = Number(loc.params.get('tmdbId') || 693134);
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
    fetchTitleDetail(tmdbId, mediaType)
      .then((data) => {
        if (!cancelled && data) {
          setDetail(data);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [tmdbId, mediaType]);

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
  }, [tmdbId, mediaType, provider, season, episode]);

  const title = detail?.title || fallbackTitle;
  const poster = detail?.poster || fallbackPoster;
  const backdrop = detail?.backdrop || poster;
  const year = detail?.year || fallbackYear;
  const score = detail?.score || fallbackScore;

  // Save Continue Watching progress whenever title/episode loads
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
  }, [tmdbId, mediaType, title, poster, backdrop, year, score, season, episode, provider, seasonDetail, detail]);

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

  return (
    <div className="w-full px-4 pt-22 pb-10 sm:px-6 lg:px-12">
      {/* Top Theater Control Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-purple-500/25 bg-[#120924] text-purple-200 hover:border-purple-400 hover:text-white cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate font-display text-xl font-extrabold text-white sm:text-2xl">
              {title}
            </h1>
            <p className="text-xs text-purple-300/80 font-mono-num">
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
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-purple-500/25 bg-[#120924] px-3.5 text-xs font-semibold text-purple-200 hover:border-purple-400 hover:text-white cursor-pointer"
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
            className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-xs font-semibold transition-colors cursor-pointer ${
              saved
                ? 'border-purple-400 bg-purple-600/30 text-white'
                : 'border-purple-500/25 bg-[#120924] text-purple-200 hover:border-purple-400'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${saved ? 'fill-current text-purple-300' : ''}`} />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Theater Frame */}
      <div className="overflow-hidden rounded-2xl border border-purple-500/30 bg-black dx-purple-glow">
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
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
            </div>
          )}
        </div>
      </div>

      {/* Multi-Provider Server Switcher */}
      <div className="mt-5 rounded-2xl border border-purple-500/25 bg-[#0d061a] p-4 sm:p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm font-semibold text-purple-200">
            <Server className="h-4 w-4 text-purple-400" />
            <span>Streaming Servers</span>
          </div>

          {mediaType === 'tv' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={episode <= 1}
                onClick={() => switchParams({ episode: Math.max(1, episode - 1) })}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-purple-500/25 bg-[#140a29] px-3 text-xs font-semibold text-purple-200 hover:border-purple-400 hover:text-white disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev Ep</span>
              </button>
              <button
                type="button"
                disabled={episode >= totalEpisodes}
                onClick={() => switchParams({ episode: episode + 1 })}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-purple-500/25 bg-[#140a29] px-3 text-xs font-semibold text-purple-200 hover:border-purple-400 hover:text-white disabled:opacity-40 cursor-pointer"
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
                className={`flex flex-col items-start rounded-xl border px-4 py-2 text-left transition-colors cursor-pointer ${
                  active
                    ? 'border-purple-400 bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]'
                    : 'border-purple-500/25 bg-[#140a29] text-purple-200 hover:border-purple-400/60 hover:text-white'
                }`}
              >
                <span className="text-xs font-bold">{p.label}</span>
                <span className={`text-[11px] ${active ? 'text-purple-100' : 'text-purple-300/65'}`}>
                  {p.tagline}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Season & Episode Picker for TV & Anime */}
      {mediaType === 'tv' && (
        <div className="mt-6 rounded-2xl border border-purple-500/25 bg-[#0d061a] p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-base font-bold text-white">
              <Tv className="h-4 w-4 text-purple-400" />
              <span>Episodes</span>
            </div>

            {totalSeasons > 1 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <Layers className="mr-1 h-4 w-4 text-purple-300/70" />
                {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((sNum) => (
                  <button
                    key={sNum}
                    type="button"
                    onClick={() => switchParams({ season: sNum, episode: 1 })}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold font-mono-num transition-colors cursor-pointer ${
                      season === sNum
                        ? 'bg-purple-600 text-white'
                        : 'bg-[#140a29] text-purple-200 hover:text-white'
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
                  className={`flex items-center gap-3 rounded-xl border p-2.5 text-left transition-colors cursor-pointer ${
                    isCurrent
                      ? 'border-purple-400 bg-purple-600/35 text-white'
                      : 'border-purple-500/20 bg-[#140a29] text-purple-200 hover:border-purple-400/50 hover:text-white'
                  }`}
                >
                  {ep.still && (
                    <img
                      src={ep.still}
                      alt={ep.title}
                      referrerPolicy="no-referrer"
                      className="h-14 w-24 shrink-0 rounded-lg object-cover border border-purple-500/25"
                    />
                  )}
                  <div className="min-w-0">
                    <span className="font-mono-num text-xs font-bold text-purple-300">
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

      {/* Synopsis & Recommendations */}
      {detail && (
        <div className="mt-8 space-y-8">
          <div className="rounded-2xl border border-purple-500/20 bg-[#0d061a] p-6">
            <h2 className="font-display text-lg font-bold text-white">About {detail.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-purple-100/80">
              {detail.overview}
            </p>
            {detail.cast.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {detail.cast.slice(0, 8).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => navigateTo(`/person/${c.id}`)}
                    className="flex items-center gap-2.5 rounded-xl border border-purple-500/20 bg-[#140a29] p-2 text-left hover:border-purple-400 hover:text-white cursor-pointer"
                  >
                    {c.profile ? (
                      <img
                        src={c.profile}
                        alt={c.name}
                        referrerPolicy="no-referrer"
                        className="h-9 w-9 shrink-0 rounded-lg object-cover border border-purple-500/30"
                      />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-900/60 font-display text-xs font-bold text-purple-200">
                        {c.name.slice(0, 1)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-white">{c.name}</p>
                      {c.character && (
                        <p className="truncate text-[11px] text-purple-300/75">{c.character}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {detail.recommendations.length > 0 && (
            <section>
              <h2 className="mb-4 font-display text-xl font-bold text-white">
                Recommended Next
              </h2>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {detail.recommendations.slice(0, 5).map((rec) => (
                  <MediaCard
                    key={`${rec.mediaType}-${rec.id}`}
                    item={rec}
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
