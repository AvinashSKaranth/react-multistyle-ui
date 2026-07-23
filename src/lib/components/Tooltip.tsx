import "./tooltip-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import { useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  text?: string;
  position?: "top" | "bottom" | "left" | "right";
  children?: ReactNode;
}

export function Tooltip({
  style,
  theme,
  text = "",
  position = "top",
  className = "",
  children,
  ...rest
}: TooltipProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const [visible, setVisible] = useState(false);
  return (
    <div
      className={cn("s-tooltip-wrapper", `s-tooltip-${st}`, `theme-${th}`, className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      {...rest}
    >
      {children}
      {visible && text ? <div className={`s-tooltip tooltip-${position}`} role="tooltip">{text}</div> : null}
    </div>
  );
}