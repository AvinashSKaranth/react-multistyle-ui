# Alert

Dismissible alert banner with preset color and icon.

```tsx
interface AlertProps {
  style?: string;
  theme?: string;
  preset?: "info" | "success" | "warning" | "error";
  title?: string;
  icon?: string;
  dismissible?: boolean;
  children?: ReactNode;
}
```

### Usage

```tsx
<Alert preset="success" title="Done!" dismissible>
  Your changes were saved.
</Alert>
<Alert preset="error" title="Error">
  Something went wrong.
</Alert>
<Alert preset="warning" style="brutalist" theme="storm">
  Warning message.
</Alert>
```

Icons: single-char emoji fallback; multi-char treated as Material Symbols name.
