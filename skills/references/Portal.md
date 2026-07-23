# Portal

Renders children at document body via React portal.

```tsx
interface PortalProps {
  children: ReactNode;
}
```

### Usage

```tsx
<Portal>
  <div className="fixed-overlay">
    Renders at document.body
  </div>
</Portal>
```

Used internally by Modal, Drawer, Select dropdowns, Tooltip, Popover, DropdownMenu.
