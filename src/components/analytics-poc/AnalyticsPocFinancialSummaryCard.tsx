import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  ANALYTICS_POC_CARD_CONTAINER_CLASS,
  ANALYTICS_POC_CARD_SURFACE_STYLE,
  ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
} from "./AnalyticsPocCardPrimitives";
import type {
  AnalyticsPocCostMetric,
  AnalyticsPocFinancialLegendItem,
  AnalyticsPocFinancialSummaryCardProps,
} from "./types";

const PROGRESS_BAR_STYLE: CSSProperties = {
  backgroundColor: "#10B981",
  borderRadius: "4px",
};

function LegendDot({ color }: { color: string }) {
  return (
    <span
      className="size-2 shrink-0 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

function LegendItem({ item }: { item: AnalyticsPocFinancialLegendItem }) {
  return (
    <div className="flex items-center gap-[6px]">
      <LegendDot color={item.color} />
      <div className="flex flex-col gap-[2px]">
        <span className="font-inter text-[11px] font-normal leading-[1.2] text-[var(--ap-text-secondary)]">
          {item.label}
        </span>
        <span className="font-inter text-[13px] font-medium leading-[1.2] text-[var(--ap-text)]">
          {item.value}
        </span>
      </div>
    </div>
  );
}

function CostMetricCell({ metric }: { metric: AnalyticsPocCostMetric }) {
  return (
    <div className="flex flex-col gap-[2px]">
      <span className="font-inter text-[11px] font-normal leading-[1.2] text-[var(--ap-text-secondary)]">
        {metric.label}
      </span>
      <span className="font-inter text-[16px] font-semibold leading-[1.2] tracking-[-0.18px] text-[var(--ap-text)]">
        {metric.value}
      </span>
    </div>
  );
}

export function AnalyticsPocFinancialSummaryCard({
  title,
  budgetUsedLabel,
  spent,
  total,
  remaining,
  progressPercent,
  legend,
  costMetrics,
  className,
}: AnalyticsPocFinancialSummaryCardProps) {
  const clampedProgress = Math.min(Math.max(progressPercent, 0), 100);

  return (
    <section
      className={cn(
        ANALYTICS_POC_CARD_CONTAINER_CLASS,
        ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
        "p-5",
        className,
      )}
      style={ANALYTICS_POC_CARD_SURFACE_STYLE}
    >
      <div className="relative z-10 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p
            className="font-inter text-[14px] font-normal leading-[1.2] tracking-[-0.09px]"
            style={{ color: "var(--ap-text-heading)" }}
          >
            {title}
          </p>
          <span className="font-inter text-[12px] font-normal leading-[1.2] text-[var(--ap-text-secondary)]">
            {budgetUsedLabel}
          </span>
        </div>

        {/* Big number row */}
        <div className="flex items-baseline justify-between gap-2">
          <p className="font-inter text-[24px] font-semibold leading-[1.2] tracking-[-0.48px] text-[var(--ap-text)]">
            {spent}
          </p>
          <p className="font-inter text-[14px] font-normal leading-[1.2] text-[var(--ap-text-secondary)]">
            of {total}
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-[6px] overflow-hidden rounded-[4px] bg-[var(--ap-hover)]">
          <div
            className="h-full"
            style={{
              ...PROGRESS_BAR_STYLE,
              width: `${clampedProgress}%`,
            }}
          />
        </div>

        <p className="font-inter text-[12px] font-normal leading-[1.2] text-[var(--ap-text-secondary)]">
          {remaining} remaining
        </p>

        {/* Separator */}
        <div className="h-px bg-[var(--ap-hover)]" />

        {/* Legend row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {legend.map((item) => (
            <LegendItem item={item} key={item.label} />
          ))}
        </div>

        {/* Separator */}
        <div className="h-px bg-[var(--ap-hover)]" />

        {/* Cost per action header */}
        <p className="font-inter text-[10px] font-medium uppercase leading-[1.2] tracking-[0.5px] text-[var(--ap-text-secondary)]">
          Cost Per Action
        </p>

        {/* Cost metrics 2x2 grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {costMetrics.map((metric) => (
            <CostMetricCell key={metric.label} metric={metric} />
          ))}
        </div>
      </div>
    </section>
  );
}
