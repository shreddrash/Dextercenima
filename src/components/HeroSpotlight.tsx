import { Check, ChevronLeft, ChevronRight, Info, Play, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { MediaSummary } from '../shared/types';
import { buildPlayUrl, navigateTo } from '../lib/router';
import { isFavorited, subscribeVaultUpdates, toggleFavorite } from '../lib/vaultStorage';
import { DEXTERX_LOGO_URL } from './Navbar';
import PosterArtwork from './PosterArtwork';

interface HeroSpotlightProps {
  items: MediaSummary[];
  onInspect: (item: MediaSummary) => void;
}

export default function HeroSpotlight({ items, onInspect }: HeroSpotlightProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [, setTick] = useState(0);

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
      <section className="relative h-[520px] md:h-[78vh] w-full overflow-hidden bg-[#080312]">
        <div className="flex h-full w-full items-center px-6 lg:px-12">
          <div className="h-10 w-72 animate-pulse rounded bg-purple-900/40" />
        </div>
      </section>
    );
  }

  const current = items[activeIndex % items.length];
  const saved = isFavorited(current.mediaType, current.id);

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
    <section className="relative w-full overflow-hidden bg-[#05020b]">
      {/* ================= PC FULL-BLEED NETFLIX 2026 BILLBOARD ================= */}
      <div className="relative hidden md:block h-[82vh] min-h-[580px] max-h-[840px] w-full overflow-hidden">
        <PosterArtwork
          src={current.backdrop || current.poster}
          alt={current.title}
          title={current.title}
          variant="backdrop"
          className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700"
        />

        {/* Netflix 2026 Multi-Directional Obsidian-Violet Gradient Scrims */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#05020b] via-[#05020b]/70 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05020b] via-[#05020b]/20 to-[#05020b]/45"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(147,51,234,0.22),transparent_55%)]"
        />

        {/* Billboard Overlay */}
        <div className="relative z-10 flex h-full w-full flex-col justify-end px-6 pb-32 lg:px-12">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2.5">
              <img
                src={DEXTERX_LOGO_URL}
                alt="Dexterx Cenima"
                referrerPolicy="no-referrer"
                className="h-7 w-7 rounded border border-purple-400/50 object-cover"
              />
              <span className="text-xs font-bold tracking-[0.22em] uppercase text-purple-300">
                Dexterx Cenima Original Vault
              </span>
            </div>

            {current.logo ? (
              <div className="mb-4 max-w-lg">
                <img
                  src={current.logo}
                  alt={current.title}
                  referrerPolicy="no-referrer"
                  className="max-h-28 w-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] lg:max-h-32"
                />
              </div>
            ) : (
              <h1 className="font-display text-5xl font-extrabold tracking-tight text-white lg:text-6xl text-balance drop-shadow-lg">
                {current.title}
              </h1>
            )}

            <div className="mb-3 flex flex-wrap items-center gap-2.5 text-sm font-medium text-purple-100/90">
              <span className="font-mono-num font-bold text-purple-300">★ {current.score}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num">{current.year}</span>
              {current.runtime ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">{current.runtime}m</span>
                </>
              ) : null}
              {current.genres.length > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{current.genres.slice(0, 3).join(' · ')}</span>
                </>
              )}
            </div>

            <p className="line-clamp-3 max-w-xl text-base leading-relaxed text-purple-50/85 drop-shadow">
              {current.overview}
            </p>

            {/* Netflix 2026 Action Buttons */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={handlePlay}
                className="inline-flex h-12 items-center gap-2.5 rounded-lg bg-white px-7 text-base font-bold text-[#05020b] shadow-[0_0_32px_rgba(192,132,252,0.45)] transition-transform hover:scale-[1.02] hover:bg-purple-100 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Play className="h-5 w-5 fill-current" />
                <span>Play</span>
              </button>

              <button
                type="button"
                onClick={() => onInspect(current)}
                className="inline-flex h-12 items-center gap-2.5 rounded-lg border border-purple-400/35 bg-[#1b0e36]/80 px-6 text-base font-semibold text-white backdrop-blur-md transition-colors hover:bg-purple-700/70 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Info className="h-5 w-5" />
                <span>More Info</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleFavorite(current);
                  setTick((t) => t + 1);
                }}
                aria-label={saved ? 'Remove from My Vault' : 'Add to My Vault'}
                className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors cursor-pointer ${
                  saved
                    ? 'border-purple-400 bg-purple-600 text-white'
                    : 'border-purple-300/40 bg-[#0d061a]/75 text-white hover:border-purple-300'
                }`}
              >
                {saved ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Carousel Chevrons & Slide Indicators */}
        {items.length > 1 && (
          <div className="absolute bottom-32 right-6 lg:right-12 z-20 flex items-center gap-3">
            <div className="flex items-center gap-1.5 mr-2">
              {items.map((item, idx) => (
                <button
                  key={`${item.mediaType}-${item.id}`}
                  type="button"
                  aria-label={`Select ${item.title}`}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1 rounded-full transition-all cursor-pointer ${
                    idx === activeIndex % items.length
                      ? 'w-8 bg-purple-400'
                      : 'w-3 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Previous hero slide"
              onClick={() => setActiveIndex((prev) => (prev - 1 + items.length) % items.length)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-400/35 bg-[#0d061a]/80 text-white hover:bg-purple-600/70 cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next hero slide"
              onClick={() => setActiveIndex((prev) => (prev + 1) % items.length)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-400/35 bg-[#0d061a]/80 text-white hover:bg-purple-600/70 cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* ================= PHONE DIFFERENT LOOK: VERTICAL NETFLIX-2026 SHOWCASE CARD ================= */}
      <div className="px-4 pt-20 pb-4 md:hidden">
        <div className="relative aspect-[3/4] max-h-[500px] w-full overflow-hidden rounded-3xl border border-purple-400/35 bg-[#120924] shadow-[0_24px_55px_-12px_rgba(147,51,234,0.5)]">
          <PosterArtwork
            src={current.poster || current.backdrop}
            alt={current.title}
            title={current.title}
            variant="backdrop"
            className="h-full w-full object-cover"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05020b] via-[#05020b]/35 to-transparent"
          />

          {/* Top Floating Prev/Next on Phone */}
          {items.length > 1 && (
            <div className="absolute right-3 top-3 flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous featured"
                onClick={() => setActiveIndex((prev) => (prev - 1 + items.length) % items.length)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-md"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next featured"
                onClick={() => setActiveIndex((prev) => (prev + 1) % items.length)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-md"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Centered Bottom Content */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center p-5 text-center">
            {current.logo ? (
              <img
                src={current.logo}
                alt={current.title}
                referrerPolicy="no-referrer"
                className="mb-2 max-h-16 w-auto object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.9)]"
              />
            ) : (
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-white">
                {current.title}
              </h1>
            )}

            <p className="mb-4 text-xs font-medium text-purple-200/90">
              ★ {current.score} · {current.year} · {current.genres.slice(0, 2).join(' · ')}
            </p>

            <div className="grid w-full grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handlePlay}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-[#05020b]"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Play</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleFavorite(current);
                  setTick((t) => t + 1);
                }}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-purple-400/40 bg-[#180b30]/90 text-sm font-semibold text-white backdrop-blur-md"
              >
                {saved ? <Check className="h-4 w-4 text-purple-300" /> : <Plus className="h-4 w-4" />}
                <span>{saved ? 'In Vault' : 'My List'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
