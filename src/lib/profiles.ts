import type { ProfileAvatarId, StreamingPlatform, UserProfile } from '../shared/types';
import { getActivePlatform } from './platform';

const PROFILE_EVENT = 'dexterx-cenima-profile-update';
const GATE_OPEN_EVENT = 'dexterx-cenima-gate-open';

function profilesStorageKey(platform: StreamingPlatform): string {
  return `dexterx_cenima_profiles_${platform}_v2`;
}

function activeProfileStorageKey(platform: StreamingPlatform): string {
  return `dexterx_cenima_active_profile_${platform}_v2`;
}

function gateSeenSessionKey(platform: StreamingPlatform): string {
  return `dexterx_cenima_gate_seen_${platform}_v2`;
}

export const DEFAULT_PROFILES_BY_PLATFORM: Record<StreamingPlatform, UserProfile[]> = {
  netflix: [
    {
      id: 'ghost-dexter',
      name: 'Ghost Dexter',
      avatarId: 'dexter-crest',
      isKids: false,
      platform: 'netflix',
      createdAt: 1,
    },
    {
      id: 'kids',
      name: 'Kids',
      avatarId: 'netflix-kids',
      isKids: true,
      platform: 'netflix',
      createdAt: 2,
    },
  ],
  prime: [
    {
      id: 'prime-ghost-dexter',
      name: 'Ghost Dexter',
      avatarId: 'prime-ghost',
      isKids: false,
      platform: 'prime',
      createdAt: 1,
    },
  ],
  crunchyroll: [
    {
      id: 'crunchy-ghost-dexter',
      name: 'Ghost Dexter',
      avatarId: 'crunchyroll-orange',
      isKids: false,
      platform: 'crunchyroll',
      createdAt: 1,
    },
  ],
  sports: [
    {
      id: 'sports-ghost-dexter',
      name: 'Ghost Dexter',
      avatarId: 'sports-emerald',
      isKids: false,
      platform: 'sports',
      createdAt: 1,
    },
  ],
  worldchannels: [
    {
      id: 'world-ghost-dexter',
      name: 'Ghost Dexter',
      avatarId: 'netflix-purple',
      isKids: false,
      platform: 'worldchannels',
      createdAt: 1,
    },
  ],
};

export const AVATAR_CHOICES: Array<{ id: ProfileAvatarId; label: string }> = [
  { id: 'dexter-crest', label: 'DexterX Crest' },
  { id: 'prime-ghost', label: 'Prime Azure' },
  { id: 'crunchyroll-orange', label: 'Crunchy Orange' },
  { id: 'netflix-red', label: 'Crimson Smile' },
  { id: 'netflix-blue', label: 'Cobalt Smile' },
  { id: 'netflix-gold', label: 'Amber Smile' },
  { id: 'netflix-emerald', label: 'Emerald Smile' },
  { id: 'netflix-purple', label: 'Royal Violet' },
  { id: 'netflix-kids', label: 'Kids Rainbow' },
];

function notifyProfileUpdate(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PROFILE_EVENT));
  }
}

export function subscribeProfileUpdates(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener(PROFILE_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(PROFILE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

export function subscribeProfileGateOpen(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener(GATE_OPEN_EVENT, handler);
  return () => window.removeEventListener(GATE_OPEN_EVENT, handler);
}

export function openProfileGate(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(GATE_OPEN_EVENT));
  }
}

export function getProfiles(platform = getActivePlatform()): UserProfile[] {
  const defaults = DEFAULT_PROFILES_BY_PLATFORM[platform];
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = localStorage.getItem(profilesStorageKey(platform));
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return defaults;
    return parsed;
  } catch {
    return defaults;
  }
}

function saveProfiles(profiles: UserProfile[], platform = getActivePlatform()): void {
  try {
    localStorage.setItem(profilesStorageKey(platform), JSON.stringify(profiles));
  } catch {
    /* ignore */
  }
  notifyProfileUpdate();
}

