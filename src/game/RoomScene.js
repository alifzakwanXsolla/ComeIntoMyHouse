// The one gameplay scene. Each room is a fresh restart of this scene: build from ROOMS data, fade in,
// walk around, interact, leave through an exit (fade out -> restart with the next room).
import { bus } from '../bus.js';
import { frameIndex } from '../art/characters.js';
import { ROOMS } from './rooms.js';
import { S, has, set, give, objective, saveCheckpoint, loadCheckpoint } from './state.js';
import { LOOK, BEATS, HINTS, GAMEOVER, WAKE } from './story.js';
import { Light } from './light.js';
import { Dialog } from './dialog.js';
import { interact } from './interact.js';
import * as panels from './panels.js';

export const W = 320, H = 180;
const T = 16;
const FONT = '"Press Start 2P", monospace';
const FOOT = { w: 8, h: 4 };
const BOUNDS = { x1: 22, x2: 298, y1: 42, y2: 157 };
const DIR_ANG = { down: Math.PI / 2, left: Math.PI, right: 0, up: -Math.PI / 2 };
const SPEED = 62, SNEAK = 30;
const NOISE = { walk: 28, sneak: 0, idle: -24, creak: 45, creakSneak: 16, footWalk: 70, footSneak: 34, hideMove: 90, hideIdle: -12 };

export class RoomScene extends Phaser.Scene {
  constructor() { super('Room'); }

  init(data) {
    this.roomId = data.room || S.room;
    this.spawnAt = data.spawn || ROOMS[this.roomId].spawn;
  }

  create() {
    S.room = this.roomId;
    S.spawn = this.spawnAt;
    this.r = ROOMS[this.roomId];
    this.audio = this.registry.get('audio');
    this.frozen = 0;            // >0 = player cannot move (cutscene, panel)
    this.leaving = false;
    this.noise = 0;
    this.noiseOn = false;
    this.noiseMode = 'walk';
    this.hiding = null;         // null | 'window' | 'hidden'
    this.t = 0;
    this.lastCreak = null;
    this.timers = [];
    // the scene object is reused between rooms, so reset per-room state explicitly
    this.strip = null; this.dust = null; this.hideSpot = null; this.hideTick = null;
    this.bumped = null; this.sneaking = false; this.pushingUp = false; this.lastCreak = null;

    this.buildRoom();
    this.makePlayer();
    this.light = new Light(this, W, H);
    this.dialog = new Dialog(this, W, H);
    this.makeHud();
    this.setupInput();
    this.applyLight();

    this.cameras.main.fadeIn(450, 0, 0, 0);
    this.events.once('shutdown', () => this.cleanup());
    this.onEnter();
  }

  cleanup() {
    this.timers.forEach((t) => clearInterval(t));
    panels.close();
    // keys survive a scene restart, so drop our listeners or they stack up room after room
    for (const k of Object.values(this.keys || {})) k.removeAllListeners();
    this.input.keyboard.off('keydown');
    this.input.off('pointerdown');
  }

  // ------------------------------------------------------------------ building
  buildRoom() {
    const r = this.r;
    this.add.rectangle(0, 0, W, H, 0x07050b).setOrigin(0).setDepth(-2);
    const gaps = r.exits.filter((e) => e.type === 'bottom');
    for (let row = 0; row < 11; row++) for (let col = 0; col < 20; col++) {
      const x = col * T, y = row * T;
      let key;
      if (r.outside && row < 2) key = col < 6 ? (row === 0 ? 'wall_top' : 'wall_block') : null;
      else if (row === 0) key = 'wall_top';
      else if (row === 1) key = r.wall === 'block' ? 'wall_block' : 'wall_paper';
      else if (!r.outside && (col === 0 || col === 19)) key = 'wall_top';
      else if (!r.outside && row === 10 && !gaps.some((g) => x + T > g.x1 && x < g.x2)) key = 'wall_top';
      else key = this.floorKey(col, row);
      if (key) this.add.image(x, y, key).setOrigin(0).setDepth(row < 2 || row === 10 ? 1 : 0).setTint(r.outside && row >= 2 ? 0x6a7088 : 0xffffff);
    }
    if (r.outside) this.buildOutside();

    this.solids = []; this.targets = []; this.glows = [...(r.glows || [])]; this.crt = null; this.led = null;
    this.propImgs = {}; this.flagImgs = {};
    for (const p of r.props) this.addProp(p);
    this.doorImgs = {};
    for (const e of r.exits) this.addExit(e);
    this.creaks = r.creaks || [];
    this.fxG = this.add.graphics().setDepth(950);
    const cg = this.add.graphics().setDepth(0.5);
    for (const c of this.creaks) {
      cg.fillStyle(0x2a1e16, 0.9).fillRect(c.x - 7, c.y - 1, 14, 1);
      cg.fillStyle(0x2a1e16, 0.7).fillRect(c.x - 3, c.y + 1, 7, 1).fillRect(c.x + 2, c.y - 3, 1, 3);
    }
  }

