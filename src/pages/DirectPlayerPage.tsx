import Hls from 'hls.js';
import { useEffect, useRef, useState } from 'react';

interface DirectPlayerPageProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  season: number;
  episode: number;
}

export default function DirectPlayerPage({
  tmdbId,
  mediaType,
  season,
  episode,
}: DirectPlayerPageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [streamUrl, setStreamUrl] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setErrorMsg('');

    const qs = new URLSearchParams({
      tmdbId: String(tmdbId),
      type: mediaType,
      season: String(season),
      episode: String(episode),
    });

    fetch(`/api/player/bingr?${qs.toString()}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.streamUrl) {
          throw new Error(data?.error || 'Direct stream unavailable for this title.');
        }
        return data.streamUrl as string;
      })
      .then((url) => {
        if (!cancelled) {
          setStreamUrl(url);
          setStatus('ready');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : 'Stream unavailable');
          setStatus('error');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [tmdbId, mediaType, season, episode]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) {
          setErrorMsg('Direct HLS playback failed. Try switching to CineSrc or VidFast above.');
          setStatus('error');
        }
      });
      return () => {
        hls.destroy();
      };
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.play().catch(() => {});
    }
  }, [streamUrl]);

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-black">
      {status === 'loading' && (
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--dx-accent)] border-t-transparent" />
          <p className="text-sm font-medium text-white/80">
            Resolving Direct HLS stream...
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="max-w-md px-6 text-center">
          <p className="font-display text-lg font-bold text-white">Direct Stream Unavailable</p>
          <p className="mt-2 text-sm text-white/75">{errorMsg}</p>
        </div>
      )}

      <video
        ref={videoRef}
        controls
        playsInline
        className={`h-full w-full ${status === 'ready' ? 'block' : 'hidden'}`}
      />
    </div>
  );
}
