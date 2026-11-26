import { openPlatformLauncher, PLATFORM_THEMES } from '../lib/platform';
import { openProfileGate } from '../lib/profiles';
import { navigateTo } from '../lib/router';
import type { StreamingPlatform, UserProfile } from '../shared/types';
import { DEXTERX_LOGO_URL } from './Navbar';

interface FooterProps {
  platform: StreamingPlatform;
  activeProfile?: UserProfile;
}

export default function Footer({ platform, activeProfile }: FooterProps) {
  const isKids = platform === 'netflix' && Boolean(activeProfile?.isKids);
  const theme = PLATFORM_THEMES[platform];

  const columns =
    platform === 'crunchyroll'
      ? [
          { label: 'Anime Home', href: '/' },
          { label: 'Anime Series', href: '/discover?type=tv' },
          { label: 'Anime Movies', href: '/discover?type=movie' },
          { label: 'Top Anime', href: '/curated/crunchyroll-top-anime' },
          { label: 'Shonen Hits', href: '/curated/crunchyroll-shonen' },
          { label: 'Dark Fantasy', href: '/curated/crunchyroll-dark-fantasy' },
          { label: 'Watchlist', href: '/my' },
          { label: 'All Anime', href: '/discover?type=all' },
        ]
      : platform === 'prime'
        ? [
            { label: 'Prime Home', href: '/' },
            { label: 'Movies Included', href: '/discover?type=movie' },
            { label: 'TV Series', href: '/discover?type=tv' },
            { label: 'Amazon Originals', href: '/curated/prime-originals' },
            { label: 'Prime India Originals', href: '/curated/prime-hindi-thrillers' },
            { label: 'Bollywood Hits', href: '/discover?type=hindi' },
            { label: 'My Stuff', href: '/my' },
            { label: 'All Prime', href: '/discover?type=all' },
          ]
        : isKids
          ? [
              { label: 'Kids Home', href: '/' },
              { label: 'Kids Movies', href: '/discover?type=kids&media=movie' },
              { label: 'Cartoons & TV', href: '/discover?type=kids&media=tv' },
              { label: 'All Kids Titles', href: '/discover?type=kids' },
              { label: 'Kids My List', href: '/my' },
            ]
          : [
              { label: 'Home', href: '/' },
              { label: 'TV Shows', href: '/discover?type=tv' },
              { label: 'Movies', href: '/discover?type=movie' },
              { label: 'All Movies & Shows', href: '/discover?type=all' },
              { label: 'Hindi Blockbusters', href: '/discover?type=hindi' },
              { label: 'Only on Netflix', href: '/curated/netflix-exclusives' },
              { label: 'Top 10 Today', href: '/curated/top-rated-movies' },
              { label: 'My List', href: '/my' },
            ];

  return (
    <footer className="mt-16 border-t border-white/10 bg-[var(--dx-bg)] pb-24 pt-12 md:pb-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-12">
        <div className="mb-6 flex items-center gap-3">
          <img
            src={DEXTERX_LOGO_URL}
            alt="Dexterx Cenima logo"
            referrerPolicy="no-referrer"
            className="h-10 w-10 rounded border border-white/15 object-cover"
          />
          <div>
            <p className="font-display text-base font-black tracking-tight text-[var(--dx-accent)]">
              DEXTERX <span className="text-white">{theme.shortName.toUpperCase()}</span>
            </p>
            <p className="text-xs text-[#808080]">
              Developer: <span className="font-semibold text-[#b3b3b3]">Ghost Dexter</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[13px] text-[#808080] sm:grid-cols-4">
          {columns.map((col) => (
            <a
              key={col.href}
              href={col.href}
              onClick={(e) => {
                e.preventDefault();
                navigateTo(col.href);
              }}
              className="hover:underline"
            >
              {col.label}
            </a>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => openPlatformLauncher()}
              className="border border-[var(--dx-accent)]/60 px-3 py-1.5 text-xs font-semibold text-[var(--dx-accent)] transition-colors hover:bg-[var(--dx-accent)] hover:text-white cursor-pointer"
            >
              Switch Streaming App
            </button>

            {platform !== 'crunchyroll' && (
              <button
                type="button"
                onClick={() => openProfileGate()}
                className="border border-[#808080] px-3 py-1.5 text-xs text-[#808080] transition-colors hover:border-white hover:text-white cursor-pointer"
              >
                Switch Profile
              </button>
            )}
          </div>

          <p className="text-xs text-[#737373]">
            © {new Date().getFullYear()} Dexterx Cenima · Built by Ghost Dexter
          </p>
        </div>
      </div>
    </footer>
  );
}
