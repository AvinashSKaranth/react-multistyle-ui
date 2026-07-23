# ProgressBar

Determinate progress bar (0–100).

```tsx
interface ProgressBarProps {
  style?: string;
  theme?: string;
  value?: number;       // 0-100
  preset?: string;
}
```

### Usage

```tsx
<ProgressBar value={60} />
<ProgressBar value={25} preset="error" />
<ProgressBar value={80} style="neon" theme="midnight" />
```
