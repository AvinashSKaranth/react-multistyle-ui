# Input

Text input with floating label (material/material3) or above label (other styles), supports icons.

```tsx
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "value"> {
  style?: string;
  theme?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  label?: string;
  iconStart?: string;    // leading icon name
  iconEnd?: string;      // trailing icon name
}
```

### Usage

```tsx
<Input label="Username" value={name} onValueChange={setName} />
<Input label="Search" iconStart="search" placeholder="Type..." />
<Input label="Password" type="password" iconEnd="visibility" />
<Input style="fluent" theme="slate" label="With override" />
```

Labels float in `material` / `material3` styles; sit above in all others.
