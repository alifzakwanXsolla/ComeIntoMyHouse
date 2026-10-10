import { NOTES } from '../script/notes.js';

// Imran's notes. Lives for the whole page; reset on game:start. The popup UI subscribes via onChange.
export class Notes {
  constructor(bus) {
    this.items = [];
    this.onChange = null;
    bus.on('clue:seen', ({ id }) => this.add(id));
    bus.on('hint:shown', ({ id, key }) => this.upsert(`hint:${id}`, 'eye', key));
    bus.on('game:start', () => { this.items = []; this.onChange?.(null); });
  }

  add(id) {
    const d = NOTES[id];
    return d ? this.upsert(id, d.icon, d.text) : false;
  }

  // Adds or replaces a note; a replaced note moves to the newest slot.
  upsert(id, icon, key) {
    const old = this.items.find((n) => n.id === id);
    if (old && old.key === key) return false;
    this.items = this.items.filter((n) => n.id !== id);
    this.items.push({ id, icon, key });
    this.onChange?.(id);
    return true;
  }
}
