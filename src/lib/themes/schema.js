/* ===== Theme config types (JSDoc) =====
 * No runtime code — type reference for presets.js / generator.js / editor.
 */

/**
 * @typedef {Object} ThemeCommon
 * @property {string} primary
 * @property {string} secondary
 * @property {string} info
 * @property {string} success
 * @property {string} warning
 * @property {string} error
 * @property {string} textOnPrimary  text color when background is primary
 * @property {string} buttonRadius   css length
 * @property {string} cardRadius    css length
 * @property {string} inputRadius    css length
 * @property {string} borderWidth    css length
 */

/**
 * @typedef {Object} ThemeMode
 * @property {string|null} text
 * @property {string|null} surface
 * @property {string|null} cardSurface
 */

/**
 * @typedef {Object} ThemeConfig
 * @property {ThemeCommon} common  applies to both light and dark
 * @property {ThemeMode} light      text/surface/cardSurface required (non-null hex)
 * @property {ThemeMode} dark       null = HSL-invert from the light counterpart
 */

export {};