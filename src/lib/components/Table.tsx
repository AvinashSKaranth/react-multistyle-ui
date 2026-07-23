import "./table-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import type { HTMLAttributes } from "react";

export interface TableProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  data?: Array<Record<string, unknown>> | null;
  variant?: string;
  caption?: string;
}

export function Table({
  style,
  theme,
  data = null,
  variant = "plain",
  caption,
  className = "",
  ...rest
}: TableProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const columns =
    data && data.length > 0
      ? Object.keys(data[0]).map((key) => ({ key, label: key }))
      : [];
  return (
    <div className={cn("s-table-wrapper", `s-table-${st}`, `theme-${th}`, `s-table-variant-${variant}`, className)} {...rest}>
      <div className="s-table-scroll">
        <table className="s-table">
          {caption ? <caption className="s-table-caption">{caption}</caption> : null}
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((row, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key}>{(row[col.key] as string) ?? ""}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}