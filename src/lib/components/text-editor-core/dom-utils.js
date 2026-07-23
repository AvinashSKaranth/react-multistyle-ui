/**
 * Small DOM helpers used by the custom WYSIWYG editor core.
 */

export function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "className") {
      el.className = value;
    } else if (key === "innerHTML") {
      el.innerHTML = value;
    } else if (key === "textContent") {
      el.textContent = value;
    } else if (key === "value") {
      el.value = value;
    } else if (key.startsWith("on") && typeof value === "function") {
      const event = key.slice(2).toLowerCase();
      el.addEventListener(event, value);
    } else if (value !== null && value !== undefined) {
      el.setAttribute(key, value);
    }
  }
  for (const child of children) {
    if (child == null) continue;
    if (typeof child === "string" || typeof child === "number") {
      el.appendChild(document.createTextNode(String(child)));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
  }
  return el;
}

export function closest(node, selector) {
  if (!node) return null;
  let current = node;
  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE && current.matches(selector)) {
      return current;
    }
    current = current.parentNode;
  }
  return null;
}

export function matches(el, selector) {
  if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;
  return el.matches?.(selector) ?? false;
}

export function isInsideEditor(node, editorEl) {
  if (!node) return false;
  if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
  return editorEl.contains(node);
}

export function getActiveElement(editorEl) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const node = sel.anchorNode;
  if (!isInsideEditor(node, editorEl)) return null;
  return node;
}

export function getParentBlock(node, editorEl) {
  let current = node;
  while (current && current !== editorEl) {
    if (current.nodeType === Node.ELEMENT_NODE && isBlockElement(current)) {
      return current;
    }
    current = current.parentNode;
  }
  return null;
}

export function isBlockElement(el) {
  if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;
  const blocks = [
    "P", "DIV", "H1", "H2", "H3", "H4", "H5", "H6",
    "BLOCKQUOTE", "PRE", "UL", "OL", "LI", "TABLE",
    "THEAD", "TBODY", "TR", "TD", "TH", "HR",
  ];
  return blocks.includes(el.tagName);
}

export function walkNodes(root, callback) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    null,
    false,
  );
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) {
    nodes.push(node);
  }
  for (const n of nodes) {
    callback(n);
  }
}

export function emptyNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

export function ensureParagraph(editorEl) {
  if (!editorEl.innerHTML.trim()) {
    editorEl.innerHTML = "<p><br></p>";
    return editorEl.querySelector("p");
  }
  return null;
}

export function stripTags(html, allowed) {
  const div = document.createElement("div");
  div.innerHTML = html;
  walkNodes(div, (node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();
      if (!allowed.includes(tag)) {
        const parent = node.parentNode;
        while (node.firstChild) {
          parent.insertBefore(node.firstChild, node);
        }
        parent.removeChild(node);
      }
    }
  });
  return div.innerHTML;
}

export function getTextLength(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent.length;
}

export function getWordCount(html) {
  const text = htmlToText(html);
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

export function htmlToText(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || "";
}
