import {
  Chart,
  BarController,
  LineController,
  PieController,
  DoughnutController,
  RadarController,
  PolarAreaController,
  BubbleController,
  ScatterController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Filler,
  Legend,
  Tooltip,
  Title,
} from "chart.js";

// Register everything we use once at module top — tree-shaken, explicit.
Chart.register(
  BarController,
  LineController,
  PieController,
  DoughnutController,
  RadarController,
  PolarAreaController,
  BubbleController,
  ScatterController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Filler,
  Legend,
  Tooltip,
  Title,
);

// Safety patch: ensure setLineDash always receives a valid array.
// Chart.js v4 can pass undefined/null internal values that throw "cannot be
// converted to a sequence" in some browser environments.
// Guarded so the module stays safe during SSR (CanvasRenderingContext2D is
// only available in the browser).
if (typeof CanvasRenderingContext2D !== "undefined") {
  const origSetLineDash = CanvasRenderingContext2D.prototype.setLineDash;
  CanvasRenderingContext2D.prototype.setLineDash = function (segments) {
    if (
      !segments ||
      typeof segments !== "object" ||
      typeof segments[Symbol.iterator] !== "function"
    ) {
      return origSetLineDash.call(this, []);
    }
    return origSetLineDash.call(this, segments);
  };
}

/**
 * Read theme tokens from a DOM element's computed style.
 * Every returned value is a resolved CSS color string.
 */
export function readTokens(el) {
  const cs = getComputedStyle(el);
  return {
    primary: cs.getPropertyValue("--t-primary").trim(),
    secondary: cs.getPropertyValue("--t-secondary").trim(),
    surface: cs.getPropertyValue("--t-surface").trim(),
    text: cs.getPropertyValue("--t-text").trim(),
    textHint: cs.getPropertyValue("--t-text-hint").trim(),
    textSecondary: cs.getPropertyValue("--t-text-secondary").trim(),
    cardBg: cs.getPropertyValue("--t-card-bg").trim(),
    border:
      cs.getPropertyValue("--t-border").trim() ||
      cs.getPropertyValue("--t-card-border-color").trim(),
    info: cs.getPropertyValue("--t-info").trim(),
    success: cs.getPropertyValue("--t-success").trim(),
    warning: cs.getPropertyValue("--t-warning").trim(),
    error: cs.getPropertyValue("--t-error").trim(),
  };
}

/**
 * Generate a palette of n colors cycling through the theme's status colors.
 * For n > 6, alpha-reduced repeats are used (no external color deps).
 */
export function palette(n, tokens) {
  const colors = [
    tokens.primary,
    tokens.secondary,
    tokens.info,
    tokens.success,
    tokens.warning,
    tokens.error,
  ];
  if (n <= colors.length) return colors.slice(0, n);
  // More than 6: repeat with alpha stepping
  const result = [];
  for (let i = 0; i < n; i++) {
    const base = colors[i % colors.length];
    const step = Math.floor(i / colors.length);
    const alpha = Math.max(0.35, 1 - step * 0.2);
    result.push(
      alpha < 1
        ? `${base}${Math.round(alpha * 255)
            .toString(16)
            .padStart(2, "0")}`
        : base,
    );
  }
  return result;
}

/**
 * Build a Chart.js data object from the canonical user-facing API.
 */
