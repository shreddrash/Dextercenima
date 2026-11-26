import { X } from 'lucide-react';
import { playPlatformIntroSound } from '../lib/dexterxSound';
import { PLATFORM_THEMES, setActivePlatform } from '../lib/platform';
import type { StreamingPlatform } from '../shared/types';
import { DEXTERX_LOGO_URL } from './Navbar';

interface PlatformLauncherProps {
  open: boolean;
  canDismiss: boolean;
  activePlatform: StreamingPlatform;
  onSelectPlatform: (platform: StreamingPlatform) => void;
  onDismiss: () => void;
}

const PLATFORMS: Array<{
  id: StreamingPlatform;
  title: string;
  subtitle: string;
  badge: string;
  accent: string;
  ringClass: string;
  glowStyle: string;
}> = [
  {
    id: 'netflix',
    title: 'Netflix',
    subtitle: 'Netflix Exclusives, Hindi Hits & Kids',
    badge: 'Ghost Dexter · Kids · Create',
    accent: '#E50914',
    ringClass:
      'border-[#E50914]/55 hover:border-[#E50914] bg-[radial-gradient(circle_at_30%_25%,#2b060a_0%,#110204_65%,#050505_100%)]',
    glowStyle: '0 0 60px rgba(229, 9, 20, 0.42), inset 0 0 32px rgba(229, 9, 20, 0.18)',
  },
  {
    id: 'prime',
    title: 'Prime Video',
    subtitle: 'Blue Theme · Amazon Originals & 4K',
    badge: 'Ghost Dexter · Create',
    accent: '#00A8E1',
    ringClass:
      'border-[#00A8E1]/55 hover:border-[#00A8E1] bg-[radial-gradient(circle_at_30%_25%,#072947_0%,#061322_65%,#00050D_100%)]',
    glowStyle: '0 0 60px rgba(0, 168, 225, 0.42), inset 0 0 32px rgba(0, 168, 225, 0.2)',
  },
  {
    id: 'crunchyroll',
    title: 'Crunchyroll',
    subtitle: 'Orange Theme · 100% Anime Only',
    badge: 'Instant Anime Vault',
    accent: '#F47521',
    ringClass:
      'border-[#F47521]/55 hover:border-[#F47521] bg-[radial-gradient(circle_at_30%_25%,#3b1905_0%,#190b03_65%,#0a0908_100%)]',
    glowStyle: '0 0 60px rgba(244, 117, 33, 0.42), inset 0 0 32px rgba(244, 117, 33, 0.2)',
  },
];

function PlatformCircleLogo({ platform }: { platform: StreamingPlatform }) {
  if (platform === 'netflix') {
    return (
      <svg viewBox="0 0 64 64" className="h-16 w-16 sm:h-20 sm:w-20 drop-shadow-[0_6px_18px_rgba(229,9,20,0.75)]" aria-hidden="true">
        {/* Iconic Ribbon N */}
        <path d="M16 10h11v44H16V10z" fill="#b20710" />
        <path d="M37 10h11v44H37V10z" fill="#b20710" />
        <path d="M16 10h11l21 44H37L16 10z" fill="#E50914" />
      </svg>
    );
  }

  if (platform === 'prime') {
    return (
      <div className="flex flex-col items-center justify-center select-none">
        <span className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,168,225,0.6)]">
          prime
        </span>
        <svg viewBox="0 0 120 34" className="-mt-1 h-6 w-24 sm:h-7 sm:w-28" aria-hidden="true">
          <path
            d="M12 8 C 42 27, 78 27, 104 9"
            fill="none"
            stroke="#00A8E1"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M94 5 L107 8 L101 20"
            fill="none"
            stroke="#00A8E1"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 sm:h-20 sm:w-20 drop-shadow-[0_6px_18px_rgba(244,117,33,0.75)]" aria-hidden="true">
      {/* Crunchyroll Spiral Eye Logo */}
      <circle cx="32" cy="32" r="24" fill="#F47521" />
      <circle cx="35.5" cy="34.5" r="15.5" fill="#0a0908" />
      <circle cx="38" cy="32" r="9.5" fill="#F47521" />
      <circle cx="40.5" cy="30" r="4" fill="#0a0908" />
    </svg>
  );
}

