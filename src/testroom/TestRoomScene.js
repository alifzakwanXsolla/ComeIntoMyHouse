import { CONFIG } from '../config.js';
import { preloadArt, generateAll } from '../art/pixelArt.js';
import { frameIndex } from '../art/characters.js';
import { PixelLight } from '../art/pixelLight.js';
import { ROOM } from './roomLayout.js';
import { buildRoom, makeFx } from './buildRoom.js';

const FONT = CONFIG.render.font;
const FOOT = { w: 8, h: 4 };                       // player collision box at the feet
const DIR_ANG = { down: Math.PI / 2, left: Math.PI, right: 0, up: -Math.PI / 2 };

export class TestRoomScene extends Phaser.Scene {
  constructor() { super('TestRoom'); }

  preload() { preloadArt(this); }

  create() {
    generateAll(this);
    this.room = buildRoom(this);
    this.fx = makeFx(this, this.room);
    this.makeAnims();
    this.makePlayer();
    this.makeNikki();
    this.light = new PixelLight(this);
    this.makeUi();
    this.keys = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SHIFT,E,F,H,L,N,SPACE');
    this.flash = true; this.lights = false; this.hiding = false; this.inv = [];
    this.light.darkness = 0.62;
    this.t = 0;
    for (const k of ['F', 'H', 'L', 'N', 'E', 'SPACE']) this.keys[k].on('down', () => this.onKey(k));
  }

  makeAnims() {
    const a = this.anims;
    for (const dir of ['down', 'left', 'right', 'up']) {
      const f = (c) => ({ key: 'imran', frame: frameIndex(dir, c) });
      a.create({ key: `walk-${dir}`, frames: [f(1), f(0), f(2), f(0)], frameRate: 7, repeat: -1 });
      a.create({ key: `sneak-${dir}`, frames: [f(3)], frameRate: 1 });
    }
  }

  makePlayer() {
    const s = ROOM.start;
    this.p = { x: s.x, y: s.y, dir: 'down', moving: false };
    this.spr = this.add.sprite(s.x, s.y, 'imran', frameIndex('down', 0)).setOrigin(0.5, 1);
  }

  makeNikki() {
    // Silhouette in the keypad doorway: never drawn as a full character.
    this.nikki = this.add.sprite(205, 41, 'nikki_sil', frameIndex('down', 0)).setOrigin(0.5, 1).setDepth(3).setVisible(false);
  }

  makeUi() {
    const W = CONFIG.render.width, H = CONFIG.render.height;
    this.hud = this.add.container(0, 0).setDepth(1000).setScrollFactor(0);
    this.help = this.add.text(4, 3, 'WASD move  SHIFT sneak  E use', { fontFamily: FONT, fontSize: '8px', color: '#c8c0b0' }).setAlpha(0.8);
    this.hud.add(this.help);
    this.slots = [];
    this.prompt = this.add.text(0, 0, 'E', { fontFamily: FONT, fontSize: '8px', color: '#ffe9a8', backgroundColor: '#0a070f', padding: { x: 2, y: 1 } })
      .setDepth(1000).setVisible(false);
    this.box = this.add.nineslice(8, H - 44, 'box9', undefined, W - 16, 38, 8, 8, 8, 8).setOrigin(0).setDepth(1001).setVisible(false);
    this.say = this.add.text(16, H - 38, '', { fontFamily: FONT, fontSize: '8px', color: '#f0e8d8', wordWrap: { width: W - 34 }, lineSpacing: 4 })
      .setDepth(1002).setVisible(false);
    this.sayTimer = null;
  }

  onKey(k) {
    if (k === 'F') this.flash = !this.flash;
    else if (k === 'L') { this.lights = !this.lights; this.light.darkness = this.lights ? 0 : 0.62; }
    else if (k === 'H') this.hiding = !this.hiding;
    else if (k === 'N') this.nikki.setVisible(!this.nikki.visible);
    else if (k === 'E' || k === 'SPACE') this.interact();
  }

  blocked(x, y) {
    const b = ROOM.bounds;
    if (x < b.x1 || x > b.x2 || y < b.y1 || y > b.y2) return true;
    const L = x - FOOT.w / 2, R = x + FOOT.w / 2, T = y - FOOT.h, B = y;
    return this.room.solids.some((r) => L < r.x + r.w && R > r.x && T < r.y + r.h && B > r.y);
  }

