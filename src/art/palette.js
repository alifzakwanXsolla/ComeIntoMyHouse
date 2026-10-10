// 26 muted, slightly desaturated colours. Every generated pixel uses one of these.
// Pixel maps refer to them by single character ('.' = transparent).
export const PAL = {
  k: '#15111b', // ink / outline
  K: '#272030', // deep shadow
  c: '#5f6169', // concrete
  C: '#494b53', // concrete dark
  D: '#777a82', // concrete light
  w: '#8b6b4b', // wood
  W: '#6a4e37', // wood dark
  x: '#46342a', // wood deep
  y: '#a88a64', // wood light
  p: '#8d7869', // wallpaper
  P: '#6f5d57', // wallpaper dark
  r: '#873a40', // dried red
  R: '#c9484d', // LED red
  g: '#5b6f57', // sage green
  b: '#4b607b', // dusty blue
  B: '#35445a', // dusty blue dark
  s: '#d4aa8b', // skin
  S: '#a67d66', // skin shade
  h: '#d9cfba', // cream
  H: '#b0a694', // cream dark
  n: '#2b2331', // hair
  Y: '#d8b25b', // warm light
  z: '#f1df9f', // pale light
  T: '#86c8a2', // CRT teal
  m: '#8c8f98', // metal
  M: '#5d606a', // metal dark
};

export const hex = (ch) => parseInt(PAL[ch].slice(1), 16);
export const css = (ch) => PAL[ch];
