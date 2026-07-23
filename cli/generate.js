// Orchestrator: parse YAML -> validate -> emit Svelte -> write file (or stdout).
//
// Three input styles are auto-detected:
//
// 1. Verbose schema (has a `body` key):
//    state:
//      - { name: username, type: string, default: "" }
//    body:
//      - component: Input
//        props:
//          label: Username
//        bind: username
//
// 2. Proper YAML tree (no `body` key):
//    Card:
//      - Row:
//          - Input:
//              label: Username
//
// 3. Indentation-based shorthand (fallback when YAML parse fails):
//    Card
//      Row
//        Input: { label: Username }
//
// Responsibilities:
//   - parse all DSL styles into a common AST
//   - auto-convert string[] options to {value,label}[]
//   - inject fake data for Select/MultiSelect/Table/Charts when missing
//   - auto-declare $state vars and bind: props for bindable components
//   - validate and emit Svelte 5 markup

import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { validate } from "./schema.js";
import { emitPage } from "./emit.js";
import { registry } from "./registry.js";

const DEFAULT_OPTIONS = [
  { value: "opt1", label: "Option 1" },
  { value: "opt2", label: "Option 2" },
  { value: "opt3", label: "Option 3" },
];

const DEFAULT_TABLE_DATA = [
  { id: 1, name: "Alice", role: "Admin" },
  { id: 2, name: "Bob", role: "User" },
  { id: 3, name: "Cara", role: "Editor" },
];

const DEFAULT_CHART_DATA = [
  { label: "q1", value: 12 },
  { label: "q2", value: 19 },
  { label: "q3", value: 8 },
  { label: "q4", value: 15 },
];

const CHART_NAMES = new Set([
  "BarChart",
  "LineChart",
  "PieChart",
  "DoughnutChart",
  "RadarChart",
  "PolarAreaChart",
  "ScatterChart",
  "BubbleChart",
  "StackedBarChart",
  "StackedLineChart",
  "ComboChart",
]);

const BIND_TYPE = {
  Input: "string",
  Textarea: "string",
  Select: "string",
  MultiSelect: "array",
  Checkbox: "bool",
  Toggle: "bool",
  Radio: "string",
  Slider: "number",
  DatePicker: "string",
  ButtonGroup: "string",
  SortableList: "array",
  Tabs: "number",
  Pagination: "number",
  Modal: "bool",
  Drawer: "bool",
  CommandPalette: "bool",
  Popover: "bool",
  Rating: "number",
};

const CONFIG_KEYS = new Set(["style", "theme", "mode"]);

/**
 * @param {object} opts
 * @param {string} opts.input
 * @param {string} [opts.output]
 * @param {string} [opts.style]
 * @param {string} [opts.theme]
 * @param {string} [opts.mode]
 * @param {boolean} [opts.dryRun]
 * @param {boolean} [opts.watch]
 */
export async function generate(opts) {
  const { input, output, style, theme, mode, dryRun, watch } = opts;

  const runOnce = () => {
    const src = fs.readFileSync(input, "utf8");
    const doc = parseInput(src);
    const { errors, warnings } = validate(doc);
    for (const w of warnings) console.error(`! ${w}`);
    if (errors.length) {
      throw new Error("Validation failed:\n" + errors.map((e) => "  - " + e).join("\n"));
    }

    const cfg = {
      style: style || doc?.style || "material",
      theme: theme || doc?.theme || "default",
      mode: mode || doc?.mode || "system",
    };

    const code = emitPage(doc, cfg);

    if (dryRun) {
      process.stdout.write(code);
      return;
    }
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, code, "utf8");
    console.error(`✓ Wrote ${output} (${code.length} bytes)`);
  };

  runOnce();

  if (watch) {
    let timer = null;
    fs.watch(input, () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          runOnce();
        } catch (e) {
          console.error(`✗ ${e.message}`);
        }
      }, 250);
    });
    console.error(`↻ Watching ${input} for changes (Ctrl+C to stop)`);
  }
}

// ---------------------------------------------------------------------------
// Input parsing
// ---------------------------------------------------------------------------

function parseInput(src) {
  let doc;
  try {
    doc = yaml.load(src);
    if (doc == null) {
      doc = null;
    } else if (Array.isArray(doc)) {
      // Root-level list of component mappings: wrap into the tree DSL.
      doc = parseYamlTree({ __rootList: doc });
    } else if (typeof doc === "object" && Array.isArray(doc.body)) {
      // Verbose schema with explicit body/state — leave state as declared.
      doc.state = doc.state || [];
    } else if (typeof doc === "object") {
      // Parsed YAML object without a `body` key: treat it as the compact/proper YAML tree DSL.
      doc = parseYamlTree(doc);
    } else {
      doc = null;
    }
  } catch (e) {
    doc = null;
  }
  if (!doc) {
    doc = parseCompact(src);
  }
  return doc;
}

