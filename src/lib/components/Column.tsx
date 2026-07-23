import "./column-styles.css";
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

export interface ColumnProps extends HTMLAttributes<HTMLDivElement> {
  gap?: string;
  align?: string;
  justify?: string;
  fill?: boolean;
  children?: ReactNode;
}

export function Column({
  gap = "8px",
  align = "stretch",
  justify = "start",
  fill = false,
  className = "",
  style,
  children,
  ...rest
}: ColumnProps) {
  const flexStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap,
    alignItems: (alignItems[align] ?? align) as CSSProperties["alignItems"],
    justifyContent: (justifyContent[justify] ?? justify) as CSSProperties["justifyContent"],
    ...(fill ? { width: "100%" } : {}),
  };
  return (
    <div className={cn("s-column", className)} style={{ ...flexStyle, ...style }} {...rest}>
      {children}
    </div>
  );
}