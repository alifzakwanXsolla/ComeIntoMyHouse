// Room data. Every room is one 320x176 screen: rows 0-1 are the back wall, cols 0/19 and row 10 are border walls.
// Coordinates are native pixels.
//   floor prop: x = center, y = foot line, solid = [w, h] footprint at the feet.
//   wall prop:  x, y = center on the wall face (no collision).
//   kenney:     grid of frame ids from the Kenney indoor sheet, x/y = top-left; floor = collides, deco = flat.
//   exits:      door (on the back wall), stairs (on the back wall), bottom (gap in the bottom wall).
//   lock:       flag that must be true to use the exit. 'never' = always locked.

const K = (rows) => ({ kenney: rows });

export const ROOMS = {
  party: {
    name: 'The party',
    wall: 'paper', floor: 'wood',
    light: { dark: 0.0, personal: 120 },
    spawn: { x: 40, y: 140, dir: 'right' },
    glows: [{ x: 60, y: 70, r: 70, warm: true, flicker: true }, { x: 240, y: 80, r: 60 }],
    props: [
      { id: 'p_speaker', key: 'speaker', kind: 'floor', x: 34, y: 56, solid: [16, 8] },
      { id: 'p_speaker', key: 'speaker', kind: 'floor', x: 104, y: 56, solid: [16, 8] },
      { id: 'p_lamp', key: 'lamp', kind: 'floor', x: 140, y: 56, solid: [8, 6], glow: 40 },
      { id: 'p_sofa', key: 'sofa', kind: 'floor', x: 180, y: 58, solid: [34, 10] },
      { id: 'p_drinks', key: 'table', kind: 'floor', x: 250, y: 66, solid: [32, 10] },
      { id: 'p_plant', key: 'plant', kind: 'floor', x: 300, y: 154, solid: [10, 6] },
      { id: 'faris', kind: 'npc', sheet: 'imran', tint: 0xe8c860, x: 68, y: 74, dir: 'down' },
      { id: 'p_guest1', kind: 'npc', sheet: 'imran', tint: 0x9a6a5a, x: 130, y: 120, dir: 'right' },
      { id: 'p_guest2', kind: 'npc', sheet: 'imran', tint: 0x5a6a9a, x: 160, y: 120, dir: 'left' },
      { id: 'nikki', kind: 'npc', sheet: 'nikki', needFlag: 'metFaris', x: 232, y: 122, dir: 'left', from: { x: 300, y: 122 } },
    ],
    exits: [
      { id: 'party_door', type: 'door', x: 292, sprite: 'door_closed', lock: 'never' },
    ],
  },

  restaurant: {
    name: 'Restaurant',
    wall: 'paper', floor: 'carpet',
    light: { dark: 0.12, personal: 120 },
    spawn: { x: 160, y: 150, dir: 'up' },
    glows: [{ x: 160, y: 90, r: 50, warm: true, flicker: true }],
    props: [
      { id: 'r_curtain', key: 'curtain', kind: 'wall', x: 64, y: 18 },
      { id: 'r_curtain', key: 'curtain', kind: 'wall', x: 256, y: 18 },
      { id: 'r_lamp', key: 'lamp', kind: 'floor', x: 28, y: 58, solid: [8, 6], glow: 44 },
      { id: 'r_plant', key: 'plant', kind: 'floor', x: 296, y: 56, solid: [10, 6] },
      { id: 'r_diner', key: 'table', kind: 'floor', x: 64, y: 118, solid: [32, 10] },
      { id: 'r_diner', key: 'table', kind: 'floor', x: 262, y: 118, solid: [32, 10] },
      { id: 'r_waiter', kind: 'npc', sheet: 'imran', tint: 0xdddddd, x: 100, y: 68, dir: 'down' },
      { id: 'nikki', kind: 'npc', sheet: 'nikki', x: 160, y: 86, dir: 'down' },
      { id: 'dinner_table', key: 'table', kind: 'floor', x: 160, y: 106, solid: [32, 8] },
    ],
    exits: [
      { id: 'restaurant_door', type: 'door', x: 292, sprite: 'door_closed', lock: 'never' },
    ],
  },

  porch: {
    name: 'Her street',
    wall: 'block', floor: 'concrete',
    light: { dark: 0.5, personal: 90 },
    spawn: { x: 160, y: 150, dir: 'up' },
    glows: [{ x: 200, y: 50, r: 60 }],
    props: [
      { id: 'porch_camera', key: 'camera', kind: 'wall', x: 130, y: 12, led: true },
      { id: 'porch_curtain', key: 'curtain', kind: 'wall', x: 64, y: 18 },
      { id: 'porch_curtain', key: 'curtain', kind: 'wall', x: 256, y: 18 },
      { id: 'porch_lamp', key: 'lamp', kind: 'floor', x: 214, y: 56, solid: [8, 6], glow: 60 },
      { id: 'porch_plant', key: 'plant', kind: 'floor', x: 112, y: 58, solid: [10, 6] },
      { id: 'porch_plant', key: 'plant', kind: 'floor', x: 30, y: 154, solid: [10, 6] },
      { id: 'nikki', kind: 'npc', sheet: 'nikki', x: 130, y: 82, dir: 'right' },
    ],
    exits: [
      { id: 'porch_door', type: 'door', x: 160, sprite: 'door_closed', lock: 'never' },
    ],
  },

  home: {
    name: 'Her house',
    wall: 'paper', floor: 'wood',
    light: { dark: 0.05, personal: 120 },
    spawn: { x: 284, y: 58, dir: 'down' },
    props: [
      { id: 'h_curtain', key: 'curtain', kind: 'wall', x: 64, y: 18 },
      { id: 'h_curtain', key: 'curtain', kind: 'wall', x: 256, y: 18 },
      { id: 'h_camera', key: 'camera', kind: 'wall', x: 150, y: 12, led: true },
      { id: 'h_lamp', key: 'lamp', kind: 'floor', x: 28, y: 58, solid: [8, 6], glow: 44 },
      { id: 'h_shelves', key: 'shelves', kind: 'floor', x: 70, y: 52, solid: [34, 8] },
      { id: 'h_table', key: 'table', kind: 'floor', x: 160, y: 118, solid: [32, 10] },
      { id: 'h_sofa', key: 'sofa', kind: 'floor', x: 100, y: 128, solid: [34, 10] },
      { id: 'h_plant', key: 'plant', kind: 'floor', x: 296, y: 154, solid: [10, 6] },
      { id: 'nikki', kind: 'npc', sheet: 'nikki', x: 238, y: 100, dir: 'left' },
    ],
    exits: [
      { id: 'home_kitchen', type: 'door', x: 198, sprite: 'door_closed', lock: 'never' },
      { id: 'home_door', type: 'door', x: 284, sprite: 'door_locked', lock: 'never' },
    ],
  },

  cell: {
    name: 'Basement',
    wall: 'block', floor: 'concrete',
    light: { dark: 0.975, personal: 14 },
    spawn: { x: 70, y: 134, dir: 'down' },
    props: [
      { id: 'camera', key: 'camera', kind: 'wall', x: 30, y: 12, led: true },
      { id: 'clock', key: 'clock', kind: 'wall', x: 64, y: 18 },
      { id: 'frame_dog', key: 'frame_dog', kind: 'wall', x: 96, y: 19 },
      { id: 'window', key: 'window_boarded', kind: 'wall', x: 140, y: 19 },
      { id: 'shelves', key: 'shelves', kind: 'floor', x: 196, y: 52, solid: [34, 8] },
      { id: 'pc', key: 'desk_pc', kind: 'floor', x: 248, y: 52, solid: [40, 8], crt: true },
      { id: 'mattress', key: 'mattress', kind: 'floor', x: 44, y: 116, solid: [24, 26] },
      { id: 'toolbox', key: 'toolbox', kind: 'floor', x: 156, y: 150, solid: [18, 7] },
    ],
    exits: [
      { id: 'door', type: 'door', x: 292, sprite: 'door_keypad', to: 'corridor', spawn: { x: 292, y: 148, dir: 'up' }, lock: 'doorOpen' },
    ],
  },

  corridor: {
    name: 'Basement corridor',
    wall: 'block', floor: 'concrete',
    light: { dark: 0.86, personal: 26 },
    spawn: { x: 292, y: 148, dir: 'up' },
    glows: [{ x: 160, y: 70, r: 46, warm: true, flicker: true }],
    props: [
      { id: 'bulb', key: 'lamp', kind: 'floor', x: 160, y: 52, solid: [8, 6] },
      { id: 'shelves', key: 'shelves', kind: 'floor', x: 230, y: 52, solid: [34, 8], tint: 0x8a8a96 },
      { key: 'radio', kind: 'floor', x: 110, y: 120, solid: [14, 6] },
    ],
    exits: [
      { id: 'stairs_up', type: 'stairs', key: 'stairs_up', x: 44, to: 'hall', spawn: { x: 36, y: 60, dir: 'down' } },
      { id: 'to_cell', type: 'bottom', x1: 280, x2: 304, to: 'cell', spawn: { x: 292, y: 48, dir: 'down' } },
    ],
  },

  hall: {
    name: 'Hallway',
    wall: 'paper', floor: 'wood',
    light: { dark: 0.42, personal: 30 },
    spawn: { x: 36, y: 60, dir: 'down' },
    props: [
      { id: 'hall_rug', ...K([[23, 24, 25, 26], [50, 51, 52, 53], [77, 78, 79, 80], [104, 105, 106, 107]]), kind: 'deco', x: 128, y: 84, tint: 0x9a8070 },
      { key: 'plant', kind: 'floor', x: 296, y: 154, solid: [10, 6] },
      { key: 'lamp', kind: 'floor', x: 24, y: 154, solid: [8, 6], glow: 40 },
    ],
    exits: [
      { id: 'stairs_down', type: 'stairs', key: 'stairs_down', x: 36, to: 'corridor', spawn: { x: 44, y: 60, dir: 'down' } },
      { id: 'stairs_up', type: 'stairs', key: 'stairs_up', x: 78, to: 'upstairs', spawn: { x: 36, y: 60, dir: 'down' } },
      { id: 'back_door', type: 'door', x: 120, sprite: 'door_locked', lock: 'never' },
      { id: 'to_living', type: 'door', x: 158, sprite: 'door_closed', to: 'living', spawn: { x: 160, y: 150, dir: 'up' } },
      { id: 'to_kitchen', type: 'door', x: 198, sprite: 'door_closed', to: 'kitchen', spawn: { x: 160, y: 150, dir: 'up' } },
      { id: 'to_study', type: 'door', x: 238, sprite: 'door_closed', to: 'study', spawn: { x: 160, y: 150, dir: 'up' } },
      { id: 'front_door', type: 'door', x: 284, sprite: 'door_locked', to: 'outside', spawn: { x: 40, y: 100, dir: 'right' }, lock: 'frontOpen' },
    ],
  },

  living: {
    name: 'Living room',
    wall: 'paper', floor: 'wood',
    light: { dark: 0.32, personal: 30 },
    spawn: { x: 160, y: 150, dir: 'up' },
    props: [
      { ...K([[131, 132, 133, 134], [158, 159, 160, 161], [185, 186, 187, 188], [212, 213, 214, 215]]), kind: 'deco', x: 140, y: 76, tint: 0x8a9080 },
      { id: 'curtain', key: 'curtain', kind: 'wall', x: 64, y: 18 },
      { id: 'curtain', key: 'curtain', kind: 'wall', x: 256, y: 18 },
      { id: 'lamp', key: 'lamp', kind: 'floor', x: 28, y: 58, solid: [8, 6], glow: 44 },
      { id: 'piano', ...K([[239, 240], [266, 267]]), kind: 'floor', x: 196, y: 34, solid: [32, 10], tint: 0xb0a8a8 },
      { id: 'living_table', key: 'table', kind: 'floor', x: 172, y: 112, solid: [32, 10] },
      { id: 'sofa', key: 'sofa', kind: 'floor', x: 92, y: 132, solid: [34, 10] },
      { key: 'plant', kind: 'floor', x: 294, y: 152, solid: [10, 6] },
    ],
    exits: [{ id: 'to_hall', type: 'bottom', x1: 144, x2: 176, to: 'hall', spawn: { x: 158, y: 50, dir: 'down' } }],
  },

  kitchen: {
    name: 'Kitchen',
    wall: 'paper', floor: 'checker',
    light: { dark: 0.3, personal: 30 },
    spawn: { x: 160, y: 150, dir: 'up' },
    props: [
      { id: 'fridge', key: 'fridge', kind: 'floor', x: 36, y: 52, solid: [20, 8] },
      { id: 'stove', key: 'stove', kind: 'floor', x: 70, y: 52, solid: [22, 8] },
      { ...K([[324, 325]]), kind: 'floor', x: 96, y: 32, solid: [32, 12], tint: 0xb8b0a8 },
      { id: 'sink', ...K([[332]]), kind: 'floor', x: 128, y: 32, solid: [16, 12], tint: 0xb8b0a8 },
      { ...K([[329, 324]]), kind: 'floor', x: 144, y: 32, solid: [32, 12], tint: 0xb8b0a8 },
      { id: 'kitchen_table', key: 'table', kind: 'floor', x: 214, y: 118, solid: [32, 10] },
      { key: 'plant', kind: 'floor', x: 294, y: 54, solid: [10, 6] },
    ],
    exits: [{ id: 'to_hall', type: 'bottom', x1: 144, x2: 176, to: 'hall', spawn: { x: 198, y: 50, dir: 'down' } }],
  },

  study: {
    name: 'Study',
    wall: 'paper', floor: 'wood',
    light: { dark: 0.38, personal: 30 },
    spawn: { x: 160, y: 150, dir: 'up' },
    props: [
      { id: 'study_shelves', key: 'shelves', kind: 'floor', x: 40, y: 52, solid: [34, 8] },
      { id: 'study_shelves', ...K([[479, 480]]), kind: 'floor', x: 72, y: 34, solid: [32, 10], tint: 0xb0a8a0 },
      { id: 'keyhooks', ...K([[72]]), kind: 'deco', x: 250, y: 10 },
      { id: 'plan', key: 'table', kind: 'floor', x: 190, y: 108, solid: [32, 10] },
      { id: 'plan', ...K([[18]]), kind: 'deco', x: 182, y: 82, above: true },
      { id: 'lamp', key: 'lamp', kind: 'floor', x: 292, y: 58, solid: [8, 6], glow: 40 },
    ],
    exits: [{ id: 'to_hall', type: 'bottom', x1: 144, x2: 176, to: 'hall', spawn: { x: 238, y: 50, dir: 'down' } }],
  },

  upstairs: {
    name: 'Upstairs',
    wall: 'paper', floor: 'wood',
    light: { dark: 0.55, personal: 28 },
    spawn: { x: 36, y: 60, dir: 'down' },
    stealth: true,
    creaks: [{ x: 128, y: 64 }, { x: 176, y: 96 }, { x: 224, y: 60 }, { x: 240, y: 120 }, { x: 96, y: 112 }],
    props: [
      { ...K([[23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 25], [104, 105, 105, 105, 105, 105, 105, 105, 105, 105, 105, 105, 105, 106]]), kind: 'deco', x: 64, y: 76, tint: 0x7a6060 },
      { key: 'plant', kind: 'floor', x: 296, y: 154, solid: [10, 6] },
    ],
    exits: [
      { id: 'stairs_down', type: 'stairs', key: 'stairs_down', x: 36, to: 'hall', spawn: { x: 78, y: 60, dir: 'down' } },
      { id: 'bathroom', type: 'door', x: 120, sprite: 'door_closed', lock: 'never', strip: true },
      { id: 'to_guest', type: 'door', x: 190, sprite: 'door_closed', to: 'guest', spawn: { x: 160, y: 150, dir: 'up' } },
      { id: 'to_bedroom', type: 'door', x: 268, sprite: 'door_closed', to: 'bedroom', spawn: { x: 160, y: 150, dir: 'up' } },
    ],
  },

  guest: {
    name: 'Guest room',
    wall: 'paper', floor: 'wood',
    light: { dark: 0.6, personal: 28 },
    spawn: { x: 160, y: 150, dir: 'up' },
    stealth: true,
    props: [
      { id: 'window', key: 'window_boarded', kind: 'wall', x: 160, y: 19 },
      { id: 'guest_bed', key: 'bed', kind: 'floor', x: 56, y: 100, solid: [26, 14] },
      { id: 'guest_wardrobe', key: 'wardrobe', kind: 'floor', x: 270, y: 52, solid: [24, 8] },
      { id: 'suitcases', key: 'toolbox', kind: 'floor', x: 132, y: 54, solid: [18, 7], tint: 0x9a7a60 },
      { id: 'suitcases', key: 'toolbox', kind: 'floor', x: 154, y: 54, solid: [18, 7], tint: 0x6a6a80 },
      { id: 'suitcases', key: 'toolbox', kind: 'floor', x: 176, y: 54, solid: [18, 7], tint: 0x7a5050 },
      { id: 'suitcases', key: 'toolbox', kind: 'floor', x: 198, y: 54, solid: [18, 7], tint: 0x5a6a5a },
    ],
    exits: [{ id: 'to_up', type: 'bottom', x1: 144, x2: 176, to: 'upstairs', spawn: { x: 190, y: 50, dir: 'down' } }],
  },

  bedroom: {
    name: 'Her bedroom',
    wall: 'paper', floor: 'carpet',
    light: { dark: 0.5, personal: 30 },
    spawn: { x: 160, y: 150, dir: 'up' },
    stealth: true,
    props: [
      { id: 'photowall', key: 'photo_wall', kind: 'wall', x: 112, y: 18 },
      { id: 'frame_date', key: 'frame_date', kind: 'wall', x: 156, y: 19 },
      { id: 'mirror', ...K([[400], [427]]), kind: 'deco', x: 196, y: 0, wallHit: true },
      { id: 'bed', key: 'bed', kind: 'floor', x: 52, y: 92, solid: [26, 14], hide: true },
      { id: 'wardrobe', key: 'wardrobe', kind: 'floor', x: 276, y: 52, solid: [24, 8], hide: true },
      { id: 'box', ...K([[86]]), kind: 'floor', x: 232, y: 100, solid: [16, 8], tint: 0xc0b0a8 },
      { id: 'box', ...K([[140]]), kind: 'deco', x: 232, y: 88, above: true, hideFlag: 'boxOpen' },
      { id: 'candles', ...K([[178, 179]]), kind: 'deco', x: 24, y: 40, above: true },
      { id: 'lamp', key: 'lamp', kind: 'floor', x: 300, y: 150, solid: [8, 6], glow: 34 },
    ],
    exits: [{ id: 'to_up', type: 'bottom', x1: 144, x2: 176, to: 'upstairs', spawn: { x: 268, y: 50, dir: 'down' } }],
  },

  outside: {
    name: 'Outside',
    wall: 'block', floor: 'concrete',
    light: { dark: 0.9, personal: 36 },
    spawn: { x: 40, y: 100, dir: 'right' },
    outside: true,
    props: [],
    exits: [],
  },
};
