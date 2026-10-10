import { bus } from '../bus.js';

// Thin GamePix wrapper. Every call is a safe no-op when the SDK script is absent (local dev, offline).
// Emits bus 'platform:pause' / 'platform:resume' (hidden tab or ad playing) so game and audio can freeze.
const sdk = () => window.GamePix;
const reasons = new Set();

export const state = { audioUnlocked: false };

function setPaused(reason, on) {
  const was = reasons.size > 0;
  if (on) reasons.add(reason); else reasons.delete(reason);
  const now = reasons.size > 0;
  if (now !== was) bus.emit(now ? 'platform:pause' : 'platform:resume', { reason });
}

export function initPlatform() {
  document.addEventListener('visibilitychange', () => setPaused('hidden', document.hidden));
  bus.on('game:win', () => { try { sdk()?.happyMoment?.(); } catch (e) { /* ignore */ } });
}

// Call once the first screen is ready to play.
export function gameLoaded() {
  try { sdk()?.loaded?.(); } catch (e) { /* ignore */ }
}

// Call from a user gesture (title "press to start"). Audio code checks state.audioUnlocked.
export function unlockAudio() {
  if (state.audioUnlocked) return;
  state.audioUnlocked = true;
  bus.emit('platform:audio-unlocked');
}

// Only call between rounds (e.g. end screen), never mid-play or on a timer. Resolves { success } either way.
export async function interstitial() {
  const s = sdk();
  if (!s?.interstitialAd) return { success: false, skipped: true };
  setPaused('ad', true);
  try { return (await s.interstitialAd()) || { success: false }; }
  catch (e) { return { success: false }; }
  finally { setPaused('ad', false); }
}

export function updateLevel(n) {
  try { sdk()?.updateLevel?.(n); } catch (e) { /* ignore */ }
}
