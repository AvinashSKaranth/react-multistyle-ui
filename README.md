# react-multistyle-ui

A multi-style, multi-theme React 18 component library with multiple design languages and color schemes. Port of [svelte-multistyle-ui](https://github.com/avinashskaranth/svelte-multistyle-ui).

**[🌐 Live Demo](https://avinashskaranth.github.io/react-multistyle-ui/)** — Component gallery with all styles, themes, and interactive examples.

**Design styles:** Material, Material 3, Fluent, Brutalist, Neon, Metro, Bootstrap, Cartoon, Illustration, Liquid Glass, Carbon, Pixel

**Color themes:** Default, Ocean, Forest, Rose, Midnight, Gold, Slate, Candy, Storm, Royal

---

## Install

```bash
npm install react-multistyle-ui
```

add LLM skill reference:

```bash
npx skills add https://github.com/AvinashSKaranth/react-multistyle-ui
```

Peer deps: `react ^18.3.0`, `react-dom ^18.3.0`, `chart.js ^4.5.1` (chart components only).

---

## Quick Start

```tsx
import { initMultistyleUI } from "react-multistyle-ui";
import "react-multistyle-ui/style.css";

// Set defaults (call once at app root)
initMultistyleUI({ style: "material", theme: "ocean", mode: "system" });

function App() {
  return (
    <Button variant="filled" preset="primary" icon="star">
      Hello
    </Button>
  );
}
```

Each component inherits `style`/`theme`/`mode` from global defaults. Override per-component via props:

```tsx
<Button style="brutalist" theme="midnight" variant="outlined">
  Override
</Button>
```

---

## Styling

### Styles (design languages)

| Style          | Vibe                                         |
| -------------- | -------------------------------------------- |
| `material`     | Google Material Design — clean, layered      |
| `material3`    | Material 3 (Material You) — rounded, dynamic |
| `fluent`       | Microsoft Fluent — neutral, crisp            |
| `brutalist`    | Raw, monospace, bold borders                 |
| `neon`         | Cyberpunk glow, dark-first                   |
| `metro`        | Windows 8/10 Modern UI — flat tiles          |
| `bootstrap`    | Classic Bootstrap-like with cards            |
| `cartoon`      | Playful, rounded, Comic Neue font            |
| `illustration` | Whimsical, Dancing Script heading            |
| `liquid-glass` | Translucent, backdrop-blur, glassmorphism    |
| `carbon`       | IBM Carbon — structured, professional        |
| `pixel`        | Retro pixel-art aesthetic                    |

### Themes (color schemes)

| Theme      | Light mode                         | Dark mode     |
| ---------- | ---------------------------------- | ------------- |
| `default`  | White, blue primary                | Auto-inverted |
| `ocean`    | Sky blue, white                    | Auto-inverted |
| `forest`   | Green, white                       | Auto-inverted |
| `rose`     | Pink-red, white                    | Auto-inverted |
| `midnight` | **Dark-first** (light = indigo)    | Deeper indigo |
| `gold`     | Yellow, white                      | Auto-inverted |
| `slate`    | Cool gray, white                   | Auto-inverted |
| `candy`    | Pink, pill-shaped                  | Auto-inverted |
| `storm`    | **Dark-first** (light = dark gray) | Deeper gray   |
| `royal`    | **Dark-first** (light = purple)    | Deeper purple |

Themes auto-invert light→dark in system dark mode. Dark-native themes (`midnight`, `storm`, `royal`) keep their dark palette even in light mode — they invert the other way.

### Mode

```tsx
initMultistyleUI({ mode: "system" }); // follow OS → "light" | "dark"
initMultistyleUI({ mode: "light" }); // force light
initMultistyleUI({ mode: "dark" }); // force dark
```

### Font

```tsx
initMultistyleUI({ font: "auto" }); // per-style default font
initMultistyleUI({ font: "'Roboto', sans-serif" }); // override
```

Add `.ms-font-<style>` class to any wrapper to scope the style's font.

---

## Components

### Actions

- `Portal` — render children at document body via portal

### Form

- `Input` — text input with floating/above labels, icons
- `Textarea` — multi-line text input
- `Select` — custom dropdown with floating label
- `MultiSelect` — multi-value chip selector
- `Checkbox` — toggle checkbox
- `Radio` — radio button
- `Toggle` — switch toggle
- `Slider` — range slider
- `FileUpload` — drag-and-drop file upload
- `DatePicker` — calendar date picker
- `DropdownMenu` — dropdown menu list
- `CodeEditor` — syntax-highlighted code editor (Prism-based)
- `TextEditor` — rich text editor (contenteditable)

### Layout

- `Card` — container card with optional elevation
- `Divider` — horizontal separator
- `Row` — flex row layout
- `Column` — flex column layout
- `Grid` — CSS grid layout
- `Tabs` — tab switcher
- `Accordion` — collapsible sections
- `Modal` — dialog overlay
- `Drawer` — side panel
- `Carousel` — sliding carousel
- `CommandPalette` — ⌘K command palette (WIP)

### Navigation

- `Breadcrumb` — breadcrumb trail
- `Pagination` — page numbers
- `Stepper` — step progress indicator

### Data Display

- `Avatar` — user avatar with fallback
- `Chip` — tag/chip/badge
- `Tooltip` — hover tooltip
- `ProgressBar` — determinate progress bar
- `Table` — data table
- `Spinner` — loading spinner
- `Skeleton` — skeleton placeholder
- `ButtonGroup` — grouped buttons

### Feedback

- `Alert` — dismissible alert banners
- `Rating` — star rating
- `Popover` — click-triggered popover
- `Toast` — notification toast

### Charts (Chart.js)

- `Chart` — base chart component
- `BarChart`, `LineChart`, `PieChart`, `DoughnutChart`, `RadarChart`, `PolarAreaChart`
- `ScatterChart`, `BubbleChart`, `ComboChart`, `StackedBarChart`, `StackedLineChart`

### Buttons

- `Button` — themable button with variants
- `IconButton` — icon-only button
- `FAB` — floating action button

- `SortableList` — DnD sortable list

---

## Reactive Configuration

```tsx
import {
  useDefaults,
  initMultistyleUI,
  notifyDefaults,
  defaults,
} from "react-multistyle-ui";

function StyleSwitcher() {
  const cfg = useDefaults(); // re-renders on initMultistyleUI()
  return (
    <select
      value={cfg.style}
      onChange={(e) => initMultistyleUI({ style: e.target.value })}
    >
      ...
    </select>
  );
}

// Direct mutation + manual notify
defaults.style = "brutalist";
notifyDefaults();
```

`useDefaults()` uses `useSyncExternalStore` — all components re-render when defaults change.

---

## Theme API

```tsx
import { themes, generateThemeCss, applyThemeToElement } from "react-multistyle-ui";

// Build a custom theme config
const myTheme = { common: { primary: "#ff6600", ... }, light: { text: "#111", surface: "#fff" }, dark: { text: null, surface: null } };

// Generate CSS tokens
const { light, dark } = generateThemeCss("myTheme", myTheme);

// Apply to a DOM element
applyThemeToElement(document.documentElement, light);
```

Helper utils: `hexToHsl()`, `hslToCss()`, `invert()`, `invertHex()`.

---

## CLI (YAML → React generator)

Generate React pages from YAML:

```bash
npx react-multistyle-ui generate --input page.yaml --output ./src/routes/demo.tsx
npx react-multistyle-ui generate --input page.yaml --dry-run         # stdout
npx react-multistyle-ui generate --input page.yaml --output demo.tsx --style neon --theme midnight
```

Sample YAML:

```yaml
style: material
theme: ocean
mode: system
body:
  - Card:
      - Row:
          - Input:
              label: Username
              placeholder: Enter name
          - Button:
              label: Submit
              preset: primary
```

Supports compact indentation-based shorthand, standard nested YAML, and auto-detection. Run `npx react-multistyle-ui --help` for full options.

---

## Development

```bash
pnpm install
pnpm dev              # Vite dev server + gallery
pnpm build:lib        # Build library (theme gen → vite → tsc declarations)
pnpm gen:theme        # Regenerate theme CSS from presets
pnpm test             # Playwright tests
```

---

## License

MIT
