// ALL player-facing text lives here so the story teammate can edit it without touching code.
// Lines in arrays are shown one page at a time. Keep pages short (about 2 lines at 8px font).

export const ANSWERS = {
  PET: 'biscuit',      // PC password = PET + YEAR (case-insensitive, spaces ignored)
  PET_YEAR: '2014',    // the year she GOT him (dinner story). The frame also shows the year he died (decoy).
  PET_DIED: '2021',
  DOOR: '0712',        // basement keypad = her "lucky day", 12 July (MMDD)
  BOX: '0319',         // trophy box = date of her FIRST boy (Aaron, 2019) from the photo wall
};

// Intro cards (title -> intro -> wake up). {who} renders as a speaker tag.
export const INTRO = [
  { who: '', text: 'Faris dragged me to the party. I hate parties.' },
  { who: '', text: 'Then she walked past. I spent ten minutes working up the nerve.' },
  { who: 'NIKKI', text: 'You look like you want to leave. Did you come with friends? Will they be looking for you?' },
  { who: '', text: 'I asked her to dinner. She said yes. Just like that.' },
  { who: 'NIKKI', text: 'I had a dog once. Biscuit. I got him the summer of 2014. He is who I miss the most.' },
  { who: 'NIKKI', text: 'My lucky day is the twelfth of July. Good things always happen on it.' },
  { who: '', text: 'She never touched her wine. She asked if I live alone. I said yes.' },
  { who: 'NIKKI', text: 'Come home with me, Imran.' },
  { who: '', text: 'Her house was very quiet. Very clean. She locked the door behind us and pocketed the key.' },
  { who: '', text: 'She poured me a drink. I got so tired. She just watched me. She was not smiling anymore.' },
];

export const WAKE = [
  'Dark. Cold floor. My head is so heavy.',
  'Hello? ...HELLO?',
  'My voice just dies in here. No echo at all. Nobody can hear me.',
  'Breathe. Feel around. There is a faint glow over there.',
];

// Interactions. Each entry: lines shown when you press E. Some are replaced by code when state changes.
export const LOOK = {
  // --- basement cell ---
  mattress: ['An old mattress. This is where I woke up.', 'There are scratch marks on the wall beside it. Five sets.'],
  toolbox_empty: ['The toolbox. I already took the flashlight.'],
  toolbox: ['A toolbox. Inside: a flashlight.', 'I click it. Nothing. No batteries.'],
  clock: ['A wall clock, stopped. It reads 3:19.', 'The battery cover is loose... two batteries inside.'],
  clock_empty: ['The clock. Stopped at 3:19. Its batteries are in my flashlight now.'],
  batteries_in: ['Batteries in. Click. LIGHT.'],
  frame_dog: ['A framed photo of a fluffy dog.', 'Engraved on the frame: "BISCUIT  2014 - 2021".'],
  window: ['A window, boarded over from outside. The boards do not even creak.'],
  camera: ['A camera. The red light blinks. She is watching.'],
  shelves: ['Shelves of... things. A watch. A lanyard. A scarf. A single sneaker.', 'Little labels on each. Names.'],
  pc_dark: ['Something is glowing here. A screen? I need to see properly first.'],
  door_dark: ['A metal door. Locked. I can feel a little hatch in it.'],
  door_open: ['The door is open. Go.'],

  // --- basement corridor ---
  stairs_up: ['Stairs. Up to the house.'],
  bulb: ['A bare bulb, flickering.'],

  // --- ground floor ---
  front_locked: ['The front door. A heavy deadbolt. It needs a key.', 'She pocketed the key when we came in.'],
  back_door: ['The back door. Barred with a steel plank, bolted into the wall. Not happening.'],
  hall_rug: ['No photos anywhere down here. Like nobody really lives here.'],
  living_table: ['Two glasses. Mine is empty.', 'Hers is still full. She never drank a drop.'],
  curtain: ['Thick curtains. Taped to the wall at the edges.'],
  sofa: ['Where I sat. Where she watched me fall asleep.'],
  piano: ['A piano. The keys are spotless. I doubt she has ever played it.'],
  lamp: ['A warm lamp. The only cozy thing in this house.'],
  fridge: ['A list on the fridge in neat writing:', '"bleach x4, gloves, new candles. For Saturday."', 'Today is Saturday.'],
  stove: ['Spotless. Nothing has ever been cooked here.'],
  sink: ['A tiny glass vial in the sink, rinsed out.', 'That is what was in my drink.'],
  kitchen_table: ['Two chairs. One is pushed in perfectly.'],
  study_shelves: ['Books on psychology. Attachment. Obsession. All read many times.'],
  keyhooks: ['A board of key hooks. Each tag has a name.', 'AARON. DANIEL. HAFIZ. MARCUS.', 'The fifth hook is empty. The tag says IMRAN.'],
  plan_seen: ['The house plan. Key goes "with my favourite things". Her bedroom, upstairs.'],

  // --- upstairs ---
  stairs_down: ['Stairs down.'],
  bathroom: ['Water running. Humming. She is in there.', 'Do NOT open that door.'],
  bathroom_empty: ['The bathroom door. Quiet now. I am not checking.'],
  guest_bed: ['A guest bed. Made perfectly. Too perfectly.'],
  suitcases: ['Four suitcases lined up against the wall. Men\'s clothes inside.', 'One is still packed for a weekend away.'],
  guest_wardrobe: ['Empty hangers. Waiting.'],
  mirror: ['Me. I look terrible. Keep moving.'],
  bed: ['Her bed. There is space underneath.'],
  wardrobe: ['A tall wardrobe. Big enough to hide in.'],
  frame_date: ['A framed date, hand-lettered: "03/19 - where it all began."'],
  box_open: ['The box is open and empty now.'],
  candles: ['Candles. Unlit. "For Saturday".'],

  // --- outside ---
  street: ['Keep running.'],
};

