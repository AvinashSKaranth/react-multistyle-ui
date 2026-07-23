import { Chart } from "./Chart";
import type { ChartProps } from "./Chart";

export function DoughnutChart(props: Omit<ChartProps, "type">) {
  return <Chart type="doughnut" {...props} />;
}
