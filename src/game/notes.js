// Bottom-right popup: Imran's sticky notes until he gets his phone back, then a phone tab appears.
// The phone teammate can replace renderPhone() / listen to the same bus events (docs/PHONE_API.md).
import { bus } from '../bus.js';
import { iconEl } from '../ui/pixelIcons.js';
import { NOTES } from './story.js';

export function initNotes(rootEl) {
  let items = [];
  let open = false;
  let view = 'notes';
  let hasPhone = false;
  let fresh = null;
  let peek = false; // opened automatically by a new note; collapses again
  const msgs = [];

  const h = (tag, cls, ...kids) => { const e = document.createElement(tag); if (cls) e.className = cls; e.append(...kids); return e; };

  let started = false;
  function render() {
    rootEl.innerHTML = '';
    if (!started) return;
    const tabs = h('div', 'ntabs');
    const notesTab = h('button', `ntab${view === 'notes' ? ' on' : ''}`, iconEl('note', 1), ` NOTES ${items.length || ''}`);
    notesTab.onclick = () => { if (view === 'notes') open = !open; else { view = 'notes'; open = true; } render(); };
    tabs.append(notesTab);
    if (hasPhone) {
      const phoneTab = h('button', `ntab${view === 'phone' ? ' on' : ''}`, iconEl('battery', 1), ' PHONE');
      phoneTab.onclick = () => { if (view === 'phone') open = !open; else { view = 'phone'; open = true; } render(); };
      tabs.append(phoneTab);
    }
    rootEl.append(tabs);
    if (!open) return;
    if (view === 'notes') {
      const list = h('div', 'nlist');
      if (!items.length) list.append(h('div', 'sticky empty', 'No notes yet.'));
      (peek ? items.slice(-1) : [...items].reverse()).forEach((n, i) => list.append(h('div', `sticky r${i % 3}${n.id === fresh ? ' fresh' : ''}`, iconEl(n.icon, 2), h('span', '', n.text))));
      rootEl.append(list);
    } else {
      const ph = h('div', 'phonebox');
      ph.append(h('div', 'pbar', h('span', '', '3%'), h('span', '', 'NO SIGNAL')));
      const m = h('div', 'pmsgs');
      msgs.forEach((x) => m.append(h('div', `bubble${x.me ? ' me' : ''}`, h('b', '', x.from), h('br'), x.text)));
      ph.append(m);
      rootEl.append(ph);
      m.scrollTop = m.scrollHeight;
    }
  }

  function add(id) {
    const d = NOTES[id];
    if (!d || items.some((n) => n.id === id)) return false;
    items.push({ id, ...d });
    fresh = id;
    if (!open) peek = true;
    open = true; view = 'notes';
    render();
    rootEl.classList.remove('pulse'); void rootEl.offsetWidth; rootEl.classList.add('pulse');
    setTimeout(() => { if (fresh === id) { fresh = null; if (peek) { open = false; peek = false; } render(); } }, 4000);
    return true;
  }

  bus.on('note:add', ({ id }) => add(id));
  bus.on('notes:restore', ({ ids }) => { items = ids.map((id) => ({ id, ...NOTES[id] })).filter((n) => n.text); render(); });
  bus.on('phone:pickup', () => { hasPhone = true; render(); });
  bus.on('phone:message', (m) => { msgs.push(m); if (hasPhone) { view = 'phone'; open = true; } render(); });
  bus.on('game:start', () => { started = true; items = []; hasPhone = false; view = 'notes'; open = false; msgs.length = 0; render(); });
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() !== 'n' || ['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
    open = !open; peek = false; render();
  });

  render();
  return { ids: () => items.map((n) => n.id) };
}
