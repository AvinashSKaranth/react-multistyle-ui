/* ===== Theme CSS generator =====
 * Pure JS (no Svelte). Produces `.theme-<name>` (light) and
 * `html.dark .theme-<name>` (dark) CSS rule bodies from a structured config.
 *
 * Config shape (only these fields are configurable; everything else is derived):
 *   common: { primary, secondary, info, success, warning, error, textOnPrimary,
 *            buttonRadius, cardRadius, inputRadius, borderWidth }
 *   light:  { text, surface, cardSurface }                 // all required hex
 *   dark:   { text, surface, cardSurface }                 // null = HSL-invert from light
 *
 * Derived (NOT configurable):
 *   --t-text-hint / --t-text-muted / --t-text-disabled = 50% transparency of --t-text
 *   --t-text-primary = primary, --t-text-secondary = secondary,
 *   --t-text-info/success/warning/error = info/success/warning/error
 *   --t-card-bg = surface, --t-card-border-color = mix(text 14%, surface),
 *   --t-surface-bg = mix(surface 85%, #000), --t-btn-bg = primary
 */

import { invertHex } from "./color.js";

/** Stable output order so generated theme.css is byte-stable across runs. */
const TOKEN_ORDER = [
  "--t-primary", "--t-secondary", "--t-info", "--t-success", "--t-warning", "--t-error",
  "--t-text-on-primary",
  "--t-surface", "--t-card-bg", "--t-card-surface", "--t-card-border-color", "--t-surface-bg",
  "--t-text", "--t-text-hint", "--t-text-muted", "--t-text-disabled",
  "--t-text-primary", "--t-text-secondary",
  "--t-text-info", "--t-text-success", "--t-text-warning", "--t-text-error",
  "--t-btn-bg", "--t-btn-border-color", "--t-btn-radius", "--t-card-radius", "--t-input-radius",
  "--t-border-width",
];

/** 50% transparency of a text color css string. */
function hintOf(textCss) {
  return `color-mix(in srgb, ${textCss} 50%, transparent)`;
}

/**
 * Resolve the light-mode token map for a config.
 * @param {object} c theme config
 * @returns {Record<string, string>}
 */
export function resolveLight(c) {
  const { common: cm, light: l } = c;
  return {
    "--t-primary": cm.primary,
    "--t-secondary": cm.secondary,
    "--t-info": cm.info,
    "--t-success": cm.success,
    "--t-warning": cm.warning,
    "--t-error": cm.error,
    "--t-text-on-primary": cm.textOnPrimary,
    "--t-btn-radius": cm.buttonRadius,
    "--t-card-radius": cm.cardRadius,
    "--t-input-radius": cm.inputRadius,
    "--t-border-width": cm.borderWidth,
    "--t-btn-bg": cm.primary,
    "--t-btn-border-color": "transparent",
    "--t-text": l.text,
    "--t-surface": l.surface,
    "--t-card-surface": l.cardSurface,
    "--t-card-bg": l.surface,
    "--t-card-border-color": `color-mix(in srgb, ${l.text} 14%, ${l.surface})`,
    "--t-surface-bg": `color-mix(in srgb, ${l.surface} 85%, #000)`,
    "--t-text-primary": cm.primary,
    "--t-text-secondary": cm.secondary,
    "--t-text-info": cm.info,
    "--t-text-success": cm.success,
    "--t-text-warning": cm.warning,
    "--t-text-error": cm.error,
    // --t-text-hint / --t-text-muted / --t-text-disabled MUST be emitted here,
    // not left to theme-base.css. A color-mix() custom property bakes at the
    // declaring element using THAT element's --t-text; the :root derivation
    // bakes with :root's (light) text and is inherited as a fixed dark color,
    // so it never follows --t-text when a theme/style/dark block changes it.
    // Emitting per mode re-bakes with the correct (light or dark) text.
    "--t-text-hint": hintOf(l.text),
    "--t-text-muted": hintOf(l.text),
    "--t-text-disabled": hintOf(l.text),
  };
}

