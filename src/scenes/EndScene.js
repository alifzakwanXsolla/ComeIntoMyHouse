import { CONFIG } from '../config.js';

// Title, GameOver and Win in one tiny file.
export class TitleScene extends Phaser.Scene {
  constructor() { super('Title'); }

  create() {
    const { width, height } = CONFIG.view;
    this.cameras.main.setBackgroundColor('#0b0708');
    this.add.text(width / 2, 200, 'Nikki', { fontFamily: 'Georgia', fontSize: '72px', color: '#e0607e' }).setOrigin(0.5);
    this.add.text(width / 2, 270, 'she asked you to come over', { fontFamily: 'Georgia', fontSize: '22px', color: '#a89a8a' }).setOrigin(0.5);
    const t = this.add.text(width / 2, 400, 'Click or press any key to knock', { fontFamily: 'Georgia', fontSize: '18px', color: '#f2e6d8' }).setOrigin(0.5);
    this.tweens.add({ targets: t, alpha: 0.3, yoyo: true, repeat: -1, duration: 900 });
    this.add.text(width / 2, 520, 'WASD / arrows: move   E: interact   H: ask Nikki for help   Esc: step back', { fontFamily: 'monospace', fontSize: '13px', color: '#6b5a4a' }).setOrigin(0.5);

    const go = () => this.scene.start('Game');
    this.input.keyboard.once('keydown', go);
    this.input.once('pointerdown', go);
  }
}

export class EndScene extends Phaser.Scene {
  constructor() { super('End'); }

  init(data) { this.win = !!data.win; this.reason = data.reason; }

  create() {
    const { width, height } = CONFIG.view;
    this.cameras.main.setBackgroundColor('#000000');
    this.cameras.main.fadeIn(1500, 0, 0, 0);
    const title = this.win ? 'you got out' : CONFIG.deathCard;
    const sub = this.win
      ? 'the door clicked open. you did not look back.'
      : this.reason === 'time' ? 'you ran out of time.' : 'you ran out of chances.';
    const color = this.win ? '#f2e6d8' : '#c03050';
    this.add.text(width / 2, height / 2 - 20, title, { fontFamily: 'Georgia', fontSize: '44px', color, fontStyle: 'italic' }).setOrigin(0.5);
    this.add.text(width / 2, height / 2 + 40, sub, { fontFamily: 'Georgia', fontSize: '18px', color: '#6b5a4a' }).setOrigin(0.5);
    const t = this.add.text(width / 2, height - 80, 'press R to try again', { fontFamily: 'monospace', fontSize: '14px', color: '#6b5a4a' }).setOrigin(0.5);
    this.tweens.add({ targets: t, alpha: 0.3, yoyo: true, repeat: -1, duration: 1000 });
    this.time.delayedCall(1200, () => {
      this.input.keyboard.once('keydown-R', () => location.reload());
    });
  }
}
