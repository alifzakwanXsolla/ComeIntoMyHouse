import { CONFIG } from '../config.js';

const PX = 4;

// Full-screen darkness overlay with a banded (pixelated) flashlight hole around the player.
export class Lighting {
  constructor(scene) {
    this.scene = scene;
    const { width, height } = CONFIG.view;
    this.rt = scene.add.renderTexture(0, 0, width, height).setOrigin(0).setScrollFactor(0).setDepth(50);

    // Banded light: stepped discs + a stepped cone, snapped to a 4px grid so edges stay chunky.
    this.g = scene.make.graphics({ x: 0, y: 0, add: false });

    this.flickerUntil = 0;
    this.radius = CONFIG.moods.sweet.radius;
    this.darkness = CONFIG.moods.sweet.darkness;
    this.extraLight = 0; // basement power restored => wider light
    this.blackoutUntil = 0;
  }

  flicker(ms) { this.flickerUntil = Math.max(this.flickerUntil, this.scene.time.now + ms); }
  blackout(ms) { this.blackoutUntil = this.scene.time.now + ms; }

  update(time, dt, moodParams, px, py) {
    const targetR = moodParams.radius + this.extraLight;
    this.radius += (targetR - this.radius) * Math.min(1, dt / 400);
    this.darkness += (moodParams.darkness - this.darkness) * Math.min(1, dt / 400);

    if (time < this.blackoutUntil) {
      this.rt.clear();
      this.rt.fill(0x000000, 1);
      this.flickerUntil = this.blackoutUntil + 600; // lights stutter back on
      return;
    }
    if (time > this.flickerUntil && Math.random() < moodParams.flicker * (dt / 1000)) {
      this.flickerUntil = time + 80 + Math.random() * 220;
    }
    const flicker = time < this.flickerUntil;
    const r = flicker ? this.radius * (0.35 + Math.random() * 0.3) : this.radius;
    const a = flicker ? Math.min(0.97, this.darkness + 0.15) : this.darkness;

    const cam = this.scene.cameras.main;
    const sx = px - cam.scrollX;
    const sy = py - cam.scrollY;

    const g = this.g;
    g.clear();
    g.fillStyle(0xffffff);
    const facing = this.scene.facing ?? Math.PI / 2;
    const L = CONFIG.light;
    const coneLen = L.coneLength * (r / CONFIG.moods.sweet.radius);
    const half = (L.coneHalfAngleDeg * Math.PI) / 180;
    // Outer bands first; erase alphas stack toward the centre.
    this.disc(sx, sy, r, 0.3);
    this.disc(sx, sy, r * 0.62, 0.4);
    this.disc(sx, sy, r * 0.3, 0.55);
    this.cone(sx, sy, facing, coneLen * 0.9, half, 0.22);
    this.cone(sx, sy, facing, coneLen * 0.62, half * 0.8, 0.3);
    this.cone(sx, sy, facing, coneLen * 0.36, half * 0.6, 0.4);

    this.rt.clear();
    this.rt.fill(0x000000, a);
    this.rt.erase(g);
  }

  poly(pts, alpha) {
    const q = (v) => Math.round(v / PX) * PX;
    this.g.fillStyle(0xffffff, alpha);
    this.g.fillPoints(pts.map(([x, y]) => ({ x: q(x), y: q(y) })), true);
  }

  disc(x, y, r, alpha) {
    const pts = [];
    for (let i = 0; i < 28; i++) {
      const t = (i / 28) * Math.PI * 2;
      pts.push([x + Math.cos(t) * r, y + Math.sin(t) * r]);
    }
    this.poly(pts, alpha);
  }

  cone(x, y, ang, len, half, alpha) {
    const pts = [[x, y]];
    for (let i = 0; i <= 8; i++) {
      const t = ang - half + (i / 8) * half * 2;
      pts.push([x + Math.cos(t) * len, y + Math.sin(t) * len]);
    }
    this.poly(pts, alpha);
  }
}
