import "./fileupload-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import { useState } from "react";
import type { HTMLAttributes } from "react";

export interface FileUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  onFilesChange?: (files: File[]) => void;
}

export function FileUpload({
  style,
  theme,
  accept = "",
  multiple = false,
  disabled = false,
  label = "Drop files or click to upload",
  onFilesChange,
  className = "",
  ...rest
}: FileUploadProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);

  function emit(f: File[]) {
    setFiles(f);
    onFilesChange?.(f);
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    emit(Array.from(e.target.files || []));
  }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    emit(Array.from(e.dataTransfer.files));
  }

  return (
    <div
      className={cn("s-fileupload", `s-fileupload-${st}`, `theme-${th}`, dragging && "dragging", disabled && "disabled", className)}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      {...rest}
    >
      <input type="file" accept={accept} multiple={multiple} disabled={disabled} onChange={handleChange} className="s-fileupload-input" />
      <div className="s-fileupload-content">
        <svg className="s-fileupload-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span className="s-fileupload-label">{label}</span>
        {files.length ? <span className="s-fileupload-hint">{files.length} file{files.length > 1 ? "s" : ""} selected</span> : null}
      </div>
    </div>
  );
}