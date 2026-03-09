import { cn } from "@/lib/utils";
import {
  ANALYTICS_POC_CARD_CONTAINER_CLASS,
  ANALYTICS_POC_CARD_SURFACE_STYLE,
  ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
} from "./AnalyticsPocCardPrimitives";
import type {
  AnalyticsPocHealthScoreBreakdownItem,
  AnalyticsPocHealthScoreDetailCardProps,
} from "./types";

function resolveBarColor(score: number, maxScore: number): string {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
  return pct >= 75 ? "#22C55E" : "#EAB308";
}

function BreakdownRow({
  item,
}: {
  item: AnalyticsPocHealthScoreBreakdownItem;
}) {
  const fillPct = item.maxScore > 0 ? (item.score / item.maxScore) * 100 : 0;
  const barColor = resolveBarColor(item.score, item.maxScore);

  return (
    <div className="grid grid-cols-[1fr_48px_80px_48px] items-center gap-3">
      <span className="truncate font-inter text-[13px] font-medium leading-[1.2] text-[var(--ap-text)]">
        {item.label}
      </span>
      <span className="font-inter text-[11px] font-normal leading-[1.2] text-[var(--ap-text-secondary)] text-right">
        {item.weight}
      </span>
      <div className="h-[6px] overflow-hidden rounded-[4px] bg-[var(--ap-hover)]">
        <div
          className="h-full rounded-[4px]"
          style={{
            backgroundColor: barColor,
            width: `${Math.min(Math.max(fillPct, 0), 100)}%`,
          }}
        />
      </div>
      <span className="font-inter text-[13px] font-medium leading-[1.2] text-[var(--ap-text)] text-right">
        {item.score}
      </span>
    </div>
  );
}

export function AnalyticsPocHealthScoreDetailCard({
  title,
  score,
  maxScore,
  items,
  className,
}: AnalyticsPocHealthScoreDetailCardProps) {
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
        <div className="flex items-center justify-between">
          <p
            className="font-inter text-[14px] font-normal leading-[1.2] tracking-[-0.09px]"
            style={{ color: "var(--ap-text-heading)" }}
          >
            {title}
          </p>
          <p className="font-inter text-[20px] font-semibold leading-[1.2] tracking-[-0.33px] text-[var(--ap-text)]">
            {score}{" "}
            <span className="font-inter text-[14px] font-normal leading-[1.2] text-[var(--ap-text-tertiary)]">
              / {maxScore}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <BreakdownRow item={item} key={item.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
