import { PAL } from './palette.js';

// Tiny canvas helpers. Everything is crisp: smoothing off, integer coordinates only.
export function mk(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d');
  x.imageSmoothingEnabled = false;
  return { c, x };
}

export const col = (ch) => PAL[ch] || ch;

export function rect(x, ch, X, Y, W, H) { x.fillStyle = col(ch); x.fillRect(X, Y, W, H); }
export function dot(x, ch, X, Y) { x.fillStyle = col(ch); x.fillRect(X, Y, 1, 1); }

// Draw rows of palette chars onto ctx at (ox, oy). '.' and ' ' are transparent.
export function stamp(x, rows, ox = 0, oy = 0) {
  rows.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      if (ch !== '.' && ch !== ' ') dot(x, ch, ox + i, oy + j);
    }
  });
}

export function fromMap(rows) {
  const { c, x } = mk(Math.max(...rows.map((r) => r.length)), rows.length);
  stamp(x, rows);
  return c;
}

// Deterministic RNG so textures look the same every boot.
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 1px outline painted onto transparent pixels that touch an opaque one (in place).
// Leave a 1px transparent margin in the source art so the outline has room.
export function outline(c, ch = 'k') {
  const x = c.getContext('2d');
  const { width: w, height: h } = c;
  const d = x.getImageData(0, 0, w, h).data;
  const solid = (i, j) => i >= 0 && j >= 0 && i < w && j < h && d[(j * w + i) * 4 + 3] > 0;
  x.fillStyle = col(ch);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    if (solid(i, j)) continue;
    if (solid(i - 1, j) || solid(i + 1, j) || solid(i, j - 1) || solid(i, j + 1)) x.fillRect(i, j, 1, 1);
  }
  return c;
}

// Soft drop shadow: a 2-step ellipse baked under the sprite. Returns a taller canvas, origin = bottom.
export function withShadow(src, pad = 1) {
  const w = src.width, h = src.height;
  const { c, x } = mk(w + pad * 2, h + 3);
  const cx = w / 2 + pad;
  x.fillStyle = 'rgba(10,6,14,0.22)';
  x.fillRect(pad, h - 1, w, 3);
  x.fillStyle = 'rgba(10,6,14,0.22)';
  x.fillRect(pad + 1, h - 2, w - 2, 4);
  x.fillStyle = 'rgba(10,6,14,0.18)';
  x.fillRect(pad + 2, h + 1, w - 4, 1);
  void cx;
  x.drawImage(src, pad, 0);
  return c;
}

// Register a canvas as a Phaser texture (replacing any existing key).
export function addTex(scene, key, canvas) {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  scene.textures.addCanvas(key, canvas);
}
