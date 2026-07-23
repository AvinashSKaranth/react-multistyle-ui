# Button

Themable button with variants, sizes, and optional icon.

```tsx
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  style?: string;        // design style override
  theme?: string;        // theme override
  variant?: "filled" | "outlined" | "text" | "tonal";
  preset?: string;       // "primary" | "secondary" | "info" | "success" | "warning" | "error"
  size?: "sm" | "md" | "lg";
  icon?: string;         // Material Symbols icon name
}
```

### Usage

```tsx
<Button variant="filled" preset="primary" size="md" icon="star">Click me</Button>
<Button variant="outlined" preset="secondary" style="brutalist" theme="midnight">Cancel</Button>
<Button variant="text" preset="error" size="sm">Delete</Button>
<Button icon="add" variant="tonal" />
```

### Styling

Applies classes: `s-button`, `s-button-{style}`, `theme-{theme}`, `btn-{variant}`, `btn-{preset}`, `btn-{size}`.
Icon rendered as `<span class="s-button-icon material-symbols-outlined">{icon}</span>`.
