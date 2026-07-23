import "./chip-styles.css";
import { useDefaults, iconClass } from "../config";
import { cn } from "../utils/cn";
import { useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";

export interface ChipProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style"> {
  style?: string;
  theme?: string;
  variant?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  dismissible?: boolean;
  icon?: string;
  onDismiss?: () => void;
  children?: ReactNode;
}

export function Chip({
  style,
  theme,
  variant = "filled",
  color = "primary",
  size = "md",
  dismissible = false,
  icon = "",
  onDismiss,
  className = "",
  children,
  ...rest
}: ChipProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <span
      className={cn(
        "s-chip",
        `s-chip-${st}`,
        `theme-${th}`,
        `chip-${variant}`,
        `chip-${color}`,
        `chip-${size}`,
        className
      )}
      {...rest}
    >
      {icon ? <span className={`s-chip-icon ${iconClass}`}>{icon}</span> : null}
      <span className="s-chip-label">{children}</span>
      {dismissible ? (
        <button
          className="s-chip-dismiss"
          aria-label="Remove"
          onClick={() => {
            setVisible(false);
            onDismiss?.();
          }}
        >
          &times;
        </button>
      ) : null}
    </span>
  );
}