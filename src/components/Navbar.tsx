import {
  Bell,
  Bookmark,
  ChevronDown,
  Clapperboard,
  Flame,
  Grid2x2,
  Home,
  LogOut,
  Pencil,
  Play,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { fetchSearchTitles } from '../lib/api';
import { openPlatformLauncher, PLATFORM_THEMES } from '../lib/platform';
import {
  enterKidsMode,
  exitKidsMode,
  getProfiles,
  openProfileGate,
  setActiveProfile,
} from '../lib/profiles';
import { buildPlayUrl, navigateTo, useAppLocation } from '../lib/router';
import type { MediaSummary, StreamingPlatform, UserProfile } from '../shared/types';
import { getHeroVaultItems } from '../shared/vaultCatalog';
import PosterArtwork from './PosterArtwork';
import ProfileAvatar from './ProfileAvatar';

export const DEXTERX_LOGO_URL =
  '/assets/aistudio/F9DEF81A-35CB-4A1C-AAEF-2C7B6B97FF6D_cfa93277.png';

interface NavbarProps {
  platform: StreamingPlatform;
  activeProfile: UserProfile;
  onInspect: (item: MediaSummary) => void;
}

export default function Navbar({ platform, activeProfile, onInspect }: NavbarProps) {
  const loc = useAppLocation();
  const typeParam = loc.params.get('type') || '';
  const isHome = loc.pathname === '/';
  const isKids = platform === 'netflix' && activeProfile.isKids;
  const theme = PLATFORM_THEMES[platform];

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');
  const [livePreview, setLivePreview] = useState<MediaSummary[]>([]);
  const [searchingLive, setSearchingLive] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target) && !quickQuery.trim()) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [quickQuery]);

  useEffect(() => {
    const trimmed = quickQuery.trim();
    if (!searchOpen || trimmed.length < 2) {
      setLivePreview([]);
      setSearchingLive(false);
      return;
    }

    let cancelled = false;
    setSearchingLive(true);
    const timer = window.setTimeout(() => {
      fetchSearchTitles(trimmed, isKids, platform)
        .then((res) => {
          if (!cancelled) {
            setLivePreview(res.results.slice(0, 6));
          }
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setSearchingLive(false);
        });
    }, 180);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [quickQuery, searchOpen, isKids, platform]);

  const navItems =
    platform === 'crunchyroll'
      ? [
          { label: 'Home', href: '/', active: loc.pathname === '/' },
          {
            label: 'Anime Series',
            href: '/discover?type=tv',
            active: loc.pathname === '/discover' && typeParam === 'tv',
          },
          {
            label: 'Anime Movies',
            href: '/discover?type=movie',
            active: loc.pathname === '/discover' && typeParam === 'movie',
          },
          {
            label: 'Top Anime',
            href: '/curated/crunchyroll-top-anime',
            active: loc.pathname.startsWith('/curated'),
          },
          { label: 'Watchlist', href: '/my', active: loc.pathname === '/my' },
          {
            label: 'All Anime',
            href: '/discover?type=all',
            active: loc.pathname === '/discover' && (typeParam === 'all' || !typeParam),
          },
        ]
      : platform === 'prime'
        ? [
            { label: 'Home', href: '/', active: loc.pathname === '/' },
            {
              label: 'Movies',
              href: '/discover?type=movie',
              active: loc.pathname === '/discover' && typeParam === 'movie',
            },
            {
              label: 'TV Shows',
              href: '/discover?type=tv',
              active: loc.pathname === '/discover' && typeParam === 'tv',
            },
            {
              label: 'Amazon Originals',
              href: '/curated/prime-originals',
              active: loc.pathname.startsWith('/curated'),
            },
            {
              label: 'Hindi Originals',
              href: '/discover?type=hindi',
              active: loc.pathname === '/discover' && typeParam === 'hindi',
            },
            { label: 'My Stuff', href: '/my', active: loc.pathname === '/my' },
            {
              label: 'All Prime',
              href: '/discover?type=all',
              active: loc.pathname === '/discover' && (typeParam === 'all' || !typeParam),
            },
          ]
        : isKids
          ? [
              { label: 'Home', href: '/', active: loc.pathname === '/' },
              {
                label: 'Kids Movies',
                href: '/discover?type=kids&media=movie',
                active: loc.pathname === '/discover' && loc.params.get('media') !== 'tv',
              },
              {
                label: 'Cartoons & TV',
                href: '/discover?type=kids&media=tv',
                active: loc.pathname === '/discover' && loc.params.get('media') === 'tv',
              },
              {
                label: 'All Kids',
                href: '/discover?type=kids',
                active:
                  loc.pathname === '/discover' &&
                  typeParam === 'kids' &&
                  !loc.params.get('media'),
              },
              { label: 'My List', href: '/my', active: loc.pathname === '/my' },
            ]
          : [
              { label: 'Home', href: '/', active: loc.pathname === '/' },
              {
                label: 'TV Shows',
                href: '/discover?type=tv',
                active: loc.pathname === '/discover' && typeParam === 'tv',
              },
              {
                label: 'Movies',
                href: '/discover?type=movie',
                active: loc.pathname === '/discover' && typeParam === 'movie',
              },
              {
                label: 'Only on Netflix',
                href: '/curated/netflix-exclusives',
                active: loc.pathname.startsWith('/curated'),
              },
              {
                label: 'Hindi',
                href: '/discover?type=hindi',
                active: loc.pathname === '/discover' && typeParam === 'hindi',
              },
              {
                label: 'Anime',
                href: '/discover?type=anime',
                active: loc.pathname === '/discover' && typeParam === 'anime',
              },
              { label: 'My List', href: '/my', active: loc.pathname === '/my' },
              {
                label: 'All Movies',
                href: '/discover?type=all',
                active: loc.pathname === '/discover' && (typeParam === 'all' || !typeParam),
              },
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

  const notifications = getHeroVaultItems(isKids, platform).slice(0, 5);
  const profiles = getProfiles(platform);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
          scrolled || !isHome
            ? 'bg-[var(--dx-bg)] shadow-[0_8px_24px_rgba(0,0,0,0.65)] border-b border-white/5'
            : 'bg-gradient-to-b from-black/85 via-black/45 to-transparent'
        }`}
      >
        <div className="flex h-[68px] w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-12">
          {/* Left: Platform Brand Lockup + Desktop Links */}
          <div className="flex items-center gap-6 min-w-0">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/');
              }}
              className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus:outline-none"
            >
              <img
                src={DEXTERX_LOGO_URL}
                alt="Dexterx Cenima crest"
                referrerPolicy="no-referrer"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded border border-white/15 object-cover"
              />
              {platform === 'prime' ? (
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-lg sm:text-xl font-black tracking-tight text-white">
                    prime <span className="font-normal text-[#00A8E1]">video</span>
                  </span>
                  <span className="hidden sm:inline rounded bg-[#00A8E1]/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#00A8E1]">
                    DEXTERX
                  </span>
                </div>
              ) : platform === 'crunchyroll' ? (
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-lg sm:text-xl font-black tracking-tight text-[#F47521]">
                    crunchyroll
                  </span>
                  <span className="hidden sm:inline rounded bg-[#F47521]/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#F47521]">
                    ANIME
                  </span>
                </div>
              ) : (
                <span className="font-display text-lg sm:text-xl font-black tracking-tight text-[#E50914]">
                  DEXTERX <span className="text-white font-extrabold">CENIMA</span>
                </span>
              )}

              {isKids && (
                <span className="ml-1 rounded bg-sky-500 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                  KIDS
                </span>
              )}
            </a>

            <nav className="hidden lg:flex items-center gap-5" aria-label="Primary Navigation">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(item.href);
                  }}
                  className={`text-[13px] whitespace-nowrap shrink-0 transition-colors ${
                    item.active
                      ? platform === 'prime'
                        ? 'font-bold text-[#00A8E1]'
                        : platform === 'crunchyroll'
                          ? 'font-bold text-[#F47521]'
                          : 'font-bold text-white'
                      : 'font-normal text-[#e5e5e5] hover:text-[#b3b3b3]'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Right: Search, Switch App, Kids Toggle (Netflix), Notifications, Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            {/* Desktop Instant Search */}
            <div className="relative hidden md:flex items-center" ref={searchRef}>
              {searchOpen ? (
                <div className="relative">
                  <form
                    onSubmit={handleQuickSearch}
                    className="flex items-center border border-white bg-black/95 px-2.5 py-1.5 shadow-2xl rounded-[4px]"
                  >
                    <Search className="mr-2 h-4 w-4 text-white shrink-0" />
                    <input
                      type="text"
                      autoFocus
                      value={quickQuery}
                      onChange={(e) => setQuickQuery(e.target.value)}
                      placeholder={
                        platform === 'crunchyroll'
                          ? 'Search anime: Solo Leveling, Demon Slayer...'
                          : isKids
                            ? 'Cartoons, kids movies...'
                            : platform === 'prime'
                              ? 'Search Prime: The Boys, Mirzapur, Fallout...'
                              : 'Titles, people, genres'
                      }
                      className="w-60 bg-transparent text-xs text-white placeholder:text-[#8c8c8c] focus:outline-none"
                    />
                    <button
                      type="button"
                      aria-label="Close search"
                      onClick={() => {
                        setSearchOpen(false);
                        setQuickQuery('');
                      }}
                      className="ml-1 text-neutral-300 hover:text-white cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </form>

                  {quickQuery.trim().length >= 2 && (
                    <div className="absolute right-0 top-10 w-[340px] border border-white/15 bg-[var(--dx-surface)] shadow-[0_20px_60px_rgba(0,0,0,0.95)]">
                      {searchingLive ? (
                        <div className="p-4 text-xs text-[#b3b3b3]">Searching {theme.name}...</div>
                      ) : livePreview.length === 0 ? (
                        <div className="p-4 text-xs text-[#b3b3b3]">
                          No matches on {theme.name} for &ldquo;{quickQuery}&rdquo;
                        </div>
                      ) : (
                        <div className="divide-y divide-white/10">
                          {livePreview.map((item) => (
                            <div
                              key={`quick-${item.mediaType}-${item.id}`}
                              onClick={() => {
                                setSearchOpen(false);
                                onInspect(item);
                              }}
                              className="flex items-center gap-3 px-3 py-2 hover:bg-[var(--dx-surface-elevated)] cursor-pointer"
                            >
                              <div className="h-11 w-20 shrink-0 overflow-hidden rounded-[2px] bg-[#222]">
                                <PosterArtwork
                                  src={item.backdrop || item.poster}
                                  alt={item.title}
                                  title={item.title}
                                  variant="backdrop"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold text-white">
                                  {item.title}
                                </p>
                                <p className="text-[11px] text-[#808080]">
                                  {item.year} · {item.mediaType === 'tv' ? 'Series' : 'Film'}
                                </p>
                              </div>
                              <button
                                type="button"
                                aria-label={`Play ${item.title}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSearchOpen(false);
                                  navigateTo(
                                    buildPlayUrl({
                                      tmdbId: item.id,
                                      mediaType: item.mediaType,
                                      title: item.title,
                                      year: item.year,
                                      poster: item.poster,
                                      score: item.score,
                                    }),
                                  );
                                }}
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/60 bg-black/50 text-white hover:bg-white hover:text-black cursor-pointer"
                              >
                                <Play className="h-3 w-3 fill-current" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const q = quickQuery.trim();
                              setSearchOpen(false);
                              navigateTo(`/search?q=${encodeURIComponent(q)}`);
                            }}
                            className="w-full py-2.5 text-center text-xs font-bold text-[var(--dx-accent)] hover:bg-[var(--dx-surface-elevated)] cursor-pointer"
                          >
                            See all results for &ldquo;{quickQuery.trim()}&rdquo; →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  aria-label="Search"
                  onClick={() => setSearchOpen(true)}
                  className="flex h-9 w-9 items-center justify-center text-white hover:text-[#b3b3b3] transition-colors cursor-pointer"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Switch Universe Button (Netflix / Prime / Crunchyroll) */}
            <button
              type="button"
              onClick={() => openPlatformLauncher()}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 text-xs font-semibold text-white transition-colors hover:border-[var(--dx-accent)] hover:bg-[var(--dx-accent)] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Grid2x2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Switch App</span>
              <span className="sm:hidden">Apps</span>
            </button>

            {/* Kids Quick Toggle (Netflix only) */}
            {platform === 'netflix' &&
              (isKids ? (
                <button
                  type="button"
                  onClick={() => {
                    exitKidsMode();
                    navigateTo('/');
                  }}
                  className="inline-flex h-8 items-center gap-1.5 rounded bg-[#E50914] px-3 text-xs font-bold text-white transition-colors hover:bg-[#f40612] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Exit Kids</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    enterKidsMode();
                    navigateTo('/');
                  }}
                  className="hidden sm:inline-block text-[13px] font-medium text-[#e5e5e5] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Kids
                </button>
              ))}

            {/* Notification Bell */}
            <div className="relative hidden sm:block" ref={notifRef}>
              <button
                type="button"
                aria-label="New arrivals notifications"
                onClick={() => setNotifOpen((prev) => !prev)}
                className="relative flex h-9 w-9 items-center justify-center text-white hover:text-[#b3b3b3] cursor-pointer"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--dx-accent)]" />
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 border border-white/15 bg-black/95 shadow-2xl">
                  <div className="border-b border-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#b3b3b3]">
                    {platform === 'crunchyroll'
                      ? 'Latest Anime Simulcasts'
                      : platform === 'prime'
                        ? 'New on Prime Video'
                        : isKids
                          ? 'New for Kids'
                          : 'New Arrivals on Netflix'}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-white/10">
                    {notifications.map((item) => (
                      <button
                        key={`notif-${item.mediaType}-${item.id}`}
                        type="button"
                        onClick={() => {
                          setNotifOpen(false);
                          onInspect(item);
                        }}
                        className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-white/10 cursor-pointer"
                      >
                        <div className="h-12 w-20 shrink-0 overflow-hidden rounded bg-[#222]">
                          <PosterArtwork
                            src={item.backdrop || item.poster}
                            alt={item.title}
                            title={item.title}
                            variant="backdrop"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-white">{item.title}</p>
                          <p className="text-[11px] text-[#808080]">
                            {theme.shortName} · {item.year}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                aria-label={`Active profile: ${activeProfile.name}`}
                className="flex items-center gap-1.5 cursor-pointer focus:outline-none"
              >
                <ProfileAvatar
                  avatarId={activeProfile.avatarId}
                  name={activeProfile.name}
                  size="sm"
                  className={platform === 'prime' ? '!rounded-full ring-1 ring-[#00A8E1]' : ''}
                />
                <ChevronDown
                  className={`h-4 w-4 text-white transition-transform duration-200 ${
                    profileMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-11 w-56 border border-white/15 bg-black/95 py-2 shadow-2xl">
                  <div className="space-y-1 px-2 pb-2 border-b border-white/10">
                    {profiles.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setActiveProfile(p.id, true, platform);
                          setProfileMenuOpen(false);
                          navigateTo('/');
                        }}
                        className={`flex w-full items-center gap-2.5 rounded px-2 py-1.5 text-left text-xs transition-colors hover:underline cursor-pointer ${
                          p.id === activeProfile.id
                            ? 'font-bold text-white bg-white/10'
                            : 'text-[#e5e5e5]'
                        }`}
                      >
                        <ProfileAvatar
                          avatarId={p.avatarId}
                          name={p.name}
                          size="xs"
                          className={platform === 'prime' ? '!rounded-full' : ''}
                        />
                        <span className="truncate flex-1">{p.name}</span>
                        {p.isKids && (
                          <span className="text-[10px] font-bold uppercase text-sky-400">Kids</span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-1.5 px-2 space-y-1 text-xs text-[#e5e5e5]">
                    {platform !== 'crunchyroll' && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          openProfileGate();
                        }}
                        className="flex w-full items-center gap-2.5 rounded px-2 py-1.5 hover:bg-white/10 cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5 text-[#b3b3b3]" />
                        <span>Manage Profiles</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        openPlatformLauncher();
                      }}
                      className="flex w-full items-center gap-2.5 rounded px-2 py-1.5 font-semibold text-[var(--dx-accent)] hover:bg-white/10 cursor-pointer"
                    >
                      <Grid2x2 className="h-3.5 w-3.5" />
                      <span>Switch Streaming App</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        navigateTo('/my');
                      }}
                      className="flex w-full items-center gap-2.5 rounded px-2 py-1.5 hover:bg-white/10 cursor-pointer"
                    >
                      <Bookmark className="h-3.5 w-3.5 text-[#b3b3b3]" />
                      <span>
                        {platform === 'crunchyroll'
                          ? 'Watchlist'
                          : platform === 'prime'
                            ? 'My Stuff'
                            : `My List (${activeProfile.name})`}
                      </span>
                    </button>

                    {isKids && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          exitKidsMode();
                          navigateTo('/');
                        }}
                        className="flex w-full items-center gap-2.5 rounded px-2 py-1.5 text-[#E50914] font-semibold hover:bg-white/10 cursor-pointer"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Exit Kids Mode</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ================= PHONE CURVED FLOATING BOTTOM DOCK ================= */}
      <nav
        aria-label="Mobile Curved Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      >
        <div className="relative mx-auto flex h-16 w-full items-center justify-around rounded-t-[28px] border-t border-white/15 bg-[var(--dx-bg)]/96 px-2 pb-1 backdrop-blur-xl shadow-[0_-12px_36px_rgba(0,0,0,0.85)]">
          <button
            type="button"
            onClick={() => navigateTo('/')}
            className={`flex min-h-[44px] min-w-[54px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium whitespace-nowrap ${
              loc.pathname === '/' ? 'text-white' : 'text-[#808080]'
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigateTo(isKids ? '/discover?type=kids' : '/discover?type=all')
            }
            className={`flex min-h-[44px] min-w-[54px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium whitespace-nowrap ${
              loc.pathname === '/discover' && typeParam !== 'hindi' ? 'text-white' : 'text-[#808080]'
            }`}
          >
            <Clapperboard className="h-5 w-5" />
            <span>
              {platform === 'crunchyroll' ? 'Anime' : isKids ? 'Kids All' : 'All'}
            </span>
          </button>

          {/* Elevated Curved Center Search Orb matching active Platform Accent */}
          <button
            type="button"
            aria-label="Search"
            onClick={() => navigateTo('/search')}
            className="-mt-7 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-[var(--dx-bg)] bg-[var(--dx-accent)] text-white shadow-[0_6px_24px_rgba(0,0,0,0.75)] transition-transform active:scale-95"
          >
            <Search className="h-6 w-6" />
          </button>

          {platform === 'crunchyroll' ? (
            <button
              type="button"
              onClick={() => openPlatformLauncher()}
              className="flex min-h-[44px] min-w-[54px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-[#F47521] whitespace-nowrap"
            >
              <Grid2x2 className="h-5 w-5" />
              <span>Apps</span>
            </button>
          ) : isKids ? (
            <button
              type="button"
              onClick={() => {
                exitKidsMode();
                navigateTo('/');
              }}
              className="flex min-h-[44px] min-w-[54px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-[#E50914] whitespace-nowrap"
            >
              <Sparkles className="h-5 w-5" />
              <span>Exit Kids</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigateTo('/discover?type=hindi')}
              className={`flex min-h-[44px] min-w-[54px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium whitespace-nowrap ${
                loc.pathname === '/discover' && typeParam === 'hindi' ? 'text-white' : 'text-[#808080]'
              }`}
            >
              <Flame className="h-5 w-5" />
              <span>Hindi</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => navigateTo('/my')}
            className={`flex min-h-[44px] min-w-[54px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium whitespace-nowrap ${
              loc.pathname === '/my' ? 'text-white' : 'text-[#808080]'
            }`}
          >
            <Bookmark className="h-5 w-5" />
            <span>{platform === 'crunchyroll' ? 'Watchlist' : platform === 'prime' ? 'My Stuff' : 'My List'}</span>
          </button>
        </div>
      </nav>
    </>
  );
}
