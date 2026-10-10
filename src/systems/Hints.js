import { CONFIG } from '../config.js';
import { HINTS, HINT_ORDER, HINT_NONE } from '../script/hints.js';
import { t } from '../script/text.js';

// Three-tier hints for the puzzle the player is on. Next tier shows on H or after CONFIG.hints.idleSeconds
// without progress. "Current puzzle" = last hint:focus / puzzle:started id, else first unsolved in HINT_ORDER.
export class Hints {
  constructor(scene) {
    this.scene = scene;
    this.bus = scene.bus;
    this.solved = new Set();
    this.focus = null;
    this.tier = {};
    this.idleMs = 0;
    const reset = () => { this.idleMs = 0; };
    this.off = [
      this.bus.on('hint:focus', ({ id }) => this.setFocus(id)),
      this.bus.on('puzzle:started', ({ id }) => this.setFocus(id)),
      this.bus.on('puzzle:progress', reset),
      this.bus.on('puzzle:wrong', reset),
      this.bus.on('puzzle:solved', ({ id }) => {
        this.solved.add(id);
        if (this.focus === id) this.focus = null;
        reset();
      }),
    ];
    scene.events.once('shutdown', () => this.off.forEach((f) => f()));
  }

  setFocus(id) {
    if (!HINTS[id]) return;
    if (id !== this.focus) this.idleMs = 0;
    this.focus = id;
  }

  current() {
    if (this.focus && !this.solved.has(this.focus)) return this.focus;
    return HINT_ORDER.find((id) => !this.solved.has(id)) || null;
  }

  update(dt) {
    this.idleMs += dt;
    if (this.idleMs >= CONFIG.hints.idleSeconds * 1000) this.show(true);
  }

  // Player pressed H (auto=false) or idle timer fired (auto=true; never repeats the last tier).
  request() { this.show(false); }

  show(auto) {
    this.idleMs = 0;
    const id = this.current();
    if (!id) { if (!auto) this.nothingToSay(); return; }
    const keys = HINTS[id];
    const shown = this.tier[id] || 0;
    if (auto && shown >= keys.length) return;
    const tier = Math.min(shown + 1, keys.length);
    this.tier[id] = tier;
    const key = keys[tier - 1];
    const text = t(key);
    this.scene.hud.toast(text, 7000);
    this.bus.emit('hint:shown', { id, tier, key, text, auto });
  }

  nothingToSay() { this.scene.hud.toast(t(HINT_NONE)); }
}