export function buildData(type, { data, series, labels }, tokens) {
  // Normalize object-style data: {q1:12, q2:19} → labels=["q1","q2"], data=[12,19]
  if (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    data.constructor === Object
  ) {
    labels = Object.keys(data);
    data = Object.values(data);
  }

  // Combo chart: row-oriented data + optional series for chartType overrides
  // [{label:"jan", Revenue:40, Target:50, Cost:20}, ...] → labels + series
  // If series is also provided, chartType is merged from matching series entries
  if (
    type === "combo" &&
    Array.isArray(data) &&
    data.length > 0 &&
    data[0] &&
    typeof data[0] === "object" &&
    !Array.isArray(data[0]) &&
    "label" in data[0]
  ) {
    const keys = Object.keys(data[0]).filter((k) => k !== "label");
    labels = data.map((d) => d.label);
    const chartTypeMap = {};
    if (series) {
      series.forEach((s) => {
        chartTypeMap[s.name] = s.chartType;
      });
    }
    series = keys.map((key) => ({
      name: key,
      values: data.map((d) => d[key]),
      chartType: chartTypeMap[key] || "line",
    }));
    data = null;
  }

  // Normalize single-series {label, value} format: [{label:"q1", value:5}, ...]
  // → labels=["q1","q2"], data=[5,19] — order preserved (unlike plain objects)
  if (
    Array.isArray(data) &&
    data.length > 0 &&
    data[0] &&
    typeof data[0] === "object" &&
    !Array.isArray(data[0]) &&
    "label" in data[0] &&
    "value" in data[0] &&
    !series
  ) {
    labels = data.map((d) => d.label);
    data = data.map((d) => d.value);
  }

  // Normalize multi-series row-oriented data: [{label:"jan", revenue:10, Cost:5}, ...]
  // → labels=["jan","feb"], series=[{name:"revenue",values:[10,20]}, {name:"Cost",values:[5,8]}]
  else if (
    Array.isArray(data) &&
    data.length > 0 &&
    data[0] &&
    typeof data[0] === "object" &&
    !Array.isArray(data[0]) &&
    "label" in data[0] &&
    !series
  ) {
    const keys = Object.keys(data[0]).filter((k) => k !== "label");
    labels = data.map((d) => d.label);
    series = keys.map((key) => ({
      name: key,
      values: data.map((d) => d[key]),
    }));
    data = null;
  }

  // Bubble chart: row-oriented {label, x, y, r} format
  // [{label:"Product A", x:10, y:20, r:15}, ...] → single dataset with points
  if (
    type === "bubble" &&
    Array.isArray(series) &&
    series.length > 0 &&
    series[0] &&
    typeof series[0] === "object" &&
    !Array.isArray(series[0]) &&
    "x" in series[0] &&
    "y" in series[0]
  ) {
    const points = series.map((s) => ({
      x: s.x,
      y: s.y,
      r: s.r ?? 10,
    }));
    const datasetLabel = series[0].label || "Data";
    series = [{ name: datasetLabel, points }];
  }

  // Normalize row-oriented format passed via series prop (for consistency).
  // Allows: <Bar series={[{label:"q1", value:5}, ...]} />
  //   and: <Line series={[{label:"jan", Revenue:10, Cost:5}, ...]} />
  // Detection: traditional series has {name, values}, row-oriented has {label, ...}
  else if (
    !data &&
    Array.isArray(series) &&
    series.length > 0 &&
    series[0] &&
    typeof series[0] === "object" &&
    !Array.isArray(series[0]) &&
    "label" in series[0]
  ) {
    if ("value" in series[0]) {
      // Single-series {label, value}
      labels = series.map((s) => s.label);
      data = series.map((s) => s.value);
      series = null;
    } else {
      // Multi-series row-oriented
      const keys = Object.keys(series[0]).filter((k) => k !== "label");
      labels = series.map((s) => s.label);
      series = keys.map((key) => ({
        name: key,
        values: series.map((s) => s[key]),
      }));
    }
  }

  // Single-series shortcut
  if (data && !series) {
    if (type === "scatter") {
      return {
        datasets: [
          {
            label: undefined,
            data: data,
            backgroundColor: tokens.primary,
          },
        ],
      };
    }
    if (type === "bubble") {
      return {
        datasets: [
          {
            label: undefined,
            data: data,
            backgroundColor: tokens.primary,
          },
        ],
      };
    }
    // Category charts (bar, line, pie, doughnut, radar, polarArea)
    const isSlice = ["pie", "doughnut", "polarArea"].includes(type);
    const cols = isSlice ? palette(data.length, tokens) : [tokens.primary];
    return {
      labels: labels || [],
      datasets: [
        {
          label: undefined,
          data: data,
          backgroundColor: isSlice ? cols : cols[0],
          borderColor: isSlice ? cols.map(() => tokens.surface) : cols[0],
          borderWidth: isSlice ? 2 : undefined,
        },
      ],
    };
  }

  // Multi-series
  if (series && series.length > 0) {
    const cols = palette(series.length, tokens);
    return {
      labels: labels || [],
      datasets: series.map((s, i) => {
        const color = s.color || cols[i];
        const isSlice = ["pie", "doughnut", "polarArea"].includes(type);
        if (isSlice) {
          // For slice charts with multiple series, treat each series as a separate ring
          return {
            label: s.name,
            data: s.values || [],
            backgroundColor: palette((s.values || []).length, tokens),
            borderColor: tokens.surface,
            borderWidth: 2,
          };
        }
        if (type === "scatter" || type === "bubble") {
          return {
            label: s.name,
            data: s.points || [],
            backgroundColor: color,
            borderColor: color,
          };
        }
        // Combo chart: per-series type override ("bar" or "line")
        if (type === "combo") {
          const chartType = s.chartType || "line";
          if (chartType === "line") {
            return {
              type: "line",
              label: s.name,
              data: s.values || [],
              backgroundColor: color,
              borderColor: color,
              borderWidth: 2,
              tension: s.tension ?? 0.35,
              fill: s.fill ?? false,
              pointRadius: s.pointRadius ?? 3,
              pointHoverRadius: s.pointHoverRadius ?? 6,
            };
          }
          return {
            type: "bar",
            label: s.name,
            data: s.values || [],
            backgroundColor: color,
            borderColor: color,
          };
        }
        return {
          label: s.name,
          data: s.values || [],
          backgroundColor: color,
          borderColor: color,
          borderWidth: type === "line" ? 2 : undefined,
        };
      }),
    };
  }

  // Edge case: no data, no series — empty chart
  return { labels: labels || [], datasets: [] };
}

