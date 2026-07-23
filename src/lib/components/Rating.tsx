import "./rating-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import { useState } from "react";
import type { HTMLAttributes } from "react";

export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  value?: number;
  onValueChange?: (v: number) => void;
  max?: number;
  precision?: "full" | "half" | "quarter";
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  showValue?: boolean;
}

export function Rating({
  style,
  theme,
  value = 0,
  onValueChange,
  max = 5,
  precision = "full",
  size = "md",
  readonly = false,
  showValue = false,
  className = "",
  ...rest
}: RatingProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  const [isHovering, setIsHovering] = useState(0);

  function getFillClass(star: number) {
    if (isHovering > 0) {
      if (star <= isHovering) return "star-filled";
      if (precision === "half" && isHovering < star && isHovering >= star - 0.5) return "star-half";
      return "star-empty";
    }
    if (star <= value) return "star-filled";
    if (precision === "half" && value < star && value >= star - 0.5) return "star-half";
    return "star-empty";
  }

  function updateValue(star: number, e: React.MouseEvent) {
    if (readonly) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (precision === "half") {
      const x = e.clientX - rect.left;
      const half = x < rect.width / 2;
      onValueChange?.(half ? star - 0.5 : star);
    } else {
      onValueChange?.(
        precision === "quarter"
          ? Math.round((star - (1 - (e.clientX - rect.left) / rect.width)) * 4) / 4
          : star
      );
    }
  }

  function handleHover(star: number, e: React.MouseEvent) {
    if (readonly) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (precision === "half") {
      const x = e.clientX - rect.left;
      setIsHovering(x < rect.width / 2 ? star - 0.5 : star);
    } else {
      setIsHovering(star);
    }
  }

  return (
    <div
      className={cn("s-rating", `s-rating-${st}`, `theme-${th}`, `rating-${size}`, className)}
      role="radiogroup"
      aria-label="Rating"
      {...rest}
    >
      {stars.map((star) => {
        const cls = getFillClass(star);
        return (
          <span
            key={star}
            className={`s-rating-star ${cls} ${!readonly ? "clickable" : ""}`}
            onClick={(e) => updateValue(star, e)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (!readonly) onValueChange?.(star);
              }
            }}
            onMouseMove={(e) => handleHover(star, e)}
            onMouseLeave={() => !readonly && setIsHovering(0)}
            role="radio"
            aria-checked={star <= value}
            tabIndex={readonly ? -1 : 0}
          >
            {cls === "star-half" ? (
              <>
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 24 24"
                  style={{ clipPath: "inset(0 50% 0 0)" }}
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 24 24"
                  style={{ clipPath: "inset(0 0 0 50%)", position: "absolute", top: 0, left: 0 }}
                  fill="color-mix(in srgb, #eab308 30%, transparent 70%)"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </>
            ) : (
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
          </span>
        );
      })}
      {showValue ? <span className="s-rating-value">{value.toFixed(precision === "full" ? 0 : 1)}</span> : null}
    </div>
  );
}