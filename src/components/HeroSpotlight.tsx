import {
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  Play,
  Plus,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { buildPlayUrl, navigateTo } from '../lib/router';
import { isFavorited, subscribeVaultUpdates, toggleFavorite } from '../lib/vaultStorage';
import type { MediaSummary, StreamingPlatform } from '../shared/types';
import PosterArtwork from './PosterArtwork';

interface HeroSpotlightProps {
  items: MediaSummary[];
  platform: StreamingPlatform;
  isKidsMode?: boolean;
  onInspect: (item: MediaSummary) => void;
}

export default function HeroSpotlight({
  items,
  platform,
  isKidsMode = false,
  onInspect,
}: HeroSpotlightProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [, setTick] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [platform, isKidsMode, items.length]);

  useEffect(() => {
    return subscribeVaultUpdates(() => setTick((t) => t + 1));
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 9000);
    return () => window.clearInterval(id);
  }, [items.length]);

  if (items.length === 0) {
    return (
      <section className="relative h-[520px] md:h-[85vh] w-full overflow-hidden bg-[var(--dx-bg)]">
        <div className="flex h-full w-full items-center px-6 lg:px-12">
          <div className="h-12 w-80 animate-pulse rounded bg-white/10" />
        </div>
      </section>
    );
  }

  const current = items[activeIndex % items.length];
  const saved = isFavorited(current.mediaType, current.id);
  const rankNumber = (activeIndex % items.length) + 1;
  const isPrime = platform === 'prime';
  const isCrunchy = platform === 'crunchyroll';

  const maturity =
    current.maturityRating ||
    (isKidsMode || current.isKids ? 'U/A 7+' : current.mediaType === 'tv' ? 'TV-MA' : 'U/A 16+');

  const handlePlay = () =>
    navigateTo(
      buildPlayUrl({
        tmdbId: current.id,
        mediaType: current.mediaType,
        title: current.title,
        year: current.year,
        poster: current.poster,
        score: current.score,
      }),
    );

  return (
    <section className="relative w-full overflow-hidden bg-[var(--dx-bg)]">
      {/* ================= DESKTOP PLATFORM-NATIVE HERO BILLBOARD ================= */}
      <div className="relative hidden md:block h-[85vh] min-h-[600px] max-h-[900px] w-full overflow-hidden">
        <PosterArtwork
          src={current.backdrop || current.poster}
          alt={current.title}
          title={current.title}
          variant="backdrop"
          className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700"
        />

        {/* Platform-Native Left Vignette + Bottom Fade Into --dx-bg */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 ${
            isPrime
              ? 'bg-[linear-gradient(77deg,rgba(0,5,13,0.9)_0%,rgba(0,12,28,0.48)_46%,transparent_85%)]'
              : isCrunchy
                ? 'bg-[linear-gradient(77deg,rgba(10,9,8,0.9)_0%,rgba(20,12,8,0.48)_46%,transparent_85%)]'
                : 'bg-[linear-gradient(77deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.35)_45%,transparent_85%)]'
          }`}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-60"
          style={{
            background:
              'linear-gradient(to top, var(--dx-bg) 5%, color-mix(in srgb, var(--dx-bg) 70%, transparent) 55%, transparent 100%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/75 to-transparent"
        />

        {/* Hero Left Information Stack */}
        <div className="relative z-10 flex h-full w-full flex-col justify-end px-6 pb-36 lg:px-12">
          <div className="max-w-xl">
            {/* Platform Kicker Tag */}
            {isPrime ? (
              <div className="mb-3 flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1 rounded bg-[#00A8E1] px-2 py-0.5 text-[11px] font-black tracking-wide text-white shadow">
                  ✓ prime
                </span>
                <span className="text-xs font-bold tracking-wide text-sky-300">
                  Included with Prime
                </span>
                <span className="rounded bg-[#F5C518] px-1.5 py-0.5 text-[10px] font-black text-black">
                  IMDb {current.score || '8.4'}
                </span>
              </div>
            ) : isCrunchy ? (
              <div className="mb-3 flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1 bg-[#F47521] px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-black">
                  SIMULCAST ANIME
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-200">
                  Sub | Dub · {current.mediaType === 'tv' ? 'Series' : 'Movie'}
                </span>
              </div>
            ) : (
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex h-6 w-5 items-center justify-center rounded-[2px] bg-[#E50914] font-display text-sm font-black text-white shadow">
                  D
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#e5e5e5]">
                  {isKidsMode ? 'KIDS' : current.mediaType === 'tv' ? 'SERIES' : 'FILM'}
                </span>
              </div>
            )}

            {/* Transparent Title Artwork Logo or Bold Title */}
            {current.logo ? (
              <div className="mb-4 max-w-md">
                <img
                  src={current.logo}
                  alt={current.title}
                  referrerPolicy="no-referrer"
                  className="max-h-28 w-auto object-contain drop-shadow-[0_10px_28px_rgba(0,0,0,0.85)] lg:max-h-36"
                />
              </div>
            ) : (
              <h1 className="font-display text-5xl font-black tracking-tight text-white lg:text-6xl text-balance drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
                {current.title}
              </h1>
            )}

            {/* Rank / Genre Strip */}
            {isPrime ? (
              <div className="mb-3 flex flex-wrap items-center gap-2.5 text-xs font-semibold text-sky-100">
                <span className="text-[#00A8E1] font-extrabold">
                  #{rankNumber} Trending on Prime Video
                </span>
                <span>·</span>
                <span>{current.year}</span>
                <span>·</span>
                <span>{current.genres.slice(0, 3).join(' · ')}</span>
              </div>
            ) : isCrunchy ? (
              <div className="mb-3 flex flex-wrap items-center gap-2.5 text-xs font-semibold text-orange-100">
                <span className="text-[#F47521] font-extrabold">
                  #{rankNumber} Top Anime Today
                </span>
                <span>·</span>
                <span>★ {current.score || '8.6'}</span>
                <span>·</span>
                <span>{current.genres.slice(0, 3).join(' · ')}</span>
              </div>
            ) : (
              <div className="mb-3 flex items-center gap-2.5">
                <span className="inline-flex flex-col items-center justify-center rounded-[3px] bg-[#E50914] px-1.5 py-0.5 leading-none text-white">
                  <span className="text-[8px] font-black tracking-wider">TOP</span>
                  <span className="text-[11px] font-black">10</span>
                </span>
                <span className="font-display text-base font-bold text-white drop-shadow">
                  #{rankNumber} in {isKidsMode ? 'Kids' : 'Movies & Shows'} Today
                </span>
              </div>
            )}

            <p className="line-clamp-3 max-w-lg text-[15px] leading-snug text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {current.overview}
            </p>

            {/* Primary CTA + Info + Save */}
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={handlePlay}
                className={`inline-flex h-11 items-center gap-2.5 px-7 text-base font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isPrime
                    ? 'rounded-lg bg-[#00A8E1] text-white hover:bg-[#1A98FF] shadow-[0_6px_24px_rgba(0,168,225,0.4)]'
                    : isCrunchy
                      ? 'rounded-[2px] bg-[#F47521] text-black hover:bg-[#FF8A34] uppercase tracking-wider text-sm font-black shadow-[0_6px_24px_rgba(244,117,33,0.4)]'
                      : 'rounded-[4px] bg-white text-black hover:bg-white/80'
                }`}
              >
                <Play className="h-5 w-5 fill-current" />
                <span>{isCrunchy ? 'Start Watching' : isPrime ? 'Watch with Prime' : 'Play'}</span>
              </button>

              <button
                type="button"
                onClick={() => onInspect(current)}
                className={`inline-flex h-11 items-center gap-2.5 px-6 text-base font-semibold text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isPrime
                    ? 'rounded-lg bg-[#16212C]/85 border border-white/20 hover:bg-[#1D2B39]'
                    : isCrunchy
                      ? 'rounded-[2px] border border-[#F47521]/70 bg-black/55 text-[#F47521] hover:bg-[#F47521]/15'
                      : 'rounded-[4px] bg-[#6d6d6e]/75 hover:bg-[#6d6d6e]/50'
                }`}
              >
                <Info className="h-5 w-5" />
                <span>{isPrime ? 'Details' : 'More Info'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleFavorite(current);
                  setTick((t) => t + 1);
                }}
                aria-label={saved ? 'Remove from Watchlist' : 'Add to Watchlist'}
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors cursor-pointer ${
                  saved
                    ? 'border-[var(--dx-accent)] bg-[var(--dx-accent)] text-white'
                    : 'border-white/60 bg-black/45 text-white hover:border-white'
                }`}
              >
                {saved ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom-Right Controls + Maturity */}
        <div className="absolute bottom-36 right-0 z-20 flex items-center gap-3">
          {items.length > 1 && (
            <div className="hidden xl:flex items-center gap-1.5 mr-2">
              <button
                type="button"
                aria-label="Previous hero"
                onClick={() => setActiveIndex((prev) => (prev - 1 + items.length) % items.length)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-black/45 text-white hover:border-white cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next hero"
                onClick={() => setActiveIndex((prev) => (prev + 1) % items.length)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-black/45 text-white hover:border-white cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          <button
            type="button"
            aria-label={muted ? 'Unmute preview audio' : 'Mute preview audio'}
            onClick={() => setMuted((m) => !m)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-black/40 text-white hover:bg-white/15 cursor-pointer"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <div className="border-l-[3px] border-[var(--dx-accent)] bg-black/55 py-1.5 pl-3 pr-8 text-sm font-semibold text-white">
            {maturity}
          </div>
        </div>
      </div>

      {/* ================= MOBILE VERTICAL SHOWCASE CARD ================= */}
      <div className="px-4 pt-20 pb-3 md:hidden">
        <div className="relative aspect-[3/4] max-h-[500px] w-full overflow-hidden rounded-xl border border-white/20 bg-[var(--dx-surface)] shadow-2xl">
          <PosterArtwork
            src={current.poster || current.backdrop}
            alt={current.title}
            title={current.title}
            variant="backdrop"
            className="h-full w-full object-cover"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"
          />

          {isPrime && (
            <span className="absolute left-3 top-3 rounded bg-[#00A8E1] px-2 py-0.5 text-[10px] font-black text-white shadow">
              ✓ prime
            </span>
          )}
          {isCrunchy && (
            <span className="absolute left-3 top-3 rounded-[2px] bg-[#F47521] px-2 py-0.5 text-[10px] font-black uppercase text-black shadow">
              ANIME
            </span>
          )}

          {items.length > 1 && (
            <div className="absolute right-3 top-3 flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous featured"
                onClick={() => setActiveIndex((prev) => (prev - 1 + items.length) % items.length)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next featured"
                onClick={() => setActiveIndex((prev) => (prev + 1) % items.length)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center p-4 text-center">
            {current.logo ? (
              <img
                src={current.logo}
                alt={current.title}
                referrerPolicy="no-referrer"
                className="mb-2 max-h-16 w-auto object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.9)]"
              />
            ) : (
              <h1 className="font-display text-2xl font-black tracking-tight text-white">
                {current.title}
              </h1>
            )}

            <p className="mb-3 text-xs font-medium text-[#e5e5e5]">
              {current.genres.slice(0, 3).join(' · ')}
            </p>

            <div className="grid w-full grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handlePlay}
                className={`flex h-10 items-center justify-center gap-2 rounded-[4px] text-sm font-bold ${
                  isPrime
                    ? 'bg-[#00A8E1] text-white'
                    : isCrunchy
                      ? 'bg-[#F47521] text-black'
                      : 'bg-white text-black'
                }`}
              >
                <Play className="h-4 w-4 fill-current" />
                <span>{isCrunchy ? 'Watch' : 'Play'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleFavorite(current);
                  setTick((t) => t + 1);
                }}
                className="flex h-10 items-center justify-center gap-2 rounded-[4px] bg-[#333333]/90 text-sm font-semibold text-white"
              >
                {saved ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                <span>{isCrunchy ? 'Watchlist' : isPrime ? 'My Stuff' : 'My List'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
