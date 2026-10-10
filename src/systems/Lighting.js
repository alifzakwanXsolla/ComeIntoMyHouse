import { CONFIG } from '../config.js';

// Full-screen darkness overlay with a soft flashlight hole around the player.
export class Lighting {
  constructor(scene) {
    this.scene = scene;
    const { width, height } = CONFIG.view;
    this.rt = scene.add.renderTexture(0, 0, width, height).setOrigin(0).setScrollFactor(0).setDepth(50);

    // Radial gradient used as the eraser brush.
    const size = 512;
    const tex = scene.textures.createCanvas('lightbrush', size, size);
    const ctx = tex.getContext();
    const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.1, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.55, 'rgba(255,255,255,0.8)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    tex.refresh();
    this.brush = scene.make.image({ key: 'lightbrush', add: false });

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

    this.rt.clear();
    this.rt.fill(0x000000, a);
    this.brush.setDisplaySize(r * 2, r * 2);
    this.rt.erase(this.brush, sx, sy);
  }
}
