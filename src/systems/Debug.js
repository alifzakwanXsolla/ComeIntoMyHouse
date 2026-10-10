import { CONFIG, debugEnabled } from '../config.js';
import { ROOMS } from '../world/map.js';
import { bus } from '../bus.js';

// F1 toggles (starts open with ?debug=1). Skip puzzle, add time, teleport, set mood.
export class Debug {
  constructor(scene) {
    this.scene = scene;
    this.el = document.getElementById('debug');
    this.build();
    if (debugEnabled()) this.el.classList.remove('hidden');
    scene.input.keyboard.on('keydown-F1', (e) => {
      e.preventDefault?.();
      this.el.classList.toggle('hidden');
    });
  }

  btn(label, fn) {
    const b = document.createElement('button');
    b.textContent = label;
    b.onclick = () => { fn(); b.blur(); };
    this.el.append(b);
  }

  build() {
    const s = this.scene;
    this.el.innerHTML = '<div>DEBUG (F1)</div>';
    this.btn('Skip next puzzle', () => {
      const p = s.puzzles.all.find((q) => !s.puzzles.isSolved(q.id));
      if (p) s.puzzles.forceSolve(s, p.id);
    });
    this.btn('+60s', () => s.timer.add(60));
    this.btn('-60s', () => s.timer.add(-60));
    this.btn('Open all doors', () => {
      Object.keys(s.doorSprites).forEach((id) => id !== 'front' && s.forcedOpen.add(id));
      s.refreshDoors();
    });
    this.btn('Strike', () => s.puzzles.wrong(s, 'debug'));
    this.el.append(document.createElement('br'));
    for (const id of Object.keys(ROOMS)) {
      this.btn('→ ' + id, () => {
        const r = ROOMS[id];
        s.player.setPosition((r.x + r.w / 2) * CONFIG.tile, (r.y + r.h / 2) * CONFIG.tile);
      });
    }
    this.el.append(document.createElement('br'));
    for (const m of CONFIG.moodOrder) this.btn(m, () => bus.emit('nikki:setMood', { mood: m }));
  }
}
