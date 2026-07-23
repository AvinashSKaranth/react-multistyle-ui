import "./stepper-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import { useEffect, useRef, useState, Fragment } from "react";
import type { HTMLAttributes } from "react";

export interface StepItem {
  label: string;
}

export interface StepperProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  steps?: StepItem[];
  current?: number;
}

export function Stepper({ style, theme, steps = [], current = 0, className = "", ...rest }: StepperProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const elRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  function update() {
    const el = elRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 1);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }
  function scrollBy1(dir: number) {
    const el = elRef.current;
    if (!el) return;
    const stepEls = el.querySelectorAll<HTMLElement>(".s-stepper-step");
    let amount = el.clientWidth;
    if (stepEls.length >= 2) {
      const pitch = stepEls[1].offsetLeft - stepEls[0].offsetLeft;
      if (pitch > 0) amount = pitch;
    }
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    update();
    const onScroll = () => update();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [steps, current]);

  return (
    <div className={cn("s-stepper-wrap", className)}>
      <div className={`s-stepper s-stepper-${st} theme-${th}`} ref={elRef} {...rest}>
        {steps.map((step, i) => (
          <Fragment key={i}>
            <div className={`s-stepper-step ${i < current ? "completed" : ""} ${i === current ? "active" : ""}`}>
              <div className="s-stepper-circle">{i + 1}</div>
              <span className="s-stepper-label">{step.label}</span>
            </div>
            {i < steps.length - 1 ? (
              <div className={`s-stepper-connector ${i < current - 1 ? "completed" : ""}`} />
            ) : null}
          </Fragment>
        ))}
      </div>
      {canLeft ? (
        <button type="button" className="s-stepper-arrow left" aria-label="Scroll steps backward" onClick={() => scrollBy1(-1)}>
          ‹
        </button>
      ) : null}
      {canRight ? (
        <button type="button" className="s-stepper-arrow right" aria-label="Scroll steps forward" onClick={() => scrollBy1(1)}>
          ›
        </button>
      ) : null}
    </div>
  );
}