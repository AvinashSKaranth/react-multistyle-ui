import { useMemo } from "react";
import { Chart } from "./Chart";
import type { ChartProps } from "./Chart";

export function StackedLineChart({ options, ...props }: Omit<ChartProps, "type">) {
  const merged = useMemo(
    () => ({
      ...(options || {}),
      scales: {
        x: { stacked: true, ...((options || {}).scales as any)?.x },
        y: { stacked: true, ...((options || {}).scales as any)?.y },
      },
      elements: { line: { fill: true, ...((options || {}).elements as any)?.line } },
    }),
    [options]
  );
  return <Chart type="line" {...props} options={merged} />;
}