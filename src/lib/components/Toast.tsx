import "./toast-styles.css";
import { useDefaults, iconClass } from "../config";
import { cn } from "../utils/cn";
import { Presence } from "../transitions";
import type { HTMLAttributes, ReactNode } from "react";

export interface ToastItem {
  id: string | number;
  preset?: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
  icon?: string;
  duration?: number;
}

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  toasts?: ToastItem[];
  onToastsChange?: (v: ToastItem[]) => void;
  position?: "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center";
  duration?: number;
}

const flyParams: Record<string, { x: string; y: string }> = {
  "top-right": { x: "20px", y: "-20px" },
  "top-left": { x: "-20px", y: "-20px" },
  "top-center": { x: "0px", y: "-20px" },
  "bottom-right": { x: "20px", y: "20px" },
  "bottom-left": { x: "-20px", y: "20px" },
  "bottom-center": { x: "0px", y: "20px" },
};

const icons: Record<string, string> = { info: "ℹ", success: "✓", warning: "⚠", error: "✕" };

export function Toast({
  style,
  theme,
  toasts = [],
  onToastsChange,
  position = "top-right",
  duration = 4000,
  className = "",
  ...rest
}: ToastProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;

  function renderIcon(icon: string | undefined, preset: string | undefined): ReactNode {
    if (icon) {
      if (icon.length === 1) return icon;
      return <span className={iconClass}>{icon}</span>;
    }
    return icons[preset ?? ""] ?? "ℹ";
  }
  function removeToast(id: string | number) {
    onToastsChange?.(toasts.filter((t) => t.id !== id));
  }
  function handleDismiss(id: string | number, e: React.MouseEvent) {
    e.stopPropagation();
    removeToast(id);
  }

  const fly = flyParams[position];

  return (
    <div className={cn("s-toast-container", `toast-${position}`, `s-toast-${st}`, `theme-${th}`, className)} {...rest}>
      {toasts.map((toast) => (
        <Presence
          key={toast.id}
          show={true}
          enter="t-fly-enter"
          exit="t-fly-exit"
          duration={300}
          as="div"
          className={`s-toast s-toast-${toast.preset} s-toast-${st} theme-${th}`}
          style={{ ["--t-fly-x" as string]: fly.x, ["--t-fly-y" as string]: fly.y }}
          role="alert"
        >
          <span className="s-toast-icon">{renderIcon(toast.icon, toast.preset)}</span>
          <div className="s-toast-content">
            {toast.title ? <div className="s-toast-title">{toast.title}</div> : null}
            <div className="s-toast-message">{toast.message}</div>
          </div>
          <button className="s-toast-close" onClick={(e) => handleDismiss(toast.id, e)} aria-label="Dismiss">&times;</button>
          {(toast.duration ?? duration) > 0 ? (
            <div className="s-toast-progress" style={{ animationDuration: `${toast.duration ?? duration}ms` }} />
          ) : null}
        </Presence>
      ))}
    </div>
  );
}