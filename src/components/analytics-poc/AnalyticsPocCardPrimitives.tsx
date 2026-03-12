import Image from "next/image";
import type { CSSProperties } from "react";
import { GlassTooltip } from "@/components/ui/glass-tooltip";
import { cn } from "@/lib/utils";
import type { AnalyticsPocCardHeaderProps } from "./types";

export const ANALYTICS_POC_CARD_CONTAINER_CLASS = "relative overflow-hidden";
export const ANALYTICS_POC_INTERACTIVE_CARD_CLASS = cn(
  "ap-card-interactive",
  "group/ap-card",
  "shadow-[var(--ap-card-shadow)]",
);

export const ANALYTICS_POC_CARD_SURFACE_STYLE: CSSProperties = {
  background: "var(--card-bg)",
  border: "1px solid var(--border)",
  borderRadius: "16px",
};

const ANALYTICS_POC_CARD_TITLE_CLASS =
  "font-inter text-[14px] font-normal leading-[1.2] tracking-[-0.09px]";

const ANALYTICS_POC_CARD_TITLE_STYLE: CSSProperties = {
  color: "var(--ap-text-heading)",
};

const ANALYTICS_POC_CARD_HELPER_TEXT_CLASS =
  "font-inter text-[12px] font-normal leading-[1.2]";

const ANALYTICS_POC_CARD_HELPER_TEXT_STYLE: CSSProperties = {
  color: "var(--ap-text-helper)",
};

export const ANALYTICS_POC_CARD_HEADING_ICON_COLOR_CLASS = "text-current";

const ANALYTICS_POC_CARD_HEADING_ICON_STYLE: CSSProperties = {
  color: "var(--ap-icon)",
};

export const ANALYTICS_POC_CARD_HEADING_IMAGE_ICON_CLASS =
  "size-4 object-contain dark:invert";

const _ANALYTICS_POC_CARD_TOOLTIP_ICON_COLOR_CLASS = "text-current";

const _ANALYTICS_POC_CARD_TOOLTIP_ICON_STYLE: CSSProperties = {
  color: "var(--ap-text-tertiary)",
};

export const ANALYTICS_POC_CARD_TOOLTIP_IMAGE_ICON_CLASS =
  "object-contain brightness-0 opacity-40 dark:invert";

const ANALYTICS_POC_CARD_HEADER_LEFT_CLASS =
  "flex min-w-0 items-center gap-[6px]";

const ANALYTICS_POC_CARD_HEADER_CONTENT_GAP_CLASS = "mt-2";

export const ANALYTICS_POC_STATUS_SUCCESS_CLASS =
  "font-inter text-[12px] font-medium leading-[1.2] text-success";

function _DefaultTooltipIcon() {
  return (
    <Image
      alt=""
      className={ANALYTICS_POC_CARD_TOOLTIP_IMAGE_ICON_CLASS}
      fill
      sizes="16px"
      src="/icons/svg/analytics-info-circle.svg"
    />
  );
}

export function AnalyticsPocCardHeader({
  title,
  icon,
  tooltipText,
  tooltipIcon: _tooltipIcon,
  helperText,
  rightContent,
  className,
  rowClassName,
  leftClassName,
  titleClassName,
  helperClassName,
  rightClassName,
  iconClassName,
  tooltipClassName,
}: AnalyticsPocCardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 pb-4",
        className,
        rowClassName,
      )}
    >
      <div className="min-w-0 flex-[1_0_0]">
        <div
          className={cn(ANALYTICS_POC_CARD_HEADER_LEFT_CLASS, leftClassName)}
        >
          {icon ? (
            <span
              className={cn(
                "relative inline-flex size-4 shrink-0 items-center justify-center",
                ANALYTICS_POC_CARD_HEADING_ICON_COLOR_CLASS,
                iconClassName,
              )}
              style={ANALYTICS_POC_CARD_HEADING_ICON_STYLE}
            >
              {icon}
            </span>
          ) : null}

          {tooltipText ? (
            <GlassTooltip
              className={cn(
                "min-w-0 truncate",
                ANALYTICS_POC_CARD_TITLE_CLASS,
                "cursor-help decoration-dotted decoration-[var(--ap-text-quaternary)] underline-offset-[3px] hover:underline",
                tooltipClassName,
                titleClassName,
              )}
              text={tooltipText}
            >
              <span style={ANALYTICS_POC_CARD_TITLE_STYLE}>{title}</span>
            </GlassTooltip>
          ) : (
            <div
              className={cn(
                "min-w-0 truncate",
                ANALYTICS_POC_CARD_TITLE_CLASS,
                titleClassName,
              )}
              style={ANALYTICS_POC_CARD_TITLE_STYLE}
            >
              {title}
            </div>
          )}
        </div>

        {helperText ? (
          <div
            className={cn(
              ANALYTICS_POC_CARD_HELPER_TEXT_CLASS,
              ANALYTICS_POC_CARD_HEADER_CONTENT_GAP_CLASS,
              helperClassName,
            )}
            style={ANALYTICS_POC_CARD_HELPER_TEXT_STYLE}
          >
            {helperText}
          </div>
        ) : null}
      </div>

      {rightContent ? (
        <div className={cn("shrink-0 self-start", rightClassName)}>
          {rightContent}
        </div>
      ) : null}
    </div>
  );
}
