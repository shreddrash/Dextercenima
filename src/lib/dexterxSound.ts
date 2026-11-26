import type { StreamingPlatform } from '../shared/types';
import { getActivePlatform } from './platform';

let sharedCtx: AudioContext | null = null;
let lastPlayedAt = 0;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!sharedCtx) {
    sharedCtx = new Ctor();
  }
  return sharedCtx;
}

function buildCinemaReverb(ctx: AudioContext, durationSec = 2.4): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.floor(sampleRate * durationSec);
  const impulse = ctx.createBuffer(2, length, sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const channelData = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      const decay = Math.pow(1 - i / length, 2.3);
      channelData[i] = (Math.random() * 2 - 1) * decay;
    }
  }
  return impulse;
}

function createStage(ctx: AudioContext, t0: number) {
  const master = ctx.createDynamicsCompressor();
  master.threshold.value = -8;
  master.knee.value = 16;
  master.ratio.value = 5;
  master.attack.value = 0.004;
  master.release.value = 0.25;

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.95, t0);
  master.connect(masterGain);
  masterGain.connect(ctx.destination);

  const convolver = ctx.createConvolver();
  convolver.buffer = buildCinemaReverb(ctx, 2.4);
  const reverbWet = ctx.createGain();
  reverbWet.gain.setValueAtTime(0.36, t0);
  convolver.connect(reverbWet);
  reverbWet.connect(master);

  const sendToStage = (node: AudioNode) => {
    node.connect(master);
    node.connect(convolver);
  };

  return { sendToStage };
}

/**
 * 1) NETFLIX 4.6s Dolby Cinema Sound:
 * Tension bass riser -> Iconic "TU-DUM" dual slam -> Orchestral fifth sustain -> Ribbon warp drop
 */
function playNetflixScore(ctx: AudioContext, t0: number): void {
  const { sendToStage } = createStage(ctx, t0);

  // Tension riser (0.0 -> 1.15s)
  const riserSub = ctx.createOscillator();
  const riserGain = ctx.createGain();
  riserSub.type = 'sine';
  riserSub.frequency.setValueAtTime(38, t0);
  riserSub.frequency.exponentialRampToValueAtTime(84, t0 + 1.1);
  riserGain.gain.setValueAtTime(0.001, t0);
  riserGain.gain.linearRampToValueAtTime(0.45, t0 + 0.9);
  riserGain.gain.exponentialRampToValueAtTime(0.001, t0 + 1.15);
  riserSub.connect(riserGain);
  sendToStage(riserGain);
  riserSub.start(t0);
  riserSub.stop(t0 + 1.18);

  // Dual impact "TU-DUM" (1.15s & 1.48s)
  const tHit1 = t0 + 1.15;
  const hit1 = ctx.createOscillator();
  const hit1Gain = ctx.createGain();
  hit1.type = 'sine';
  hit1.frequency.setValueAtTime(106, tHit1);
  hit1.frequency.exponentialRampToValueAtTime(48, tHit1 + 0.25);
  hit1Gain.gain.setValueAtTime(0.001, tHit1);
  hit1Gain.gain.linearRampToValueAtTime(0.88, tHit1 + 0.012);
  hit1Gain.gain.exponentialRampToValueAtTime(0.001, tHit1 + 0.34);
  hit1.connect(hit1Gain);
  sendToStage(hit1Gain);
  hit1.start(tHit1);
  hit1.stop(tHit1 + 0.38);

  const tHit2 = t0 + 1.48;
  const hit2 = ctx.createOscillator();
  const hit2Gain = ctx.createGain();
  hit2.type = 'sine';
  hit2.frequency.setValueAtTime(73.42, tHit2);
  hit2.frequency.exponentialRampToValueAtTime(36.71, tHit2 + 2.4);
  hit2Gain.gain.setValueAtTime(0.001, tHit2);
  hit2Gain.gain.linearRampToValueAtTime(1.0, tHit2 + 0.018);
  hit2Gain.gain.exponentialRampToValueAtTime(0.001, tHit2 + 2.8);
  hit2.connect(hit2Gain);
  sendToStage(hit2Gain);
  hit2.start(tHit2);
  hit2.stop(tHit2 + 2.9);

  // Orchestral fifth power chord (1.48s -> 4.2s)
  const chordFilter = ctx.createBiquadFilter();
  chordFilter.type = 'lowpass';
  chordFilter.frequency.setValueAtTime(660, tHit2);
  chordFilter.frequency.exponentialRampToValueAtTime(210, tHit2 + 2.7);
  chordFilter.Q.value = 1.6;
  sendToStage(chordFilter);

  [73.42, 110.0, 146.83, 185.0, 220.0, 293.66].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(freq, tHit2);
    osc.detune.setValueAtTime((idx - 2.5) * 7, tHit2);
    g.gain.setValueAtTime(0.001, tHit2);
    g.gain.linearRampToValueAtTime(0.14 / (idx * 0.35 + 1), tHit2 + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, tHit2 + 2.7);
    osc.connect(g);
    g.connect(chordFilter);
    osc.start(tHit2);
    osc.stop(tHit2 + 2.75);
  });

  // Ribbon warp whoosh (2.8s -> 4.55s)
  const tWarp = t0 + 2.8;
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 1.7), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.setValueAtTime(170, tWarp);
  bp.frequency.exponentialRampToValueAtTime(2200, tWarp + 1.3);
  bp.Q.value = 1.8;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.001, tWarp);
  ng.gain.linearRampToValueAtTime(0.17, tWarp + 0.7);
  ng.gain.exponentialRampToValueAtTime(0.001, tWarp + 1.65);
  noise.connect(bp);
  bp.connect(ng);
  sendToStage(ng);
  noise.start(tWarp);
  noise.stop(tWarp + 1.7);
}

