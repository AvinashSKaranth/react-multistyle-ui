import { Chart } from "./Chart";
import type { ChartProps } from "./Chart";

export function PolarAreaChart(props: Omit<ChartProps, "type">) {
  return <Chart type="polarArea" {...props} />;
}
