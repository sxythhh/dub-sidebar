import { cn } from "@/lib/utils";
import {
  ANALYTICS_POC_CARD_CONTAINER_CLASS,
  ANALYTICS_POC_CARD_SURFACE_STYLE,
  ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
} from "./AnalyticsPocCardPrimitives";
import type {
  AnalyticsPocKpiCardProps,
  AnalyticsPocKpiDeltaTone,
} from "./types";

const DELTA_COLOR: Record<AnalyticsPocKpiDeltaTone, string> = {
  danger: "text-[#b91c1c]",
  neutral: "text-[var(--ap-text-secondary)]",
  success: "text-[#00B259]",
};

export function AnalyticsPocKpiCard({
  label,
  value,
  deltaBadge,
  meta,
  onClick,
  className,
}: AnalyticsPocKpiCardProps) {
  return (
    <article
      className={cn(
        ANALYTICS_POC_CARD_CONTAINER_CLASS,
        ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
        "flex flex-col justify-center gap-2 p-3",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      style={ANALYTICS_POC_CARD_SURFACE_STYLE}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Row 1: value + delta */}
      <div className="flex items-center justify-between gap-3">
        <p className="font-inter text-[14px] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--ap-text)]">
          {value}
        </p>
        {deltaBadge ? (
          <span
            className={cn(
              "font-inter text-[12px] font-medium leading-none tracking-[-0.02em]",
              DELTA_COLOR[deltaBadge.tone ?? "success"],
            )}
          >
            {deltaBadge.label}
          </span>
        ) : meta ? (
          <span className="font-inter text-[12px] font-normal leading-none tracking-[-0.02em] text-[var(--ap-text-secondary)]">
            {meta}
          </span>
        ) : null}
      </div>

      {/* Row 2: label */}
      <p className="font-inter text-[12px] font-normal leading-none tracking-[-0.02em] text-[var(--ap-text-secondary)]">
        {label}
      </p>
    </article>
  );
}
