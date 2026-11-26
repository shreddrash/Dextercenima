import type { FavoriteItem, MediaSummary, MediaType, PlayRecord, PlayerProviderId } from '../shared/types';
import { normalizePlayerProvider } from '../shared/playerSources';

const FAVORITES_KEY = 'dexterx_cenima_favorites_v1';
const PLAY_RECORDS_KEY = 'dexterx_cenima_play_records_v1';
const SEARCH_HISTORY_KEY = 'dexterx_cenima_search_history_v1';
const PROVIDER_KEY = 'dexterx_cenima_provider_v1';
const UPDATE_EVENT = 'dexterx-cenima-storage-update';

function notifyUpdate(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  }
}

export function subscribeVaultUpdates(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener(UPDATE_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(UPDATE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

export function makeMediaKey(mediaType: MediaType, id: number): string {
  return `${mediaType}:${id}`;
}

export function getAllFavorites(): FavoriteItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isFavorited(mediaType: MediaType, id: number): boolean {
  const key = makeMediaKey(mediaType, id);
  return getAllFavorites().some((item) => item.key === key);
}

export function toggleFavorite(item: MediaSummary): boolean {
  const favorites = getAllFavorites();
  const key = makeMediaKey(item.mediaType, item.id);
  const exists = favorites.some((fav) => fav.key === key);

  const next = exists
    ? favorites.filter((fav) => fav.key !== key)
    : [
        {
          key,
          tmdbId: item.id,
          mediaType: item.mediaType,
          title: item.title,
          poster: item.poster,
          year: item.year,
          score: item.score,
          genres: item.genres,
          savedAt: Date.now(),
        },
        ...favorites,
      ];

  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  } catch {
    /* ignore storage quota */
  }
  notifyUpdate();
  return !exists;
}

export function removeFavoriteByKey(key: string): void {
  const next = getAllFavorites().filter((fav) => fav.key !== key);
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  notifyUpdate();
}

export function getAllPlayRecords(): PlayRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PLAY_RECORDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  } catch {
    return [];
  }
}

export function savePlayRecord(record: Omit<PlayRecord, 'key' | 'updatedAt'>): void {
  const key = makeMediaKey(record.mediaType, record.tmdbId);
  const current = getAllPlayRecords().filter((r) => r.key !== key);
  const entry: PlayRecord = {
    ...record,
    key,
    updatedAt: Date.now(),
  };
  const next = [entry, ...current].slice(0, 40);
  try {
    localStorage.setItem(PLAY_RECORDS_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  notifyUpdate();
}

export function deletePlayRecord(key: string): void {
  const next = getAllPlayRecords().filter((r) => r.key !== key);
  try {
    localStorage.setItem(PLAY_RECORDS_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  notifyUpdate();
}

export function clearAllPlayRecords(): void {
  try {
    localStorage.removeItem(PLAY_RECORDS_KEY);
  } catch {
    /* ignore */
  }
  notifyUpdate();
}

export function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addSearchHistory(query: string): void {
  const trimmed = query.trim();
  if (!trimmed) return;
  const existing = getSearchHistory().filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
  const next = [trimmed, ...existing].slice(0, 12);
  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  notifyUpdate();
}

export function removeSearchHistory(query: string): void {
  const next = getSearchHistory().filter((q) => q !== query);
  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  notifyUpdate();
}

export function clearSearchHistory(): void {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch {
    /* ignore */
  }
  notifyUpdate();
}

export function getPreferredProvider(): PlayerProviderId {
  if (typeof window === 'undefined') return 'cinesrc';
  try {
    return normalizePlayerProvider(localStorage.getItem(PROVIDER_KEY));
  } catch {
    return 'cinesrc';
  }
}

export function setPreferredProvider(provider: PlayerProviderId): void {
  try {
    localStorage.setItem(PROVIDER_KEY, provider);
  } catch {
    /* ignore */
  }
}
