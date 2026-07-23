import "./iconbutton-styles.css";
import { useDefaults, iconClass } from "../config";
import { cn } from "../utils/cn";

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  style?: string;
  theme?: string;
  variant?: string;
  preset?: string;
  size?: "sm" | "md" | "lg";
  icon?: string;
  ariaLabel?: string;
}

export function IconButton({
  style,
  theme,
  variant = "filled",
  preset = "primary",
  size = "md",
  disabled = false,
  icon,
  ariaLabel = "",
  className = "",
  children,
  ...rest
}: IconButtonProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  return (
    <button
      className={cn(
        "s-iconbtn",
        `s-iconbtn-${st}`,
        `theme-${th}`,
        `ibtn-${variant}`,
        `ibtn-${preset}`,
        `ibtn-${size}`,
        className
      )}
      disabled={disabled}
      aria-label={ariaLabel}
      {...rest}
    >
      {icon ? <span className={iconClass}>{icon}</span> : children}
    </button>
  );
}