export default function PlatformLauncher({
  open,
  canDismiss,
  activePlatform,
  onSelectPlatform,
  onDismiss,
}: PlatformLauncherProps) {
  if (!open) return null;

  const handleChoose = (platform: StreamingPlatform) => {
    // Synchronous call inside click gesture guarantees unblocked autoplay of 4.6s score
    void playPlatformIntroSound(platform, true);
    setActivePlatform(platform, true);
    onSelectPlatform(platform);
  };

  return (
    <div
      className="fixed inset-0 z-[95] flex flex-col items-center justify-center overflow-y-auto bg-[#070709] px-4 py-8 text-white"
      role="dialog"
      aria-modal="true"
      aria-label="Choose Your Streaming Universe"
    >
      {/* Ambient Radial Theater Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(229,9,20,0.12)_0%,rgba(0,168,225,0.08)_45%,rgba(244,117,33,0.08)_80%,transparent_100%)]"
      />

      {canDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close platform switcher"
          className="fixed right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center">
        {/* Top Dexterx Cenima Crest */}
        <div className="flex items-center gap-3">
          <img
            src={DEXTERX_LOGO_URL}
            alt="Dexterx Cenima Emblem"
            referrerPolicy="no-referrer"
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl border border-white/20 object-cover shadow-[0_0_30px_rgba(255,255,255,0.16)]"
          />
          <div className="text-left">
            <p className="font-display text-xl sm:text-2xl font-black tracking-tight text-white">
              DEXTERX <span className="text-[#E50914]">CENIMA</span>
            </p>
            <p className="text-xs font-medium tracking-widest uppercase text-white/55">
              Developer: Ghost Dexter
            </p>
          </div>
        </div>

        <h1 className="mt-7 font-display text-3xl sm:text-5xl font-black tracking-tight text-white">
          Choose Your Universe
        </h1>
        <p className="mt-2 max-w-xl text-sm sm:text-base text-white/65">
          Tap a circle to launch with custom theater audio, exclusive catalog &amp; native interface.
        </p>

        {/* Three Circular Platform Medallions */}
        <div className="mt-10 sm:mt-12 grid w-full max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10">
          {PLATFORMS.map((p) => {
            const isCurrent = canDismiss && activePlatform === p.id;
            const meta = PLATFORM_THEMES[p.id];
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleChoose(p.id)}
                className="group flex flex-col items-center focus:outline-none cursor-pointer"
              >
                <div
                  className={`relative flex h-44 w-44 sm:h-52 sm:w-52 items-center justify-center rounded-full border-2 transition-all duration-300 group-hover:scale-[1.07] group-active:scale-95 ${p.ringClass}`}
                  style={{ boxShadow: p.glowStyle }}
                >
                  {/* Animated subtle outer halo on hover */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-2 rounded-full border border-white/0 transition-all duration-300 group-hover:border-white/25"
                  />

                  <PlatformCircleLogo platform={p.id} />

                  {isCurrent && (
                    <span
                      className="absolute -bottom-2.5 rounded-full px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-lg"
                      style={{ backgroundColor: meta.accent }}
                    >
                      Active
                    </span>
                  )}
                </div>

                <h2 className="mt-5 font-display text-xl sm:text-2xl font-extrabold tracking-tight text-white transition-colors group-hover:opacity-90">
                  {p.title}
                </h2>
                <p className="mt-1 text-xs sm:text-sm font-medium text-white/70">{p.subtitle}</p>
                <span
                  className="mt-2 inline-block text-[11px] font-semibold tracking-wide uppercase"
                  style={{ color: p.accent }}
                >
                  {p.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
