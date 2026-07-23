# TextEditor

Rich text editor (contenteditable-based) with toolbar.

```tsx
interface TextEditorProps {
  style?: string;
  theme?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  toolbar?: boolean;
}
```

### Usage

```tsx
<TextEditor
  value={content}
  onValueChange={setContent}
  toolbar
/>
```
