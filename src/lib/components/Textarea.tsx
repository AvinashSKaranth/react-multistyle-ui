import "./textarea-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import { useId, useState } from "react";
import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "style"> {
  style?: string;
  theme?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  label?: string;
  rows?: number;
  maxlength?: number;
  autoresize?: boolean;
  readOnly?: boolean;
}

export function Textarea({
  style,
  theme,
  value = "",
  onValueChange,
  placeholder = "",
  label = "",
  rows = 4,
  maxlength,
  disabled = false,
  readOnly = false,
  required = false,
  autoresize = false,
  className = "",
  ...rest
}: TextareaProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const uid = useId();
  const internalId = `textarea-${uid}`;
  const [focused, setFocused] = useState(false);
  const hasValue = value !== "" && value !== null && value !== undefined;
  const floated = focused || hasValue;
  const charCount = value ? value.length : 0;

  const floatingLabelStyles = ["material", "material3"];
  const useFloatingLabel = floatingLabelStyles.includes(st) && (!!label || !!placeholder);
  const useAboveLabel = !floatingLabelStyles.includes(st) && (!!label || !!placeholder);
  const displayLabel = label || placeholder;

  return (
    <div
      className={cn(
        "s-textarea-wrapper",
        `s-textarea-${st}`,
        `theme-${th}`,
        disabled && "disabled",
        focused && "focused",
        hasValue && "has-value",
        floated && "floated",
        useAboveLabel && "above-label",
        className
      )}
    >
      {useAboveLabel ? (
        <label className="s-textarea-label-above" htmlFor={internalId}>
          {displayLabel}
        </label>
      ) : null}
      {useFloatingLabel ? (
        <label className="s-textarea-floating-label" htmlFor={internalId}>
          {displayLabel}
        </label>
      ) : null}
      <textarea
        value={value}
        placeholder={useFloatingLabel || (useAboveLabel && !label) ? "" : placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        rows={rows}
        maxLength={maxlength}
        id={internalId}
        onChange={(e) => {
          onValueChange?.(e.target.value);
          if (autoresize) {
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
      {maxlength ? (
        <span className="s-textarea-counter">
          {charCount}/{maxlength}
        </span>
      ) : null}
    </div>
  );
}