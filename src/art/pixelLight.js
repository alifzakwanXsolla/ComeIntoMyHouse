import { CONFIG } from '../config.js';

const DARK = 0x0a070f;

// Low-res darkness mask. The RenderTexture is the native 320x180 canvas, so every light edge is
// pixel-snapped; light is erased in 3 discrete bands instead of a smooth gradient.
export class PixelLight {
  constructor(scene) {
    this.scene = scene;
    const { width: w, height: h } = CONFIG.render;
    this.w = w; this.h = h;
    this.rt = scene.add.renderTexture(0, 0, w, h).setOrigin(0).setScrollFactor(0).setDepth(900);
    this.g = scene.make.graphics({ add: false });
    this.motes = scene.add.graphics().setDepth(901);
    this.darkness = 0.6;
    this.on = true;
    this.t = 0;
    const L = CONFIG.light;
    this.m = Array.from({ length: L.motes }, () => ({
      x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 4, vy: -1 - Math.random() * 3, ph: Math.random() * 6.28,
    }));
  }

  cone(px, py, ang, len, half, a) {
    const pts = [{ x: px, y: py }], n = 8;
    for (let i = 0; i <= n; i++) {
      const t = ang - half + (2 * half * i) / n;
      pts.push({ x: Math.round(px + Math.cos(t) * len), y: Math.round(py + Math.sin(t) * len) });
    }
    this.g.fillStyle(0xffffff, a);
    this.g.fillPoints(pts, true);
  }

  disc(x, y, r, a) { this.g.fillStyle(0xffffff, a); this.g.fillCircle(Math.round(x), Math.round(y), r); }

  // lights: [{x,y,r}] static glows (lamp, CRT). px/py/ang = flashlight, screen coords.
  update(dt, px, py, ang, lights = []) {
    const L = CONFIG.light, cam = this.scene.cameras.main, g = this.g;
    this.t += dt;
    const sx = (x) => x - cam.scrollX, sy = (y) => y - cam.scrollY;
    g.clear();
    // each band erases a share of what is left: remaining dark = 0.65 -> 0.42 -> 0.2 -> ~0
    if (this.on) {
      const len = L.coneLength * 0.55, half = (L.coneHalfAngleDeg * Math.PI) / 180;
      this.cone(sx(px), sy(py), ang, len, half, 0.35);
      this.cone(sx(px), sy(py), ang, len * 0.72, half * 0.8, 0.4);
      this.cone(sx(px), sy(py), ang, len * 0.42, half * 0.6, 0.6);
    }
    this.disc(sx(px), sy(py), 28, 0.3); this.disc(sx(px), sy(py), 17, 0.45); this.disc(sx(px), sy(py), 9, 0.7);
    for (const l of lights) {
      this.disc(sx(l.x), sy(l.y), l.r, 0.3); this.disc(sx(l.x), sy(l.y), l.r * 0.66, 0.4); this.disc(sx(l.x), sy(l.y), l.r * 0.33, 0.5);
    }
    this.rt.fill(DARK, this.darkness);
    this.rt.erase(g);
    this.drawMotes(dt, sx(px), sy(py), ang);
  }

  drawMotes(dt, px, py, ang) {
    const mg = this.motes; mg.clear();
    const half = (CONFIG.light.coneHalfAngleDeg * Math.PI) / 180, len = CONFIG.light.coneLength * 0.55;
    for (const m of this.m) {
      m.x += (m.vx + Math.sin(this.t * 1.3 + m.ph) * 3) * dt; m.y += m.vy * dt;
      if (m.y < 0) m.y = this.h; if (m.x < 0) m.x = this.w; if (m.x > this.w) m.x = 0;
      const dx = m.x - px, dy = m.y - py, d = Math.hypot(dx, dy);
      let a = Math.atan2(dy, dx) - ang; a = Math.atan2(Math.sin(a), Math.cos(a));
      const lit = this.on && d < len && Math.abs(a) < half;
      const alpha = lit ? 0.85 : this.darkness < 0.8 ? 0.25 : 0;
      if (!alpha) continue;
      mg.fillStyle(lit ? 0xe8e0c8 : 0xb8b0a0, alpha).fillRect(Math.round(m.x), Math.round(m.y), 1, 1);
    }
  }
}
