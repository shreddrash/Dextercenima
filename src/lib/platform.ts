import type { StreamingPlatform } from '../shared/types';

const ACTIVE_PLATFORM_KEY = 'dexterx_cenima_platform_v2';
const LAUNCHER_SEEN_SESSION_KEY = 'dexterx_cenima_launcher_seen_v2';
const PLATFORM_EVENT = 'dexterx-cenima-platform-update';
const LAUNCHER_OPEN_EVENT = 'dexterx-cenima-launcher-open';

export interface PlatformThemeMeta {
  id: StreamingPlatform;
  name: string;
  shortName: string;
  tagline: string;
  accent: string;
  accentHover: string;
  accentHexNoHash: string;
  bg: string;
  surface: string;
  card: string;
  elevated: string;
  hasProfileGate: boolean;
}

export const PLATFORM_THEMES: Record<StreamingPlatform, PlatformThemeMeta> = {
  netflix: {
    id: 'netflix',
    name: 'Netflix',
    shortName: 'Netflix',
    tagline: 'Originals, Blockbusters, Hindi & Kids',
    accent: '#E50914',
    accentHover: '#f40612',
    accentHexNoHash: 'e50914',
    bg: '#141414',
    surface: '#181818',
    card: '#1f1f1f',
    elevated: '#262626',
    hasProfileGate: true,
  },
  prime: {
    id: 'prime',
    name: 'Prime Video',
    shortName: 'Prime',
    tagline: 'Included with Prime · Amazon Originals & 4K Hits',
    accent: '#00A8E1',
    accentHover: '#1A98FF',
    accentHexNoHash: '00a8e1',
    bg: '#00050D',
    surface: '#0F171E',
    card: '#16212C',
    elevated: '#1D2B39',
    hasProfileGate: true,
  },
  crunchyroll: {
    id: 'crunchyroll',
    name: 'Crunchyroll',
    shortName: 'Crunchyroll',
    tagline: 'Pure Anime Simulcasts, Shonen & Anime Films',
    accent: '#F47521',
    accentHover: '#FF8A34',
    accentHexNoHash: 'f47521',
    bg: '#0A0908',
    surface: '#141519',
    card: '#1B1D24',
    elevated: '#242730',
    hasProfileGate: false,
  },
  sports: {
    id: 'sports',
    name: 'Dexterx Sports',
    shortName: 'Sports',
    tagline: 'Live & Upcoming Football and Cricket',
    accent: '#10B981',
    accentHover: '#34D399',
    accentHexNoHash: '10b981',
    bg: '#060A09',
    surface: '#0C1412',
    card: '#111C19',
    elevated: '#182622',
    hasProfileGate: false,
  },
  worldchannels: {
    id: 'worldchannels',
    name: 'Live World Channel',
    shortName: 'World TV',
    tagline: 'Global Live Sports & World Broadcast Channels',
    accent: '#8B5CF6',
    accentHover: '#A78BFA',
    accentHexNoHash: '8b5cf6',
    bg: '#07060C',
    surface: '#100D1B',
    card: '#171326',
    elevated: '#201B34',
    hasProfileGate: false,
  },
};

export function normalizePlatform(val?: string | null): StreamingPlatform {
  if (
    val === 'prime' ||
    val === 'crunchyroll' ||
    val === 'netflix' ||
    val === 'sports' ||
    val === 'worldchannels'
  ) {
    return val;
  }
  return 'netflix';
}

export function applyPlatformThemeCssVars(platform: StreamingPlatform): void {
  if (typeof document === 'undefined') return;
  const meta = PLATFORM_THEMES[platform];
  const root = document.documentElement;
  root.dataset.platform = platform;
  root.style.setProperty('--dx-bg', meta.bg);
  root.style.setProperty('--dx-surface', meta.surface);
  root.style.setProperty('--dx-surface-card', meta.card);
  root.style.setProperty('--dx-surface-elevated', meta.elevated);
  root.style.setProperty('--dx-accent', meta.accent);
  root.style.setProperty('--dx-accent-hover', meta.accentHover);
  root.style.setProperty('--dx-red', meta.accent);
  root.style.setProperty('--dx-red-hover', meta.accentHover);
  if (document.body) {
    document.body.style.backgroundColor = meta.bg;
  }
}

export function getActivePlatform(): StreamingPlatform {
  if (typeof window === 'undefined') return 'netflix';
  try {
    return normalizePlatform(localStorage.getItem(ACTIVE_PLATFORM_KEY));
  } catch {
    return 'netflix';
  }
}

export function setActivePlatform(
  platform: StreamingPlatform,
  dismissLauncher = true,
): StreamingPlatform {
  const norm = normalizePlatform(platform);
  try {
    localStorage.setItem(ACTIVE_PLATFORM_KEY, norm);
    if (dismissLauncher && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(LAUNCHER_SEEN_SESSION_KEY, '1');
    }
  } catch {
    /* ignore */
  }
  applyPlatformThemeCssVars(norm);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PLATFORM_EVENT, { detail: norm }));
  }
  return norm;
}

export function shouldShowPlatformLauncher(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.location.pathname === '/play') return false;
  return true;
}

export function openPlatformLauncher(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(LAUNCHER_OPEN_EVENT));
  }
}

export function dismissPlatformLauncher(): void {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(LAUNCHER_SEEN_SESSION_KEY, '1');
    }
  } catch {
    /* ignore */
  }
}

export function subscribePlatformUpdates(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener(PLATFORM_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(PLATFORM_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

export function subscribePlatformLauncherOpen(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener(LAUNCHER_OPEN_EVENT, handler);
  return () => window.removeEventListener(LAUNCHER_OPEN_EVENT, handler);
}
