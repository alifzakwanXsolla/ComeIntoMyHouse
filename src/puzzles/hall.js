import { Panel } from '../ui/panel.js';
const h = Panel.h;

const ORDER = ['hall', 'cafe', 'arcade', 'park', 'market'];
const FRAMES = {
  hall:   { icon: '🎤', label: 'Event hall' },
  cafe:   { icon: '☕', label: 'Cafe' },
  arcade: { icon: '🕹️', label: 'Arcade' },
  park:   { icon: '🌳', label: 'Park' },
  market: { icon: '🏮', label: 'Night market' },
};

let solved = false;

export default {
  id: 'hall',
  room: 'hall',
  title: 'Our Timeline',
  reward: 1,
  isSolved: () => solved,

  start(scene, bus) {
    const pm = scene.puzzles;
    // Fixed scramble so it is never accidentally solved on open.
    let order = ['park', 'hall', 'market', 'cafe', 'arcade'];
    let picked = null;

    const el = scene.panel.open(this.title);
    el.append(h('p', {}, 'Put our day in order: first hello to last goodnight. Click two frames to swap them.'));
    const row = h('div', { style: 'display:flex;gap:8px;justify-content:center;margin:14px 0' });
    el.append(row);
    const status = h('p', { style: 'color:#a89a8a;min-height:1.2em' }, '');
    el.append(status);

    const render = () => {
      row.innerHTML = '';
      order.forEach((k, i) => {
        const f = FRAMES[k];
        const b = h('button', {
          style: `width:104px;height:120px;font-size:34px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;${picked === i ? 'border-color:#e0607e;background:#4a2630' : ''}`,
          onclick: () => {
            scene.audio.click();
            if (picked === null) picked = i;
            else {
              [order[picked], order[i]] = [order[i], order[picked]];
              picked = null;
              pm.progress('hall', { order: [...order] });
            }
            render();
          },
        }, f.icon, h('span', { style: 'font-size:12px' }, f.label));
        row.append(b);
      });
    };
    render();

    el.append(
      h('button', {
        onclick: () => {
          if (order.every((k, i) => k === ORDER[i])) {
            solved = true;
            scene.audio.good();
            pm.solve(scene, 'hall');
          } else {
            scene.audio.bad();
            const right = order.filter((k, i) => k === ORDER[i]).length;
            status.textContent = `${right} of 5 in the right place.`;
            pm.wrong(scene, 'hall');
          }
        },
      }, 'Hang them up'),
      h('button', { onclick: () => pm.close(scene) }, 'Step back'),
    );
  },
};