function emptyDoc() {
  return {
    style: "material",
    theme: "default",
    mode: "system",
    state: [],
    body: [],
  };
}

/**
 * Convert a proper YAML object (already parsed by js-yaml) into the internal doc
 * format used by validate.js / emit.js.
 */
function parseYamlTree(yamlDoc) {
  const doc = emptyDoc();
  const body = [];

  if (Array.isArray(yamlDoc.__rootList)) {
    for (const child of yamlDoc.__rootList) {
      body.push(convertYamlChild(child));
    }
  } else {
    for (const [key, value] of Object.entries(yamlDoc)) {
      if (key === "__rootList" || CONFIG_KEYS.has(key)) {
        if (CONFIG_KEYS.has(key)) doc[key] = String(value ?? "");
        continue;
      }
      body.push(convertYamlNode(key, value));
    }
  }

  doc.body = body;
  doc.state = buildAutoState(body);
  return doc;
}

/**
 * Indentation-based fallback parser.
 */
function parseCompact(src) {
  const lines = readLines(src);
  if (lines.length === 0) return emptyDoc();

  const rootIndent = lines[0].indent;
  const doc = emptyDoc();
  const body = [];
  const stack = [{ depth: rootIndent - 1, children: body }];

  for (let i = 0; i < lines.length; i++) {
    const { indent, text } = lines[i];

    // Top-level configuration keys (style/theme/mode).
    const cfg = tryConfigLine(text, indent === rootIndent);
    if (cfg) {
      if (CONFIG_KEYS.has(cfg.key)) doc[cfg.key] = cfg.value;
      continue;
    }

    const node = parseNodeLine(text, i + 1);

    // Pop to the correct parent based on indentation.
    while (stack.length > 1 && stack[stack.length - 1].depth >= indent) {
      stack.pop();
    }
    const parent = stack[stack.length - 1];
    parent.children.push(node);
    stack.push({ depth: indent, children: node.children });
  }

  doc.body = body;
  doc.state = buildAutoState(body);
  return doc;
}

function convertYamlNode(name, value) {
  const entry = registry[name];
  const node = { component: name, props: {} };

  if (value == null) {
    // No value: e.g. `Row:` or `Table:` — children/props stay empty.
  } else if (typeof value === "string") {
    node.children = [value];
  } else if (Array.isArray(value)) {
    node.children = value.map((child) => convertYamlChild(child)).filter((c) => c !== undefined);
  } else if (typeof value === "object") {
    node.props = { ...value };
    const textContent = node.props.children ?? node.props.text;
    if (textContent != null) {
      delete node.props.children;
      delete node.props.text;
      if (typeof textContent === "string") {
        node.children = [textContent];
      } else if (Array.isArray(textContent)) {
        node.children = textContent.map((child) => convertYamlChild(child)).filter((c) => c !== undefined);
      }
    }
  }

  if (entry?.kind === "multi-snippet") {
    const snippets = {};
    for (const sn of entry.snippets || []) {
      const raw = node.props[sn];
      if (raw != null) {
        if (typeof raw === "string") snippets[sn] = raw;
        else if (Array.isArray(raw)) snippets[sn] = raw.map((child) => convertYamlChild(child)).filter((c) => c !== undefined);
        delete node.props[sn];
      }
    }
    // `children` text extracted above (node.children) becomes the children snippet.
    if (!snippets.children && Array.isArray(node.children) && node.children.length) {
      snippets.children = node.children;
    }
    if (Object.keys(snippets).length) {
      node.snippets = snippets;
    }
    if (!node.snippets) node.snippets = {};
    node.children = [];
  } else if (node.children == null && (!entry || entry.kind !== "leaf")) {
    node.children = [];
  }

  return node;
}

function convertYamlChild(child) {
  if (child == null) return undefined;
  if (typeof child === "string") return child;
  if (Array.isArray(child)) {
    throw new Error("Child list entries must be component mappings or strings, not nested lists.");
  }
  if (typeof child === "object") {
    const keys = Object.keys(child);
    if (keys.length === 0) {
      throw new Error("Empty child mapping is not a valid component node.");
    }
    const name = keys[0];
    return convertYamlNode(name, child[name]);
  }
  return String(child);
}

