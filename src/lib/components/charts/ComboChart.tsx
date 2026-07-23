import { Chart } from "./Chart";
import type { ChartProps } from "./Chart";

export function ComboChart(props: Omit<ChartProps, "type">) {
  return <Chart type="combo" {...props} />;
}
