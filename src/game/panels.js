// HTML puzzle panels drawn over the canvas (#overlay). Each opener returns nothing; the game is paused
// while a panel is open and resumes through onClose. Esc closes any panel.
import { ANSWERS, PC, PHOTOS, NOTES } from './story.js';

const root = () => document.getElementById('overlay');
let current = null;

function h(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  e.append(...kids.flat().filter((k) => k !== null && k !== undefined));
  return e;
}

export function isOpen() { return !!current; }

function open(cls, title, build, onClose) {
  close();
  const body = h('div', { class: 'pbody' });
  const x = h('button', { class: 'pclose', title: 'Close (Esc)', onclick: () => close() }, 'X');
  const panel = h('div', { class: `panel ${cls}` }, h('div', { class: 'ptitle' }, h('span', {}, title), x), body);
  const shade = h('div', { class: 'shade' }, panel);
  root().append(shade);
  const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); close(); } };
  document.addEventListener('keydown', onKey);
  current = { shade, onClose, onKey };
  build(body, panel);
}

export function close() {
  if (!current) return;
  const c = current;
  current = null;
  document.removeEventListener('keydown', c.onKey);
  c.shade.remove();
  c.onClose?.();
}

function shake(el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }

// ---------------------------------------------------------------- PC (login -> desktop)
export function openPC({ unlocked, fails, onFail, onUnlock, onFile, sfx, onClose }) {
  open('pc', 'OLD COMPUTER', (body) => {
    const screen = h('div', { class: 'crt' });
    body.append(h('div', { class: 'bezel' }, screen, h('div', { class: 'sticky-note' }, PC.hint)));
    let lockedUntil = 0;

    const desktop = () => {
      screen.innerHTML = '';
      const win = h('div', { class: 'win hidden' });
      const showFile = (id) => {
        const f = PC.files[id];
        win.innerHTML = '';
        win.classList.remove('hidden');
        const content = f.rows
          ? h('table', { class: 'boys' }, f.rows.map(([n, y, d, tag]) =>
            h('tr', {}, h('td', { class: 'face' }, ''), h('td', {}, h('b', {}, n), ' ', h('span', { class: 'yr' }, y), tag ? h('span', { class: 'tag' }, ` (${tag})`) : null, h('br'), d))))
          : h('div', { class: 'txt' }, f.lines.map((l) => h('p', {}, l)));
        win.append(h('div', { class: 'wtitle' }, h('span', {}, f.title), h('button', { onclick: () => win.classList.add('hidden') }, 'X')), content);
        sfx('click');
        onFile(id);
      };
      const icon = (id, label, cls) => h('button', { class: `dicon ${cls}`, onclick: () => showFile(id) }, h('i'), h('span', {}, label));
      screen.append(
        h('div', { class: 'dbar' }, h('span', {}, `${PC.user}-PC`), h('span', {}, '03:19')),
        h('div', { class: 'icons' }, icon('boys', 'My Boys', 'folder'), icon('routine', 'routine.txt', 'file'), icon('next', 'next.txt', 'file')),
        win,
      );
    };

    const login = () => {
      screen.innerHTML = '';
      const input = h('input', { type: 'text', maxlength: '20', spellcheck: 'false', autocomplete: 'off', placeholder: 'password' });
      const msg = h('div', { class: 'msg' }, '');
      const form = h('form', { class: 'login' },
        h('div', { class: 'avatar' }), h('div', { class: 'user' }, PC.user), input,
        h('button', { type: 'submit' }, 'ENTER'), msg,
        h('div', { class: 'hint' }, `Password hint: ${PC.hint}`));
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const now = Date.now();
        if (now < lockedUntil) return;
        const v = input.value.toLowerCase().replace(/\s+/g, '');
        if (v === ANSWERS.PET + ANSWERS.PET_YEAR) {
          sfx('good'); onUnlock(); desktop(); return;
        }
        sfx('bad'); shake(form);
        fails = onFail();
        msg.textContent = v.includes(ANSWERS.PET) && v.includes(ANSWERS.PET_DIED) ? PC.wrongDied : PC.wrong;
        input.value = '';
        if (fails % 3 === 0) {
          lockedUntil = now + 15000;
          input.disabled = true;
          const tick = () => {
            const s = Math.ceil((lockedUntil - Date.now()) / 1000);
            if (!input.isConnected) return;
            if (s <= 0) { input.disabled = false; msg.textContent = ''; input.focus(); return; }
            msg.textContent = `${PC.locked} ${s}s`;
            setTimeout(tick, 250);
          };
          tick();
        }
      });
      screen.append(form);
      setTimeout(() => input.focus(), 30);
    };

    if (unlocked) desktop(); else login();
  }, onClose);
}