  floorKey(c, r) {
    const f = this.r.floor, n = ((c * 73856093) ^ (r * 19349663)) >>> 0;
    if (f === 'concrete') return n % 11 === 0 ? 'floor_concrete_crack' : n % 7 === 0 ? 'floor_concrete_stain' : 'floor_concrete';
    if (f === 'checker') return 'floor_checker';
    if (f === 'carpet') return 'floor_carpet';
    return n % 5 === 0 ? 'floor_wood2' : 'floor_wood';
  }

  buildOutside() {
    // night sky with a few stars, a street lamp far away
    const g = this.add.graphics().setDepth(0.2);
    g.fillStyle(0x0d1020, 1).fillRect(96, 0, W - 96, 32);
    for (let i = 0; i < 26; i++) g.fillStyle(0xd8d0c0, Math.random() * 0.8 + 0.2).fillRect(100 + Math.random() * 216, Math.random() * 30, 1, 1);
    this.add.image(48, 32, 'door_open').setOrigin(0.5, 1).setDepth(2);
    this.add.rectangle(48, 32, 16, 25, 0xffd890).setOrigin(0.5, 1).setDepth(905); // lit doorway drawn above the darkness
    this.add.triangle(0, 0, 42, 32, 54, 32, 74, 90, 0xffd890, 0.12).setOrigin(0).setDepth(904);
    this.add.triangle(0, 0, 42, 32, 22, 90, 74, 90, 0xffd890, 0.12).setOrigin(0).setDepth(904);
    this.glows.push({ x: 48, y: 44, r: 52 }, { x: 290, y: 60, r: 40 });
    this.add.image(290, 60, 'lamp').setOrigin(0.5, 1).setDepth(60).setScale(1, 1.6).setTint(0x8a8aa0);
    this.nikkiSil = this.add.sprite(48, 33, 'nikki_sil', frameIndex('down', 0)).setOrigin(0.5, 1).setDepth(906);
  }

  addProp(p) {
    if (p.hideFlag && has(p.hideFlag)) return;
    let img, rect;
    if (p.kenney) {
      const rows = p.kenney, w = rows[0].length * T, hgt = rows.length * T;
      const depth = p.kind === 'deco' ? (p.above ? p.y + hgt + 16 : p.wallHit ? 2 : 0.6) : p.y + hgt;
      rows.forEach((row, j) => row.forEach((f, i) => {
        const im = this.add.image(p.x + i * T, p.y + j * T, 'indoor', f).setOrigin(0).setDepth(depth);
        if (p.tint) im.setTint(p.tint);
        if (p.hideFlag) ((this.flagImgs ||= {})[p.hideFlag] ||= []).push(im);
      }));
      if (p.kind === 'floor') {
        const [sw, sh] = p.solid;
        rect = { x: p.x + (w - sw) / 2, y: p.y + hgt - sh, w: sw, h: sh };
        this.solids.push(rect);
      } else rect = p.wallHit ? { x: p.x, y: 32, w, h: 8 } : { x: p.x, y: p.y, w, h: hgt };
    } else if (p.kind === 'wall') {
      const src = this.textures.get(p.key).getSourceImage();
      const x = Math.round(p.x - src.width / 2), y = Math.round(p.y - src.height / 2);
      img = this.add.image(x, y, p.key).setOrigin(0).setDepth(2);
      if (p.led) this.led = { x: x + 2, y: y + 3 };
      rect = { x: p.x - 9, y: 32, w: 18, h: 8 };
    } else {
      img = this.add.image(Math.round(p.x), p.y + 3, p.key).setOrigin(0.5, 1).setDepth(p.y);
      const [sw, sh] = p.solid;
      rect = { x: Math.round(p.x - sw / 2), y: p.y - sh, w: sw, h: sh };
      this.solids.push(rect);
      if (p.glow) this.glows.push({ x: p.x, y: p.y - 20, r: p.glow });
      if (p.crt) {
        this.crt = { x: Math.round(p.x - img.width / 2) + 10, y: p.y + 3 - img.height + 2, w: 12, h: 7 };
        this.glows.push({ x: p.x - 6, y: p.y - 18, r: 34, crt: true });
      }
    }
    if (img && p.tint) img.setTint(p.tint);
    if (p.id) { this.targets.push({ id: p.id, rect, hide: p.hide }); if (img) this.propImgs[p.id] = img; }
  }

