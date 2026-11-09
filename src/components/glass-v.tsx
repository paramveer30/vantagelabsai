// The hero's giant logo mark. The real effect is drawn by TextureBackground:
// it reads this element's position each frame and renders the V as its own
// pane of fluted glass, brighter than the field around it, with a lit rim.
// This element only reserves the space and, when WebGL isn't available
// (html lacks .webgl), shows a static SVG version of the same mark.
//
// The path is the logo mark from app/icon.svg; the viewBox crops to its
// bounds (x 3..29, y 4.5..28).
export const V_PATH = "M3 4.5h8.2L16 16.4 20.8 4.5H29L18.4 28h-4.8L3 4.5Z";

export function GlassV() {
  return (
    <div className="glass-v" data-glass-v aria-hidden="true">
      <svg viewBox="3 4.5 26 23.5" className="glass-v-fallback">
        <defs>
          <linearGradient id="glass-v-fill" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0" stopColor="#3AA6EE" />
            <stop offset="0.55" stopColor="#0287DE" />
            <stop offset="1" stopColor="#2BF59A" />
          </linearGradient>
          <pattern
            id="glass-v-ribs"
            width="0.9"
            height="1"
            patternUnits="userSpaceOnUse"
          >
            <rect width="0.25" height="1" fill="#fff" opacity="0.12" />
            <rect x="0.55" width="0.35" height="1" fill="#000" opacity="0.22" />
          </pattern>
        </defs>
        <path d={V_PATH} fill="url(#glass-v-fill)" />
        <path d={V_PATH} fill="url(#glass-v-ribs)" />
      </svg>
    </div>
  );
}
