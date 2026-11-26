import { Bookmark, Clapperboard, Flame, Home, Search, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { navigateTo, useAppLocation } from '../lib/router';

export const DEXTERX_LOGO_URL =
  '/assets/aistudio/F9DEF81A-35CB-4A1C-AAEF-2C7B6B97FF6D_cfa93277.png';

export default function Navbar() {
  const loc = useAppLocation();
  const typeParam = loc.params.get('type') || '';
  const isHome = loc.pathname === '/';

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '/', active: loc.pathname === '/' },
    {
      label: 'Movies',
      href: '/discover?type=movie',
      active: loc.pathname === '/discover' && (typeParam === 'movie' || !typeParam),
    },
    {
      label: 'Series',
      href: '/discover?type=tv',
      active: loc.pathname === '/discover' && typeParam === 'tv',
    },
    {
      label: 'Anime',
      href: '/discover?type=anime',
      active: loc.pathname === '/discover' && typeParam === 'anime',
    },
    {
      label: 'Hindi',
      href: '/discover?type=hindi',
      active: loc.pathname === '/discover' && typeParam === 'hindi',
    },
    { label: 'My Vault', href: '/my', active: loc.pathname === '/my' },
  ];

  const handleQuickSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = quickQuery.trim();
    if (q) {
      navigateTo(`/search?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
    } else {
      navigateTo('/search');
    }
  };

  return (
    <>
      {/* PC / Desktop Full-Width Netflix-2026 Top Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled || !isHome
            ? 'border-b border-purple-500/20 bg-[#05020b]/92 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
            : 'bg-gradient-to-b from-[#05020b]/90 via-[#05020b]/50 to-transparent'
        }`}
      >
        <div className="flex h-16 w-full items-center justify-between gap-6 px-4 sm:px-6 lg:px-12">
          {/* Left: Brand Lockup + PC Navigation Links */}
          <div className="flex items-center gap-8 min-w-0">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/');
              }}
              className="flex items-center gap-3 whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg"
            >
              <img
                src={DEXTERX_LOGO_URL}
                alt="Dexterx Cenima crest"
                referrerPolicy="no-referrer"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg border border-purple-400/50 object-cover shadow-[0_0_20px_rgba(168,85,247,0.5)]"
              />
              <span className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-white">
                Dexterx <span className="text-purple-400">Cenima</span>
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-6" aria-label="Primary Navigation">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(item.href);
                  }}
                  className={`relative py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                    item.active ? 'text-white font-semibold' : 'text-purple-100/75 hover:text-white'
                  }`}
                >
                  {item.label}
                  {item.active && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-fuchsia-400"
                    />
                  )}
                </a>
              ))}
            </nav>
          </div>

          {/* Right: Inline Expandable Search + Mobile Quick Search */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center">
              {searchOpen ? (
                <form
                  onSubmit={handleQuickSearch}
                  className="flex items-center overflow-hidden rounded-lg border border-purple-400/60 bg-[#0d061a]/95 px-3 py-1.5 shadow-[0_0_20px_rgba(147,51,234,0.35)]"
                >
                  <Search className="mr-2 h-4 w-4 text-purple-300 shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    value={quickQuery}
                    onChange={(e) => setQuickQuery(e.target.value)}
                    placeholder="Titles, Hindi, actors..."
                    className="w-52 bg-transparent text-sm text-white placeholder:text-purple-300/50 focus:outline-none"
                  />
                  <button
                    type="button"
                    aria-label="Close search"
                    onClick={() => {
                      setSearchOpen(false);
                      setQuickQuery('');
                    }}
                    className="ml-1 text-purple-300 hover:text-white cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-purple-400/35 bg-purple-600/90 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(147,51,234,0.45)] transition-colors hover:bg-purple-500 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Search className="h-4 w-4 shrink-0" />
                  <span>Search</span>
                </button>
              )}
            </div>

            {/* Mobile Top Right Quick Search */}
            <button
              type="button"
              aria-label="Search Dexterx Cenima"
              onClick={() => navigateTo('/search')}
              className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl border border-purple-400/30 bg-[#120924]/85 text-purple-100"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Phone Curved Floating Bottom Navigation Dock */}
      <nav
        aria-label="Mobile Curved Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      >
        <div className="relative mx-auto flex h-16 w-full items-center justify-around rounded-t-[28px] border-t border-purple-400/35 bg-[#0c051b]/95 px-2 pb-1 backdrop-blur-2xl shadow-[0_-12px_40px_rgba(147,51,234,0.38)]">
          <button
            type="button"
            onClick={() => navigateTo('/')}
            className={`flex min-h-[44px] min-w-[54px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium whitespace-nowrap ${
              loc.pathname === '/' ? 'text-purple-300' : 'text-purple-200/60'
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('/discover?type=movie')}
            className={`flex min-h-[44px] min-w-[54px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium whitespace-nowrap ${
              loc.pathname === '/discover' && typeParam !== 'hindi'
                ? 'text-purple-300'
                : 'text-purple-200/60'
            }`}
          >
            <Clapperboard className="h-5 w-5" />
            <span>Movies</span>
          </button>

          {/* Elevated Curved Center Search Orb */}
          <button
            type="button"
            aria-label="Search All Movies"
            onClick={() => navigateTo('/search')}
            className="-mt-7 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-[#05020b] bg-gradient-to-tr from-purple-600 via-violet-500 to-fuchsia-500 text-white shadow-[0_0_26px_rgba(168,85,247,0.85)] transition-transform active:scale-95"
          >
            <Search className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={() => navigateTo('/discover?type=hindi')}
            className={`flex min-h-[44px] min-w-[54px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium whitespace-nowrap ${
              loc.pathname === '/discover' && typeParam === 'hindi'
                ? 'text-purple-300'
                : 'text-purple-200/60'
            }`}
          >
            <Flame className="h-5 w-5" />
            <span>Hindi</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('/my')}
            className={`flex min-h-[44px] min-w-[54px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium whitespace-nowrap ${
              loc.pathname === '/my' ? 'text-purple-300' : 'text-purple-200/60'
            }`}
          >
            <Bookmark className="h-5 w-5" />
            <span>Vault</span>
          </button>
        </div>
      </nav>
    </>
  );
}
