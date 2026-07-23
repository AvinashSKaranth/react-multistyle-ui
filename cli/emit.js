// Pure string builders for the YAML -> React page generator. No I/O here.
// Emits a .tsx page: useState for state, controlled props (value/onValueChange,
// checked/onCheckedChange, open/onOpenChange, …) for bindings, JSX children.
import { registry } from "./registry.js";

const IND = "  "; // 2-space indent per depth level

/** React change-handler prop name for a bindable prop: value -> onValueChange. */
function handlerName(prop) {
  return "on" + prop[0].toUpperCase() + prop.slice(1) + "Change";
}

/** useState setter name for a state var: username -> setUsername. */
function setterName(name) {
  return "set" + name[0].toUpperCase() + name.slice(1);
}

/**
 * @param {any} doc  parsed YAML object
 * @param {{style:string, theme:string, mode:string}} cfg  resolved page config
 * @returns {string} full .tsx file content
 */
export function emitPage(doc, cfg) {
  const used = new Set();
  const body = Array.isArray(doc?.body) ? doc.body : [];
  const bodyMarkup = emitBody(body, 1, used); // indent 1 (inside return parens -> Fragment)
  const state = Array.isArray(doc?.state) ? doc.state : [];

  const imports = emitImports(used);
  const stateLines = emitState(state);
  const header = imports + "\n\n" + `export default function GeneratedPage() {\n`;
  const stateBlock = stateLines.length ? stateLines.map((l) => "  " + l).join("\n") + "\n" : "";
  const footer = `  return (\n    <>\n${bodyMarkup || "      "}\n    </>\n  );\n}\n`;

  return header + stateBlock + footer;
}

// ---------------------------------------------------------------------------
// <script>-equivalent sections
// ---------------------------------------------------------------------------

function emitImports(used) {
  const components = [...used].sort();
  const lines = [`import { useState } from "react";`];
  if (components.length) {
    lines.push(`import { ${components.join(", ")} } from "react-multistyle-ui";`);
  }
  return lines.join("\n");
}

function emitState(state) {
  return state
    .filter((e) => e?.name)
    .map((e) => `const [${e.name}, ${setterName(e.name)}] = useState(${defaultLiteral(e)});`);
}

// ---------------------------------------------------------------------------
// Markup tree (JSX)
// ---------------------------------------------------------------------------

/** @param {any[]} nodes @param {number} depth @param {Set<string>} used */
function emitBody(nodes, depth, used) {
  return nodes.map((n) => emitNode(n, depth, used)).filter(Boolean).join("\n");
}

/** @returns {string|null} */
function emitNode(node, depth, used) {
  const indent = IND.repeat(depth);
  if (typeof node === "string") return indent + escapeText(node);
  if (!node || typeof node !== "object") return null;
  if (typeof node.text === "string") return indent + escapeText(node.text);

  const name = node.component;
  const entry = registry[name];
  if (!entry) return null;
  used.add(name);

  const attrs = emitAttrs(node, entry);
  const attrStr = attrs ? ` ${attrs}` : "";
  const open = `${indent}<${name}${attrStr}`;

  switch (entry.kind) {
    case "leaf":
      return `${open} />`;

    case "children":
    case "container": {
      const children = node.children;
      if (children == null) return `${open} />`;
      if (typeof children === "string") return `${open}>${escapeText(children)}</${name}>`;
      if (Array.isArray(children)) {
        const inner = emitBody(children, depth + 1, used);
        if (!inner) return `${open} />`;
        return `${open}>\n${inner}\n${indent}</${name}>`;
      }
      return `${open} />`;
    }

    case "multi-snippet": {
      // Popover: `children` snippet -> JSX children; `content` snippet -> content prop.
      const snippets = entry.snippets || [];
      const parts = [];
      for (const sn of snippets) {
        const content = node.snippets?.[sn];
        if (sn === "children") {
          if (typeof content === "string") parts.push(escapeText(content));
          else if (Array.isArray(content)) {
            const inner = emitBody(content, depth + 1, used);
            if (inner) parts.push(inner);
          }
        } else if (sn === "content") {
          // content is emitted as a prop below; skip here.
        }
      }
      const contentProp = emitContentProp(node.snippets?.content, used, depth);
      const contentAttr = contentProp ? ` ${contentProp}` : "";
      if (!parts.length) return `${open}${contentAttr} />`;
      const inner = parts.join("\n");
      return `${open}${contentAttr}>\n${inner}\n${indent}</${name}>`;
    }

    default:
      return null;
  }
}

/** Emit the `content` prop for a multi-snippet component (Popover). */
function emitContentProp(content, used, depth) {
  if (content == null) return "";
  if (typeof content === "string") return `content=${JSON.stringify(content)}`;
  if (Array.isArray(content)) {
    const inner = emitBody(content, 2, used); // indented inside an arrow fn
    return `content={() => (\n${inner}\n${IND})}`;
  }
  return "";
}

/** Build the attribute string (props + bindings) for a component node. */
function emitAttrs(node, entry) {
  const parts = [];
  if (node.props && typeof node.props === "object") {
    for (const [k, v] of Object.entries(node.props)) {
      const attr = emitProp(k, v);
      if (attr) parts.push(attr);
    }
  }
  if (node.bind != null) {
    if (typeof node.bind === "string") {
      const prop = entry.primaryBindable;
      if (prop) parts.push(`${prop}={${node.bind}} ${handlerName(prop)}={${setterName(node.bind)}}`);
    } else if (typeof node.bind === "object") {
      for (const [prop, refName] of Object.entries(node.bind)) {
        if (typeof refName === "string") parts.push(`${prop}={${refName}} ${handlerName(prop)}={${setterName(refName)}}`);
      }
    }
  }
  return parts.join(" ");
}

/** @returns {string|null} one JSX attribute, e.g. `label="Hi"`, `value={count}`, `options={[...]}` */
function emitProp(key, value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") {
    const ref = value.match(/^\{([A-Za-z_$][\w$]*)\}$/);
    if (ref) return `${key}={${ref[1]}}`; // reactive ref to a state var
    return `${key}=${JSON.stringify(value)}`; // plain string literal
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return `${key}={${JSON.stringify(value)}}`;
  }
  if (Array.isArray(value)) return `${key}={${jsValue(value)}}`;
  if (typeof value === "object") return `${key}={${jsValue(value)}}`;
  return null;
}

// ---------------------------------------------------------------------------
// JS literal coercion (for arrays / objects / scalars inside {})
// ---------------------------------------------------------------------------

function jsValue(v) {
  if (v === null || v === undefined) return "null";
  if (typeof v === "string") return JSON.stringify(v);
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return `[${v.map(jsValue).join(",")}]`;
  if (typeof v === "object") {
    const entries = Object.entries(v).map(([k, val]) => `${jsKey(k)}:${jsValue(val)}`);
    return `{${entries.join(",")}}`;
  }
  return "null";
}

function jsKey(k) {
  return /^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k);
}

/** Escape JSX text content (brace/lt/gt). */
function escapeText(s) {
  return String(s)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, "&quot;")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\{/g, "&#123;")
    .replace(/\}/g, "&#125;");
}

// ---------------------------------------------------------------------------
// state default coercion
// ---------------------------------------------------------------------------

function defaultLiteral(entry) {
  if (entry.default !== undefined) return jsValue(entry.default);
  switch (entry.type) {
    case "number":
      return "0";
    case "bool":
    case "boolean":
      return "false";
    case "array":
      return "[]";
    default:
      return '""'; // string / unknown
  }
}