/**
 * Resolve the dark-mode token map. null dark fields are HSL-inverted from
 * their light counterpart; explicit (non-null) values win.
 *
 * Only dark-specific tokens are emitted (text, surface, cardSurface + their
 * derivations). Common tokens (primary, status colors, radii, border-width,
 * text-on-primary, btn-bg, brand/status text) are NOT re-emitted — they
 * inherit from the `.theme-<name>` light block on the same element. This keeps
 * the dark block small and avoids restating values that do not change.
 * @param {object} c theme config
 * @returns {Record<string, string>}
 */
export function resolveDark(c) {
  const { light: l, dark: d } = c;
  // Text lifts high (stays light); surfaces lift low (stay darker than text).
  const darkText = d.text ?? invertHex(l.text, 20);
  const darkSurface = d.surface ?? invertHex(l.surface, 10);
  const darkCard = d.cardSurface ?? invertHex(l.cardSurface, 14);
  return {
    "--t-text": darkText,
    "--t-surface": darkSurface,
    "--t-card-surface": darkCard,
    "--t-card-bg": darkSurface,
    "--t-card-border-color": `color-mix(in srgb, ${darkText} 14%, ${darkSurface})`,
    "--t-surface-bg": `color-mix(in srgb, ${darkSurface} 85%, #000)`,
    // Re-bake the hint/muted/disabled derivations with the DARK text so they
    // stay light in dark mode (see resolveLight comment for the baking rule).
    "--t-text-hint": hintOf(darkText),
    "--t-text-muted": hintOf(darkText),
    "--t-text-disabled": hintOf(darkText),
  };
}

/** Emit a token map as indented `--t-*: value;` lines, in TOKEN_ORDER, skipping null. */
function emit(map) {
  return TOKEN_ORDER
    .filter((k) => map[k] != null)
    .map((k) => `  ${k}: ${map[k]};`)
    .join("\n");
}

/**
 * Merge a style-override layer onto a base token map.
 * override value === null -> drop that token (preserve the style's own value);
 * non-null -> overwrite. Used for per-style null opt-outs (e.g. liquid-glass).
 * @param {Record<string,string>} base
 * @param {Record<string, string|null>|null} override
 * @returns {Record<string,string>}
 */
function mergeLayer(base, override) {
  if (!override) return base;
  const out = { ...base };
  for (const [k, v] of Object.entries(override)) {
    if (v == null) delete out[k];
    else out[k] = v;
  }
  return out;
}

/**
 * Generate the `.theme-<name>` and `html.dark .theme-<name>` CSS rules.
 * @param {string} name theme name
 * @param {object} config { common, light, dark }
 * @param {{ light?: object, dark?: object }|null} [override] style-override layer
 * @returns {{ light: string, dark: string }}
 */
export function generateThemeCss(name, config, override = null) {
  const lightMap = mergeLayer(resolveLight(config), override?.light);
  const darkMap = mergeLayer(resolveDark(config), override?.dark);
  const light = `.theme-${name} {\n${emit(lightMap)}\n}`;
  const dark = `html.dark .theme-${name} {\n${emit(darkMap)}\n}`;
  return { light, dark };
}

/**
 * Apply a theme config's CSS vars directly to a DOM element (live preview).
 * Sets every resolved token; clears any previously-set --t-* var not in the new map.
 * @param {HTMLElement} el
 * @param {object} config { common, light, dark }
 * @param {boolean} isDark
 */
export function applyThemeToElement(el, config, isDark) {
  const map = isDark ? resolveDark(config) : resolveLight(config);
  // clear stale --t-* vars set by a previous apply
  for (let i = el.style.length - 1; i >= 0; i--) {
    const prop = el.style[i];
    if (prop.startsWith("--t-")) el.style.removeProperty(prop);
  }
  for (const [k, v] of Object.entries(map)) {
    if (v != null) el.style.setProperty(k, v);
  }
}