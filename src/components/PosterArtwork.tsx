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
        className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#230c47] via-[#100622] to-[#05020b] p-4 text-center ${className}`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.32),transparent_60%)]"
        />
        <Film className="relative mb-2 h-8 w-8 text-purple-300/75" />
        {title && (
          <span className="relative line-clamp-2 font-display text-sm font-bold tracking-tight text-purple-50">
            {title}
          </span>
        )}
        {subtitle && (
          <span className="relative mt-1 text-xs text-purple-300/75">{subtitle}</span>
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
