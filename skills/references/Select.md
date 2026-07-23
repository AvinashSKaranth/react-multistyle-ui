# Select

Custom dropdown with floating label support. Renders a styled trigger that opens a portal-based dropdown.

```tsx
interface SelectOption { value: string; label: string; }

interface SelectProps {
  style?: string;
  theme?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  options?: SelectOption[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}
```

### Usage

```tsx
<Select
  label="Country"
  value={country}
  onValueChange={setCountry}
  options={[
    { value: "us", label: "United States" },
    { value: "in", label: "India" },
  ]}
/>
<Select options={opts} style="brutalist" theme="storm" />
```
