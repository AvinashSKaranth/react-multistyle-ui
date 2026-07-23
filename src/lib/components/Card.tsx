import "./card-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import type { HTMLAttributes } from "react";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  padding?: "sm" | "md" | "lg" | "none";
  elevated?: boolean;
}

export function Card({
  style,
  theme,
  padding = "md",
  elevated = false,
  className = "",
  children,
  ...rest
}: CardProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  return (
    <div
      className={cn(
        "s-card",
        `s-card-${st}`,
        `theme-${th}`,
        `card-pad-${padding}`,
        elevated && "elevated",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}