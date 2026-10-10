import { mk, rect, dot, outline } from './kit.js';

// Doors are 16 wide x 24 tall (one tile wide, front face of the wall).
function doorBase(frameCh = 'x') {
  const { c, x } = mk(18, 26);
  rect(x, frameCh, 1, 1, 16, 24);
  return { c, x };
}

function open() {
  const { c, x } = doorBase('W');
  rect(x, 'k', 3, 3, 12, 22);                                      // dark opening
  rect(x, 'K', 4, 4, 10, 20);
  rect(x, 'w', 3, 3, 2, 22);                                       // open leaf edge
  return outline(c);
}

function closed() {
  const { c, x } = doorBase('x');
  rect(x, 'w', 3, 3, 12, 22); rect(x, 'y', 3, 3, 12, 1);
  rect(x, 'W', 5, 6, 8, 7);   rect(x, 'W', 5, 15, 8, 8);          // panels
  rect(x, 'Y', 12, 14, 2, 2);                                      // knob
  return outline(c);
}

// Locked: same door + extra bolts (the house has too many locks) and a keypad variant.
function locked() {
  const { c, x } = doorBase('x');
  rect(x, 'w', 3, 3, 12, 22); rect(x, 'W', 5, 6, 8, 7); rect(x, 'W', 5, 15, 8, 8);
  rect(x, 'm', 11, 7, 4, 2);  rect(x, 'M', 11, 9, 4, 1);          // bolt 1
  rect(x, 'm', 11, 17, 4, 2); rect(x, 'M', 11, 19, 4, 1);         // bolt 2
  rect(x, 'Y', 12, 13, 2, 2);
  return outline(c);
}

function keypad() {
  const { c, x } = doorBase('M');
  rect(x, 'c', 3, 3, 12, 22); rect(x, 'C', 3, 3, 12, 2);
  rect(x, 'k', 5, 7, 8, 14);                                       // pad housing
  rect(x, 'T', 6, 8, 6, 3);                                        // display
  for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) rect(x, 'm', 6 + i * 2, 12 + j * 2, 1, 1);
  dot(x, 'R', 12, 19);
  rect(x, 'K', 3, 22, 12, 1);                                      // hatch slot shadow
  return outline(c);
}

function stairsUp() {
  const { c, x } = mk(34, 34);
  for (let j = 0; j < 8; j++) {                                    // steps narrowing upward
    rect(x, j % 2 ? 'W' : 'w', 2, 28 - j * 3 - 2, 30, 3);
    rect(x, 'x', 2, 28 - j * 3, 30, 1);
  }
  rect(x, 'k', 1, 1, 32, 6);
  rect(x, 'x', 0, 6, 2, 26); rect(x, 'x', 32, 6, 2, 26);          // rails
  return outline(c);
}

function stairsDown() {
  const { c, x } = mk(34, 34);
  rect(x, 'k', 2, 2, 30, 30);
  for (let j = 0; j < 7; j++) rect(x, j % 2 ? 'K' : 'C', 2 + j, 3 + j * 4, 30 - j * 2, 4);
  rect(x, 'x', 0, 2, 2, 30); rect(x, 'x', 32, 2, 2, 30);
  return outline(c);
}

export function makeDoors() {
  return { door_open: open(), door_closed: closed(), door_locked: locked(), door_keypad: keypad(),
    stairs_up: stairsUp(), stairs_down: stairsDown() };
}
