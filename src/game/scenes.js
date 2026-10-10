// Boot (art), Title and the Ending.
import { bus } from '../bus.js';
import { preloadArt, generateAll } from '../art/pixelArt.js';
import { frameIndex } from '../art/characters.js';
import { GameAudio } from '../systems/Audio.js';
import { unlockAudio } from '../platform/gamepix.js';
import { resetGame } from './state.js';
import { ENDING, ENDING_TEXT } from './story.js';
import { W, H } from './RoomScene.js';

const PX = '"Press Start 2P", monospace';

export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  preload() {
    preloadArt(this);
    this.load.spritesheet('indoor', 'assets/kenney/roguelike-indoors/Tilesheets/roguelikeIndoor_transparent.png', { frameWidth: 16, frameHeight: 16, spacing: 1 });
  }
  create() {
    generateAll(this);
    const dbg = new URLSearchParams(location.search).get('debug');
    const skip = dbg === '1';
    if (dbg && dbg.startsWith('room:')) { resetGame(); bus.emit('game:start'); this.scene.start('Room', { room: dbg.slice(5) }); return; }
    if (dbg === 'prologue') { resetGame(); bus.emit('game:start'); this.scene.start('Room', { room: 'party' }); return; }
    if (skip) bus.emit('game:start');
    this.scene.start(skip ? 'Room' : 'Title', skip ? { room: 'cell' } : undefined);
  }
}

export class TitleScene extends Phaser.Scene {
  constructor() { super('Title'); }
  create() {
    this.cameras.main.setBackgroundColor('#07050b');
    // a silhouette in a lit doorway behind the title
    const g = this.add.graphics();
    g.fillStyle(0x2a1e18, 1).fillRect(W / 2 - 14, 92, 28, 44);
    g.fillStyle(0xffd890, 0.9).fillRect(W / 2 - 11, 95, 22, 41);
    g.fillStyle(0xffd890, 0.12).fillTriangle(W / 2 - 11, 136, W / 2 + 11, 136, W / 2 + 40, 180).fillTriangle(W / 2 - 11, 136, W / 2 - 40, 180, W / 2 + 40, 180);
    this.add.sprite(W / 2, 136, 'nikki_sil', frameIndex('down', 0)).setOrigin(0.5, 1);
    this.add.text(W / 2, 30, 'DEADBOLT', { fontFamily: PX, fontSize: '24px', color: '#e0607e' }).setOrigin(0.5);
    this.add.text(W / 2, 56, 'she asked you to come over', { fontFamily: PX, fontSize: '6px', color: '#a89a8a' }).setOrigin(0.5);
    const p = this.add.text(W / 2, 154, 'PRESS ANY KEY', { fontFamily: PX, fontSize: '8px', color: '#f2e6d8' }).setOrigin(0.5);
    this.add.text(W / 2, 168, 'WASD move  SHIFT sneak  E use  H hint  N notes', { fontFamily: PX, fontSize: '5px', color: '#6b5a4a' }).setOrigin(0.5);
    this.tweens.add({ targets: p, alpha: 0.2, yoyo: true, repeat: -1, duration: 800 });
    let started = false;
    const go = () => {
      if (started) return;
      started = true;
      unlockAudio();
      const audio = new GameAudio();
      this.registry.set('audio', audio);
      audio.init().then(() => { audio.startAmbient(); audio.startHeartbeat(); audio.setHeartbeat(62); });
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => { resetGame(); bus.emit('game:start'); this.scene.start('Room', { room: 'party' }); });
    };
    this.input.keyboard.once('keydown', go);
    this.input.once('pointerdown', go);
  }
}

export class EndScene extends Phaser.Scene {
  constructor() { super('End'); }
  create() {
    bus.emit('game:win');
    const audio = this.registry.get('audio');
    audio?.stopLoops?.();
    this.cameras.main.setBackgroundColor('#000000');
    const txt = this.add.text(W / 2, 80, '', { fontFamily: PX, fontSize: '8px', color: '#f2e6d8', align: 'center', wordWrap: { width: W - 40 }, lineSpacing: 6 }).setOrigin(0.5);
    let i = 0;
    const step = () => {
      if (i < ENDING.length) {
        txt.setAlpha(0).setText(ENDING[i++]);
        this.tweens.add({ targets: txt, alpha: 1, duration: 700 });
        this.time.delayedCall(3200, step);
      } else phone();
    };
    const phone = () => {
      txt.setText('');
      audio?.buzz?.();
      const g = this.add.graphics();
      g.fillStyle(0x1a1418, 1).fillRoundedRect(W / 2 - 50, 30, 100, 110, 8);
      g.fillStyle(0x0b0810, 1).fillRect(W / 2 - 44, 40, 88, 90);
      g.fillStyle(0x2a2030, 1).fillRoundedRect(W / 2 - 40, 70, 80, 34, 4);
      this.add.text(W / 2 - 36, 74, ENDING_TEXT.from, { fontFamily: PX, fontSize: '5px', color: '#a89a8a' });
      this.add.text(W / 2 - 36, 84, ENDING_TEXT.text, { fontFamily: PX, fontSize: '6px', color: '#f2e6d8', wordWrap: { width: 74 }, lineSpacing: 3 });
      bus.emit('phone:message', { from: ENDING_TEXT.from, text: ENDING_TEXT.text });
      this.time.delayedCall(3500, () => {
        this.add.text(W / 2, 152, 'DEADBOLT', { fontFamily: PX, fontSize: '12px', color: '#e0607e' }).setOrigin(0.5);
        const again = this.add.text(W / 2, 168, 'you escaped.  press R to play again', { fontFamily: PX, fontSize: '5px', color: '#a89a8a' }).setOrigin(0.5);
        this.tweens.add({ targets: again, alpha: 0.3, yoyo: true, repeat: -1, duration: 900 });
        this.input.keyboard.once('keydown-R', () => location.reload());
      });
    };
    this.time.delayedCall(800, step);
  }
}
