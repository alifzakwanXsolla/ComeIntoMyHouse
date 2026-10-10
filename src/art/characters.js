import { mk, rect, dot, outline } from './kit.js';

// Sheet layout (same for procedural and any real sheet dropped into assets/):
//   rows = down, left, right, up   cols = walk0, walk1, walk2, sneak, hide   -> frame index = row*5 + col
export const DIRS = ['down', 'left', 'right', 'up'];
export const COLS = 5;
export const FW = 16, FH = 24;
export const frameIndex = (dir, col) => DIRS.indexOf(dir) * COLS + col;

// OMORI-style chibi: huge round head, warm skin, tiny low-set eyes, bangs with highlight dots, stubby body.
const IMRAN = { hair: 'n', hi: 'C', skin: 's', skinShade: 'S', top: 'B', topShade: 'K', pants: 'K', shoe: 'k', sock: 'h', long: false, dress: false, tuft: true };
const NIKKI = { hair: 'n', hi: 'C', skin: 's', skinShade: 'S', top: 'r', topShade: 'K', pants: 'r', shoe: 'k', sock: 'h', long: true, dress: true, bow: 'R' };

function head(x, P, dir, hy) {
  // round skull (12 wide, 10 tall) with clipped corners
  rect(x, P.skin, 4, hy, 8, 10); rect(x, P.skin, 3, hy + 1, 10, 8); rect(x, P.skin, 2, hy + 2, 12, 6);
  rect(x, P.skinShade, 4, hy + 9, 8, 1);
  if (dir === 'down') {
    rect(x, P.hair, 4, hy, 8, 3); rect(x, P.hair, 3, hy + 1, 10, 3); rect(x, P.hair, 2, hy + 2, 12, 3);
    rect(x, P.skin, 4, hy + 4, 3, 1); rect(x, P.skin, 9, hy + 4, 3, 1); rect(x, P.skin, 7, hy + 3, 2, 2);   // fringe gaps
    dot(x, P.hair, 5, hy + 4); dot(x, P.hair, 10, hy + 4);
    rect(x, P.hair, 2, hy + 5, 1, 2); rect(x, P.hair, 13, hy + 5, 1, 2);                                 // sideburns
    for (const i of [5, 7, 9, 11]) dot(x, P.hi, i, hy + 1);                                              // highlight dots
    rect(x, 'k', 5, hy + 6, 1, 2); rect(x, 'k', 10, hy + 6, 1, 2);                                       // eyes
    if (P.tuft) { dot(x, P.hair, 8, hy - 1); }
    if (P.long) { rect(x, P.hair, 1, hy + 3, 2, 10); rect(x, P.hair, 13, hy + 3, 2, 10); }
    if (P.bow) { rect(x, P.bow, 3, hy, 2, 2); rect(x, P.bow, 6, hy, 1, 1); dot(x, 'z', 5, hy); }
  } else if (dir === 'up') {
    rect(x, P.hair, 4, hy, 8, 10); rect(x, P.hair, 3, hy + 1, 10, 8); rect(x, P.hair, 2, hy + 2, 12, 6);
    for (const i of [5, 8, 11]) dot(x, P.hi, i, hy + 2);
    if (P.tuft) dot(x, P.hair, 8, hy - 1);
    if (P.long) rect(x, P.hair, 2, hy + 8, 12, 5);
    if (P.bow) { rect(x, P.bow, 10, hy, 2, 2); }
  } else {
    rect(x, P.hair, 4, hy, 8, 3); rect(x, P.hair, 3, hy + 1, 10, 3); rect(x, P.hair, 2, hy + 2, 12, 3);
    rect(x, P.hair, 8, hy + 5, 6, 4);                                                                    // back of hair
    rect(x, P.skin, 3, hy + 4, 3, 1); dot(x, P.hair, 4, hy + 4);
    for (const i of [4, 7, 10]) dot(x, P.hi, i, hy + 1);
    rect(x, 'k', 4, hy + 6, 1, 2);
    if (P.tuft) dot(x, P.hair, 8, hy - 1);
    if (P.long) rect(x, P.hair, 9, hy + 8, 5, 5);
    if (P.bow) rect(x, P.bow, 10, hy, 2, 2);
  }
}

