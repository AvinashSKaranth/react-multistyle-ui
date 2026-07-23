import "./divider-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import type { HTMLAttributes } from "react";

export interface DividerProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  orientation?: "horizontal" | "vertical";
  label?: string;
}

export function Divider({
  style,
  theme,
  orientation = "horizontal",
  label = "",
  className = "",
  ...rest
}: DividerProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  return (
    <div
      className={cn("s-divider", `s-divider-${st}`, `theme-${th}`, orientation === "vertical" && "vertical", className)}
      role="separator"
      aria-orientation={orientation}
      {...rest}
    >
      {label && orientation === "horizontal" ? (
        <>
          <span className="s-divider-line" />
          <span className="s-divider-label">{label}</span>
          <span className="s-divider-line" />
        </>
      ) : null}
    </div>
  );
}