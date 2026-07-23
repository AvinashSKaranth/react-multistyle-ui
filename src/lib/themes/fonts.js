/* ===== Per-style default fonts + dropdown options =====
 *
 * styleFonts maps each visual style (design language) to its guideline font
 * stack. Emitted into generated theme.css as `.ms-font-<style> { --t-font: ... }`
 * so a consuming app can opt in by adding the class to a wrapper (or let
 * initMultistyleUI apply it to <html>). The --t-font token cascades; components
 * inherit font-family from their host, so setting --t-font upstream is enough.
 *
 * fontOptions is the curated list for the demo header font selector. It covers
 * every family already loaded by src/app.html (so no new network fetch), plus an
 * "auto" entry (use the style's default) and a "system" entry (platform stack).
 */

/** Per-style default font stack (design guidelines). */
export const styleFonts = {
  material: "'Roboto', system-ui, sans-serif",
  material3: "'Roboto', system-ui, sans-serif",
  fluent: "'Segoe UI', system-ui, sans-serif",
  brutalist: "'Courier New', ui-monospace, monospace",
  pixel: "'Courier New', ui-monospace, monospace",
  neon: "'Exo 2', sans-serif",
  metro: "'Segoe UI', system-ui, sans-serif",
  bootstrap:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  cartoon: "'Comic Neue', 'Comic Sans MS', cursive",
  illustration: "'Dancing Script', cursive",
  carbon: "'IBM Plex Sans', system-ui, sans-serif",
  "liquid-glass":
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

/** Generic platform stack used by the "System" dropdown entry. */
export const SYSTEM_FONT =
  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

/**
 * Build a CSS font-family value for a single family with a sensible generic
 * fallback (serif / monospace / cursive / sans-serif).
 * @param {string} family
 * @param {string} generic
 * @returns {string}
 */
function fontValue(family, generic) {
  return `'${family}', ${generic}`;
}

/**
 * Loaded Google families grouped by generic fallback. Determined by the
 * families imported in src/app.html. A family only falls back to its generic
 * if the Google font fails to load.
 */
const SERIF = [
  "Abril Fatface",
  "Arvo",
  "Bitter",
  "Bree Serif",
  "Crimson Text",
  "Crete Round",
  "Droid Serif",
  "EB Garamond",
  "Faustina",
  "Libre Baskerville",
  "Lora",
  "Manuale",
  "Merriweather",
  "Noto Serif",
  "PT Serif",
  "Playfair Display",
  "Ropa Sans",
  "Roboto Slab",
  "Slabo 27px",
  "Spectral",
  "Vollkorn",
  "Zilla Slab",
];

const MONO = ["Inconsolata", "Roboto Mono", "Source Code Pro"];

const CURSIVE = [
  "Dancing Script",
  "Gloria Hallelujah",
  "Indie Flower",
  "Julee",
  "Lobster",
  "Pacifico",
  "Sedgwick Ave",
  "Sedgwick Ave Display",
  "Shadows Into Light",
  "Zilla Slab Highlight",
];

// Everything else loaded by app.html gets a sans-serif fallback.
const SANS = [
  "Abel",
  "Acme",
  "Alegreya Sans",
  "Alegreya",
  "Anton",
  "Archivo Black",
  "Archivo Narrow",
  "Archivo",
  "Arimo",
  "Asap Condensed",
  "Asap",
  "Bowlby One SC",
  "Cabin",
  "Cairo",
  "Catamaran",
  "Comic Neue",
  "Cuprum",
  "Dosis",
  "Droid Sans",
  "Exo 2",
  "Exo",
  "Fira Sans",
  "Fjalla One",
  "Francois One",
  "Hind",
  "Inter",
  "Josefin Sans",
  "Karla",
  "Lato",
  "Libre Franklin",
  "Mada",
  "Manrope",
  "Maven Pro",
  "Merriweather Sans",
  "Montserrat Subrayada",
  "Montserrat",
  "Mukta Vaani",
  "Muli",
  "Noto Sans",
  "Nunito",
  "Open Sans Condensed",
  "Open Sans",
  "Oswald",
  "Oxygen",
  "PT Sans Caption",
  "PT Sans Narrow",
  "PT Sans",
  "Passion One",
  "Pathway Gothic One",
  "Play",
  "Poppins",
  "Questrial",
  "Quicksand",
  "Raleway",
  "Roboto Condensed",
  "Roboto",
  "Rubik",
  "Saira Condensed",
  "Saira Extra Condensed",
  "Saira Semi Condensed",
  "Saira",
  "Signika",
  "Source Sans Pro",
  "Titillium Web",
  "Ubuntu Condensed",
  "Ubuntu",
  "Urbanist",
  "Varela Round",
  "Work Sans",
  "Yanone Kaffeesatz",
  "Figtree",
];

/**
 * Dropdown options for the header font selector.
 * @type {{ value: string, label: string }[]}
 */
export const fontOptions = [
  { value: "auto", label: "Auto (style default)" },
  { value: SYSTEM_FONT, label: "System" },
  ...SANS.map((f) => ({ value: fontValue(f, "sans-serif"), label: f })),
  ...SERIF.map((f) => ({ value: fontValue(f, "serif"), label: f })),
  ...MONO.map((f) => ({ value: fontValue(f, "monospace"), label: f })),
  ...CURSIVE.map((f) => ({ value: fontValue(f, "cursive"), label: f })),
];