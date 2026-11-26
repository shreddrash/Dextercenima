import { navigateTo } from '../lib/router';
import { DEXTERX_LOGO_URL } from './Navbar';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-purple-500/20 bg-[#040108] pb-24 pt-12 md:pb-12">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <img
              src={DEXTERX_LOGO_URL}
              alt="Dexterx Cenima logo"
              referrerPolicy="no-referrer"
              className="h-14 w-14 rounded-xl border border-purple-400/40 object-cover shadow-[0_0_24px_rgba(168,85,247,0.35)]"
            />
            <div>
              <p className="font-display text-lg font-extrabold tracking-tight text-white">
                Dexterx <span className="text-purple-400">Cenima</span>
              </p>
              <p className="mt-0.5 text-sm text-purple-200/80">
                Developer: <span className="font-semibold text-purple-300">Ghost Dexter</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-purple-200/75">
            <a
              href="/discover?type=movie"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/discover?type=movie');
              }}
              className="hover:text-white transition-colors"
            >
              Movies
            </a>
            <a
              href="/discover?type=tv"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/discover?type=tv');
              }}
              className="hover:text-white transition-colors"
            >
              Series
            </a>
            <a
              href="/discover?type=anime"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/discover?type=anime');
              }}
              className="hover:text-white transition-colors"
            >
              Anime
            </a>
            <a
              href="/discover?type=hindi"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/discover?type=hindi');
              }}
              className="hover:text-white transition-colors"
            >
              Hindi
            </a>
            <a
              href="/curated/top-rated-movies"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/curated/top-rated-movies');
              }}
              className="hover:text-white transition-colors"
            >
              Top 10
            </a>
            <a
              href="/my"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/my');
              }}
              className="hover:text-white transition-colors"
            >
              My Vault
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-purple-500/15 pt-6 text-xs text-purple-300/60 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Dexterx Cenima. Crafted by Ghost Dexter.</p>
          <p>Instant obsidian-violet streaming vault.</p>
        </div>
      </div>
    </footer>
  );
}
