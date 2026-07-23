# Chart / BarChart / LineChart / etc.

Chart.js-based chart components. Chart is the base; chart-type components are `ReadyChart` wrappers.

```tsx
// Base Chart
interface ChartProps {
  style?: string;
  theme?: string;
  type: string;
  data: ChartData;
  options?: ChartOptions;
  title?: string;
}

// Convenience wrappers (BarChart, LineChart, PieChart, DoughnutChart,
// RadarChart, PolarAreaChart, ScatterChart, BubbleChart, ComboChart,
// StackedBarChart, StackedLineChart) all accept:
interface WrapperProps {
  style?: string;
  theme?: string;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  downloadable?: boolean;
}
```

### Usage

```tsx
<BarChart title="Revenue" xAxisLabel="Month" yAxisLabel="Amount" downloadable />
<DoughnutChart title="Distribution" style="neon" />
<LineChart title="Trend" />
<Chart type="bar" data={{...}} options={{...}} />
```

Requires `chart.js` peer dep. Chart wrappers auto-generate data from the bundled fixture.
