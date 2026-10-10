import { CONFIG } from '../config.js';
import { TestRoomScene } from './TestRoomScene.js';

async function boot() {
  // Make sure the pixel font is ready before any Text object is created.
  try { await Promise.race([document.fonts.load('8px "Press Start 2P"'), new Promise((r) => setTimeout(r, 2500))]); } catch (e) { /* fall back to monospace */ }
  new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: CONFIG.render.width,
    height: CONFIG.render.height,
    backgroundColor: '#0b0708',
    pixelArt: true,
    roundPixels: true,
    antialias: false,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [TestRoomScene],
  });
}
boot();
