// Low-res darkness mask at native resolution, so every light edge is pixel-snapped.
// Light is erased in 3 bands instead of a smooth gradient (pixel-art look).
const DARK = 0x07050b;

export class Light {
  constructor(scene, w, h) {
    this.rt = scene.add.renderTexture(0, 0, w, h).setOrigin(0).setDepth(900);
    this.g = scene.make.graphics({ add: false });
    this.motes = scene.add.graphics().setDepth(901);
    this.w = w; this.h = h;
    this.dark = 0.6;
    this.flash = false;     // flashlight cone
    this.personal = 28;     // radius you can see around yourself
    this.t = 0;
    this.m = Array.from({ length: 26 }, () => ({
      x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 4, vy: -1 - Math.random() * 3, ph: Math.random() * 6.28,
    }));
  }

  cone(px, py, ang, len, half, a) {
    const pts = [{ x: px, y: py }];
    for (let i = 0; i <= 8; i++) {
      const t = ang - half + (2 * half * i) / 8;
      pts.push({ x: Math.round(px + Math.cos(t) * len), y: Math.round(py + Math.sin(t) * len) });
    }
    this.g.fillStyle(0xffffff, a).fillPoints(pts, true);
  }

  disc(x, y, r, a) { if (r > 0) this.g.fillStyle(0xffffff, a).fillCircle(Math.round(x), Math.round(y), Math.round(r)); }

  // glows: [{x, y, r}]
  update(dt, px, py, ang, glows = []) {
    this.t += dt;
    const g = this.g;
    g.clear();
    if (this.flash) {
      const len = 150, half = 0.56;
      this.cone(px, py, ang, len, half, 0.35);
      this.cone(px, py, ang, len * 0.72, half * 0.8, 0.45);
      this.cone(px, py, ang, len * 0.42, half * 0.6, 0.65);
    }
    const r = this.personal;
    this.disc(px, py, r, 0.3); this.disc(px, py, r * 0.62, 0.45); this.disc(px, py, r * 0.32, 0.7);
    for (const l of glows) {
      const k = l.flicker ? (Math.sin(this.t * 23) > 0.85 ? 0.4 : 1) : 1;
      this.disc(l.x, l.y, l.r * k, 0.32); this.disc(l.x, l.y, l.r * 0.66 * k, 0.42); this.disc(l.x, l.y, l.r * 0.33 * k, 0.55);
    }
    this.rt.clear();
    this.rt.fill(DARK, this.dark);
    this.rt.erase(g);
    this.drawMotes(dt, px, py, ang);
  }

  drawMotes(dt, px, py, ang) {
    const mg = this.motes; mg.clear();
    for (const m of this.m) {
      m.x += (m.vx + Math.sin(this.t * 1.3 + m.ph) * 3) * dt; m.y += m.vy * dt;
      if (m.y < 0) m.y = this.h; if (m.x < 0) m.x = this.w; if (m.x > this.w) m.x = 0;
      const dx = m.x - px, dy = m.y - py, d = Math.hypot(dx, dy);
      let a = Math.atan2(dy, dx) - ang; a = Math.atan2(Math.sin(a), Math.cos(a));
      const lit = this.flash && d < 150 && Math.abs(a) < 0.56;
      const alpha = lit ? 0.85 : this.dark < 0.8 ? 0.22 : 0;
      if (alpha) mg.fillStyle(lit ? 0xe8e0c8 : 0xb8b0a0, alpha).fillRect(Math.round(m.x), Math.round(m.y), 1, 1);
    }
  }
}
