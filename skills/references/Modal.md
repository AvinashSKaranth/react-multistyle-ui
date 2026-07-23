# Modal

Dialog overlay with backdrop, close button, and animated presence.

```tsx
interface ModalProps {
  style?: string;
  theme?: string;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  onClose?: () => void;
  title?: string;
  size?: "small" | "medium" | "large" | "full";
  children?: ReactNode;
}
```

### Usage

```tsx
<Modal open={isOpen} onOpenChange={setIsOpen} title="Confirm" size="small">
  <p>Are you sure?</p>
  <Row gap="8px">
    <Button preset="error" onClick={() => setIsOpen(false)}>Delete</Button>
    <Button variant="outlined" onClick={() => setIsOpen(false)}>Cancel</Button>
  </Row>
</Modal>
```

Uses `Portal` for body-level rendering and `Presence` for fade + scale transitions.
