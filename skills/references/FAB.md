# FAB

Floating action button.

```tsx
interface FABProps {
  style?: string;
  theme?: string;
  icon: string;
  label?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}
```

### Usage

```tsx
<FAB icon="add" label="New item" position="bottom-right" />
<FAB icon="chat" position="bottom-left" style="neon" theme="midnight" />
```
