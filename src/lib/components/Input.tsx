import "./input-styles.css";
import { useDefaults, iconClass } from "../config";
import { cn } from "../utils/cn";
import { useId, useState } from "react";
import type { InputHTMLAttributes } from "react";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "value"> {
  style?: string;
  theme?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  label?: string;
  iconStart?: string;
  iconEnd?: string;
}

export function Input({
  style,
  theme,
  type = "text",
  value = "",
  onValueChange,
  placeholder = "",
  label = "",
  disabled = false,
  iconStart,
  iconEnd,
  readOnly = false,
  required = false,
  className = "",
  ...rest
}: InputProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const uid = useId();
  const internalId = `input-${uid}`;
  const [focused, setFocused] = useState(false);
  const hasValue = value !== "" && value !== null && value !== undefined;
  const floated = focused || hasValue;
  const hasIconStart = !!iconStart;
  const hasIconEnd = !!iconEnd;

  const floatingLabelStyles = ["material", "material3"];
  const useFloatingLabel = floatingLabelStyles.includes(st) && (!!label || !!placeholder);
  const useAboveLabel = !floatingLabelStyles.includes(st) && (!!label || !!placeholder);
  const displayLabel = label || placeholder;

  return (
    <div
      className={cn(
        "s-input-wrapper",
        `s-input-${st}`,
        `theme-${th}`,
        disabled && "disabled",
        focused && "focused",
        hasValue && "has-value",
        floated && "floated",
        hasIconStart && "has-icon-start",
        hasIconEnd && "has-icon-end",
        useAboveLabel && "above-label",
        className
      )}
    >
      {useAboveLabel ? (
        <label className="s-input-label-above" htmlFor={internalId}>
          {displayLabel}
        </label>
      ) : null}
      {useFloatingLabel ? (
        <label className="s-input-floating-label" htmlFor={internalId}>
          {displayLabel}
        </label>
      ) : null}
      <div className="s-input-field">
        {iconStart ? <span className={`s-input-icon s-input-icon-start ${iconClass}`}>{iconStart}</span> : null}
        <input
          type={type}
          value={value}
          placeholder={useFloatingLabel || (useAboveLabel && !label) ? "" : placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          id={internalId}
          onChange={(e) => onValueChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {iconEnd ? <span className={`s-input-icon s-input-icon-end ${iconClass}`}>{iconEnd}</span> : null}
      </div>
    </div>
  );
}