// Game progress. One object for the whole run; checkpoints are deep copies of it.
const fresh = () => ({
  room: 'cell',
  spawn: null,
  flags: {},          // flashlight, batteries, light, pcUnlocked, doorOpen, planSeen, boxOpen, hidDone, frontOpen ...
  inv: [],            // icon keys shown in the HUD: icon_flashlight, icon_batteries, icon_key, icon_phone
  seen: {},           // one-shot beats already played
  hintTier: {},       // objective -> next tier index
  pcFails: 0,
});

export const S = fresh();

let checkpoint = null;

export function resetGame() {
  Object.assign(S, fresh());
  checkpoint = null;
}

export function saveCheckpoint(room, spawn) {
  checkpoint = JSON.parse(JSON.stringify({ ...S, room, spawn }));
}

export function loadCheckpoint() {
  if (!checkpoint) return false;
  const c = JSON.parse(JSON.stringify(checkpoint));
  for (const k of Object.keys(S)) delete S[k];
  Object.assign(S, c);
  return true;
}

export const has = (f) => !!S.flags[f];
export const set = (f, v = true) => { S.flags[f] = v; };
export function give(icon) { if (!S.inv.includes(icon)) S.inv.push(icon); }
export function take(icon) { S.inv = S.inv.filter((i) => i !== icon); }

// Current objective, used for hints (H).
export function objective() {
  const f = S.flags;
  if (S.room === 'party') return !f.metFaris ? 'party_faris' : !f.metNikki ? 'party_nikki' : 'party_choice';
  if (S.room === 'restaurant') return 'dinner';
  if (S.room === 'porch') return 'porch';
  if (S.room === 'home') return f.locked ? 'house_sit' : 'house_early';
  if (!f.light) return 'light';
  if (!f.pcUnlocked) return 'pc';
  if (!f.doorOpen) return 'door';
  if (!f.groundReached) return 'corridor';
  if (!f.planSeen) return 'key';
  if (!f.boxOpen) return S.room === 'bedroom' ? 'box' : 'upstairs';
  if (!f.hidDone) return 'hide';
  return 'escape';
}
