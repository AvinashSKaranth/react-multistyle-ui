import "./alert-styles.css";
import { useDefaults, iconClass } from "../config";
import { cn } from "../utils/cn";
import { useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  preset?: "info" | "success" | "warning" | "error";
  title?: string;
  icon?: string;
  dismissible?: boolean;
  children?: ReactNode;
}

const defaultIcons: Record<string, string> = {
  info: "ℹ",
  success: "✓",
  warning: "⚠",
  error: "✕",
};

export function Alert({
  style,
  theme,
  preset = "info",
  title = "",
  icon: iconProp,
  dismissible = false,
  className = "",
  children,
  ...rest
}: AlertProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  const icon = iconProp ?? defaultIcons[preset] ?? null;
  const iconEl = icon && icon.length === 1 ? icon : null;
  const iconName = icon && icon.length > 1 ? icon : null;
  return (
    <div
      className={cn("s-alert", `s-alert-${st}`, `theme-${th}`, `s-alert-${preset}`, className)}
      role="alert"
      {...rest}
    >
      {iconEl ? (
        <span className="s-alert-icon">{iconEl}</span>
      ) : iconName ? (
        <span className={`s-alert-icon ${iconClass}`}>{iconName}</span>
      ) : null}
      <div className="s-alert-content">
        {title ? <strong className="s-alert-title">{title}</strong> : null}
        <div className="s-alert-body">{children}</div>
      </div>
      {dismissible ? (
        <button className="s-alert-dismiss" aria-label="Dismiss" onClick={() => setVisible(false)}>
          &times;
        </button>
      ) : null}
    </div>
  );
}