/**
 * 2) PRIME VIDEO 4.6s Azure Studio Chime:
 * Wide crystalline cerulean chime notes (B4 -> E5 -> F#5 -> B5) + warm studio brass pad + smile swoosh
 */
function playPrimeScore(ctx: AudioContext, t0: number): void {
  const { sendToStage } = createStage(ctx, t0);

  // Warm Azure Analog Pad Swell (0.0s -> 4.5s)
  const padFilter = ctx.createBiquadFilter();
  padFilter.type = 'lowpass';
  padFilter.frequency.setValueAtTime(320, t0);
  padFilter.frequency.linearRampToValueAtTime(1400, t0 + 1.8);
  padFilter.frequency.exponentialRampToValueAtTime(380, t0 + 4.4);
  sendToStage(padFilter);

  [123.47, 185.0, 246.94, 329.63].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = idx === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, t0);
    osc.detune.setValueAtTime((idx - 1.5) * 5, t0);
    g.gain.setValueAtTime(0.001, t0);
    g.gain.linearRampToValueAtTime(0.18 / (idx * 0.25 + 1), t0 + 0.75);
    g.gain.setValueAtTime(0.15 / (idx * 0.25 + 1), t0 + 2.8);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + 4.45);
    osc.connect(g);
    g.connect(padFilter);
    osc.start(t0);
    osc.stop(t0 + 4.5);
  });

  // Prime Signature 4-Note Azure Bell Chimes (0.55s, 0.95s, 1.35s, 1.85s)
  const bellNotes = [
    { freq: 493.88, at: 0.55, dur: 1.4 }, // B4
    { freq: 659.25, at: 0.92, dur: 1.4 }, // E5
    { freq: 739.99, at: 1.28, dur: 1.5 }, // F#5
    { freq: 987.77, at: 1.75, dur: 2.3 }, // B5 Hero peak
  ];
  bellNotes.forEach((n) => {
    const start = t0 + n.at;
    const bell = ctx.createOscillator();
    const harmonic = ctx.createOscillator();
    const g = ctx.createGain();
    const hg = ctx.createGain();
    bell.type = 'sine';
    bell.frequency.setValueAtTime(n.freq, start);
    harmonic.type = 'triangle';
    harmonic.frequency.setValueAtTime(n.freq * 2, start);
    g.gain.setValueAtTime(0.001, start);
    g.gain.linearRampToValueAtTime(0.32, start + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, start + n.dur);
    hg.gain.setValueAtTime(0.001, start);
    hg.gain.linearRampToValueAtTime(0.08, start + 0.01);
    hg.gain.exponentialRampToValueAtTime(0.001, start + n.dur * 0.6);
    bell.connect(g);
    harmonic.connect(hg);
    sendToStage(g);
    sendToStage(hg);
    bell.start(start);
    harmonic.start(start);
    bell.stop(start + n.dur + 0.05);
    harmonic.stop(start + n.dur + 0.05);
  });

  // Deep Studio Bass Anchor at Peak (1.75s -> 4.4s)
  const bassStart = t0 + 1.75;
  const sub = ctx.createOscillator();
  const subGain = ctx.createGain();
  sub.type = 'sine';
  sub.frequency.setValueAtTime(61.74, bassStart); // B1
  sub.frequency.exponentialRampToValueAtTime(41.2, bassStart + 2.5);
  subGain.gain.setValueAtTime(0.001, bassStart);
  subGain.gain.linearRampToValueAtTime(0.82, bassStart + 0.04);
  subGain.gain.exponentialRampToValueAtTime(0.001, bassStart + 2.65);
  sub.connect(subGain);
  sendToStage(subGain);
  sub.start(bassStart);
  sub.stop(bassStart + 2.7);

  // Sleek cyan smile swoosh (2.4s -> 4.3s)
  const swStart = t0 + 2.4;
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 1.9), ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const lp = ctx.createBiquadFilter();
  lp.type = 'bandpass';
  lp.frequency.setValueAtTime(420, swStart);
  lp.frequency.exponentialRampToValueAtTime(2800, swStart + 0.9);
  lp.frequency.exponentialRampToValueAtTime(520, swStart + 1.8);
  lp.Q.value = 2.4;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.001, swStart);
  ng.gain.linearRampToValueAtTime(0.14, swStart + 0.85);
  ng.gain.exponentialRampToValueAtTime(0.001, swStart + 1.85);
  src.connect(lp);
  lp.connect(ng);
  sendToStage(ng);
  src.start(swStart);
  src.stop(swStart + 1.9);
}

