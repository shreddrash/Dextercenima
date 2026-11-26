import type { MediaType, PlayerProviderId } from './types';

export interface PlayerProvider {
  id: PlayerProviderId;
  label: string;
  tagline: string;
  colorParam?: string;
  subtitleLangParam?: string;
  defaultParams?: Record<string, string>;
  allowsAdvertisingNavigation?: boolean;
}

export const DEFAULT_PLAYER_PROVIDER: PlayerProviderId = 'cinesrc';

export const PLAYER_PROVIDERS: PlayerProvider[] = [
  {
    id: 'cinesrc',
    label: 'CineSrc',
    tagline: 'Ultra-clean purple UI embed',
    colorParam: 'color',
    defaultParams: {
      autoplay: 'true',
      autonext: 'false',
      continueprompt: 'false',
    },
  },
  {
    id: 'bingr',
    label: 'Bingr Direct',
    tagline: 'Native HLS stream player',
  },
  {
    id: 'vidfast',
    label: 'VidFast',
    tagline: 'High-bitrate adaptive mirror',
    subtitleLangParam: 'sub',
    defaultParams: { autoPlay: 'true', autoNext: 'false' },
    allowsAdvertisingNavigation: true,
  },
  {
    id: 'vidsrc-buzz',
    label: 'VidSrc.buzz',
    tagline: 'Multi-CDN fallback stream',
    defaultParams: { autoplay: 'true' },
    allowsAdvertisingNavigation: true,
  },
  {
    id: 'vidsrc-wtf',
    label: 'VidSrc.wtf',
    tagline: 'Secondary archive stream',
    allowsAdvertisingNavigation: true,
  },
];

export function normalizePlayerMediaType(value?: string | null): MediaType {
  return value === 'tv' || value === 'show' ? 'tv' : 'movie';
}

export function normalizePlayerProvider(value?: string | null): PlayerProviderId {
  const normalized = (value || '').trim().toLowerCase();
  return PLAYER_PROVIDERS.some((p) => p.id === normalized)
    ? (normalized as PlayerProviderId)
    : DEFAULT_PLAYER_PROVIDER;
}

export function getPlayerProvider(value?: string | null): PlayerProvider {
  const id = normalizePlayerProvider(value);
  return PLAYER_PROVIDERS.find((p) => p.id === id) || PLAYER_PROVIDERS[0];
}

export function getPlayerSandbox(value?: string | null): string | undefined {
  return getPlayerProvider(value).allowsAdvertisingNavigation
    ? undefined
    : 'allow-scripts allow-same-origin allow-presentation';
}

export function buildProviderUrl(input: {
  provider?: string | null;
  mediaType?: string | null;
  tmdbId: number;
  season?: number;
  episode?: number;
  accentColor?: string | null;
  subtitleLang?: string | null;
}): string {
  const mediaType = normalizePlayerMediaType(input.mediaType);
  const provider = getPlayerProvider(input.provider);
  const season = Math.max(1, Math.floor(input.season || 1));
  const episode = Math.max(1, Math.floor(input.episode || 1));

  if (provider.id === 'bingr') {
    const params = new URLSearchParams({
      tmdbId: String(input.tmdbId),
      type: mediaType,
      season: String(season),
      episode: String(episode),
    });
    return `/direct-player?${params.toString()}`;
  }

  let baseUrl = '';
  if (provider.id === 'vidsrc-buzz') {
    baseUrl =
      mediaType === 'movie'
        ? `https://vidsrc.buzz/embed/movie/${input.tmdbId}`
        : `https://vidsrc.buzz/embed/tv/${input.tmdbId}/${season}/${episode}`;
  } else if (provider.id === 'vidfast') {
    baseUrl =
      mediaType === 'movie'
        ? `https://vidfast.vc/movie/${input.tmdbId}`
        : `https://vidfast.vc/tv/${input.tmdbId}/${season}/${episode}`;
  } else if (provider.id === 'vidsrc-wtf') {
    baseUrl =
      mediaType === 'movie'
        ? `https://vidsrc.wtf/1/movie/${input.tmdbId}`
        : `https://vidsrc.wtf/1/tv/${input.tmdbId}/${season}/${episode}`;
  } else {
    baseUrl =
      mediaType === 'movie'
        ? `https://cinesrc.st/embed/movie/${input.tmdbId}`
        : `https://cinesrc.st/embed/tv/${input.tmdbId}?s=${season}&e=${episode}`;
  }

  const url = new URL(baseUrl);
  Object.entries(provider.defaultParams || {}).forEach(([k, v]) => {
    url.searchParams.set(k, v);
  });

  const accent = (input.accentColor || '9333ea').trim().replace(/^#/, '');
  if (accent && provider.colorParam) {
    url.searchParams.set(provider.colorParam, `#${accent}`);
  }
  const sub = (input.subtitleLang || 'en').trim();
  if (sub && provider.subtitleLangParam) {
    url.searchParams.set(provider.subtitleLangParam, sub);
  }
  return url.toString();
}
