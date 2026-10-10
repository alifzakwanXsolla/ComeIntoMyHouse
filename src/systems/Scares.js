import { CONFIG } from '../config.js';
import { bus } from '../bus.js';

const rand = ([a, b]) => a + Math.random() * (b - a);

// Scripted scares. Everything goes through scene.lighting / scene.audio and the bus.
export class Scares {
  constructor(scene) {
    this.scene = scene;
    this.visited = new Set();
    this.lastBuzz = 0;
    this.edge = document.getElementById('edge');

    const off = bus.on('phone:message', ({ from }) => from === 'nikki' && this.buzz());
    scene.events.once('shutdown', off);

    scene.time.delayedCall(rand(CONFIG.scares.fakeOutAfter) * 1000, () => this.fakeOut());
  }

  emit(kind, extra = {}) { bus.emit('scare:triggered', { kind, ...extra }); }

  // Called by GameScene when the player crosses into a room.
  onRoom(roomId) {
    const first = !this.visited.has(roomId);
    const isStartRoom = this.visited.size === 0;
    this.visited.add(roomId);

    if (first && !isStartRoom) {
      const s = this.scene;
      s.lighting.flicker(CONFIG.scares.flickerMs);
      s.time.delayedCall(CONFIG.scares.slamDelayMs, () => {
        if (s.ended) return;
        s.audio.slam();
        this.emit('slam', { roomId });
      });
    }
    if (roomId === 'basement' && !this.stepsOn) { this.stepsOn = true; this.footsteps(CONFIG.scares.footstepsFirstMs); }
  }

  // Footsteps overhead; repeats while the player stays in the basement.
  footsteps(delayMs) {
    const s = this.scene;
    s.time.delayedCall(delayMs, () => {
      if (s.ended || s.currentRoom !== 'basement') { this.stepsOn = false; return; }
      s.audio.footsteps();
      this.emit('footsteps');
      this.footsteps(rand(CONFIG.scares.footstepsEvery) * 1000);
    });
  }

  buzz() {
    const now = this.scene.time.now;
    if (this.scene.ended || now - this.lastBuzz < 2500) return;
    this.lastBuzz = now;
    this.scene.audio.buzz();
    this.pulseEdge();
  }

  pulseEdge() {
    if (!this.edge) return;
    this.edge.classList.remove('pulse');
    void this.edge.offsetWidth; // restart the CSS animation
    this.edge.classList.add('pulse');
  }

  // The one fake-out: lights die for a few seconds. Waits for a calm moment.
  fakeOut() {
    const s = this.scene;
    if (s.ended) return;
    if (s.panel.isOpen) return s.time.delayedCall(4000, () => this.fakeOut());
    s.audio.powerDown();
    s.lighting.blackout(CONFIG.scares.blackoutMs);
    this.emit('blackout', { ms: CONFIG.scares.blackoutMs });
  }
}