// Shown when a puzzle step completes / story beats.
export const BEATS = {
  flashlight: 'Got: FLASHLIGHT (no batteries)',
  batteries: 'Got: BATTERIES',
  door_unlocked: ['*click*', 'The door unlocks. I am getting out of here.'],
  corridor_enter: ['A corridor. Stairs at the end.'],
  footsteps: ['Footsteps. Right above me.', 'STAY STILL.'],
  footsteps_pass: ['...They are moving away. Go. Quietly.'],
  ground_enter: ['The house. She is upstairs, I can hear her.', 'Front door is the way out. I need the key.'],
  upstairs_enter: ['Water running behind a door. She is in the bath.', 'Hold SHIFT to sneak. Some boards creak.'],
  box_taken: ['The FRONT DOOR KEY. And my PHONE.'],
  nikki_coming: ['The water stops.', 'A door opens. Footsteps. Coming this way.', 'HIDE. Bed or wardrobe. NOW.'],
  hidden: 'Hold your breath. Do not move.',
  nikki_enters: ['"Imran?... I know you are awake."'],
  nikki_box: ['She stops at the box. She is humming.'],
  nikki_leaves: ['"Hm. Must be the wind."', 'She walks out. The bathroom door shuts again.'],
  phone_back: ['My phone. 3% battery. No signal in here.', 'Get outside. Call for help.'],
  deadbolt: ['The key turns. The deadbolt slides back.'],
  nikki_call: ['From the top of the stairs, soft and sweet:', '"Imran? Where are you going?"', 'RUN.'],
  outside: ['I do not look back.'],
};

// Imran's notes (bottom-right popup). id -> { icon, text }.
export const NOTES = {
  dinner_pet: { icon: 'note', text: 'Dinner: her dog BISCUIT. She got him the summer of 2014. "Who I miss the most."' },
  dinner_lucky: { icon: 'note', text: 'Dinner: her lucky day is 12 JULY.' },
  frame_dog: { icon: 'eye', text: 'Frame: BISCUIT 2014 - 2021.' },
  sticky: { icon: 'note', text: 'Sticky note on PC: "Who I miss the most + the year".' },
  worn: { icon: 'eye', text: 'Keypad: keys 0, 1, 2 and 7 are worn shiny.' },
  routine: { icon: 'note', text: 'Her log: after a guest wakes, she takes a 20 min bath. Door code = "my lucky day".' },
  boys: { icon: 'note', text: 'PC "My Boys": Aaron 2019, Daniel 2021, Hafiz 2023, Marcus 2025. Aaron was the FIRST.' },
  plan: { icon: 'key', text: 'Study: spare keys "with my favourite things" - the box in her bedroom upstairs.' },
  photowall: { icon: 'eye', text: 'Photo wall dates: Aaron 03/19, Daniel 08/02, Hafiz 11/27, Marcus 05/30... Imran 10/10.' },
  box: { icon: 'key', text: 'Trophy box, 4 digits. Engraved: "For my first."' },
};

