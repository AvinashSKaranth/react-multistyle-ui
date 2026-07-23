import "./fab-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";

export interface FABProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  style?: string;
  theme?: string;
  preset?: string;
  position?: string;
}

export function FAB({
  style,
  theme,
  preset = "primary",
  position = "bottom-right",
  className = "",
  children,
  ...rest
}: FABProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  return (
    <button
      className={cn("s-fab", `s-fab-${st}`, `theme-${th}`, `fab-${preset}`, `fab-${position}`, className)}
      {...rest}
    >
      {children}
    </button>
  );
}