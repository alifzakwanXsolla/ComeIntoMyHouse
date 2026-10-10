import { ROOM } from './roomLayout.js';

const T = 16;

// Builds floor, walls and props. Returns what the scene needs for collision, interaction and effects.
export function buildRoom(scene) {
  for (let r = 0; r < ROOM.rows; r++) for (let c = 0; c < ROOM.cols; c++) {
    const key = r === 0 ? 'wall_top' : r < ROOM.wallRows ? 'wall_paper' : ROOM.floorKey(c, r);
    scene.add.image(c * T, r * T, key).setOrigin(0).setDepth(0);
  }
  const solids = [], targets = [], glows = [];
  let crt = null, led = null;

  for (const p of ROOM.props) {
    const tex = scene.textures.get(p.key).getSourceImage();
    if (p.kind === 'wall') {
      const x = Math.round(p.x - tex.width / 2), y = Math.round(p.y - tex.height / 2);
      scene.add.image(x, y, p.key).setOrigin(0).setDepth(2);
      if (p.led) led = { x: x + 2, y: y + 3 };
      if (p.text) targets.push({ ...p, rect: { x: p.x - 8, y: 30, w: 16, h: 4 } });
    } else {
      // textures carry a 3px baked shadow below the art, so lift by 3 to put the art's base on the foot line
      const img = scene.add.image(Math.round(p.x), p.y + 3, p.key).setOrigin(0.5, 1).setDepth(p.y);
      const [sw, sh] = p.solid;
      const rect = { x: Math.round(p.x - sw / 2), y: p.y - sh, w: sw, h: sh };
      solids.push(rect);
      if (p.text) targets.push({ ...p, rect });
      if (p.light) glows.push({ x: p.x, y: p.y - p.light + 24, r: 38, warm: true });
      if (p.crt) {
        crt = { x: Math.round(p.x - img.width / 2) + 10, y: p.y + 3 - img.height + 2, w: 12, h: 7 };
        glows.push({ x: p.x - 6, y: p.y - 18, r: 30, warm: false });
      }
      img.setData('id', p.key);
    }
  }
  return { solids, targets, glows, crt, led };
}

// Cheap animated bits: CRT scanline flicker + glow tint, camera LED pulse, warm lamp tint.
export function makeFx(scene, room) {
  const g = scene.add.graphics().setDepth(950);
  return (t) => {
    g.clear();
    if (room.crt) {
      const { x, y, w, h } = room.crt;
      const flick = 0.10 + 0.05 * Math.sin(t * 31) + (Math.sin(t * 2.3) > 0.96 ? 0.12 : 0);
      g.fillStyle(0x5fd0c0, flick).fillRect(x, y, w, h);
      const row = Math.floor((t * 6) % h);
      g.fillStyle(0xc8fff0, 0.22).fillRect(x, y + row, w, 1);
      for (let j = 1; j < h; j += 2) g.fillStyle(0x08201c, 0.18).fillRect(x, y + j, w, 1);
    }
    for (const l of room.glows) {
      const a = (l.warm ? 0.07 : 0.05) * (0.85 + 0.15 * Math.sin(t * (l.warm ? 3 : 9)));
      const c = l.warm ? 0xffc060 : 0x60e0d0;
      g.fillStyle(c, a).fillCircle(Math.round(l.x), Math.round(l.y), l.r);
      g.fillStyle(c, a).fillCircle(Math.round(l.x), Math.round(l.y), Math.round(l.r * 0.55));
    }
    if (room.led) {
      const on = Math.floor(t * 0.9) % 2 === 0;
      g.fillStyle(on ? 0xff3030 : 0x401010, 1).fillRect(room.led.x, room.led.y, 1, 1);
      if (on) g.fillStyle(0xff3030, 0.25).fillRect(room.led.x - 1, room.led.y - 1, 3, 3);
    }
  };
}
