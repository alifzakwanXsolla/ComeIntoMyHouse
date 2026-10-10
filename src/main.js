// Deadbolt entry point. Game code lives in src/game/, pixel art in src/art/.
import { bus } from './bus.js';
import { initPlatform, gameLoaded } from './platform/gamepix.js';
import { fitStage } from './platform/fit.js';
import { initNotes } from './game/notes.js';
import { BootScene, TitleScene, IntroScene, EndScene } from './game/scenes.js';
import { RoomScene, W, H } from './game/RoomScene.js';

const ZOOM = 3;
const notes = initNotes(document.getElementById('notes'));

if (new URLSearchParams(location.search).get('log')) bus.on('*', (type, data) => console.log('[bus]', type, data));

async function boot() {
  // Pixel fonts must be ready before any Text object is created.
  try {
    await Promise.race([
      document.fonts.load('8px "Press Start 2P"'),
      new Promise((r) => setTimeout(r, 2500)),
    ]);
  } catch (e) { /* fall back to monospace */ }

  initPlatform();
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: W,
    height: H,
    zoom: ZOOM,
    backgroundColor: '#07050b',
    pixelArt: true,
    roundPixels: true,
    scene: [BootScene, TitleScene, IntroScene, RoomScene, EndScene],
  });
  game.registry.set('noteIds', notes.ids);
  window.__deadbolt = game; // handy for debugging in the console
  fitStage(document.getElementById('stage'), W * ZOOM, H * ZOOM, () => game.scale.refresh());

  // Hidden tab or ad playing: freeze the loop. Audio listens to the same events.
  bus.on('platform:pause', () => game.loop.sleep());
  bus.on('platform:resume', () => game.loop.wake());

  game.events.once('ready', () => { document.getElementById('loading')?.remove(); gameLoaded(); });
}
boot();
