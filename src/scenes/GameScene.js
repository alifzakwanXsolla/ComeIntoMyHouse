import { CONFIG } from '../config.js';
import { bus } from '../bus.js';
import { MAP_W, MAP_H, ROOMS, DOORS, OBJECTS, START, inRoom, buildGrid } from '../world/map.js';
import { PUZZLES } from '../puzzles/index.js';
import { PuzzleManager } from '../systems/PuzzleManager.js';
import { Timer } from '../systems/Timer.js';
import { Mood } from '../systems/Mood.js';
import { Lighting } from '../systems/Lighting.js';
import { Scares } from '../systems/Scares.js';
import { GameAudio } from '../systems/Audio.js';
import { Debug } from '../systems/Debug.js';
import { Hints } from '../systems/Hints.js';
import { Hud } from '../ui/hud.js';
import { Panel } from '../ui/panel.js';

const T = CONFIG.tile;
const HALF = 9; // player collision half-size
const S = T / 16; // integer upscale for 16px art on the 32px grid
const PIXEL_ROOM = 'basement'; // room redrawn in the new pixel-art style so far
const IMRAN_FRAME = 378; // roguelikeChar: front-facing only, so left/right use flipX and a wobble
const DECOR_TINT = 0x8a8a9c;
const OBJECT_ART = { fusebox: 'px_fusebox', wall: 'px_chalk' };

export class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  create() {
    this.bus = bus;
    this.grid = buildGrid();
    this.ended = false;
    this.forcedOpen = new Set();
    this.finalOpen = false;
    this.currentRoom = null;
    this.lastBump = 0;

    this.hud = new Hud();
    this.panel = new Panel(() => { this.puzzles.active = null; });
    this.puzzles = new PuzzleManager(bus);
    PUZZLES.forEach((p) => this.puzzles.register(p));
    this.timer = new Timer(bus);
    this.mood = new Mood(bus, () => ({
      strikes: this.puzzles.totalStrikes,
      solved: this.puzzles.solvedCount,
      timeFraction: this.timer.fraction,
    }));
    this.hints = new Hints(this);
    // Audio is created by TitleScene on the first click; direct boots (e.g. debug) fall back to a lazy gesture.
    this.audio = this.registry.get('audio') || new GameAudio();
    const audioReady = this.registry.get('audioReady') || new Promise((res) => {
      const start = () => res(this.audio.init());
      this.input.keyboard.once('keydown', start);
      this.input.once('pointerdown', start);
    });
    audioReady.then(() => { this.audio.startAmbient(); this.audio.startHeartbeat(); });

    this.drawWorld();
    this.makeObjects();
    this.makePlayer();

    this.cameras.main.setBounds(0, 0, MAP_W * T, MAP_H * T);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.fadeIn(1200, 0, 0, 0);

    this.lighting = new Lighting(this);
    this.scares = new Scares(this);
    this.setupInput();
    this.wireBus();
    this.debug = new Debug(this);

