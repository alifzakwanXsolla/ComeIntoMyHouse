// Data only. 20x11 tiles of 16px = exactly one 320x180 screen. Rows 0-1 are wall, rows 2+ floor.
export const ROOM = {
  cols: 20, rows: 11, wallRows: 2,
  bounds: { x1: 10, x2: 310, y1: 38, y2: 172 },   // where the player's feet may stand
  start: { x: 150, y: 120 },

  floorKey(c, r) {
    if (c >= 16) return 'floor_checker';
    if (c >= 2 && c <= 8 && r >= 6 && r <= 9) return 'floor_carpet';
    return (c * 3 + r) % 5 === 0 ? 'floor_wood2' : 'floor_wood';
  },

  // wall = hangs on the wall face (origin centre). floor = stands on the floor, y = foot line, collides with `solid` footprint.
  props: [
    { key: 'wardrobe', kind: 'floor', x: 22, y: 46, solid: [24, 8], text: 'T_WARDROBE' },
    { key: 'frame_dog', kind: 'wall', x: 54, y: 20, text: 'T_FRAME_DOG' },
    { key: 'lamp', kind: 'floor', x: 78, y: 46, solid: [8, 6], light: 46 },
    { key: 'shelves', kind: 'floor', x: 108, y: 48, solid: [34, 8], text: 'T_SHELVES' },
    { key: 'clock', kind: 'wall', x: 134, y: 19, text: 'T_CLOCK' },
    { key: 'window_boarded', kind: 'wall', x: 160, y: 21 },
    { key: 'camera', kind: 'wall', x: 183, y: 13, led: true },
    { key: 'door_keypad', kind: 'wall', x: 205, y: 20, text: 'T_DOOR', icon: 'icon_key' },
    { key: 'desk_pc', kind: 'floor', x: 238, y: 48, solid: [40, 8], text: 'T_PC', icon: 'icon_note', crt: true },
    { key: 'stove', kind: 'floor', x: 270, y: 46, solid: [22, 8], text: 'T_STOVE' },
    { key: 'fridge', kind: 'floor', x: 296, y: 46, solid: [20, 8], text: 'T_FRIDGE' },
    { key: 'table', kind: 'floor', x: 286, y: 108, solid: [32, 10], text: 'T_TABLE' },
    { key: 'sofa', kind: 'floor', x: 62, y: 124, solid: [34, 10], text: 'T_SOFA' },
    { key: 'plant', kind: 'floor', x: 20, y: 158, solid: [10, 6], text: 'T_PLANT' },
    { key: 'toolbox', kind: 'floor', x: 150, y: 160, solid: [18, 7], text: 'T_TOOLBOX', icon: 'icon_flashlight' },
    { key: 'bed', kind: 'floor', x: 214, y: 150, solid: [26, 14], text: 'T_BED' },
  ],

  // Placeholder strings only: the real story text lives in src/script/propText.js (teammate).
  text: {
    T_WARDROBE: 'placeholder: wardrobe.', T_FRAME_DOG: 'placeholder: framed photo.', T_SHELVES: 'placeholder: shelves.',
    T_CLOCK: 'placeholder: wall clock.', T_DOOR: 'placeholder: keypad door.', T_PC: 'placeholder: old computer.',
    T_STOVE: 'placeholder: stove.', T_FRIDGE: 'placeholder: fridge.', T_TABLE: 'placeholder: table for two.',
    T_SOFA: 'placeholder: sofa.', T_PLANT: 'placeholder: plant.', T_TOOLBOX: 'placeholder: toolbox.', T_BED: 'placeholder: bed.',
  },
};
