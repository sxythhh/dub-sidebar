import type { FC, KeyboardEvent, SVGProps } from "react";
import DollarIcon from "@/assets/icons/dollar-circle.svg";
import EyeIcon from "@/assets/icons/eye.svg";
import MoneyBagIcon from "@/assets/icons/money-bag.svg";
import SubmissionsIcon from "@/assets/icons/submissions.svg";
import { cn } from "@/lib/utils";
import {
  ANALYTICS_POC_CARD_CONTAINER_CLASS,
  ANALYTICS_POC_CARD_SURFACE_STYLE,
  ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
  ANALYTICS_POC_STATUS_SUCCESS_CLASS,
  AnalyticsPocCardHeader,
} from "./AnalyticsPocCardPrimitives";
import type {
  AnalyticsPocKpiCardProps,
  AnalyticsPocKpiDeltaTone,
  AnalyticsPocKpiIcon,
  AnalyticsPocTone,
} from "./types";

const VARIANT_CLASS: Record<
  NonNullable<AnalyticsPocKpiCardProps["variant"]>,
  string
> = {
  "cpm-efficient": "",
  "cpm-inefficient": "",
  default: "",
  payouts: "",
  submissions: "",
  views: "",
};

const TONE_CLASS: Record<AnalyticsPocTone, string> = {
  danger: "text-destructive",
  neutral: "text-muted-foreground",
  success: "text-success",
  warning: "text-primary",
};

const BADGE_TONE_CLASS: Record<AnalyticsPocKpiDeltaTone, string> = {
  danger: "bg-[rgba(220,38,38,0.1)] text-[#b91c1c]",
  neutral: "bg-[var(--ap-hover)] text-[var(--ap-text-secondary)]",
  success: "bg-[rgba(21,128,61,0.1)] text-[#15803d]",
};

const ICON_COMPONENT: Partial<
  Record<AnalyticsPocKpiIcon, FC<SVGProps<SVGSVGElement>>>
> = {
  cpm: DollarIcon,
  payouts: MoneyBagIcon,
  submissions: SubmissionsIcon,
  views: EyeIcon,
};

export function AnalyticsPocKpiCard({
  label,
  value,
  iconName,
  deltaBadge,
  meta,
  status,
  tone = "neutral",
  variant = "default",
  onClick,
  className,
}: AnalyticsPocKpiCardProps) {
  const IconSvg = iconName ? ICON_COMPONENT[iconName] : undefined;
  const badgeTone = deltaBadge?.tone ?? "success";
  const statusClassName =
    tone === "success"
      ? ANALYTICS_POC_STATUS_SUCCESS_CLASS
      : cn(
          "font-inter text-[12px] font-medium leading-[1.2]",
          TONE_CLASS[tone],
        );
  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!onClick) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <article
      className={cn(
        ANALYTICS_POC_CARD_CONTAINER_CLASS,
        ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
        "min-h-[85px] p-4",
        onClick && "cursor-pointer",
        VARIANT_CLASS[variant],
        className,
      )}
      onClick={onClick}
      onKeyDown={onClick ? handleCardKeyDown : undefined}
      role={onClick ? "button" : undefined}
      style={ANALYTICS_POC_CARD_SURFACE_STYLE}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="relative z-10 flex h-full flex-col">
        <AnalyticsPocCardHeader
          icon={
            IconSvg ? (
              <IconSvg className="text-current" height={16} width={16} />
            ) : undefined
          }
          rightContent={
            status ? <span className={statusClassName}>{status}</span> : null
          }
          title={label}
        />

        <div className="mt-auto flex items-baseline justify-between gap-2">
          <p className="font-inter text-[20px] font-medium leading-[1.2] tracking-[-0.33px] text-[var(--ap-text)]">
            {value}
          </p>
          {deltaBadge ? (
            <span
              className={cn(
                "inline-flex h-5 items-center justify-center rounded-[100px] px-1",
                "font-inter text-[12px] font-medium leading-[1.2]",
                BADGE_TONE_CLASS[badgeTone],
              )}
            >
              {deltaBadge.label}
            </span>
          ) : meta ? (
            <p className="font-inter text-[12px] font-normal leading-[1.2] text-[var(--ap-text-secondary)]">
              {meta}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
