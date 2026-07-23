# Carousel

Sliding carousel for images/content items.

```tsx
interface CarouselItem { src?: string; content?: ReactNode; }

interface CarouselProps {
  style?: string;
  theme?: string;
  items?: CarouselItem[];
  autoplay?: boolean;
  interval?: number;   // ms, default 5000
}
```

### Usage

```tsx
<Carousel
  items={[
    { src: "slide1.jpg", content: "First" },
    { src: "slide2.jpg", content: "Second" },
  ]}
  autoplay
  interval={3000}
/>
```
