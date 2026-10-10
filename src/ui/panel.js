// DOM modal used by puzzles. One panel at a time. Esc closes (puzzle stays unsolved).
export class Panel {
  constructor(onClose) {
    this.el = document.getElementById('panel');
    this.onClose = onClose;
    this.isOpen = false;
  }

  // Returns the element so puzzles can fill it. `title` is shown as <h2>.
  open(title) {
    this.el.innerHTML = '';
    const h = document.createElement('h2');
    h.textContent = title;
    this.el.appendChild(h);
    this.el.classList.remove('hidden');
    this.isOpen = true;
    return this.el;
  }

  close() {
    if (!this.isOpen) return;
    this.el.classList.add('hidden');
    this.el.innerHTML = '';
    this.isOpen = false;
    this.onClose?.();
  }

  // Small DOM helper: h('button', { onclick }, 'text')
  static h(tag, props = {}, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k.startsWith('on')) e[k] = v;
      else if (k === 'style') e.style.cssText = v;
      else e.setAttribute(k, v);
    }
    for (const k of kids) e.append(k);
    return e;
  }
}
