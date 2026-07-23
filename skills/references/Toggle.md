# Toggle

Switch toggle on/off control.

```tsx
interface ToggleProps {
  style?: string;
  theme?: string;
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
  label?: string;
  disabled?: boolean;
}
```

### Usage

```tsx
<Toggle checked={notifs} onCheckedChange={setNotifs} label="Enable notifications" />
<Toggle checked={true} disabled />
```
