# CommandPalette

⌘K command palette (WIP — experimental).

```tsx
interface Command { id: string; label: string; action: () => void; }

interface CommandPaletteProps {
  style?: string;
  theme?: string;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  commands?: Command[];
}
```

### Usage

```tsx
<CommandPalette
  open={isOpen}
  onOpenChange={setIsOpen}
  commands={[
    { id: "new-file", label: "New File", action: () => {} },
    { id: "save", label: "Save", action: () => {} },
  ]}
/>
```
