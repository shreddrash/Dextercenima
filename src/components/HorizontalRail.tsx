import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { getActivePlatform } from '../lib/platform';
import { navigateTo } from '../lib/router';
import type { MediaSummary, StreamingPlatform } from '../shared/types';
import MediaCard from './MediaCard';

interface HorizontalRailProps {
  title: string;
  items: MediaSummary[];
  ranked?: boolean;
  viewAllHref?: string;
  platform?: StreamingPlatform;
  onSelect: (item: MediaSummary) => void;
}

export default function HorizontalRail({
  title,
  items,
  ranked = false,
  viewAllHref,
  platform: platformProp,
  onSelect,
}: HorizontalRailProps) {
  const platform = platformProp || getActivePlatform();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pageIdx, setPageIdx] = useState(0);

  if (items.length === 0) return null;

  const pageCount = Math.max(1, Math.min(4, Math.ceil(items.length / 5)));

  const scrollByAmount = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = Math.max(360, el.clientWidth * 0.85);
    el.scrollBy({ left: dir === 'left' ? -distance : distance, behavior: 'smooth' });
    setPageIdx((prev) =>
      dir === 'left' ? Math.max(0, prev - 1) : Math.min(pageCount - 1, prev + 1),
    );
  };

  return (
    <section className="group/rail relative py-4 sm:py-5">
      <div className="mb-2.5 flex items-end justify-between gap-4">
        <div className="flex items-baseline gap-2.5 min-w-0">
          {platform === 'prime' && (
            <span className="hidden sm:inline font-display text-sm font-black text-[#00A8E1]">
              Prime
            </span>
          )}
          <h2
            onClick={() => viewAllHref && navigateTo(viewAllHref)}
            className={`font-display text-base sm:text-xl font-bold tracking-tight text-[#e5e5e5] transition-colors group-hover/rail:text-white ${
              viewAllHref ? 'cursor-pointer' : ''
            }`}
          >
            {title}
          </h2>
          {viewAllHref && (
            <button
              type="button"
              onClick={() => navigateTo(viewAllHref)}
              className="hidden sm:inline-flex items-center gap-0.5 text-xs font-semibold text-[var(--dx-accent)] opacity-0 transition-opacity duration-200 group-hover/rail:opacity-100 cursor-pointer whitespace-nowrap"
            >
              <span>Explore All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {pageCount > 1 && (
          <div className="hidden md:flex items-center gap-1 opacity-0 transition-opacity group-hover/rail:opacity-100">
            {Array.from({ length: pageCount }).map((_, idx) => (
              <span
                key={idx}
                className={`h-[2px] w-3.5 transition-colors ${
                  idx === pageIdx ? 'bg-[var(--dx-accent)]' : 'bg-[#4d4d4d]'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          aria-label={`Scroll ${title} left`}
          onClick={() => scrollByAmount('left')}
          className="hidden md:flex absolute left-0 top-0 bottom-2 z-20 w-10 items-center justify-center bg-black/55 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover/rail:opacity-100 cursor-pointer rounded-r-[4px]"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>

        <div
          ref={scrollRef}
          className="no-scrollbar flex gap-2 sm:gap-2.5 overflow-x-auto pb-2 scroll-smooth"
        >
          {items.map((item, idx) => (
            <div
              key={`${item.mediaType}-${item.id}`}
              className={
                ranked
                  ? 'w-[185px] sm:w-[215px] lg:w-[240px] shrink-0'
                  : 'w-[210px] sm:w-[245px] lg:w-[270px] shrink-0'
              }
            >
              <MediaCard
                item={item}
                rank={ranked ? idx + 1 : undefined}
                variant={ranked ? 'poster' : 'landscape'}
                platform={platform}
                onSelect={onSelect}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label={`Scroll ${title} right`}
          onClick={() => scrollByAmount('right')}
          className="hidden md:flex absolute right-0 top-0 bottom-2 z-20 w-10 items-center justify-center bg-black/55 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover/rail:opacity-100 cursor-pointer rounded-l-[4px]"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>
    </section>
  );
}