export function getActiveProfile(platform = getActivePlatform()): UserProfile {
  const profiles = getProfiles(platform);
  if (typeof window === 'undefined') return profiles[0];
  try {
    const activeId = localStorage.getItem(activeProfileStorageKey(platform));
    return profiles.find((p) => p.id === activeId) || profiles[0];
  } catch {
    return profiles[0];
  }
}

export function setActiveProfile(
  profileId: string,
  dismissGate = true,
  platform = getActivePlatform(),
): UserProfile {
  const profiles = getProfiles(platform);
  const target = profiles.find((p) => p.id === profileId) || profiles[0];
  try {
    localStorage.setItem(activeProfileStorageKey(platform), target.id);
    if (dismissGate && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(gateSeenSessionKey(platform), '1');
    }
  } catch {
    /* ignore */
  }
  notifyProfileUpdate();
  return target;
}

export function exitKidsMode(): UserProfile {
  const platform = getActivePlatform();
  const profiles = getProfiles(platform);
  const nonKids = profiles.find((p) => !p.isKids) || profiles[0];
  return setActiveProfile(nonKids.id, true, platform);
}

export function enterKidsMode(): UserProfile {
  const platform = getActivePlatform();
  const profiles = getProfiles(platform);
  const kidsProfile = profiles.find((p) => p.isKids);
  if (kidsProfile) {
    return setActiveProfile(kidsProfile.id, true, platform);
  }
  const created = addProfile('Kids', 'netflix-kids', true, platform);
  return setActiveProfile(created.id, true, platform);
}

export function addProfile(
  name: string,
  avatarId: ProfileAvatarId,
  isKids: boolean,
  platform = getActivePlatform(),
): UserProfile {
  const cleanName = name.trim().slice(0, 24) || (isKids ? 'Kids' : 'Guest');
  const id = `${platform}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const profile: UserProfile = {
    id,
    name: cleanName,
    avatarId,
    isKids: platform === 'netflix' ? isKids : false,
    platform,
    createdAt: Date.now(),
  };
  const next = [...getProfiles(platform), profile].slice(0, 8);
  saveProfiles(next, platform);
  return profile;
}

export function updateProfile(
  profileId: string,
  patch: Partial<Pick<UserProfile, 'name' | 'avatarId' | 'isKids'>>,
  platform = getActivePlatform(),
): void {
  const profiles = getProfiles(platform);
  const next = profiles.map((p) => {
    if (p.id !== profileId) return p;
    return {
      ...p,
      ...patch,
      isKids: platform === 'netflix' ? Boolean(patch.isKids ?? p.isKids) : false,
      name: patch.name !== undefined ? patch.name.trim().slice(0, 24) || p.name : p.name,
    };
  });
  saveProfiles(next, platform);
}

export function deleteProfile(profileId: string, platform = getActivePlatform()): void {
  const profiles = getProfiles(platform);
  if (profiles.length <= 1) return;
  const next = profiles.filter((p) => p.id !== profileId);
  saveProfiles(next, platform);
  const currentActive =
    typeof window !== 'undefined' ? localStorage.getItem(activeProfileStorageKey(platform)) : null;
  if (currentActive === profileId) {
    setActiveProfile(next[0].id, true, platform);
  }
}

export function shouldShowProfileGate(platform = getActivePlatform()): boolean {
  if (platform === 'crunchyroll' || platform === 'sports' || platform === 'worldchannels') {
    return false;
  }
  if (typeof window === 'undefined') return false;
  if (window.location.pathname === '/play') return false;
  try {
    return sessionStorage.getItem(gateSeenSessionKey(platform)) !== '1';
  } catch {
    return true;
  }
}

export function dismissProfileGate(platform = getActivePlatform()): void {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(gateSeenSessionKey(platform), '1');
    }
  } catch {
    /* ignore */
  }
  notifyProfileUpdate();
}