/**
 * 3) CRUNCHYROLL 4.6s Anime Overture:
 * Energetic pentatonic anime synth arpeggio -> Triple taiko drum hits -> Euphoric supersaw chorus bloom
 */
function playCrunchyrollScore(ctx: AudioContext, t0: number): void {
  const { sendToStage } = createStage(ctx, t0);

  // Triple Anime Taiko Drum Hits (0.25s, 0.85s, 1.55s)
  [0.25, 0.85, 1.55].forEach((offset, i) => {
    const start = t0 + offset;
    const drum = ctx.createOscillator();
    const dg = ctx.createGain();
    drum.type = 'sine';
    drum.frequency.setValueAtTime(i === 2 ? 125 : 108, start);
    drum.frequency.exponentialRampToValueAtTime(42, start + (i === 2 ? 0.6 : 0.35));
    dg.gain.setValueAtTime(0.001, start);
    dg.gain.linearRampToValueAtTime(i === 2 ? 0.95 : 0.72, start + 0.01);
    dg.gain.exponentialRampToValueAtTime(0.001, start + (i === 2 ? 0.75 : 0.4));
    drum.connect(dg);
    sendToStage(dg);
    drum.start(start);
    drum.stop(start + 0.8);
  });

  // Rapid Japanese Pentatonic Synth Run (D5 -> E5 -> F#5 -> A5 -> B5 -> D6 -> F#6)
  const arp = [
    { f: 587.33, t: 0.45 },
    { f: 659.25, t: 0.65 },
    { f: 739.99, t: 0.85 },
    { f: 880.0, t: 1.05 },
    { f: 987.77, t: 1.25 },
    { f: 1174.66, t: 1.45 },
    { f: 1479.98, t: 1.72 },
  ];
  arp.forEach((n, idx) => {
    const start = t0 + n.t;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(n.f, start);
    const dur = idx === arp.length - 1 ? 2.4 : 0.42;
    g.gain.setValueAtTime(0.001, start);
    g.gain.linearRampToValueAtTime(0.26, start + 0.012);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(g);
    sendToStage(g);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  });

  // Euphoric Anime Supersaw Chord Bloom (1.55s -> 4.5s)
  const bloomStart = t0 + 1.55;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(480, bloomStart);
  lp.frequency.exponentialRampToValueAtTime(2400, bloomStart + 0.6);
  lp.frequency.exponentialRampToValueAtTime(420, bloomStart + 2.8);
  sendToStage(lp);

  [146.83, 220.0, 293.66, 369.99, 440.0, 587.33].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, bloomStart);
    osc.detune.setValueAtTime((idx - 2.5) * 10, bloomStart);
    g.gain.setValueAtTime(0.001, bloomStart);
    g.gain.linearRampToValueAtTime(0.14 / (idx * 0.25 + 1), bloomStart + 0.08);
    g.gain.setValueAtTime(0.11 / (idx * 0.25 + 1), bloomStart + 1.5);
    g.gain.exponentialRampToValueAtTime(0.001, bloomStart + 2.95);
    osc.connect(g);
    g.connect(lp);
    osc.start(bloomStart);
    osc.stop(bloomStart + 3.0);
  });

  // Final crisp anime chime sparkle at 3.5s
  const endSparkle = t0 + 3.5;
  [1174.66, 1760.0].forEach((f, idx) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, endSparkle + idx * 0.14);
    g.gain.setValueAtTime(0.001, endSparkle + idx * 0.14);
    g.gain.linearRampToValueAtTime(0.22, endSparkle + idx * 0.14 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, endSparkle + idx * 0.14 + 0.95);
    osc.connect(g);
    sendToStage(g);
    osc.start(endSparkle + idx * 0.14);
    osc.stop(endSparkle + idx * 0.14 + 1.0);
  });
}

export async function playPlatformIntroSound(
  platform: StreamingPlatform = getActivePlatform(),
  force = false,
): Promise<boolean> {
  const nowMs = Date.now();
  if (!force && nowMs - lastPlayedAt < 4200) {
    return true;
  }

  const ctx = getAudioContext();
  if (!ctx) return false;

  try {
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  } catch {
    return false;
  }

  if (ctx.state !== 'running') {
    return false;
  }

  lastPlayedAt = nowMs;
  const t0 = ctx.currentTime + 0.02;

  if (platform === 'prime') {
    playPrimeScore(ctx, t0);
  } else if (platform === 'crunchyroll') {
    playCrunchyrollScore(ctx, t0);
  } else {
    playNetflixScore(ctx, t0);
  }

  return true;
}

export async function playDexterxTudum(force = false): Promise<boolean> {
  return playPlatformIntroSound(getActivePlatform(), force);
}
