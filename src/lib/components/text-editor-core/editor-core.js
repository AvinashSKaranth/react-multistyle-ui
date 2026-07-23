/**
 * TextEditorCore — a lightweight, framework-agnostic WYSIWYG editor.
 * Uses contenteditable and document.execCommand under the hood.
 */

import { createHistory } from "./history.js";
import { getSelectionState } from "./selection-engine.js";
import { sanitizeHTML, sanitizeURL, plainTextFromHTML } from "./sanitizer.js";
import {
  createElement,
  ensureParagraph,
  getWordCount,
  getTextLength,
  htmlToText,
  isInsideEditor,
  closest,
} from "./dom-utils.js";
import { DEFAULT_TOOLBAR } from "./toolbar-config.js";
import { formatHTML } from "./html-formatter.js";

const BLOCK_TAG_MAP = {
  p: "p",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  blockquote: "blockquote",
  pre: "pre",
};

export class TextEditorCore {
  constructor(options = {}) {
    this.container = options.element;
    if (!this.container) {
      throw new Error("TextEditorCore requires a container element");
    }

    this.onChange = options.onChange || (() => {});
    this.onSelectionChange = options.onSelectionChange || (() => {});
    this.onAction = options.onAction || (() => {});
    this.placeholder = options.placeholder || "";
    this.readOnly = options.readOnly || false;
    this.historyLimit = options.historyLimit || 100;

    this.toolbarConfig = options.toolbar || DEFAULT_TOOLBAR;
    this.value = "";
    this.history = createHistory(this.historyLimit);
    this.isComposing = false;
    this.lastHtml = "";
    this.focused = false;

    this._handlers = [];
    this._dialogState = { type: null, data: null };
    this._codeView = false;
    this._codeEl = null;
    this._lastCodeValue = "";
    this._savedSelection = null;

    this._buildDOM();
    this._attachEvents();
    this._renderToolbar();
    this._updatePlaceholder();
    this._updateStatus();
  }

  // ============ DOM construction ============
  _buildDOM() {
    this.container.classList.add("s-texteditor");
    if (this.readOnly) this.container.classList.add("readonly");

    this.toolbarEl = createElement("div", { className: "s-texteditor-toolbar" });
    this.bodyEl = createElement("div", { className: "s-texteditor-body" });
    this.editorEl = createElement("div", {
      className: "s-texteditor-content",
      contenteditable: this.readOnly ? "false" : "true",
      role: "textbox",
      "aria-multiline": "true",
    });
    this.statusEl = createElement("div", { className: "s-texteditor-statusbar" });

    this.bodyEl.appendChild(this.editorEl);
    this.container.appendChild(this.toolbarEl);
    this.container.appendChild(this.bodyEl);
    this.container.appendChild(this.statusEl);

    if (this.placeholder) {
      this.container.setAttribute("data-placeholder", this.placeholder);
    }
  }

  // ============ Event wiring ============
  _attachEvents() {
    this._listen(this.editorEl, "input", this._onInput.bind(this));
    this._listen(this.editorEl, "keydown", this._onKeyDown.bind(this));
    this._listen(this.editorEl, "focus", this._onFocus.bind(this));
    this._listen(this.editorEl, "blur", this._onBlur.bind(this));
    this._listen(this.editorEl, "compositionstart", this._onCompositionStart.bind(this));
    this._listen(this.editorEl, "compositionend", this._onCompositionEnd.bind(this));
    this._listen(this.editorEl, "paste", this._onPaste.bind(this));
    this._listen(this.editorEl, "drop", this._onDrop.bind(this));
    this._listen(document, "selectionchange", this._onSelectionChange.bind(this));
  }

  _listen(target, event, handler) {
    target.addEventListener(event, handler);
    this._handlers.push({ target, event, handler });
  }

  destroy() {
    for (const { target, event, handler } of this._handlers) {
      target.removeEventListener(event, handler);
    }
    this._handlers = [];
    if (this.toolbarEl) this.toolbarEl.innerHTML = "";
    if (this.container) {
      this.container.classList.remove("s-texteditor", "readonly");
    }
  }

  // ============ Input handling ============
  _onInput() {
    if (this.isComposing) return;
    this._emitChange();
  }

  _onCompositionStart() {
    this.isComposing = true;
  }

  _onCompositionEnd() {
    this.isComposing = false;
    this._emitChange();
  }

