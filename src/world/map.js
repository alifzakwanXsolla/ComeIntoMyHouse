// House layout in tile coordinates. Rooms are floor rectangles; everything else is wall.
export const MAP_W = 40;
export const MAP_H = 24;

export const ROOMS = {
  hall:     { x: 14, y: 14, w: 12, h: 8,  name: 'Entry Hall',  color: 0x6b4a32, alt: 0x735038 },
  kitchen:  { x: 3,  y: 14, w: 10, h: 8,  name: 'Kitchen',     color: 0xbfb6a0, alt: 0x9e9684 },
  living:   { x: 27, y: 14, w: 10, h: 8,  name: 'Living Room', color: 0x5a3a3a, alt: 0x624242 },
  bedroom:  { x: 14, y: 2,  w: 12, h: 11, name: 'Bedroom',     color: 0x7a5568, alt: 0x82606f },
  basement: { x: 3,  y: 2,  w: 10, h: 11, name: 'Basement',    color: 0x3a3d42, alt: 0x33363b },
};

// A door is a single tile in a wall. unlockedBy = puzzle id that opens it (null = always open).
export const DOORS = {
  kitchen:  { x: 13, y: 17, from: 'hall',    to: 'kitchen',  unlockedBy: 'hall' },
  bedroom:  { x: 19, y: 13, from: 'hall',    to: 'bedroom',  unlockedBy: 'kitchen' },
  living:   { x: 26, y: 17, from: 'hall',    to: 'living',   unlockedBy: 'bedroom' },
  basement: { x: 7,  y: 13, from: 'kitchen', to: 'basement', unlockedBy: 'living' },
  front:    { x: 19, y: 22, from: 'hall',    to: null,       unlockedBy: 'final' },
};

export const START = { x: 19, y: 19 };

// Interactables. kind: 'puzzle' opens a puzzle; 'clue' shows text; 'door-pad' is the final code pad.
// `needs` (optional) = puzzle id that must be solved before this object works.
export const OBJECTS = [
  // Entry Hall
  { id: 'photos',   room: 'hall',    x: 19, y: 14, label: 'Framed photos', kind: 'puzzle', puzzle: 'hall', color: 0xd8b878 },
  { id: 'hallnote', room: 'hall',    x: 16, y: 19, label: 'Sticky note', kind: 'clue', color: 0xf0e070,
    text: 'In Nikki\'s handwriting: "Today I kept every ticket. Event hall, cafe, arcade, park, night market. I can\'t decide which one I loved most. Can you?"' },

  // Kitchen
  { id: 'recipe',   room: 'kitchen', x: 6,  y: 14, label: 'Recipe card', kind: 'puzzle', puzzle: 'kitchen', color: 0xf0e8d0 },
  { id: 'stove',    room: 'kitchen', x: 10, y: 14, label: 'Stove',   kind: 'clue', color: 0x555a60,
    text: 'The stove dial is stuck on 3. A note taped to it says: "low and slow. 3 for the sugar."' },
  { id: 'fridge',   room: 'kitchen', x: 4,  y: 14, label: 'Fridge',  kind: 'clue', color: 0xdde4ea,
    text: 'Magnets spell it out: "SUGAR x3, FLOUR x2, BUTTER x1. Add the pinches, not the cups." Inside, a jar is labelled "2 eggs".' },

  // Bedroom
  { id: 'photowall', room: 'bedroom', x: 15, y: 2, label: 'Wall of photos', kind: 'clue', color: 0xc4a0b4,
    text: 'Photos of you. At the cafe. Leaving work. Asleep on the train. You count 7. There might be more behind the others.' },
  { id: 'diary',    room: 'bedroom', x: 24, y: 6, label: 'Diary',   kind: 'puzzle', puzzle: 'bedroom', color: 0xa04050 },

  // Living room
  { id: 'piano',    room: 'living',  x: 32, y: 15, label: 'Piano',   kind: 'puzzle', puzzle: 'living', color: 0x1a1a22 },
  { id: 'lamp',     room: 'living',  x: 28, y: 15, label: 'Lamp',    kind: 'clue', color: 0xe0c060,
    text: 'The lamp shade is RED. Underneath, scratched in pen: "1st".' },
  { id: 'rug',      room: 'living',  x: 31, y: 19, label: 'Rug',     kind: 'clue', color: 0x4060a0,
    text: 'The rug is BLUE. A thread is tied around the corner: "2nd".' },
  { id: 'clock',    room: 'living',  x: 36, y: 17, label: 'Clock',   kind: 'clue', color: 0x60a060,
    text: 'The clock face is GREEN. The hands stopped at "3rd".' },
  { id: 'sofa',     room: 'living',  x: 29, y: 20, label: 'Sofa',    kind: 'clue', color: 0xd0b040,
    text: 'The sofa cushion is YELLOW. You find a note under it: "4th, the last note, hold it long".' },

  // Basement
  { id: 'fusebox',  room: 'basement', x: 4,  y: 2, label: 'Fuse box', kind: 'puzzle', puzzle: 'basement', color: 0x90a0a8 },
  { id: 'wall',     room: 'basement', x: 11, y: 5, label: 'Chalk wall', kind: 'clue', color: 0xd8d8d0, needs: 'basement',
    text: 'With the lights on you can read it: "THE ORDER IS 3 1 4 2". Beneath it, a fifth tally mark and your name.' },

  // Front door code pad
  { id: 'keypad',   room: 'hall',    x: 20, y: 21, label: 'Front door keypad', kind: 'door-pad', color: 0x40e060 },
];

export function inRoom(tx, ty) {
  for (const [id, r] of Object.entries(ROOMS)) {
    if (tx >= r.x && tx < r.x + r.w && ty >= r.y && ty < r.y + r.h) return id;
  }
  return null;
}

// 0 = wall, 1 = floor. Door tiles are floor but blocked by the door entity while locked.
export function buildGrid() {
  const g = Array.from({ length: MAP_H }, () => Array(MAP_W).fill(0));
  for (const r of Object.values(ROOMS)) {
    for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) g[y][x] = 1;
  }
  for (const d of Object.values(DOORS)) g[d.y][d.x] = 1;
  return g;
}
