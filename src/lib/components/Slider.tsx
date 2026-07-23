import "./slider-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import { useId } from "react";
import type { InputHTMLAttributes } from "react";

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "value"> {
  style?: string;
  theme?: string;
  value?: number;
  onValueChange?: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

export function Slider({
  style,
  theme,
  value = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  label = "",
  className = "",
  ...rest
}: SliderProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const uid = useId();
  const internalId = `slider-${uid}`;
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn("s-slider-wrapper", `s-slider-${st}`, `theme-${th}`, disabled && "disabled", className)}>
      {label ? (
        <label className="s-slider-label" htmlFor={internalId}>
          {label}: {value}
        </label>
      ) : null}
      <div className="s-slider-track-wrapper">
        <input
          id={internalId}
          type="range"
          className="s-slider"
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          style={{ ["--percent" as string]: `${percent}%` }}
          onChange={(e) => onValueChange?.(Number(e.target.value))}
          {...rest}
        />
      </div>
    </div>
  );
}