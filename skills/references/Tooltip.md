# Tooltip

Hover tooltip that wraps a trigger element.

```tsx
interface TooltipProps {
  style?: string;
  theme?: string;
  text: string;
  position?: "top" | "bottom" | "left" | "right";
  children: ReactNode;
}
```

### Usage

```tsx
<Tooltip text="Save file" position="top">
  <IconButton icon="save" ariaLabel="Save" />
</Tooltip>
<Tooltip text="More info" position="right">
  <span>ℹ️</span>
</Tooltip>
```
