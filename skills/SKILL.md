---
name: react-multistyle-ui
description: How to use, configure, and theme the react-multistyle-ui React 18 component library. Use this skill whenever the user is working with react-multistyle-ui — importing components, choosing a visual style (material, material3, fluent, brutalist, pixel, neon, metro, bootstrap, cartoon, illustration, carbon, liquid-glass), choosing or creating a color theme (default, ocean, forest, rose, midnight, gold, slate, candy, storm, royal, or a custom `.theme-*` preset), wiring dark/light mode, calling `initMultistyleUI`, using the `portal` action, or asking what components/props are available. Trigger it even when the user doesn't name the library explicitly but is building a React 18 UI with multi-style/multi-theme components, asks for Material/Fluent/Brutalist/Liquid-Glass style components, or wants to create a custom color theme with `--t-*` tokens. Do NOT use for general React, Tailwind, or chart.js questions unrelated to this library.
---

# react-multistyle-ui — LLM Reference

A multi-style, multi-theme React 18 component library. Port of svelte-multistyle-ui.

## 1. Init

```tsx
import { initMultistyleUI } from "react-multistyle-ui";
import "react-multistyle-ui/style.css";

initMultistyleUI({
  style: "material", // design language (see below)
  theme: "default", // color scheme
  mode: "system", // "system" | "light" | "dark"
  font: "auto", // per-style default, or CSS font-family string
});
```

Per-component props override defaults:

```tsx
<Button style="brutalist" theme="midnight" variant="outlined" />
```

## 2. Design Styles

| Name           | Vibe                      |
| -------------- | ------------------------- |
| `material`     | Google Material Design    |
| `material3`    | Material 3 / Material You |
| `fluent`       | Microsoft Fluent          |
| `brutalist`    | Raw, monospace, bold      |
| `neon`         | Cyberpunk glow            |
| `metro`        | Windows 8/10 Modern UI    |
| `bootstrap`    | Bootstrap-like            |
| `cartoon`      | Playful, Comic Neue       |
| `illustration` | Whimsical, cursive        |
| `liquid-glass` | Glassmorphism             |
| `carbon`       | IBM Carbon                |
| `pixel`        | Retro pixel-art           |

## 3. Color Themes

| Name       | Type            | Light Colors                |
| ---------- | --------------- | --------------------------- |
| `default`  | Light-first     | Blue primary, white surface |
| `ocean`    | Light-first     | Sky blue, white             |
| `forest`   | Light-first     | Green, white                |
| `rose`     | Light-first     | Pink-red, white             |
| `midnight` | **Dark-native** | Indigo (already dark)       |
| `gold`     | Light-first     | Yellow, white               |
| `slate`    | Light-first     | Cool gray, white            |
| `candy`    | Light-first     | Pink, white                 |
| `storm`    | **Dark-native** | Dark gray (already dark)    |
| `royal`    | **Dark-native** | Purple (already dark)       |

Light-first = auto-invert for dark mode. Dark-native = keep dark palette always.

## 4. Component List (one-liner)

Usage references in [`references/`](references/) — click component name.

