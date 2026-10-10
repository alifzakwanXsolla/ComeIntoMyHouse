import { mk, rect, dot, fromMap } from './kit.js';

const pad = (rows, w) => rows.map((r) => r.padEnd(w, '.'));

// 24x24 source for a 9-slice box: 8px corners, 8px stretchable centre.
function box9() {
  const { c, x } = mk(24, 24);
  rect(x, 'k', 0, 0, 24, 24);
  rect(x, 'M', 1, 1, 22, 22);
  rect(x, 'k', 2, 2, 20, 20);
  rect(x, 'K', 3, 3, 18, 18);
  for (const [px, py] of [[0, 0], [23, 0], [0, 23], [23, 23]]) x.clearRect(px, py, 1, 1);
  for (const [px, py] of [[3, 3], [20, 3], [3, 20], [20, 20]]) dot(x, 'M', px, py);
  return c;
}

const ICONS = {
  icon_flashlight: ['............', '...kkkkkk...', '..kzzzzzzk..', '..kkMMMMkk..', '...kMmmMk...', '...kMmmMk...', '...kMmmMk...', '...kMmmMk...', '...kMmmMk...', '...kMmmMk...', '...kkkkkk...'],
  icon_batteries: ['............', '..kk....kk..', '..kk....kk..', '.kkkk..kkkk.', '.kYYk..kYYk.', '.kYYk..kYYk.', '.kmmk..kmmk.', '.kmmk..kmmk.', '.kmmk..kmmk.', '.kkkk..kkkk.'],
  icon_key: ['............', '..kkkk......', '.kYYYYk.....', '.kY..Yk.....', '.kYYYYYYYYk.', '..kkkk.kYYk.', '.......kYk..', '.......kYYk.', '........kkk.'],
  icon_phone: ['............', '...kkkkkk...', '..kMMMMMMk..', '..kMTTTTMk..', '..kMTzzTMk..', '..kMTTTTMk..', '..kMTTTTMk..', '..kMTTTTMk..', '..kMMMMMMk..', '..kMMkkMMk..', '...kkkkkk...'],
  icon_note: ['............', '.kkkkkkkkk..', '.kYYYYYYYk..', '.kYkkkkkYk..', '.kYYYYYYYk..', '.kYkkkkYYk..', '.kYYYYYYYk..', '.kYkkkYYYk..', '.kYYYYYYYk..', '.kkkkkkkkk..'],
};

export function makeUI() {
  const out = { box9: box9() };
  for (const [k, rows] of Object.entries(ICONS)) out[k] = fromMap(pad(rows, 12));
  return out;
}
