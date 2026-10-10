import { CONFIG } from '../config.js';

// Registers puzzles, tracks solved state, key fragments and strikes.
// Puzzle contract: { id, room, title, reward, start(scene, bus), isSolved() }
export class PuzzleManager {
  constructor(bus) {
    this.bus = bus;
    this.puzzles = new Map();
    this.solved = new Set();
    this.fragments = {};
    this.totalStrikes = 0;
    this.puzzleStrikes = {};
    this.active = null;
  }

  register(p) {
    if (this.puzzles.has(p.id)) throw new Error('duplicate puzzle id ' + p.id);
    this.puzzles.set(p.id, p);
  }

  isSolved(id) { return this.solved.has(id); }
  get all() { return [...this.puzzles.values()]; }
  get solvedCount() { return this.solved.size; }
  get fragmentList() { return this.all.filter((p) => this.solved.has(p.id)).map((p) => this.fragments[p.id]); }

  start(scene, id) {
    const p = this.puzzles.get(id);
    if (this.active) return;
    if (!p) return scene.hud.toast('Nothing happens. (puzzle not built yet)');
    if (this.solved.has(id)) return scene.hud.toast('You already solved this.');
    this.active = id;
    this.bus.emit('puzzle:started', { id, title: p.title, room: p.room });
    p.start(scene, this.bus);
  }

  close(scene) {
    this.active = null;
    scene.panel.close();
  }

  progress(id, detail) { this.bus.emit('puzzle:progress', { id, detail }); }

  wrong(scene, id) {
    this.totalStrikes++;
    this.puzzleStrikes[id] = (this.puzzleStrikes[id] || 0) + 1;
    this.bus.emit('puzzle:wrong', { id, strikes: this.puzzleStrikes[id], totalStrikes: this.totalStrikes });
    scene.cameras.main.shake(260, 0.006 + this.totalStrikes * 0.002);
    if (this.totalStrikes >= CONFIG.maxStrikes) {
      this.active = null;
      scene.panel.close();
      this.bus.emit('game:over', { reason: 'strikes' });
    }
  }

  solve(scene, id) {
    const p = this.puzzles.get(id);
    if (!p || this.solved.has(id)) return;
    this.solved.add(id);
    this.fragments[id] = p.reward;
    this.bus.emit('puzzle:solved', { id, fragment: p.reward });
    this.close(scene);
  }

  // Debug helper: solve without UI.
  forceSolve(scene, id) {
    this.active = null;
    this.solve(scene, id);
  }
}
