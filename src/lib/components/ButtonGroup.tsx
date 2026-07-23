import "./buttongroup-styles.css";
import { useDefaults, iconClass } from "../config";
import { cn } from "../utils/cn";
import type { HTMLAttributes } from "react";

export interface ButtonGroupItem {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  onclick?: () => void;
}

export interface ButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  variant?: string;
  size?: "sm" | "md" | "lg";
  items?: ButtonGroupItem[];
  value?: string;
  onValueChange?: (v: string) => void;
  orientation?: "horizontal" | "vertical";
}

export function ButtonGroup({
  style,
  theme,
  variant = "outlined",
  size = "md",
  items = [],
  value = "",
  onValueChange,
  orientation = "horizontal",
  className = "",
  ...rest
}: ButtonGroupProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  return (
    <div
      className={cn(
        "s-btn-group",
        `s-btn-group-${st}`,
        `theme-${th}`,
        `btn-group-${orientation}`,
        `btn-group-${variant}`,
        `btn-group-${size}`,
        className
      )}
      role="group"
      {...rest}
    >
      {items.map((item) => (
        <button
          key={item.value}
          className={`s-btn-group-item ${value === item.value ? "active" : ""}`}
          onClick={() => {
            onValueChange?.(item.value);
            item.onclick?.();
          }}
          disabled={item.disabled}
        >
          {item.icon ? <span className={`btn-group-icon ${iconClass}`}>{item.icon}</span> : null}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}