// Hints by objective (H key). Three tiers: nudge -> pointer -> near answer.
export const HINTS = {
  light: ['It is too dark to do anything. I need light.', 'The toolbox near the bottom of the room had a flashlight.', 'Flashlight from the toolbox, batteries from the wall clock.'],
  pc: ['That screen wants a password. The sticky note is a riddle.', 'Who did she say she misses the most at dinner? Check my notes (N).', 'Her dog\'s name plus the year she GOT him. Not the year he died.'],
  door: ['The door has a hatch with a keypad. The PC may know the code.', 'Her log says the code is her "lucky day". She told me at dinner.', '12 July as month and day: 0712. The worn keys agree.'],
  corridor: ['Get up those stairs.', 'If I hear footsteps above, I freeze until they pass.', 'Stand completely still when the dust falls.'],
  key: ['The front door needs a key. Where would she keep it?', 'The study might tell me something about this house.', 'Read the house plan on the study desk.'],
  upstairs: ['Her bedroom is upstairs. She is in the bath.', 'Hold SHIFT to sneak. Avoid the cracked boards.', 'Sneak past the bathroom to the far door: her bedroom.'],
  box: ['The box wants 4 digits. "For my first."', 'Her PC listed her boys by year. The photo wall has dates.', 'Aaron was the first (2019). His photo says 03/19: 0319.'],
  hide: ['HIDE.', 'Press E at the bed or the wardrobe.', 'Then do not touch any movement key.'],
  escape: ['I have the key. Get to the front door.', 'Downstairs, the front door in the hallway.', 'Sneak down, then use the front door.'],
};

// PC desktop content.
export const PC = {
  user: 'NIKKI',
  hint: 'Who I miss the most + the year',
  wrongDied: 'ACCESS DENIED. ...Not the year she lost him. The year she found him?',
  wrong: 'ACCESS DENIED.',
  locked: 'TOO MANY ATTEMPTS. WAIT',
  files: {
    boys: {
      title: 'My Boys',
      rows: [
        ['AARON', '2019', 'Met at a gallery opening. Lived alone. Kept: his watch.', 'my first'],
        ['DANIEL', '2021', 'Met at a wedding. Between jobs. Kept: his lanyard.', ''],
        ['HAFIZ', '2023', 'Met at a concert. Parents abroad. Kept: his scarf.', ''],
        ['MARCUS', '2025', 'Met at a book club. Nobody called. Kept: one sneaker.', ''],
      ],
    },
    routine: {
      title: 'routine.txt',
      lines: [
        'When a guest wakes up, I run a bath. 20 minutes. Always.',
        'I like to be clean when I visit them.',
        'Spare keys stay with my favourite things.',
        'Basement door: my lucky day, of course.',
      ],
    },
    next: {
      title: 'next.txt',
      lines: ['IMRAN. 24. Met at Faris\'s party.', 'Lives alone. Nobody waiting.', 'Perfect.'],
    },
  },
};

export const PHOTOS = [
  { name: 'AARON', date: '03/19' },
  { name: 'DANIEL', date: '08/02' },
  { name: 'HAFIZ', date: '11/27' },
  { name: 'MARCUS', date: '05/30' },
  { name: 'IMRAN', date: '10/10', you: true },
];

export const GAMEOVER = { title: 'she was never in a hurry', sub: 'She heard you.' };

export const ENDING = [
  'I ran until my legs gave out. A car stopped. I called the police.',
  'In the back of the squad car, I could not stop shaking.',
  'When they reached the house, every light was on. The front door was wide open.',
  'Nikki was gone.',
];
export const ENDING_TEXT = { from: 'Unknown number', text: 'It was nice meeting you.' };
