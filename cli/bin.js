#!/usr/bin/env node
// react-multistyle-ui CLI — YAML -> React page generator.
// Usage: npx react-multistyle-ui generate --input page.yaml --output ./src/routes/demo.tsx
import { generate } from "./generate.js";

const VERSION = "0.1.0-alpha";

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-h" || a === "--help") { flags.help = true; continue; }
    if (a === "-v" || a === "--version") { flags.version = true; continue; }
    if (a === "--dry-run") { flags.dryRun = true; continue; }
    if (a === "-w" || a === "--watch") { flags.watch = true; continue; }
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("-")) {
        flags[key] = true;
      } else {
        flags[key] = next;
        i++;
      }
    } else {
      positional.push(a);
    }
  }
  return { positional, flags };
}

function showHelp() {
  process.stdout.write(`react-multistyle-ui — UI code generator

Usage:
  npx react-multistyle-ui generate --input <file.yaml> --output <path.tsx> [options]

Subcommands:
  generate            Convert a YAML file into a React page.
                      Supports the standard verbose schema, a proper nested
                      YAML tree, and a compact indentation-based shorthand
                      (all auto-detected).

Options:
  --input <path>      YAML source file (required)
  --output <path>     Output .tsx path (required unless --dry-run prints to stdout)
  --style <name>      Override YAML style (material, fluent, brutalist, ...)
  --theme <name>      Override YAML theme (default, ocean, ...)
  --mode <mode>       Override YAML mode: system | light | dark
  --dry-run           Print generated React to stdout, do not write a file
  --watch, -w         Re-generate when the input YAML changes
  --help, -h          Show this help
  --version, -v       Show version
`);
}

async function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  if (flags.help) { showHelp(); return; }
  if (flags.version) { process.stdout.write(VERSION + "\n"); return; }

  const sub = positional[0];
  if (sub !== "generate") {
    console.error(`Unknown subcommand "${sub || ""}". Run with --help.`);
    process.exit(1);
  }
  if (!flags.input) {
    console.error("Missing required flag: --input <file.yaml>");
    process.exit(1);
  }
  if (!flags.output && !flags.dryRun) {
    console.error('Missing required flag: --output <path.tsx> (or use --dry-run to print to stdout).');
    process.exit(1);
  }

  try {
    await generate({
      input: flags.input,
      output: flags.output,
      style: flags.style,
      theme: flags.theme,
      mode: flags.mode,
      dryRun: Boolean(flags.dryRun),
      watch: Boolean(flags.watch),
    });
  } catch (err) {
    console.error(`✗ ${err.message}`);
    process.exit(1);
  }
}

main();