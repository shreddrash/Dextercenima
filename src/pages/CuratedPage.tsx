import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import MediaCard from '../components/MediaCard';
import { fetchDiscoverTitles } from '../lib/api';
import { PLATFORM_THEMES } from '../lib/platform';
import { navigateTo } from '../lib/router';
import { getCuratedCategoryBySlug } from '../shared/curatedCategories';
import type { MediaSummary, StreamingPlatform, UserProfile } from '../shared/types';
import { isAllowedOnPlatform } from '../shared/vaultCatalog';

interface CuratedPageProps {
  slug: string;
  platform: StreamingPlatform;
  activeProfile: UserProfile;
  onInspect: (item: MediaSummary) => void;
}

export default function CuratedPage({
  slug,
  platform,
  activeProfile,
  onInspect,
}: CuratedPageProps) {
  const isKids = platform === 'netflix' && activeProfile.isKids;
  const theme = PLATFORM_THEMES[platform];
  const category = getCuratedCategoryBySlug(slug);
  const [items, setItems] = useState<MediaSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const qs = new URLSearchParams({
      media: category.mediaType,
      curatedSlug: category.slug,
      platform,
      ...(isKids ? { kids: '1' } : {}),
      ...category.query,
    });

    fetchDiscoverTitles(qs, isKids, platform)
      .then((data) => {
        if (!cancelled) {
          setItems(data.list.filter((i) => isAllowedOnPlatform(i, platform, isKids)));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category, isKids, platform]);

  if (!category) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 pt-28 pb-16 text-center sm:px-8">
        <h1 className="font-display text-2xl font-bold text-white">Collection not found</h1>
        <button
          type="button"
          onClick={() => navigateTo('/')}
          className="mt-4 h-10 rounded-[4px] bg-[var(--dx-accent)] px-5 text-sm font-bold text-white hover:bg-[var(--dx-accent-hover)] cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 pt-24 pb-10 sm:px-6 lg:px-12 bg-[var(--dx-bg)]">
      <button
        type="button"
        onClick={() => navigateTo('/')}
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to {theme.name}</span>
      </button>

      <div className="border-b border-white/10 pb-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {category.title}
        </h1>
        <p className="mt-1.5 text-sm text-[#b3b3b3]">{category.subtitle}</p>
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] animate-pulse rounded-[4px] bg-[var(--dx-surface-card)]"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-[4px] border border-white/10 bg-[var(--dx-surface)] p-10 text-center">
          <p className="font-display text-lg font-bold text-white">
            Filtered out in current mode
          </p>
          <p className="mt-1.5 text-sm text-[#b3b3b3]">
            This collection contains titles outside your active {theme.name} catalog filter.
          </p>
          <button
            type="button"
            onClick={() => navigateTo(isKids ? '/discover?type=kids' : '/discover?type=all')}
            className="mt-4 h-10 rounded-[4px] bg-[var(--dx-accent)] px-5 text-sm font-bold text-white cursor-pointer"
          >
            Browse Titles
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
          {items.map((item, idx) => (
            <MediaCard
              key={`${item.mediaType}-${item.id}`}
              item={item}
              rank={slug.startsWith('top-rated') || slug.includes('top-') ? idx + 1 : undefined}
              variant="poster"
              platform={platform}
              onSelect={onInspect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
