import { mk, rect, dot, outline, withShadow } from './kit.js';

// Each builder draws into a canvas with a 1px transparent margin, then outline() + withShadow().
const finish = (c) => withShadow(outline(c));

function sofa() {
  const { c, x } = mk(34, 18);
  rect(x, 'B', 1, 1, 32, 8);  rect(x, 'b', 2, 2, 30, 5);          // back
  rect(x, 'b', 1, 8, 32, 8);  rect(x, 'B', 1, 14, 32, 2);         // seat + base
  rect(x, 'B', 1, 6, 4, 9);   rect(x, 'B', 29, 6, 4, 9);          // arms
  rect(x, 'B', 17, 8, 1, 6);                                      // cushion seam
  rect(x, 'x', 3, 16, 2, 1);  rect(x, 'x', 29, 16, 2, 1);
  return finish(c);
}

function table() {
  const { c, x } = mk(34, 26);
  rect(x, 'y', 1, 1, 32, 18); rect(x, 'w', 1, 15, 32, 4);         // top + edge
  rect(x, 'W', 1, 19, 32, 1);
  rect(x, 'x', 3, 20, 2, 5);  rect(x, 'x', 29, 20, 2, 5);         // legs
  rect(x, 'h', 6, 5, 8, 7);   rect(x, 'H', 7, 6, 6, 5); rect(x, 'h', 8, 7, 2, 1);   // plate 1
  rect(x, 'h', 20, 5, 8, 7);  rect(x, 'H', 21, 6, 6, 5); rect(x, 'h', 22, 7, 2, 1); // plate 2
  rect(x, 'm', 4, 6, 1, 5);   rect(x, 'm', 15, 6, 1, 5);          // cutlery
  rect(x, 'm', 18, 6, 1, 5);  rect(x, 'm', 29, 6, 1, 5);
  rect(x, 'z', 15, 2, 4, 3);  rect(x, 'Y', 16, 1, 2, 2);          // candle
  return finish(c);
}

function fridge() {
  const { c, x } = mk(20, 34);
  rect(x, 'h', 1, 1, 18, 32); rect(x, 'H', 1, 1, 2, 32);
  rect(x, 'M', 1, 12, 18, 1);                                      // door split
  rect(x, 'M', 15, 4, 2, 6);  rect(x, 'M', 15, 15, 2, 8);         // handles
  rect(x, 'z', 3, 2, 12, 1);                                       // sheen
  rect(x, 'H', 1, 31, 18, 2);
  return finish(c);
}

function stove() {
  const { c, x } = mk(22, 24);
  rect(x, 'm', 1, 1, 20, 22); rect(x, 'M', 1, 1, 20, 3);
  [[4, 6], [13, 6], [4, 12], [13, 12]].forEach(([i, j]) => { rect(x, 'k', i, j, 6, 4); rect(x, 'K', i + 1, j + 1, 4, 2); });
  rect(x, 'k', 3, 18, 16, 4); rect(x, 'M', 4, 19, 14, 2);          // oven door
  dot(x, 'R', 6, 2); dot(x, 'h', 10, 2); dot(x, 'h', 14, 2);       // knobs
  return finish(c);
}

function bed() {
  const { c, x } = mk(26, 38);
  rect(x, 'x', 1, 1, 24, 36); rect(x, 'W', 1, 1, 24, 4);           // frame + headboard
  rect(x, 'h', 3, 5, 20, 8);  rect(x, 'H', 3, 11, 20, 2);         // pillows
  rect(x, 'h', 4, 6, 8, 5);   rect(x, 'h', 14, 6, 8, 5);
  rect(x, 'g', 3, 13, 20, 22); rect(x, 'P', 3, 13, 20, 3);        // blanket + fold
  rect(x, 'g', 3, 35, 20, 1);
  for (let j = 18; j < 34; j += 4) rect(x, 'B', 5, j, 16, 1);
  return finish(c);
}

function wardrobe() {
  const { c, x } = mk(24, 38);
  rect(x, 'W', 1, 1, 22, 36); rect(x, 'w', 2, 2, 9, 33); rect(x, 'w', 13, 2, 9, 33);
  rect(x, 'x', 11, 1, 2, 36);                                      // seam
  rect(x, 'y', 3, 3, 7, 1);   rect(x, 'y', 14, 3, 7, 1);
  rect(x, 'W', 4, 6, 5, 12);  rect(x, 'W', 15, 6, 5, 12);        // door panels
  rect(x, 'Y', 9, 18, 1, 3);  rect(x, 'Y', 14, 18, 1, 3);        // knobs
  rect(x, 'x', 1, 35, 22, 2);
  return finish(c);
}

