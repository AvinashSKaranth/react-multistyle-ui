// Lightweight YAML page-schema validation. Plain asserts, no zod.
// Returns { errors, warnings }. Errors stop generation; warnings go to stderr.
import { registry } from "./registry.js";

const TOP_KEYS = new Set(["style", "theme", "mode", "state", "body", "onMount", "imports"]);
const VALID_MODES = new Set(["system", "light", "dark"]);
const VALID_TYPES = new Set(["string", "number", "bool", "boolean", "array", "object"]);

/**
 * @param {any} doc parsed YAML
 * @returns {{errors:string[], warnings:string[], stateNames:Set<string>}}
 */
export function validate(doc) {
  const errors = [];
  const warnings = [];
  const stateNames = new Set();

  if (doc == null || typeof doc !== "object" || Array.isArray(doc)) {
    errors.push("Top-level YAML must be a mapping (object).");
    return { errors, warnings, stateNames };
  }

  for (const k of Object.keys(doc)) {
    if (!TOP_KEYS.has(k)) warnings.push(`Unknown top-level key "${k}" (ignored).`);
  }

  if (doc.mode != null && !VALID_MODES.has(doc.mode)) {
    errors.push(`mode must be one of system | light | dark, got "${doc.mode}".`);
  }

  // state ---------------------------------------------------------------
  if (doc.state != null) {
    if (!Array.isArray(doc.state)) {
      errors.push("state must be a list of { name, type, default? }.");
    } else {
      for (const entry of doc.state) {
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
          errors.push("state entry must be a mapping.");
          continue;
        }
        if (!entry.name || typeof entry.name !== "string") {
          errors.push('state entry missing string "name".');
          continue;
        }
        if (!/^[A-Za-z_$][\w$]*$/.test(entry.name)) {
          errors.push(`state name "${entry.name}" is not a valid JS identifier.`);
          continue;
        }
        if (stateNames.has(entry.name)) errors.push(`Duplicate state name "${entry.name}".`);
        stateNames.add(entry.name);
        if (entry.type != null && !VALID_TYPES.has(entry.type)) {
          warnings.push(`state "${entry.name}" has unknown type "${entry.type}"; defaulting to string.`);
        }
      }
    }
  }

  // body ----------------------------------------------------------------
  if (doc.body == null) {
    warnings.push("No body key — generated page will have an empty markup tree.");
  } else if (!Array.isArray(doc.body)) {
    errors.push("body must be a list of component nodes.");
  } else {
    walkBody(doc.body, stateNames, errors, warnings, 0);
  }

  return { errors, warnings, stateNames };
}

function walkBody(nodes, stateNames, errors, warnings, depth) {
  if (depth > 10) {
    warnings.push("Body nesting deeper than 10 levels (likely a schema mistake); skipping deeper checks.");
    return;
  }
  for (const node of nodes) walkNode(node, stateNames, errors, warnings, depth);
}

function walkNode(node, stateNames, errors, warnings, depth) {
  if (node == null) return;
  if (typeof node === "string") return; // literal text
  if (typeof node !== "object" || Array.isArray(node)) {
    errors.push("Body node must be a mapping or string.");
    return;
  }
  if (typeof node.text === "string") return; // { text: "..." }

  if (!node.component) {
    errors.push('Body node missing required "component" key.');
    return;
  }
  if (typeof node.component !== "string") {
    errors.push(`Component name must be a string, got ${typeof node.component}.`);
    return;
  }
  const entry = registry[node.component];
  if (!entry) {
    errors.push(`Unknown component "${node.component}". Available: ${Object.keys(registry).join(", ")}.`);
    return;
  }

  validateBind(node, entry, stateNames, errors);

  if ((node.children != null || node.text != null) && entry.kind === "leaf") {
    warnings.push(`Component "${node.component}" takes no children; ignoring.`);
  }

  if (entry.kind === "multi-snippet") {
    const provided = node.snippets && typeof node.snippets === "object" ? Object.keys(node.snippets) : [];
    for (const sn of provided) {
      if (!(entry.snippets || []).includes(sn)) {
        warnings.push(`Component "${node.component}" has no snippet "${sn}".`);
      } else if (Array.isArray(node.snippets[sn])) {
        walkBody(node.snippets[sn], stateNames, errors, warnings, depth + 1);
      }
    }
  }

  if (Array.isArray(node.children)) walkBody(node.children, stateNames, errors, warnings, depth + 1);
}

function validateBind(node, entry, stateNames, errors) {
  const bind = node.bind;
  if (bind == null) return;
  if (typeof bind === "string") {
    if (!entry.primaryBindable) {
      errors.push(`Component "${node.component}" has no primary bindable prop; use "bind: { prop: var }" explicitly or remove bind.`);
    } else if (!stateNames.has(bind)) {
      errors.push(`Bind target "${bind}" is not declared in state:. Add it under state: first.`);
    }
    return;
  }
  if (typeof bind === "object" && !Array.isArray(bind)) {
    for (const [prop, refName] of Object.entries(bind)) {
      if (typeof refName !== "string") {
        errors.push(`bind.${prop} must be a variable name string.`);
        continue;
      }
      if (!stateNames.has(refName)) {
        errors.push(`Bind target "${refName}" (for prop "${prop}") is not declared in state:.`);
      }
    }
    return;
  }
  errors.push(`bind must be a variable name string or a mapping of { prop: var }, got ${typeof bind}.`);
}