| Component                                        | Description                                                                |
| ------------------------------------------------ | -------------------------------------------------------------------------- |
| [`Button`](references/Button.md)                 | Themable button. variant (filled/outlined/text/tonal), preset, size, icon  |
| [`IconButton`](references/IconButton.md)         | Icon-only button. icon, ariaLabel, variant, preset, size                   |
| [`FAB`](references/FAB.md)                       | Floating action button. icon, label, position                              |
| [`Input`](references/Input.md)                   | Text input with floating/above label. label, value, onValueChange, icons   |
| [`Textarea`](references/Textarea.md)             | Multi-line text input. label, value, rows                                  |
| [`Select`](references/Select.md)                 | Custom dropdown. options[{value,label}], value, onValueChange              |
| [`MultiSelect`](references/MultiSelect.md)       | Multi-value chip selector. values[], onValuesChange                        |
| [`Checkbox`](references/Checkbox.md)             | Toggle checkbox. checked, onCheckedChange, label                           |
| [`Radio`](references/Radio.md)                   | Radio button. checked, onCheckedChange, label, value, name                 |
| [`Toggle`](references/Toggle.md)                 | Switch toggle. checked, onCheckedChange, label                             |
| [`Slider`](references/Slider.md)                 | Range slider. value, onValueChange, min, max, step                         |
| [`FileUpload`](references/FileUpload.md)         | Drag-and-drop upload. accept, multiple, maxSize                            |
| [`DatePicker`](references/DatePicker.md)         | Calendar date picker. value (YYYY-MM-DD), onValueChange, min, max          |
| [`DropdownMenu`](references/DropdownMenu.md)     | Action menu with optional dividers. items[{label,divider?,icon?}]          |
| [`CodeEditor`](references/CodeEditor.md)         | Syntax-highlighted editor (Prism). value, language                         |
| [`TextEditor`](references/TextEditor.md)         | Rich text editor (contenteditable). value, toolbar                         |
| [`Card`](references/Card.md)                     | Container card. padding (sm/md/lg/none), elevated                          |
| [`Row`](references/Row.md)                       | Flex row. gap, align, justify, wrap                                        |
| [`Column`](references/Column.md)                 | Flex column. gap, align, justify                                           |
| [`Grid`](references/Grid.md)                     | CSS grid. columns (number), gap                                            |
| [`Divider`](references/Divider.md)               | Horizontal line. label, inset                                              |
| [`Tabs`](references/Tabs.md)                     | Tab switcher. tabs[{id,label}], active, onActiveChange                     |
| [`Accordion`](references/Accordion.md)           | Collapsible sections. items[{id,title,content}]                            |
| [`Modal`](references/Modal.md)                   | Dialog overlay. open, onOpenChange, title, size                            |
| [`Drawer`](references/Drawer.md)                 | Side panel. open, onOpenChange, side (left/right)                          |
| [`Carousel`](references/Carousel.md)             | Sliding carousel. items, autoplay, interval                                |
| [`CommandPalette`](references/CommandPalette.md) | ⌘K command palette (WIP). open, commands[{id,label,action}]                |
| [`Breadcrumb`](references/Breadcrumb.md)         | Breadcrumb trail. items[{label,href?}]                                     |
| [`Pagination`](references/Pagination.md)         | Page navigation. total, perPage, page, onPageChange                        |
| [`Stepper`](references/Stepper.md)               | Step indicator. steps[{label}], current (index), orientation               |
| [`Avatar`](references/Avatar.md)                 | User avatar. src, alt, fallback (initials), size                           |
| [`Chip`](references/Chip.md)                     | Tag/chip. children, variant (filled/outlined), onRemove, icon              |
| [`Tooltip`](references/Tooltip.md)               | Hover tooltip. text, position, children (trigger)                          |
| [`ProgressBar`](references/ProgressBar.md)       | Determinate bar. value (0-100), preset                                     |
| [`Spinner`](references/Spinner.md)               | Loading spinner. size (sm/md/lg), color                                    |
| [`Skeleton`](references/Skeleton.md)             | Skeleton placeholder. width, height, variant (text/circular/rectangular)   |
| [`Table`](references/Table.md)                   | Data table. columns[], rows[], sortable                                    |
| [`ButtonGroup`](references/ButtonGroup.md)       | Grouped buttons. items[{value,label}], value, onValueChange                |
| [`Alert`](references/Alert.md)                   | Dismissible alert. preset (info/success/warning/error), title, dismissible |
| [`Rating`](references/Rating.md)                 | Star rating. value, onValueChange, max, readonly                           |
| [`Popover`](references/Popover.md)               | Click-triggered popover. content, position, children                       |
| [`Toast`](references/Toast.md)                   | Notification toast. message, preset, duration                              |
| [`Chart`](references/Chart.md)                   | Base Chart.js chart. type, data, options                                   |
| [`BarChart`](references/Chart.md)                | Bar chart                                                                  |
| [`LineChart`](references/Chart.md)               | Line chart                                                                 |
| [`PieChart`](references/Chart.md)                | Pie chart                                                                  |
| [`DoughnutChart`](references/Chart.md)           | Doughnut chart                                                             |
| [`RadarChart`](references/Chart.md)              | Radar chart                                                                |
| [`PolarAreaChart`](references/Chart.md)          | Polar area chart                                                           |
| [`ScatterChart`](references/Chart.md)            | Scatter chart                                                              |
| [`BubbleChart`](references/Chart.md)             | Bubble chart                                                               |
| [`ComboChart`](references/Chart.md)              | Combo (bar+line) chart                                                     |
| [`StackedBarChart`](references/Chart.md)         | Stacked bar chart                                                          |
| [`StackedLineChart`](references/Chart.md)        | Stacked line chart                                                         |
| [`SortableList`](references/SortableList.md)     | DnD sortable (dnd-kit). items, onItemsChange                               |
| [`Portal`](references/Portal.md)                 | Render children at document.body                                           |

