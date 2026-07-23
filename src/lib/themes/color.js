/* ===== Color helpers =====
 * Pure JS (no Svelte) so this runs in Node (build script) and the browser
 * (App.svelte live preview). Used by generator.js to derive dark-mode colors
 * via HSL lightness inversion: hsl(h, s, calc(100% - l)).
 */

/**
 * @typedef {Object} Hsl
 * @property {number} h hue 0..360
 * @property {number} s saturation 0..100
 * @property {number} l lightness 0..100
 */

/**
 * Convert a hex color string to HSL.
 * Accepts #rgb, #rgba, #rrggbb, #rrggbbaa (alpha ignored).
 * @param {string} hex
 * @returns {Hsl}
 */
export function hexToHsl(hex) {
  const m = String(hex).replace("#", "").trim();
  let r, g, b;
  if (m.length === 3 || m.length === 4) {
    r = parseInt(m[0] + m[0], 16);
    g = parseInt(m[1] + m[1], 16);
    b = parseInt(m[2] + m[2], 16);
  } else {
    r = parseInt(m.slice(0, 2), 16);
    g = parseInt(m.slice(2, 4), 16);
    b = parseInt(m.slice(4, 6), 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/**
 * Format an Hsl object as a css hsl() string.
 * @param {Hsl} hsl
 * @returns {string}
 */
export function hslToCss({ h, s, l }) {
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

/**
 * Invert an Hsl color for dark-mode derivation. Lightness is flipped
 * (l -> 100 - l) then lifted by `lift` (default 20) so a light surface (e.g.
 * white, l=100) does not collapse to pure black (0%) — it lands at ~20% (a
 * dark gray). A smaller lift yields a darker result (surfaces), a larger lift
 * yields a lighter result (text). Result clamped to [0, 100].
 * Hue and saturation kept.
 * @param {Hsl} hsl
 * @param {number} [lift=20]
 * @returns {Hsl}
 */
export function invert(hsl, lift = 20) {
  const l = Math.min(100, Math.max(0, 100 - hsl.l + lift));
  return { h: hsl.h, s: hsl.s, l };
}

/**
 * Invert a hex color and return a css hsl() string.
 * @param {string} hex
 * @param {number} [lift=20]
 * @returns {string}
 */
export function invertHex(hex, lift = 20) {
  return hslToCss(invert(hexToHsl(hex), lift));
}