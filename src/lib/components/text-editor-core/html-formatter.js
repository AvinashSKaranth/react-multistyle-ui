/**
 * Lightweight HTML formatter used by the code-view textarea.
 */

export function formatHTML(html) {
  if (!html) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstChild;
  if (!root) return html;

  const children = Array.from(root.childNodes);
  if (!children.length) return html;

  let result = "";
  for (const child of children) {
    result += formatNode(child, 0);
  }
  return result.trim();
}

function formatNode(node, depth) {
  const indent = "  ".repeat(depth);

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || "";
    return text.trim() ? `\n${indent}${text.trim()}` : "";
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const tag = node.tagName.toLowerCase();
  const isVoid = ["br", "hr", "img", "input"].includes(tag);
  const children = Array.from(node.childNodes);

  const attrs = formatAttrs(node);
  const open = `<${tag}${attrs}${isVoid ? " /" : ""}>`;
  if (isVoid) return `\n${indent}${open}`;

  const hasBlockChildren = children.some((c) => c.nodeType === Node.ELEMENT_NODE && isBlock(c.tagName));
  let inner = "";

  if (hasBlockChildren) {
    for (const child of children) {
      inner += formatNode(child, depth + 1);
    }
    inner += `\n${indent}`;
  } else {
    const textContent = node.innerHTML;
    if (textContent.trim()) {
      inner = textContent;
    }
  }

  const close = `</${tag}>`;
  return `\n${indent}${open}${inner}${close}`;
}

function formatAttrs(el) {
  const attrs = Array.from(el.attributes);
  if (!attrs.length) return "";
  return attrs
    .map((a) => {
      const name = a.name;
      const value = a.value
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;");
      return value === "" ? ` ${name}` : ` ${name}="${value}"`;
    })
    .join("");
}

function isBlock(tagName) {
  const blocks = [
    "P", "DIV", "H1", "H2", "H3", "H4", "H5", "H6",
    "BLOCKQUOTE", "PRE", "UL", "OL", "LI", "TABLE",
    "THEAD", "TBODY", "TR", "TD", "TH", "FIGURE", "FIGCAPTION",
  ];
  return blocks.includes(tagName);
}
