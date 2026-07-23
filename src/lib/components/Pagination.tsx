import "./pagination-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import { useMemo } from "react";
import type { HTMLAttributes } from "react";

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "style"> {
  style?: string;
  theme?: string;
  total?: number;
  perPage?: number;
  current?: number;
  onCurrentChange?: (page: number) => void;
}

export function Pagination({
  style,
  theme,
  total = 0,
  perPage = 10,
  current = 1,
  onCurrentChange,
  className = "",
  ...rest
}: PaginationProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const totalPages = Math.ceil(total / perPage);
  const pages = useMemo(() => {
    const p: number[] = [];
    for (let i = 1; i <= totalPages; i++) p.push(i);
    return p;
  }, [totalPages]);
  return (
    <nav className={cn("s-pagination", `s-pagination-${st}`, `theme-${th}`, className)} aria-label="Pagination" {...rest}>
      <button
        className="s-pagination-btn"
        disabled={current <= 1}
        onClick={() => onCurrentChange?.(current - 1)}
        aria-label="Previous"
      >
        &laquo;
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={`s-pagination-btn ${page === current ? "active" : ""}`}
          onClick={() => onCurrentChange?.(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="s-pagination-btn"
        disabled={current >= totalPages}
        onClick={() => onCurrentChange?.(current + 1)}
        aria-label="Next"
      >
        &raquo;
      </button>
    </nav>
  );
}