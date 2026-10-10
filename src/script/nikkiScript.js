// Nikki's voice as plain data. The phone stub (or the real phone UI) reads this.
// Arrays = pick one at random. Edit freely; no code in here.
export const SCRIPT = {
  'game:start': [
    'good morning 💕 you came!! i was so scared you wouldn\'t',
    'come in, come in. take your shoes off, stay a while',
  ],

  'door:behind': [
    'hear that? that\'s the front door. it\'s just the old lock, it does that 😊',
  ],

  'room:entered': {
    hall: ['this is where we start. look at the walls. look at us.'],
    kitchen: ['i made breakfast. i make everything from scratch. for you.'],
    bedroom: ['you\'re in my room!! don\'t look at the walls. ...okay, look.'],
    living: ['sit down, kai. no. you\'re not sitting. why aren\'t you sitting?'],
    basement: ['careful on the stairs. it\'s dark. it\'s always dark down there.'],
  },

  'door:locked': {
    sweet: ['that one\'s not ready yet 💕 be patient with me'],
    playful: ['ooh, naughty. try the thing i asked first 😘'],
    jealous: ['why are you trying that door?'],
    furious: ['I SAID STAY.'],
  },

  'puzzle:solved': {
    hall: ['you remembered everything. every detail. i knew you would 💕', 'one piece of the key is yours. the kitchen is open now.'],
    kitchen: ['you ate? you didn\'t eat. that\'s okay. you\'re so clever.', 'the bedroom door is open. don\'t be shy.'],
    bedroom: ['you read my diary. everyone says that\'s rude. i don\'t mind. you\'re different.', 'the living room is open. sit with me.'],
    living: ['our song. you remembered our song!! i could cry', 'there\'s one more room. the basement door in the kitchen. it\'s open.'],
    basement: ['the lights came back. see? i can be kind.', 'now you have everything. the front door is waiting. one more thing to say right.'],
  },

  'puzzle:wrong': {
    sweet: ['oops 💕 try again, silly'],
    playful: ['not quite~ i know you can do better 😘', 'hmm. are you even trying?'],
    jealous: ['did you not listen to me? is someone else more interesting?', 'wrong. again. i\'m counting.'],
    furious: ['WRONG.', 'you\'re doing this on purpose. you want to leave me.', 'i\'ll ask nicely one more time.'],
  },

  'mood:changed': {
    sweet: [],
    playful: ['you\'re fun, you know that? i could do this all day'],
    jealous: ['you keep checking the time. do you have somewhere to be?', 'you looked at the door again.'],
    furious: ['i gave you EVERYTHING', 'stop. stop. stop looking for a way out.'],
  },

  'hint:requested': [
    'asking for help? okay. but it costs you. it always costs you 💕',
  ],

  'time:warning': {
    600: ['ten minutes, kai. isn\'t it nice, having all this time with me?'],
    300: ['five minutes. i don\'t like how you\'re rushing.'],
    120: ['two minutes. i\'m not angry. i\'m just... sad.'],
    30: ['thirty seconds. please don\'t make me do it.'],
  },

  'game:over': {
    time: ['time\'s up.', 'i warned you.', 'stay with me.'],
    strikes: ['that\'s five.', 'i gave you so many chances.', 'stay with me.'],
  },

  'game:win': [
    'the door is open. i\'m watching you walk away.',
    'run. i\'ll still know where you live 💕',
  ],

  // Riddles shown when a puzzle starts, and by hints. One per mood.
  riddles: {
    hall: {
      sweet: 'put our day in order, from the first hello to the last goodnight. the frames on the wall remember. i gave you the clue: we started with a crowd, then coffee, then we played, then walked, then it got dark and loud 💕',
      playful: 'i\'ll say it again~ crowd, coffee, games, green, lights.',
      jealous: 'it\'s not hard, kai. a crowd. coffee. the arcade. the park. the market at night.',
      furious: 'EVENT HALL. CAFE. ARCADE. PARK. NIGHT MARKET. IN THAT ORDER.',
    },
    kitchen: {
      sweet: 'my recipe card has a secret. the numbers matter, not the food. read the amounts, top to bottom. and check the stove and the fridge for what i left out 💕',
      playful: 'the card gives you the amounts. the fridge magnets tell you how much of each. do the math, smartypants.',
      jealous: 'sugar, flour, butter. the three numbers. the fridge says which ones to add.',
      furious: 'ADD THE NUMBERS. THE ANSWER IS ONE DIGIT. HOW HARD IS THAT?',
    },
    bedroom: {
      sweet: 'my diary is on the nightstand. i wrote it for you, but i hid it. shift every letter back by the number of photos on my wall of you. the word opens the box 💕',
      playful: 'count the photos of you. that\'s the shift. go back that many letters.',
      jealous: 'you don\'t even know how many photos i have of you, do you. count them.',
      furious: 'COUNT THE PHOTOS. SHIFT BACK. TYPE THE WORD.',
    },
    living: {
      sweet: 'play me our song on the piano. i left the notes where we sat: the lamp, the rug, the clock, the sofa. in that order 💕',
      playful: 'the room remembers the melody. four colors. four things to look at.',
      jealous: 'you weren\'t listening when we danced, were you.',
      furious: 'PLAY IT. PLAY IT RIGHT. PLAY IT NOW.',
    },
    basement: {
      sweet: 'the fuses are numbered. flip them so each wire has power: the ones on the left, then the ones on the right. i hid the pattern on the wall 💕',
      playful: 'lights out, darling. turn them back on. pattern on the wall, two up, one down.',
      jealous: 'power. the fuses. the pattern on the wall. don\'t make me come down there.',
      furious: 'FIX THE LIGHTS OR I\'LL FIX YOU.',
    },
    door: {
      sweet: 'the door code is the four pieces of the key. the order is on the basement wall 💕',
      playful: 'four pieces. the right order. you\'re so close~',
      jealous: 'four digits. the basement told you the order. why are you hesitating?',
      furious: 'PUT IN THE CODE. LEAVE. SEE IF I CARE.',
    },
  },
};

export function pick(list) {
  if (!list || !list.length) return null;
  return list[Math.floor(Math.random() * list.length)];
}