  _emitChange() {
    if (this._codeView) return; // Code view manages value directly.
    const html = this.getHTML();
    if (html === this.lastHtml) return;
    this.lastHtml = html;
    this.value = html;
    this.history.record(html);
    this._updatePlaceholder();
    this._updateStatus();
    this.onChange(html);
  }

  _onFocus() {
    this.focused = true;
    this.container.classList.add("focused");
  }

  _onBlur() {
    this.focused = false;
    this.container.classList.remove("focused");
  }

  _onSelectionChange() {
    const sel = document.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    if (!isInsideEditor(sel.anchorNode, this.editorEl)) return;

    const state = getSelectionState(this.editorEl);
    this._updateToolbarState(state);
    this._updateStatus(state);
    this.onSelectionChange(state);
  }

  // ============ Keyboard shortcuts ============
  _onKeyDown(e) {
    const key = e.key;
    const ctrl = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;

    if (ctrl) {
      switch (key.toLowerCase()) {
        case "b":
          e.preventDefault();
          this._applyFormat("bold");
          return;
        case "i":
          e.preventDefault();
          this._applyFormat("italic");
          return;
        case "u":
          e.preventDefault();
          this._applyFormat("underline");
          return;
        case "z":
          e.preventDefault();
          if (shift) this.redo();
          else this.undo();
          return;
        case "y":
          e.preventDefault();
          this.redo();
          return;
        case "k":
          e.preventDefault();
          this._openLinkDialog();
          return;
        case "a":
          setTimeout(() => this._onSelectionChange(), 0);
          return;
      }

      if (shift) {
        switch (key.toLowerCase()) {
          case "s":
            e.preventDefault();
            this._applyFormat("strikeThrough");
            return;
          case "l":
            e.preventDefault();
            this.exec("justifyLeft");
            this._emitChange();
            return;
          case "e":
            e.preventDefault();
            this.exec("justifyCenter");
            this._emitChange();
            return;
          case "r":
            e.preventDefault();
            this.exec("justifyRight");
            this._emitChange();
            return;
          case "j":
            e.preventDefault();
            this.exec("justifyFull");
            this._emitChange();
            return;
        }
      }
    }

    if (key === "Tab") {
      e.preventDefault();
      if (shift) this.exec("outdent");
      else this.exec("indent");
      this._emitChange();
      return;
    }
  }

  _applyFormat(command) {
    this.focus();
    this._recordBeforeMutation();
    this.exec(command);
    this._emitChange();
  }

  // ============ Paste / Drop ============
  _onPaste(e) {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");
    const toInsert = html ? sanitizeHTML(html) : (text ? text.replace(/\n/g, "<br>") : "");
    if (toInsert) {
      this._recordBeforeMutation();
      this.exec("insertHTML", toInsert);
      this._emitChange();
    }
  }

