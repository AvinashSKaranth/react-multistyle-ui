# CodeEditor

Syntax-highlighted code editor (PrismJS-based).

```tsx
interface CodeEditorProps {
  style?: string;
  theme?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  language?: string;     // e.g. "javascript", "python", "html"
}
```

### Usage

```tsx
<CodeEditor
  value={code}
  onValueChange={setCode}
  language="javascript"
  style="carbon"
/>
```
