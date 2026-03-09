import { cn } from "@/lib/utils";
import type { AnalyticsPocKpiRowProps } from "./types";

export function AnalyticsPocKpiRow({
  children,
  className,
}: AnalyticsPocKpiRowProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
