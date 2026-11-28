import { useEffect, useState } from 'react';
import { playPlatformIntroSound } from '../lib/dexterxSound';
import type { StreamingPlatform } from '../shared/types';
import { DEXTERX_LOGO_URL } from './Navbar';

interface NetflixIntroSplashProps {
  open: boolean;
  platform: StreamingPlatform;
  durationMs?: number;
  onFinish: () => void;
}

const NETFLIX_RIBBONS = [
  { color: '#E50914', width: 'w-2 sm:w-4', delay: '0ms', speed: 'scale-y-125' },
  { color: '#831010', width: 'w-1 sm:w-2', delay: '50ms', speed: 'scale-y-110' },
  { color: '#FF1F38', width: 'w-3 sm:w-5', delay: '20ms', speed: 'scale-y-150' },
  { color: '#0071EB', width: 'w-1 sm:w-2.5', delay: '80ms', speed: 'scale-y-105' },
  { color: '#E50914', width: 'w-2.5 sm:w-4', delay: '35ms', speed: 'scale-y-125' },
  { color: '#9333EA', width: 'w-1.5 sm:w-3', delay: '95ms', speed: 'scale-y-110' },
  { color: '#F59E0B', width: 'w-1 sm:w-2', delay: '65ms', speed: 'scale-y-125' },
  { color: '#E50914', width: 'w-4 sm:w-6', delay: '10ms', speed: 'scale-y-150' },
  { color: '#FFFFFF', width: 'w-0.5 sm:w-1', delay: '115ms', speed: 'scale-y-125' },
  { color: '#B20710', width: 'w-3 sm:w-5', delay: '45ms', speed: 'scale-y-110' },
  { color: '#38BDF8', width: 'w-1 sm:w-2', delay: '85ms', speed: 'scale-y-125' },
  { color: '#E50914', width: 'w-2.5 sm:w-4', delay: '25ms', speed: 'scale-y-150' },
  { color: '#FF2A3C', width: 'w-2 sm:w-3', delay: '70ms', speed: 'scale-y-110' },
  { color: '#7E22CE', width: 'w-1.5 sm:w-2.5', delay: '105ms', speed: 'scale-y-125' },
  { color: '#E50914', width: 'w-3.5 sm:w-5', delay: '15ms', speed: 'scale-y-150' },
  { color: '#FFFFFF', width: 'w-0.5 sm:w-1', delay: '120ms', speed: 'scale-y-110' },
  { color: '#E50914', width: 'w-2 sm:w-4', delay: '40ms', speed: 'scale-y-125' },
  { color: '#F43F5E', width: 'w-1.5 sm:w-3', delay: '80ms', speed: 'scale-y-110' },
  { color: '#B80710', width: 'w-2.5 sm:w-4', delay: '55ms', speed: 'scale-y-150' },
];

const PRIME_BEAMS = [
  '#00A8E1',
  '#1A98FF',
  '#38BDF8',
  '#FFFFFF',
  '#0284C7',
  '#00A8E1',
  '#7DD3FC',
  '#005F9E',
  '#00A8E1',
  '#38BDF8',
  '#FFFFFF',
  '#0284C7',
  '#00A8E1',
  '#1A98FF',
];

const LETTERS = ['D', 'E', 'X', 'T', 'E', 'R', 'X'];

