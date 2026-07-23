import "./codeeditor-styles.css";
import { useDefaults } from "../config";
import { cn } from "../utils/cn";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";
import { useState } from "react";
import type { CSSProperties, TextareaHTMLAttributes } from "react";

if (!Prism.languages.svelte) {
  Prism.languages.svelte = Prism.languages.markup;
}

export interface CodeEditorProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "style" | "value"> {
  style?: string;
  theme?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  language?: string;
  editable?: boolean;
  label?: string;
  rows?: number;
}

const LANG_LABELS: Record<string, string> = {
  javascript: "JS",
  typescript: "TS",
  markup: "HTML",
  css: "CSS",
  json: "JSON",
  svelte: "Svelte",
  bash: "Bash",
  python: "Python",
};

function escapeHtml(s: string) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function highlight(code: string, lang: string) {
  const grammar = (Prism.languages as Record<string, unknown>)[lang];
  if (!grammar) return escapeHtml(code);
  try {
    return Prism.highlight(code, grammar as never, lang);
  } catch {
    return escapeHtml(code);
  }
}

export function CodeEditor({
  style,
  theme,
  value = "",
  onValueChange,
  language = "javascript",
  editable = true,
  label = "",
  rows = 10,
  className = "",
  ...rest
}: CodeEditorProps) {
  const d = useDefaults();
  const st = style ?? d.style;
  const th = theme ?? d.theme;
  const highlighted = highlight(value, language);
  const langLabel = LANG_LABELS[language] ?? String(language).toUpperCase();
  const [copyStatus, setCopyStatus] = useState("");

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
    setTimeout(() => setCopyStatus(""), 1800);
  }
  const copyLabel = copyStatus === "copied" ? "Copied!" : copyStatus === "failed" ? "Failed" : "Copy";

  return (
    <div className={cn("s-codeeditor-wrapper", `s-codeeditor-${st}`, `theme-${th}`, className)}>
      {label ? <label className="s-codeeditor-label">{label}</label> : null}
      <div className="s-codeeditor-toolbar">
        <span className="s-codeeditor-lang">{langLabel}</span>
        <button type="button" className={cn("s-codeeditor-copy-btn", copyStatus)} onClick={copyCode} aria-label="Copy code">
          {copyLabel}
        </button>
      </div>
      <div className="s-codeeditor-code" style={{ ["--codeeditor-rows" as string]: rows } as CSSProperties}>
        <pre className="s-codeeditor-pre" aria-hidden="true">
          <code dangerouslySetInnerHTML={{ __html: highlighted + "\n" }} />
        </pre>
        {editable ? (
          <textarea
            className="s-codeeditor-textarea"
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            spellCheck={false}
            aria-label={label || "code editor"}
            {...rest}
          />
        ) : null}
      </div>
    </div>
  );
}