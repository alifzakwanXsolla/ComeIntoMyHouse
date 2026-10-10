import { iconEl } from './pixelIcons.js';
import { t } from '../script/text.js';

// Bottom-right popup. Before 'phone:pickup' it is a sticky-note stack of Imran's notes.
// After pickup it reskins to a phone (message bubbles); a NOTES / PHONE button flips between them.
// Returns { phoneMsgs } = the element the phone UI (stub or teammate's) renders bubbles into.
export function initNotesPopup(bus, notes, root) {
  root.innerHTML = '';
  const h = (tag, cls, ...kids) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    e.append(...kids);
    return e;
  };

  const count = h('span', 'tab-count');
  const tabLabel = h('span', 'tab-label', 'NOTES');
  const flip = h('button', 'flip hidden', 'PHONE');
  const tab = h('div', 'tab', iconEl('note', 1), tabLabel, count, flip);
  const stack = h('div', 'stack');
  const notesBox = h('div', 'notes', tab, stack);

  const phoneMsgs = h('div', 'phone-msgs');
  const flipBack = h('button', 'flip', 'NOTES');
  const phoneBox = h('div', 'phone hidden', h('div', 'phone-bar', iconEl('battery', 1), h('span', '', 'PHONE'), flipBack), phoneMsgs);
  root.append(notesBox, phoneBox);

  let hasPhone = false;
  let view = 'notes';
  let open = false;
  let freshId = null;
  let freshT = null;

  function render() {
    notesBox.classList.toggle('hidden', view !== 'notes');
    phoneBox.classList.toggle('hidden', view !== 'phone');
    flip.classList.toggle('hidden', !hasPhone);
    notesBox.classList.toggle('open', open);
    phoneBox.classList.toggle('open', open);
    count.textContent = notes.items.length ? String(notes.items.length) : '';
    stack.innerHTML = '';
    const list = [...notes.items].reverse();
    if (!list.length) stack.append(h('div', 'sticky empty', 'No notes yet.'));
    (open ? list : list.slice(0, 3)).forEach((n, i) => {
      const card = h('div', `sticky r${i % 3}${n.id === freshId ? ' fresh' : ''}`, iconEl(n.icon, 2), h('span', 'sticky-text', t(n.key)));
      stack.append(card);
    });
    if (phoneMsgs.isConnected) phoneMsgs.scrollTop = phoneMsgs.scrollHeight;
  }

  const toggleOpen = () => { open = !open; render(); };
  const setView = (v) => { view = v; render(); };
  tab.onclick = (e) => { if (e.target !== flip) toggleOpen(); };
  flip.onclick = () => setView('phone');
  flipBack.onclick = () => setView('notes');

  notes.onChange = (id) => {
    freshId = id;
    clearTimeout(freshT);
    freshT = setTimeout(() => { freshId = null; render(); }, 4000);
    render();
    tab.classList.remove('pulse'); void tab.offsetWidth; tab.classList.add('pulse');
  };

  bus.on('phone:pickup', () => { hasPhone = true; view = 'phone'; render(); });
  bus.on('game:start', () => { hasPhone = false; view = 'notes'; open = false; freshId = null; render(); });

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() !== 'n' || ['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
    toggleOpen();
  });

  render();
  return { phoneMsgs };
}
