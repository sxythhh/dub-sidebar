import type { CSSProperties } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  AnalyticsPocPlatformIcon,
  getAnalyticsPocPlatformBrandColor,
  hasAnalyticsPocPlatformIcon,
} from "./AnalyticsPocPlatformIcon";
import { PILL_MASK } from "@/components/discover/cards/VerifiedCardParts";
import styles from "./AnalyticsPocProgressBarRow.module.css";
import type {
  AnalyticsPocProgressBarRowProps,
  AnalyticsPocProgressMetric,
} from "./types";

const METRIC_TONE_CLASS = {
  default: "text-[var(--ap-text)]",
  muted: "text-[var(--ap-text-secondary)]",
} as const;

type AnalyticsPocProgressBarItem = AnalyticsPocProgressBarRowProps["item"];

function resolveDetailLabel({
  detailLabel,
  secondaryLabel,
}: AnalyticsPocProgressBarRowProps["item"]) {
  return detailLabel ?? secondaryLabel;
}

function resolveRightMetrics(
  item: AnalyticsPocProgressBarRowProps["item"],
): AnalyticsPocProgressMetric[] {
  if (item.rightMetrics?.length) {
    return item.rightMetrics;
  }

  const fallbackMetrics: AnalyticsPocProgressMetric[] = [];

  if (item.percentLabel) {
    fallbackMetrics.push({ text: item.percentLabel, tone: "muted" });
  }

  if (item.valueLabel) {
    fallbackMetrics.push({ text: item.valueLabel, tone: "default" });
  }

  return fallbackMetrics;
}

function resolveAccentColor(item: AnalyticsPocProgressBarRowProps["item"]) {
  if (item.accentColor) {
    return item.accentColor;
  }

  return item.platform
    ? getAnalyticsPocPlatformBrandColor(item.platform)
    : undefined;
}

function renderLeadingIndicator({
  item,
  accentColor,
  showPlatformIcon,
}: {
  item: AnalyticsPocProgressBarItem;
  accentColor?: string;
  showPlatformIcon: boolean;
}) {
  if (item.avatarSrc) {
    return (
      <Image
        alt={item.label}
        className="size-5 shrink-0 rounded-full object-cover"
        height={20}
        src={item.avatarSrc}
        width={20}
      />
    );
  }

  if (item.icon) {
    return (
      <span className="inline-flex shrink-0 items-center justify-center">
        {item.icon}
      </span>
    );
  }

  if (item.platform && showPlatformIcon) {
    return (
      <span className="inline-flex size-4 shrink-0 items-center justify-center">
        <AnalyticsPocPlatformIcon
          platform={item.platform}
          size={16}
          style={accentColor ? { color: accentColor } : undefined}
          tone={accentColor ? "inherit" : "brand"}
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "size-2 shrink-0 rounded-full",
        !accentColor && "bg-[var(--ap-text-tertiary)]",
        !accentColor && item.dotColorClass,
      )}
      style={accentColor ? { backgroundColor: accentColor } : undefined}
    />
  );
}

function renderRightMetrics({
  itemId,
  rightMetrics,
}: {
  itemId: string;
  rightMetrics: AnalyticsPocProgressMetric[];
}) {
  if (!rightMetrics.length) {
    return null;
  }

  return (
    <div className="shrink-0">
      <div className="flex items-center gap-[6px]">
        {rightMetrics.map((metric, index) => {
          const tone = metric.tone ?? "default";

          return (
            <div
              className="flex items-center gap-[6px]"
              key={`${itemId}-metric-${index + 1}`}
            >
              {index > 0 ? (
                <span
                  className={cn(
                    "font-inter text-[14px] font-normal leading-[1.2] tracking-[-0.09px] text-[var(--ap-text-quaternary)]",
                    styles.rowSeparator,
                  )}
                >
                  ·
                </span>
              ) : null}
              <span
                className={cn(
                  "font-inter text-[14px] font-normal leading-[1.2] tracking-[-0.09px]",
                  tone === "muted" ? styles.rowMetricMuted : styles.rowMetric,
                  METRIC_TONE_CLASS[tone],
                )}
              >
                {metric.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AnalyticsPocProgressBarRow({
  item,
  onClick,
  className,
}: AnalyticsPocProgressBarRowProps & { onClick?: () => void }) {
  const detailLabel = resolveDetailLabel(item);
  const rightMetrics = resolveRightMetrics(item);
  const fillPercent = Math.min(Math.max(item.progress, 0), 100);
  const accentColor = resolveAccentColor(item);
  const showPlatformIcon = item.platform
    ? hasAnalyticsPocPlatformIcon(item.platform)
    : false;
  const fillStyle = {
    "--accent": accentColor ?? "var(--ap-text-tertiary)",
    width: `${fillPercent}%`,
  } as CSSProperties;

  return (
    <article
      className={cn("group/progress-row", styles.row, onClick && "cursor-pointer", className)}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <span
        className={cn(
          "absolute inset-y-0 left-0 rounded-[12px] bg-[var(--ap-pill-bg-solid)]",
          styles.pillGlow,
        )}
        style={fillStyle}
      >
        <span
          className="absolute inset-0 rounded-[12px] pointer-events-none ap-pill-gradient-border"
          style={PILL_MASK}
        />
      </span>

      <div
        className={cn(
          "relative z-10 flex h-full items-center justify-between gap-4 pl-4 pr-3",
          styles.rowContent,
        )}
      >
        <div className="flex min-w-0 items-center gap-[6px]">
          {renderLeadingIndicator({ accentColor, item, showPlatformIcon })}

          <div className="flex min-w-0 items-center">
            <p
              className={cn(
                "truncate font-inter text-[14px] font-medium leading-[1.2] tracking-[-0.09px] text-[var(--ap-text)]",
                styles.rowLabel,
              )}
            >
              {item.label}
            </p>

            {detailLabel ? (
              <>
                <span
                  className={cn(
                    "mx-2 font-inter text-[14px] font-normal leading-[1.2] tracking-[-0.09px] text-[var(--ap-text-quaternary)]",
                    styles.rowSeparator,
                  )}
                >
                  ·
                </span>
                <p
                  className={cn(
                    "truncate font-inter text-[14px] font-normal leading-[1.2] tracking-[-0.09px] text-[var(--ap-text-secondary)]",
                    styles.rowDetail,
                  )}
                >
                  {detailLabel}
                </p>
              </>
            ) : null}
          </div>
        </div>

        {renderRightMetrics({ itemId: item.id, rightMetrics })}
      </div>
    </article>
  );
}
