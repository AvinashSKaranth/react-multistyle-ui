# Rating

Star rating component.

```tsx
interface RatingProps {
  style?: string;
  theme?: string;
  value?: number;
  onValueChange?: (v: number) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
}
```

### Usage

```tsx
<Rating value={3} onValueChange={setRating} max={5} />
<Rating value={4} max={5} readonly />
<Rating value={2} max={10} size="sm" />
```
