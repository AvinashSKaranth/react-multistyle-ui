# Toast

Notification toast with preset color.

```tsx
interface ToastProps {
  style?: string;
  theme?: string;
  message?: string;
  preset?: "info" | "success" | "warning" | "error";
  duration?: number;    // auto-dismiss ms
  dismissible?: boolean;
}
```

### Usage

```tsx
<Toast message="File saved!" preset="success" duration={3000} />
<Toast message="Connection lost" preset="error" dismissible />
```