/**
 * Per-style Chart.js option overrides.
 * Keys: barRadius, lineTension, fill, gridStyle, shadow, extra.
 */
const STYLE_OVERRIDES = {
  material: {
    barRadius: 4,
    lineTension: 0.35,
    fill: false,
    gridDash: [],
    gridColor: undefined,
    extra: {},
  },
  material3: {
    barRadius: 999, // pill bars
    lineTension: 0.3,
    fill: false,
    gridDash: [],
    gridColor: undefined,
    pointRadius: 4,
    extra: { pointRadius: 4 },
  },
  fluent: {
    barRadius: 2,
    lineTension: 0.4,
    fill: false,
    gridDash: [],
    gridColor: undefined,
    extra: {},
  },
  brutalist: {
    barRadius: 0,
    lineTension: 0, // segments
    fill: false,
    gridDash: [4, 4],
    gridColor: undefined, // will use --t-text
    extra: { borderWidth: 2 },
  },
  pixel: {
    barRadius: 0,
    lineTension: 0,
    fill: false,
    gridDash: [],
    gridColor: undefined,
    extra: {},
  },
  neon: {
    barRadius: 0,
    lineTension: 0.3,
    fill: true,
    fillAlpha: 0.15,
    gridDash: [],
    gridColor: undefined,
    extra: {
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  },
  metro: {
    barRadius: 0,
    lineTension: 0.2,
    fill: false,
    gridDash: [],
    gridColor: "transparent",
    extra: {},
  },
  bootstrap: {
    barRadius: 4,
    lineTension: 0.4,
    fill: false,
    gridDash: [],
    gridColor: undefined,
    extra: {},
  },
  cartoon: {
    barRadius: 8,
    lineTension: 0.2,
    fill: false,
    gridDash: [],
    gridColor: undefined,
    extra: { borderWidth: 2 },
  },
  illustration: {
    barRadius: 6,
    lineTension: 0.4,
    fill: true,
    fillAlpha: 0.2,
    gridDash: [2, 4],
    gridColor: undefined,
    extra: {},
  },
  carbon: {
    barRadius: 0,
    lineTension: 0,
    fill: false,
    gridDash: [],
    gridColor: "transparent",
    extra: { borderWidth: 1 },
  },
  "liquid-glass": {
    barRadius: 6,
    lineTension: 0.3,
    fill: true,
    fillAlpha: 0.3,
    gridDash: [],
    gridColor: undefined,
    extra: {},
  },
};

/**
 * Deep-merge b into a (mutates a, returns a).
 */
function deepMerge(a, b) {
  for (const key of Object.keys(b)) {
    if (b[key] && typeof b[key] === "object" && !Array.isArray(b[key])) {
      if (!a[key]) a[key] = {};
      deepMerge(a[key], b[key]);
    } else {
      a[key] = b[key];
    }
  }
  return a;
}

/**
 * Per-type Chart.js animation config.
 * - Cartesian (line/bar/scatter/bubble/combo): grow from the baseline ("from
 *   bottom") — y animates from 0; bubble radius also grows from 0.
 * - Circular (pie/doughnut/polarArea): expand from the center (animateScale +
 *   animateRotate).
 * - radar: simple ease (no per-property override).
 */
function buildAnimation(type, animated) {
  if (!animated) return false;
  const isCircular = ["pie", "doughnut", "polarArea"].includes(type);
  if (isCircular) {
    return {
      duration: 900,
      easing: "easeOutQuart",
      animateRotate: true,
      animateScale: false,
    };
  }
  if (type === "radar") {
    return { duration: 900, easing: "easeOutQuart" };
  }
  // cartesian: line/bar/scatter/bubble/combo — grow from baseline
  const animations = {
    x: { type: "number", easing: "easeOutQuart", duration: 1000, from: 0 },
  };
  if (type === "bubble") {
    animations.r = {
      type: "number",
      easing: "easeOutQuart",
      duration: 1000,
      from: 0,
    };
  }
  return { duration: 1000, easing: "easeOutQuart", animations };
}

/**
 * Build a full Chart.js options object inferred from type, style, and tokens.
 * @param {string} type - chart type
 * @param {string} style - visual design language
 * @param {object} tokens - resolved CSS theme tokens
 * @param {{ title, legend, animated, userOptions, seriesCount, xAxisLabel, yAxisLabel }} params
 */
export function buildOptions(
  type,
  style,
  tokens,
  {
    title,
    legend,
    animated,
    userOptions,
    seriesCount = 0,
    xAxisLabel,
    yAxisLabel,
  },
) {
  const so = STYLE_OVERRIDES[style] || STYLE_OVERRIDES.material;
  const isCategory = ["bar", "line", "radar"].includes(type);
  const isSlice = ["pie", "doughnut", "polarArea"].includes(type);
  const isCartesian = isCategory || type === "scatter" || type === "bubble";

  // Determine legend visibility
  let showLegend;
  if (legend === true) showLegend = true;
  else if (legend === false) showLegend = false;
  else showLegend = isSlice || seriesCount > 1; // auto: show for slice charts or multi-series

  const opts = {
    responsive: true,
    maintainAspectRatio: false,
    animation: buildAnimation(type, animated),
    color: tokens.text,
    font: {
      family: getComputedFontFamily(),
    },
    plugins: {
      legend: {
        display: showLegend,
        position: isSlice ? "right" : "top",
        labels: {
          color: tokens.text,
          usePointStyle: true,
          padding: 12,
          font: { size: 12 },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: tokens.cardBg,
        titleColor: tokens.text,
        bodyColor: tokens.textHint,
        borderColor: tokens.border,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 4,
        boxPadding: 4,
      },
      title: title
        ? {
            display: true,
            text: title,
            color: tokens.text,
            font: { size: 14, weight: "600" },
            padding: { bottom: 12 },
          }
        : undefined,
    },
  };

  // Combo charts: use cartesian scales with per-dataset types
  const effectiveType = type === "combo" ? "bar" : type;

  if (isCartesian || type === "combo") {
    opts.scales = buildCartesianScales(
      effectiveType,
      tokens,
      so,
      xAxisLabel,
      yAxisLabel,
    );
  }

  if (isSlice) {
    opts.cutout = type === "doughnut" ? "60%" : "0%";
    opts.plugins.legend.position = "right";
  }

  // Combo chart: allow combined legend, shared y-axis
  if (type === "combo") {
    opts.borderRadius = so.barRadius;
  }

  // Apply per-type defaults
  if (type === "radar") {
    opts.scales = {
      r: {
        grid: {
          color: tokens.border,
          borderDash:
            so.gridDash && so.gridDash.length > 0 ? so.gridDash : undefined,
          circular: true,
        },
        angleLines: {
          color: tokens.border,
          borderDash:
            so.gridDash && so.gridDash.length > 0 ? so.gridDash : undefined,
        },
        pointLabels: {
          color: tokens.text,
          font: { size: 11 },
        },
        ticks: {
          display: false,
        },
      },
    };
  }

  // Apply style overrides to datasets
  if (type === "bar" && so.barRadius !== undefined) {
    opts.borderRadius = so.barRadius;
  }

  // Apply style overrides
  if (so.extra) {
    deepMerge(opts, so.extra);
  }

  // User escape hatch — deep merge last
  if (userOptions && Object.keys(userOptions).length > 0) {
    deepMerge(opts, userOptions);
  }

  return opts;
}

function buildCartesianScales(type, tokens, so, xAxisLabel, yAxisLabel) {
  const scales = {};
  const isVertical = type !== "bar";

  const gridColor = so.gridColor || tokens.border;
  // Always provide a valid borderDash array to avoid Canvas setLineDash(non-iterable) errors
  const borderDash =
    so.gridDash && so.gridDash.length > 0 ? so.gridDash : undefined;
  const gridOpts = { color: gridColor, drawBorder: false };
  if (borderDash) {
    gridOpts.borderDash = borderDash;
  }

  if (type === "scatter" || type === "bubble") {
    scales.x = {
      type: "linear",
      position: "bottom",
      grid: { ...gridOpts },
      ticks: { color: tokens.textHint },
    };
    scales.y = {
      type: "linear",
      grid: { ...gridOpts },
      ticks: { color: tokens.textHint },
    };
  } else {
    scales.x = {
      type: "category",
      grid: { display: false },
      ticks: { color: tokens.textHint },
    };
    scales.y = {
      type: "linear",
      beginAtZero: true,
      grid: { ...gridOpts },
      ticks: { color: tokens.textHint },
    };
  }

  // Axis titles
  if (xAxisLabel) {
    scales.x.title = {
      display: true,
      text: xAxisLabel,
      color: tokens.textHint,
      font: { size: 12 },
      padding: { top: 8 },
    };
  }
  if (yAxisLabel) {
    scales.y.title = {
      display: true,
      text: yAxisLabel,
      color: tokens.textHint,
      font: { size: 12 },
      padding: { bottom: 8 },
    };
  }

  // Bar-specific: center bars over category labels
  if (type === "bar") {
    scales.x.offset = true;
  }

  return scales;
}

function getComputedFontFamily() {
  try {
    return getComputedStyle(document.documentElement).fontFamily || "inherit";
  } catch {
    return "inherit";
  }
}
