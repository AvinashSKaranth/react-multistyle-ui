# Tabs

Tab switcher — renders a tab bar, active tab controlled by `active` / `onActiveChange`.

```tsx
interface TabItem { id: string; label: string; }

interface TabsProps {
  style?: string;
  theme?: string;
  tabs?: TabItem[];
  active?: string;
  onActiveChange?: (id: string) => void;
}
```

### Usage

```tsx
<Tabs
  tabs={[
    { id: "home", label: "Home" },
    { id: "profile", label: "Profile" },
  ]}
  active={activeTab}
  onActiveChange={setActiveTab}
/>
```