  addExit(e) {
    if (e.type === 'door') {
      const img = this.add.image(e.x, 32, this.doorSprite(e)).setOrigin(0.5, 1).setDepth(2);
      this.doorImgs[e.id] = img;
      this.targets.push({ id: e.id, rect: { x: e.x - 8, y: 32, w: 16, h: 10 }, exit: e });
      if (e.strip) this.strip = { x: e.x, y: 33 };
    } else if (e.type === 'stairs') {
      this.add.image(e.x, 34, e.key).setOrigin(0.5, 1).setDepth(1.5);
      this.targets.push({ id: e.id, rect: { x: e.x - 12, y: 32, w: 24, h: 10 }, exit: e });
    }
  }

  doorSprite(e) {
    if (e.id === 'front_door') return has('frontOpen') ? 'door_open' : 'door_locked';
    if (e.id === 'door') return has('doorOpen') ? 'door_open' : 'door_keypad';
    return e.sprite;
  }

  makePlayer() {
    for (const dir of ['down', 'left', 'right', 'up']) {
      const f = (c) => ({ key: 'imran', frame: frameIndex(dir, c) });
      if (!this.anims.exists(`walk-${dir}`)) this.anims.create({ key: `walk-${dir}`, frames: [f(1), f(0), f(2), f(0)], frameRate: 7, repeat: -1 });
      if (!this.anims.exists(`sneak-${dir}`)) this.anims.create({ key: `sneak-${dir}`, frames: [f(3), f(0)], frameRate: 3, repeat: -1 });
    }
    const s = this.spawnAt;
    this.p = { x: s.x, y: s.y, dir: s.dir || 'down', moving: false };
    this.spr = this.add.sprite(s.x, s.y, 'imran', frameIndex(this.p.dir, 0)).setOrigin(0.5, 1);
  }

  makeHud() {
    this.hud = this.add.container(0, 0).setDepth(1500);
    this.slots = [];
    this.redrawInv();
    const name = this.add.text(W / 2, 6, this.r.name.toUpperCase(), { fontFamily: FONT, fontSize: '8px', color: '#f2e6d8', backgroundColor: '#15111bcc', padding: { x: 4, y: 3 } }).setOrigin(0.5, 0).setDepth(1500);
    this.tweens.add({ targets: name, alpha: 0, delay: 1600, duration: 800 });
    this.prompt = this.add.text(0, 0, 'E', { fontFamily: FONT, fontSize: '8px', color: '#15111b', backgroundColor: '#f2e6d8', padding: { x: 2, y: 1 } }).setDepth(1500).setVisible(false);
    this.noiseBg = this.add.rectangle(W - 70, 8, 62, 7, 0x15111b).setOrigin(0).setDepth(1500).setStrokeStyle(1, 0xf2e6d8).setVisible(false);
    this.noiseBar = this.add.rectangle(W - 69, 9, 0, 5, 0xe0607e).setOrigin(0).setDepth(1501).setVisible(false);
    this.noiseLbl = this.add.text(W - 72, 8, 'NOISE', { fontFamily: FONT, fontSize: '6px', color: '#f2e6d8' }).setOrigin(1, 0).setDepth(1501).setVisible(false);
    this.center = this.add.text(W / 2, 40, '', { fontFamily: FONT, fontSize: '8px', color: '#f2e6d8', align: 'center', wordWrap: { width: W - 40 }, backgroundColor: '#15111bcc', padding: { x: 4, y: 3 } }).setOrigin(0.5, 0).setDepth(1500).setVisible(false);
    this.timerBar = this.add.rectangle(W / 2 - 40, 56, 80, 4, 0xe0607e).setOrigin(0).setDepth(1500).setVisible(false);
    this.help = this.add.text(4, H - 8, 'WASD move  SHIFT sneak  E use  H hint  N notes', { fontFamily: FONT, fontSize: '5px', color: '#8a7a6a' }).setDepth(1500);
  }

