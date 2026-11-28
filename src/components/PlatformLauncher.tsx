import { ChevronRight, X } from 'lucide-react';
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
  tag: string;
  accent: string;
  iconBg: string;
  hoverBorder: string;
}> = [
  {
    id: 'netflix',
    title: 'Netflix',
    subtitle: 'Originals, Hindi Hits & Kids',
    tag: 'Cinema',
    accent: '#E50914',
    iconBg: 'bg-gradient-to-br from-[#2B0609] to-[#0E0203] border-[#E50914]/45',
    hoverBorder: 'hover:border-[#E50914]/75 hover:shadow-[0_10px_30px_rgba(229,9,20,0.22)]',
  },
  {
    id: 'prime',
    title: 'Prime Video',
    subtitle: 'Amazon 4K & Blockbusters',
    tag: '4K HDR',
    accent: '#00A8E1',
    iconBg: 'bg-gradient-to-br from-[#072642] to-[#040E1A] border-[#00A8E1]/45',
    hoverBorder: 'hover:border-[#00A8E1]/75 hover:shadow-[0_10px_30px_rgba(0,168,225,0.22)]',
  },
  {
    id: 'crunchyroll',
    title: 'Crunchyroll',
    subtitle: '100% Anime Series & Films',
    tag: 'Anime',
    accent: '#F47521',
    iconBg: 'bg-gradient-to-br from-[#381805] to-[#140902] border-[#F47521]/45',
    hoverBorder: 'hover:border-[#F47521]/75 hover:shadow-[0_10px_30px_rgba(244,117,33,0.22)]',
  },
  {
    id: 'sports',
    title: 'Dexterx Sports',
    subtitle: 'Live & Upcoming Football & Cricket',
    tag: 'Live & Upcoming',
    accent: '#10B981',
    iconBg: 'bg-gradient-to-br from-[#063626] to-[#04140E] border-[#10B981]/50',
    hoverBorder: 'hover:border-[#10B981]/80 hover:shadow-[0_10px_30px_rgba(16,185,129,0.25)]',
  },
  {
    id: 'worldchannels',
    title: 'Live World Channel',
    subtitle: 'All Global Live Sports & World TV',
    tag: '550+ World TV',
    accent: '#8B5CF6',
    iconBg: 'bg-gradient-to-br from-[#2B125A] to-[#0D061C] border-[#8B5CF6]/55',
    hoverBorder: 'hover:border-[#8B5CF6]/85 hover:shadow-[0_10px_30px_rgba(139,92,246,0.28)]',
  },
];

function CompactPlatformIcon({ platform }: { platform: StreamingPlatform }) {
  if (platform === 'netflix') {
    return (
      <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden="true">
        <path d="M16 10h11v44H16V10z" fill="#b20710" />
        <path d="M37 10h11v44H37V10z" fill="#b20710" />
        <path d="M16 10h11l21 44H37L16 10z" fill="#E50914" />
      </svg>
    );
  }

  if (platform === 'prime') {
    return (
      <div className="flex flex-col items-center justify-center leading-none select-none">
        <span className="font-display text-[11px] font-black tracking-tight text-white">
          prime
        </span>
        <svg viewBox="0 0 120 34" className="-mt-0.5 h-3 w-9" aria-hidden="true">
          <path
            d="M12 8 C 42 27, 78 27, 104 9"
            fill="none"
            stroke="#00A8E1"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M94 5 L107 8 L101 20"
            fill="none"
            stroke="#00A8E1"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (platform === 'sports') {
    return (
      <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden="true">
        <path
          d="M32 6 L54 15 V31 C54 45 44 54 32 58 C20 54 10 45 10 31 V15 Z"
          fill="#06281E"
          stroke="#10B981"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="29" r="10.5" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
        <polygon points="32,22 37.5,26.5 35.5,33 28.5,33 26.5,26.5" fill="#10B981" />
        <path d="M23 44 H41" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (platform === 'worldchannels') {
    return (
      <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden="true">
        <circle cx="32" cy="32" r="21" fill="#180A33" stroke="#8B5CF6" strokeWidth="3" />
        <ellipse cx="32" cy="32" rx="10" ry="21" fill="none" stroke="#A78BFA" strokeWidth="2.2" />
        <path d="M12 32 H52" stroke="#A78BFA" strokeWidth="2.2" />
        <path d="M16 21 H48" stroke="#8B5CF6" strokeWidth="1.8" strokeOpacity="0.7" />
        <path d="M16 43 H48" stroke="#8B5CF6" strokeWidth="1.8" strokeOpacity="0.7" />
        <circle cx="48" cy="16" r="5" fill="#FBBF24" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden="true">
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
    void playPlatformIntroSound(platform, true);
    setActivePlatform(platform, true);
    onSelectPlatform(platform);
  };

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center overflow-y-auto bg-black/82 p-4 text-white backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label="Choose Streaming App"
    >
      {/* Subtle ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(229,9,20,0.12),transparent_42%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,0.12),transparent_42%),radial-gradient(circle_at_50%_85%,rgba(139,92,246,0.16),transparent_48%)]"
      />

      {/* Compact Glass Modal Container */}
      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-white/12 bg-[#0B0D10]/95 p-5 sm:p-6 shadow-[0_32px_90px_rgba(0,0,0,0.85)]">
        {/* Compact Top Header */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={DEXTERX_LOGO_URL}
              alt="Dexterx Cenima Emblem"
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-xl border border-white/15 object-cover"
            />
            <div>
              <p className="font-display text-base font-black tracking-tight text-white">
                DEXTERX <span className="text-[#E50914]">CENIMA</span>
              </p>
              <p className="text-[11px] font-medium text-white/50">
                Choose an app to launch · 5 Streaming Worlds
              </p>
            </div>
          </div>

          {canDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Close app switcher"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-white/5 text-white/75 transition-colors hover:bg-white/15 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Compact Interactive App Tiles */}
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {PLATFORMS.map((p, idx) => {
            const isCurrent = canDismiss && activePlatform === p.id;
            const meta = PLATFORM_THEMES[p.id];
            const isFullWidthBottom = PLATFORMS.length % 2 === 1 && idx === PLATFORMS.length - 1;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleChoose(p.id)}
                className={`group relative flex min-h-[74px] items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.035] p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.07] active:scale-[0.98] cursor-pointer ${p.hoverBorder} ${
                  isFullWidthBottom ? 'sm:col-span-2' : ''
                } ${isCurrent ? 'ring-1 ring-white/25 bg-white/[0.07]' : ''}`}
              >
                {/* Brand Squircle */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105 ${p.iconBg}`}
                >
                  <CompactPlatformIcon platform={p.id} />
                </div>

                {/* App Name & Crisp One-line Description */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate font-display text-sm sm:text-base font-extrabold text-white">
                      {p.title}
                    </h2>
                    {isCurrent && (
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: meta.accent }}
                        title="Current App"
                      />
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-white/60">{p.subtitle}</p>
                  <p
                    className="mt-1 text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: p.accent }}
                  >
                    {isCurrent ? 'Active' : p.tag}
                  </p>
                </div>

                {/* Right Launch Chevron */}
                <ChevronRight className="h-4 w-4 shrink-0 text-white/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-white" />
              </button>
            );
          })}
        </div>

        {/* Minimal Footer Caption */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-white/40">
          <span>Engineered by Ghost Dexter</span>
          <span>Tap any tile · Instant Play</span>
        </div>
      </div>
    </div>
  );
}
