import "./carousel-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import { useEffect, useState } from "react";
import type { HTMLAttributes } from "react";

export interface CarouselSlide {
  image?: string;
  alt?: string;
  caption?: string;
  content?: string;
}

export interface CarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  slides?: CarouselSlide[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showIndicators?: boolean;
}

export function Carousel({
  style,
  theme,
  slides = [],
  autoPlay = true,
  interval = 4000,
  showArrows = true,
  showIndicators = true,
  className = "",
  ...rest
}: CarouselProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovering, setHovering] = useState(false);
  const total = slides.length;

  function goTo(index: number) {
    setCurrent((cur) => {
      const next = ((index % total) + total) % total;
      setDirection(next > cur ? 1 : -1);
      return next;
    });
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  useEffect(() => {
    if (!autoPlay || total <= 1 || isHovering) return;
    const id = setInterval(() => setCurrent((c) => { const n = (c + 1) % total; setDirection(1); return n; }), interval);
    return () => clearInterval(id);
  }, [autoPlay, total, isHovering, interval]);

  return (
    <div
      className={cn("s-carousel", `s-carousel-${st}`, `theme-${th}`, className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image carousel"
      {...rest}
    >
      <div className="s-carousel-viewport">
        {slides.length > 0 ? (
          slides.map((slide, i) =>
            i === current ? (
              <div
                key={i}
                className="s-carousel-slide t-slide-enter"
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${i + 1} of ${total}`}
              >
                {slide.image ? <img className="s-carousel-image" src={slide.image} alt={slide.alt || ""} draggable={false} /> : null}
                {slide.caption ? <div className="s-carousel-caption">{slide.caption}</div> : null}
                {slide.content ? <div className="s-carousel-content">{slide.content}</div> : null}
              </div>
            ) : null
          )
        ) : (
          <div className="s-carousel-empty">No slides</div>
        )}
      </div>
      {showArrows && total > 1 ? (
        <>
          <button className="s-carousel-arrow s-carousel-prev" onClick={prev} aria-label="Previous slide">❮</button>
          <button className="s-carousel-arrow s-carousel-next" onClick={next} aria-label="Next slide">❯</button>
        </>
      ) : null}
      {showIndicators && total > 1 ? (
        <div className="s-carousel-indicators" role="tablist">
          {slides.map((_, i) => (
            <button key={i} className={`s-carousel-dot ${i === current ? "active" : ""}`} onClick={() => goTo(i)} role="tab" aria-selected={i === current} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
      ) : null}
    </div>
  );
}