  redrawInv() {
    this.slots.forEach((s) => s.destroy());
    this.slots = S.inv.map((key, i) => {
      const bg = this.add.nineslice(4 + i * 18, 4, 'box9', undefined, 16, 16, 4, 4, 4, 4).setOrigin(0).setDepth(1500);
      const ic = this.add.image(6 + i * 18, 6, key).setOrigin(0).setDepth(1501);
      return this.add.container(0, 0, [bg, ic]).setDepth(1500);
    });
  }

  setupInput() {
    this.keys = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SHIFT,E,SPACE,ENTER,F,H', false);
    const act = () => {
      if (panels.isOpen()) return;
      if (this.dialog.advance()) return;
      if (this.frozen || this.leaving) return;
      this.tryInteract();
    };
    this.keys.E.on('down', act); this.keys.SPACE.on('down', act); this.keys.ENTER.on('down', act);
    this.input.on('pointerdown', () => { if (!panels.isOpen()) this.dialog.advance(); });
    this.keys.H.on('down', () => { if (!this.dialog.open && !panels.isOpen() && !this.frozen) this.hint(); });
    this.keys.F.on('down', () => { if (has('light') && !this.r.outside) { set('flashOff', !has('flashOff')); this.applyLight(); this.sfx('click'); } });
    if (new URLSearchParams(location.search).get('debug') === '1') this.input.keyboard.on('keydown', (e) => this.debugKey(e.key));
  }

  // ------------------------------------------------------------------ helpers used by interact.js
  say(lines, onDone) { this.dialog.say(lines, onDone); }
  look(id, onDone) { this.say(LOOK[id] || ['...'], onDone); }
  note(id) { bus.emit('note:add', { id }); }
  sfx(name, ...a) { try { this.audio?.[name]?.(...a); } catch (e) { /* audio optional */ } }
  give(icon, label) { give(icon); this.redrawInv(); if (label) this.flashCenter(label); this.sfx('good'); }
  flashCenter(text, ms = 1800) {
    this.center.setText(text).setVisible(true).setAlpha(1);
    this.tweens.killTweensOf(this.center);
    this.tweens.add({ targets: this.center, alpha: 0, delay: ms, duration: 500, onComplete: () => this.center.setVisible(false) });
  }

  // run a puzzle panel with the player frozen
  panel(fn, opts) {
    this.frozen++;
    fn({ ...opts, sfx: (n) => this.sfx(n), onClose: () => { this.frozen = Math.max(0, this.frozen - 1); opts.onClose?.(); } });
  }

  applyLight() {
    const L = this.r.light;
    this.light.dark = L.dark; this.light.personal = L.personal;
    this.light.flash = has('light') && !has('flashOff') && !this.r.outside;
    if (this.roomId === 'cell' && has('light')) this.light.dark = 0.93;
  }

  setDoor(id, key) { this.doorImgs[id]?.setTexture(key); }

  hint() {
    const o = objective();
    const tier = S.hintTier[o] || 0;
    const lines = HINTS[o];
    S.hintTier[o] = Math.min(tier + 1, lines.length - 1);
    this.say([{ who: 'HINT', text: lines[tier] }]);
  }

