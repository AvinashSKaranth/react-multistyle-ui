import "./multiselect-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import { Portal } from "../actions/portal";
import { useEffect, useRef, useState } from "react";
import type { HTMLAttributes } from "react";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  selected?: string[];
  onSelectedChange?: (v: string[]) => void;
  options?: MultiSelectOption[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

export function MultiSelect({
  style,
  theme,
  selected = [],
  onSelectedChange,
  options = [],
  placeholder = "Select...",
  label = "",
  disabled = false,
  className = "",
  ...rest
}: MultiSelectProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapperEl = useRef<HTMLDivElement>(null);
  const dropdownEl = useRef<HTMLDivElement>(null);
  const hasValue = selected.length > 0;
  const floated = focused || hasValue;

  const floatingLabelStyles = ["material", "material3"];
  const useFloatingLabel = floatingLabelStyles.includes(st) && (!!label || !!placeholder);
  const useAboveLabel = !floatingLabelStyles.includes(st) && (!!label || !!placeholder);
  const displayLabel = label || placeholder;
  const showInFieldPlaceholder = !(useFloatingLabel || (useAboveLabel && !label));

  function toggle(val: string) {
    if (selected.includes(val)) onSelectedChange?.(selected.filter((v) => v !== val));
    else onSelectedChange?.([...selected, val]);
  }
  function removeChip(val: string) {
    onSelectedChange?.(selected.filter((v) => v !== val));
  }
  function getLabel(val: string) {
    const opt = options.find((o) => o.value === val);
    return opt ? opt.label : val;
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

  useEffect(() => {
    if (!open) return;
    const reposition = () => positionDropdown();
    const onDocMouseDown = (e: MouseEvent) => {
      if (
        wrapperEl.current && !wrapperEl.current.contains(e.target as Node) &&
        !(dropdownEl.current && dropdownEl.current.contains(e.target as Node))
      ) {
        setOpen(false);
        setFocused(false);
      }
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    document.addEventListener("mousedown", onDocMouseDown);
    queueMicrotask(reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
      document.removeEventListener("mousedown", onDocMouseDown);
    };
  }, [open]);

  return (
    <div
      ref={wrapperEl}
      className={cn(
        "s-mselect-wrapper",
        `s-mselect-${st}`,
        `theme-${th}`,
        disabled && "disabled",
        focused && "focused",
        open && "open",
        hasValue && "has-value",
        floated && "floated",
        useAboveLabel && "above-label",
        className
      )}
      tabIndex={-1}
      role="listbox"
      aria-label={displayLabel}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        const related = e.relatedTarget as Node | null;
        if (related === null) return;
        if (
          wrapperEl.current && !wrapperEl.current.contains(related) &&
          !(dropdownEl.current && dropdownEl.current.contains(related))
        ) {
          setOpen(false);
          setFocused(false);
        }
      }}
      {...rest}
    >
      {useAboveLabel ? <label className="s-mselect-label-above">{displayLabel}</label> : null}
      {useFloatingLabel ? <label className="s-mselect-floating-label">{displayLabel}</label> : null}
      <div
        className="mselect-control"
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
      >
        {hasValue ? (
          <div className="mselect-chips">
            {selected.map((val) => (
              <span key={val} className="mselect-chip">
                {getLabel(val)}
                <button
                  type="button"
                  className="s-mselect-chip-remove"
                  onClick={(e) => { e.stopPropagation(); removeChip(val); }}
                  aria-label={`Remove ${getLabel(val)}`}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        ) : showInFieldPlaceholder ? (
          <span className="mselect-placeholder">{placeholder}</span>
        ) : null}
        <span className="mselect-arrow">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {open ? (
        <Portal>
          <div ref={dropdownEl} className={`mselect-dropdown s-mselect-${st} theme-${th}`}>
            {options.map((opt) => (
              <label key={opt.value} className={`mselect-option ${selected.includes(opt.value) ? "selected" : ""}`}>
                <input
                  type="checkbox"
                  checked={selected.includes(opt.value)}
                  onChange={() => toggle(opt.value)}
                />
                <span className="mselect-option-label">{opt.label}</span>
              </label>
            ))}
          </div>
        </Portal>
      ) : null}
    </div>
  );
}