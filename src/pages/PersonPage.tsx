import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import MediaCard from '../components/MediaCard';
import { fetchPersonDetail } from '../lib/api';
import { navigateTo } from '../lib/router';
import type { MediaSummary, PersonResult, StreamingPlatform } from '../shared/types';
import { isAllowedOnPlatform } from '../shared/vaultCatalog';

interface PersonPageProps {
  personId: number;
  platform: StreamingPlatform;
  onInspect: (item: MediaSummary) => void;
}

export default function PersonPage({ personId, platform, onInspect }: PersonPageProps) {
  const [person, setPerson] = useState<PersonResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPersonDetail(personId)
      .then((data) => {
        if (!cancelled && data) {
          setPerson(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [personId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 pt-28 pb-12 sm:px-8">
        <div className="h-40 animate-pulse rounded-[4px] bg-[var(--dx-surface-card)]" />
      </div>
    );
  }

  if (!person) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 pt-28 pb-16 text-center sm:px-8">
        <h1 className="font-display text-2xl font-bold text-white">Creator profile not found</h1>
        <button
          type="button"
          onClick={() => navigateTo('/search')}
          className="mt-4 h-10 rounded-[4px] bg-[var(--dx-accent)] px-5 text-sm font-bold text-white hover:bg-[var(--dx-accent-hover)] cursor-pointer"
        >
          Search Titles
        </button>
      </div>
    );
  }

  const safeCredits = (person.credits || []).filter((c) =>
    isAllowedOnPlatform(c, platform, false),
  );

  return (
    <div className="w-full px-4 pt-24 pb-10 sm:px-6 lg:px-12 bg-[var(--dx-bg)]">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      <div className="rounded-[4px] border border-white/10 bg-[var(--dx-surface)] p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {person.profile ? (
            <img
              src={person.profile}
              alt={person.name}
              referrerPolicy="no-referrer"
              className="h-28 w-28 shrink-0 rounded-md border border-white/15 object-cover"
            />
          ) : (
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-md border border-white/15 bg-[var(--dx-surface-elevated)] font-display text-4xl font-extrabold text-white">
              {person.name.slice(0, 1)}
            </div>
          )}

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--dx-accent)]">
              {person.department}
            </p>
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {person.name}
            </h1>
            {person.biography && (
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#d2d2d2]">
                {person.biography}
              </p>
            )}
          </div>
        </div>
      </div>

      {safeCredits.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-5 font-display text-2xl font-bold text-white">
            Featured Filmography
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
            {safeCredits.map((credit) => (
              <MediaCard
                key={`${credit.mediaType}-${credit.id}`}
                item={credit}
                variant="poster"
                platform={platform}
                onSelect={onInspect}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