  // ------------------------------------------------------------------ room flow
  onEnter() {
    const id = this.roomId;
    const once = (k, fn) => { if (!S.seen[k]) { S.seen[k] = true; fn(); } };
    if (id === 'cell') once('wake', () => this.time.delayedCall(500, () => this.say(WAKE, () => { this.note('dinner_pet'); this.note('dinner_lucky'); })));
    if (id === 'corridor' && !S.seen.footsteps) {
      saveCheckpoint('corridor', this.spawnAt);
      this.time.delayedCall(700, () => this.say(BEATS.corridor_enter, () => this.time.delayedCall(1800, () => this.footstepsEvent())));
    }
    if (id === 'hall') once('ground', () => { set('groundReached'); this.time.delayedCall(400, () => this.say(BEATS.ground_enter)); });
    if (this.r.stealth && !has('hidDone')) this.startWater();
    if (id === 'upstairs') once('upstairs', () => { saveCheckpoint('upstairs', this.spawnAt); this.time.delayedCall(400, () => this.say(BEATS.upstairs_enter)); });
    if (this.r.stealth) this.noiseOn = true;
    if (id === 'bedroom' && has('boxOpen') && !has('hidDone')) this.time.delayedCall(500, () => this.nikkiComing());
    if (id === 'outside') this.outsideScene();
  }

  startWater() {
    if (!this.audio?.ctx) return;
    const near = this.roomId === 'upstairs' ? 0.06 : 0.025;
    this.timers.push(setInterval(() => { if (!this.sys.isPaused()) this.audio.noise(0.5, { gain: near, freq: 2600 }); }, 420));
  }

  footstepsEvent() {
    S.seen.footsteps = true;
    this.say(BEATS.footsteps, () => {
      this.noiseOn = true; this.noiseMode = 'foot';
      this.sfx('footsteps', 8);
      this.dust = { x: 40, until: this.t + 5.5 };
      this.time.delayedCall(5500, () => {
        if (this.leaving) return;
        this.noiseOn = false; this.noise = 0; this.dust = null;
        this.say(BEATS.footsteps_pass);
      });
    });
  }

  nikkiComing() {
    this.hiding = 'window';
    this.say(BEATS.nikki_coming, () => {
      this.sfx('slam');
      const total = 7000, end = this.time.now + total;
      this.timerBar.setVisible(true);
      this.flashCenter('HIDE!', 1200);
      this.hideTick = this.time.addEvent({ delay: 50, loop: true, callback: () => {
        const left = Math.max(0, end - this.time.now);
        this.timerBar.width = 80 * (left / total);
        if (left <= 0) { this.hideTick.remove(); this.timerBar.setVisible(false); if (this.hiding === 'window') this.caught(); }
      } });
    });
  }

  hideIn(target) {
    this.hiding = 'hidden';
    this.hideTick?.remove(); this.timerBar.setVisible(false);
    this.hideSpot = target;
    this.spr.setVisible(false);
    this.noiseMode = 'hide'; this.noiseOn = true; this.noise = 0;
    this.flashCenter(BEATS.hidden, 2500);
    this.sfx('setHeartbeat', 110);
    const n = this.add.sprite(160, 178, 'nikki_sil', frameIndex('up', 0)).setOrigin(0.5, 1).setDepth(150);
    const float = (txt) => this.flashCenter(txt, 2200);
    this.tweens.chain({ targets: n, tweens: [
      { y: 130, duration: 2200, onStart: () => { this.sfx('footsteps', 4); float(BEATS.nikki_enters[0]); } },
      { x: 232, y: 114, duration: 1600, onStart: () => n.setFrame(frameIndex('right', 0)) },
      { x: 232, duration: 2600, onStart: () => { n.setFrame(frameIndex('up', 0)); float(BEATS.nikki_box[0]); } },
      { x: 150, y: 110, duration: 1500, onStart: () => { n.setFrame(frameIndex('left', 0)); } },
      { x: 160, y: 182, duration: 2000, onStart: () => { n.setFrame(frameIndex('down', 0)); this.sfx('footsteps', 4); } },
    ], onComplete: () => {
      n.destroy();
      if (this.leaving) return;
      this.hiding = null; this.noiseOn = false; this.noise = 0;
      this.sfx('setHeartbeat', 64);
      set('hidDone');
      this.spr.setVisible(true);
      this.say([...BEATS.nikki_leaves, ...BEATS.phone_back], () => {
        saveCheckpoint('bedroom', { x: this.p.x, y: this.p.y, dir: 'down' });
        this.noiseOn = true; this.noiseMode = 'walk';
        bus.emit('phone:message', { from: 'Faris', text: 'bro where did u go?? u left with that girl and vanished lol' });
      });
    } });
  }

