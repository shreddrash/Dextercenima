import { Check, ChevronDown, Play, Plus, ThumbsUp } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import { getActivePlatform } from '../lib/platform';
import { buildPlayUrl, navigateTo } from '../lib/router';
import { isFavorited, isLiked, subscribeVaultUpdates, toggleFavorite, toggleLike } from '../lib/vaultStorage';
import type { MediaSummary, StreamingPlatform } from '../shared/types';
import PosterArtwork from './PosterArtwork';

interface MediaCardProps {
  item: MediaSummary;
  rank?: number;
  variant?: 'landscape' | 'poster';
  platform?: StreamingPlatform;
  onSelect: (item: MediaSummary) => void;
}

export default function MediaCard({
  item,
  rank,
  variant = 'poster',
  platform: platformProp,
  onSelect,
}: MediaCardProps) {
  const platform = platformProp || getActivePlatform();
  const isPrime = platform === 'prime';
  const isCrunchy = platform === 'crunchyroll';

  const [saved, setSaved] = useState(() => isFavorited(item.mediaType, item.id));
  const [liked, setLiked] = useState(() => isLiked(item.mediaType, item.id));

  useEffect(() => {
    return subscribeVaultUpdates(() => {
      setSaved(isFavorited(item.mediaType, item.id));
      setLiked(isLiked(item.mediaType, item.id));
    });
  }, [item.mediaType, item.id]);

  const handleFavorite = (e: MouseEvent) => {
    e.stopPropagation();
    setSaved(toggleFavorite(item));
  };

  const handleLike = (e: MouseEvent) => {
    e.stopPropagation();
    setLiked(toggleLike(item.mediaType, item.id));
  };

  const handleQuickPlay = (e: MouseEvent) => {
    e.stopPropagation();
    navigateTo(
      buildPlayUrl({
        tmdbId: item.id,
        mediaType: item.mediaType,
        title: item.title,
        year: item.year,
        poster: item.poster,
        score: item.score,
      }),
    );
  };

  const matchPercent = Math.min(99, Math.max(82, Math.round(Number(item.score || 8) * 11)));
  const maturity =
    item.maturityRating || (item.isKids ? 'U/A 7+' : item.mediaType === 'tv' ? 'TV-MA' : 'U/A 16+');
  const durationLabel = item.seasons
    ? `${item.seasons} Season${item.seasons > 1 ? 's' : ''}`
    : item.runtime
      ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}m`
      : item.year;

  const renderBadge = (compact = false) => {
    if (isPrime) {
      return (
        <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-0.5 rounded bg-[#00A8E1] px-1.5 py-0.5 text-[9px] font-black text-white shadow">
          ✓ prime
        </span>
      );
    }
    if (isCrunchy) {
      return (
        <span className="absolute left-1.5 top-1.5 inline-flex items-center rounded-[2px] bg-[#F47521] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-black shadow">
          {compact ? 'CR' : 'SUB | DUB'}
        </span>
      );
    }
    return (
      <span className="absolute left-1.5 top-1.5 inline-flex h-4 w-3.5 items-center justify-center rounded-[1px] bg-[#E50914] font-display text-[10px] font-black text-white shadow">
        D
      </span>
    );
  };

  // Ranked Top-10 Poster Card
  if (typeof rank === 'number') {
    return (
      <article
        onClick={() => onSelect(item)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(item);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`#${rank} ${item.title}`}
        className="nf-card group relative flex cursor-pointer items-end pl-10 sm:pl-14 focus:outline-none"
      >
        <span
          aria-hidden="true"
          className="dx-rank-stroke pointer-events-none absolute -left-2 bottom-0 z-0 select-none text-[108px] sm:text-[138px] font-black leading-[0.82] tracking-tighter"
        >
          {rank}
        </span>

        <div
          className={`relative z-10 aspect-[2/3] w-full overflow-hidden rounded-[4px] bg-[var(--dx-surface-card)] shadow-lg transition-transform duration-200 group-hover:scale-[1.04] ${
            isPrime
              ? 'group-hover:ring-2 group-hover:ring-[#00A8E1]'
              : isCrunchy
                ? 'group-hover:ring-2 group-hover:ring-[#F47521]'
                : ''
          }`}
        >
          <PosterArtwork
            src={item.poster}
            alt={item.title}
            title={item.title}
            subtitle={item.year}
          />
          {renderBadge(true)}
        </div>
      </article>
    );
  }

  // Landscape 16:9 Row Card with Desktop Hover Preview Drawer
  if (variant === 'landscape') {
    return (
      <article
        onClick={() => onSelect(item)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(item);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Open ${item.title}`}
        className="nf-card group relative cursor-pointer focus:outline-none"
      >
        <div
          className={`relative overflow-hidden rounded-[4px] bg-[var(--dx-surface)] transition-all duration-200 group-hover:z-30 group-hover:scale-[1.12] group-hover:shadow-[0_18px_40px_rgba(0,0,0,0.92)] ${
            isPrime
              ? 'group-hover:ring-2 group-hover:ring-[#00A8E1]'
              : isCrunchy
                ? 'group-hover:ring-2 group-hover:ring-[#F47521]'
                : ''
          }`}
        >
          <div className="relative aspect-video w-full overflow-hidden bg-[#141414]">
            <PosterArtwork
              src={item.backdrop || item.poster}
              alt={item.title}
              title={item.title}
              variant="backdrop"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25"
            />
            {renderBadge()}

            {item.logo ? (
              <img
                src={item.logo}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="pointer-events-none absolute bottom-2 left-2.5 max-h-9 max-w-[68%] object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
              />
            ) : (
              <p className="pointer-events-none absolute bottom-2 left-2.5 right-2.5 truncate font-display text-xs sm:text-sm font-bold text-white drop-shadow">
                {item.title}
              </p>
            )}
          </div>

          <div className="hidden md:block max-h-0 overflow-hidden bg-[var(--dx-surface)] px-3 opacity-0 transition-all duration-200 group-hover:max-h-36 group-hover:py-2.5 group-hover:opacity-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleQuickPlay}
                  aria-label={`Play ${item.title}`}
                  className={`flex h-7 w-7 items-center justify-center rounded-full cursor-pointer ${
                    isPrime
                      ? 'bg-[#00A8E1] text-white hover:bg-[#1A98FF]'
                      : isCrunchy
                        ? 'bg-[#F47521] text-black hover:bg-[#FF8A34]'
                        : 'bg-white text-black hover:bg-neutral-200'
                  }`}
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                </button>
                <button
                  type="button"
                  onClick={handleFavorite}
                  aria-label={saved ? `Remove ${item.title} from list` : `Add ${item.title} to list`}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/50 bg-[#2a2a2a]/80 text-white hover:border-white cursor-pointer"
                >
                  {saved ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleLike}
                  aria-label={`Like ${item.title}`}
                  className={`flex h-7 w-7 items-center justify-center rounded-full border cursor-pointer ${
                    liked
                      ? 'border-white bg-white text-black'
                      : 'border-white/50 bg-[#2a2a2a]/80 text-white hover:border-white'
                  }`}
                >
                  <ThumbsUp className="h-3 w-3" />
                </button>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(item);
                }}
                aria-label={`More info on ${item.title}`}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/50 bg-[#2a2a2a]/80 text-white hover:border-white cursor-pointer"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
              {isPrime ? (
                <span className="font-bold text-[#00A8E1]">Included with Prime</span>
              ) : isCrunchy ? (
                <span className="font-bold text-[#F47521]">★ {item.score || '8.6'} Anime</span>
              ) : (
                <span className="font-bold text-[#46d369]">{matchPercent}% Match</span>
              )}
              <span className="border border-white/40 px-1 text-[9px] font-semibold text-white/90">
                {maturity}
              </span>
              <span className="text-[#bcbcbc]">{durationLabel}</span>
            </div>

            <p className="mt-1 truncate text-[10px] text-white/85">
              {item.genres.slice(0, 3).join(' • ')}
            </p>
          </div>
        </div>
      </article>
    );
  }

  // Standard 2:3 Grid Poster Card
  return (
    <article
      onClick={() => onSelect(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(item);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open ${item.title}`}
      className="nf-card group relative flex cursor-pointer flex-col focus:outline-none"
    >
      <div
        className={`relative aspect-[2/3] w-full overflow-hidden rounded-[4px] bg-[var(--dx-surface-card)] transition-transform duration-200 group-hover:scale-[1.04] group-hover:shadow-[0_14px_32px_rgba(0,0,0,0.85)] ${
          isPrime
            ? 'group-hover:ring-2 group-hover:ring-[#00A8E1]'
            : isCrunchy
              ? 'group-hover:ring-2 group-hover:ring-[#F47521]'
              : ''
        }`}
      >
        <PosterArtwork
          src={item.poster}
          alt={item.title}
          title={item.title}
          subtitle={item.year}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-70 group-hover:opacity-95"
        />

        {renderBadge(true)}

        <span
          className={`pointer-events-none absolute right-2 top-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-bold ${
            isPrime ? 'text-[#F5C518]' : isCrunchy ? 'text-[#F47521]' : 'text-[#46d369]'
          }`}
        >
          {isPrime || isCrunchy ? `★ ${item.score || '8.4'}` : `${matchPercent}%`}
        </span>

        {/* Hover Actions */}
        <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleQuickPlay}
              aria-label={`Play ${item.title}`}
              className={`flex h-8 w-8 items-center justify-center rounded-full cursor-pointer ${
                isPrime
                  ? 'bg-[#00A8E1] text-white hover:bg-[#1A98FF]'
                  : isCrunchy
                    ? 'bg-[#F47521] text-black hover:bg-[#FF8A34]'
                    : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              <Play className="h-3.5 w-3.5 fill-current" />
            </button>
            <button
              type="button"
              onClick={handleFavorite}
              aria-label={saved ? `Remove ${item.title} from list` : `Add ${item.title} to list`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-black/75 text-white hover:border-white cursor-pointer"
            >
              {saved ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            </button>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item);
            }}
            aria-label={`More info on ${item.title}`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-black/75 text-white hover:border-white cursor-pointer"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-1.5 px-0.5">
        <h3 className="truncate text-[13px] font-semibold text-white group-hover:text-[var(--dx-accent)]">
          {item.title}
        </h3>
        <div className="flex items-center gap-1.5 text-[11px] text-[#808080] truncate">
          <span>{item.year}</span>
          <span>·</span>
          <span>{item.mediaType === 'tv' ? 'Series' : 'Film'}</span>
          {item.genres[0] && (
            <>
              <span>·</span>
              <span className="truncate">{item.genres[0]}</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
