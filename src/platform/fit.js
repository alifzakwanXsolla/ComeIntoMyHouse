// Scales the fixed-size #stage (canvas + DOM overlays) to fill the iframe, centered, any orientation.
export function fitStage(stage, W, H, onFit) {
  const fit = () => {
    const w = window.innerWidth, h = window.innerHeight;
    const raw = Math.min(w / W, h / H);
    const s = raw >= 1 ? Math.floor(raw) : raw; // integer scale keeps pixels crisp
    stage.style.transform = `translate(${(w - W * s) / 2}px, ${(h - H * s) / 2}px) scale(${s})`;
    onFit?.();
  };
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);
  fit();
}
