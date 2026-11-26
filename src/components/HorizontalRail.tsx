import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import type { MediaSummary } from '../shared/types';
import { navigateTo } from '../lib/router';
import MediaCard from './MediaCard';

interface HorizontalRailProps {
  title: string;
  subtitle?: string;
  items: MediaSummary[];
  ranked?: boolean;
  viewAllHref?: string;
  onSelect: (item: MediaSummary) => void;
}

export default function HorizontalRail({
  title,
  subtitle,
  items,
  ranked = false,
  viewAllHref,
  onSelect,
}: HorizontalRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  const scrollByAmount = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = Math.max(360, el.clientWidth * 0.8);
    el.scrollBy({ left: dir === 'left' ? -distance : distance, behavior: 'smooth' });
  };

  return (
    <section className="py-5">
      <div className="mb-3.5 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-white sm:text-xl lg:text-2xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-purple-300/70">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              aria-label={`Scroll ${title} left`}
              onClick={() => scrollByAmount('left')}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-500/25 bg-[#120924] text-purple-200 transition-colors hover:border-purple-400 hover:bg-purple-600/30 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={`Scroll ${title} right`}
              onClick={() => scrollByAmount('right')}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-500/25 bg-[#120924] text-purple-200 transition-colors hover:border-purple-400 hover:bg-purple-600/30 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {viewAllHref && (
            <button
              type="button"
              onClick={() => navigateTo(viewAllHref)}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-purple-500/25 bg-[#120924] px-3 text-xs font-semibold text-purple-200 transition-colors hover:border-purple-400 hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Explore All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="no-scrollbar flex gap-3.5 sm:gap-4 overflow-x-auto pb-2 scroll-smooth"
      >
        {items.map((item, idx) => (
          <div
            key={`${item.mediaType}-${item.id}`}
            className={
              ranked
                ? 'w-[175px] sm:w-[210px] lg:w-[225px] shrink-0'
                : 'w-[145px] sm:w-[175px] lg:w-[195px] shrink-0'
            }
          >
            <MediaCard
              item={item}
              rank={ranked ? idx + 1 : undefined}
              onSelect={onSelect}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
