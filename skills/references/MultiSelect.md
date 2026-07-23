# MultiSelect

Multi-value chip selector. Selected values shown as removable chips.

```tsx
interface SelectOption { value: string; label: string; }

interface MultiSelectProps {
  style?: string;
  theme?: string;
  values?: string[];
  onValuesChange?: (v: string[]) => void;
  options?: SelectOption[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}
```

### Usage

```tsx
<MultiSelect
  label="Hobbies"
  values={selected}
  onValuesChange={setSelected}
  options={[
    { value: "read", label: "Reading" },
    { value: "code", label: "Coding" },
  ]}
/>
```
