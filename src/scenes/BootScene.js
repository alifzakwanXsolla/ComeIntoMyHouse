// Generates all placeholder textures procedurally, then goes to the title.
import { CONFIG } from '../config.js';

export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    const T = CONFIG.tile;
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
