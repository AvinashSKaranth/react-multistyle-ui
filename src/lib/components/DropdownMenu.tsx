import "./dropdown-styles.css";
import { useDefaults, iconClass } from "../config";
import { cn } from "../utils/cn";
import { Portal } from "../actions/portal";
import { Presence } from "../transitions";
import { useEffect, useRef, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";

export interface DropdownItem {
  label?: string;
  icon?: string;
  shortcut?: string;
  onclick?: () => void;
  disabled?: boolean;
  active?: boolean;
  divider?: boolean;
}

export interface DropdownMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  variant?: string;
  color?: string;
  items?: DropdownItem[];
  position?: "bottom" | "top";
  align?: "left" | "right";
  children?: ReactNode;
}

export function DropdownMenu({
  style,
  theme,
  variant = "filled",
  color = "primary",
  items = [],
  position = "bottom",
  align = "left",
  className = "",
  children,
  ...rest
}: DropdownMenuProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const [open, setOpen] = useState(false);
  const menuEl = useRef<HTMLDivElement>(null);
  const triggerEl = useRef<HTMLDivElement>(null);

  function positionMenu() {
    if (!triggerEl.current || !menuEl.current) return;
    const rect = triggerEl.current.getBoundingClientRect();
    const menu = menuEl.current;
    const menuHeight = menu.offsetHeight || 200;
    const menuWidth = menu.offsetWidth || 180;
    let top: number;
    if (position === "top") {
      top = rect.top - menuHeight - 6;
      if (top < 8 && rect.bottom + menuHeight + 6 < window.innerHeight) top = rect.bottom + 6;
    } else {
      top = rect.bottom + 6;
      if (top + menuHeight > window.innerHeight - 8 && rect.top - menuHeight - 6 > 8) top = rect.top - menuHeight - 6;
    }
    let left: number;
    if (align === "right") {
      left = rect.right - menuWidth;
      if (left < 8) left = 8;
    } else {
      left = rect.left;
      if (left + menuWidth > window.innerWidth - 8) left = Math.max(8, window.innerWidth - menuWidth - 8);
    }
    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
    menu.style.minWidth = `${rect.width}px`;
  }

  useEffect(() => {
    if (!open) return;
    const handler = (e: PointerEvent) => {
      if (menuEl.current && !menuEl.current.contains(e.target as Node) && triggerEl.current && !triggerEl.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const keyHandler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const reposition = () => positionMenu();
    document.addEventListener("pointerdown", handler);
    document.addEventListener("keydown", keyHandler);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    queueMicrotask(reposition);
    return () => {
      document.removeEventListener("pointerdown", handler);
      document.removeEventListener("keydown", keyHandler);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open]);

  function handleItemClick(item: DropdownItem) {
    item.onclick?.();
    setOpen(false);
  }

  return (
    <div className={cn("s-dropdown", `s-dropdown-${st}`, `theme-${th}`, `dropdown-${align}`, open && "open", className)} {...rest}>
      <div
        ref={triggerEl}
        className={`s-dropdown-trigger dropdown-${color}`}
        onClick={() => setOpen((o) => !o)}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setOpen((o) => !o); }}
      >
        {children}
      </div>
      {open ? (
        <Portal>
          <div className={`s-dropdown-${st} theme-${th} dropdown-${color}`}>
            <Presence
              show={open}
              enter="t-fly-enter"
              exit="t-fly-exit"
              duration={150}
              as="div"
              ref={menuEl}
              style={{ ["--t-fly-y" as string]: position === "bottom" ? "-8px" : "8px" }}
              className={`s-dropdown-menu dropdown-${position} dropdown-${align}`}
              role="menu"
            >
              {items.map((item, i) =>
                item.divider ? (
                  <div key={i} className="s-dropdown-divider" />
                ) : (
                  <button
                    key={i}
                    className={`s-dropdown-item ${item.active ? "active" : ""}`}
                    disabled={item.disabled}
                    onClick={() => handleItemClick(item)}
                    role="menuitem"
                  >
                    {item.icon ? <span className={`s-dropdown-item-icon ${iconClass}`}>{item.icon}</span> : null}
                    <span className="s-dropdown-item-label">{item.label}</span>
                    {item.shortcut ? <span className="s-dropdown-item-shortcut">{item.shortcut}</span> : null}
                  </button>
                )
              )}
            </Presence>
          </div>
        </Portal>
      ) : null}
    </div>
  );
}