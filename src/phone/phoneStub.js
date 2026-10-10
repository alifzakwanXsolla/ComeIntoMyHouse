// Minimal stand-in for the real phone UI. Replace by removing initPhoneStub() in main.js
// and wiring the real UI to the same bus events (see docs/PHONE_API.md).
import { SCRIPT, pick } from '../script/nikkiScript.js';

export function initPhoneStub(bus, el) {
  let mood = 'sweet';
  const queue = [];
  let busy = false;

  function say(text, opts = {}) {
    if (!text) return;
    queue.push({ text, ...opts });
    pump();
  }

  function pump() {
    if (busy || !queue.length) return;
    busy = true;
    const m = queue.shift();
    const typing = document.createElement('div');
    typing.className = 'msg typing';
    typing.textContent = 'Nikki is typing…';
    el.appendChild(typing);
    const delay = Math.min(1800, 350 + m.text.length * 22);
    setTimeout(() => {
      typing.remove();
      bus.emit('phone:message', { from: 'nikki', text: m.text, sound: m.sound });
      busy = false;
      pump();
    }, delay);
  }

  // The stub is also its own consumer of phone:message so the overlay stays dumb.
  bus.on('phone:message', ({ from, text }) => {
    if (from === 'kai') return;
    const d = document.createElement('div');
    d.className = 'msg';
    d.textContent = text;
    el.appendChild(d);
    while (el.children.length > 40) el.firstChild.remove();
    el.scrollTop = el.scrollHeight;
  });

  bus.on('mood:changed', ({ mood: m }) => {
    mood = m;
    say(pick(SCRIPT['mood:changed'][m]));
  });
  bus.on('game:start', () => say(pick(SCRIPT['game:start'])));
  bus.on('room:entered', ({ roomId }) => say(pick(SCRIPT['room:entered'][roomId])));
  bus.on('door:locked', () => say(pick(SCRIPT['door:locked'][mood])));
  bus.on('puzzle:started', ({ id }) => say(SCRIPT.riddles[id]?.[mood]));
  bus.on('puzzle:wrong', () => say(pick(SCRIPT['puzzle:wrong'][mood])));
  bus.on('puzzle:solved', ({ id }) => (SCRIPT['puzzle:solved'][id] || []).forEach((t) => say(t)));
  bus.on('time:warning', ({ secondsLeft }) => say(pick(SCRIPT['time:warning'][secondsLeft])));
  bus.on('game:over', ({ reason }) => (SCRIPT['game:over'][reason] || []).forEach((t) => say(t)));
  bus.on('game:win', () => (SCRIPT['game:win'] || []).forEach((t) => say(t)));

  bus.on('hint:requested', ({ id }) => {
    say(pick(SCRIPT['hint:requested']));
    const text = SCRIPT.riddles[id]?.[mood];
    if (text) bus.emit('nikki:hint', { puzzleId: id, text });
  });
}
