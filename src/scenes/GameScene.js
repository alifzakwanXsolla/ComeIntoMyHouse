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
import { Hud } from '../ui/hud.js';
import { Panel } from '../ui/panel.js';

const T = CONFIG.tile;
const HALF = 9; // player collision half-size

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
    this.audio = new GameAudio();
    this.audio.init().then(() => { this.audio.startAmbient(); this.audio.startHeartbeat(); });
    this.input.keyboard.once('keydown', () => this.audio.ctx?.resume());
    this.input.once('pointerdown', () => this.audio.ctx?.resume());

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
    for (const r of Object.values(ROOMS)) {
      for (let y = r.y; y < r.y + r.h; y++) {
        for (let x = r.x; x < r.x + r.w; x++) {
          g.fillStyle((x + y) % 2 ? r.color : r.alt).fillRect(x * T, y * T, T, T);
        }
      }
    }
    for (const d of Object.values(DOORS)) g.fillStyle(0x2a1d1a).fillRect(d.x * T, d.y * T, T, T);

    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        if (this.grid[y][x] === 1) continue;
        if (this.touchesFloor(x, y)) this.add.image(x * T, y * T, 'wall').setOrigin(0).setDepth(1);
      }
    }

    this.doorSprites = {};
    for (const [id, d] of Object.entries(DOORS)) {
      this.doorSprites[id] = this.add.image(d.x * T, d.y * T, 'door_locked').setOrigin(0).setDepth(2);
    }
    this.refreshDoors();
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
      this.doorSprites[id].setTexture(this.doorOpen(id) ? 'door_open' : 'door_locked');
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
    this.objects = OBJECTS.map((o) => {
      const sprite = this.add.image(o.x * T, o.y * T, 'obj').setOrigin(0).setTint(o.color).setDepth(3);
      return { ...o, sprite, cx: o.x * T + T / 2, cy: o.y * T + T / 2 };
    });
    this.promptText = null;
  }

  makePlayer() {
    this.player = this.add.sprite(START.x * T + T / 2, START.y * T + T / 2, 'player').setDepth(10);
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
    if (!vx && !vy) return;
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
    if (this.ended) return;
    const pm = this.puzzles;
    let id = pm.active;
    if (!id) {
      const here = pm.all.find((p) => p.room === this.currentRoom && !pm.isSolved(p.id));
      id = (here || pm.all.find((p) => !pm.isSolved(p.id)))?.id || 'door';
    }
    this.timer.add(-CONFIG.hintPenaltySeconds);
    this.hud.toast(`Nikki helps... but it costs you ${CONFIG.hintPenaltySeconds}s.`);
    bus.emit('hint:requested', { id });
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
