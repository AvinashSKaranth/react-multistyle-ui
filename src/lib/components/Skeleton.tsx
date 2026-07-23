import "./skeleton-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import type { HTMLAttributes } from "react";

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  variant?: string;
  width?: string;
  height?: string;
}

export function Skeleton({
  style,
  theme,
  variant = "text",
  width = "100%",
  height = "",
  className = "",
  ...rest
}: SkeletonProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  return (
    <div
      className={cn("s-skeleton", `s-skeleton-${st}`, `theme-${th}`, `skeleton-${variant}`, className)}
      style={{ width, ...(height ? { height } : {}) }}
      aria-hidden="true"
      {...rest}
    />
  );
}