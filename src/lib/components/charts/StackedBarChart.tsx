import { useMemo } from "react";
import { Chart } from "./Chart";
import type { ChartProps } from "./Chart";

export function StackedBarChart({ options, ...props }: Omit<ChartProps, "type">) {
  const merged = useMemo(
    () => ({
      ...(options || {}),
      scales: {
        x: { stacked: true, ...((options || {}).scales as any)?.x },
        y: { stacked: true, ...((options || {}).scales as any)?.y },
      },
    }),
    [options]
  );
  return <Chart type="bar" {...props} options={merged} />;
}