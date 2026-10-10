import { CONFIG } from './config.js';
import { bus } from './bus.js';
import { initPhoneStub } from './phone/phoneStub.js';
import { BootScene } from './scenes/BootScene.js';
import { GameScene } from './scenes/GameScene.js';
import { TitleScene, EndScene } from './scenes/EndScene.js';

// Phone: swap this line for the real phone UI. It only needs the bus (docs/PHONE_API.md).
initPhoneStub(bus, document.getElementById('phone'));

// Log every event so the contract is easy to inspect in the console.
bus.on('*', (type, data) => { if (new URLSearchParams(location.search).get('log')) console.log('[bus]', type, data); });

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: CONFIG.view.width,
  height: CONFIG.view.height,
  backgroundColor: '#0b0708',
  pixelArt: true,
  scene: [BootScene, TitleScene, GameScene, EndScene],
});
