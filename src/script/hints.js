// Three hint tiers per puzzle, as text keys (resolved by script/text.js). Imran's own thoughts, never spoilers.
// Tier 1 nudge -> tier 2 pointer -> tier 3 near-answer. HINT_ORDER is the escape chain order.
export const HINT_ORDER = ['a1', 'a2', 'a3', 'a4', 'b', 'c1', 'd1', 'd2', 'd3', 'e'];

export const HINTS = Object.fromEntries(
  HINT_ORDER.map((id) => [id, ['NUDGE', 'POINTER', 'NEAR'].map((tier) => `HINT_${id.toUpperCase()}_${tier}`)]),
);

export const HINT_NONE = 'HINT_NONE'; // shown when H is pressed and no puzzle has hints
