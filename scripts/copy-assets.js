// Post-build: copy framework-agnostic assets into dist/ so the package
// `exports` map (./theme.css, ./theme-base.css, ./themes) resolves.
// Vite lib mode bundles all imported CSS into one style.css; consumers who want
// only the theme tokens can import ./theme.css or ./theme-base.css directly.
import { cpSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const compSrc = resolve(root, "src/lib/components");
const themesSrc = resolve(root, "src/lib/themes");

if (!existsSync(dist)) mkdirSync(dist, { recursive: true });

// 1. theme.css + theme-base.css + every *-styles.css + chart-styles.css -> dist/components
const destComp = resolve(dist, "components");
mkdirSync(destComp, { recursive: true });
for (const f of readdirSync(compSrc)) {
  if (f.endsWith(".css")) cpSync(resolve(compSrc, f), resolve(destComp, f));
}
// chart css lives under components/charts in source
const chartCssSrc = resolve(compSrc, "charts", "chart-styles.css");
if (existsSync(chartCssSrc)) {
  mkdirSync(resolve(destComp, "charts"), { recursive: true });
  cpSync(chartCssSrc, resolve(destComp, "charts", "chart-styles.css"));
}

// 2. themes JS (runtime theme API) -> dist/themes
mkdirSync(resolve(dist, "themes"), { recursive: true });
for (const f of readdirSync(themesSrc)) {
  if (f.endsWith(".js")) cpSync(resolve(themesSrc, f), resolve(dist, "themes", f));
}

console.log("copied theme CSS + themes JS into dist/");