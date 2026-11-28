import { useEffect, useState } from 'react';

interface ClubLogoProps {
  src?: string;
  name: string;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

function getInitials(name: string): string {
  const words = name
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return 'SP';
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export default function ClubLogo({
  src,
  name,
  color,
  size = 'md',
  className = '',
}: ClubLogoProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const sizeClass =
    size === 'xs'
      ? 'h-7 w-7 text-[10px]'
      : size === 'sm'
        ? 'h-9 w-9 text-[11px]'
        : size === 'lg'
          ? 'h-14 w-14 text-sm'
          : 'h-11 w-11 text-xs';

  const bgAccent = color || '#10B981';

  if (src && !failed) {
    return (
      <div
        className={`relative flex shrink-0 items-center justify-center rounded-xl bg-white/[0.08] p-1.5 ring-1 ring-white/15 shadow-sm ${sizeClass} ${className}`}
      >
        <img
          src={src}
          alt={name}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-xl ring-1 ring-white/20 shadow-inner ${sizeClass} ${className}`}
      style={{
        background: `linear-gradient(145deg, ${bgAccent}38 0%, #0A110F 100%)`,
        borderColor: `${bgAccent}66`,
      }}
      title={name}
    >
      <svg
        viewBox="0 0 36 40"
        className="absolute inset-0 h-full w-full p-1 opacity-40"
        aria-hidden="true"
      >
        <path
          d="M18 2 L32 7 V18 C32 27 25.5 34 18 37 C10.5 34 4 27 4 18 V7 Z"
          fill={bgAccent}
          fillOpacity="0.22"
          stroke={bgAccent}
          strokeWidth="2"
        />
      </svg>
      <span className="relative z-10 font-display font-black tracking-tight text-white drop-shadow">
        {getInitials(name)}
      </span>
    </div>
  );
}