## 5. Common Props

All components accept these props:

| Prop        | Type     | Default          | Description                                        |
| ----------- | -------- | ---------------- | -------------------------------------------------- |
| `style`     | `string` | from global init | Override design style                              |
| `theme`     | `string` | from global init | Override color theme                               |
| `className` | `string` | `""`             | Additional CSS classes (merged via tailwind-merge) |

## 6. Reactive Defaults

```tsx
import {
  useDefaults,
  initMultistyleUI,
  notifyDefaults,
  defaults,
  iconClass,
} from "react-multistyle-ui";

function ThemePicker() {
  const cfg = useDefaults(); // re-renders on every initMultistyleUI call
  return (
    <select
      value={cfg.style}
      onChange={(e) => initMultistyleUI({ style: e.target.value })}
    >
      ...
    </select>
  );
}

// Direct mutation
defaults.mode = "dark";
notifyDefaults();

// Icon class (default: "material-symbols-outlined")
iconClass; // string
```

## 7. Theme API

```tsx
import {
  themes,
  generateThemeCss,
  applyThemeToElement,
  resolveLight,
  resolveDark,
} from "react-multistyle-ui";

// Access or extend theme configs
themes.default; // { common: { primary: "#2563eb", ... }, light: { ... }, dark: { ... } }
themes.ocean; // etc.

// Generate CSS strings from a theme config
const { light, dark } = generateThemeCss("custom", myThemeConfig);

// Apply CSS tokens to an element
applyThemeToElement(document.documentElement, lightCss);

// Resolve light/dark variant
const lightTokens = resolveLight(themeConfig);
const darkTokens = resolveDark(themeConfig);

// Color utilities
hexToHsl("#2563eb"); // { h: 221, s: 0.8, l: 0.53 }
hslToCss({ h: 221, s: 0.8, l: 0.53 }); // "221deg 80% 53%"
invert("#2563eb"); // inverted HSL object
invertHex("#2563eb"); // inverted hex
```

## 8. CLI (YAML → React Code Generator)

```bash
npx react-multistyle-ui generate --input page.yaml --output ./page.tsx
npx react-multistyle-ui generate --input page.yaml --dry-run
npx react-multistyle-ui generate --input page.yaml --output demo.tsx --style neon --theme midnight
npx react-multistyle-ui generate --input page.yaml --output demo.tsx --watch
```

YAML schema — top-level keys: `style`, `theme`, `mode`, `state`, `onMount`, `imports`, `body`.
Body is a tree of component nodes. Each component may have children.
Supports: standard nested YAML, compact indentation-based shorthand.

## 9. Exports Summary

| Import path                          | Exports                                                                                                                                                                                                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `react-multistyle-ui`                | All components, `initMultistyleUI`, `useDefaults`, `defaults`, `notifyDefaults`, `iconClass`, `themes`, `generateThemeCss`, `applyThemeToElement`, `cn`, `Portal`, `hexToHsl`, `hslToCss`, `invert`, `invertHex`, `styleFonts`, `fontOptions`, `SYSTEM_FONT` |
| `react-multistyle-ui/style.css`      | Full bundled stylesheet (all styles + themes)                                                                                                                                                                                                                |
| `react-multistyle-ui/theme.css`      | Theme tokens only (auto-generated from presets)                                                                                                                                                                                                              |
| `react-multistyle-ui/theme-base.css` | Base theme CSS variables                                                                                                                                                                                                                                     |
| `react-multistyle-ui/themes`         | `themes` object indexed by name                                                                                                                                                                                                                              |
