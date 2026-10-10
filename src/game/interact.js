// What happens when you press E on something. One case per object id (rooms.js).
import { bus } from '../bus.js';
import { S, has, set, take, saveCheckpoint } from './state.js';
import { LOOK, BEATS, PLOOK, PARTY, DINNER, PORCH, DRINK } from './story.js';
import * as panels from './panels.js';

export function interact(sc, id) {
  const lit = has('light');
  const dark = (fallback) => sc.say(fallback || ['Too dark to make anything out. I need light.']);

  switch (id) {
    // ------------------------------------------------ basement cell: light -> PC -> keypad
    case 'toolbox':
      if (has('flashlight')) return sc.look('toolbox_empty');
      return sc.look('toolbox', () => { set('flashlight'); sc.give('icon_flashlight', BEATS.flashlight); combine(sc); });

    case 'clock':
      if (has('batteries')) return sc.look('clock_empty');
      return sc.look('clock', () => { set('batteries'); sc.give('icon_batteries', BEATS.batteries); combine(sc); });

    case 'frame_dog':
      if (!lit) return dark(['A picture frame. Too dark to see the picture.']);
      return sc.look('frame_dog', () => sc.note('frame_dog'));

    case 'shelves':
      if (sc.roomId === 'corridor') return sc.say(['Boxes of cleaning supplies. Bleach. A lot of bleach.']);
      if (!lit) return dark(['Shelves. Things on them. I can\'t see what.']);
      return sc.look('shelves');

    case 'pc':
      if (!lit) return sc.look('pc_dark');
      sc.note('sticky');
      return sc.panel(panels.openPC, {
        unlocked: has('pcUnlocked'),
        fails: S.pcFails,
        onFail: () => ++S.pcFails,
        onUnlock: () => set('pcUnlocked'),
        onFile: (f) => { if (f === 'routine') sc.note('routine'); if (f === 'boys') sc.note('boys'); },
      });

    case 'door':
      if (has('doorOpen')) return sc.go('corridor', { x: 292, y: 148, dir: 'up' });
      if (!lit) return sc.look('door_dark');
      sc.note('worn');
      return sc.panel(panels.openKeypad, {
        onWrong: () => {},
        onSuccess: () => {
          set('doorOpen'); sc.setDoor('door', 'door_open'); sc.sfx('lock');
          sc.say(BEATS.door_unlocked);
        },
      });

    // ------------------------------------------------ ground floor
    case 'front_door':
      if (has('frontOpen')) return sc.go('outside', { x: 40, y: 100, dir: 'right' });
      if (!S.inv.includes('icon_key')) return sc.look('front_locked');
      sc.sfx('lock');
      return sc.say(BEATS.deadbolt, () => {
        set('frontOpen'); sc.setDoor('front_door', 'door_open');
        sc.sfx('footsteps', 3);
        sc.say(BEATS.nikki_call.map((t, i) => (i === 1 ? { who: 'NIKKI', text: t } : t)), () => sc.flashCenter('GO THROUGH THE DOOR', 1500));
      });

    case 'plan':
      return sc.panel(panels.openPlan, { onClose: () => {
        if (!has('planSeen')) { set('planSeen'); sc.note('plan'); sc.say(LOOK.plan_seen); }
      } });

    // ------------------------------------------------ upstairs
    case 'bathroom':
      return sc.look(has('hidDone') ? 'bathroom_empty' : 'bathroom');

    case 'photowall':
      return sc.panel(panels.openPhotoWall, { onClose: () => sc.note('photowall') });

    case 'box':
      if (has('boxOpen')) return sc.look('box_open');
      sc.note('box');
      return sc.panel(panels.openLockbox, {
        onSuccess: () => {
          set('boxOpen');
          sc.flagImgs?.boxOpen?.forEach((im) => im.destroy());
          sc.give('icon_key'); sc.give('icon_phone');
          bus.emit('phone:pickup');
          sc.say(BEATS.box_taken, () => {
            saveCheckpoint('bedroom', { x: sc.p.x, y: sc.p.y, dir: sc.p.dir });
            sc.nikkiComing();
          });
        },
      });

    case 'bed':
    case 'wardrobe':
      return sc.look(id);

    // ------------------------------------------------ first half: party, dinner, her house
    case 'faris':
      if (has('metFaris')) return sc.say(PARTY.farisAgain);
      return sc.say(PARTY.faris, () => sc.say(PARTY.walkBy, () => { set('metFaris'); sc.revealNpcs(); }));

    case 'party_door':
      return sc.say(PARTY.exitAsk, () => sc.choose(PARTY.exitChoice, (i) => { if (i === 1) sc.say(PARTY.exitLeave, () => sc.ending('B')); }));

    case 'nikki':
      if (sc.roomId === 'party') {
        if (has('metNikki')) return sc.say(PARTY.again, () => askParty(sc));
        return sc.say(PARTY.talk, () => { set('metNikki'); askParty(sc); });
      }
      if (sc.roomId === 'restaurant') return dinner(sc);
      if (sc.roomId === 'porch') return sc.say(PORCH.nikki);
      if (sc.roomId === 'home') {
        const n = S.flags.chat || 0;
        S.flags.chat = n + 1;
        return sc.say(DRINK.chat[n % DRINK.chat.length]);
      }
      return;

    case 'dinner_table':
      return dinner(sc);

    case 'restaurant_door':
      return sc.say(DINNER.exitStuck);

    case 'porch_door':
      return sc.say(PORCH.enter, () => { sc.sfx('lock'); sc.go('home', { x: 284, y: 58, dir: 'down' }); });

    case 'home_door':
      return sc.say(DRINK.frontLocked);

    case 'home_kitchen':
      return sc.say(DRINK.kitchenDoor);

    case 'h_sofa':
      return sc.drinkScene();

    default:
      if (LOOK[id]) return sc.look(id);
      if (PLOOK[id]) return sc.say(PLOOK[id]);
  }
}

// Flashlight + batteries -> light.
function combine(sc) {
  if (!has('flashlight') || !has('batteries') || has('light')) return;
  set('light');
  take('icon_batteries');
  sc.redrawInv();
  sc.sfx('click');
  sc.applyLight();
  sc.say(LOOK.batteries_in);
}

function askParty(sc) {
  sc.choose(PARTY.choice, (i) => {
    if (i === 0) return sc.say(PARTY.yes, () => sc.go('restaurant', { x: 160, y: 150, dir: 'up' }));
    sc.say(PARTY.no, () => sc.ending('B'));
  });
}

function dinner(sc) {
  const d = S.flags.d || 0;
  if (d < 3) {
    S.flags.d = d + 1;
    return sc.say(DINNER['part' + (d + 1)], () => { if (d === 2) askDinner(sc); });
  }
  sc.say(DINNER.again, () => askDinner(sc));
}

function askDinner(sc) {
  sc.choose(DINNER.choice, (i) => {
    if (i === 0) return sc.say(DINNER.yes, () => sc.go('porch', { x: 160, y: 150, dir: 'up' }));
    sc.say(DINNER.no, () => sc.ending('C'));
  });
}
