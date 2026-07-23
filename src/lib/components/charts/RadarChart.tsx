import { Chart } from "./Chart";
import type { ChartProps } from "./Chart";

export function RadarChart(props: Omit<ChartProps, "type">) {
  return <Chart type="radar" {...props} />;
}
