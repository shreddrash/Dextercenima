import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { MediaSummary, PersonResult } from '../shared/types';
import { fetchPersonDetail } from '../lib/api';
import { navigateTo } from '../lib/router';
import MediaCard from '../components/MediaCard';

interface PersonPageProps {
  personId: number;
  onInspect: (item: MediaSummary) => void;
}

export default function PersonPage({ personId, onInspect }: PersonPageProps) {
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
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-8">
        <div className="h-40 animate-pulse rounded-2xl bg-[#120924]" />
      </div>
    );
  }

  if (!person) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-16 text-center sm:px-8">
        <h1 className="font-display text-2xl font-bold text-white">Creator profile not found</h1>
        <button
          type="button"
          onClick={() => navigateTo('/search')}
          className="mt-4 h-10 rounded-lg bg-purple-600 px-5 text-sm font-semibold text-white hover:bg-purple-500 cursor-pointer"
        >
          Search Vault
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 pt-24 pb-10 sm:px-6 lg:px-12">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-purple-300 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      <div className="dx-glass-panel rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {person.profile ? (
            <img
              src={person.profile}
              alt={person.name}
              referrerPolicy="no-referrer"
              className="h-28 w-28 shrink-0 rounded-2xl border border-purple-400/35 object-cover"
            />
          ) : (
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border border-purple-400/35 bg-purple-800/40 font-display text-4xl font-extrabold text-purple-200">
              {person.name.slice(0, 1)}
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-300">
              {person.department}
            </p>
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {person.name}
            </h1>
            {person.biography && (
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-purple-100/80">
                {person.biography}
              </p>
            )}
          </div>
        </div>
      </div>

      {person.credits && person.credits.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-5 font-display text-2xl font-bold text-white">
            Featured Filmography
          </h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {person.credits.map((credit) => (
              <MediaCard
                key={`${credit.mediaType}-${credit.id}`}
                item={credit}
                onSelect={onInspect}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
