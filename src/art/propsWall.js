import { mk, rect, dot, outline, withShadow } from './kit.js';

const finish = (c) => outline(c);

function clock() {
  const { c, x } = mk(14, 14);
  rect(x, 'w', 2, 1, 10, 12); rect(x, 'h', 3, 2, 8, 10); rect(x, 'H', 3, 10, 8, 2);
  rect(x, 'k', 7, 4, 1, 4);   rect(x, 'k', 7, 7, 3, 1);          // hands
  dot(x, 'k', 7, 2); dot(x, 'k', 7, 11); dot(x, 'k', 3, 6); dot(x, 'k', 10, 6);
  rect(x, 'x', 5, 12, 4, 1);
  return finish(c);
}

function frame(inner = 'dog') {
  const { c, x } = mk(14, 16);
  rect(x, 'w', 1, 1, 12, 14); rect(x, 'y', 1, 1, 12, 1); rect(x, 'h', 3, 3, 8, 10);
  if (inner === 'dog') {
    rect(x, 'S', 5, 6, 5, 4); rect(x, 'S', 4, 5, 2, 3); rect(x, 'S', 9, 5, 2, 2);   // dog head + ears
    dot(x, 'k', 6, 7); dot(x, 'k', 8, 7); dot(x, 'k', 7, 9);
    rect(x, 'r', 5, 10, 5, 1); dot(x, 'Y', 7, 11);                                    // collar + tag
  } else {
    rect(x, 'b', 3, 3, 8, 10); rect(x, 'h', 4, 6, 6, 3);                              // date card
    dot(x, 'k', 5, 7); dot(x, 'k', 7, 7); dot(x, 'k', 9, 7);
  }
  return finish(c);
}

function photoWall() {
  const { c, x } = mk(40, 24);
  const spots = [[1, 2, 'h'], [10, 1, 'H'], [19, 3, 'h'], [28, 1, 'H'], [4, 12, 'H'], [14, 11, 'h'], [24, 12, 'H'], [32, 10, 'h']];
  spots.forEach(([i, j, ch], n) => {
    rect(x, 'k', i, j, 8, 9); rect(x, ch, i + 1, j + 1, 6, 7);
    rect(x, n % 2 ? 'S' : 's', i + 3, j + 2, 2, 3); rect(x, 'n', i + 2, j + 2, 1, 4);
  });
  return c;
}

function curtain() {
  const { c, x } = mk(26, 28);
  rect(x, 'm', 0, 0, 26, 2);                                       // rod
  rect(x, 'P', 1, 2, 24, 24);
  for (let i = 1; i < 25; i += 4) { rect(x, 'r', i, 2, 2, 24); rect(x, 'K', i + 2, 2, 1, 24); }
  rect(x, 'h', 5, 8, 16, 1); rect(x, 'h', 5, 16, 16, 1);         // tape strips sealing the edges
  rect(x, 'K', 1, 26, 24, 1);
  return finish(c);
}

function camera() {
  const { c, x } = mk(10, 9);
  rect(x, 'M', 4, 0, 2, 2);                                        // mount
  rect(x, 'h', 1, 2, 8, 5); rect(x, 'H', 1, 5, 8, 2);
  rect(x, 'k', 6, 3, 2, 2);                                        // lens
  dot(x, 'R', 2, 3);                                               // red LED (pulsed in code)
  return finish(c);
}

function boardedWindow() {
  const { c, x } = mk(24, 22);
  rect(x, 'k', 0, 0, 24, 22); rect(x, 'K', 1, 1, 22, 20);
  rect(x, 'W', 0, 4, 24, 4);  rect(x, 'w', 0, 5, 24, 1);
  rect(x, 'W', 0, 13, 24, 4); rect(x, 'w', 0, 14, 24, 1);
  [[4, 5], [19, 5], [4, 14], [19, 14]].forEach(([i, j]) => dot(x, 'm', i, j));
  rect(x, 'T', 8, 9, 3, 1);                                        // slit of cold light
  return c;
}

function radio() {
  const { c, x } = mk(16, 12);
  rect(x, 'w', 1, 1, 14, 10); rect(x, 'W', 1, 9, 14, 2);
  rect(x, 'k', 3, 3, 6, 5);   rect(x, 'M', 4, 4, 4, 3);
  rect(x, 'h', 11, 3, 3, 3);  dot(x, 'k', 12, 4);
  rect(x, 'm', 12, 0, 1, 2);
  return finish(c);
}

function mattress() {
  const { c, x } = mk(26, 36);
  rect(x, 'H', 1, 1, 24, 34); rect(x, 'h', 2, 2, 22, 32);
  for (let j = 6; j < 32; j += 6) rect(x, 'H', 3, j, 20, 1);
  rect(x, 'S', 4, 3, 10, 5);  rect(x, 'P', 3, 14, 20, 20);         // thin pillow + blanket
  rect(x, 'C', 6, 20, 6, 4);                                       // stain
  return finish(c);
}

export function makeWallProps() {
  return { clock: clock(), frame_dog: frame('dog'), frame_date: frame('date'), photo_wall: photoWall(),
    curtain: curtain(), camera: camera(), window_boarded: boardedWindow(), radio: radio(), mattress: mattress() };
}
