import "./radio-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import { useId } from "react";
import type { InputHTMLAttributes } from "react";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "value" | "checked"> {
  style?: string;
  theme?: string;
  value: string;
  group: string;
  onGroupChange?: (v: string) => void;
  label?: string;
}

export function Radio({
  style,
  theme,
  value,
  group,
  onGroupChange,
  label = "",
  disabled = false,
  className = "",
  ...rest
}: RadioProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const uid = useId();
  const internalId = `radio-${uid}`;
  const isSelected = group === value;
  return (
    <label
      className={cn(
        "s-radio",
        `s-radio-${st}`,
        `theme-${th}`,
        disabled && "disabled",
        isSelected && "selected",
        className
      )}
      htmlFor={internalId}
    >
      <input
        type="radio"
        value={value}
        checked={isSelected}
        disabled={disabled}
        id={internalId}
        onChange={() => onGroupChange?.(value)}
        {...rest}
      />
      <span className="s-radio-circle">
        <span className="s-radio-dot" />
      </span>
      {label ? <span className="s-radio-label">{label}</span> : null}
    </label>
  );
}