    this.hud.setStrikes(0);
    this.refreshInventory();
    this.timer.start();
    bus.emit('game:start');
    this.time.delayedCall(4500, () => { this.audio.lock(); bus.emit('door:behind'); });
    this.moodClock = 0;
  }

  // ---------- world ----------
  drawWorld() {
    this.cameras.main.setBackgroundColor('#0b0708');
    const g = this.add.graphics().setDepth(0);
    for (const [id, r] of Object.entries(ROOMS)) {
      for (let y = r.y; y < r.y + r.h; y++) {
        for (let x = r.x; x < r.x + r.w; x++) {
          if (id === PIXEL_ROOM) this.add.image(x * T, y * T, this.floorKey(x, y)).setOrigin(0).setScale(S).setDepth(0);
          else g.fillStyle((x + y) % 2 ? r.color : r.alt).fillRect(x * T, y * T, T, T);
        }
      }
    }
    for (const d of Object.values(DOORS)) g.fillStyle(0x2a1d1a).fillRect(d.x * T, d.y * T, T, T);

    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        if (this.grid[y][x] === 1) continue;
        if (!this.touchesFloor(x, y)) continue;
        if (this.touchesRoom(x, y, PIXEL_ROOM)) {
          const front = inRoom(x, y + 1) === PIXEL_ROOM;
          this.add.image(x * T, y * T, front ? 'px_wall_block' : 'px_wall_top').setOrigin(0).setScale(S).setDepth(1);
        } else this.add.image(x * T, y * T, 'wall').setOrigin(0).setDepth(1);
      }
    }

    this.doorSprites = {};
    for (const [id, d] of Object.entries(DOORS)) {
      this.doorSprites[id] = this.add.image(d.x * T, d.y * T, 'door_locked').setOrigin(0).setDepth(2);
      if (id === 'basement') this.doorSprites[id].setScale(S);
    }
    this.refreshDoors();
  }

  floorKey(x, y) {
    const h = (((x * 73856093) ^ (y * 19349663)) >>> 0) % 13;
    return h === 0 ? 'px_floor_concrete_crack' : h === 1 ? 'px_floor_concrete_stain' : 'px_floor_concrete';
  }

  touchesRoom(x, y, room) {
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (this.grid[y + dy]?.[x + dx] === 1 && inRoom(x + dx, y + dy) === room) return true;
    }
    return false;
  }

  touchesFloor(x, y) {
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (this.grid[y + dy]?.[x + dx] === 1) return true;
    }
    return false;
  }

  doorOpen(id) {
    const d = DOORS[id];
    if (!d.unlockedBy) return true;
    if (this.forcedOpen.has(id)) return true;
    if (d.unlockedBy === 'final') return this.finalOpen;
    return this.puzzles.isSolved(d.unlockedBy);
  }

  refreshDoors() {
    for (const id of Object.keys(DOORS)) {
      const pre = id === 'basement' ? 'px_door_' : 'door_';
      this.doorSprites[id].setTexture(pre + (this.doorOpen(id) ? 'open' : 'locked'));
    }
  }

  isBlocked(px, py) {
    const tx = Math.floor(px / T);
    const ty = Math.floor(py / T);
    if (this.grid[ty]?.[tx] !== 1) return true;
    for (const [id, d] of Object.entries(DOORS)) {
      if (d.x === tx && d.y === ty && !this.doorOpen(id)) return id;
    }
    return false;
  }

  makeObjects() {
    this.makeBasementDecor();
    this.objects = OBJECTS.map((o) => {
      const art = OBJECT_ART[o.id];
      const sprite = art
        ? this.add.image(o.x * T, o.y * T, art).setOrigin(0).setScale(S).setDepth(3)
        : this.add.image(o.x * T, o.y * T, 'obj').setOrigin(0).setTint(o.color).setDepth(3);
      return { ...o, sprite, cx: o.x * T + T / 2, cy: o.y * T + T / 2 };
    });
    this.promptText = null;
  }

  // Non-interactive Kenney props, darkened to the horror palette. [frame, tileX, tileY]
  makeBasementDecor() {
    const place = (frame, x, y, depth = 2) => this.add.image(x * T, y * T, 'indoor', frame)
      .setOrigin(0).setScale(S).setTint(DECOR_TINT).setDepth(depth);
    [[478, 6, 2], [479, 7, 2], [480, 8, 2]].forEach(([f, x, y]) => place(f, x, y));
    [[182, 5, 2], [182, 10, 2]].forEach(([f, x, y]) => place(f, x, y).setTint(0xc8b0a0));
    [[266, 3, 10], [267, 4, 10], [266, 3, 11]].forEach(([f, x, y]) => place(f, x, y));
    [[0, 9, 10], [1, 10, 10], [2, 11, 10], [54, 9, 11], [56, 11, 11]].forEach(([f, x, y]) => place(f, x, y));
    place(264, 12, 8);
    place(97, 3, 4);
  }

  makePlayer() {
    this.facing = Math.PI / 2;
    this.player = this.add.sprite(START.x * T + T / 2, START.y * T + T / 2, 'chars', IMRAN_FRAME).setScale(S).setDepth(10);
  }

  // ---------- input ----------
  setupInput() {
    const kb = this.input.keyboard;
    this.cursors = kb.createCursorKeys();
    this.keys = kb.addKeys('W,A,S,D', false);
    kb.on('keydown-E', () => !this.panel.isOpen && !this.ended && this.interact());
    kb.on('keydown-H', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
      if (!this.panel.isOpen || this.puzzles.active) this.askHint();
    });
    kb.on('keydown-ESC', () => { if (this.panel.isOpen) this.panel.close(); });
  }

  update(time, dt) {
    if (this.ended) { this.lighting.update(time, dt, this.mood.params, this.player.x, this.player.y); return; }
    this.timer.update(dt);
    this.hud.setTimer(this.timer.format());
    if (!this.panel.isOpen) this.movePlayer(dt);
    this.hints.update(dt);
    this.updatePrompt();
    this.trackRoom();

    this.moodClock += dt;
    if (this.moodClock > 1000) {
      this.moodClock = 0;
      this.mood.evaluate();
      this.audio.setHeartbeat(this.mood.params.heartbeat);
    }
    this.lighting.update(time, dt, this.mood.params, this.player.x, this.player.y);
  }

  movePlayer(dt) {
    const c = this.cursors;
    const k = this.keys;
    let vx = (c.right.isDown || k.D.isDown ? 1 : 0) - (c.left.isDown || k.A.isDown ? 1 : 0);
    let vy = (c.down.isDown || k.S.isDown ? 1 : 0) - (c.up.isDown || k.W.isDown ? 1 : 0);
    if (!vx && !vy) { this.player.setAngle(0); return; }
    this.facing = Math.atan2(vy, vx);
    if (vx) this.player.setFlipX(vx < 0);
    this.player.setAngle(Math.sin(this.time.now / 70) * 5);
    const len = Math.hypot(vx, vy);
    const step = (CONFIG.playerSpeed * dt) / 1000;
    vx = (vx / len) * step;
    vy = (vy / len) * step;
    if (!this.collides(this.player.x + vx, this.player.y)) this.player.x += vx;
    if (!this.collides(this.player.x, this.player.y + vy)) this.player.y += vy;
  }

  collides(x, y) {
    for (const [ox, oy] of [[-HALF, -HALF], [HALF, -HALF], [-HALF, HALF], [HALF, HALF]]) {
      const b = this.isBlocked(x + ox, y + oy);
      if (b) {
        if (typeof b === 'string') this.bumpDoor(b);
        return true;
      }
    }
    return false;
  }

  bumpDoor(id) {
    const now = this.time.now;
    if (now - this.lastBump < 3000) return;
    this.lastBump = now;
    this.audio.lock();
    this.hud.toast('Locked.');
    bus.emit('door:locked', { doorId: id });
  }

  trackRoom() {
    const r = inRoom(Math.floor(this.player.x / T), Math.floor(this.player.y / T));
    if (r && r !== this.currentRoom) {
      this.currentRoom = r;
      bus.emit('room:entered', { roomId: r });
      this.scares.onRoom(r);
    }
  }

  // ---------- interaction ----------
  nearest() {
    let best = null;
    let bd = 46;
    for (const o of this.objects) {
      const d = Math.hypot(o.cx - this.player.x, o.cy - this.player.y);
      if (d < bd) { bd = d; best = o; }
    }
    return best;
  }

  updatePrompt() {
    if (this.panel.isOpen) return this.hud.setPrompt(null);
    const o = this.nearest();
    this.hud.setPrompt(o ? `E: ${o.label}` : null);
  }

  interact() {
    const o = this.nearest();
    if (!o) return;
    if (o.needs && !this.puzzles.isSolved(o.needs)) {
      return this.hud.toast(o.needsMsg || "You can't make anything out in the dark.");
    }
    if (o.kind === 'clue') return this.showClue(o);
    if (o.kind === 'puzzle') return this.puzzles.start(this, o.puzzle);
    if (o.kind === 'door-pad') return this.openKeypad();
  }

  showClue(o) {
    this.audio.click();
    const el = this.panel.open(o.label);
    el.append(Panel.h('p', {}, o.text), Panel.h('button', { onclick: () => this.panel.close() }, 'Close'));
  }

  openKeypad() {
    const h = Panel.h;
    const missing = CONFIG.finalOrder.some((id) => this.puzzles.puzzles.has(id) && !this.puzzles.isSolved(id));
    if (missing) return this.hud.toast('The keypad blinks red. You are missing digits.');
    const len = this.finalCode().length;
    const el = this.panel.open('Front door keypad');
    const input = h('input', { maxlength: String(len), placeholder: '_ '.repeat(len).trim(), inputmode: 'numeric' });
    const msg = h('p', { style: 'color:#a89a8a;min-height:1.2em' }, `Enter the ${len}-digit code.`);
    const submit = () => {
      if (input.value === this.finalCode()) {
        this.audio.good();
        this.finalOpen = true;
        this.refreshDoors();
        this.panel.close();
        this.win();
      } else {
        this.audio.bad();
        input.value = '';
        msg.textContent = 'Wrong code.';
        this.puzzles.wrong(this, 'door');
      }
    };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    el.append(msg, input, h('div', {}, h('button', { onclick: submit }, 'Enter'), h('button', { onclick: () => this.panel.close() }, 'Step back')));
    input.focus();
  }

  // Final code = fragments in the order scrawled on the basement wall.
  finalCode() {
    return CONFIG.finalOrder.filter((id) => this.puzzles.puzzles.has(id)).map((id) => this.puzzles.puzzles.get(id).reward).join('');
  }

  askHint() {
    if (!this.ended) this.hints.request();
  }

  refreshInventory() {
    this.hud.setInventory(this.puzzles.fragmentList, this.puzzles.all.length);
  }

  // ---------- events ----------
  wireBus() {
    bus.on('puzzle:solved', ({ id }) => {
      this.refreshInventory();
      this.refreshDoors();
      this.audio.good();
      this.hud.toast(`Puzzle solved: ${this.puzzles.puzzles.get(id).title}`);
      if (id === 'basement') this.lighting.extraLight = 60;
    });
    bus.on('puzzle:wrong', ({ totalStrikes }) => this.hud.setStrikes(totalStrikes));
    bus.on('mood:changed', () => this.audio.setHeartbeat(this.mood.params.heartbeat));
    bus.on('nikki:hint', ({ text }) => text && this.hud.toast(text, 9000));
    bus.on('nikki:unlockDoor', ({ doorId }) => {
      if (!DOORS[doorId]) return;
      this.forcedOpen.add(doorId);
      this.refreshDoors();
    });
    bus.on('game:over', ({ reason }) => this.lose(reason));
  }

  lose(reason) {
    if (this.ended) return;
    this.ended = true;
    this.timer.stop();
    this.panel.close();
    this.hud.setPrompt(null);
    this.time.delayedCall(2200, () => {
      this.audio.stinger();
      this.cameras.main.fadeOut(1400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.audio.stopLoops();
        this.scene.start('End', { win: false, reason });
      });
    });
  }

  win() {
    if (this.ended) return;
    this.ended = true;
    this.timer.stop();
    bus.emit('game:win');
    this.hud.setPrompt(null);
    this.time.delayedCall(2500, () => {
      this.cameras.main.fadeOut(1500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.audio.stopLoops();
        this.scene.start('End', { win: true });
      });
    });
  }
}
