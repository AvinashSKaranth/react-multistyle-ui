# Drawer

Side panel that slides in from left or right.

```tsx
interface DrawerProps {
  style?: string;
  theme?: string;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  side?: "left" | "right";
  title?: string;
  children?: ReactNode;
}
```

### Usage

```tsx
<Drawer open={isOpen} onOpenChange={setIsOpen} side="right" title="Settings">
  <Row><Toggle label="Dark mode" /></Row>
  <Row><Toggle label="Notifications" /></Row>
</Drawer>
```
