import "./drawer-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import { Portal } from "../actions/portal";
import { Presence } from "../transitions";
import type { HTMLAttributes, ReactNode } from "react";

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  position?: "left" | "right" | "top" | "bottom";
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  onClose?: () => void;
  children?: ReactNode;
}

export function Drawer({
  style,
  theme,
  position = "left",
  open = false,
  onOpenChange,
  onClose,
  className = "",
  children,
  ...rest
}: DrawerProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;

  function handleClose() {
    onOpenChange?.(false);
    onClose?.();
  }
  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) handleClose();
  }

  return (
    <Portal>
      <Presence show={open} enter="t-fade-enter" exit="t-fade-exit" duration={200} as="div"
        className={cn("s-drawer-overlay", className)} onClick={handleBackdrop} role="presentation" {...rest}>
        <Presence show={open} enter={`t-slide-${position}-enter`} exit={`t-slide-${position}-exit`} duration={300} as="div"
          className={`s-drawer s-drawer-${st} theme-${th} drawer-${position}`} role="dialog" aria-modal="true">
          {children}
        </Presence>
      </Presence>
    </Portal>
  );
}