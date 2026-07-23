import "./row-styles.css";
import { cn } from "../utils/cn";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

const alignItems: Record<string, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
  baseline: "baseline",
};
const justifyContent: Record<string, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
};

export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  gap?: string;
  align?: string;
  justify?: string;
  fill?: boolean;
  wrap?: boolean;
  children?: ReactNode;
}

export function Row({
  gap = "8px",
  align = "stretch",
  justify = "start",
  fill = false,
  wrap = false,
  className = "",
  style,
  children,
  ...rest
}: RowProps) {
  const flexStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    gap,
    alignItems: (alignItems[align] ?? align) as CSSProperties["alignItems"],
    justifyContent: (justifyContent[justify] ?? justify) as CSSProperties["justifyContent"],
    ...(fill ? { width: "100%" } : {}),
    ...(wrap ? { flexWrap: "wrap" } : {}),
  };
  return (
    <div className={cn("s-row", className)} style={{ ...flexStyle, ...style }} {...rest}>
      {children}
    </div>
  );
}