  outsideScene() {
    this.time.delayedCall(600, () => this.say(BEATS.outside, () => {
      this.flashCenter('She just stands in the doorway. Watching.', 2600);
      this.sfx('setHeartbeat', 120);
    }));
  }

  // fade out and restart into another room
  go(to, spawn) {
    if (this.leaving) return;
    this.leaving = true;
    this.sfx('click');
    this.cameras.main.fadeOut(350, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.restart({ room: to, spawn }));
  }

  caught() {
    if (this.leaving) return;
    this.leaving = true;
    this.sfx('stinger');
    this.dialog.setVisible(false);
    this.cameras.main.shake(400, 0.02);
    this.cameras.main.flash(200, 120, 0, 0);
    bus.emit('game:over', { reason: 'caught' });
    this.time.delayedCall(700, () => {
      this.cameras.main.fadeOut(600, 0, 0, 0);
      panels.showGameOver({ ...GAMEOVER, onRetry: () => {
        loadCheckpoint();
        bus.emit('notes:restore', { ids: this.registry.get('noteIds')?.() || [] });
        this.sfx('setHeartbeat', 64);
        this.scene.restart({ room: S.room, spawn: S.spawn });
      } });
    });
  }

  // ------------------------------------------------------------------ interaction
  nearTarget() {
    const { x, y } = this.p;
    let best = null, bd = 14;
    for (const t of this.targets) {
      const r = t.rect;
      const dx = Math.max(r.x - x, 0, x - (r.x + r.w)), dy = Math.max(r.y - (y - 2), 0, (y - 2) - (r.y + r.h));
      const d = Math.hypot(dx, dy);
      if (d < bd) { bd = d; best = t; }
    }
    return best;
  }

  tryInteract() {
    const t = this.nearTarget();
    if (!t) return;
    if (this.hiding === 'window') { if (t.hide) this.hideIn(t); else this.flashCenter('Not here! Bed or wardrobe!', 900); return; }
    if (this.hiding) return;
    if (t.exit) return this.useExit(t.exit);
    interact(this, t.id);
  }

  useExit(e) {
    if (e.lock === 'never') return interact(this, e.id);
    if (e.lock && !has(e.lock)) return interact(this, e.id);
    if (e.id === 'door' || e.id === 'front_door') return interact(this, e.id);
    this.go(e.to, e.spawn);
  }

  // ------------------------------------------------------------------ update
  blocked(x, y) {
    const L = x - FOOT.w / 2, R = x + FOOT.w / 2, Tp = y - FOOT.h;
    const gap = this.r.exits.find((e) => e.type === 'bottom' && L >= e.x1 && R <= e.x2);
    if (x < BOUNDS.x1 && !this.r.outside) return true;
    if (x > BOUNDS.x2 && !this.r.outside) return true;
    if (this.r.outside && x < 8) return true;
    if (y < BOUNDS.y1) return true;
    if (y > BOUNDS.y2 && !gap && !this.r.outside) return true;
    if (this.r.outside && y > 160) return true;
    return this.solids.some((r) => L < r.x + r.w && R > r.x && Tp < r.y + r.h && y > r.y);
  }

