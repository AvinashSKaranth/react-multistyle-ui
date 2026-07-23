import { useEffect, useMemo, useRef, useState } from "react";
import {
  initMultistyleUI,
  useDefaults,
  iconClass,
  themes as presetConfigs,
  generateThemeCss,
  applyThemeToElement,
  invertHex,
  fontOptions,
  // components
  Input, Button, IconButton, Textarea, Select, MultiSelect, Checkbox, Radio, Toggle, Slider,
  FileUpload, DatePicker, Card, Divider, Tabs, Carousel, Accordion, Modal, Breadcrumb, Pagination,
  Stepper, Avatar, Tooltip, ProgressBar, Table, Alert, Spinner, Skeleton, FAB, Toast, SortableList,
  DropdownMenu, Popover, Drawer, Chip, ButtonGroup, TextEditor, CodeEditor, Rating, CommandPalette,
  Row, Column, Grid,
  // charts
  BarChart, LineChart, PieChart, DoughnutChart, RadarChart, PolarAreaChart, ScatterChart, BubbleChart,
  StackedBarChart, StackedLineChart,
} from "./lib";
import Prism from "prismjs";

const STYLES = [
  { value: "material", label: "Material Design" },
  { value: "liquid-glass", label: "Liquid Glass" },
  { value: "material3", label: "Material You (M3)" },
  { value: "fluent", label: "Fluent UI" },
  { value: "brutalist", label: "Brutalist UI" },
  { value: "pixel", label: "Pixel UI" },
  { value: "neon", label: "Neon UI" },
  { value: "metro", label: "Metro UI" },
  { value: "bootstrap", label: "Bootstrap" },
  { value: "cartoon", label: "Cartoon" },
  { value: "illustration", label: "Illustration" },
  { value: "carbon", label: "Carbon" },
];

const THEMES = [
  { value: "default", label: "Default (Indigo)" },
  { value: "ocean", label: "Ocean" },
  { value: "forest", label: "Forest" },
  { value: "rose", label: "Rose" },
  { value: "midnight", label: "Midnight" },
  { value: "gold", label: "Gold" },
  { value: "slate", label: "Slate" },
  { value: "candy", label: "Candy" },
  { value: "storm", label: "Storm" },
  { value: "royal", label: "Royal" },
  { value: "custom", label: "Custom" },
];

const MODES = [
  { value: "light", label: "☀️ Light" },
  { value: "dark", label: "🌙 Dark" },
  { value: "system", label: "💻 System" },
];

const RADIUS_OPTIONS = ["0px", "2px", "4px", "8px", "16px", "32px", "9999px"];
const BORDER_WIDTHS = ["1px", "1.5px", "2px"];
const DARK_LIFT = { text: 20, surface: 10, cardSurface: 14 };

const CATEGORY_TABS = [
  { id: "form", label: "Form" },
  { id: "layout", label: "Layout" },
  { id: "navigation", label: "Navigation" },
  { id: "datadisplay", label: "Data Display" },
  { id: "feedback", label: "Feedback" },
  { id: "charts", label: "Charts" },
];

function highlight(code: string) {
  return Prism.highlight(code, Prism.languages.markup, "markup");
}

/** A demo card: title + preview/code tabs. */
function DemoCard({
  title, code, style, theme, children, span,
}: {
  title: string; code: string; style: string; theme: string;
  children: React.ReactNode; span?: string;
}) {
  const [tab, setTab] = useState("preview");
  return (
    <Card style={style} theme={theme} elevated className={span ? `md:col-span-${span}` : ""}>
      <p className="demo-label uppercase text-xs font-bold tracking-wider mb-2">{title}</p>
      <Tabs style={style} theme={theme} tabs={[{ id: "preview", label: "👁 Preview" }, { id: "code", label: "</> Code" }]} active={tab} onActiveChange={setTab} />
      <div className="mt-3">
        {tab === "preview" ? children : (
          <CodeEditor style={style} theme={theme} language="markup" editable={false} rows={6} value={code} />
        )}
      </div>
    </Card>
  );
}

