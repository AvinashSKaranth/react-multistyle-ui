/**
 * Reactive global defaults for react-multistyle-ui.
 *
 * Port of svelte-multistyle-ui's `config.svelte.js`. The Svelte version used a
 * module-level `$state` object; here we use a plain mutable object + a tiny
 * pub/sub consumed via `useSyncExternalStore`, so every component that calls
 * `useDefaults()` re-renders when `initMultistyleUI` mutates the defaults.
 */
import { useSyncExternalStore } from "react";
import { styleFonts } from "./themes/fonts.js";

export interface Defaults {
  style: string;
  theme: string;
  mode: "system" | "light" | "dark";
  font: string;
  systemDark: boolean;
}

const defaults: Defaults = {
  style: "material",
  theme: "default",
  mode: "system",
  font: "auto",
  systemDark: false,
};

/** Icon library class used to render icon names. */
export const iconClass = "material-symbols-outlined";

// --- pub/sub ---------------------------------------------------------------
const listeners = new Set<() => void>();

// useSyncExternalStore compares snapshots with Object.is. We mutate `defaults`
// in place, so we MUST hand out a new immutable snapshot on every emit() —
// otherwise the snapshot reference is unchanged and React skips re-rendering
// (this was the light/dark/system mode bug: mode changes notified but no
// component re-rendered because getSnapshot returned the same object).
let snapshot: Defaults = { ...defaults };

function emit() {
  snapshot = { ...defaults };
  for (const l of listeners) l();
}
function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot(): Defaults {
  return snapshot;
}

/** Subscribe to global defaults changes; returns the current defaults. */
export function useDefaults(): Defaults {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// --- system dark-mode tracking --------------------------------------------
if (typeof window !== "undefined") {
  defaults.systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  snapshot = { ...defaults };
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", (e) => {
    defaults.systemDark = e.matches;
    emit();
  });
}

/**
 * Sync the per-style default font class and the inline --t-font override onto
 * the document root. Called by initMultistyleUI; safe to call repeatedly.
 * - A `font` value of "auto" (or omitted) lets the `.ms-font-<style>` class win.
 * - Any other `font` value is treated as a CSS font-family stack and written
 *   inline on <html>, overriding the class.
 */
function applyFontToRoot(style: string, font: string) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const c of [...root.classList]) {
    if (c.startsWith("ms-font-")) root.classList.remove(c);
  }
  const styleFont = (styleFonts as Record<string, string>)[style];
  if (styleFont) root.classList.add(`ms-font-${style}`);
  if (font && font !== "auto") {
    root.style.setProperty("--t-font", font);
  } else {
    root.style.removeProperty("--t-font");
  }
}

export interface InitOptions {
  style?: string;
  theme?: string;
  mode?: "system" | "light" | "dark";
  font?: string;
}

/**
 * Set the global default style, theme, mode and/or font for all components.
 * Per-component `style`/`theme` props still override these defaults.
 */
export function initMultistyleUI({
  style = "material",
  theme = "default",
  mode = "system",
  font = "auto",
}: InitOptions = {}) {
  defaults.style = style;
  defaults.theme = theme;
  defaults.mode = mode;
  defaults.font = font;
  applyFontToRoot(style, font);
  emit();
}

/** Mutable defaults object (advanced use; mutate then call `notifyDefaults`). */
export { defaults };

/** Notify subscribers after manually mutating `defaults`. */
export function notifyDefaults() {
  emit();
}