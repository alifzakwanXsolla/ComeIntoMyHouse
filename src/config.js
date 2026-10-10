// All tunables and asset paths live here.
export const CONFIG = {
  // true = flashlight already has batteries (merges puzzle steps 1+2)
  SIMPLE_MODE: false,

  // Puzzle answers (swap freely; story team may change them)
  PET_NAME: 'biscuit',
  YEAR: '2014',              // password = PET_NAME + YEAR, case-insensitive
  DOOR_KEYPAD_CODE: '0712',  // basement door ("lucky date")
  BOX_CODE: '0319',          // bedroom trophy box (date of first victim)

  // Pixel-art render target. The canvas is this many native pixels, scaled up with Phaser.Scale.FIT.
  render: { width: 320, height: 180, tile: 16, font: '"Press Start 2P", "Silkscreen", monospace' },

  tile: 32,                  // legacy (pre-overhaul); the pixel renderer uses render.tile
  playerSpeed: 110,          // walk
  sneakSpeed: 55,            // Shift toggles sneak
  view: { width: 960, height: 600 },

  // Noise meter (0..max). Only matters while Nikki is "near".
  noise: {
    max: 100,
    warnAt: 70,
    walk: 16,         // per second while walking
    sneak: 0,         // per second while sneaking
    idle: -30,        // per second while standing still
    creakWalk: 40,    // instant spike on a creaky floor
    creakSneak: 22,
    strip: 25,        // per second while standing in a lit door strip
    fidget: 45,       // per second pressing move keys while hidden
    wrongCode: 18,    // spike for a wrong keypad entry
    emitEveryMs: 250,
  },

  // Scripted Nikki timings (ms)
  nikki: {
    freezeLeadMs: 2500,   // footsteps start this long before she is "near"
    freezeMs: 9000,       // Part B: she walks overhead
    bathroomMs: 28000,    // Part D: alternating routine
    phoneMs: 24000,
    hideWindowMs: 9000,   // time to reach a hiding spot after taking the box items
    hideSequenceMs: 14000,
    callIntervalMs: [20000, 35000], // ambient voice/footsteps from upstairs (Part C)
  },

  // Flashlight cone + personal feel-your-way radius (px)
  light: {
    coneLength: 280,
    coneHalfAngleDeg: 32,
    personalRadius: 26,
    monitorGlowRadius: 70,
    motes: 28,
  },

  // Optional files. Missing = procedural WebAudio fallback / procedural textures.
  assets: {
    audio: {
      ambient: 'assets/audio/ambient.mp3',
      heartbeat: 'assets/audio/heartbeat.mp3',
      lock: 'assets/audio/lock.mp3',
      stinger: 'assets/audio/stinger.mp3',
      nikkiVoice: 'assets/audio/nikki_voice.mp3',   // calls his name (Part E)
      nikkiPhone: 'assets/audio/nikki_phone.mp3',   // muffled phone call
      water: 'assets/audio/water.mp3',              // bathroom tap
      stepsOverhead: 'assets/audio/steps_overhead.mp3',
    },
    images: {
      // key: path. Any key here replaces the procedural texture of the same name; missing files fall back.
      // Tile/prop keys (floor_wood, sofa, door_closed, ...) are plain images.
      // Character keys (imran, nikki, nikki_sil) are sheets of 16x24 frames, 5 cols x 4 rows:
      //   rows = down,left,right,up   cols = walk0,walk1,walk2,sneak,hide
      // imran: 'assets/img/imran.png',
      // floor_wood: 'assets/img/floor_wood.png',
    },
  },

  // Floor mood: darkness 0..1 (overlay alpha), radius = how far you see without a flashlight (px)
  moods: {
    basementDark:     { flicker: 0, darkness: 0.985, radius: 0,   ambient: 0.035, heartbeat: 58 },
    basementCorridor: { flicker: 0, darkness: 0.86,  radius: 120, ambient: 0.04,  heartbeat: 62 },
    ground:           { flicker: 0, darkness: 0.30,  radius: 400, ambient: 0.05,  heartbeat: 60 },
    upstairs:         { flicker: 0, darkness: 0.46,  radius: 300, ambient: 0.035, heartbeat: 62 },
    outside:          { flicker: 0, darkness: 0.93,  radius: 90,  ambient: 0.02,  heartbeat: 100 },

    // legacy moods, used only by the old game path (Mood.js / Lighting.js) until the realign replaces it
    sweet:   { radius: 230, flicker: 0.00, heartbeat: 60,  ambient: 0.10, darkness: 0.55 },
    playful: { radius: 200, flicker: 0.05, heartbeat: 75,  ambient: 0.14, darkness: 0.65 },
    jealous: { radius: 165, flicker: 0.20, heartbeat: 95,  ambient: 0.18, darkness: 0.78 },
    furious: { radius: 125, flicker: 0.60, heartbeat: 125, ambient: 0.24, darkness: 0.88 },
  },

  // ---- legacy (old timer/strikes game path). Removed together with Timer/Mood/Scares/map.js in the realign. ----
  totalSeconds: 15 * 60,
  maxStrikes: 5,
  strikesPerAnger: 3,
  hintPenaltySeconds: 45,
  warningsAt: [600, 300, 120, 30],
  moodOrder: ['sweet', 'playful', 'jealous', 'furious'],
  scares: {
    flickerMs: 900,
    slamDelayMs: 500,
    fakeOutAfter: [150, 240],
    blackoutMs: 3000,
    footstepsFirstMs: 5000,
    footstepsEvery: [20, 35],
  },
  finalCodeLength: 4,
  finalOrder: ['bedroom', 'hall', 'living', 'kitchen'],

  deathCard: 'she was never in a hurry',
};

export function debugEnabled() {
  return new URLSearchParams(location.search).get('debug') === '1';
}
