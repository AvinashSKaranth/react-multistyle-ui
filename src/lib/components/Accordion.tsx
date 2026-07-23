import "./accordion-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import { useEffect, useState } from "react";
import type { HTMLAttributes } from "react";

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  items?: AccordionItem[];
  multiple?: boolean;
  current?: string;
}

export function Accordion({
  style,
  theme,
  items = [],
  multiple = false,
  current = "",
  className = "",
  ...rest
}: AccordionProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(current ? [current] : []));

  useEffect(() => {
    if (current) setOpenItems(new Set([current]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  function toggle(id: string) {
    setOpenItems((prev) => {
      if (multiple) {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      }
      return prev.has(id) ? new Set() : new Set([id]);
    });
  }

  return (
    <div className={cn("s-accordion", `s-accordion-${st}`, `theme-${th}`, className)} {...rest}>
      {items.map((item) => (
        <div key={item.id} className={`s-accordion-item ${openItems.has(item.id) ? "open" : ""}`}>
          <button
            className="s-accordion-header"
            onClick={() => toggle(item.id)}
            aria-expanded={openItems.has(item.id)}
          >
            <span>{item.title}</span>
            <svg
              className="s-accordion-arrow"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {openItems.has(item.id) ? <div className="s-accordion-content">{item.content}</div> : null}
        </div>
      ))}
    </div>
  );
}