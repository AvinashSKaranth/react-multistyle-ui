import "./modal-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import { Portal } from "../actions/portal";
import { Presence } from "../transitions";
import type { HTMLAttributes, ReactNode } from "react";

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  onClose?: () => void;
  title?: string;
  size?: "small" | "medium" | "large" | "full";
  children?: ReactNode;
}

export function Modal({
  style,
  theme,
  open = false,
  onOpenChange,
  onClose,
  title = "",
  size = "medium",
  className = "",
  children,
  ...rest
}: ModalProps) {
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
        className={cn("s-modal-overlay", `theme-${th}`, className)}
        onClick={handleBackdrop} role="dialog" aria-modal="true" {...rest}>
        <Presence show={open} enter="t-scale-enter" exit="t-scale-exit" duration={200} as="div"
          className={`s-modal s-modal-${size} s-modal-${st}`}>
          <div className="s-modal-header">
            <h2 className="s-modal-title">{title}</h2>
            <button className="s-modal-close" onClick={handleClose} aria-label="Close">&times;</button>
          </div>
          <div className="s-modal-body">{children}</div>
        </Presence>
      </Presence>
    </Portal>
  );
}