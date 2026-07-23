# DropdownMenu

Dropdown action menu with optional dividers and disabled items.

```tsx
interface DropdownItem { label?: string; divider?: boolean; icon?: string; disabled?: boolean; }

interface DropdownMenuProps {
  style?: string;
  theme?: string;
  items?: DropdownItem[];
}
```

### Usage

```tsx
<DropdownMenu
  items={[
    { label: "Edit", icon: "edit" },
    { label: "Delete", icon: "delete", disabled: true },
    { divider: true },
    { label: "Share", icon: "share" },
  ]}
/>
```
