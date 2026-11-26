import { useCallback, useEffect, useState } from 'react';
import type { MediaType, PlayerProviderId } from '../shared/types';
import { getPreferredProvider } from './vaultStorage';

export interface AppLocation {
  pathname: string;
  search: string;
  params: URLSearchParams;
}

function readLocation(): AppLocation {
  if (typeof window === 'undefined') {
    return { pathname: '/', search: '', params: new URLSearchParams() };
  }
  return {
    pathname: window.location.pathname || '/',
    search: window.location.search || '',
    params: new URLSearchParams(window.location.search),
  };
}

const NAV_EVENT = 'dexterx-navigate';

export function navigateTo(url: string, replace = false): void {
  if (typeof window === 'undefined') return;
  if (replace) {
    window.history.replaceState({}, '', url);
  } else {
    window.history.pushState({}, '', url);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  window.dispatchEvent(new CustomEvent(NAV_EVENT));
}

export function useAppLocation(): AppLocation {
  const [loc, setLoc] = useState<AppLocation>(() => readLocation());

  useEffect(() => {
    const sync = () => setLoc(readLocation());
    window.addEventListener('popstate', sync);
    window.addEventListener(NAV_EVENT, sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener(NAV_EVENT, sync);
    };
  }, []);

  return loc;
}

export function useNavigate() {
  return useCallback((url: string, replace = false) => {
    navigateTo(url, replace);
  }, []);
}

export function buildPlayUrl(input: {
  tmdbId: number;
  mediaType: MediaType;
  title?: string;
  year?: string;
  poster?: string;
  score?: string;
  season?: number;
  episode?: number;
  provider?: PlayerProviderId;
}): string {
  const params = new URLSearchParams();
  params.set('tmdbId', String(input.tmdbId));
  params.set('type', input.mediaType);
  params.set('provider', input.provider || getPreferredProvider());
  if (input.title) params.set('title', input.title);
  if (input.year) params.set('year', input.year);
  if (input.poster) params.set('poster', input.poster);
  if (input.score) params.set('score', input.score);
  if (input.mediaType === 'tv') {
    params.set('season', String(Math.max(1, input.season || 1)));
    params.set('episode', String(Math.max(1, input.episode || 1)));
  }
  return `/play?${params.toString()}`;
}
