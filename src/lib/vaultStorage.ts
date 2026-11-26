import type { FavoriteItem, MediaSummary, MediaType, PlayRecord, PlayerProviderId } from '../shared/types';
import { normalizePlayerProvider } from '../shared/playerSources';
import { getActiveProfile } from './profiles';

const LEGACY_FAVORITES_KEY = 'dexterx_cenima_favorites_v1';
const LEGACY_PLAY_RECORDS_KEY = 'dexterx_cenima_play_records_v1';
const LEGACY_SEARCH_HISTORY_KEY = 'dexterx_cenima_search_history_v1';
const PROVIDER_KEY = 'dexterx_cenima_provider_v1';
const UPDATE_EVENT = 'dexterx-cenima-storage-update';

function scopedKey(base: string, profileId?: string): string {
  const pid = profileId || getActiveProfile().id;
  return `${base}:${pid}`;
}

function notifyUpdate(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  }
}

export function subscribeVaultUpdates(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener(UPDATE_EVENT, handler);
  window.addEventListener('dexterx-cenima-profile-update', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(UPDATE_EVENT, handler);
    window.removeEventListener('dexterx-cenima-profile-update', handler);
    window.removeEventListener('storage', handler);
  };
}

export function makeMediaKey(mediaType: MediaType, id: number): string {
  return `${mediaType}:${id}`;
}

function readJsonArray<T>(key: string, legacyKey?: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    let raw = localStorage.getItem(key);
    if (!raw && legacyKey && getActiveProfile().id === 'ghost-dexter') {
      raw = localStorage.getItem(legacyKey);
    }
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getAllFavorites(): FavoriteItem[] {
  return readJsonArray<FavoriteItem>(scopedKey('dx_favs_v2'), LEGACY_FAVORITES_KEY);
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
    localStorage.setItem(scopedKey('dx_favs_v2'), JSON.stringify(next));
  } catch {
    /* ignore storage quota */
  }
  notifyUpdate();
  return !exists;
}

export function removeFavoriteByKey(key: string): void {
  const next = getAllFavorites().filter((fav) => fav.key !== key);
  try {
    localStorage.setItem(scopedKey('dx_favs_v2'), JSON.stringify(next));
  } catch {
    /* ignore */
  }
  notifyUpdate();
}

export function getLikedKeys(): string[] {
  return readJsonArray<string>(scopedKey('dx_likes_v2'));
}

export function isLiked(mediaType: MediaType, id: number): boolean {
  return getLikedKeys().includes(makeMediaKey(mediaType, id));
}

export function toggleLike(mediaType: MediaType, id: number): boolean {
  const key = makeMediaKey(mediaType, id);
  const current = getLikedKeys();
  const exists = current.includes(key);
  const next = exists ? current.filter((k) => k !== key) : [key, ...current];
  try {
    localStorage.setItem(scopedKey('dx_likes_v2'), JSON.stringify(next));
  } catch {
    /* ignore */
  }
  notifyUpdate();
  return !exists;
}

export function getAllPlayRecords(): PlayRecord[] {
  const parsed = readJsonArray<PlayRecord>(scopedKey('dx_plays_v2'), LEGACY_PLAY_RECORDS_KEY);
  return [...parsed].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
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
    localStorage.setItem(scopedKey('dx_plays_v2'), JSON.stringify(next));
  } catch {
    /* ignore */
  }
  notifyUpdate();
}

export function deletePlayRecord(key: string): void {
  const next = getAllPlayRecords().filter((r) => r.key !== key);
  try {
    localStorage.setItem(scopedKey('dx_plays_v2'), JSON.stringify(next));
  } catch {
    /* ignore */
  }
  notifyUpdate();
}

export function clearAllPlayRecords(): void {
  try {
    localStorage.removeItem(scopedKey('dx_plays_v2'));
    if (getActiveProfile().id === 'ghost-dexter') {
      localStorage.removeItem(LEGACY_PLAY_RECORDS_KEY);
    }
  } catch {
    /* ignore */
  }
  notifyUpdate();
}

export function getSearchHistory(): string[] {
  return readJsonArray<string>(scopedKey('dx_search_v2'), LEGACY_SEARCH_HISTORY_KEY);
}

export function addSearchHistory(query: string): void {
  const trimmed = query.trim();
  if (!trimmed) return;
  const existing = getSearchHistory().filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
  const next = [trimmed, ...existing].slice(0, 12);
  try {
    localStorage.setItem(scopedKey('dx_search_v2'), JSON.stringify(next));
  } catch {
    /* ignore */
  }
  notifyUpdate();
}

export function removeSearchHistory(query: string): void {
  const next = getSearchHistory().filter((q) => q !== query);
  try {
    localStorage.setItem(scopedKey('dx_search_v2'), JSON.stringify(next));
  } catch {
    /* ignore */
  }
  notifyUpdate();
}

export function clearSearchHistory(): void {
  try {
    localStorage.removeItem(scopedKey('dx_search_v2'));
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
