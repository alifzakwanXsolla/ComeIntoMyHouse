// Generates all placeholder textures procedurally, then goes to the title.
import { CONFIG } from '../config.js';
import { makeTiles } from '../art/tiles.js';
import { mk, rect, dot, addTex } from '../art/kit.js';

const KENNEY = 'assets/kenney/';
const SHEET = { frameWidth: 16, frameHeight: 16, spacing: 1 };

// 16x16 procedural props the Kenney packs do not have (outlined, 2-3 tones, no gradients).
function door(open) {
  const { c, x } = mk(16, 16);
  rect(x, 'k', 0, 0, 16, 16);
  if (open) {
    rect(x, 'x', 1, 0, 14, 16); rect(x, 'K', 3, 0, 10, 16); rect(x, 'k', 3, 0, 10, 2);
    rect(x, 'W', 1, 0, 2, 16); rect(x, 'W', 13, 0, 2, 16);
  } else {
    rect(x, 'w', 1, 1, 14, 14); rect(x, 'y', 1, 1, 14, 1);
    for (const px of [5, 10]) rect(x, 'W', px, 2, 1, 13);
    for (const py of [4, 11]) { rect(x, 'M', 1, py, 14, 2); rect(x, 'm', 1, py, 14, 1); }
    rect(x, 'k', 6, 6, 4, 4); rect(x, 'Y', 7, 7, 2, 2); dot(x, 'k', 8, 8);
  }
  return c;
}

function fusebox() {
  const { c, x } = mk(16, 16);
  rect(x, 'k', 1, 1, 14, 14); rect(x, 'M', 2, 2, 12, 12); rect(x, 'm', 2, 2, 12, 2);
  rect(x, 'k', 7, 4, 1, 10);
  rect(x, 'k', 3, 5, 3, 5); rect(x, 'R', 4, 6, 1, 3);
  rect(x, 'k', 9, 5, 4, 3); dot(x, 'T', 10, 6); dot(x, 'Y', 12, 6);
  rect(x, 'k', 9, 9, 4, 3); dot(x, 'R', 10, 10); dot(x, 'M', 12, 10);
  return c;
}

function chalkWall() {
  const { c, x } = mk(16, 16);
  rect(x, 'k', 0, 1, 16, 14); rect(x, 'x', 1, 2, 14, 12); rect(x, 'K', 2, 3, 12, 10);
  const chalk = [[3, 5], [4, 5], [5, 5], [5, 6], [5, 7], [4, 8], [3, 8], [3, 9], [4, 10], [5, 10], [8, 5], [8, 6], [8, 7], [9, 8], [10, 7], [10, 6], [10, 5], [11, 10], [12, 10]];
  chalk.forEach(([i, j]) => dot(x, 'h', i, j));
  return c;
}

export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    this.load.spritesheet('indoor', KENNEY + 'roguelike-indoors/Tilesheets/roguelikeIndoor_transparent.png', SHEET);
    this.load.spritesheet('chars', KENNEY + 'roguelike-characters/Spritesheet/roguelikeChar_transparent.png', SHEET);
  }

  create() {
    const T = CONFIG.tile;
    const tiles = makeTiles();
    for (const k of ['floor_concrete', 'floor_concrete_crack', 'floor_concrete_stain', 'wall_block', 'wall_top']) addTex(this, 'px_' + k, tiles[k]);
    addTex(this, 'px_door_open', door(true));
    addTex(this, 'px_door_locked', door(false));
    addTex(this, 'px_fusebox', fusebox());
    addTex(this, 'px_chalk', chalkWall());

    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Player: little body with head
    g.clear();
    g.fillStyle(0x3a6ea5).fillRect(8, 12, 16, 16);
    g.fillStyle(0xf0c8a0).fillRect(10, 2, 12, 12);
    g.fillStyle(0x222222).fillRect(12, 6, 2, 2).fillRect(18, 6, 2, 2);
    g.generateTexture('player', T, T);

    // Wall tile
    g.clear();
    g.fillStyle(0x1c1416).fillRect(0, 0, T, T);
    g.lineStyle(1, 0x2a1d20).strokeRect(0.5, 0.5, T - 1, T - 1);
    g.generateTexture('wall', T, T);

    // Door tiles
    g.clear();
    g.fillStyle(0x5a3a1e).fillRect(2, 0, T - 4, T);
    g.fillStyle(0xc8a050).fillCircle(T - 9, T / 2, 2);
    g.generateTexture('door_open', T, T);
    g.clear();
    g.fillStyle(0x3a1e1e).fillRect(2, 0, T - 4, T);
    g.fillStyle(0xc03030).fillRect(T / 2 - 5, T / 2 - 4, 10, 8);
    g.generateTexture('door_locked', T, T);

    // Interactable marker (tinted per object)
    g.clear();
    g.fillStyle(0xffffff).fillRect(4, 4, T - 8, T - 8);
    g.lineStyle(2, 0x000000, 0.5).strokeRect(4, 4, T - 8, T - 8);
    g.generateTexture('obj', T, T);

    g.destroy();
    this.scene.start('Title');
  }
}
