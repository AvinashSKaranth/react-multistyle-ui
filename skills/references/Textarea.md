# Textarea

Multi-line text input with label.

```tsx
interface TextareaProps {
  style?: string;
  theme?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
}
```

### Usage

```tsx
<Textarea label="Bio" value={bio} onValueChange={setBio} rows={4} />
<Textarea label="Description" placeholder="Tell us..." style="fluent" />
```