export default function App() {
  const d = useDefaults();
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const [selectedStyle, setSelectedStyle] = useState(params.get("style") || "material");
  const [selectedTheme, setSelectedTheme] = useState(params.get("theme") || "default");
  const [mode, setMode] = useState(params.get("mode") || "system");
  const [selectedFont, setSelectedFont] = useState(params.get("font") || "auto");
  const [editorConfig, setEditorConfig] = useState(() => structuredClone((presetConfigs as any)[selectedTheme] || (presetConfigs as any).default));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const demoEl = useRef<HTMLDivElement>(null);

  const isDarkMode = d.mode === "dark" || (d.mode === "system" && d.systemDark);

  // Push header selections into the global store.
  useEffect(() => {
    initMultistyleUI({ style: selectedStyle, theme: selectedTheme, mode: mode as any, font: selectedFont });
  }, [selectedStyle, selectedTheme, mode, selectedFont]);

  // Toggle dark/light classes on <html>.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Reload editor from preset when theme changes (skip custom).
  useEffect(() => {
    if (selectedTheme !== "custom" && (presetConfigs as any)[selectedTheme]) {
      setEditorConfig(structuredClone((presetConfigs as any)[selectedTheme]));
    }
  }, [selectedTheme]);

  // Live-apply editor config to the demo root.
  useEffect(() => {
    if (demoEl.current) applyThemeToElement(demoEl.current, editorConfig, isDarkMode);
  }, [editorConfig, isDarkMode]);

  // Escape closes settings.
  useEffect(() => {
    if (!settingsOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setSettingsOpen(false); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [settingsOpen]);

  // ---- per-component demo state ----
  const [inputVal, setInputVal] = useState("");
  const [textareaVal, setTextareaVal] = useState("");
  const [selectVal, setSelectVal] = useState("");
  const [multiSelectVal, setMultiSelectVal] = useState<string[]>([]);
  const [checkVal, setCheckVal] = useState(false);
  const [radioVal, setRadioVal] = useState("a");
  const [toggleVal, setToggleVal] = useState(true);
  const [sliderVal, setSliderVal] = useState(40);
  const [dateVal, setDateVal] = useState("");
  const [tabActive, setTabActive] = useState("overview");
  const [btnPreset, setBtnPreset] = useState("primary");
  const [btnVariant, setBtnVariant] = useState<"filled" | "outlined" | "text" | "tonal">("filled");
  const [alertPreset, setAlertPreset] = useState<"info" | "success" | "warning" | "error">("info");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState("medium");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPosition, setDrawerPosition] = useState("left");
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [paginationPage, setPaginationPage] = useState(1);
  const [progressVal] = useState(65);
  const [ratingVal, setRatingVal] = useState(3);
  const [sortableItems, setSortableItems] = useState<any[]>([
    { id: "1", label: "First task" }, { id: "2", label: "Second task" }, { id: "3", label: "Third task" },
  ]);
  const [sortableNested, setSortableNested] = useState<any[]>([
    { id: "p1", label: "Parent A" }, { id: "p2", label: "Parent B" },
  ]);
  const [toasts, setToasts] = useState<any[]>([]);
  const [toastPosition, setToastPosition] = useState("top-right");
  const [textEditorHtml, setTextEditorHtml] = useState("<p>Hello <b>world</b></p>");
  const [teInjectOpen, setTeInjectOpen] = useState(false);
  const [teExtractOpen, setTeExtractOpen] = useState(false);
  const [codeEditorVal, setCodeEditorVal] = useState("const sum = (a, b) => a + b;\nconsole.log(sum(2, 3));");
  const [activeCat, setActiveCat] = useState("form");
  const [btnGroupVal, setBtnGroupVal] = useState("day");

  const selectOptions = [
    { value: "apple", label: "Apple" }, { value: "banana", label: "Banana" }, { value: "cherry", label: "Cherry" },
  ];
  const tableData = [
    { Name: "Alice", Age: "30", City: "NYC" },
    { Name: "Bob", Age: "25", City: "LA" },
    { Name: "Carol", Age: "35", City: "SF" },
  ];
  const dropdownItems = [
    { label: "Edit", icon: "edit", shortcut: "⌘E" },
    { label: "Duplicate", icon: "content_copy" },
    { divider: true },
    { label: "Delete", icon: "delete", disabled: true },
  ];
  const btnGroupItems = [
    { value: "day", label: "Day" }, { value: "week", label: "Week" }, { value: "month", label: "Month" },
  ];
  const cmdGroups = [
    { label: "Actions", items: [
      { label: "New file", icon: "add", shortcut: "⌘N", onclick: () => addToastMsg("New file", "success") },
      { label: "Open", icon: "folder_open", shortcut: "⌘O", onclick: () => addToastMsg("Opened", "info") },
    ]},
    { label: "Settings", items: [
      { label: "Toggle theme", icon: "dark_mode", onclick: () => setMode(mode === "dark" ? "light" : "dark") },
    ]},
  ];
  const carouselSlides = [
    { image: "https://picsum.photos/seed/a/600/300", caption: "First slide" },
    { image: "https://picsum.photos/seed/b/600/300", caption: "Second slide" },
    { image: "https://picsum.photos/seed/c/600/300", caption: "Third slide" },
  ];
  const accordionItems = [
    { id: "1", title: "Section one", content: "Content for section one." },
    { id: "2", title: "Section two", content: "Content for section two." },
    { id: "3", title: "Section three", content: "Content for section three." },
  ];

  function addToastMsg(message: string, preset: any, icon?: string) {
    const id = Date.now() + Math.random();
    const next = [...toasts, { id, message, preset, duration: 3000, icon }];
    setToasts(next);
    setTimeout(() => setToasts((t: any[]) => t.filter((x) => x.id !== id)), 3000);
  }

  const customCss = useMemo(() => {
    const { light, dark } = generateThemeCss("custom", editorConfig as any);
    return `/* .theme-custom */\n${light}\n\n/* html.dark .theme-custom */\n${dark}`;
  }, [editorConfig]);

  function copyCustomCss() {
    navigator.clipboard.writeText(customCss).then(() => {
      setCopyStatus("Copied");
      setTimeout(() => setCopyStatus(""), 1800);
    });
  }

  const st = selectedStyle, th = selectedTheme;
  const sectionCls = (id: string) => (activeCat !== id ? "hidden" : "");
  const gridCls = (cols: string) => `grid gap-4 ${cols}`;

  const selectOptionsCode = JSON.stringify(selectOptions);
  const dropdownItemsCode = JSON.stringify(dropdownItems);
  const btnGroupItemsCode = JSON.stringify(btnGroupItems);
  const accordionItemsCode = JSON.stringify(accordionItems);
  const carouselSlidesCode = JSON.stringify(carouselSlides);
  const tableDataCode = JSON.stringify(tableData);
  const cmdGroupsCode = JSON.stringify(cmdGroups);
  const barDataCode = JSON.stringify([{label:"q1",value:12},{label:"q2",value:19},{label:"q3",value:8},{label:"q4",value:15}]);
  const lineDataCode = JSON.stringify([{label:"Jan",revenue:10,Cost:5},{label:"Feb",revenue:20,Cost:8},{label:"Mar",revenue:15,Cost:6},{label:"Apr",revenue:25,Cost:9}]);
  const pieDataCode = JSON.stringify([{label:"Direct",value:35},{label:"Social",value:25},{label:"Referral",value:20},{label:"Organic",value:20}]);
  const doughnutDataCode = JSON.stringify([{label:"Chrome",value:65},{label:"Firefox",value:15},{label:"Safari",value:10},{label:"Edge",value:5},{label:"Other",value:5}]);
  const radarDataCode = JSON.stringify([{label:"Speed","Character A":8,"Character B":6},{label:"Power","Character A":7,"Character B":9},{label:"Accuracy","Character A":9,"Character B":5},{label:"Defense","Character A":6,"Character B":8},{label:"Agility","Character A":7,"Character B":7}]);
  const polarDataCode = JSON.stringify([{label:"Red",value:11},{label:"Blue",value:16},{label:"Green",value:7},{label:"Yellow",value:3},{label:"Purple",value:14}]);
  const scatterDataCode = JSON.stringify([{x:1,y:2},{x:2,y:5},{x:3,y:3},{x:4,y:7},{x:5,y:4},{x:6,y:6},{x:7,y:8},{x:8,y:5}]);
  const bubbleDataCode = JSON.stringify([{label:"A",x:10,y:20,r:5},{label:"B",x:30,y:40,r:10},{label:"C",x:50,y:15,r:8},{label:"D",x:20,y:30,r:6},{label:"E",x:40,y:25,r:12}]);
  const stackedBarDataCode = JSON.stringify([{label:"Q1","Product A":10,"Product B":20,"Product C":15},{label:"Q2","Product A":15,"Product B":25,"Product C":10},{label:"Q3","Product A":20,"Product B":15,"Product C":20}]);
  const stackedLineDataCode = JSON.stringify([{label:"W1",EMEA:10,APAC:20,NA:15},{label:"W2",EMEA:15,APAC:25,NA:20},{label:"W3",EMEA:20,APAC:30,NA:25},{label:"W4",EMEA:25,APAC:35,NA:30}]);

  return (
    <div
      ref={demoEl}
      className={`demo-root page-bg min-h-screen transition-colors duration-300 theme-${selectedTheme} ${selectedStyle === "liquid-glass" ? "glass-page-bg" : ""} ${isDarkMode ? "dark-mode" : ""}`}
    >
      {/* ===== HEADER ===== */}
      <header className="page-header sticky top-0 z-50 border-b px-6 py-4 flex items-center gap-4 flex-wrap">
        <h1 className="page-title text-xl font-bold mr-auto">react-multistyle-ui</h1>
        <label className="header-label text-xs">Style
          <select id="style-sel" className="header-select ml-1 rounded border px-2 py-1" value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)}>
            {STYLES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
        <label className="header-label text-xs">Theme
          <select id="theme-sel" className="header-select ml-1 rounded border px-2 py-1" value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)}>
            {THEMES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </label>
        <label className="header-label text-xs">Mode
          <select id="mode-sel" className="header-select ml-1 rounded border px-2 py-1" value={mode} onChange={(e) => setMode(e.target.value)}>
            {MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </label>
        <label className="header-label text-xs">Font
          <select className="header-select ml-1 rounded border px-2 py-1" value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)}>
            {fontOptions.map((f: any) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </label>
        <button className="settings-gear" aria-label="Open theme settings" onClick={() => setSettingsOpen(true)}>
          <span className={iconClass}>tune</span>
        </button>
      </header>

      {/* ===== THEME EDITOR SIDEBAR ===== */}
      {settingsOpen ? (
        <>
          <div className="settings-backdrop" onClick={() => setSettingsOpen(false)} />
          <aside className="settings-sidebar" role="dialog" aria-labelledby="theme-settings-title">
            <div className="settings-sidebar-header">
              <h2 id="theme-settings-title" className="text-lg font-bold">Theme Editor</h2>
              <button className="settings-close" aria-label="Close" onClick={() => setSettingsOpen(false)}>×</button>
            </div>
            <div className="settings-content">
              <Card style={st} theme={th} elevated>
                <h3 className="settings-panel-title">Theme Editor</h3>
                <div className="settings-panel">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ["primary", "Primary"], ["secondary", "Secondary"], ["info", "Info"],
                      ["success", "Success"], ["warning", "Warning"], ["error", "Error"], ["textOnPrimary", "Text on Primary"],
                    ].map(([k, lbl]) => (
                      <label key={k} className="text-xs flex items-center gap-1">
                        <input type="color" value={(editorConfig as any).common[k]} onChange={(e) => setEditorConfig((c: any) => ({ ...c, common: { ...c.common, [k]: e.target.value } }))} />
                        {lbl}
                      </label>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {(["buttonRadius", "cardRadius", "inputRadius"] as const).map((rk) => (
                      <div key={rk} className="text-xs">
                        <div className="mb-1">{rk}</div>
                        <div className="flex flex-wrap gap-1">
                          {RADIUS_OPTIONS.map((r) => (
                            <button key={r} className={`border rounded px-1 ${(editorConfig as any).common[rk] === r ? "bg-[var(--t-primary)] text-white" : ""}`} onClick={() => setEditorConfig((c: any) => ({ ...c, common: { ...c.common, [rk]: r } }))}>{r}</button>
                          ))}
                          <button className="border rounded px-1" onClick={() => setEditorConfig((c: any) => ({ ...c, common: { ...c.common, [rk]: null } }))}>na</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs mt-2">
                    <div className="mb-1">Border Width</div>
                    <div className="flex gap-1">
                      {BORDER_WIDTHS.map((b) => (
                        <button key={b} className={`border rounded px-2 ${(editorConfig as any).common.borderWidth === b ? "bg-[var(--t-primary)] text-white" : ""}`} onClick={() => setEditorConfig((c: any) => ({ ...c, common: { ...c.common, borderWidth: b } }))}>{b}</button>
                      ))}
                      <button className="border rounded px-2" onClick={() => setEditorConfig((c: any) => ({ ...c, common: { ...c.common, borderWidth: null } }))}>na</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <div className="text-xs mb-1">Light</div>
                      {["text", "surface", "cardSurface"].map((k) => (
                        <label key={k} className="text-xs flex items-center gap-1">
                          <input type="color" value={(editorConfig as any).light[k]} onChange={(e) => setEditorConfig((c: any) => ({ ...c, light: { ...c.light, [k]: e.target.value } }))} />{k}
                        </label>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs mb-1">Dark</div>
                      {["text", "surface", "cardSurface"].map((k) => (
                        <div key={k} className="text-xs">
                          <label className="flex items-center gap-1">
                            <input type="checkbox" checked={(editorConfig as any).dark[k] === null} onChange={(e) => setEditorConfig((c: any) => ({ ...c, dark: { ...c.dark, [k]: e.target.checked ? null : (c.dark[k] ?? c.light[k]) } }))} /> derive
                          </label>
                          <input type="color" disabled={(editorConfig as any).dark[k] === null} value={(editorConfig as any).dark[k] ?? invertHex((editorConfig as any).light[k], (DARK_LIFT as any)[k])} onChange={(e) => setEditorConfig((c: any) => ({ ...c, dark: { ...c.dark, [k]: e.target.value } }))} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
              <Card style={st} theme={th} elevated>
                <h3 className="settings-panel-title">Custom CSS</h3>
                <pre className="custom-css-code"><code>{customCss}</code></pre>
                <button className="settings-copy-button mt-2" onClick={copyCustomCss}>Copy CSS</button>
                {copyStatus ? <span className="settings-copy-status block mt-1">{copyStatus}</span> : null}
              </Card>
              <Card style={st} theme={th} elevated>
                <h3 className="settings-panel-title">How to use custom CSS</h3>
                <ul className="text-xs list-disc pl-4 space-y-1">
                  <li>Import <code>theme-base.css</code> first, then your custom theme CSS.</li>
                  <li>Name your class <code>.theme-custom</code> (or any <code>.theme-* </code>).</li>
                  <li>Use <code>theme="custom"</code> on components.</li>
                  <li>Override <code>.s-&lt;component&gt;-&lt;style&gt;</code> for per-style tweaks.</li>
                </ul>
              </Card>
            </div>
          </aside>
        </>
      ) : null}

      <main className="p-4 md:p-6">
        <div className="category-tabs mb-6">
          <Tabs style={st} theme={th} tabs={CATEGORY_TABS} active={activeCat} onActiveChange={setActiveCat} />
        </div>

        {/* ===== FORM ===== */}
        <section className={sectionCls("form")}>
          <h2 className="demo-section-title text-2xl font-bold border-b pb-2 mb-4">Form Components</h2>
          <div className={gridCls("grid-cols-1 md:grid-cols-2 lg:grid-cols-3")}>
            <DemoCard title="Buttons" style={st} theme={th} code={`<Row gap="8px" wrap>
  <Select
    options={${JSON.stringify([{value:"primary",label:"primary"},{value:"secondary",label:"secondary"},{value:"info",label:"info"},{value:"success",label:"success"},{value:"warning",label:"warning"},{value:"error",label:"error"}])}}
    value="${btnPreset}"
  />
  <Select
    options={${JSON.stringify([{value:"filled",label:"filled"},{value:"outlined",label:"outlined"},{value:"text",label:"text"},{value:"tonal",label:"tonal"}])}}
    value="${btnVariant}"
  />
</Row>
<Row gap="8px" wrap className="mt-3">
  <Button
    preset="${btnPreset}"
    variant="${btnVariant}"
  >Button</Button>
  <Button
    preset="${btnPreset}"
    variant="${btnVariant}"
    icon="add"
  >Add</Button>
  <IconButton
    preset="${btnPreset}"
    icon="favorite"
    ariaLabel="fav"
  />
</Row>`}>
              <Row gap="8px" wrap>
                <Select style={st} theme={th} options={[{value:"primary",label:"primary"},{value:"secondary",label:"secondary"},{value:"info",label:"info"},{value:"success",label:"success"},{value:"warning",label:"warning"},{value:"error",label:"error"}]} value={btnPreset} onValueChange={setBtnPreset} />
                <Select style={st} theme={th} options={[{value:"filled",label:"filled"},{value:"outlined",label:"outlined"},{value:"text",label:"text"},{value:"tonal",label:"tonal"}]} value={btnVariant} onValueChange={(v) => setBtnVariant(v as any)} />
              </Row>
              <Row gap="8px" wrap className="mt-3">
                <Button style={st} theme={th} preset={btnPreset} variant={btnVariant}>Button</Button>
                <Button style={st} theme={th} preset={btnPreset} variant={btnVariant} icon="add">Add</Button>
                <IconButton style={st} theme={th} preset={btnPreset} icon="favorite" ariaLabel="fav" />
              </Row>
            </DemoCard>

            <DemoCard title="Input" style={st} theme={th} code={`<Input
  label="Name"
  placeholder="Enter name"
  value="${inputVal}"
/>
<Input
  placeholder="Search"
  iconStart="search"
  value="${inputVal}"
/>
<Input
  label="Password"
  type="password"
  iconStart="lock"
  iconEnd="visibility"
  value="${inputVal}"
/>`}>
              <Column gap="8px">
                <Input style={st} theme={th} label="Name" placeholder="Enter name" value={inputVal} onValueChange={setInputVal} />
                <Input style={st} theme={th} placeholder="Search" iconStart="search" value={inputVal} onValueChange={setInputVal} />
                <Input style={st} theme={th} label="Password" type="password" iconStart="lock" iconEnd="visibility" value={inputVal} onValueChange={setInputVal} />
              </Column>
            </DemoCard>

            <DemoCard title="Textarea" style={st} theme={th} code={`<Textarea
  label="Message"
  rows={3}
  maxlength={200}
  value="${textareaVal}"
/>`}>
              <Textarea style={st} theme={th} label="Message" rows={3} maxlength={200} value={textareaVal} onValueChange={setTextareaVal} />
            </DemoCard>

            <DemoCard title="Select" style={st} theme={th} code={`<Select
  label="Choose"
  options={${selectOptionsCode}}
  value="${selectVal}"
/>`}>
              <Select style={st} theme={th} label="Choose" options={selectOptions} value={selectVal} onValueChange={setSelectVal} />
            </DemoCard>

            <DemoCard title="MultiSelect" style={st} theme={th} code={`<MultiSelect
  options={${selectOptionsCode}}
  selected={${JSON.stringify(multiSelectVal)}}
/>`}>
              <MultiSelect style={st} theme={th} options={selectOptions} selected={multiSelectVal} onSelectedChange={setMultiSelectVal} />
            </DemoCard>

            <DemoCard title="Checkbox" style={st} theme={th} code={`<Checkbox
  label="Accept terms"
  checked={${checkVal}}
/>`}>
              <Checkbox style={st} theme={th} label="Accept terms" checked={checkVal} onCheckedChange={setCheckVal} />
            </DemoCard>

            <DemoCard title="Radio" style={st} theme={th} code={`<Radio
  value="a"
  group="${radioVal}"
  label="Option A"
/>
<Radio
  value="b"
  group="${radioVal}"
  label="Option B"
/>`}>
              <Column gap="6px">
                <Radio style={st} theme={th} value="a" group={radioVal} onGroupChange={setRadioVal} label="Option A" />
                <Radio style={st} theme={th} value="b" group={radioVal} onGroupChange={setRadioVal} label="Option B" />
              </Column>
            </DemoCard>

            <DemoCard title="Toggle Switch" style={st} theme={th} code={`<Toggle
  label="Notifications"
  checked={${toggleVal}}
/>`}>
              <Toggle style={st} theme={th} label="Notifications" checked={toggleVal} onCheckedChange={setToggleVal} />
            </DemoCard>

            <DemoCard title="Slider" style={st} theme={th} code={`<Slider
  min={0}
  max={100}
  label="Volume"
  value={${sliderVal}}
/>`}>
              <Slider style={st} theme={th} min={0} max={100} label="Volume" value={sliderVal} onValueChange={setSliderVal} />
            </DemoCard>

            <DemoCard title="Date Picker" style={st} theme={th} code={`<DatePicker
  format="YYYY-MM-DD"
  value="${dateVal}"
/>
<DatePicker
  label="Time"
  format="YYYY-MM-DD hh:mm"
  value="${dateVal}"
/>`}>
              <Column gap="8px">
                <DatePicker style={st} theme={th} format="YYYY-MM-DD" value={dateVal} onValueChange={setDateVal} />
                <DatePicker style={st} theme={th} label="Time" format="YYYY-MM-DD hh:mm" value={dateVal} onValueChange={setDateVal} />
              </Column>
            </DemoCard>

            <DemoCard title="File Upload" style={st} theme={th} code={`<FileUpload
  accept="image/*"
  label="Upload file"
/>`}>
              <FileUpload style={st} theme={th} accept="image/*" label="Upload file" />
            </DemoCard>

            <DemoCard title="Dropdown Menu" style={st} theme={th} code={`<DropdownMenu items={${dropdownItemsCode}}>
  <Button>Menu</Button>
</DropdownMenu>`}>
              <Row gap="8px">
                <DropdownMenu style={st} theme={th} items={dropdownItems}><Button style={st} theme={th}>Menu</Button></DropdownMenu>
              </Row>
            </DemoCard>

            <DemoCard title="Button Group" style={st} theme={th} code={`<ButtonGroup
  items={${btnGroupItemsCode}}
  value="${btnGroupVal}"
/>
<ButtonGroup
  variant="filled"
  items={${btnGroupItemsCode}}
  value="${btnGroupVal}"
/>`}>
              <Column gap="8px" align="start">
                <ButtonGroup style={st} theme={th} items={btnGroupItems} value={btnGroupVal} onValueChange={setBtnGroupVal} />
                <ButtonGroup style={st} theme={th} variant="filled" items={btnGroupItems} value={btnGroupVal} onValueChange={setBtnGroupVal} />
              </Column>
            </DemoCard>

            <DemoCard title="Rich Text Editor" style={st} theme={th} span="2" code={`<TextEditor rows={6} />`}>
              <Row gap="8px" className="mb-2">
                <Button style={st} theme={th} onClick={() => setTeInjectOpen(true)}>Inject HTML</Button>
                <Button style={st} theme={th} variant="outlined" onClick={() => setTeExtractOpen(true)}>Extract HTML</Button>
              </Row>
              <TextEditor style={st} theme={th} rows={6} value={textEditorHtml} onValueChange={setTextEditorHtml} />
              <Modal style={st} theme={th} open={teInjectOpen} onOpenChange={setTeInjectOpen} title="Inject HTML" size="medium">
                <Textarea style={st} theme={th} rows={4} value={textEditorHtml} onValueChange={setTextEditorHtml} />
              </Modal>
              <Modal style={st} theme={th} open={teExtractOpen} onOpenChange={setTeExtractOpen} title="Extracted HTML" size="medium">
                <pre className="component-code" dangerouslySetInnerHTML={{ __html: highlight(textEditorHtml) }} />
              </Modal>
            </DemoCard>

            <DemoCard title="CodeEditor" style={st} theme={th} code={`<CodeEditor language="javascript" rows={6} />
<CodeEditor language="markup" editable={false} rows={4} value="<div>Hello</div>" />`}>
              <Column gap="8px">
                <CodeEditor style={st} theme={th} language="javascript" rows={6} value={codeEditorVal} onValueChange={setCodeEditorVal} />
                <CodeEditor style={st} theme={th} language="markup" editable={false} rows={4} value="<div>Hello</div>" />
              </Column>
            </DemoCard>
          </div>
        </section>

        {/* ===== LAYOUT ===== */}
        <section className={sectionCls("layout")}>
          <h2 className="demo-section-title text-2xl font-bold border-b pb-2 mb-4">Layout Components</h2>
          <div className={gridCls("grid-cols-1 md:grid-cols-2")}>
            <DemoCard title="Row / Column / Grid" style={st} theme={th} span="2" code={`<Row gap="8px" align="center" justify="between">
  <div className="demo-card border rounded p-2 text-xs">A</div>
  <div className="demo-card border rounded p-2 text-xs">B</div>
  <div className="demo-card border rounded p-2 text-xs">C</div>
</Row>
<Grid columns={3} gap="8px">
  <div className="demo-card border rounded p-2 text-xs">1</div>
  <div className="demo-card border rounded p-2 text-xs">2</div>
  <div className="demo-card border rounded p-2 text-xs">3</div>
</Grid>`}>
              <div className="layout-stage">
                <Row gap="8px" align="center" justify="between">
                  <div className="demo-card border rounded p-2 text-xs">A</div>
                  <div className="demo-card border rounded p-2 text-xs">B</div>
                  <div className="demo-card border rounded p-2 text-xs">C</div>
                </Row>
              </div>
              <div className="layout-stage mt-2">
                <Grid columns={3} gap="8px">
                  <div className="demo-card border rounded p-2 text-xs">1</div>
                  <div className="demo-card border rounded p-2 text-xs">2</div>
                  <div className="demo-card border rounded p-2 text-xs">3</div>
                </Grid>
              </div>
            </DemoCard>

            <DemoCard title="Card" style={st} theme={th} code={`<Card elevated>
  <p className="demo-text text-sm">A nested elevated card.</p>
</Card>`}>
              <Card style={st} theme={th} elevated><p className="demo-text text-sm">A nested elevated card.</p></Card>
            </DemoCard>

            <DemoCard title="Divider" style={st} theme={th} code={`<p className="demo-text text-sm">Above</p>
<Divider label="OR" />
<p className="demo-text text-sm">Below</p>`}>
              <p className="demo-text text-sm">Above</p>
              <Divider style={st} theme={th} label="OR" />
              <p className="demo-text text-sm">Below</p>
            </DemoCard>

            <DemoCard title="Tabs" style={st} theme={th} code={`<Tabs
  tabs={${JSON.stringify([{id:"overview",label:"Overview"},{id:"features",label:"Features"},{id:"pricing",label:"Pricing"}])}}
  active="${tabActive}"
/>`}>
              <Tabs style={st} theme={th} tabs={[{id:"overview",label:"Overview"},{id:"features",label:"Features"},{id:"pricing",label:"Pricing"}]} active={tabActive} onActiveChange={setTabActive} />
            </DemoCard>

            <DemoCard title="Accordion" style={st} theme={th} code={`<Accordion
  items={${accordionItemsCode}}
  current="1"
/>`}>
              <Accordion style={st} theme={th} items={accordionItems} current="1" />
            </DemoCard>

            <DemoCard title="Carousel" style={st} theme={th} code={`<Carousel
  slides={${carouselSlidesCode}}
/>`}>
              <Carousel style={st} theme={th} slides={carouselSlides} />
            </DemoCard>

            <DemoCard title="Modal" style={st} theme={th} code={`<Modal
  open={${modalOpen}}
  title="Modal Title"
  size="${modalSize}"
>
  <p className="demo-text">Modal body content.</p>
</Modal>`}>
              <Row gap="8px">
                {(["small","medium","large","full"] as const).map((s) => (
                  <Button key={s} style={st} theme={th} variant="outlined" onClick={() => { setModalSize(s); setModalOpen(true); }}>{s}</Button>
                ))}
              </Row>
              <Modal style={st} theme={th} open={modalOpen} onOpenChange={setModalOpen} title="Modal Title" size={modalSize as any}>
                <p className="demo-text">Modal body content.</p>
              </Modal>
            </DemoCard>

            <DemoCard title="Drawer" style={st} theme={th} code={`<Drawer
  position="${drawerPosition}"
  open={${drawerOpen}}
>
  <nav className="flex flex-col gap-1">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Settings</a>
  </nav>
</Drawer>`}>
              <Row gap="8px">
                {(["left","right","top","bottom"] as const).map((p) => (
                  <Button key={p} style={st} theme={th} variant="outlined" onClick={() => { setDrawerPosition(p); setDrawerOpen(true); }}>{p}</Button>
                ))}
              </Row>
              <Drawer style={st} theme={th} position={drawerPosition as any} open={drawerOpen} onOpenChange={setDrawerOpen}>
                <nav className="flex flex-col gap-1">
                  <a className="drawer-nav-link" href="#">Home</a>
                  <a className="drawer-nav-link" href="#">About</a>
                  <a className="drawer-nav-link" href="#">Settings</a>
                </nav>
              </Drawer>
            </DemoCard>

            <DemoCard title="Command Palette" style={st} theme={th} code={`<CommandPalette
  groups={${cmdGroupsCode}}
/>`}>
              <p className="demo-text text-sm mb-2">Press ⌘K / Ctrl+K, or:</p>
              <Button style={st} theme={th} onClick={() => setCmdPaletteOpen(true)}>Open CmdK</Button>
              <CommandPalette style={st} theme={th} groups={cmdGroups} open={cmdPaletteOpen} onOpenChange={setCmdPaletteOpen} />
            </DemoCard>

            <DemoCard title="Sortable List" style={st} theme={th} span="2" code={`<SortableList
  items={${JSON.stringify(sortableItems)}}
>
  {(item) => <span>{item.label}</span>}
</SortableList>`}>
              <Row gap="12px" fill>
                <Column gap="8px" fill>
                  <div className="demo-label text-xs">Vertical</div>
                  <SortableList style={st} theme={th} items={sortableItems} onItemsChange={setSortableItems}>
                    {(item: any) => <span>{item.label}</span>}
                  </SortableList>
                </Column>
              </Row>
            </DemoCard>
          </div>
        </section>

        {/* ===== NAVIGATION ===== */}
        <section className={sectionCls("navigation")}>
          <h2 className="demo-section-title text-2xl font-bold border-b pb-2 mb-4">Navigation Components</h2>
          <div className={gridCls("grid-cols-1 md:grid-cols-2")}>
            <DemoCard title="Breadcrumb" style={st} theme={th} code={`<Breadcrumb
  items={${JSON.stringify([{label:"Home",href:"#"},{label:"Products",href:"#"},{label:"Details"}])}}
/>`}>
              <Breadcrumb style={st} theme={th} items={[{label:"Home",href:"#"},{label:"Products",href:"#"},{label:"Details"}]} />
            </DemoCard>
            <DemoCard title="Pagination" style={st} theme={th} code={`<Pagination
  total={50}
  perPage={10}
  current={${paginationPage}}
/>`}>
              <Pagination style={st} theme={th} total={50} perPage={10} current={paginationPage} onCurrentChange={setPaginationPage} />
            </DemoCard>
            <DemoCard title="Stepper" style={st} theme={th} span="2" code={`<Stepper
  steps={${JSON.stringify([{label:"Account"},{label:"Profile"},{label:"Plan"},{label:"Done"}])}}
  current={2}
/>`}>
              <Stepper style={st} theme={th} steps={[{label:"Account"},{label:"Profile"},{label:"Plan"},{label:"Done"}]} current={2} />
            </DemoCard>
          </div>
        </section>

        {/* ===== DATA DISPLAY ===== */}
        <section className={sectionCls("datadisplay")}>
          <h2 className="demo-section-title text-2xl font-bold border-b pb-2 mb-4">Data Display</h2>
          <div className={gridCls("grid-cols-1 md:grid-cols-2 lg:grid-cols-3")}>
            <DemoCard title="Avatar" style={st} theme={th} code={`<Avatar size="sm" fallback="AB" />
<Avatar size="md" fallback="CD" />
<Avatar size="lg" fallback="EF" />`}>
              <Row gap="8px">
                <Avatar style={st} theme={th} size="sm" fallback="AB" />
                <Avatar style={st} theme={th} size="md" fallback="CD" />
                <Avatar style={st} theme={th} size="lg" fallback="EF" />
              </Row>
            </DemoCard>
            <DemoCard title="Chip" style={st} theme={th} code={`<Chip color="primary">Primary</Chip>
<Chip color="success" variant="outlined">★ Star</Chip>
<Chip color="neutral" variant="text">Ghost</Chip>`}>
              <Row gap="8px" wrap>
                <Chip style={st} theme={th} color="primary">Primary</Chip>
                <Chip style={st} theme={th} color="success" variant="outlined">★ Star</Chip>
                <Chip style={st} theme={th} color="neutral" variant="text">Ghost</Chip>
              </Row>
            </DemoCard>
            <DemoCard title="Tooltip" style={st} theme={th} code={`<Tooltip text="This is a tooltip!">
  <Button variant="outlined">Hover me</Button>
</Tooltip>`}>
              <Tooltip style={st} theme={th} text="This is a tooltip!"><Button style={st} theme={th} variant="outlined">Hover me</Button></Tooltip>
            </DemoCard>
            <DemoCard title="Progress Bar" style={st} theme={th} code={`<ProgressBar
  value={65}
  animated
  label
/>
<ProgressBar value={-1} />`}>
              <Column gap="8px">
                <ProgressBar style={st} theme={th} value={progressVal} animated label />
                <ProgressBar style={st} theme={th} value={-1} />
              </Column>
            </DemoCard>
            <DemoCard title="Spinner" style={st} theme={th} code={`<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />`}>
              <Row gap="12px">
                <Spinner style={st} theme={th} size="sm" />
                <Spinner style={st} theme={th} size="md" />
                <Spinner style={st} theme={th} size="lg" />
              </Row>
            </DemoCard>
            <DemoCard title="Skeleton" style={st} theme={th} code={`<Skeleton variant="circle" width="40px" height="40px" />
<Skeleton variant="text" />
<Skeleton variant="text" width="60%" />`}>
              <Column gap="8px">
                <Skeleton style={st} theme={th} variant="circle" width="40px" height="40px" />
                <Skeleton style={st} theme={th} variant="text" />
                <Skeleton style={st} theme={th} variant="text" width="60%" />
              </Column>
            </DemoCard>
            <DemoCard title="Table" style={st} theme={th} span="3" code={`<Table
  data={${tableDataCode}}
  variant="striped"
/>`}>
              <Table style={st} theme={th} data={tableData} variant="striped" />
            </DemoCard>
          </div>
        </section>

        {/* ===== FEEDBACK ===== */}
        <section className={sectionCls("feedback")}>
          <h2 className="demo-section-title text-2xl font-bold border-b pb-2 mb-4">Feedback</h2>
          <div className={gridCls("grid-cols-1 md:grid-cols-2")}>
            <DemoCard title="Alert" style={st} theme={th} code={`<Alert
  preset="${alertPreset}"
  title="${alertPreset} alert"
  dismissible
>
  This is an ${alertPreset} message.
</Alert>`}>
              <Row gap="6px" wrap className="mb-2">
                {(["info","success","warning","error"] as const).map((p) => (
                  <Button key={p} style={st} theme={th} variant={alertPreset === p ? "filled" : "outlined"} onClick={() => setAlertPreset(p)}>{p}</Button>
                ))}
              </Row>
              <Alert style={st} theme={th} preset={alertPreset} title={`${alertPreset} alert`} dismissible>This is an {alertPreset} message.</Alert>
            </DemoCard>
            <DemoCard title="Toast" style={st} theme={th} code={`<Button onClick={() => addToastMsg("info toast", "info")}>info</Button>
<Button onClick={() => addToastMsg("success toast", "success")}>success</Button>
<Button onClick={() => addToastMsg("warning toast", "warning")}>warning</Button>
<Button onClick={() => addToastMsg("error toast", "error")}>error</Button>`}>
              <Row gap="6px" wrap>
                {(["info","success","warning","error"] as const).map((p) => (
                  <Button key={p} style={st} theme={th} onClick={() => addToastMsg(`${p} toast`, p)}>{p}</Button>
                ))}
                <select className="header-select rounded border px-2 py-1" value={toastPosition} onChange={(e) => setToastPosition(e.target.value)}>
                  {["top-left","top-center","top-right","bottom-left","bottom-center","bottom-right"].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </Row>
            </DemoCard>
            <DemoCard title="Rating" style={st} theme={th} code={`<Rating
  max={5}
  showValue
  value={${ratingVal}}
/>`}>
              <Rating style={st} theme={th} max={5} showValue value={ratingVal} onValueChange={setRatingVal} />
            </DemoCard>
            <DemoCard title="Popover" style={st} theme={th} code={`<Popover position="top" content="Top popover content">
  <Button variant="outlined">Top</Button>
</Popover>
<Popover position="bottom" content="Bottom popover content">
  <Button variant="outlined">Bottom</Button>
</Popover>`}>
              <Row gap="8px">
                <Popover style={st} theme={th} position="top" content="Top popover content" open={popoverOpen} onOpenChange={setPopoverOpen}><Button style={st} theme={th} variant="outlined">Top</Button></Popover>
                <Popover style={st} theme={th} position="bottom" content="Bottom popover content"><Button style={st} theme={th} variant="outlined">Bottom</Button></Popover>
              </Row>
            </DemoCard>
          </div>
        </section>

        {/* ===== CHARTS ===== */}
        <section className={sectionCls("charts")}>
          <h2 className="demo-section-title text-2xl font-bold border-b pb-2 mb-4">Chart Components</h2>
          <div className={gridCls("grid-cols-1 md:grid-cols-2")}>
            <DemoCard title="Bar Chart" style={st} theme={th} code={`<BarChart
  title="Quarterly Revenue"
  xAxisLabel="Quarter"
  yAxisLabel="Revenue"
  data={${barDataCode}}
/>`}>
              <BarChart style={st} theme={th} downloadable title="Quarterly Revenue" xAxisLabel="Quarter" yAxisLabel="Revenue" data={[{label:"q1",value:12},{label:"q2",value:19},{label:"q3",value:8},{label:"q4",value:15}]} />
            </DemoCard>
            <DemoCard title="Line Chart" style={st} theme={th} code={`<LineChart
  title="Revenue vs Cost"
  data={${lineDataCode}}
/>`}>
              <LineChart style={st} theme={th} downloadable title="Revenue vs Cost" data={[{label:"Jan",revenue:10,Cost:5},{label:"Feb",revenue:20,Cost:8},{label:"Mar",revenue:15,Cost:6},{label:"Apr",revenue:25,Cost:9}]} />
            </DemoCard>
            <DemoCard title="Pie Chart" style={st} theme={th} code={`<PieChart
  title="Traffic Sources"
  data={${pieDataCode}}
/>`}>
              <PieChart style={st} theme={th} downloadable title="Traffic Sources" data={[{label:"Direct",value:35},{label:"Social",value:25},{label:"Referral",value:20},{label:"Organic",value:20}]} />
            </DemoCard>
            <DemoCard title="Doughnut Chart" style={st} theme={th} code={`<DoughnutChart
  title="Browser Share"
  options={{cutout:"60%"}}
  data={${doughnutDataCode}}
/>`}>
              <DoughnutChart style={st} theme={th} downloadable title="Browser Share" options={{ cutout: "60%" }} data={[{label:"Chrome",value:65},{label:"Firefox",value:15},{label:"Safari",value:10},{label:"Edge",value:5},{label:"Other",value:5}]} />
            </DemoCard>
            <DemoCard title="Radar Chart" style={st} theme={th} code={`<RadarChart
  title="Character Stats"
  data={${radarDataCode}}
/>`}>
              <RadarChart style={st} theme={th} downloadable title="Character Stats" data={[{label:"Speed","Character A":8,"Character B":6},{label:"Power","Character A":7,"Character B":9},{label:"Accuracy","Character A":9,"Character B":5},{label:"Defense","Character A":6,"Character B":8},{label:"Agility","Character A":7,"Character B":7}]} />
            </DemoCard>
            <DemoCard title="Polar Area Chart" style={st} theme={th} code={`<PolarAreaChart
  title="Color Distribution"
  data={${polarDataCode}}
/>`}>
              <PolarAreaChart style={st} theme={th} downloadable title="Color Distribution" data={[{label:"Red",value:11},{label:"Blue",value:16},{label:"Green",value:7},{label:"Yellow",value:3},{label:"Purple",value:14}]} />
            </DemoCard>
            <DemoCard title="Scatter Chart" style={st} theme={th} code={`<ScatterChart
  title="Data Distribution"
  data={${scatterDataCode}}
/>`}>
              <ScatterChart style={st} theme={th} downloadable title="Data Distribution" height={280} data={[{x:1,y:2},{x:2,y:5},{x:3,y:3},{x:4,y:7},{x:5,y:4},{x:6,y:6},{x:7,y:8},{x:8,y:5}]} />
            </DemoCard>
            <DemoCard title="Bubble Chart" style={st} theme={th} code={`<BubbleChart
  title="Product Performance"
  series={${bubbleDataCode}}
/>`}>
              <BubbleChart style={st} theme={th} downloadable title="Product Performance" height={280} series={[{label:"A",x:10,y:20,r:5},{label:"B",x:30,y:40,r:10},{label:"C",x:50,y:15,r:8},{label:"D",x:20,y:30,r:6},{label:"E",x:40,y:25,r:12}]} />
            </DemoCard>
            <DemoCard title="Stacked Bar Chart" style={st} theme={th} code={`<StackedBarChart
  title="Revenue Breakdown"
  data={${stackedBarDataCode}}
/>`}>
              <StackedBarChart style={st} theme={th} downloadable title="Revenue Breakdown" data={[{label:"Q1","Product A":10,"Product B":20,"Product C":15},{label:"Q2","Product A":15,"Product B":25,"Product C":10},{label:"Q3","Product A":20,"Product B":15,"Product C":20}]} />
            </DemoCard>
            <DemoCard title="Stacked Line Chart" style={st} theme={th} code={`<StackedLineChart
  title="Website Traffic"
  data={${stackedLineDataCode}}
/>`}>
              <StackedLineChart style={st} theme={th} downloadable title="Website Traffic" data={[{label:"W1",EMEA:10,APAC:20,NA:15},{label:"W2",EMEA:15,APAC:25,NA:20},{label:"W3",EMEA:20,APAC:30,NA:25},{label:"W4",EMEA:25,APAC:35,NA:30}]} />
            </DemoCard>
          </div>
        </section>
      </main>

      {/* ===== GLOBAL OVERLAYS ===== */}
      <Toast style={st} theme={th} position={toastPosition as any} toasts={toasts} onToastsChange={setToasts} />
      <FAB style={st} theme={th} preset={btnPreset} position="bottom-right" onClick={() => addToastMsg("FAB clicked", "info")}>+</FAB>
    </div>
  );
}
