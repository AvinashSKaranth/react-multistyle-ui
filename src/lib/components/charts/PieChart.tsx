import { Chart } from "./Chart";
import type { ChartProps } from "./Chart";

export function PieChart(props: Omit<ChartProps, "type">) {
  return <Chart type="pie" {...props} />;
}
