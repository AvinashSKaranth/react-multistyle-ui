import "./avatar-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import { useState } from "react";
import type { HTMLAttributes } from "react";

export interface AvatarProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  fallback?: string;
}

export function Avatar({
  style,
  theme,
  src = "",
  alt = "",
  size = "md",
  fallback = "",
  className = "",
  ...rest
}: AvatarProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const [imgError, setImgError] = useState(false);
  return (
    <div className={cn("s-avatar", `s-avatar-${st}`, `theme-${th}`, `avatar-${size}`, className)} {...rest}>
      {src && !imgError ? (
        <img src={src} alt={alt} onError={() => setImgError(true)} />
      ) : (
        <span className="avatar-fallback">{fallback}</span>
      )}
    </div>
  );
}