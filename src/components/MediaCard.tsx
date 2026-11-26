import { Bookmark, ChevronDown, Play } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import type { MediaSummary } from '../shared/types';
import { buildPlayUrl, navigateTo } from '../lib/router';
import { isFavorited, toggleFavorite } from '../lib/vaultStorage';
import PosterArtwork from './PosterArtwork';

interface MediaCardProps {
  item: MediaSummary;
  rank?: number;
  onSelect: (item: MediaSummary) => void;
}

export default function MediaCard({ item, rank, onSelect }: MediaCardProps) {
  const [saved, setSaved] = useState(() => isFavorited(item.mediaType, item.id));

  const handleFavorite = (e: MouseEvent) => {
    e.stopPropagation();
    const nextState = toggleFavorite(item);
    setSaved(nextState);
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

  const primaryGenre = item.genres[0] || (item.mediaType === 'tv' ? 'Series' : 'Film');

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
      className={`group relative flex cursor-pointer flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-xl ${
        typeof rank === 'number' ? 'pl-8 sm:pl-11' : ''
      }`}
    >
      {/* Netflix 2026 Giant Outlined Top-10 Rank Number */}
      {typeof rank === 'number' && (
        <span
          aria-hidden="true"
          className="dx-rank-stroke pointer-events-none absolute -left-1 bottom-9 z-0 select-none text-[84px] sm:text-[106px] font-black leading-none tracking-tighter"
        >
          {rank}
        </span>
      )}

      <div className="dx-card-hover relative z-10 aspect-[2/3] w-full overflow-hidden rounded-xl border border-purple-500/20 bg-[#120924]">
        <PosterArtwork
          src={item.poster}
          alt={item.title}
          title={item.title}
          subtitle={item.year}
          className="transition-transform duration-300 group-hover:scale-105"
        />

        {/* Measured bottom contrast scrim */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05020b] via-[#05020b]/20 to-transparent opacity-80 transition-opacity group-hover:opacity-95"
        />

        {/* Quick hover actions (Netflix style) */}
        <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleQuickPlay}
              aria-label={`Play ${item.title}`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#05020b] shadow-lg transition-transform hover:scale-105"
            >
              <Play className="h-4 w-4 fill-current" />
            </button>
            <button
              type="button"
              onClick={handleFavorite}
              aria-label={saved ? `Remove ${item.title} from vault` : `Save ${item.title} to vault`}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                saved
                  ? 'border-purple-400 bg-purple-600 text-white'
                  : 'border-purple-300/40 bg-[#0d061a]/90 text-white hover:border-purple-300'
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item);
            }}
            aria-label={`More info on ${item.title}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-purple-300/40 bg-[#0d061a]/90 text-white hover:border-purple-300"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Top-right Rating */}
        <div className="pointer-events-none absolute right-2 top-2 rounded-md bg-[#05020b]/75 px-1.5 py-0.5 text-[11px] font-semibold text-purple-200 backdrop-blur-sm font-mono-num">
          ★ {item.score}
        </div>
      </div>

      {/* Unboxed metadata footer */}
      <div className="relative z-10 mt-2 px-0.5">
        <h3 className="truncate font-display text-sm font-semibold tracking-tight text-purple-50 transition-colors group-hover:text-purple-300">
          {item.title}
        </h3>
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-purple-300/75 truncate">
          <span className="font-mono-num">{item.year}</span>
          <span aria-hidden="true">·</span>
          <span>{item.mediaType === 'tv' ? 'Series' : 'Movie'}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{primaryGenre}</span>
        </div>
      </div>
    </article>
  );
}
