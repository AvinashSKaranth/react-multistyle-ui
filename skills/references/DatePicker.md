# DatePicker

Calendar date picker.

```tsx
interface DatePickerProps {
  style?: string;
  theme?: string;
  value?: string;           // "YYYY-MM-DD"
  onValueChange?: (v: string) => void;
  label?: string;
  min?: string;
  max?: string;
}
```

### Usage

```tsx
<DatePicker
  label="Start date"
  value={date}
  onValueChange={setDate}
  min="2024-01-01"
/>
```
