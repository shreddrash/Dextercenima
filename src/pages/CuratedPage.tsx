import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCuratedCategoryBySlug } from '../shared/curatedCategories';
import type { MediaSummary } from '../shared/types';
import { navigateTo } from '../lib/router';
import MediaCard from '../components/MediaCard';

interface CuratedPageProps {
  slug: string;
  onInspect: (item: MediaSummary) => void;
}

export default function CuratedPage({ slug, onInspect }: CuratedPageProps) {
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
      ...category.query,
    });

    fetch(`/api/tmdb/discover?${qs.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && Array.isArray(data?.list)) {
          setItems(data.list);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

  if (!category) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-16 text-center sm:px-8">
        <h1 className="font-display text-2xl font-bold text-white">Collection not found</h1>
        <button
          type="button"
          onClick={() => navigateTo('/')}
          className="mt-4 h-10 rounded-lg bg-purple-600 px-5 text-sm font-semibold text-white hover:bg-purple-500 cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 pt-24 pb-10 sm:px-6 lg:px-12">
      <button
        type="button"
        onClick={() => navigateTo('/')}
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-purple-300 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Dexterx Cenima</span>
      </button>

      <div className="border-b border-purple-500/20 pb-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {category.title}
        </h1>
        <p className="mt-1.5 text-sm text-purple-200/75">{category.subtitle}</p>
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] animate-pulse rounded-xl bg-[#120924]" />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
          {items.map((item, idx) => (
            <MediaCard
              key={`${item.mediaType}-${item.id}`}
              item={item}
              rank={slug.startsWith('top-rated') ? idx + 1 : undefined}
              onSelect={onInspect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
