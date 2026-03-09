import { cn } from "@/lib/utils";
import type { AnalyticsPocMediumCardsRowProps } from "./types";

export function AnalyticsPocMediumCardsRow({
  left,
  right,
  className,
}: AnalyticsPocMediumCardsRowProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-2 md:grid-cols-2", className)}>
      {left}
      {right}
    </div>
  );
}
