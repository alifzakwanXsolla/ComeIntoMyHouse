import { CONFIG } from '../config.js';
import { addTex } from './kit.js';
import { makeTiles } from './tiles.js';
import { makeFurniture } from './propsFurniture.js';
import { makeWallProps } from './propsWall.js';
import { makeDoors } from './propsDoors.js';
import { makeCharacters, FW, FH, COLS, DIRS } from './characters.js';
import { makeUI } from './ui.js';

const SHEETS = new Set(['imran', 'nikki', 'nikki_sil']);

// Call in preload(): queues any real image listed in CONFIG.assets.images. Missing files are skipped silently.
export function preloadArt(scene) {
  const imgs = CONFIG.assets.images || {};
  scene.load.on('loaderror', (f) => console.info('[art] missing, using procedural:', f.key));
  for (const [key, path] of Object.entries(imgs)) scene.load.image(`file:${key}`, path);
}

function slice(scene, key) {
  const t = scene.textures.get(key);
  for (let i = 0; i < COLS * DIRS.length; i++) {
    t.add(i, 0, (i % COLS) * FW, Math.floor(i / COLS) * FH, FW, FH);
  }
}

// Call in create(): every key gets a texture, real file if it loaded, procedural otherwise.
export function generateAll(scene) {
  const all = {
    ...makeTiles(), ...makeFurniture(), ...makeWallProps(), ...makeDoors(),
    ...makeCharacters(), ...makeUI(),
  };
  let real = 0;
  for (const [key, canvas] of Object.entries(all)) {
    const fileKey = `file:${key}`;
    if (scene.textures.exists(fileKey)) {
      const src = scene.textures.get(fileKey).getSourceImage();
      const c = document.createElement('canvas');
      c.width = src.width; c.height = src.height;
      const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(src, 0, 0);
      addTex(scene, key, c); real++;
    } else addTex(scene, key, canvas);
    if (SHEETS.has(key)) slice(scene, key);
  }
  console.info(`[art] ${Object.keys(all).length} textures (${real} from files)`);
  return Object.keys(all);
}
