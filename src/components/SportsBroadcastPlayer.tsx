import Hls from 'hls.js';
import {
  Clock,
  Globe,
  Maximize2,
  Pause,
  Play,
  Radio,
  RefreshCw,
  RotateCcw,
  RotateCw,
  ShieldCheck,
  Tv,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SportMatch } from '../shared/types';
import ClubLogo from './ClubLogo';
import SportsArtwork from './SportsArtwork';

interface SportsBroadcastPlayerProps {
  match: SportMatch | null;
  playlist: SportMatch[];
  preferredLanguage?: 'All' | 'English' | 'Hindi';
  onClose: () => void;
  onSelectMatch: (match: SportMatch) => void;
}

export default function SportsBroadcastPlayer({
  match,
  playlist,
  preferredLanguage = 'All',
  onClose,
  onSelectMatch,
}: SportsBroadcastPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [streamIdx, setStreamIdx] = useState(0);
  const [useRelay, setUseRelay] = useState(false);
  const [reloadNonce, setReloadNonce] = useState(0);
  const [hlsStatus, setHlsStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.9);

  // Pick initial stream matching preferred commentary language (Hindi or English)
  useEffect(() => {
    if (!match) return;
    let initialIdx = 0;
    if (preferredLanguage !== 'All' && match.streams.length > 0) {
      const matched = match.streams.findIndex(
        (s) => s.language.toLowerCase() === preferredLanguage.toLowerCase(),
      );
      if (matched !== -1) initialIdx = matched;
    }
    setStreamIdx(initialIdx);
    const chosen = match.streams[initialIdx] || match.streams[0];
    const needsProxyByDefault = Boolean(
      chosen && (chosen.url.startsWith('http://') || chosen.url.includes('r2.amml.in')),
    );
    setUseRelay(needsProxyByDefault);
    setReloadNonce(0);
    setHlsStatus('loading');
  }, [match?.id, preferredLanguage]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, []);

  const skipBy = useCallback((deltaSec: number) => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.currentTime)) return;
    v.currentTime = Math.max(0, v.currentTime + deltaSec);
  }, []);

  const jumpToLiveEdge = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.seekable && v.seekable.length > 0) {
      v.currentTime = v.seekable.end(v.seekable.length - 1);
    }
    v.play().then(() => setIsPlaying(true)).catch(() => {});
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    const next = !isMuted;
    setIsMuted(next);
    if (v) v.muted = next;
  }, [isMuted]);

  const handleFullscreen = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!match) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'Escape') onClose();
      else if (e.key === ' ' && match.streams.length > 0) {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowLeft') skipBy(-10);
      else if (e.key === 'ArrowRight') skipBy(10);
      else if (e.key === 'm' || e.key === 'M') toggleMute();
      else if (e.key === 'f' || e.key === 'F') handleFullscreen();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [match, onClose, togglePlay, skipBy, toggleMute, handleFullscreen]);

  const activeStream =
    match && match.streams.length > 0 ? match.streams[streamIdx] || match.streams[0] : null;

  const availableCommentaryLangs = useMemo(() => {
    if (!match) return [] as Array<'English' | 'Hindi'>;
    const out: Array<'English' | 'Hindi'> = [];
    if (match.streams.some((s) => s.language === 'English')) out.push('English');
    if (match.streams.some((s) => s.language === 'Hindi')) out.push('Hindi');
    return out;
  }, [match]);

  const switchCommentaryLanguage = (lang: 'English' | 'Hindi') => {
    if (!match) return;
    const idx = match.streams.findIndex((s) => s.language === lang);
    if (idx !== -1) {
      setStreamIdx(idx);
      const target = match.streams[idx];
      setUseRelay(target.url.startsWith('http://') || target.url.includes('r2.amml.in'));
      setReloadNonce((n) => n + 1);
    }
  };

  const alternateFeeds = useMemo(() => {
    const sameSportLive = playlist.filter(
      (m) => m.id !== match?.id && m.streams.length > 0 && m.sport === match?.sport,
    );
    const otherLive = playlist.filter(
      (m) => m.id !== match?.id && m.streams.length > 0 && m.sport !== match?.sport,
    );
    return [...sameSportLive, ...otherLive].slice(0, 8);
  }, [playlist, match?.id, match?.sport]);

  useEffect(() => {
    if (!match || !activeStream) return;
    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setHlsStatus('loading');

    const forceRelay =
      useRelay ||
      activeStream.url.startsWith('http://') ||
      activeStream.url.includes('r2.amml.in');

    const sourceUrl = forceRelay
      ? `/api/sports/hls-proxy?url=${encodeURIComponent(activeStream.url)}`
      : activeStream.url;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
      });
      hlsRef.current = hls;
      hls.loadSource(sourceUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setHlsStatus('ready');
        video.volume = volume;
        video.muted = isMuted;
        video
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;
        if (!forceRelay) {
          setUseRelay(true);
        } else if (streamIdx + 1 < match.streams.length) {
          const nextIdx = streamIdx + 1;
          const nextStream = match.streams[nextIdx];
          setStreamIdx(nextIdx);
          setUseRelay(
            Boolean(
              nextStream &&
                (nextStream.url.startsWith('http://') || nextStream.url.includes('r2.amml.in')),
            ),
          );
        } else {
          setHlsStatus('error');
        }
      });

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
      const onLoaded = () => {
        setHlsStatus('ready');
        video.play().catch(() => {});
      };
      const onErr = () => {
        if (!forceRelay) setUseRelay(true);
        else setHlsStatus('error');
      };
      video.addEventListener('loadedmetadata', onLoaded);
      video.addEventListener('error', onErr);
      return () => {
        video.removeEventListener('loadedmetadata', onLoaded);
        video.removeEventListener('error', onErr);
      };
    }

    setHlsStatus('error');
  }, [match, activeStream, streamIdx, useRelay, reloadNonce]);

  if (!match) return null;

  const gameLabel = match.sport === 'cricket' ? 'Cricket' : 'Football';
  const activeLang = activeStream?.language === 'Hindi' ? 'Hindi' : 'English';

  return (
    <div
      className="fixed inset-0 z-[92] flex flex-col overflow-y-auto bg-[#040706]/98 backdrop-blur-2xl text-white"
      role="dialog"
      aria-modal="true"
      aria-label={`${match.title} Live Broadcast`}
    >
      {/* Top Broadcast Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/10 bg-[#050908]/95 px-4 py-3 sm:px-8">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center -space-x-2 shrink-0">
            <ClubLogo
              src={match.team1Badge}
              name={match.team1}
              color={match.team1Color}
              size="xs"
            />
            <ClubLogo
              src={match.team2Badge}
              name={match.team2}
              color={match.team2Color}
              size="xs"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1.5 font-extrabold uppercase tracking-wider text-red-400 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                LIVE
              </span>
              <span className="text-white/25" aria-hidden="true">
                ·
              </span>
              <span
                className={`font-bold uppercase tracking-wider shrink-0 ${
                  match.sport === 'cricket' ? 'text-amber-300' : 'text-[#10B981]'
                }`}
              >
                {gameLabel}
              </span>
              <span className="text-white/25" aria-hidden="true">
                ·
              </span>
              <span className="truncate font-semibold text-white/80">{match.tournament}</span>
              <span className="text-white/25" aria-hidden="true">
                ·
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-amber-300 shrink-0">
                <Globe className="h-3 w-3" />
                <span>{activeLang} Live</span>
              </span>
            </div>
            <h2 className="truncate font-display text-sm sm:text-lg font-extrabold text-white">
              {match.title}
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close Live Broadcast"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition-colors hover:border-[#10B981] hover:bg-[#10B981]/20 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Theater Stage + Live Channels Rail */}
      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 px-4 py-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          {/* Direct 16:9 Live Video Player */}
          <div
            ref={stageRef}
            className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-black shadow-[0_28px_90px_rgba(0,0,0,0.9)]"
          >
            <div className="aspect-video w-full bg-black relative">
              <video
                ref={videoRef}
                playsInline
                onClick={togglePlay}
                className="h-full w-full object-contain cursor-pointer"
              />

              {hlsStatus === 'loading' && (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#10B981] border-t-transparent" />
                  <p className="text-sm font-semibold text-emerald-100/95">
                    Connecting {activeLang} Live Stream...
                  </p>
                </div>
              )}

              {hlsStatus === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/92 p-6 text-center">
                  <Radio className="h-9 w-9 text-emerald-400" />
                  <p className="mt-3 font-display text-lg font-bold text-white">
                    Switch Commentary or Live Feed
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setUseRelay((r) => !r);
                        setReloadNonce((n) => n + 1);
                      }}
                      className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#10B981] px-5 text-xs font-black text-[#04140E] cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Retry Stream</span>
                    </button>

                    {availableCommentaryLangs.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => switchCommentaryLanguage(lang)}
                        className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-xs font-bold text-white hover:border-[#10B981] cursor-pointer"
                      >
                        <Globe className="h-3.5 w-3.5 text-amber-300" />
                        <span>{lang} Live</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Minimal Broadcast Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#080F0D] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10B981] text-[#04140E] hover:bg-[#34D399] cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 fill-current" />
                  ) : (
                    <Play className="h-4 w-4 fill-current" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => skipBy(-10)}
                  aria-label="Rewind 10 seconds"
                  className="flex h-11 items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-3 text-xs font-semibold text-white hover:border-[#10B981] cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="font-mono-num">10s</span>
                </button>

                <button
                  type="button"
                  onClick={() => skipBy(10)}
                  aria-label="Forward 10 seconds"
                  className="flex h-11 items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-3 text-xs font-semibold text-white hover:border-[#10B981] cursor-pointer"
                >
                  <span className="font-mono-num">10s</span>
                  <RotateCw className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={jumpToLiveEdge}
                  className="hidden sm:inline-flex h-11 items-center gap-1.5 rounded-xl border border-red-500/35 bg-red-500/15 px-3.5 text-xs font-bold text-red-300 hover:bg-red-500/25 cursor-pointer"
                >
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span>LIVE</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* 1-Tap Hindi / English Live Commentary Toggle */}
                {availableCommentaryLangs.map((lang) => {
                  const selected = activeLang === lang;
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => switchCommentaryLanguage(lang)}
                      className={`inline-flex h-11 items-center gap-1.5 rounded-xl border px-3.5 text-xs font-extrabold transition-colors cursor-pointer ${
                        selected
                          ? 'border-amber-400 bg-amber-400 text-[#050807]'
                          : 'border-white/15 bg-white/5 text-white hover:border-amber-400/60'
                      }`}
                    >
                      <Globe className="h-3.5 w-3.5" />
                      <span>{lang}</span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white hover:border-white cursor-pointer"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>

                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setVolume(val);
                    setIsMuted(val === 0);
                    if (videoRef.current) {
                      videoRef.current.volume = val;
                      videoRef.current.muted = val === 0;
                    }
                  }}
                  aria-label="Volume"
                  className="hidden md:block w-20 accent-[#10B981] cursor-pointer"
                />

                <button
                  type="button"
                  onClick={handleFullscreen}
                  aria-label="Fullscreen"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white hover:border-[#10B981] cursor-pointer"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Match Summary, Club Logos & Server Feed Selector */}
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#0A110E] p-4 sm:flex-row sm:items-center sm:p-5">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex items-center -space-x-2 shrink-0">
                <ClubLogo
                  src={match.team1Badge}
                  name={match.team1}
                  color={match.team1Color}
                  size="sm"
                />
                <ClubLogo
                  src={match.team2Badge}
                  name={match.team2}
                  color={match.team2Color}
                  size="sm"
                />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className={match.sport === 'cricket' ? 'text-amber-400' : 'text-[#10B981]'}>
                    {gameLabel}
                  </span>
                  <span className="text-white/25">·</span>
                  <span className="text-white/75">{match.tournament}</span>
                  {match.matchStatus === 'upcoming' && match.statusDetail && (
                    <>
                      <span className="text-white/25">·</span>
                      <span className="inline-flex items-center gap-1 text-amber-300 font-mono-num">
                        <Clock className="h-3 w-3" />
                        {match.statusDetail}
                      </span>
                    </>
                  )}
                </div>
                <h3 className="mt-0.5 truncate font-display text-base sm:text-lg font-black text-white">
                  {match.team1}{' '}
                  {match.team1Score ? (
                    <span className="font-mono-num text-emerald-300">({match.team1Score})</span>
                  ) : null}{' '}
                  <span className="text-white/40">vs</span> {match.team2}{' '}
                  {match.team2Score ? (
                    <span className="font-mono-num text-emerald-300">({match.team2Score})</span>
                  ) : null}
                </h3>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {match.streams.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setStreamIdx(idx);
                    setUseRelay(s.url.startsWith('http://') || s.url.includes('r2.amml.in'));
                  }}
                  className={`min-h-[40px] rounded-xl border px-3 text-xs font-bold transition-colors cursor-pointer ${
                    idx === streamIdx
                      ? 'border-[#10B981] bg-[#10B981] text-[#04140E]'
                      : 'border-white/15 bg-white/5 text-white hover:border-white/35'
                  }`}
                >
                  {s.language} · {idx + 1}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setUseRelay((r) => !r)}
                className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition-colors cursor-pointer ${
                  useRelay
                    ? 'border-amber-400/60 bg-amber-400/15 text-amber-300'
                    : 'border-white/15 bg-white/5 text-white/80 hover:text-white'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>{useRelay ? 'Relay: ON' : 'Direct'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Live Channels Rail (English & Hindi) */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
              <Tv className="h-4 w-4" />
              <span>Live English &amp; Hindi</span>
            </h3>
            <span className="font-mono-num text-xs text-white/50">{alternateFeeds.length} live</span>
          </div>

          <div className="space-y-2">
            {alternateFeeds.map((item) => {
              const langs = (item.languages || ['English']).filter(
                (l) => l === 'English' || l === 'Hindi',
              );
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectMatch(item)}
                  className="group flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0A110E] p-2.5 text-left transition-colors hover:border-[#10B981]/70 hover:bg-[#101C18] cursor-pointer"
                >
                  <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-black">
                    <SportsArtwork src={item.banner} alt={item.title} sport={item.sport} />
                    <span className="absolute left-1 top-1 flex items-center gap-1 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-red-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                      LIVE
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-white group-hover:text-[#34D399]">
                      {item.title}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-white/55">{item.tournament}</p>
                    <p className="mt-0.5 font-mono-num text-[10px] font-semibold text-amber-300/95">
                      {item.sport === 'cricket' ? 'Cricket' : 'Football'} ·{' '}
                      {langs.length > 0 ? langs.join(' & ') : 'English'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
