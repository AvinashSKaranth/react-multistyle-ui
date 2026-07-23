# Checkbox

Toggle checkbox with optional label.

```tsx
interface CheckboxProps {
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
<Checkbox
  checked={agreed}
  onCheckedChange={setAgreed}
  label="I agree to terms"
/>
<Checkbox checked={true} label="Disabled" disabled />
```
