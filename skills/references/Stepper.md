# Stepper

Step progress indicator (horizontal or vertical).

```tsx
interface Step { label: string; }

interface StepperProps {
  style?: string;
  theme?: string;
  steps?: Step[];
  current?: number;         // 0-indexed step
  orientation?: "horizontal" | "vertical";
}
```

### Usage

```tsx
<Stepper
  steps={[{ label: "Cart" }, { label: "Shipping" }, { label: "Payment" }]}
  current={1}
/>
<Stepper steps={steps} current={0} orientation="vertical" />
```
