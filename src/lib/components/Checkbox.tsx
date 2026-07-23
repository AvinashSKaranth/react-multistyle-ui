import "./checkbox-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import { useId, useEffect, useRef } from "react";
import type { InputHTMLAttributes } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "checked"> {
  style?: string;
  theme?: string;
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
  indeterminate?: boolean;
  onIndeterminateChange?: (v: boolean) => void;
  label?: string;
}

export function Checkbox({
  style,
  theme,
  checked = false,
  onCheckedChange,
  indeterminate = false,
  onIndeterminateChange,
  label = "",
  disabled = false,
  className = "",
  ...rest
}: CheckboxProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const uid = useId();
  const internalId = `checkbox-${uid}`;
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      className={cn(
        "s-checkbox",
        `s-checkbox-${st}`,
        `theme-${th}`,
        disabled && "disabled",
        checked && "checked",
        indeterminate && "indeterminate",
        className
      )}
      htmlFor={internalId}
    >
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        id={internalId}
        onChange={(e) => {
          onCheckedChange?.(e.target.checked);
          if (onIndeterminateChange && e.target.indeterminate !== indeterminate) {
            onIndeterminateChange(e.target.indeterminate);
          }
        }}
        {...rest}
      />
      <span className="s-checkbox-box">
        {indeterminate ? (
          <svg className="s-checkbox-icon" viewBox="0 0 16 16" fill="none">
            <path d="M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : checked ? (
          <svg className="s-checkbox-icon" viewBox="0 0 16 16" fill="none">
            <path
              d="M3.5 8.5L6.5 11.5L12.5 4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
      {label ? <span className="s-checkbox-label">{label}</span> : null}
    </label>
  );
}