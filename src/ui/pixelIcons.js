// Pixel icons drawn in code (no image files, no emoji). 10x10 maps, palette letters below.
// iconEl('key', 2) returns a <canvas> styled crisp. Rows may be ragged; they are right-padded.
const PAL = {
  k: '#1a1410', w: '#f2e6d8', g: '#8a8f96', G: '#50555c',
  Y: '#e8c34a', y: '#b08a22', o: '#d9a07a', O: '#a8694a', b: '#4a7ab8',
};

const ICONS = {
  key: [
    '..kkkk....', '.kYYYYk...', '.kY..Yk...', '.kY..Yk...', '.kYYYYk...',
    '..kkYk....', '....Yk....', '....YYk...', '....Yk....', '....YYk...',
  ],
  eye: [
    '..........', '...kkkk...', '.kkwwwwkk.', 'kwwwbbwwwk', 'kwwbkkbwwk',
    'kwwwbbwwwk', '.kkwwwwkk.', '...kkkk...', '..........', '..........',
  ],
  ear: [
    '...kkkk...', '..kooooOk.', '.koOkkooOk', '.koOoOooOk', '.kooOooOk.',
    '..kooOoOk.', '...kooOk..', '....kOok..', '.....kkk..', '..........',
  ],
  note: [
    'kkkkkkkkk.', 'kYYYYYYYk.', 'kYkkkkkYk.', 'kYYYYYYYk.', 'kYkkkkkYk.',
    'kYYYYYYYk.', 'kYkkkYYYk.', 'kYYYYYYYk.', 'kkkkkkkkk.', '..........',
  ],
  clock: [
    '...kkkk...', '..kwwwwk..', '.kwwwkwwk.', '.kwwwkwwk.', '.kwwwkkwk.',
    '.kwwwwwwk.', '..kwwwwk..', '...kkkk...', '..........', '..........',
  ],
  battery: [
    '...kkkk...', '...kggk...', '..kkkkkk..', '..kGGGGk..', '..kYYYYk..',
    '..kYYYYk..', '..kYYYYk..', '..kYYYYk..', '..kkkkkk..', '..........',
  ],
};

export const ICON_NAMES = Object.keys(ICONS);

export function iconEl(name, scale = 2) {
  const rows = ICONS[name] || ICONS.note;
  const c = document.createElement('canvas');
  c.width = 10; c.height = 10;
  c.className = 'pxicon';
  c.style.width = `${10 * scale}px`;
  c.style.height = `${10 * scale}px`;
  const x = c.getContext('2d');
  rows.forEach((row, y) => {
    for (let i = 0; i < 10; i++) {
      const col = PAL[row[i]];
      if (col) { x.fillStyle = col; x.fillRect(i, y, 1, 1); }
    }
  });
  return c;
}