// col: 0 stand, 1 left foot up, 2 right foot up, 3 sneak, 4 hide.  dir: down/left/up (right is mirrored later).
function frame(P, dir, col) {
  const { c, x } = mk(FW, FH);
  if (col === 4) return hideFrame(P, c, x);
  const crouch = col === 3 ? 2 : 0;
  const hy = 2 + crouch, by = hy + 10, ly = by + 4, lb = 23;
  const lift = col === 1 ? 1 : 0, rift = col === 2 ? 1 : 0;
  const side = dir === 'left';
  const swing = col === 1 ? 1 : col === 2 ? -1 : 0;

  // stubby legs, socks, shoes
  const l1 = side ? 6 : 5, l2 = side ? 8 : 9;
  rect(x, P.skin, l1, ly, 2, lb - ly - lift); rect(x, P.sock, l1, lb - 2 - lift, 2, 1); rect(x, P.shoe, l1, lb - 1 - lift, 3, 1);
  rect(x, P.skin, l2, ly, 2, lb - ly - rift); rect(x, P.sock, l2, lb - 2 - rift, 2, 1); rect(x, P.shoe, l2, lb - 1 - rift, 3, 1);
  if (P.dress) { rect(x, P.top, 4, ly - 1, 8, 2); rect(x, P.topShade, 4, ly, 8, 1); }
  else rect(x, P.pants, 5, ly - 1, 6, 2);

  // torso + arms held slightly out
  rect(x, P.top, 5, by, 6, 4); rect(x, P.topShade, 5, by + 3, 6, 1);
  if (P.dress) { rect(x, P.top, 4, by + 2, 8, 2); dot(x, 'h', 7, by); dot(x, 'h', 8, by); }
  if (side) { rect(x, P.top, 6 + swing, by, 3, 3); rect(x, P.skin, 6 + swing, by + 3, 3, 1); }
  else {
    const a1 = swing > 0 ? 1 : 0, a2 = swing < 0 ? 1 : 0;
    rect(x, P.top, 3, by + a1, 2, 3); rect(x, P.skin, 3, by + 3 + a1, 2, 1);
    rect(x, P.top, 11, by + a2, 2, 3); rect(x, P.skin, 11, by + 3 + a2, 2, 1);
  }
  head(x, P, dir, hy);
  return outline(c);
}

// Hiding: curled up small, big head over the knees.
function hideFrame(P, c, x) {
  rect(x, P.top, 4, 16, 8, 6); rect(x, P.topShade, 4, 20, 8, 2);
  head(x, P, 'down', 6);
  rect(x, P.skin, 4, 19, 3, 2); rect(x, P.skin, 9, 19, 3, 2);
  return outline(c);
}

function sheet(P) {
  const { c, x } = mk(FW * COLS, FH * DIRS.length);
  DIRS.forEach((dir, row) => {
    for (let col = 0; col < COLS; col++) {
      if (dir === 'right') {
        const f = frame(P, 'left', col);
        x.save(); x.translate((col + 1) * FW, row * FH); x.scale(-1, 1); x.drawImage(f, 0, 0); x.restore();
      } else x.drawImage(frame(P, dir, col), col * FW, row * FH);
    }
  });
  return c;
}

// Solid dark shape with a faint rim: what the player sees of Nikki.
function silhouette(src) {
  const { c, x } = mk(src.width, src.height);
  x.drawImage(src, 0, 0);
  x.globalCompositeOperation = 'source-in';
  x.fillStyle = '#15111b'; x.fillRect(0, 0, c.width, c.height);
  return c;
}

export function makeCharacters() {
  const nikki = sheet(NIKKI);
  return { imran: sheet(IMRAN), nikki, nikki_sil: silhouette(nikki) };
}
