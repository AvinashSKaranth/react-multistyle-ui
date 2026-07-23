import "./progressbar-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import { useState } from "react";
import type { HTMLAttributes } from "react";

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  value?: number;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  label?: boolean;
}

export function ProgressBar({
  style,
  theme,
  value = 0,
  size = "md",
  animated = false,
  label = false,
  className = "",
  ...rest
}: ProgressBarProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const isIndeterminate = value < 0;
  const clampedValue = Math.min(100, Math.max(0, value));
  const popoverText = isIndeterminate ? "—" : `${clampedValue}%`;
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);
  const popoverOpen = label && (hovered || focused || pinned);

  return (
    <div
      className={cn("s-progressbar", `s-progressbar-${st}`, `theme-${th}`, `progress-${size}`, className)}
      role="progressbar"
      aria-valuenow={isIndeterminate ? undefined : clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-busy={isIndeterminate ? "true" : undefined}
      tabIndex={label ? 0 : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onClick={() => setPinned((p) => !p)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setPinned((p) => !p);
        }
      }}
      {...rest}
    >
      <div className="progress-track">
        <div
          className={cn(
            "progress-fill",
            isIndeterminate && "indeterminate",
            animated && !isIndeterminate && "animated"
          )}
          style={isIndeterminate ? undefined : { width: `${clampedValue}%` }}
        />
      </div>
      {popoverOpen ? <div className="progress-popover" role="tooltip">{popoverText}</div> : null}
    </div>
  );
}