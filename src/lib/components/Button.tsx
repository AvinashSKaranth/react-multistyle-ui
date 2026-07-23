import "./button-styles.css";
import { useDefaults, iconClass } from "../config";
import { cn } from "../utils/cn";

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  style?: string;
  theme?: string;
  variant?: "filled" | "outlined" | "text" | "tonal";
  preset?: string;
  size?: "sm" | "md" | "lg";
  icon?: string;
}

export function Button({
  style,
  theme,
  variant = "filled",
  preset = "primary",
  size = "md",
  icon,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  return (
    <button
      className={cn(
        "s-button",
        `s-button-${st}`,
        `theme-${th}`,
        `btn-${variant}`,
        `btn-${preset}`,
        `btn-${size}`,
        className
      )}
      {...rest}
    >
      {icon ? <span className={`s-button-icon ${iconClass}`}>{icon}</span> : null}
      {children}
    </button>
  );
}