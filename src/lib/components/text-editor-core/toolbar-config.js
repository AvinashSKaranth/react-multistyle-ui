/**
 * Default toolbar configuration for the custom editor.
 * Each group is an array of action items rendered in the toolbar.
 */

export const FONT_FAMILIES = [
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Tahoma", value: "Tahoma, sans-serif" },
  { label: "Times New Roman", value: '"Times New Roman", serif' },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Courier New", value: '"Courier New", monospace' },
  { label: "Monospace", value: "monospace" },
];

export const FONT_SIZES = [
  { label: "8", value: "8px" },
  { label: "9", value: "9px" },
  { label: "10", value: "10px" },
  { label: "11", value: "11px" },
  { label: "12", value: "12px" },
  { label: "14", value: "14px" },
  { label: "16", value: "16px" },
  { label: "18", value: "18px" },
  { label: "24", value: "24px" },
  { label: "32", value: "32px" },
  { label: "48", value: "48px" },
  { label: "64", value: "64px" },
];

export const HEADING_OPTIONS = [
  { label: "Paragraph", value: "p" },
  { label: "Heading 1", value: "h1" },
  { label: "Heading 2", value: "h2" },
  { label: "Heading 3", value: "h3" },
  { label: "Heading 4", value: "h4" },
  { label: "Heading 5", value: "h5" },
  { label: "Heading 6", value: "h6" },
  { label: "Blockquote", value: "blockquote" },
  { label: "Preformatted", value: "pre" },
];

export const LINE_HEIGHTS = [
  { label: "1", value: "1" },
  { label: "1.15", value: "1.15" },
  { label: "1.5", value: "1.5" },
  { label: "2", value: "2" },
  { label: "2.5", value: "2.5" },
  { label: "3", value: "3" },
];

export const LIST_TYPES = {
  unordered: [
    { label: "Disc", value: "disc" },
    { label: "Circle", value: "circle" },
    { label: "Square", value: "square" },
  ],
  ordered: [
    { label: "1, 2, 3", value: "decimal" },
    { label: "A, B, C", value: "upper-alpha" },
    { label: "a, b, c", value: "lower-alpha" },
    { label: "I, II, III", value: "upper-roman" },
    { label: "i, ii, iii", value: "lower-roman" },
  ],
};

/**
 * Toolbar action definitions. Each action has:
 * - id: unique identifier
 * - type: 'button' | 'select' | 'color' | 'separator'
 * - icon / label: UI representation
 * - command: execCommand name or custom handler key
 * - active: format key for selection engine
 */
export const DEFAULT_TOOLBAR = [
  // History
  [
    { id: "undo", type: "button", label: "↶", title: "Undo", command: "undo", icon: "undo" },
    { id: "redo", type: "button", label: "↷", title: "Redo", command: "redo", icon: "redo" },
  ],
  // Text formatting
  [
    { id: "bold", type: "button", label: "B", title: "Bold (Ctrl+B)", command: "bold", active: "bold" },
    { id: "italic", type: "button", label: "I", title: "Italic (Ctrl+I)", command: "italic", active: "italic" },
    { id: "underline", type: "button", label: "U", title: "Underline (Ctrl+U)", command: "underline", active: "underline" },
    { id: "strikeThrough", type: "button", label: "S", title: "Strikethrough (Ctrl+Shift+S)", command: "strikeThrough", active: "strikeThrough" },
    { id: "removeFormat", type: "button", label: "✕", title: "Clear formatting", command: "removeFormat" },
    { id: "superscript", type: "button", label: "x²", title: "Superscript", command: "superscript", active: "superscript" },
    { id: "subscript", type: "button", label: "x₂", title: "Subscript", command: "subscript", active: "subscript" },
  ],
  // Font controls
  [
    { id: "fontName", type: "select", title: "Font family", command: "fontName", options: FONT_FAMILIES },
    { id: "fontSize", type: "select", title: "Font size", command: "fontSize", options: FONT_SIZES },
    { id: "foreColor", type: "color", title: "Text color", command: "foreColor", label: "🎨" },
    { id: "hiliteColor", type: "color", title: "Highlight", command: "hiliteColor", label: "🖍️" },
  ],
  // Paragraph formatting
  [
    { id: "formatBlock", type: "select", title: "Paragraph style", command: "formatBlock", options: HEADING_OPTIONS },
    { id: "lineHeight", type: "select", title: "Line height", command: "lineHeight", options: LINE_HEIGHTS },
    { id: "justifyLeft", type: "button", label: "⇤", title: "Align left", command: "justifyLeft", active: "justifyLeft" },
    { id: "justifyCenter", type: "button", label: "⇔", title: "Align center", command: "justifyCenter", active: "justifyCenter" },
    { id: "justifyRight", type: "button", label: "⇥", title: "Align right", command: "justifyRight", active: "justifyRight" },
    { id: "justifyFull", type: "button", label: "↔", title: "Justify", command: "justifyFull", active: "justifyFull" },
    { id: "indent", type: "button", label: "→", title: "Indent", command: "indent" },
    { id: "outdent", type: "button", label: "←", title: "Outdent", command: "outdent" },
  ],
  // Lists
  [
    { id: "insertUnorderedList", type: "button", label: "•", title: "Bulleted list", command: "insertUnorderedList", active: "insertUnorderedList" },
    { id: "insertOrderedList", type: "button", label: "1.", title: "Numbered list", command: "insertOrderedList", active: "insertOrderedList" },
  ],
  // Insert
  [
    { id: "insertLink", type: "button", label: "🔗", title: "Insert link", command: "createLink" },
    { id: "insertImage", type: "button", label: "🖼️", title: "Insert image", command: "insertImage" },
    { id: "insertVideo", type: "button", label: "🎥", title: "Insert video", command: "insertVideo" },
    { id: "insertTable", type: "button", label: "📋", title: "Insert table", command: "insertTable" },
    { id: "insertHorizontalRule", type: "button", label: "—", title: "Horizontal rule", command: "insertHorizontalRule" },
  ],
  // View
  [
    { id: "toggleCodeView", type: "button", label: "</>", title: "Toggle code view", command: "toggleCodeView" },
  ],
];

/**
 * Floating (air-mode) toolbar actions shown on text selection.
 */
export const FLOATING_TOOLBAR = [
  { id: "bold", type: "button", label: "B", title: "Bold", command: "bold", active: "bold" },
  { id: "italic", type: "button", label: "I", title: "Italic", command: "italic", active: "italic" },
  { id: "underline", type: "button", label: "U", title: "Underline", command: "underline", active: "underline" },
  { id: "createLink", type: "button", label: "🔗", title: "Link", command: "createLink" },
  { id: "foreColor", type: "color", title: "Color", command: "foreColor", label: "🎨" },
];
