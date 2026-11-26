import { Film } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PosterArtworkProps {
  src?: string;
  alt: string;
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: 'poster' | 'backdrop';
}

export default function PosterArtwork({
  src,
  alt,
  title,
  subtitle,
  className = '',
  variant = 'poster',
}: PosterArtworkProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--dx-surface-elevated)] via-[var(--dx-surface)] to-[var(--dx-bg)] p-4 text-center ${className}`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            background:
              'radial-gradient(circle at 30% 20%, var(--dx-accent), transparent 65%)',
          }}
        />
        <Film className="relative mb-2 h-8 w-8 text-[var(--dx-accent)] opacity-85" />
        {title && (
          <span className="relative line-clamp-2 font-display text-sm font-bold tracking-tight text-white">
            {title}
          </span>
        )}
        {subtitle && (
          <span className="relative mt-1 text-xs text-white/60">{subtitle}</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={variant === 'backdrop' ? 'eager' : 'lazy'}
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