// ---------------------------------------------------------------- Keypad (worn keys)
export function openKeypad({ onSuccess, onWrong, sfx, onClose }) {
  open('keypad', 'DOOR HATCH', (body) => {
    let code = '';
    const worn = new Set(ANSWERS.DOOR.split(''));
    const disp = h('div', { class: 'kdisp' });
    const render = () => { disp.textContent = code.padEnd(4, '_').split('').join(' '); };
    const press = (k) => {
      sfx('click');
      if (k === 'C') code = '';
      else if (k === 'OK') return submit();
      else if (code.length < 4) code += k;
      render();
    };
    const submit = () => {
      if (code === ANSWERS.DOOR) { disp.classList.add('ok'); sfx('good'); setTimeout(() => { close(); onSuccess(); }, 500); return; }
      sfx('bad'); shake(pad); disp.classList.add('err'); onWrong();
      setTimeout(() => { disp.classList.remove('err'); code = ''; render(); }, 600);
    };
    const pad = h('div', { class: 'kpad' },
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'].map((k) =>
        h('button', { class: worn.has(k) ? 'worn' : '', onclick: () => press(k) }, k)));
    body.append(
      h('p', { class: 'flavor' }, 'I reach through the hatch and feel a keypad on the outside. Some keys are worn smooth and shiny.'),
      h('div', { class: 'kbox' }, disp, pad),
      h('p', { class: 'small' }, 'Type digits or click. Enter = OK.'));
    const onKey = (e) => {
      if (!current || !current.shade.contains(pad)) return document.removeEventListener('keydown', onKey);
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === 'Enter') press('OK');
      else if (e.key === 'Backspace') { code = code.slice(0, -1); render(); }
    };
    document.addEventListener('keydown', onKey);
    render();
  }, onClose);
}

// ---------------------------------------------------------------- Trophy box (4 wheels)
export function openLockbox({ onSuccess, sfx, onClose }) {
  open('lockbox', 'TROPHY BOX', (body) => {
    const vals = [0, 0, 0, 0];
    const wheels = vals.map((_, i) => {
      const num = h('div', { class: 'wnum' }, '0');
      const set = (d) => { vals[i] = (vals[i] + d + 10) % 10; num.textContent = vals[i]; sfx('click'); };
      return h('div', { class: 'wheel' },
        h('button', { class: 'up', onclick: () => set(1), 'aria-label': 'up' }),
        num,
        h('button', { class: 'down', onclick: () => set(-1), 'aria-label': 'down' }));
    });
    const lid = h('div', { class: 'lid' }, h('div', { class: 'engr' }, 'For my first.'), h('div', { class: 'wheels' }, wheels));
    const msg = h('p', { class: 'small' }, '');
    body.append(
      h('p', { class: 'flavor' }, 'A velvet box with a brass 4-digit lock.'),
      lid,
      h('button', { class: 'big', onclick: () => {
        if (vals.join('') === ANSWERS.BOX) { sfx('good'); lid.classList.add('ok'); setTimeout(() => { close(); onSuccess(); }, 500); }
        else { sfx('bad'); shake(lid); msg.textContent = 'It will not budge.'; }
      } }, 'OPEN'),
      msg);
  }, onClose);
}

// ---------------------------------------------------------------- Reading panels
export function openPhotoWall({ onClose }) {
  open('photos', 'PHOTO WALL', (body) => {
    body.append(
      h('p', { class: 'flavor' }, 'Polaroids pinned in a neat row. A name and a date under each, in her handwriting.'),
      h('div', { class: 'polaroids' }, PHOTOS.map((p, i) =>
        h('div', { class: `pol r${i % 3}${p.you ? ' you' : ''}` }, h('div', { class: 'ph' }, h('i')), h('b', {}, p.name), h('span', {}, p.date)))),
      h('p', { class: 'small' }, 'The last one is me. Taken tonight.'));
  }, onClose);
}

export function openPlan({ onClose }) {
  open('plan', 'HOUSE PLAN', (body) => {
    const floor = (name, rooms, mark) => h('div', { class: 'floor' }, h('div', { class: 'fname' }, name),
      h('div', { class: 'frooms' }, rooms.map((r) => h('div', { class: r === mark ? 'mark' : '' }, r))));
    body.append(
      h('div', { class: 'blue' },
        floor('UPSTAIRS', ['BATH', 'GUEST', 'MY ROOM'], 'MY ROOM'),
        floor('GROUND', ['LIVING', 'KITCHEN', 'STUDY', 'FRONT DOOR'], null),
        floor('BASEMENT', ['GUEST SUITE', 'CORRIDOR'], null),
        h('div', { class: 'scrawl' }, 'spare keys - with my favourite things')),
      h('p', { class: 'small' }, NOTES.plan.text));
  }, onClose);
}

// ---------------------------------------------------------------- Full-screen cards
export function showGameOver({ title, sub, onRetry }) {
  close();
  const card = h('div', { class: 'card over' }, h('h1', {}, title), h('p', {}, sub),
    h('button', { class: 'big', onclick: () => { cleanup(); onRetry(); } }, 'TRY AGAIN'), h('p', { class: 'small' }, 'or press R'));
  const onKey = (e) => { if (e.key.toLowerCase() === 'r') { cleanup(); onRetry(); } };
  const cleanup = () => { document.removeEventListener('keydown', onKey); card.remove(); };
  setTimeout(() => document.addEventListener('keydown', onKey), 600);
  root().append(card);
}
