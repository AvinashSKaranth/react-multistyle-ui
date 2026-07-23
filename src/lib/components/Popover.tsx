import "./popover-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import { Presence } from "../transitions";
import { useEffect, useRef, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "content"> {
  style?: string;
  theme?: string;
  children?: ReactNode;
  content?: string | (() => ReactNode);
  position?: "top" | "bottom" | "left" | "right";
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  trigger?: "click" | "hover";
}

export function Popover({
  style,
  theme,
  children,
  content,
  position = "top",
  open,
  onOpenChange,
  trigger = "click",
  className = "",
  ...rest
}: PopoverProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const [isOpen, setIsOpen] = useState(false);
  const effectiveOpen = open !== undefined ? open : isOpen;
  const popoverEl = useRef<HTMLDivElement>(null);
  const triggerEl = useRef<HTMLDivElement>(null);

  const setOpen = (v: boolean) => {
    if (open !== undefined) onOpenChange?.(v);
    else setIsOpen(v);
  };

  function toggle() {
    if (trigger === "click") setOpen(!effectiveOpen);
  }
  function show() { if (trigger === "hover") setOpen(true); }
  function hide() { if (trigger === "hover") setOpen(false); }

  useEffect(() => {
    if (!effectiveOpen) return;
    const handler = (e: PointerEvent) => {
      if (popoverEl.current && !popoverEl.current.contains(e.target as Node) && triggerEl.current && !triggerEl.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const keyHandler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", handler);
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("pointerdown", handler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [effectiveOpen]);

  const flyX = position === "right" ? "-8px" : position === "left" ? "8px" : "0px";
  const flyY = position === "bottom" ? "-8px" : position === "top" ? "8px" : "0px";

  return (
    <div
      className={cn("s-popover-wrapper", `s-popover-${st}`, `theme-${th}`, className)}
      onMouseEnter={trigger === "hover" ? show : undefined}
      onMouseLeave={trigger === "hover" ? hide : undefined}
      {...rest}
    >
      <div
        ref={triggerEl}
        className="s-popover-trigger"
        onClick={toggle}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggle(); }}
        role="button"
        tabIndex={0}
        aria-expanded={effectiveOpen}
      >
        {children}
      </div>
      <Presence
        show={effectiveOpen}
        enter="t-fly-enter"
        exit="t-fly-exit"
        duration={150}
        as="div"
        className={`s-popover popover-${position}`}
        style={{ ["--t-fly-x" as string]: flyX, ["--t-fly-y" as string]: flyY }}
        ref={popoverEl}
        role="dialog"
      >
        <div className="s-popover-arrow" />
        <div className="s-popover-content">
          {typeof content === "string" ? <p style={{ margin: 0 }}>{content}</p> : typeof content === "function" ? content() : null}
        </div>
      </Presence>
    </div>
  );
}