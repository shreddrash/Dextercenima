import Hls from 'hls.js';
import {
  Globe2,
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
import type { WorldChannel } from '../shared/types';

interface WorldChannelPlayerProps {
  channel: WorldChannel | null;
  channels: WorldChannel[];
  onClose: () => void;
  onSelectChannel: (channel: WorldChannel) => void;
}

export default function WorldChannelPlayer({
  channel,
  channels,
  onClose,
  onSelectChannel,
}: WorldChannelPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [useRelay, setUseRelay] = useState(false);
  const [reloadNonce, setReloadNonce] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.9);

  useEffect(() => {
    setUseRelay(false);
    setReloadNonce(0);
    setStatus('loading');
  }, [channel?.id]);

  useEffect(() => {
    if (!channel) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [channel, onClose]);

  const upNext = useMemo(() => {
    if (!channel) return [];
    const sameRegion = channels.filter((c) => c.id !== channel.id && c.region === channel.region);
    const others = channels.filter((c) => c.id !== channel.id && c.region !== channel.region);
    return [...sameRegion, ...others].slice(0, 10);
  }, [channels, channel]);

  useEffect(() => {
    if (!channel) return;
    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setStatus('loading');
    const sourceUrl = useRelay
      ? `/api/sports/hls-proxy?url=${encodeURIComponent(channel.url)}`
      : channel.url;

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
        setStatus('ready');
        video.volume = volume;
        video.muted = isMuted;
        video
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;
        if (!useRelay) {
          setUseRelay(true);
        } else {
          setStatus('error');
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
        setStatus('ready');
        video.play().catch(() => {});
      };
      const onErr = () => {
        if (!useRelay) setUseRelay(true);
        else setStatus('error');
      };
      video.addEventListener('loadedmetadata', onLoaded);
      video.addEventListener('error', onErr);
      return () => {
        video.removeEventListener('loadedmetadata', onLoaded);
        video.removeEventListener('error', onErr);
      };
    }

    setStatus('error');
  }, [channel, useRelay, reloadNonce]);

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

  if (!channel) return null;

  return (
    <div
      className="fixed inset-0 z-[92] flex flex-col overflow-y-auto bg-[#06050B]/97 backdrop-blur-xl text-white"
      role="dialog"
      aria-modal="true"
      aria-label={`${channel.name} Live Player`}
    >
      {/* Top Broadcast Bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/10 bg-[#090712]/95 px-4 py-3 sm:px-8">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-violet-400/30 bg-[#151126] p-1">
            {channel.logo ? (
              <img
                src={channel.logo}
                alt={channel.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-contain"
              />
            ) : (
              <Tv className="h-5 w-5 text-violet-400" />
            )}
          </div>

          <div className="min-w-0">
            <h2 className="truncate font-display text-sm sm:text-lg font-extrabold text-white">
              {channel.name}
            </h2>
            <p className="truncate text-[11px] font-mono-num text-violet-300/80">
              LIVE WORLD TV · {channel.country} · {channel.quality}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close channel player"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition-colors hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/20 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Player + Quick Channel Zap Rail */}
      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-5 px-4 py-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          <div
            ref={stageRef}
            className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-black shadow-[0_24px_80px_rgba(0,0,0,0.92)]"
          >
            <div className="aspect-video w-full bg-black relative">
              <video
                ref={videoRef}
                playsInline
                onClick={togglePlay}
                className="h-full w-full object-contain cursor-pointer"
              />

              {status === 'loading' && (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#8B5CF6] border-t-transparent" />
                  <p className="text-sm font-medium text-violet-100/85">
                    {useRelay
                      ? 'Tuning via Dexterx World Relay...'
                      : `Connecting to ${channel.name}...`}
                  </p>
                </div>
              )}

              {status === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-6 text-center">
                  <Radio className="h-9 w-9 text-violet-400" />
                  <p className="mt-3 font-display text-lg font-bold text-white">
                    Channel Stream Offline in This Region
                  </p>
                  <p className="mt-1.5 max-w-md text-xs sm:text-sm text-white/65">
                    This international feed may be geo-restricted or temporarily offline. Retry relay or pick another channel on the right.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setUseRelay((r) => !r);
                        setReloadNonce((n) => n + 1);
                      }}
                      className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#8B5CF6] px-4 text-xs font-bold text-white cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Retry Stream
                    </button>
                    {upNext.slice(0, 2).map((alt) => (
                      <button
                        key={alt.id}
                        type="button"
                        onClick={() => onSelectChannel(alt)}
                        className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 text-xs font-bold text-white hover:border-[#8B5CF6] cursor-pointer"
                      >
                        <Tv className="h-3.5 w-3.5 text-violet-300" />
                        <span className="max-w-[140px] truncate">{alt.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Player Control Deck */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#0E0B1A] px-4 py-2.5">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B5CF6] text-white hover:bg-[#A78BFA] cursor-pointer"
                >
                  {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                </button>

                <button
                  type="button"
                  onClick={() => skipBy(-10)}
                  aria-label="Rewind 10 seconds"
                  className="flex h-10 items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-3 text-xs font-semibold text-white hover:border-[#8B5CF6] cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>10s</span>
                </button>

                <button
                  type="button"
                  onClick={() => skipBy(10)}
                  aria-label="Forward 10 seconds"
                  className="flex h-10 items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-3 text-xs font-semibold text-white hover:border-[#8B5CF6] cursor-pointer"
                >
                  <span>10s</span>
                  <RotateCw className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={jumpToLiveEdge}
                  className="hidden sm:inline-flex h-10 items-center gap-1.5 rounded-xl border border-amber-400/40 bg-amber-400/15 px-3 text-xs font-bold text-amber-300 hover:bg-amber-400/25 cursor-pointer"
                >
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>LIVE</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUseRelay((r) => !r)}
                  className={`hidden sm:inline-flex h-10 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold cursor-pointer ${
                    useRelay
                      ? 'border-amber-400/60 bg-amber-400/15 text-amber-300'
                      : 'border-white/15 bg-white/5 text-white/80 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{useRelay ? 'Relay: ON' : 'Direct'}</span>
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white hover:border-white cursor-pointer"
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
                  className="hidden sm:block w-20 accent-[#8B5CF6] cursor-pointer"
                />

                <button
                  type="button"
                  onClick={handleFullscreen}
                  aria-label="Fullscreen"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white hover:border-[#8B5CF6] cursor-pointer"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#100D1B] p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#A78BFA]">
                Live World Channel Broadcast
              </p>
              <h3 className="mt-0.5 font-display text-base sm:text-lg font-extrabold text-white">
                {channel.name}
              </h3>
              <p className="mt-0.5 font-mono-num text-xs text-white/55">
                {channel.region} · {channel.country} · {channel.quality}
              </p>
            </div>
          </div>
        </div>

        {/* Right Quick-Zap Channels Rail */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-violet-300 flex items-center gap-2">
              <Globe2 className="h-4 w-4" />
              <span>Zap World Channels</span>
            </h3>
            <span className="font-mono-num text-xs text-white/50">{upNext.length} ready</span>
          </div>

          <div className="space-y-2">
            {upNext.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectChannel(item)}
                className="group flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#100D1B] p-2.5 text-left transition-colors hover:border-[#8B5CF6]/70 hover:bg-[#19142B] cursor-pointer"
              >
                <div className="flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#07060C] p-1">
                  {item.logo ? (
                    <img
                      src={item.logo}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Tv className="h-5 w-5 text-violet-400/70" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-white group-hover:text-violet-300">
                    {item.name}
                  </p>
                  <p className="mt-0.5 font-mono-num text-[10px] text-white/55">
                    {item.country} · {item.quality}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
