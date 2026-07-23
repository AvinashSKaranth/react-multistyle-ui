# FileUpload

Drag-and-drop file upload area.

```tsx
interface FileUploadProps {
  style?: string;
  theme?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onFilesChange?: (files: File[]) => void;
  label?: string;
}
```

### Usage

```tsx
<FileUpload
  accept="image/*"
  multiple
  maxSize={5 * 1024 * 1024}
  onFilesChange={setFiles}
  label="Upload images"
/>
```