function lamp() {
  const { c, x } = mk(12, 22);
  rect(x, 'Y', 2, 1, 8, 7);   rect(x, 'z', 3, 2, 6, 4);          // shade glow
  rect(x, 'w', 2, 8, 8, 1);
  rect(x, 'm', 5, 9, 2, 8);   rect(x, 'M', 3, 17, 6, 3); rect(x, 'm', 4, 17, 4, 1);
  return finish(c);
}

function plant() {
  const { c, x } = mk(14, 24);
  rect(x, 'g', 5, 1, 4, 14); rect(x, 'g', 2, 4, 3, 8); rect(x, 'g', 9, 4, 3, 8);
  rect(x, 'h', 6, 3, 1, 8);  rect(x, 'g', 3, 10, 8, 3);
  dot(x, 'z', 6, 2);
  rect(x, 'r', 3, 15, 8, 7);  rect(x, 'x', 3, 15, 8, 1); rect(x, 'K', 3, 21, 8, 1);
  return finish(c);
}

function toolbox() {
  const { c, x } = mk(18, 12);
  rect(x, 'r', 1, 3, 16, 8);  rect(x, 'R', 1, 3, 16, 2);
  rect(x, 'M', 6, 1, 6, 2);   rect(x, 'k', 7, 0, 4, 1);          // handle
  rect(x, 'm', 1, 6, 16, 1);  rect(x, 'Y', 8, 5, 2, 2);          // latch
  rect(x, 'K', 1, 10, 16, 1);
  return finish(c);
}

function shelves() {
  const { c, x } = mk(34, 34);
  rect(x, 'x', 1, 1, 32, 32); rect(x, 'K', 2, 2, 30, 30);
  for (const y of [11, 21, 31]) { rect(x, 'w', 1, y, 32, 2); rect(x, 'W', 1, y + 2, 32, 1); }
  // trophies: cup, shoe, watch, ring box, hair tie
  rect(x, 'Y', 5, 5, 5, 4);  rect(x, 'Y', 7, 9, 1, 2); rect(x, 'Y', 5, 10, 5, 1);
  rect(x, 'r', 14, 7, 6, 4); rect(x, 'h', 14, 9, 6, 1);
  rect(x, 'm', 24, 8, 5, 3); rect(x, 'k', 25, 9, 3, 1);
  rect(x, 'b', 5, 16, 6, 5); rect(x, 'z', 7, 17, 2, 1);
  rect(x, 'h', 15, 17, 4, 4); rect(x, 'R', 16, 18, 2, 2);
  rect(x, 'S', 25, 18, 5, 3); rect(x, 'n', 26, 17, 3, 1);
  rect(x, 'H', 5, 25, 7, 6);  rect(x, 'k', 6, 26, 5, 1);
  rect(x, 'g', 17, 26, 8, 5); rect(x, 'z', 18, 27, 2, 1);
  return finish(c);
}

function desk() {
  const { c, x } = mk(40, 26);
  rect(x, 'w', 1, 9, 38, 8);  rect(x, 'y', 1, 9, 38, 2); rect(x, 'W', 1, 17, 38, 2);
  rect(x, 'x', 2, 19, 3, 6);  rect(x, 'x', 35, 19, 3, 6);
  rect(x, 'x', 24, 19, 11, 6); rect(x, 'W', 25, 20, 9, 2); rect(x, 'Y', 29, 22, 1, 1);  // drawer
  // CRT: bulky monitor, bezel, teal screen, scanlines
  rect(x, 'h', 6, 0, 18, 13); rect(x, 'H', 6, 11, 18, 2);
  rect(x, 'k', 8, 1, 14, 9);  rect(x, 'T', 9, 2, 12, 7);
  for (let j = 3; j < 9; j += 2) rect(x, 'g', 9, j, 12, 1);
  rect(x, 'z', 10, 3, 3, 1);
  rect(x, 'M', 11, 13, 8, 2);
  rect(x, 'h', 27, 12, 8, 3); rect(x, 'H', 27, 14, 8, 1);        // keyboard
  rect(x, 'Y', 1, 5, 4, 4);   rect(x, 'z', 2, 6, 2, 2);          // sticky note
  return finish(c);
}

export function makeFurniture() {
  return { sofa: sofa(), table: table(), fridge: fridge(), stove: stove(), bed: bed(), wardrobe: wardrobe(),
    lamp: lamp(), plant: plant(), toolbox: toolbox(), shelves: shelves(), desk_pc: desk() };
}
