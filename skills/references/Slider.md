# Slider

Range slider with label.

```tsx
interface SliderProps {
  style?: string;
  theme?: string;
  value?: number;
  onValueChange?: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  disabled?: boolean;
}
```

### Usage

```tsx
<Slider label="Volume" value={vol} onValueChange={setVol} min={0} max={100} />
<Slider value={50} min={0} max={200} step={5} style="carbon" />
```
