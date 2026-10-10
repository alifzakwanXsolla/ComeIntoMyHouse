import { mk, rect, dot, outline } from './kit.js';

// Sheet layout (same for procedural and any real sheet dropped into assets/):
//   rows = down, left, right, up   cols = walk0, walk1, walk2, sneak, hide   -> frame index = row*5 + col
export const DIRS = ['down', 'left', 'right', 'up'];
export const COLS = 5;
export const FW = 16, FH = 24;
export const frameIndex = (dir, col) => DIRS.indexOf(dir) * COLS + col;

const IMRAN = { hair: 'n', skin: 's', skinShade: 'S', top: 'b', topShade: 'B', pants: 'K', shoe: 'k', long: false, dress: false, hood: true };
const NIKKI = { hair: 'n', skin: 's', skinShade: 'S', top: 'r', topShade: 'K', pants: 'r', shoe: 'k', long: true, dress: true, hood: false };

// col: 0 stand, 1 left foot up, 2 right foot up, 3 sneak, 4 hide.  dir: down/left/up (right is mirrored later).
function frame(P, dir, col) {
  const { c, x } = mk(FW, FH);
  const crouch = col === 3 ? 2 : 0;
  if (col === 4) return hideFrame(P, c, x);
  const hy = 1 + crouch, by = 9 + crouch, ly = 18 + crouch, lb = 23;
  const lift = col === 1 ? 1 : 0, rift = col === 2 ? 1 : 0;
  const side = dir === 'left';

  // legs / skirt
  if (P.dress) {
    rect(x, P.top, 3, by + 5, 10, ly - by - 3 + (crouch ? 0 : 1));       // skirt flare
    rect(x, P.topShade, 3, ly - 1, 10, 1);
  }
  const legTop = P.dress ? ly + 1 : ly;
  if (side) {
    rect(x, P.pants === 'r' ? 's' : P.pants, 6 + lift, legTop, 3, lb - legTop - lift); rect(x, P.shoe, 6 + lift, lb - 1 - lift, 4, 1);
    rect(x, P.pants === 'r' ? 'S' : 'K', 8 - rift, legTop, 3, lb - legTop - rift); rect(x, P.shoe, 8 - rift, lb - 1 - rift, 4, 1);
  } else {
    const legCol = P.dress ? 's' : P.pants;
    rect(x, legCol, 5, legTop, 3, lb - legTop - lift); rect(x, P.shoe, 5, lb - 1 - lift, 3, 1);
    rect(x, legCol, 8, legTop, 3, lb - legTop - rift); rect(x, P.shoe, 8, lb - 1 - rift, 3, 1);
  }

  // torso + arms
  rect(x, P.top, 4, by, 8, ly - by);
  rect(x, P.topShade, 4, ly - 2, 8, 2);
  if (P.hood && dir !== 'up') { rect(x, P.topShade, 6, by, 4, 1); dot(x, 'h', 6, by + 2); dot(x, 'h', 9, by + 2); } // hood + drawstrings
  if (P.hood && dir === 'up') rect(x, P.topShade, 4, by, 8, 3);                                                // hood back
  const swing = col === 1 ? 1 : col === 2 ? -1 : 0;
  if (side) {
    rect(x, P.top, 6 + swing, by + 1, 3, 6); rect(x, P.skin, 6 + swing, by + 6, 3, 1);
  } else {
    rect(x, P.top, 2, by + 1 + (swing > 0 ? 1 : 0), 2, 6); rect(x, P.skin, 2, by + 6 + (swing > 0 ? 1 : 0), 2, 1);
    rect(x, P.top, 12, by + 1 + (swing < 0 ? 1 : 0), 2, 6); rect(x, P.skin, 12, by + 6 + (swing < 0 ? 1 : 0), 2, 1);
  }

  // head
  rect(x, P.skin, 4, hy, 8, 8);
  if (dir === 'down') {
    rect(x, P.hair, 3, hy - 1 < 0 ? 0 : hy - 1, 10, 3); rect(x, P.hair, 3, hy + 1, 2, 3); rect(x, P.hair, 11, hy + 1, 2, 3);
    dot(x, 'k', 6, hy + 4); dot(x, 'k', 9, hy + 4); rect(x, P.skinShade, 7, hy + 6, 2, 1);
    if (P.long) { rect(x, P.hair, 3, hy + 3, 2, 8); rect(x, P.hair, 11, hy + 3, 2, 8); }
  } else if (dir === 'up') {
    rect(x, P.hair, 3, hy - 1 < 0 ? 0 : hy - 1, 10, 9);
    if (P.long) rect(x, P.hair, 3, hy + 8, 10, 6);
  } else {
    rect(x, P.hair, 4, hy - 1 < 0 ? 0 : hy - 1, 9, 3); rect(x, P.hair, 8, hy + 1, 5, 5);
    dot(x, 'k', 5, hy + 4); rect(x, P.skinShade, 4, hy + 6, 2, 1);
    if (P.long) rect(x, P.hair, 8, hy + 5, 4, 8);
  }
  return outline(c);
}

// Hiding: curled up small, only a head and shoulders poking out.
function hideFrame(P, c, x) {
  rect(x, P.top, 3, 15, 10, 8); rect(x, P.topShade, 3, 21, 10, 2);
  rect(x, P.skin, 4, 9, 8, 7);  rect(x, P.hair, 3, 8, 10, 3); rect(x, P.hair, 3, 10, 2, 3); rect(x, P.hair, 11, 10, 2, 3);
  dot(x, 'k', 6, 13); dot(x, 'k', 9, 13);
  rect(x, P.skin, 4, 20, 3, 2); rect(x, P.skin, 9, 20, 3, 2);            // hands over knees
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
