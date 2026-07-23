import { Chart } from "./Chart";
import type { ChartProps } from "./Chart";

export function LineChart(props: Omit<ChartProps, "type">) {
  return <Chart type="line" {...props} />;
}