  nearTarget() {
    const { x, y } = this.p;
    let best = null, bd = 16;
    for (const t of this.room.targets) {
      const r = t.rect;
      const dx = Math.max(r.x - x, 0, x - (r.x + r.w)), dy = Math.max(r.y - y, 0, y - (r.y + r.h));
      const d = Math.hypot(dx, dy);
      if (d < bd) { bd = d; best = t; }
    }
    return best;
  }

  interact() {
    const t = this.nearTarget();
    if (!t) return;
    this.showText(ROOM.text[t.text] || '...');
    if (t.icon && !this.inv.includes(t.icon)) { this.inv.push(t.icon); this.redrawInventory(); }
  }

  showText(str) {
    this.box.setVisible(true); this.say.setVisible(true).setText(str);
    if (this.sayTimer) this.sayTimer.remove();
    this.sayTimer = this.time.delayedCall(2600, () => { this.box.setVisible(false); this.say.setVisible(false); });
  }

  redrawInventory() {
    this.slots.forEach((s) => s.destroy());
    this.slots = this.inv.map((key, i) => {
      const bg = this.add.nineslice(4 + i * 18, 14, 'box9', undefined, 16, 16, 4, 4, 4, 4).setOrigin(0).setScrollFactor(0).setDepth(1000);
      const ic = this.add.image(6 + i * 18, 15, key).setOrigin(0).setScrollFactor(0).setDepth(1001);
      return this.add.container(0, 0, [bg, ic]).setDepth(1000);
    });
  }

  update(_, delta) {
    const dt = Math.min(delta, 50) / 1000;
    this.t += dt;
    this.movePlayer(dt);
    this.animate();
    this.fx(this.t);
    const flashAng = DIR_ANG[this.p.dir];
    this.light.on = this.flash && !this.lights;
    this.light.update(dt, this.p.x, this.p.y - 11, flashAng, this.room.glows.filter((g) => g.warm || !this.lights).map((g) => ({ x: g.x, y: g.y, r: Math.round(g.r * 0.7) })));
    const t = this.nearTarget();
    this.prompt.setVisible(!!t && !this.box.visible);
    if (t) this.prompt.setPosition(Math.round(this.p.x - 4), Math.round(this.p.y - 32));
  }

  movePlayer(dt) {
    const k = this.keys;
    let vx = (k.D.isDown || k.RIGHT.isDown ? 1 : 0) - (k.A.isDown || k.LEFT.isDown ? 1 : 0);
    let vy = (k.S.isDown || k.DOWN.isDown ? 1 : 0) - (k.W.isDown || k.UP.isDown ? 1 : 0);
    if (this.hiding) { vx = 0; vy = 0; }
    this.p.moving = vx !== 0 || vy !== 0;
    if (!this.p.moving) return;
    this.sneaking = k.SHIFT.isDown;
    const sp = (this.sneaking ? CONFIG.sneakSpeed : CONFIG.playerSpeed) * 0.6;
    const n = Math.hypot(vx, vy);
    const dx = (vx / n) * sp * dt, dy = (vy / n) * sp * dt;
    if (!this.blocked(this.p.x + dx, this.p.y)) this.p.x += dx;
    if (!this.blocked(this.p.x, this.p.y + dy)) this.p.y += dy;
    this.p.dir = Math.abs(vx) > Math.abs(vy) ? (vx > 0 ? 'right' : 'left') : (vy > 0 ? 'down' : 'up');
  }

  animate() {
    const { x, y, dir, moving } = this.p;
    this.spr.setPosition(Math.round(x), Math.round(y)).setDepth(y);
    const sneak = this.keys.SHIFT.isDown;
    if (this.hiding) { this.spr.anims.stop(); this.spr.setFrame(frameIndex(dir, 4)); }
    else if (sneak) this.spr.anims.play(`sneak-${dir}`, true);
    else if (moving) this.spr.anims.play(`walk-${dir}`, true);
    else { this.spr.anims.stop(); this.spr.setFrame(frameIndex(dir, 0)); }
  }
}
