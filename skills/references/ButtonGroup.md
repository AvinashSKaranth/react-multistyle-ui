# ButtonGroup

Grouped button row. Single-selection.

```tsx
interface ButtonGroupItem { value: string; label: string; }

interface ButtonGroupProps {
  style?: string;
  theme?: string;
  items?: ButtonGroupItem[];
  value?: string;
  onValueChange?: (v: string) => void;
}
```

### Usage

```tsx
<ButtonGroup
  items={[
    { value: "grid", label: "Grid" },
    { value: "list", label: "List" },
  ]}
  value={view}
  onValueChange={setView}
/>
```
