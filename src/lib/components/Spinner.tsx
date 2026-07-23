import "./spinner-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import type { HTMLAttributes } from "react";

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  size?: "sm" | "md" | "lg";
}

export function Spinner({ style, theme, size = "md", className = "", ...rest }: SpinnerProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  return (
    <div
      className={cn("s-spinner", `s-spinner-${st}`, `theme-${th}`, `spinner-${size}`, className)}
      role="status"
      aria-label="Loading"
      {...rest}
    >
      <div className="s-spinner-circle" />
    </div>
  );
}