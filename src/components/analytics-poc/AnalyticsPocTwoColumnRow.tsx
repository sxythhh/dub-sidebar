import { cn } from "@/lib/utils";
import type { AnalyticsPocTwoColumnRowProps } from "./types";

export function AnalyticsPocTwoColumnRow({
  left,
  right,
  className,
}: AnalyticsPocTwoColumnRowProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-2 md:grid-cols-2", className)}>
      {left}
      {right}
    </div>
  );
}