function readLines(src) {
  const out = [];
  const raw = src.split("\n");
  for (let i = 0; i < raw.length; i++) {
    const line = raw[i];
    const pos = line.search(/\S/);
    if (pos === -1) continue;
    const text = line.trim();
    if (text.startsWith("#")) continue;
    out.push({ indent: pos, text, line: i + 1 });
  }
  return out;
}

function tryConfigLine(text, atRoot) {
  if (!atRoot) return null;
  const m = text.match(/^(style|theme|mode)\s*:\s*(.*)$/);
  if (!m) return null;
  const key = m[1];
  let value = m[2].trim();
  try {
    value = yaml.load(value);
  } catch {
    // keep raw string
  }
  return { key, value: String(value ?? "") };
}

function parseNodeLine(text, lineNo) {
  const m = text.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*(?::\s*(.*))?$/);
  if (!m) {
    throw new Error(`Invalid compact YAML line ${lineNo}: ${text}`);
  }
  const name = m[1];
  const rest = m[2] ?? "";
  let props = {};
  if (rest.trim()) {
    try {
      const v = yaml.load(rest);
      if (v != null && typeof v === "object" && !Array.isArray(v)) {
        props = v;
      } else {
        throw new Error("component props must be a mapping `{...}`");
      }
    } catch (e) {
      throw new Error(`Bad props at line ${lineNo}: ${rest} (${e.message})`);
    }
  }

  const entry = registry[name];
  const node = { component: name, props: { ...props } };

  const textContent = props.children ?? props.text;
  if (textContent != null) {
    delete node.props.children;
    delete node.props.text;
    if (typeof textContent === "string") {
      node.children = [textContent];
    } else if (Array.isArray(textContent)) {
      node.children = textContent;
    }
  } else if (!entry || entry.kind !== "leaf") {
    node.children = [];
  }

  return node;
}

// ---------------------------------------------------------------------------
// Auto-state, fake data, and default children
// ---------------------------------------------------------------------------

function buildAutoState(nodes, used = new Set()) {
  const state = [];
  for (const node of nodes) {
    const entry = registry[node.component];
    if (entry?.bindable?.length) {
      const name = makeStateName(node, entry, used);
      used.add(name);
      const type = BIND_TYPE[node.component] || "string";
      state.push({ name, type, default: defaultValue(type) });
      if (entry.primaryBindable) {
        node.bind = name;
      } else {
        node.bind = { [entry.bindable[0]]: name };
      }
    }

    injectFakeData(node);
    defaultChildren(node, entry);

    if (Array.isArray(node.children) && node.children.length) {
      state.push(...buildAutoState(node.children, used));
    }
  }
  return state;
}

function makeStateName(node, entry, used) {
  const props = node.props || {};
  const raw = props.label || props.placeholder || props.title || entry.importName;
  const parts = String(raw)
    .toLowerCase()
    .replace(/[^a-z0-9_$]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) parts = [entry.importName.toLowerCase()];

  let base = parts[0];
  for (let i = 1; i < parts.length; i++) {
    base += parts[i][0].toUpperCase() + parts[i].slice(1);
  }
  if (!/^[a-z_$]/.test(base)) base = "x" + base;

  if (entry.importName === "Select" || entry.importName === "MultiSelect") {
    base = "selected" + base[0].toUpperCase() + base.slice(1);
  } else if (
    (entry.importName === "Checkbox" || entry.importName === "Toggle") &&
    !props.label
  ) {
    base = "checked";
  }

  let name = base;
  let i = 1;
  while (used.has(name)) name = base + ++i;
  return name;
}

function defaultValue(type) {
  switch (type) {
    case "number":
      return 0;
    case "bool":
    case "boolean":
      return false;
    case "array":
      return [];
    default:
      return "";
  }
}

function injectFakeData(node) {
  const name = node.component;
  const props = node.props;

  if (name === "Select" || name === "MultiSelect") {
    if (!props.options) {
      props.options = DEFAULT_OPTIONS;
    } else if (
      Array.isArray(props.options) &&
      props.options.length > 0 &&
      typeof props.options[0] === "string"
    ) {
      props.options = props.options.map((s) => ({
        value: String(s).toLowerCase(),
        label: s,
      }));
    }
  } else if (name === "Table" && !props.data) {
    props.data = DEFAULT_TABLE_DATA;
  } else if (CHART_NAMES.has(name) && !props.data) {
    props.data = DEFAULT_CHART_DATA;
  }
}

function defaultChildren(node, entry) {
  if (!entry) return;
  if (
    entry.kind === "children" &&
    Array.isArray(node.children) &&
    node.children.length === 0 &&
    Object.keys(node.props || {}).length === 0
  ) {
    node.children = [entry.importName];
  }
}
