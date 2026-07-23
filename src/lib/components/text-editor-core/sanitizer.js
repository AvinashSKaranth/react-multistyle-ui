/**
 * HTML sanitizer for the custom editor.
 * Parses HTML, keeps allowed tags/attributes, removes forbidden tags entirely.
 */

const ALLOWED_TAGS = new Set([
  "p", "div", "span", "br", "strong", "em", "u", "s", "sup", "sub",
  "ul", "ol", "li", "blockquote", "pre", "code",
  "table", "thead", "tbody", "tr", "td", "th", "caption",
  "img", "a", "iframe", "hr", "h1", "h2", "h3", "h4", "h5", "h6",
]);

const FORBIDDEN_TAGS = new Set([
  "script", "style", "object", "embed", "form", "input", "button", "textarea",
  "select", "option", "canvas", "svg", "math",
]);

const ALLOWED_ATTRS = new Set([
  "href", "title", "target", "rel",
  "src", "alt", "width", "height",
  "align", "class", "style",
  "colspan", "rowspan",
  "frameborder", "allowfullscreen",
]);

const ALLOWED_CSS_PROPS = new Set([
  "color", "background-color", "background", "font-family", "font-size",
  "text-align", "vertical-align", "line-height", "text-decoration",
  "font-weight", "font-style",
  "width", "height", "max-width", "max-height",
  "float", "margin", "margin-left", "margin-right", "padding",
  "border", "border-collapse", "border-spacing",
]);

const FORMAT_NORMALIZE_MAP = {
  strong: "b",
  em: "i",
  strike: "s",
};

export function sanitizeHTML(html, options = {}) {
  if (!html) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  cleanNode(doc.body);
  if (options.normalizeFormats !== false) {
    normalizeInlineFormats(doc.body);
  }
  return doc.body.innerHTML;
}

function normalizeInlineFormats(root) {
  // Convert <strong> → <b>, <em> → <i>, <strike> → <s>
  for (const [from, to] of Object.entries(FORMAT_NORMALIZE_MAP)) {
    const nodes = Array.from(root.querySelectorAll(from));
    for (const node of nodes) {
      const replacement = document.createElement(to);
      while (node.firstChild) {
        replacement.appendChild(node.firstChild);
      }
      node.parentNode.replaceChild(replacement, node);
    }
  }

  // Convert inline style-based formatting to semantic tags when possible.
  const spans = Array.from(root.querySelectorAll("span[style]"));
  for (const span of spans) {
    const style = span.style;
    let replacementTag = null;
    if (style.fontWeight === "bold" || Number(style.fontWeight) >= 700) {
      replacementTag = "b";
    } else if (style.fontStyle === "italic") {
      replacementTag = "i";
    } else if (style.textDecorationLine?.includes("line-through")) {
      replacementTag = "s";
    } else if (style.verticalAlign === "super") {
      replacementTag = "sup";
    } else if (style.verticalAlign === "sub") {
      replacementTag = "sub";
    }

    if (replacementTag) {
      const replacement = document.createElement(replacementTag);
      while (span.firstChild) {
        replacement.appendChild(span.firstChild);
      }
      span.parentNode.replaceChild(replacement, span);
    }
  }
}

function cleanNode(node) {
  const children = Array.from(node.childNodes);
  for (const child of children) {
    if (child.nodeType === Node.TEXT_NODE) continue;

    if (child.nodeType === Node.ELEMENT_NODE) {
      const tag = child.tagName.toLowerCase();

      if (FORBIDDEN_TAGS.has(tag)) {
        node.removeChild(child);
        continue;
      }

      if (!ALLOWED_TAGS.has(tag)) {
        // Unwrap unknown tags (keep children).
        const parent = child.parentNode;
        while (child.firstChild) {
          parent.insertBefore(child.firstChild, child);
        }
        parent.removeChild(child);
        continue;
      }

      // Clean attributes.
      const attrs = Array.from(child.attributes);
      for (const attr of attrs) {
        if (!ALLOWED_ATTRS.has(attr.name.toLowerCase())) {
          child.removeAttribute(attr.name);
          continue;
        }
        if (attr.name.toLowerCase() === "style") {
          child.setAttribute("style", sanitizeInlineStyles(attr.value));
        }
      }

      cleanNode(child);
    } else {
      // Remove comments and other non-element/text nodes.
      node.removeChild(child);
    }
  }
}

function sanitizeInlineStyles(styleValue) {
  if (!styleValue) return "";
  const declarations = styleValue.split(";");
  const cleaned = [];
  for (const decl of declarations) {
    const colonIdx = decl.indexOf(":");
    if (colonIdx === -1) continue;
    const prop = decl.slice(0, colonIdx).trim().toLowerCase();
    const value = decl.slice(colonIdx + 1).trim();
    if (ALLOWED_CSS_PROPS.has(prop) && value && !/javascript:/i.test(value)) {
      cleaned.push(`${prop}: ${value}`);
    }
  }
  return cleaned.join("; ");
}

export function sanitizeURL(url) {
  if (!url) return "";
  if (/^javascript:/i.test(url)) return "";
  return url;
}

export function plainTextFromHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || "";
}
