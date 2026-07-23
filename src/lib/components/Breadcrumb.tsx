import "./breadcrumb-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import type { HTMLAttributes } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, "style"> {
  style?: string;
  theme?: string;
  items?: BreadcrumbItem[];
}

export function Breadcrumb({ style, theme, items = [], className = "", ...rest }: BreadcrumbProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  return (
    <nav className={cn("s-breadcrumb", `s-breadcrumb-${st}`, `theme-${th}`, className)} aria-label="Breadcrumb" {...rest}>
      <ol className="s-breadcrumb-list">
        {items.map((item, i) => (
          <li key={i} className={`s-breadcrumb-item ${i === items.length - 1 ? "current" : ""}`}>
            {item.href && i < items.length - 1 ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span aria-current={i === items.length - 1 ? "page" : undefined}>{item.label}</span>
            )}
            {i < items.length - 1 ? <span className="s-breadcrumb-sep" aria-hidden="true">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}