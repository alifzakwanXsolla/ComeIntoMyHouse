import { CONFIG } from '../config.js';

export class Timer {
  constructor(bus) {
    this.bus = bus;
    this.left = CONFIG.totalSeconds;
    this.running = false;
    this.warned = new Set();
    bus.on('nikki:addTime', ({ seconds }) => this.add(seconds));
    bus.on('nikki:removeTime', ({ seconds }) => this.add(-seconds));
  }

  start() { this.running = true; }
  stop() { this.running = false; }
  add(s) { this.left = Math.max(0, this.left + s); }
  get fraction() { return this.left / CONFIG.totalSeconds; }

  update(dtMs) {
    if (!this.running) return;
    this.left -= dtMs / 1000;
    for (const w of CONFIG.warningsAt) {
      if (this.left <= w && !this.warned.has(w)) {
        this.warned.add(w);
        if (this.left > w - 5) this.bus.emit('time:warning', { secondsLeft: w });
      }
    }
    if (this.left <= 0) {
      this.left = 0;
      this.running = false;
      this.bus.emit('game:over', { reason: 'time' });
    }
  }

  format() {
    const s = Math.ceil(this.left);
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }
}
