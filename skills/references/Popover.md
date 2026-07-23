# Popover

Click-triggered popover with positioned content.

```tsx
interface PopoverProps {
  style?: string;
  theme?: string;
  content?: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  children: ReactNode;
}
```

### Usage

```tsx
<Popover content={<div>Popover body content here</div>} position="bottom">
  <Button>Trigger</Button>
</Popover>
```
