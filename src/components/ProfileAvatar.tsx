import type { ProfileAvatarId } from '../shared/types';
import { DEXTERX_LOGO_URL } from './Navbar';

interface ProfileAvatarProps {
  avatarId: ProfileAvatarId;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_MAP = {
  xs: 'h-7 w-7 rounded-[4px]',
  sm: 'h-8 w-8 rounded-[4px]',
  md: 'h-12 w-12 rounded-md',
  lg: 'h-24 w-24 sm:h-32 sm:w-32 rounded-md',
  xl: 'h-28 w-28 sm:h-36 sm:w-36 rounded-md',
};

const BG_MAP: Record<
  Exclude<
    ProfileAvatarId,
    'dexter-crest' | 'netflix-kids' | 'prime-ghost' | 'crunchyroll-orange' | 'sports-emerald'
  >,
  { bg: string; shine: string }
> = {
  'netflix-red': { bg: '#E50914', shine: '#b80710' },
  'netflix-blue': { bg: '#0071EB', shine: '#0056b3' },
  'netflix-gold': { bg: '#E8A800', shine: '#c28800' },
  'netflix-emerald': { bg: '#15803D', shine: '#0f5c2b' },
  'netflix-purple': { bg: '#7E22CE', shine: '#581c87' },
};

export default function ProfileAvatar({
  avatarId,
  name = 'Profile',
  size = 'md',
  className = '',
}: ProfileAvatarProps) {
  const sizeCls = SIZE_MAP[size];

  if (avatarId === 'dexter-crest') {
    return (
      <div className={`relative overflow-hidden bg-[#1a0b2e] shrink-0 ${sizeCls} ${className}`}>
        <img
          src={DEXTERX_LOGO_URL}
          alt={name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if (avatarId === 'prime-ghost') {
    return (
      <div
        className={`relative overflow-hidden shrink-0 ${sizeCls} ${className}`}
        style={{
          background: 'linear-gradient(145deg, #00A8E1 0%, #0066A6 55%, #001C36 100%)',
        }}
        aria-label={name}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
          <circle cx="50" cy="36" r="17" fill="#ffffff" fillOpacity="0.94" />
          <path d="M22 86 C22 65, 78 65, 78 86 Z" fill="#ffffff" fillOpacity="0.94" />
          <path
            d="M34 50 Q 50 61 66 50"
            fill="none"
            stroke="#001C36"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  if (avatarId === 'crunchyroll-orange') {
    return (
      <div
        className={`relative overflow-hidden shrink-0 ${sizeCls} ${className}`}
        style={{
          background: 'linear-gradient(145deg, #F47521 0%, #C2410C 100%)',
        }}
        aria-label={name}
      >
        <svg viewBox="0 0 64 64" className="h-full w-full p-2" aria-hidden="true">
          <circle cx="32" cy="32" r="24" fill="#ffffff" />
          <circle cx="35.5" cy="34.5" r="15.5" fill="#F47521" />
          <circle cx="38" cy="32" r="9.5" fill="#ffffff" />
          <circle cx="40.5" cy="30" r="4" fill="#F47521" />
        </svg>
      </div>
    );
  }

  if (avatarId === 'sports-emerald') {
    return (
      <div
        className={`relative overflow-hidden shrink-0 ${sizeCls} ${className}`}
        style={{
          background: 'linear-gradient(145deg, #10B981 0%, #047857 55%, #06281E 100%)',
        }}
        aria-label={name}
      >
        <svg viewBox="0 0 64 64" className="h-full w-full p-2" aria-hidden="true">
          <path
            d="M32 8 L52 16 V32 C52 44 43 52 32 56 C21 52 12 44 12 32 V16 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <polygon points="32,19 39,25 36,34 28,34 25,25" fill="#FFFFFF" />
          <line x1="32" y1="34" x2="32" y2="46" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (avatarId === 'netflix-kids') {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden shrink-0 ${sizeCls} ${className}`}
        style={{
          background: 'linear-gradient(135deg, #2563EB 0%, #EC4899 52%, #F59E0B 100%)',
        }}
      >
        <span className="font-display font-black tracking-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] text-[10px] sm:text-sm md:text-base lg:text-2xl select-none">
          {size === 'xs' || size === 'sm' ? 'KIDS' : 'kids'}
        </span>
      </div>
    );
  }

  const palette = BG_MAP[avatarId] || BG_MAP['netflix-red'];

  return (
    <div
      className={`relative overflow-hidden shrink-0 ${sizeCls} ${className}`}
      style={{ backgroundColor: palette.bg }}
      aria-label={name}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={`grad-${avatarId}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={palette.bg} />
            <stop offset="100%" stopColor={palette.shine} />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#grad-${avatarId})`} />
        <circle cx="30" cy="36" r="7.5" fill="#ffffff" />
        <circle cx="70" cy="36" r="7.5" fill="#ffffff" />
        <path
          d="M 24 62 Q 55 82 79 58"
          fill="none"
          stroke="#ffffff"
          strokeWidth="7.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
