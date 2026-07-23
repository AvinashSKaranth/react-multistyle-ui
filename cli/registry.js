// Component registry for the YAML -> Svelte page generator.
// Keyed by the export name from src/lib/index.js. Every shipped component has
// exactly one entry. If a new component is exported from index.js, add a matching
// entry here and run `pnpm gen:sample` to verify the registry-completeness check.
//
// Entry shape:
//   importName        JS identifier emitted in the import statement (= key)
//   kind              "leaf" (no children) | "children" (implicit children snippet)
//                     | "container" (layout box wrapping children) | "multi-snippet"
//   bindable          prop names that are $bindable(...) in the component
//   primaryBindable   the prop used by the `bind: varName` shorthand
//   listProps         props whose YAML value is a sequence (documentation/validation)
//   objectProps       props whose YAML value is a map (documentation/validation)
//   snippets          named snippet props for multi-snippet kind
//   chart             forwards chart data/series/labels/options to the Chart base
//
// Note: emit.js treats ANY array prop as an inline JS array literal and ANY object
// prop as an inline JS object literal, so listProps/objectProps are advisory unless
// future validation needs them. They are kept for clarity and future strict checks.

/** @type {Record<string, any>} */
const registry = {
  // ---------------- Form ----------------
  Input:         { importName: "Input",         kind: "leaf",     bindable: ["value"],    primaryBindable: "value" },
  Textarea:      { importName: "Textarea",      kind: "leaf",     bindable: ["value"],    primaryBindable: "value" },
  TextEditor:    { importName: "TextEditor",    kind: "leaf",     bindable: ["value"],    primaryBindable: "value" },
  CodeEditor:    { importName: "CodeEditor",    kind: "leaf",     bindable: ["value"],    primaryBindable: "value" },
  Select:        { importName: "Select",        kind: "leaf",     bindable: ["value"],    primaryBindable: "value", listProps: ["options"] },
  MultiSelect:   { importName: "MultiSelect",   kind: "leaf",     bindable: ["selected"], primaryBindable: "selected", listProps: ["options"] },
  Checkbox:      { importName: "Checkbox",      kind: "leaf",     bindable: ["checked"],  primaryBindable: "checked" },
  Radio:         { importName: "Radio",         kind: "leaf",     bindable: ["group"],    primaryBindable: "group" },
  Toggle:        { importName: "Toggle",        kind: "leaf",     bindable: ["checked"],  primaryBindable: "checked" },
  Slider:        { importName: "Slider",        kind: "leaf",     bindable: ["value"],    primaryBindable: "value" },
  FileUpload:    { importName: "FileUpload",     kind: "leaf" },
  DatePicker:    { importName: "DatePicker",    kind: "leaf",     bindable: ["value"],    primaryBindable: "value" },
  ButtonGroup:   { importName: "ButtonGroup",   kind: "leaf",     bindable: ["value"],    primaryBindable: "value", listProps: ["items"] },
  SortableList:  { importName: "SortableList",  kind: "children", bindable: ["items"],    primaryBindable: "items",  listProps: ["items"] },

  // ---------------- Buttons ----------------
  Button:        { importName: "Button",        kind: "children" }, // onclick is a passthrough scalar prop, NOT bindable
  IconButton:    { importName: "IconButton",    kind: "children" },
  FAB:           { importName: "FAB",            kind: "children" },

  // ---------------- Layout ----------------
  Card:          { importName: "Card",          kind: "container" },
  Row:           { importName: "Row",           kind: "container" },
  Column:        { importName: "Column",        kind: "container" },
  Grid:          { importName: "Grid",          kind: "container" },
  Divider:       { importName: "Divider",       kind: "leaf" },
  Accordion:     { importName: "Accordion",     kind: "leaf", listProps: ["items"] },
  Carousel:      { importName: "Carousel",      kind: "leaf", listProps: ["slides"] },
  DropdownMenu:  { importName: "DropdownMenu",  kind: "children", listProps: ["items"] },

  // ---------------- Navigation ----------------
  Tabs:          { importName: "Tabs",          kind: "leaf",     bindable: ["active"],   primaryBindable: "active", listProps: ["tabs"] },
  Breadcrumb:    { importName: "Breadcrumb",    kind: "leaf",     listProps: ["items"] },
  Pagination:    { importName: "Pagination",    kind: "leaf",     bindable: ["current"],  primaryBindable: "current" },
  Stepper:       { importName: "Stepper",       kind: "leaf",     listProps: ["steps"] },

  // ---------------- Data Display ----------------
  Avatar:        { importName: "Avatar",        kind: "leaf" },
  Chip:          { importName: "Chip",          kind: "children" },
  Tooltip:       { importName: "Tooltip",       kind: "children" },
  ProgressBar:   { importName: "ProgressBar",   kind: "leaf" },
  Table:         { importName: "Table",         kind: "leaf",     listProps: ["data"] }, // columns derived at runtime from data[0]
  Spinner:       { importName: "Spinner",       kind: "leaf" },
  Skeleton:      { importName: "Skeleton",      kind: "leaf" },

  // ---------------- Feedback ----------------
  Alert:         { importName: "Alert",         kind: "children" },
  Rating:        { importName: "Rating",        kind: "leaf",     bindable: ["value"],    primaryBindable: "value" },
  Toast:         { importName: "Toast",         kind: "leaf",     bindable: ["toasts"],   primaryBindable: "toasts", listProps: ["toasts"] },

  // ---------------- Overlays ----------------
  Modal:         { importName: "Modal",         kind: "children", bindable: ["open"],    primaryBindable: "open" },
  Drawer:        { importName: "Drawer",        kind: "children", bindable: ["open"],    primaryBindable: "open" },
  CommandPalette:{ importName: "CommandPalette",kind: "leaf",     bindable: ["open"],    primaryBindable: "open", listProps: ["groups"] },
  Popover:       { importName: "Popover",       kind: "multi-snippet", snippets: ["children", "content"], bindable: ["open"], primaryBindable: "open" },

  // ---------------- Charts (all forward to Chart base) ----------------
  Chart:           { importName: "Chart",           kind: "leaf", chart: true, listProps: ["data", "series", "labels"], objectProps: ["options"] },
  BarChart:        { importName: "BarChart",        kind: "leaf", chart: true, listProps: ["data", "series", "labels"], objectProps: ["options"] },
  LineChart:       { importName: "LineChart",       kind: "leaf", chart: true, listProps: ["data", "series", "labels"], objectProps: ["options"] },
  PieChart:        { importName: "PieChart",        kind: "leaf", chart: true, listProps: ["data", "series", "labels"], objectProps: ["options"] },
  DoughnutChart:   { importName: "DoughnutChart",   kind: "leaf", chart: true, listProps: ["data", "series", "labels"], objectProps: ["options"] },
  RadarChart:      { importName: "RadarChart",      kind: "leaf", chart: true, listProps: ["data", "series", "labels"], objectProps: ["options"] },
  PolarAreaChart:  { importName: "PolarAreaChart",  kind: "leaf", chart: true, listProps: ["data", "series", "labels"], objectProps: ["options"] },
  ScatterChart:    { importName: "ScatterChart",    kind: "leaf", chart: true, listProps: ["data", "series", "labels"], objectProps: ["options"] },
  BubbleChart:     { importName: "BubbleChart",     kind: "leaf", chart: true, listProps: ["data", "series", "labels"], objectProps: ["options"] },
  StackedBarChart: { importName: "StackedBarChart", kind: "leaf", chart: true, listProps: ["data", "series", "labels"], objectProps: ["options"] },
  StackedLineChart:{ importName: "StackedLineChart",kind: "leaf", chart: true, listProps: ["data", "series", "labels"], objectProps: ["options"] },
  ComboChart:      { importName: "ComboChart",      kind: "leaf", chart: true, listProps: ["data", "series", "labels"], objectProps: ["options"] },
};

// Exported component names — used by the registry-completeness check to diff
// against src/lib/index.js. Keep in sync with index.js when adding components.
export const registryKeys = Object.keys(registry);

export { registry };