  update(_, delta) {
    const dt = Math.min(delta, 50) / 1000;
    this.t += dt;
    this.dialog.update(dt);
    const busy = this.dialog.open || panels.isOpen() || this.frozen > 0 || this.leaving;
    if (!busy && this.hiding !== 'hidden') this.movePlayer(dt);
    else this.p.moving = false;
    this.animate();
    this.checkExits();
    this.updateNoise(dt, busy);
    this.drawFx();
    this.light.update(dt, this.p.x, this.p.y - 11, DIR_ANG[this.p.dir], this.glows);
    const t = !busy && !this.hiding ? this.nearTarget() : (this.hiding === 'window' ? this.nearTarget() : null);
    this.prompt.setVisible(!!t);
    if (t) this.prompt.setPosition(Math.round(this.p.x - 4), Math.round(this.p.y - 34));
  }

  movePlayer(dt) {
    const k = this.keys;
    const vx = (k.D.isDown || k.RIGHT.isDown ? 1 : 0) - (k.A.isDown || k.LEFT.isDown ? 1 : 0);
    const vy = (k.S.isDown || k.DOWN.isDown ? 1 : 0) - (k.W.isDown || k.UP.isDown ? 1 : 0);
    this.p.moving = vx !== 0 || vy !== 0;
    this.sneaking = k.SHIFT.isDown;
    if (!this.p.moving) return;
    const sp = this.sneaking ? SNEAK : SPEED;
    const n = Math.hypot(vx, vy);
    const dx = (vx / n) * sp * dt, dy = (vy / n) * sp * dt;
    if (!this.blocked(this.p.x + dx, this.p.y)) this.p.x += dx;
    if (!this.blocked(this.p.x, this.p.y + dy)) this.p.y += dy;
    this.p.dir = Math.abs(vx) > Math.abs(vy) ? (vx > 0 ? 'right' : 'left') : (vy > 0 ? 'down' : 'up');
    this.pushingUp = vy < 0;
  }

  animate() {
    const { x, y, dir, moving } = this.p;
    this.spr.setPosition(Math.round(x), Math.round(y)).setDepth(y);
    if (this.sneaking && moving) this.spr.anims.play(`sneak-${dir}`, true);
    else if (moving) this.spr.anims.play(`walk-${dir}`, true);
    else { this.spr.anims.stop(); this.spr.setFrame(frameIndex(dir, this.sneaking ? 3 : 0)); }
  }

