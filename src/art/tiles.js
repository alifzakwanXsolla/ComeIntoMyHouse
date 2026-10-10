import { mk, rect, dot, rng } from './kit.js';

const T = 16;

// Wooden planks: 4 rows of 4px, staggered seams, grain flecks.
function wood(seed = 1) {
  const { c, x } = mk(T, T), r = rng(seed);
  for (let row = 0; row < 4; row++) {
    const y = row * 4, base = row % 2 ? 'w' : 'y';
    rect(x, base, 0, y, T, 3);
    rect(x, 'W', 0, y + 3, T, 1);                 // seam under each plank
    const seam = (row * 7 + 5) % T;
    rect(x, 'x', seam, y, 1, 3);                  // stagger
    for (let i = 0; i < 4; i++) rect(x, row % 2 ? 'W' : 'w', (r() * 14) | 0, y + 1 + ((r() * 2) | 0), 2 + ((r() * 3) | 0), 1);
  }
  return c;
}

// Checkered kitchen tile: cream / dusty-blue 8px squares with grout.
function checker() {
  const { c, x } = mk(T, T);
  for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) rect(x, (i + j) % 2 ? 'b' : 'h', i * 8, j * 8, 8, 8);
  rect(x, 'H', 0, 7, T, 1); rect(x, 'H', 7, 0, 1, T);
  rect(x, 'M', 0, 15, T, 1); rect(x, 'M', 15, 0, 1, T);
  dot(x, 'z', 1, 1); dot(x, 'z', 9, 9);
  return c;
}

// Carpet: muted red-brown with a small diamond weave.
function carpet() {
  const { c, x } = mk(T, T);
  rect(x, 'r', 0, 0, T, T);
  for (let j = 0; j < T; j += 4) for (let i = 0; i < T; i += 4) {
    const o = (j / 4) % 2 ? 2 : 0;
    dot(x, 'P', (i + o) % T, j + 1);
    dot(x, 'R', (i + o + 1) % T, j + 2);
    dot(x, 'K', (i + o) % T, j + 3);
  }
  return c;
}

// Basement concrete: speckle, a crack, a damp stain. Variant picks the detail.
function concrete(variant = 0) {
  const { c, x } = mk(T, T), r = rng(40 + variant);
  rect(x, 'c', 0, 0, T, T);
  for (let i = 0; i < 26; i++) dot(x, r() > 0.5 ? 'C' : 'D', (r() * T) | 0, (r() * T) | 0);
  rect(x, 'C', 15, 0, 1, T); rect(x, 'C', 0, 15, T, 1);   // slab joint
  if (variant === 1) { // crack
    [[3, 2], [4, 3], [4, 4], [5, 5], [6, 5], [7, 6], [7, 7], [8, 8], [9, 8], [9, 9]].forEach(([i, j]) => dot(x, 'K', i, j));
  }
  if (variant === 2) { // stain
    rect(x, 'C', 5, 6, 6, 4); rect(x, 'C', 4, 7, 8, 2); rect(x, 'M', 6, 7, 3, 2);
  }
  return c;
}

// Wall front face: wallpaper stripes, baseboard, soft shadow along the top.
function wallFront(kind = 'paper') {
  const { c, x } = mk(T, T);
  if (kind === 'paper') {
    rect(x, 'p', 0, 0, T, T);
    for (let i = 0; i < T; i += 4) rect(x, 'P', i, 0, 1, 12);    // stripes
    for (let i = 2; i < T; i += 8) { dot(x, 'H', i, 5); dot(x, 'H', i + 1, 6); } // tiny motif
    rect(x, 'K', 0, 0, T, 2);                                     // top shadow
    rect(x, 'P', 0, 2, T, 1);
    rect(x, 'h', 0, 12, T, 2); rect(x, 'H', 0, 14, T, 2);         // baseboard
    rect(x, 'k', 0, 15, T, 1);
  } else {
    rect(x, 'C', 0, 0, T, T);
    for (let j = 0; j < T; j += 8) rect(x, 'K', 0, j + 7, T, 1);  // block courses
    for (let j = 0; j < 2; j++) rect(x, 'K', j ? 4 : 11, j * 8, 1, 7);
    rect(x, 'K', 0, 0, T, 2);
    rect(x, 'c', 0, 3, T, 1);
    rect(x, 'M', 0, 14, T, 2);
    rect(x, 'k', 0, 15, T, 1);
  }
  return c;
}

// Wall top face: the dark cap you see from above (3/4 view).
function wallTop() {
  const { c, x } = mk(T, T);
  rect(x, 'K', 0, 0, T, T);
  rect(x, 'k', 0, 0, T, 1);
  rect(x, 'n', 0, 1, T, 2);
  for (let i = 0; i < T; i += 5) dot(x, 'k', i, 6);
  return c;
}

export function makeTiles() {
  return {
    floor_wood: wood(1), floor_wood2: wood(7),
    floor_checker: checker(), floor_carpet: carpet(),
    floor_concrete: concrete(0), floor_concrete_crack: concrete(1), floor_concrete_stain: concrete(2),
    wall_paper: wallFront('paper'), wall_block: wallFront('block'), wall_top: wallTop(),
  };
}
