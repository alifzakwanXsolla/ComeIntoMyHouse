import { CONFIG } from '../config.js';

export class Hud {
  constructor() {
    this.timer = document.getElementById('hud-timer');
    this.strikes = document.getElementById('hud-strikes');
    this.prompt = document.getElementById('hud-prompt');
    this.toastEl = document.getElementById('hud-toast');
    this.inv = document.getElementById('hud-inv');
    this.toastT = null;
  }

  setTimer(text) { this.timer.textContent = text; }

  setStrikes(n) {
    const left = CONFIG.maxStrikes - n;
    this.strikes.textContent = '♥'.repeat(left) + '♡'.repeat(n);
  }

  setPrompt(text) {
    this.prompt.style.display = text ? 'block' : 'none';
    if (text) this.prompt.textContent = text;
  }

  toast(text, ms = 3500) {
    this.toastEl.textContent = text;
    this.toastEl.style.opacity = 1;
    clearTimeout(this.toastT);
    this.toastT = setTimeout(() => (this.toastEl.style.opacity = 0), ms);
  }

  setInventory(fragments, total) {
    this.inv.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const s = document.createElement('div');
      s.className = 'slot';
      s.textContent = fragments[i] ?? '·';
      this.inv.appendChild(s);
    }
  }
}