  checkExits() {
    if (this.leaving || this.dialog.open || panels.isOpen()) return;
    const { x, y } = this.p;
    for (const e of this.r.exits) {
      if (e.type === 'bottom' && y > 164 && x > e.x1 && x < e.x2) return this.go(e.to, e.spawn);
      if ((e.type === 'door' || e.type === 'stairs') && this.p.moving && this.pushingUp && y < BOUNDS.y1 + 1.5 && Math.abs(x - e.x) < (e.type === 'stairs' ? 12 : 7)) {
        if (this.bumped === e.id) continue;
        this.bumped = e.id;
        this.time.delayedCall(900, () => { this.bumped = null; });
        return this.useExit(e);
      }
    }
    if (this.r.outside && x > 300) { this.leaving = true; this.cameras.main.fadeOut(1200, 0, 0, 0); this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('End')); }
  }

  updateNoise(dt, busy) {
    const show = this.noiseOn && !this.leaving;
    [this.noiseBg, this.noiseBar, this.noiseLbl].forEach((o) => o.setVisible(show));
    if (!show) return;
    let rate;
    const k = this.keys;
    const pressing = k.W.isDown || k.A.isDown || k.S.isDown || k.D.isDown || k.UP.isDown || k.DOWN.isDown || k.LEFT.isDown || k.RIGHT.isDown;
    if (this.noiseMode === 'hide') rate = pressing ? NOISE.hideMove : NOISE.hideIdle;
    else if (busy) rate = NOISE.idle;
    else if (this.noiseMode === 'foot') rate = this.p.moving ? (this.sneaking ? NOISE.footSneak : NOISE.footWalk) : NOISE.idle;
    else rate = this.p.moving ? (this.sneaking ? NOISE.sneak : NOISE.walk) : NOISE.idle;
    if (this.noiseMode === 'walk' && this.p.moving && !busy) {
      const c = this.creaks.find((c) => Math.abs(c.x - this.p.x) < 8 && Math.abs(c.y - this.p.y) < 5);
      if (c && c !== this.lastCreak) {
        this.noise += this.sneaking ? NOISE.creakSneak : NOISE.creak;
        this.sfx('tone', 210, 0.35, { type: 'sawtooth', gain: 0.12, slideTo: 150 });
        this.flashCenter('*creak*', 600);
      }
      this.lastCreak = c || null;
    }
    this.noise = Phaser.Math.Clamp(this.noise + rate * dt, 0, 100);
    this.noiseBar.width = 60 * (this.noise / 100);
    this.noiseBar.fillColor = this.noise > 70 ? 0xff3040 : this.noise > 40 ? 0xe0a050 : 0x9a8a70;
    this.sfx('setHeartbeat', 64 + this.noise * 0.9);
    if (this.noise >= 100) this.caught();
  }

  drawFx() {
    const g = this.fxG; g.clear();
    if (this.crt) {
      const { x, y, w, h } = this.crt;
      const flick = (has('pcUnlocked') ? 0.18 : 0.1) + 0.05 * Math.sin(this.t * 31);
      g.fillStyle(0x5fd0c0, flick).fillRect(x, y, w, h);
      g.fillStyle(0xc8fff0, 0.22).fillRect(x, y + Math.floor((this.t * 6) % h), w, 1);
    }
    if (this.led && Math.floor(this.t * 0.9) % 2 === 0) g.fillStyle(0xff3030, 1).fillRect(this.led.x, this.led.y, 1, 1);
    if (this.strip && !has('hidDone')) {
      const a = 0.55 + 0.15 * Math.sin(this.t * 3);
      g.fillStyle(0xffd890, a).fillRect(this.strip.x - 8, this.strip.y, 16, 2);
      g.fillStyle(0xffd890, a * 0.25).fillRect(this.strip.x - 10, this.strip.y + 2, 20, 6);
    }
    if (this.dust) {
      this.dust.x = 40 + ((this.t * 40) % 260);
      for (let i = 0; i < 10; i++) {
        const dx = this.dust.x + Math.sin(i * 7.3 + this.t * 2) * 10, dy = 34 + ((this.t * 50 + i * 13) % 120);
        g.fillStyle(0xc8bca8, 0.7).fillRect(Math.round(dx), Math.round(dy), 1, 1);
      }
    }
    if (this.hiding === 'hidden') {
      g.fillStyle(0x000000, 0.35).fillRect(0, 0, W, H);
      const s = this.hideSpot.rect;
      g.lineStyle(1, 0xe0607e, 0.5 + 0.3 * Math.sin(this.t * 6)).strokeRect(s.x - 2, s.y - 22, s.w + 4, s.h + 24);
    }
  }

  // ------------------------------------------------------------------ debug (?debug=1): number keys jump ahead
  debugKey(k) {
    const jumps = {
      1: () => ['cell', {}],
      2: () => ['corridor', { light: true, pcUnlocked: true, doorOpen: true }],
      3: () => ['hall', { light: true, pcUnlocked: true, doorOpen: true, groundReached: true }],
      4: () => ['study', { light: true, pcUnlocked: true, doorOpen: true, groundReached: true }],
      5: () => ['upstairs', { light: true, pcUnlocked: true, doorOpen: true, groundReached: true, planSeen: true }],
      6: () => ['bedroom', { light: true, pcUnlocked: true, doorOpen: true, groundReached: true, planSeen: true }],
      7: () => ['hall', { light: true, pcUnlocked: true, doorOpen: true, groundReached: true, planSeen: true, boxOpen: true, hidDone: true }],
    };
    if (!jumps[k]) return;
    const [room, flags] = jumps[k]();
    Object.assign(S.flags, flags);
    Object.assign(S.seen, { wake: true, footsteps: room !== 'corridor', ground: true, upstairs: true });
    if (flags.light) { give('icon_flashlight'); }
    if (flags.boxOpen) { give('icon_key'); give('icon_phone'); }
    this.scene.restart({ room });
  }
}

