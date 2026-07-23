import "./toggle-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import { useId } from "react";
import type { InputHTMLAttributes } from "react";

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "checked" | "size"> {
  style?: string;
  theme?: string;
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function Toggle({
  style,
  theme,
  checked = false,
  onCheckedChange,
  label = "",
  disabled = false,
  size = "md",
  className = "",
  ...rest
}: ToggleProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const uid = useId();
  const internalId = `toggle-${uid}`;
  return (
    <label
      className={cn(
        "s-toggle",
        `s-toggle-${st}`,
        `theme-${th}`,
        `toggle-${size}`,
        disabled && "disabled",
        checked && "checked",
        className
      )}
      htmlFor={internalId}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        id={internalId}
        role="switch"
        aria-checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        {...rest}
      />
      <span className="s-toggle-track">
        <span className="s-toggle-thumb" />
      </span>
      {label ? <span className="s-toggle-label">{label}</span> : null}
    </label>
  );
}