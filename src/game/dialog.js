// Pokemon-style dialogue box at the bottom of the screen: typewriter text, E / Space / Enter / click to advance.
const FONT = '"Press Start 2P", monospace';

export class Dialog {
  constructor(scene, W, H) {
    this.scene = scene;
    this.box = scene.add.nineslice(6, H - 46, 'box9', undefined, W - 12, 40, 8, 8, 8, 8).setOrigin(0).setDepth(2000);
    this.who = scene.add.text(14, H - 56, '', { fontFamily: FONT, fontSize: '8px', color: '#e0607e', backgroundColor: '#15111b', padding: { x: 3, y: 2 } }).setDepth(2001);
    this.txt = scene.add.text(14, H - 39, '', { fontFamily: FONT, fontSize: '8px', color: '#f2e6d8', wordWrap: { width: W - 30 }, lineSpacing: 5 }).setDepth(2001);
    this.arrow = scene.add.triangle(W - 18, H - 13, 0, 0, 6, 0, 3, 4, 0xe0607e).setOrigin(0).setDepth(2001);
    scene.tweens.add({ targets: this.arrow, alpha: 0, duration: 400, yoyo: true, repeat: -1 });
    this.queue = [];
    this.full = '';
    this.shown = 0;
    this.onDone = null;
    this.setVisible(false);
  }

  get open() { return this.box.visible; }

  setVisible(v) { [this.box, this.txt, this.arrow].forEach((o) => o.setVisible(v)); this.who.setVisible(v && !!this.who.text); }

  // lines: string | string[] | {who, text}[]
  say(lines, onDone) {
    const arr = (Array.isArray(lines) ? lines : [lines]).map((l) => (typeof l === 'string' ? { who: '', text: l } : l));
    if (!arr.length) { onDone?.(); return; }
    this.queue = arr;
    this.onDone = onDone || null;
    this.next();
  }

  next() {
    const l = this.queue.shift();
    if (!l) {
      this.setVisible(false);
      const cb = this.onDone; this.onDone = null;
      cb?.();
      return;
    }
    this.who.setText(l.who || '');
    this.full = l.text;
    this.shown = 0;
    this.txt.setText('');
    this.setVisible(true);
  }

  // returns true if the key was consumed
  advance() {
    if (!this.open) return false;
    if (this.shown < this.full.length) { this.shown = this.full.length; this.txt.setText(this.full); return true; }
    this.next();
    return true;
  }

  update(dt) {
    if (!this.open || this.shown >= this.full.length) { this.arrow.setVisible(this.open); return; }
    this.arrow.setVisible(false);
    this.shown = Math.min(this.full.length, this.shown + dt * 55);
    this.txt.setText(this.full.slice(0, Math.floor(this.shown)));
  }
}
