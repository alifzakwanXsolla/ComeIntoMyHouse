import { CONFIG } from '../config.js';

// WebAudio with procedural fallback. Files in CONFIG.assets.audio are tried first; failures are silent.
export class GameAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.buffers = {};
    this.bpm = 60;
    this.beatTimer = null;
    this.drone = null;
  }

  // Must be called from a user gesture.
  async init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.6;
    this.master.connect(this.ctx.destination);
    await Promise.all(Object.entries(CONFIG.assets.audio).map(([k, url]) => this.load(k, url)));
  }

  async load(key, url) {
    try {
      const r = await fetch(url);
      if (!r.ok) return;
      this.buffers[key] = await this.ctx.decodeAudioData(await r.arrayBuffer());
    } catch (e) { /* missing file: use procedural */ }
  }

  playBuffer(key, { loop = false, gain = 1 } = {}) {
    const src = this.ctx.createBufferSource();
    const g = this.ctx.createGain();
    src.buffer = this.buffers[key];
    src.loop = loop;
    g.gain.value = gain;
    src.connect(g).connect(this.master);
    src.start();
    return src;
  }

  tone(freq, dur, { type = 'sine', gain = 0.3, slideTo = null, delay = 0 } = {}) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  noise(dur, { gain = 0.3, freq = 800, delay = 0 } = {}) {
    if (!this.ctx) return;
    const n = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = this.ctx.createBufferSource();
    const f = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    s.buffer = buf;
    f.type = 'lowpass';
    f.frequency.value = freq;
    g.gain.value = gain;
    s.connect(f).connect(g).connect(this.master);
    s.start(this.ctx.currentTime + delay);
  }

  startAmbient() {
    if (!this.ctx || this.drone) return;
    if (this.buffers.ambient) { this.drone = this.playBuffer('ambient', { loop: true, gain: 0.5 }); return; }
    const g = this.ctx.createGain();
    g.gain.value = 0.07;
    g.connect(this.master);
    const oscs = [55, 55.7, 82.4].map((f) => {
      const o = this.ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = f;
      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 220;
      o.connect(lp).connect(g);
      o.start();
      return o;
    });
    this.drone = { stop: () => oscs.forEach((o) => o.stop()) };
  }

  setHeartbeat(bpm) { this.bpm = bpm; }

  startHeartbeat() {
    if (!this.ctx || this.beatTimer) return;
    const beat = () => {
      if (this.buffers.heartbeat) this.playBuffer('heartbeat', { gain: 0.7 });
      else {
        this.tone(60, 0.18, { gain: 0.5, slideTo: 38 });
        this.tone(55, 0.18, { gain: 0.35, slideTo: 35, delay: 0.17 });
      }
      this.beatTimer = setTimeout(beat, 60000 / this.bpm);
    };
    beat();
  }

  lock() {
    if (!this.ctx) return;
    if (this.buffers.lock) return this.playBuffer('lock');
    this.tone(90, 0.25, { type: 'square', gain: 0.4, slideTo: 40 });
    this.noise(0.12, { gain: 0.4, freq: 1500 });
  }

  // --- scare sounds (procedural only) ---
  slam() { // distant door: muffled thud + low rumble
    this.tone(70, 0.35, { type: 'square', gain: 0.35, slideTo: 35 });
    this.noise(0.4, { gain: 0.5, freq: 380 });
  }

  footsteps(n = 6) { // slow irregular thuds from the floor above
    let t = 0;
    for (let i = 0; i < n; i++) {
      this.tone(75 + Math.random() * 20, 0.14, { gain: 0.3, slideTo: 40, delay: t });
      this.noise(0.1, { gain: 0.2, freq: 260, delay: t });
      t += 0.5 + Math.random() * 0.25;
    }
  }

  buzz() { // phone vibrating on a table: two short pulses
    for (const d of [0, 0.22]) {
      this.tone(140, 0.15, { type: 'square', gain: 0.1, delay: d });
      this.noise(0.15, { gain: 0.08, freq: 900, delay: d });
    }
  }

  powerDown() {
    this.tone(120, 0.9, { type: 'sawtooth', gain: 0.25, slideTo: 28 });
    this.noise(0.35, { gain: 0.3, freq: 600 });
  }

  click() { this.tone(660, 0.06, { type: 'triangle', gain: 0.15 }); }
  good() { this.tone(523, 0.12, { gain: 0.2 }); this.tone(784, 0.2, { gain: 0.2, delay: 0.1 }); }
  bad() { this.tone(160, 0.3, { type: 'sawtooth', gain: 0.25, slideTo: 90 }); }

  note(i) { this.tone([262, 330, 392, 523][i % 4], 0.45, { type: 'triangle', gain: 0.3 }); }

  stinger() {
    if (!this.ctx) return;
    this.stopLoops();
    if (this.buffers.stinger) return this.playBuffer('stinger');
    this.noise(1.4, { gain: 0.7, freq: 4000 });
    this.tone(880, 1.2, { type: 'sawtooth', gain: 0.35, slideTo: 440 });
    this.tone(932, 1.2, { type: 'sawtooth', gain: 0.35, slideTo: 466 });
    this.tone(40, 1.6, { gain: 0.6 });
  }

  stopLoops() {
    clearTimeout(this.beatTimer);
    this.beatTimer = null;
    try { this.drone?.stop(); } catch (e) { /* already stopped */ }
    this.drone = null;
  }
}
