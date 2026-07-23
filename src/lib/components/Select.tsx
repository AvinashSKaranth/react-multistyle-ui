import "./select-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import { Portal } from "../actions/portal";
import { useEffect, useRef, useState } from "react";
import type { HTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  options?: SelectOption[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

export function Select({
  style,
  theme,
  value = "",
  onValueChange,
  options = [],
  placeholder = "Select...",
  label = "",
  disabled = false,
  className = "",
  ...rest
}: SelectProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapperEl = useRef<HTMLDivElement>(null);
  const dropdownEl = useRef<HTMLDivElement>(null);
  const hasValue = value !== "" && value !== null && value !== undefined;
  const floated = focused || hasValue;

  const floatingLabelStyles = ["material", "material3"];
  const useFloatingLabel = floatingLabelStyles.includes(st) && (!!label || !!placeholder);
  const useAboveLabel = !floatingLabelStyles.includes(st) && (!!label || !!placeholder);
  const displayLabel = label || placeholder;
  const showInFieldPlaceholder = !(useFloatingLabel || (useAboveLabel && !label));

  function getLabel(val: string) {
    const opt = options.find((o) => o.value === val);
    return opt ? opt.label : val;
  }
  function selectOption(val: string) {
    onValueChange?.(val);
    setOpen(false);
    setFocused(false);
  }
  function positionDropdown() {
    if (!wrapperEl.current || !dropdownEl.current) return;
    const rect = wrapperEl.current.getBoundingClientRect();
    const ddHeight = dropdownEl.current.offsetHeight || 200;
    let top = rect.bottom + 4;
    if (top + ddHeight > window.innerHeight - 8 && rect.top - ddHeight - 4 > 8) {
      top = rect.top - ddHeight - 4;
    }
    dropdownEl.current.style.left = `${rect.left}px`;
    dropdownEl.current.style.top = `${top}px`;
    dropdownEl.current.style.width = `${rect.width}px`;
  }
  function handleKeydown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
      setFocused(true);
    } else if (e.key === "Escape") {
      setOpen(false);
      setFocused(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    const handler = (e: PointerEvent) => {
      if (
        wrapperEl.current && !wrapperEl.current.contains(e.target as Node) &&
        !(dropdownEl.current && dropdownEl.current.contains(e.target as Node))
      ) {
        setOpen(false);
        setFocused(false);
      }
    };
    const reposition = () => positionDropdown();
    document.addEventListener("pointerdown", handler);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    queueMicrotask(reposition);
    return () => {
      document.removeEventListener("pointerdown", handler);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open]);

  return (
    <div
      ref={wrapperEl}
      className={cn(
        "s-select-wrapper",
        `s-select-${st}`,
        `theme-${th}`,
        disabled && "disabled",
        focused && "focused",
        hasValue && "has-value",
        floated && "floated",
        open && "open",
        useAboveLabel && "above-label",
        className
      )}
      tabIndex={-1}
      role="listbox"
      aria-label={displayLabel}
      onFocus={() => setFocused(true)}
      onBlur={() => setTimeout(() => { setOpen(false); setFocused(false); }, 150)}
      {...rest}
    >
      {useAboveLabel ? <label className="s-select-label-above">{displayLabel}</label> : null}
      {useFloatingLabel ? <label className="s-select-floating-label">{displayLabel}</label> : null}
      <div
        className="s-select-control"
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeydown}
      >
        {hasValue ? (
          <span className="s-select-value">{getLabel(value)}</span>
        ) : showInFieldPlaceholder ? (
          <span className="s-select-placeholder">{placeholder}</span>
        ) : null}
        <span className="s-select-arrow">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {open ? (
        <Portal>
          <div
            ref={dropdownEl}
            className={`s-select-dropdown s-select-${st} theme-${th}`}
          >
            {options.map((opt) => (
              <div
                key={opt.value}
                className={`s-select-option ${value === opt.value ? "selected" : ""}`}
                onClick={() => selectOption(opt.value)}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </Portal>
      ) : null}
    </div>
  );
}