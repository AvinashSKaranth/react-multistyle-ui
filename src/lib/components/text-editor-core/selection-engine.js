/**
 * Selection state tracking for the custom editor.
 */

import { getParentBlock, isInsideEditor } from "./dom-utils.js";

export function getSelectionState(editorEl) {
  const sel = window.getSelection();
  const state = {
    collapsed: true,
    startNode: null,
    endNode: null,
    selectedText: "",
    activeFormats: new Set(),
    currentTag: "",
    range: null,
  };

  if (!sel || sel.rangeCount === 0) return state;

  const range = sel.getRangeAt(0);
  const anchorIn = isInsideEditor(sel.anchorNode, editorEl);
  const focusIn = isInsideEditor(sel.focusNode, editorEl);

  if (!anchorIn || !focusIn) return state;

  state.collapsed = range.collapsed;
  state.startNode = sel.anchorNode;
  state.endNode = sel.focusNode;
  state.selectedText = sel.toString();
  state.range = range;
  state.currentTag = getCurrentBlockTag(sel.anchorNode, editorEl);

  state.activeFormats = detectActiveFormats(range, editorEl);

  return state;
}

function getCurrentBlockTag(node, editorEl) {
  const block = getParentBlock(node, editorEl);
  return block ? block.tagName.toLowerCase() : "";
}

function detectActiveFormats(range, editorEl) {
  const formats = new Set();
  if (range.collapsed) {
    // For collapsed selection, check parent chain.
    let node = range.startContainer;
    while (node && node !== editorEl) {
      addFormatFromNode(formats, node);
      node = node.parentNode;
    }
  } else {
    // For a range, scan all text nodes inside the range.
    const walker = document.createTreeWalker(
      editorEl,
      NodeFilter.SHOW_TEXT,
      null,
      false,
    );
    let node;
    while ((node = walker.nextNode())) {
      if (range.intersectsNode(node)) {
        let parent = node.parentNode;
        while (parent && parent !== editorEl) {
          addFormatFromNode(formats, parent);
          parent = parent.parentNode;
        }
      }
    }
  }
  return formats;
}

function addFormatFromNode(formats, node) {
  if (!node || node.nodeType !== Node.ELEMENT_NODE) return;
  const tag = node.tagName.toLowerCase();

  const tagMap = {
    strong: "bold",
    b: "bold",
    em: "italic",
    i: "italic",
    u: "underline",
    s: "strikeThrough",
    strike: "strikeThrough",
    sup: "superscript",
    sub: "subscript",
    a: "link",
    h1: "formatH1",
    h2: "formatH2",
    h3: "formatH3",
    h4: "formatH4",
    h5: "formatH5",
    h6: "formatH6",
    p: "formatP",
    blockquote: "formatBlockquote",
    pre: "formatPre",
    ul: "insertUnorderedList",
    ol: "insertOrderedList",
  };

  if (tagMap[tag]) formats.add(tagMap[tag]);

  const style = node.style || {};
  if (style.fontWeight === "bold" || Number(style.fontWeight) >= 700) {
    formats.add("bold");
  }
  if (style.fontStyle === "italic") formats.add("italic");
  if (style.textDecorationLine?.includes("underline")) formats.add("underline");
  if (style.textDecorationLine?.includes("line-through")) formats.add("strikeThrough");
  if (style.verticalAlign === "super") formats.add("superscript");
  if (style.verticalAlign === "sub") formats.add("subscript");

  const align = style.textAlign || node.getAttribute("align");
  if (align === "left") formats.add("justifyLeft");
  if (align === "center") formats.add("justifyCenter");
  if (align === "right") formats.add("justifyRight");
  if (align === "justify") formats.add("justifyFull");
}

export function restoreRange(range) {
  if (!range) return;
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

export function withSavedSelection(fn) {
  const sel = window.getSelection();
  const range = sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
  try {
    return fn();
  } finally {
    if (range) restoreRange(range);
  }
}
