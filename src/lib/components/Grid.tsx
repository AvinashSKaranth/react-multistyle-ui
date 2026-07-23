import "./grid-styles.css";
import { cn } from "../utils/cn";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

const alignItems: Record<string, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
  baseline: "baseline",
};
const justifyItems: Record<string, string> = {
  start: "start",
  center: "center",
  end: "end",
  stretch: "stretch",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
};

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: number | string;
  gap?: string;
  rows?: string;
  fill?: boolean;
  align?: string;
  justify?: string;
  minColumnWidth?: string;
  children?: ReactNode;
}

export function Grid({
  columns = 1,
  gap = "8px",
  rows,
  fill = false,
  align = "stretch",
  justify = "start",
  minColumnWidth,
  className = "",
  style,
  children,
  ...rest
}: GridProps) {
  const templateColumns =
    minColumnWidth && (columns === "auto" || columns === "auto-fill")
      ? `repeat(auto-fill, minmax(${minColumnWidth}, 1fr))`
      : typeof columns === "number"
        ? `repeat(${columns}, 1fr)`
        : columns;
  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: templateColumns as CSSProperties["gridTemplateColumns"],
    ...(rows ? { gridTemplateRows: rows } : {}),
    gap,
    alignItems: (alignItems[align] ?? align) as CSSProperties["alignItems"],
    justifyItems: (justifyItems[justify] ?? justify) as CSSProperties["justifyItems"],
    ...(fill ? { width: "100%" } : {}),
  };
  return (
    <div className={cn("s-grid", className)} style={{ ...gridStyle, ...style }} {...rest}>
      {children}
    </div>
  );
}