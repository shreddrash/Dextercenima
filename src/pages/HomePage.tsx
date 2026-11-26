import { Play, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { HOME_CURATED_CATEGORIES, TOP_RATED_CATEGORIES } from '../shared/curatedCategories';
import type { MediaSummary, PlayRecord } from '../shared/types';
import { fetchDiscoverTitles, fetchHeroTitles } from '../lib/api';
import { buildPlayUrl, navigateTo } from '../lib/router';
import { deletePlayRecord, getAllPlayRecords, subscribeVaultUpdates } from '../lib/vaultStorage';
import HeroSpotlight from '../components/HeroSpotlight';
import HorizontalRail from '../components/HorizontalRail';
import { DEXTERX_LOGO_URL } from '../components/Navbar';
import PosterArtwork from '../components/PosterArtwork';

interface HomePageProps {
  onInspect: (item: MediaSummary) => void;
}

export default function HomePage({ onInspect }: HomePageProps) {
  const [heroItems, setHeroItems] = useState<MediaSummary[]>([]);
  const [rails, setRails] = useState<Record<string, MediaSummary[]>>({});
  const [history, setHistory] = useState<PlayRecord[]>(() => getAllPlayRecords());

  useEffect(() => {
    return subscribeVaultUpdates(() => {
      setHistory(getAllPlayRecords());
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetchHeroTitles()
      .then((results) => {
        if (!cancelled) {
          setHeroItems(results);
        }
      })
      .catch(() => {});

    const allCats = [...TOP_RATED_CATEGORIES, ...HOME_CURATED_CATEGORIES];
    allCats.forEach((cat) => {
      const qs = new URLSearchParams({
        media: cat.mediaType,
        ...cat.query,
      });
      fetchDiscoverTitles(qs)
        .then((data) => {
          if (!cancelled) {
            setRails((prev) => ({ ...prev, [cat.slug]: data.list }));
          }
        })
        .catch(() => {});
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full">
      <HeroSpotlight items={heroItems} onInspect={onInspect} />

      {/* Full-Width Edge-to-Edge Netflix 2026 Rails overlapping hero fade on PC */}
      <div className="relative z-20 w-full px-4 sm:px-6 lg:px-12 md:-mt-24">
        {/* Continue Watching Rail */}
        {history.length > 0 && (
          <section className="pb-4 pt-2">
            <div className="mb-3.5 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold tracking-tight text-white sm:text-xl lg:text-2xl">
                  Continue Watching
                </h2>
                <p className="mt-0.5 text-xs text-purple-300/75">
                  Resume right where you left off
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('/my')}
                className="text-xs font-semibold text-purple-300 hover:text-white transition-colors cursor-pointer"
              >
                Manage Vault
              </button>
            </div>

            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
              {history.slice(0, 12).map((rec) => (
                <div
                  key={rec.key}
                  onClick={() =>
                    navigateTo(
                      buildPlayUrl({
                        tmdbId: rec.tmdbId,
                        mediaType: rec.mediaType,
                        title: rec.title,
                        year: rec.year,
                        poster: rec.poster,
                        score: rec.score,
                        season: rec.season,
                        episode: rec.episode,
                        provider: rec.provider,
                      }),
                    )
                  }
                  className="group relative w-[250px] sm:w-[275px] shrink-0 cursor-pointer overflow-hidden rounded-xl border border-purple-500/25 bg-[#120924] dx-card-hover"
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <PosterArtwork
                      src={rec.backdrop || rec.poster}
                      alt={rec.title}
                      title={rec.title}
                      variant="backdrop"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05020b] via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#05020b] shadow-xl">
                        <Play className="h-5 w-5 fill-current" />
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${rec.title} from history`}
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePlayRecord(rec.key);
                      }}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#05020b]/85 text-purple-200 opacity-0 transition-opacity hover:bg-red-600 hover:text-white group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="p-3">
                    <h3 className="truncate font-display text-sm font-semibold text-white">
                      {rec.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-purple-300/75 font-mono-num">
                      <span>
                        {rec.mediaType === 'tv' ? `S${rec.season} · E${rec.episode}` : 'Feature'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{rec.provider}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Top 10 Ranked Rails */}
        {TOP_RATED_CATEGORIES.map((cat) => (
          <HorizontalRail
            key={cat.slug}
            title={cat.title}
            subtitle={cat.subtitle}
            items={(rails[cat.slug] || []).slice(0, 10)}
            ranked
            viewAllHref={`/curated/${cat.slug}`}
            onSelect={onInspect}
          />
        ))}

        {/* Curated Cinema, Hindi, Anime & Series Rails */}
        {HOME_CURATED_CATEGORIES.map((cat) => (
          <HorizontalRail
            key={cat.slug}
            title={cat.title}
            subtitle={cat.subtitle}
            items={rails[cat.slug] || []}
            viewAllHref={`/curated/${cat.slug}`}
            onSelect={onInspect}
          />
        ))}

        {/* Developer Crest Showcase Banner */}
        <section className="mt-10 overflow-hidden rounded-2xl border border-purple-500/25 bg-gradient-to-r from-[#14082b] via-[#0d061a] to-[#190936] p-6 sm:p-10 dx-purple-glow">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-5">
              <img
                src={DEXTERX_LOGO_URL}
                alt="Dexterx Cenima Emblem"
                referrerPolicy="no-referrer"
                className="h-20 w-20 shrink-0 rounded-2xl border border-purple-400/50 object-cover shadow-[0_0_32px_rgba(168,85,247,0.45)]"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-purple-300">
                  Dexterx Cenima
                </p>
                <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Built for Midnight Cinema
                </h2>
                <p className="mt-1 text-sm text-purple-200/80">
                  Engineered by <span className="font-semibold text-white">Ghost Dexter</span> — global movies, Hindi blockbusters, anime, and series in obsidian-violet.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigateTo('/discover?type=hindi')}
                className="h-10 rounded-lg bg-purple-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-purple-500 whitespace-nowrap cursor-pointer"
              >
                Explore Hindi &amp; Global
              </button>
              <button
                type="button"
                onClick={() => navigateTo('/my')}
                className="h-10 rounded-lg border border-purple-400/35 bg-[#120924] px-5 text-sm font-semibold text-purple-100 transition-colors hover:border-purple-300 hover:bg-purple-900/50 whitespace-nowrap cursor-pointer"
              >
                Open My Vault
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
