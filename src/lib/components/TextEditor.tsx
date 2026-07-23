import "./texteditor-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import { useEffect, useRef, useState } from "react";
import { TextEditorCore } from "./text-editor-core/index.js";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import type { HTMLAttributes } from "react";

export interface TextEditorProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: string;
  theme?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  toolbar?: unknown;
}

interface DialogState {
  open: boolean;
  type: string | null;
  data: Record<string, string>;
}

export function TextEditor({
  style,
  theme,
  value = "",
  onValueChange,
  label = "",
  placeholder = "",
  disabled = false,
  rows = 8,
  toolbar,
  className = "",
  ...rest
}: TextEditorProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<InstanceType<typeof TextEditorCore> | null>(null);
  const [dialog, setDialog] = useState<DialogState>({ open: false, type: null, data: {} });

  // Mount the vanilla editor core once.
  useEffect(() => {
    if (!wrapperRef.current) return;
    // StrictMode double-invokes effects: destroy() clears the toolbar's
    // innerHTML but leaves the body/statusbar DOM it appended, so a remount
    // would stack a second editor (the "two text boxes" bug). Clear the
    // container first so every mount starts from an empty slate.
    wrapperRef.current.innerHTML = "";
    const core = new TextEditorCore({
      element: wrapperRef.current,
      placeholder,
      readOnly: disabled,
      toolbar,
      onChange: (html: string) => onValueChange?.(html),
      onAction: (action: { type: string; dialog?: string; data?: Record<string, string> }) => {
        if (action.type === "dialog") {
          setDialog({ open: true, type: action.dialog ?? null, data: { ...(action.data || {}) } });
        }
      },
    } as never);
    core.setHTML(value ?? "");
    coreRef.current = core;
    return () => {
      core.destroy();
      if (wrapperRef.current) wrapperRef.current.innerHTML = "";
      coreRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value -> core (skip while code-view, skip if equal).
  useEffect(() => {
    const core = coreRef.current;
    if (!core) return;
    if (core.isCodeView()) return;
    const html = value ?? "";
    if (core.getHTML() !== html) core.setHTML(html);
  }, [value]);

  // Sync disabled -> readOnly.
  useEffect(() => {
    coreRef.current?.setReadOnly(disabled);
  }, [disabled]);

  function closeDialog() {
    setDialog({ open: false, type: null, data: {} });
  }
  function setField(key: string, v: string) {
    setDialog((s) => ({ ...s, data: { ...s.data, [key]: v } }));
  }
  function applyLink() {
    const { text, href, title, target } = dialog.data;
    coreRef.current?.insertLink({ text, href, title, target } as never);
    closeDialog();
  }
  function applyImage() {
    const { src, alt, width, align, caption } = dialog.data;
    coreRef.current?.insertImage({ src, alt, width, align, caption } as never);
    closeDialog();
  }
  function applyVideo() {
    const { src, width, height } = dialog.data;
    coreRef.current?.insertVideo({ src, width, height } as never);
    closeDialog();
  }
  function applyTable() {
    const { rows: r, cols } = dialog.data;
    coreRef.current?.insertTable({ rows: Number(r), cols: Number(cols) } as never);
    closeDialog();
  }
  function onImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setDialog((s) => ({ ...s, data: { ...s.data, src: String(ev.target?.result || "") } }));
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <div className={cn("s-texteditor-wrapper", `s-texteditor-${st}`, `theme-${th}`, className)} {...rest}>
        {label ? <label className="s-texteditor-label">{label}</label> : null}
        <div
          ref={wrapperRef}
          className="s-texteditor-root"
          data-placeholder={placeholder}
          style={{ ["--texteditor-rows" as string]: rows }}
          aria-disabled={disabled}
        />
      </div>

      <Modal
        open={dialog.open}
        onOpenChange={(o) => !o && closeDialog()}
        style={st}
        theme={th}
        title={dialog.type === "link" ? "Insert link" : dialog.type === "image" ? "Insert image" : dialog.type === "video" ? "Insert video" : dialog.type === "table" ? "Insert table" : ""}
        size="small"
      >
        {dialog.type === "link" ? (
          <div className="s-texteditor-dialog">
            <Input label="Text" value={dialog.data.text || ""} onValueChange={(v) => setField("text", v)} />
            <Input label="URL" value={dialog.data.href || ""} onValueChange={(v) => setField("href", v)} />
            <Input label="Title" value={dialog.data.title || ""} onValueChange={(v) => setField("title", v)} />
            <Input label="Target" value={dialog.data.target || ""} onValueChange={(v) => setField("target", v)} />
            <div className="s-texteditor-dialog-actions">
              <Button style={st} theme={th} onClick={applyLink}>Apply</Button>
              <Button style={st} theme={th} variant="outlined" onClick={closeDialog}>Cancel</Button>
            </div>
          </div>
        ) : null}
        {dialog.type === "image" ? (
          <div className="s-texteditor-dialog">
            <Input label="Image URL" value={dialog.data.src || ""} onValueChange={(v) => setField("src", v)} />
            <div className="s-texteditor-dialog-row">
              <input type="file" accept="image/*" onChange={onImageFileChange} />
            </div>
            <Input label="Alt text" value={dialog.data.alt || ""} onValueChange={(v) => setField("alt", v)} />
            <Input label="Width (e.g. 200px)" value={dialog.data.width || ""} onValueChange={(v) => setField("width", v)} />
            <Input label="Caption" value={dialog.data.caption || ""} onValueChange={(v) => setField("caption", v)} />
            <div className="s-texteditor-dialog-actions">
              <Button style={st} theme={th} onClick={applyImage}>Insert</Button>
              <Button style={st} theme={th} variant="outlined" onClick={closeDialog}>Cancel</Button>
            </div>
          </div>
        ) : null}
        {dialog.type === "video" ? (
          <div className="s-texteditor-dialog">
            <Textarea label="YouTube, Vimeo, or direct URL" rows={3} value={dialog.data.src || ""} onValueChange={(v) => setField("src", v)} />
            <Input label="Width" value={dialog.data.width || ""} onValueChange={(v) => setField("width", v)} />
            <Input label="Height" value={dialog.data.height || ""} onValueChange={(v) => setField("height", v)} />
            <div className="s-texteditor-dialog-actions">
              <Button style={st} theme={th} onClick={applyVideo}>Insert</Button>
              <Button style={st} theme={th} variant="outlined" onClick={closeDialog}>Cancel</Button>
            </div>
          </div>
        ) : null}
        {dialog.type === "table" ? (
          <div className="s-texteditor-dialog">
            <Input label="Rows" type="number" value={dialog.data.rows || ""} onValueChange={(v) => setField("rows", v)} />
            <Input label="Columns" type="number" value={dialog.data.cols || ""} onValueChange={(v) => setField("cols", v)} />
            <div className="s-texteditor-dialog-actions">
              <Button style={st} theme={th} onClick={applyTable}>Insert</Button>
              <Button style={st} theme={th} variant="outlined" onClick={closeDialog}>Cancel</Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}