  _onDrop(e) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        this._insertImageFromFile(file);
      }
    }
  }

  _insertImageFromFile(file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      this._recordBeforeMutation();
      this.exec("insertHTML", `<img src="${ev.target.result}" alt="" style="max-width:100%;" />`);
      this._emitChange();
    };
    reader.readAsDataURL(file);
  }

  // ============ Toolbar rendering ============
  _renderToolbar() {
    this.toolbarEl.innerHTML = "";
    for (const group of this.toolbarConfig) {
      const groupEl = createElement("div", { className: "s-texteditor-toolbar-group" });
      for (const action of group) {
        if (action.type === "separator") {
          groupEl.appendChild(createElement("span", { className: "s-texteditor-toolbar-separator" }));
          continue;
        }
        const control = this._createControl(action);
        if (control) groupEl.appendChild(control);
      }
      this.toolbarEl.appendChild(groupEl);
    }
  }

  _createControl(action) {
    if (action.type === "button") {
      const btn = createElement("button", {
        className: `s-texteditor-btn s-texteditor-btn-${action.id}`,
        type: "button",
        title: action.title || action.label,
        "data-command": action.command,
        "data-active": action.active || "",
        ...(action.icon
          ? { innerHTML: `<span class="${action.icon}">${action.label}</span>` }
          : { textContent: action.label }),
        onclick: (e) => {
          e.preventDefault();
          this._handleCommand(action);
        },
      });
      return btn;
    }

    if (action.type === "select") {
      const select = createElement("select", {
        className: "s-texteditor-select",
        title: action.title,
        "data-command": action.command,
        onchange: (e) => {
          this._handleCommand(action, e.target.value);
          e.target.selectedIndex = 0;
        },
      });
      select.appendChild(createElement("option", { textContent: action.title, value: "" }));
      for (const opt of action.options) {
        select.appendChild(createElement("option", { textContent: opt.label, value: opt.value }));
      }
      return createElement("div", { className: "s-texteditor-select-wrap" }, [select]);
    }

    if (action.type === "color") {
      const label = createElement("label", {
        className: `s-texteditor-color-btn s-texteditor-color-${action.id}${action.label ? " s-texteditor-color-btn--icon" : ""}`,
        title: action.title,
      });
      if (action.label) {
        label.appendChild(createElement("span", {
          className: "s-texteditor-color-icon",
          textContent: action.label,
        }));
      }
      const input = createElement("input", {
        type: "color",
        "data-command": action.command,
        onchange: (e) => {
          this._handleCommand(action, e.target.value);
        },
      });
      label.appendChild(input);
      return label;
    }

    return null;
  }

  _handleCommand(action, value) {
    if (action.id === "toggleCodeView") {
      this.toggleCodeView();
      return;
    }

    this.focus();

    if (action.id === "undo") {
      this.undo();
      return;
    }
    if (action.id === "redo") {
      this.redo();
      return;
    }
    if (action.id === "removeFormat") {
      this._recordBeforeMutation();
      this.exec("removeFormat");
      this._emitChange();
      return;
    }
    if (action.id === "lineHeight") {
      this._recordBeforeMutation();
      this._applyLineHeight(value);
      this._emitChange();
      return;
    }
    if (action.id === "formatBlock") {
      this._recordBeforeMutation();
      this._applyBlockFormat(value);
      this._emitChange();
      return;
    }
    if (action.id === "insertLink" || action.id === "createLink") {
      this._openLinkDialog();
      return;
    }
    if (action.id === "insertImage") {
      this._openImageDialog();
      return;
    }
    if (action.id === "insertVideo") {
      this._openVideoDialog();
      return;
    }
    if (action.id === "insertTable") {
      this._openTableDialog();
      return;
    }

    // Default execCommand path.
    this._recordBeforeMutation();
    this.exec(action.command, value || null);
    this._emitChange();
  }

  // ============ Command helpers ============
  exec(command, value = null) {
    document.execCommand(command, false, value);
  }

  _applyBlockFormat(tag) {
    if (!tag) return;
    const mapped = BLOCK_TAG_MAP[tag.toLowerCase()] || tag;
    this.exec("formatBlock", `<${mapped}>`);
  }

  _applyLineHeight(value) {
    const sel = document.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const blocks = [];
    let node = range.startContainer;
    while (node) {
      if (node === this.editorEl) break;
      if (node.nodeType === Node.ELEMENT_NODE) blocks.push(node);
      node = node.parentNode;
    }
    if (blocks.length === 0) {
      this.editorEl.style.lineHeight = value;
      return;
    }
    for (const block of blocks) {
      block.style.lineHeight = value;
    }
  }

  // ============ Dialog-driven actions ============
  _openLinkDialog() {
    const existing = this._getSelectedLink();
    this._dialogState = {
      type: "link",
      data: existing
        ? { text: existing.textContent, href: existing.getAttribute("href") || "", title: existing.getAttribute("title") || "", target: existing.getAttribute("target") || "_self" }
        : { text: document.getSelection().toString(), href: "https://", title: "", target: "_self" },
    };
    this.onAction({ type: "dialog", dialog: "link", data: this._dialogState.data });
  }

  _openImageDialog() {
    this._dialogState = { type: "image", data: { src: "", alt: "", width: "", caption: "" } };
    this.onAction({ type: "dialog", dialog: "image", data: this._dialogState.data });
  }

  _openVideoDialog() {
    this._dialogState = { type: "video", data: { src: "", width: "560", height: "315" } };
    this.onAction({ type: "dialog", dialog: "video", data: this._dialogState.data });
  }

  _openTableDialog() {
    this._dialogState = { type: "table", data: { rows: 3, cols: 3 } };
    this.onAction({ type: "dialog", dialog: "table", data: this._dialogState.data });
  }

  _getSelectedLink() {
    const sel = document.getSelection();
    if (!sel.rangeCount) return null;
    let node = sel.anchorNode;
    while (node && node !== this.editorEl) {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "A") {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  }

  // Public APIs used by the Svelte wrapper to apply dialog results.
  insertLink({ text, href, title, target }) {
    const url = sanitizeURL(href);
    if (!url) return;
    this.focus();
    this._recordBeforeMutation();

    const existing = this._getSelectedLink();
    if (existing) {
      existing.setAttribute("href", url);
      if (title) existing.setAttribute("title", title);
      else existing.removeAttribute("title");
      existing.setAttribute("target", target || "_self");
      if (text) existing.textContent = text;
    } else {
      const anchor = `<a href="${url}"${title ? ` title="${title}"` : ""} target="${target || "_self"}" rel="noopener noreferrer">${text || url}</a>`;
      this.exec("insertHTML", anchor);
    }
    this._emitChange();
  }

  removeLink() {
    this.focus();
    this._recordBeforeMutation();
    this.exec("unlink");
    this._emitChange();
  }

  insertImage({ src, alt, width, align, caption }) {
    if (!src) return;
    this.focus();
    this._recordBeforeMutation();

    let figure = "";
    const style = [];
    if (width) style.push(`width:${width}`);
    if (align) {
      style.push(`float:${align}`);
      if (align === "left" || align === "right") {
        style.push("margin:0 12px 12px 0");
      }
    }
    const styleAttr = style.length ? ` style="${style.join(";")}"` : "";

    if (caption) {
      figure = `<figure${styleAttr}><img src="${src}" alt="${alt || ""}" style="max-width:100%;display:block;" /><figcaption>${caption}</figcaption></figure>`;
    } else {
      figure = `<img src="${src}" alt="${alt || ""}"${styleAttr} style="max-width:100%;" />`;
    }
    this.exec("insertHTML", figure);
    this._emitChange();
  }

  insertVideo({ src, width = "560", height = "315" }) {
    if (!src) return;
    this.focus();
    this._recordBeforeMutation();

    let embedUrl = src;
    const youtubeMatch = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) {
      embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    const vimeoMatch = src.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    const iframe = `<iframe src="${embedUrl}" width="${width}" height="${height}" frameborder="0" allowfullscreen></iframe>`;
    this.exec("insertHTML", iframe);
    this._emitChange();
  }

  insertTable({ rows, cols }) {
    rows = Math.max(1, Math.min(20, Number(rows) || 1));
    cols = Math.max(1, Math.min(20, Number(cols) || 1));
    this.focus();
    this._recordBeforeMutation();

    let html = `<table style="width:100%;border-collapse:collapse;"><tbody>`;
    for (let r = 0; r < rows; r++) {
      html += `<tr>`;
      for (let c = 0; c < cols; c++) {
        html += `<td style="border:1px solid currentColor;padding:6px 8px;"></td>`;
      }
      html += `</tr>`;
    }
    html += `</tbody></table><p><br></p>`;
    this.exec("insertHTML", html);
    this._emitChange();
  }

  // ============ Image helpers ============
  getSelectedImage() {
    const sel = document.getSelection();
    if (!sel.rangeCount) return null;
    let node = sel.anchorNode;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    return closest(node, "img");
  }

  alignImage(align) {
    const img = this.getSelectedImage();
    if (!img) return;
    this._recordBeforeMutation();
    img.style.float = "";
    img.style.margin = "";
    img.style.display = "";
    if (["left", "right"].includes(align)) {
      img.style.float = align;
      img.style.margin = align === "left" ? "0 12px 12px 0" : "0 0 12px 12px";
    } else if (align === "center") {
      img.style.display = "block";
      img.style.margin = "0 auto";
    } else {
      img.style.display = "inline";
    }
    this._emitChange();
  }

  removeImage() {
    const img = this.getSelectedImage();
    if (!img) return;
    this._recordBeforeMutation();
    const figure = closest(img, "figure");
    if (figure) figure.remove();
    else img.remove();
    this._emitChange();
  }

  replaceImage(src) {
    const img = this.getSelectedImage();
    if (!img || !src) return;
    this._recordBeforeMutation();
    img.setAttribute("src", src);
    this._emitChange();
  }

  setImageAlt(alt) {
    const img = this.getSelectedImage();
    if (!img) return;
    img.setAttribute("alt", alt || "");
    this._emitChange();
  }

  _recordBeforeMutation() {
    this.history.record(this.getHTML());
  }

  // ============ History ============
  undo() {
    const html = this.history.undo(this.getHTML());
    if (html !== null) {
      this._setHTMLInternal(html, false);
    }
  }

  redo() {
    const html = this.history.redo();
    if (html !== null) {
      this._setHTMLInternal(html, false);
    }
  }

  // ============ Code view ============
  toggleCodeView() {
    if (this._codeView) {
      this._exitCodeView();
    } else {
      this._enterCodeView();
    }
  }

  _enterCodeView() {
    this._codeView = true;
    this.container.classList.add("code-view");
    const html = this.getHTML();

    this._savedSelection = this._saveSelection();

    this._lastCodeValue = html;
    const formatted = formatHTML(html);
    this._codeEl = createElement("textarea", {
      className: "s-texteditor-code",
      spellcheck: "false",
      oninput: () => {
        const raw = this._codeEl.value;
        this._lastCodeValue = raw;
        const clean = sanitizeHTML(raw);
        this.value = clean;
        this.lastHtml = clean;
        this.onChange(clean);
        this._updateStatus();
      },
    });
    this._codeEl.value = formatted;

    this.bodyEl.innerHTML = "";
    this.bodyEl.appendChild(this._codeEl);
    this._codeEl.focus();

    // Disable toolbar formatting buttons while in code view.
    this.toolbarEl.classList.add("readonly");
    this._updateStatus();
  }

  _exitCodeView() {
    const raw = this._codeEl ? this._codeEl.value : this._lastCodeValue;
    this._codeView = false;
    this.container.classList.remove("code-view");

    this._codeEl = null;
    this._lastCodeValue = "";
    this.bodyEl.innerHTML = "";
    this.bodyEl.appendChild(this.editorEl);
    this.toolbarEl.classList.remove("readonly");

    this._setHTMLInternal(raw, true);
    this.focus();
    this._restoreSelection(this._savedSelection);
    this._savedSelection = null;
  }

  _saveSelection() {
    const sel = document.getSelection();
    if (!sel || sel.rangeCount === 0 || !this.editorEl.contains(sel.anchorNode)) return null;
    return sel.getRangeAt(0).cloneRange();
  }

  _restoreSelection(range) {
    if (!range) return;
    try {
      const sel = document.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } catch {
      // Range may no longer be valid after HTML replacement.
    }
  }

  isCodeView() {
    return this._codeView;
  }

  // ============ HTML API ============
  getHTML() {
    let html = this.editorEl.innerHTML;
    if (html === "<p><br></p>" || html === "<br>") html = "";
    return sanitizeHTML(html);
  }

  setHTML(html) {
    this._setHTMLInternal(html, true);
  }

  _setHTMLInternal(html, record) {
    const clean = sanitizeHTML(html || "");
    this.editorEl.innerHTML = clean || "<p><br></p>";
    ensureParagraph(this.editorEl);
    this.value = clean;
    this.lastHtml = clean;
    this._updatePlaceholder();
    this._updateStatus();
    if (record) this.history.record(clean);
    this.onChange(clean);
  }

  getText() {
    return htmlToText(this.getHTML());
  }

  clear() {
    this.setHTML("");
  }

  focus() {
    this.editorEl.focus();
  }

  setReadOnly(readOnly) {
    this.readOnly = readOnly;
    this.editorEl.contentEditable = readOnly ? "false" : "true";
    this.container.classList.toggle("readonly", readOnly);
  }

  // ============ UI updates ============
  _updateToolbarState(state) {
    const buttons = this.toolbarEl.querySelectorAll(".s-texteditor-btn");
    for (const btn of buttons) {
      const activeKey = btn.dataset.active;
      if (!activeKey) continue;
      const active = state.activeFormats.has(activeKey);
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    }
  }

  _updatePlaceholder() {
    const empty = !this.editorEl.textContent.trim();
    this.container.classList.toggle("empty", empty);
  }

  _updateStatus(state = null) {
    const html = this.getHTML();
    const words = getWordCount(html);
    const chars = getTextLength(html);
    const selected = state?.selectedText?.length || 0;
    const tag = state?.currentTag || "";
    this.statusEl.innerHTML = `
      <span>Words: ${words}</span>
      <span>Chars: ${chars}</span>
      ${selected > 0 ? `<span>Selected: ${selected}</span>` : ""}
      ${tag ? `<span>Tag: ${tag.toUpperCase()}</span>` : ""}
    `;
  }
}
