// Text lookup for keyed strings (notes, hints). The story teammate fills TEXT; code never holds story text.
// A key with no entry renders as [KEY] so gaps are obvious in playtests.
export const TEXT = {
  // NOTE_DINNER_PET: '...',
  // HINT_A1_NUDGE: '...',
};

export const t = (key) => TEXT[key] ?? `[${key}]`;
