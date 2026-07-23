import { Chart } from "./Chart";
import type { ChartProps } from "./Chart";

export function BubbleChart(props: Omit<ChartProps, "type">) {
  return <Chart type="bubble" {...props} />;
}
