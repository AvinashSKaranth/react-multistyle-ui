# Chip

Tag/chip with optional remove button and icon.

```tsx
interface ChipProps {
  style?: string;
  theme?: string;
  children?: ReactNode;
  variant?: "filled" | "outlined";
  onRemove?: () => void;
  icon?: string;
}
```

### Usage

```tsx
<Chip>React</Chip>
<Chip variant="outlined" onRemove={() => {}}>TypeScript</Chip>
<Chip icon="star" variant="filled" theme="candy">Featured</Chip>
```
