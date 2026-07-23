# IconButton

Icon-only button.

```tsx
interface IconButtonProps {
  style?: string;
  theme?: string;
  icon: string;
  ariaLabel: string;
  variant?: "filled" | "outlined" | "text" | "tonal";
  preset?: string;
  size?: "sm" | "md" | "lg";
}
```

### Usage

```tsx
<IconButton icon="search" ariaLabel="Search" />
<IconButton icon="delete" ariaLabel="Delete" variant="outlined" preset="error" />
<IconButton icon="close" ariaLabel="Close" size="sm" />
```
