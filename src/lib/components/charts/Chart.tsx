import { Chart as ChartJS } from "chart.js";
import "./chart-styles.css";
import { useDefaults } from "../../config";
import { cn } from "../../utils/cn";
import { buildData, buildOptions, readTokens } from "./chart-config.js";
import { useEffect, useRef } from "react";
import type { CSSProperties, HTMLAttributes } from "react";

export interface ChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  type: string;
  data?: unknown;
  series?: unknown;
  labels?: unknown;
  options?: Record<string, unknown>;
  title?: string;
  height?: number | string;
  legend?: boolean | "auto";
  animated?: boolean;
  downloadable?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  style?: string;
  theme?: string;
}

type Normalized = { data: any; series: any; labels: any };

function normalize(type: string, data: unknown, series: unknown, labels: unknown): Normalized {
  let d: any = data;
  let s: any = series;
  let l: any = labels;

  const isRowArr = (arr: unknown): arr is Record<string, unknown>[] =>
    Array.isArray(arr) && arr.length > 0 && !!arr[0] && typeof arr[0] === "object" && !Array.isArray(arr[0]);

  // Combo chart: row-oriented data + optional series for chartType
  if (type === "combo" && isRowArr(d) && "label" in d[0]) {
    const keys = Object.keys(d[0]).filter((k) => k !== "label");
    l = d.map((item: any) => item.label);
    const chartTypeMap: Record<string, string> = {};
    if (Array.isArray(s)) (s as { name: string; chartType?: string }[]).forEach((sv) => { chartTypeMap[sv.name] = sv.chartType || "bar"; });
    s = keys.map((key) => ({
      name: key,
      values: d.map((item: any) => item[key]),
      chartType: chartTypeMap[key] || "bar",
    }));
    d = null;
  } else if (isRowArr(d) && "label" in d[0] && "value" in d[0] && !s) {
    l = d.map((item: any) => item.label);
    d = d.map((item: any) => item.value);
  } else if (isRowArr(d) && "label" in d[0] && !s) {
    const keys = Object.keys(d[0]).filter((k) => k !== "label");
    l = d.map((item: any) => item.label);
    s = keys.map((key) => ({ name: key, values: d.map((item: any) => item[key]) }));
    d = null;
  }

  // Bubble chart: row-oriented {label, x, y, r} format
  if (
    type === "bubble" &&
    Array.isArray(s) && s.length > 0 && !!s[0] && typeof s[0] === "object" && !Array.isArray(s[0]) &&
    "x" in s[0] && "y" in s[0]
  ) {
    const points = (s as { x: number; y: number; r?: number }[]).map((item: any) => ({ x: item.x, y: item.y, r: item.r ?? 10 }));
    const datasetLabel = (s[0] as { label?: string }).label || "Data";
    s = [{ name: datasetLabel, points }];
  } else if (!d && isRowArr(s) && "label" in s[0]) {
    if ("value" in s[0]) {
      l = s.map((item: any) => item.label);
      d = s.map((item: any) => item.value);
      s = null;
    } else {
      const keys = Object.keys(s[0]).filter((k) => k !== "label");
      l = s.map((item: any) => item.label);
      s = keys.map((key) => ({ name: key, values: s.map((item: any) => item[key]) }));
    }
  }

  return { data: d, series: s, labels: l };
}

export function Chart({
  type,
  data = null,
  series = null,
  labels = null,
  options = {},
  title = "",
  height = 320,
  legend = "auto",
  animated = true,
  downloadable = false,
  xAxisLabel = "",
  yAxisLabel = "",
  style: styleProp,
  theme: themeProp,
  className = "",
  ...rest
}: ChartProps) {
  const d = useDefaults();
  const st = styleProp ?? d.style;
  const th = themeProp ?? d.theme;
  const heightStyle = typeof height === "number" ? `${height}px` : height;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  const normalized = normalize(type, data, series, labels);
  const seriesCount = normalized.series ? (normalized.series as unknown[]).length : normalized.data ? 1 : 0;
  const shapeKey = `${type}-${st}-${th}`;

  // Build config from current tokens + props.
  function buildCfg(canvas: HTMLCanvasElement) {
    const tokens = readTokens(canvas);
    return {
      type,
      data: buildData(type, { data: normalized.data, series: normalized.series, labels: normalized.labels }, tokens),
      options: buildOptions(type, st, tokens, { title, legend, animated, userOptions: options, seriesCount, xAxisLabel, yAxisLabel }),
    } as any;
  }

  // Create / update effect.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const existing = ChartJS.getChart(canvas);
    if (existing && (existing as any).config.type === type) {
      const tokens = readTokens(canvas);
      existing.data = buildData(type, { data: normalized.data, series: normalized.series, labels: normalized.labels }, tokens) as never;
      existing.options = buildOptions(type, st, tokens, { title, legend, animated, userOptions: options, seriesCount, xAxisLabel, yAxisLabel }) as never;
      existing.update();
      chartRef.current = existing;
      return;
    }
    if (existing) existing.destroy();

    const cfg = buildCfg(canvas);
    let rafId = 0;
    let resizeId = 0;
    let cancelled = false;
    const container = canvas.parentElement;
    const init = () => {
      if (cancelled) return;
      if (!container || container.clientWidth === 0 || container.clientHeight === 0) {
        rafId = requestAnimationFrame(init);
        return;
      }
      chartRef.current = new ChartJS(canvas.getContext("2d")!, cfg);
      resizeId = requestAnimationFrame(() => {
        if (cancelled || !chartRef.current) return;
        chartRef.current.resize();
      });
    };
    rafId = requestAnimationFrame(init);
    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (resizeId) cancelAnimationFrame(resizeId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapeKey, data, series, labels, options, title, legend, animated, xAxisLabel, yAxisLabel]);

  // Destroy on unmount.
  useEffect(() => {
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  // Dark-mode MutationObserver.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const root = document.documentElement;
    let isDark = root.classList.contains("dark");
    const observer = new MutationObserver(() => {
      const nowDark = root.classList.contains("dark");
      if (nowDark === isDark) return;
      isDark = nowDark;
      const existing = ChartJS.getChart(canvas);
      if (!existing) return;
      const tokens = readTokens(canvas);
      existing.data = buildData(type, { data: normalized.data, series: normalized.series, labels: normalized.labels }, tokens) as never;
      existing.options = buildOptions(type, st, tokens, { title, legend, animated, userOptions: options, seriesCount, xAxisLabel, yAxisLabel }) as never;
      existing.update("none");
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function downloadChart() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${title || type}-chart.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div
      className={cn("s-chart", `s-chart-${st}`, `theme-${th}`, `s-chart-${type}`, downloadable ? "s-chart-downloadable" : "", className)}
      style={{ height: heightStyle } as CSSProperties}
      {...rest}
    >
      <canvas ref={canvasRef} role="img" aria-label={title || `${type} chart`} />
      {downloadable ? (
        <button type="button" className="s-chart-download-btn" onClick={downloadChart} aria-label="Download chart as PNG" title="Download as PNG">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}