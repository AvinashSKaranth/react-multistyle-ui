import { createPortal } from "react-dom";
import type { ReactNode } from "react";

/**
 * Portal children to document.body. Replaces the Svelte `use:portal` action:
 * overlays (Modal, Drawer, CommandPalette, Select/MultiSelect dropdowns,
 * DatePicker) must escape transformed/filtered ancestors that create a
 * containing block for `position: fixed`.
 */
export function Portal({ children }: { children: ReactNode }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}