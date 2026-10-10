import { CONFIG } from '../config.js';

// Mood escalates from strikes, time pressure and progress; Nikki (phone) can override via nikki:setMood.
export class Mood {
  constructor(bus, getState) {
    this.bus = bus;
    this.getState = getState; // () => { strikes, solved, timeFraction }
    this.current = 'sweet';
    this.forced = null;
    bus.on('nikki:setMood', ({ mood }) => {
      if (CONFIG.moods[mood]) { this.forced = mood; this.set(mood); }
    });
  }

  get params() { return CONFIG.moods[this.current]; }

  set(mood) {
    if (mood === this.current) return;
    this.current = mood;
    this.bus.emit('mood:changed', { mood });
  }

  evaluate() {
    if (this.forced) return;
    const { strikes, solved, timeFraction } = this.getState();
    const strikeLvl = strikes >= 4 ? 3 : strikes >= 3 ? 2 : strikes >= 2 ? 1 : 0;
    const timeLvl = timeFraction < 0.15 ? 3 : timeFraction < 0.4 ? 2 : timeFraction < 0.7 ? 1 : 0;
    const progLvl = solved >= 4 ? 2 : solved >= 2 ? 1 : 0;
    const lvl = Math.max(strikeLvl, timeLvl, progLvl);
    this.set(CONFIG.moodOrder[lvl]);
  }
}
