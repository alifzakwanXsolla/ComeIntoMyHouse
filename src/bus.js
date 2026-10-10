// Tiny mitt-style event bus. No dependencies.
// bus.on('type', fn) returns an unsubscribe function. bus.on('*', (type, data) => {}) sees everything.
export function createBus() {
  const handlers = new Map();
  const bus = {
    on(type, fn) {
      if (!handlers.has(type)) handlers.set(type, new Set());
      handlers.get(type).add(fn);
      return () => bus.off(type, fn);
    },
    off(type, fn) {
      if (!fn) return handlers.delete(type);
      handlers.get(type)?.delete(fn);
    },
    emit(type, data) {
      for (const fn of [...(handlers.get(type) || [])]) safe(fn, data);
      for (const fn of [...(handlers.get('*') || [])]) safe(fn, type, data);
    },
  };
  return bus;
}

function safe(fn, ...args) {
  try { fn(...args); } catch (e) { console.error('[bus] handler error', e); }
}

export const bus = createBus();
