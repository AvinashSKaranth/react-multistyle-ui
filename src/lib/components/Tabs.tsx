import "./tabs-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import type { HTMLAttributes } from "react";

export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  tabs?: TabItem[];
  active?: string;
  onActiveChange?: (id: string) => void;
}

export function Tabs({
  style,
  theme,
  tabs = [],
  active = "",
  onActiveChange,
  className = "",
  ...rest
}: TabsProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  return (
    <div className={cn("s-tabs", `s-tabs-${st}`, `theme-${th}`, className)} role="tablist" {...rest}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`s-tab ${active === tab.id ? "active" : ""}`}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onActiveChange?.(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}