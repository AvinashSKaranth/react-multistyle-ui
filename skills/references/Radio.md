# Radio

Radio button with label.

```tsx
interface RadioProps {
  style?: string;
  theme?: string;
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
  label?: string;
  value?: string;
  name?: string;
}
```

### Usage

```tsx
<Radio checked={plan === "a"} onCheckedChange={() => setPlan("a")} label="Plan A" value="a" />
<Radio checked={plan === "b"} onCheckedChange={() => setPlan("b")} label="Plan B" value="b" />
```
