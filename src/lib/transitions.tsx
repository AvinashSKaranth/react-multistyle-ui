import { forwardRef, useEffect, useRef, useState } from "react";
import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "./utils/cn";

/**
 * Lightweight enter/exit presence helper replacing Svelte's `transition:*`
 * directives (which are JS-injected by the Svelte compiler). Mounts children
 * when `show` is true; on `show`->false, swaps to the `exit` class and unmounts
 * after `duration` ms. The actual motion is CSS keyframes (see app.css
 * `.t-fade-*`, `.t-scale-*`, `.t-fly-*`).
 */
export interface PresenceProps {
  show: boolean;
  enter?: string;
  exit?: string;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
  children?: ReactNode;
  role?: string;
  [key: string]: any;
}

export const Presence = forwardRef<HTMLElement, PresenceProps>(function Presence(
  { show, enter, exit, duration = 200, className, style, as: Tag = "div", children, ...rest },
  ref
) {
  const [mounted, setMounted] = useState(show);
  const [phase, setPhase] = useState<"enter" | "exit">(show ? "enter" : "exit");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (show) {
      if (timer.current) clearTimeout(timer.current);
      setMounted(true);
      setPhase("enter");
    } else if (mounted) {
      setPhase("exit");
      timer.current = setTimeout(() => setMounted(false), duration);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, duration]);

  if (!mounted) return null;

  const Comp = Tag as ElementType;
  return (
    <Comp
      ref={ref as never}
      className={cn(className, phase === "enter" ? enter : exit)}
      style={style}
      {...rest}
    >
      {children}
    </Comp>
  );
});