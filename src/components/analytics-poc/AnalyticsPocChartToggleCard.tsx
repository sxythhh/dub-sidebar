import { cn } from "@/lib/utils";
import {
  ANALYTICS_POC_CARD_CONTAINER_CLASS,
  ANALYTICS_POC_CARD_SURFACE_STYLE,
  ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
} from "./AnalyticsPocCardPrimitives";
import type { AnalyticsPocChartToggleCardProps } from "./types";

export function AnalyticsPocChartToggleCard({
  label,
  value,
  metricKey,
  dotColorClass = "bg-muted-foreground",
  enabled = true,
  isInteractive = false,
  onToggle,
  className,
}: AnalyticsPocChartToggleCardProps) {
  const canToggle = Boolean(isInteractive && metricKey && onToggle);

  const containerClass = cn(
    ANALYTICS_POC_CARD_CONTAINER_CLASS,
    ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
    "flex flex-col justify-center gap-2 p-3",
    !enabled && "opacity-50",
    className,
  );

  const content = (
    <>
      {/* Row 1: value + toggle indicator */}
      <div className="flex items-center justify-between gap-3">
        <p className="font-inter text-[14px] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--ap-text)]">
          {value}
        </p>
        {canToggle && (
          <span
            className={cn(
              "size-3 shrink-0 rounded-full border-[1.5px]",
              enabled
                ? "border-[var(--ap-text-strong)] bg-[var(--ap-text-strong)]"
                : "border-[var(--ap-text-quaternary)]",
            )}
          />
        )}
      </div>

      {/* Row 2: dot + label */}
      <div className="flex items-center gap-[6px]">
        <span className={cn("size-2 shrink-0 rounded-full", dotColorClass)} />
        <p className="font-inter text-[12px] font-normal leading-none tracking-[-0.02em] text-[var(--ap-text-secondary)]">
          {label}
        </p>
      </div>
    </>
  );

  if (!canToggle) {
    return (
      <article className={containerClass} style={ANALYTICS_POC_CARD_SURFACE_STYLE}>
        {content}
      </article>
    );
  }

  return (
    <button
      aria-pressed={enabled}
      className={cn(containerClass, "cursor-pointer text-left active:scale-[0.97]")}
      onClick={() => metricKey && onToggle?.(metricKey)}
      style={ANALYTICS_POC_CARD_SURFACE_STYLE}
      type="button"
    >
      {content}
    </button>
  );
}
