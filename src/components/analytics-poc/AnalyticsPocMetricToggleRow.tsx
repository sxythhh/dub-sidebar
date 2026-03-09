import { cn } from "@/lib/utils";
import type { AnalyticsPocMetricToggleRowProps } from "./types";

export function AnalyticsPocMetricToggleRow({
  children,
  className,
}: AnalyticsPocMetricToggleRowProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
