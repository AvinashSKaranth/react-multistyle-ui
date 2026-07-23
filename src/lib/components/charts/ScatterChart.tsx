import { Chart } from "./Chart";
import type { ChartProps } from "./Chart";

export function ScatterChart(props: Omit<ChartProps, "type">) {
  return <Chart type="scatter" {...props} />;
}
