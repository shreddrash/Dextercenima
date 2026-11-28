import { useEffect, useState } from 'react';
import { SPORTS_IMAGES } from '../shared/sportsCatalog';
import type { SportKind } from '../shared/types';

interface SportsArtworkProps {
  src?: string;
  alt: string;
  sport: SportKind;
  isHighlight?: boolean;
  className?: string;
}

export function getSportFallbackImage(sport: SportKind, isHighlight?: boolean): string {
  if (sport === 'football') {
    return isHighlight ? SPORTS_IMAGES.footballTrophy : SPORTS_IMAGES.footballMatch;
  }
  if (sport === 'cricket') {
    return isHighlight ? SPORTS_IMAGES.cricketClassic : SPORTS_IMAGES.cricketMatch;
  }
  return SPORTS_IMAGES.heroStadium;
}

export default function SportsArtwork({
  src,
  alt,
  sport,
  isHighlight = false,
  className = 'h-full w-full object-cover',
}: SportsArtworkProps) {
  const fallback = getSportFallbackImage(sport, isHighlight);
  const [resolvedSrc, setResolvedSrc] = useState<string>(src || fallback);

  useEffect(() => {
    setResolvedSrc(src || fallback);
  }, [src, fallback]);

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => {
        if (resolvedSrc !== fallback) {
          setResolvedSrc(fallback);
        }
      }}
      className={className}
    />
  );
}