export default function NetflixIntroSplash({
  open,
  platform,
  durationMs = 4800,
  onFinish,
}: NetflixIntroSplashProps) {
  const [stage, setStage] = useState<'horizon' | 'monolith' | 'ribbons' | 'flash'>('horizon');
  const [audioEngaged, setAudioEngaged] = useState(false);

  useEffect(() => {
    if (!open) return;

    setStage('horizon');
    let played = false;

    const engageAudio = () => {
      if (played) return;
      playPlatformIntroSound(platform, false).then((ok) => {
        if (ok) {
          played = true;
          setAudioEngaged(true);
        }
      });
    };

    engageAudio();

    const onInteract = () => engageAudio();
    window.addEventListener('pointerdown', onInteract);
    window.addEventListener('touchstart', onInteract);
    window.addEventListener('keydown', onInteract);

    const t1 = window.setTimeout(() => setStage('monolith'), 520);
    const t2 = window.setTimeout(() => setStage('ribbons'), Math.max(2200, durationMs - 1450));
    const t3 = window.setTimeout(() => setStage('flash'), Math.max(3000, durationMs - 550));
    const t4 = window.setTimeout(() => onFinish(), durationMs);

    return () => {
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('touchstart', onInteract);
      window.removeEventListener('keydown', onInteract);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [open, platform, durationMs, onFinish]);

  if (!open) return null;

  if (platform === 'prime') {
    return (
      <div
        onClick={() => {
          playPlatformIntroSound('prime', false).then((ok) => {
            if (ok) setAudioEngaged(true);
          });
        }}
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#00050D] transition-opacity duration-500 select-none ${
          stage === 'flash' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        role="status"
        aria-label="Loading Prime Video by Dexterx Cenima"
      >
        {/* Azure Midnight Ambient Glow */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 transition-all duration-1000 ${
            stage === 'horizon'
              ? 'bg-[radial-gradient(circle_at_center,rgba(0,168,225,0.18)_0%,#00050D_62%)]'
              : stage === 'monolith'
                ? 'bg-[radial-gradient(circle_at_center,rgba(0,168,225,0.38)_0%,rgba(6,19,34,0.95)_58%,#00050D_100%)]'
                : 'bg-[radial-gradient(circle_at_center,rgba(26,152,255,0.62)_0%,#00050D_78%)]'
          }`}
        />

        {/* Azure Laser Scan */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00A8E1] to-transparent shadow-[0_0_28px_#00A8E1] transition-all duration-500 ${
            stage === 'horizon' ? 'scale-x-100 opacity-100' : 'scale-x-150 opacity-0'
          }`}
        />

        {/* Blue Light Beams Rush on Exit */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 flex items-center justify-center gap-2 sm:gap-3 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            stage === 'ribbons' || stage === 'flash'
              ? 'scale-[3.3] opacity-100'
              : 'scale-[0.35] opacity-0'
          }`}
        >
          {PRIME_BEAMS.map((color, idx) => (
            <div
              key={idx}
              className="h-[155vh] w-2 sm:w-4 rounded-full"
              style={{
                background: `linear-gradient(180deg, transparent 0%, ${color} 30%, ${color} 70%, transparent 100%)`,
                boxShadow: `0 0 36px ${color}`,
                transform: `translateY(${idx % 2 === 0 ? '-6%' : '6%'})`,
              }}
            />
          ))}
        </div>

        {/* Center Prime Video Azure Showcase */}
        <div
          className={`relative z-10 flex flex-col items-center px-4 transition-all duration-[1300ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            stage === 'horizon'
              ? 'scale-75 opacity-0'
              : stage === 'monolith'
                ? 'scale-100 opacity-100'
                : 'scale-[2.1] opacity-0 blur-[2px]'
          }`}
        >
          <div className="mb-4 relative">
            <div
              aria-hidden="true"
              className="absolute -inset-2 rounded-2xl bg-[#00A8E1]/45 blur-xl animate-pulse"
            />
            <img
              src={DEXTERX_LOGO_URL}
              alt="Dexterx Prime Emblem"
              referrerPolicy="no-referrer"
              className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl border border-[#00A8E1]/50 object-cover shadow-[0_0_40px_rgba(0,168,225,0.75)] dx-intro-crest"
            />
          </div>

          <div className="flex flex-col items-center">
            <span className="font-display text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white drop-shadow-[0_0_45px_rgba(0,168,225,0.85)]">
              prime <span className="font-light text-[#00A8E1]">video</span>
            </span>

            <svg viewBox="0 0 260 54" className="-mt-1 h-11 w-56 sm:h-14 sm:w-72" aria-hidden="true">
              <path
                d="M18 14 C 90 50, 170 50, 232 14"
                fill="none"
                stroke="#00A8E1"
                strokeWidth="9"
                strokeLinecap="round"
                className="prime-smile-stroke"
              />
              <path
                d="M214 9 L238 13 L228 34"
                fill="none"
                stroke="#00A8E1"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="prime-smile-stroke"
              />
            </svg>
          </div>

          <p className="mt-2 text-xs sm:text-sm font-extrabold uppercase tracking-[0.55em] text-sky-200/90 dx-intro-subtitle">
            DEXTERX · GHOST DEXTER
          </p>

          <div className="mt-7 h-[3px] w-48 sm:w-72 overflow-hidden rounded-full bg-white/15">
            <div className="h-full bg-[#00A8E1] shadow-[0_0_16px_#00A8E1] dx-intro-bar" />
          </div>
        </div>

        {!audioEngaged && (
          <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <p className="animate-pulse text-[11px] font-medium uppercase tracking-[0.25em] text-sky-200/60">
              Engaging Prime Azure Studio Audio...
            </p>
          </div>
        )}
      </div>
    );
  }

  if (platform === 'crunchyroll') {
    return (
      <div
        onClick={() => {
          playPlatformIntroSound('crunchyroll', false).then((ok) => {
            if (ok) setAudioEngaged(true);
          });
        }}
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#0A0908] transition-opacity duration-500 select-none ${
          stage === 'flash' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        role="status"
        aria-label="Loading Crunchyroll Anime Vault"
      >
        {/* Fiery Anime Ember Glow */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 transition-all duration-1000 ${
            stage === 'horizon'
              ? 'bg-[radial-gradient(circle_at_center,rgba(244,117,33,0.18)_0%,#0A0908_62%)]'
              : stage === 'monolith'
                ? 'bg-[radial-gradient(circle_at_center,rgba(244,117,33,0.42)_0%,rgba(28,12,4,0.94)_58%,#0A0908_100%)]'
                : 'bg-[radial-gradient(circle_at_center,rgba(255,138,52,0.68)_0%,#0A0908_78%)]'
          }`}
        />

        {/* Anime Vertical Speed Slash Ribbons on Exit */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 flex items-center justify-center gap-2 sm:gap-3 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            stage === 'ribbons' || stage === 'flash'
              ? 'scale-[3.3] opacity-100'
              : 'scale-[0.35] opacity-0'
          }`}
        >
          {Array.from({ length: 16 }).map((_, idx) => {
            const c = idx % 3 === 0 ? '#F47521' : idx % 3 === 1 ? '#FF9F43' : '#FFFFFF';
            return (
              <div
                key={idx}
                className="h-[160vh] w-1.5 sm:w-3.5 rounded-full"
                style={{
                  background: `linear-gradient(180deg, transparent 0%, ${c} 28%, ${c} 72%, transparent 100%)`,
                  boxShadow: `0 0 32px ${c}`,
                  transform: `translateY(${idx % 2 === 0 ? '-8%' : '8%'})`,
                }}
              />
            );
          })}
        </div>

        {/* Center Crunchyroll Spiral Crest + Anime Wordmark */}
        <div
          className={`relative z-10 flex flex-col items-center px-4 transition-all duration-[1300ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            stage === 'horizon'
              ? 'scale-75 opacity-0'
              : stage === 'monolith'
                ? 'scale-100 opacity-100'
                : 'scale-[2.1] opacity-0 blur-[2px]'
          }`}
        >
          <div className="mb-5 flex items-center gap-4">
            <img
              src={DEXTERX_LOGO_URL}
              alt="Dexterx Anime Crest"
              referrerPolicy="no-referrer"
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-[#F47521]/70 object-cover shadow-[0_0_32px_rgba(244,117,33,0.75)] dx-intro-crest"
            />
            <svg
              viewBox="0 0 64 64"
              className="h-20 w-20 sm:h-24 sm:w-24 crunchy-spiral-anim drop-shadow-[0_0_40px_rgba(244,117,33,0.9)]"
              aria-hidden="true"
            >
              <circle cx="32" cy="32" r="28" fill="#F47521" />
              <circle cx="36" cy="35" r="18" fill="#0A0908" />
              <circle cx="39" cy="32" r="11" fill="#F47521" />
              <circle cx="42" cy="29.5" r="4.5" fill="#0A0908" />
            </svg>
          </div>

          <h1
            className="font-display text-4xl sm:text-7xl font-black tracking-tight text-[#F47521]"
            style={{
              textShadow: '0 0 48px rgba(244, 117, 33, 0.85), 0 12px 32px rgba(0, 0, 0, 0.95)',
            }}
          >
            crunchyroll
          </h1>

          <p className="mt-3 text-xs sm:text-base font-extrabold uppercase tracking-[0.52em] text-white/90 dx-intro-subtitle">
            DEXTERX ANIME VAULT
          </p>

          <p className="mt-1.5 text-[10px] sm:text-xs font-medium uppercase tracking-[0.3em] text-orange-200/60 dx-intro-subtitle">
            Pure Anime Only · Ghost Dexter
          </p>

          <div className="mt-7 h-[3px] w-48 sm:w-72 overflow-hidden rounded-full bg-white/15">
            <div className="h-full bg-[#F47521] shadow-[0_0_16px_#F47521] dx-intro-bar" />
          </div>
        </div>

        {!audioEngaged && (
          <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <p className="animate-pulse text-[11px] font-medium uppercase tracking-[0.25em] text-orange-200/60">
              Engaging Anime Taiko Audio...
            </p>
          </div>
        )}
      </div>
    );
  }

  if (platform === 'sports') {
    return (
      <div
        onClick={() => {
          playPlatformIntroSound('sports', false).then((ok) => {
            if (ok) setAudioEngaged(true);
          });
        }}
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#060A09] transition-opacity duration-500 select-none ${
          stage === 'flash' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        role="status"
        aria-label="Loading Dexterx Sports Arena"
      >
        {/* Emerald Stadium Floodlight Ambient Glow */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 transition-all duration-1000 ${
            stage === 'horizon'
              ? 'bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.22)_0%,#060A09_64%)]'
              : stage === 'monolith'
                ? 'bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.42)_0%,rgba(6,40,30,0.92)_56%,#060A09_100%)]'
                : 'bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.65)_0%,#060A09_78%)]'
          }`}
        />

        {/* Emerald Pitch Horizon Laser */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#10B981] to-transparent shadow-[0_0_28px_#10B981] transition-all duration-500 ${
            stage === 'horizon' ? 'scale-x-100 opacity-100' : 'scale-x-150 opacity-0'
          }`}
        />

        {/* Stadium Emerald & Floodlight Gold Beams on Exit */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 flex items-center justify-center gap-2 sm:gap-3 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            stage === 'ribbons' || stage === 'flash'
              ? 'scale-[3.3] opacity-100'
              : 'scale-[0.35] opacity-0'
          }`}
        >
          {Array.from({ length: 16 }).map((_, idx) => {
            const c = idx % 3 === 0 ? '#10B981' : idx % 3 === 1 ? '#F59E0B' : '#FFFFFF';
            return (
              <div
                key={idx}
                className="h-[160vh] w-1.5 sm:w-3.5 rounded-full"
                style={{
                  background: `linear-gradient(180deg, transparent 0%, ${c} 28%, ${c} 72%, transparent 100%)`,
                  boxShadow: `0 0 32px ${c}`,
                  transform: `translateY(${idx % 2 === 0 ? '-8%' : '8%'})`,
                }}
              />
            );
          })}
        </div>

        {/* Center Dexterx Sports Broadcast Crest */}
        <div
          className={`relative z-10 flex flex-col items-center px-4 transition-all duration-[1300ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            stage === 'horizon'
              ? 'scale-75 opacity-0'
              : stage === 'monolith'
                ? 'scale-100 opacity-100'
                : 'scale-[2.1] opacity-0 blur-[2px]'
          }`}
        >
          <div className="mb-5 flex items-center gap-4">
            <img
              src={DEXTERX_LOGO_URL}
              alt="Dexterx Sports Emblem"
              referrerPolicy="no-referrer"
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-[#10B981]/75 object-cover shadow-[0_0_32px_rgba(16,185,129,0.75)] dx-intro-crest"
            />
            <svg
              viewBox="0 0 64 64"
              className="h-20 w-20 sm:h-24 sm:w-24 dx-intro-crest drop-shadow-[0_0_40px_rgba(16,185,129,0.9)]"
              aria-hidden="true"
            >
              <path
                d="M32 6 L54 15 V31 C54 45 44 54 32 58 C20 54 10 45 10 31 V15 Z"
                fill="#06281E"
                stroke="#10B981"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              <circle cx="32" cy="29" r="11" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
              <polygon points="32,22 38,26.5 35.5,33.5 28.5,33.5 26,26.5" fill="#10B981" />
              <path d="M23 44 H41" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl sm:text-7xl font-black tracking-tight text-white">
              DEXTERX
            </span>
            <span
              className="font-display text-4xl sm:text-7xl font-black tracking-tight text-[#10B981]"
              style={{
                textShadow: '0 0 48px rgba(16, 185, 129, 0.85), 0 12px 32px rgba(0, 0, 0, 0.95)',
              }}
            >
              SPORTS
            </span>
          </div>

          <p className="mt-3 text-xs sm:text-base font-extrabold uppercase tracking-[0.52em] text-emerald-100/90 dx-intro-subtitle">
            LIVE STADIUM ARENA
          </p>

          <p className="mt-1.5 text-[10px] sm:text-xs font-medium uppercase tracking-[0.3em] text-emerald-300/65 dx-intro-subtitle">
            Live Football · Live Cricket · Upcoming Fixtures · Ghost Dexter
          </p>

          <div className="mt-7 h-[3px] w-48 sm:w-72 overflow-hidden rounded-full bg-white/15">
            <div className="h-full bg-[#10B981] shadow-[0_0_16px_#10B981] dx-intro-bar" />
          </div>
        </div>

        {!audioEngaged && (
          <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <p className="animate-pulse text-[11px] font-medium uppercase tracking-[0.25em] text-emerald-200/60">
              Engaging Stadium Broadcast Audio...
            </p>
          </div>
        )}
      </div>
    );
  }

  if (platform === 'worldchannels') {
    return (
      <div
        onClick={() => {
          playPlatformIntroSound('worldchannels', false).then((ok) => {
            if (ok) setAudioEngaged(true);
          });
        }}
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#07060C] transition-opacity duration-500 select-none ${
          stage === 'flash' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        role="status"
        aria-label="Loading Live World Channel"
      >
        {/* Royal Violet & Gold Satellite Glow */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 transition-all duration-1000 ${
            stage === 'horizon'
              ? 'bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.22)_0%,#07060C_64%)]'
              : stage === 'monolith'
                ? 'bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.44)_0%,rgba(28,15,58,0.92)_56%,#07060C_100%)]'
                : 'bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.68)_0%,#07060C_78%)]'
          }`}
        />

        {/* Violet Satellite Horizon Scan */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent shadow-[0_0_28px_#8B5CF6] transition-all duration-500 ${
            stage === 'horizon' ? 'scale-x-100 opacity-100' : 'scale-x-150 opacity-0'
          }`}
        />

        {/* Royal Violet & Electric Gold Beams on Exit */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 flex items-center justify-center gap-2 sm:gap-3 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            stage === 'ribbons' || stage === 'flash'
              ? 'scale-[3.3] opacity-100'
              : 'scale-[0.35] opacity-0'
          }`}
        >
          {Array.from({ length: 16 }).map((_, idx) => {
            const c = idx % 3 === 0 ? '#8B5CF6' : idx % 3 === 1 ? '#FBBF24' : '#FFFFFF';
            return (
              <div
                key={idx}
                className="h-[160vh] w-1.5 sm:w-3.5 rounded-full"
                style={{
                  background: `linear-gradient(180deg, transparent 0%, ${c} 28%, ${c} 72%, transparent 100%)`,
                  boxShadow: `0 0 32px ${c}`,
                  transform: `translateY(${idx % 2 === 0 ? '-8%' : '8%'})`,
                }}
              />
            );
          })}
        </div>

        {/* Center Live World Channel Globe Crest */}
        <div
          className={`relative z-10 flex flex-col items-center px-4 transition-all duration-[1300ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            stage === 'horizon'
              ? 'scale-75 opacity-0'
              : stage === 'monolith'
                ? 'scale-100 opacity-100'
                : 'scale-[2.1] opacity-0 blur-[2px]'
          }`}
        >
          <div className="mb-5 flex items-center gap-4">
            <img
              src={DEXTERX_LOGO_URL}
              alt="Live World Channel Emblem"
              referrerPolicy="no-referrer"
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-[#8B5CF6]/75 object-cover shadow-[0_0_32px_rgba(139,92,246,0.75)] dx-intro-crest"
            />
            <svg
              viewBox="0 0 64 64"
              className="h-20 w-20 sm:h-24 sm:w-24 dx-intro-crest drop-shadow-[0_0_40px_rgba(139,92,246,0.9)]"
              aria-hidden="true"
            >
              <circle cx="32" cy="32" r="24" fill="#160B2E" stroke="#8B5CF6" strokeWidth="3" />
              <ellipse cx="32" cy="32" rx="11.5" ry="24" fill="none" stroke="#A78BFA" strokeWidth="2.4" />
              <path d="M9 32 H55" stroke="#A78BFA" strokeWidth="2.4" />
              <path d="M13 20 H51" stroke="#8B5CF6" strokeWidth="2" strokeOpacity="0.7" />
              <path d="M13 44 H51" stroke="#8B5CF6" strokeWidth="2" strokeOpacity="0.7" />
              <circle cx="49" cy="15" r="5.5" fill="#FBBF24" />
            </svg>
          </div>

          <div className="flex flex-wrap items-baseline justify-center gap-3 text-center">
            <span className="font-display text-3xl sm:text-7xl font-black tracking-tight text-white">
              LIVE WORLD
            </span>
            <span
              className="font-display text-3xl sm:text-7xl font-black tracking-tight text-[#A78BFA]"
              style={{
                textShadow: '0 0 48px rgba(139, 92, 246, 0.88), 0 12px 32px rgba(0, 0, 0, 0.95)',
              }}
            >
              CHANNEL
            </span>
          </div>

          <p className="mt-3 text-xs sm:text-base font-extrabold uppercase tracking-[0.45em] text-amber-300/95 dx-intro-subtitle">
            GLOBAL BROADCAST NETWORK
          </p>

          <p className="mt-1.5 text-[10px] sm:text-xs font-medium uppercase tracking-[0.3em] text-violet-200/70 dx-intro-subtitle">
            All 550+ Live World TV Channels · Ghost Dexter
          </p>

          <div className="mt-7 h-[3px] w-48 sm:w-72 overflow-hidden rounded-full bg-white/15">
            <div className="h-full bg-[#8B5CF6] shadow-[0_0_16px_#8B5CF6] dx-intro-bar" />
          </div>
        </div>

        {!audioEngaged && (
          <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <p className="animate-pulse text-[11px] font-medium uppercase tracking-[0.25em] text-violet-200/65">
              Engaging Global Satellite Audio...
            </p>
          </div>
        )}
      </div>
    );
  }

  // Default: NETFLIX Crimson 4.8s Splash
  return (
    <div
      onClick={() => {
        playPlatformIntroSound('netflix', false).then((ok) => {
          if (ok) setAudioEngaged(true);
        });
      }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black transition-opacity duration-500 select-none ${
        stage === 'flash' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="status"
      aria-label="Loading Netflix by Dexterx Cenima"
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-all duration-1000 ${
          stage === 'horizon'
            ? 'bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.16)_0%,black_58%)]'
            : stage === 'monolith'
              ? 'bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.4)_0%,rgba(12,0,3,0.96)_62%,black_100%)]'
              : 'bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.6)_0%,rgba(0,0,0,0.92)_75%)]'
        }`}
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent shadow-[0_0_24px_#E50914] transition-all duration-500 ${
          stage === 'horizon' ? 'scale-x-100 opacity-100' : 'scale-x-150 opacity-0'
        }`}
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 flex items-center justify-center gap-1 sm:gap-2.5 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          stage === 'ribbons' || stage === 'flash'
            ? 'scale-[3.4] opacity-100'
            : 'scale-[0.35] opacity-0'
        }`}
      >
        {NETFLIX_RIBBONS.map((col, idx) => (
          <div
            key={idx}
            className={`h-[160vh] rounded-full ${col.width} ${col.speed}`}
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${col.color} 28%, ${col.color} 72%, transparent 100%)`,
              boxShadow: `0 0 32px ${col.color}`,
              transitionDelay: col.delay,
              transform: `translateY(${idx % 2 === 0 ? '-8%' : '8%'})`,
            }}
          />
        ))}
      </div>

      <div
        className={`relative z-10 flex flex-col items-center px-4 transition-all duration-[1300ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          stage === 'horizon'
            ? 'scale-75 opacity-0'
            : stage === 'monolith'
              ? 'scale-100 opacity-100'
              : 'scale-[2.25] opacity-0 blur-[3px]'
        }`}
      >
        <div className="mb-5 relative">
          <div
            aria-hidden="true"
            className="absolute -inset-2 rounded-xl bg-[#E50914]/45 blur-xl animate-pulse"
          />
          <img
            src={DEXTERX_LOGO_URL}
            alt="Dexterx Cenima Emblem"
            referrerPolicy="no-referrer"
            className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-lg border border-white/25 object-cover shadow-[0_0_45px_rgba(229,9,20,0.8)] dx-intro-crest"
          />
        </div>

        <div
          className="flex items-end justify-center gap-1 sm:gap-2 font-display font-black tracking-[-0.04em] text-[#E50914]"
          style={{
            textShadow: '0 0 55px rgba(229, 9, 20, 0.9), 0 16px 36px rgba(0, 0, 0, 0.98)',
          }}
        >
          {LETTERS.map((ch, idx) => {
            const distFromCenter = Math.abs(idx - 3);
            const scaleY = 1 + distFromCenter * 0.055;
            const translateY = distFromCenter * 3;
            return (
              <span
                key={`${ch}-${idx}`}
                className="inline-block text-5xl sm:text-8xl md:text-9xl dx-intro-letter"
                style={{
                  animationDelay: `${450 + idx * 80}ms`,
                  transform: `scaleY(${scaleY}) translateY(${translateY}px)`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>

        <p className="mt-4 text-xs sm:text-base font-extrabold uppercase tracking-[0.65em] text-white/90 dx-intro-subtitle">
          NETFLIX · CENIMA
        </p>

        <p className="mt-2 text-[10px] sm:text-xs font-medium uppercase tracking-[0.3em] text-white/50 dx-intro-subtitle">
          Original Vault · Ghost Dexter
        </p>

        <div className="mt-7 h-[3px] w-48 sm:w-72 overflow-hidden rounded-full bg-white/15">
          <div className="h-full bg-[#E50914] shadow-[0_0_16px_#E50914] dx-intro-bar" />
        </div>
      </div>

      {!audioEngaged && (
        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <p className="animate-pulse text-[11px] font-medium uppercase tracking-[0.25em] text-white/45">
            Engaging Dolby Cinema Audio...
          </p>
        </div>
      )}
    </div>
  );
}
