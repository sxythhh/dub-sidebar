import Image from "next/image";
import { GlassActionButton } from "@/components/ui/glass-button";
import { cn } from "@/lib/utils";
import { AnalyticsPocCardEffectsLayer } from "./AnalyticsPocCardEffectsLayer";
import {
  ANALYTICS_POC_CARD_HEADING_IMAGE_ICON_CLASS,
  ANALYTICS_POC_CARD_TOOLTIP_IMAGE_ICON_CLASS,
  ANALYTICS_POC_STATUS_SUCCESS_CLASS,
  AnalyticsPocCardHeader,
} from "./AnalyticsPocCardPrimitives";
import { AnalyticsPocMediumCardBase } from "./AnalyticsPocMediumCardBase";
import { ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS } from "./interaction";
import type { AnalyticsPocHealthCardProps } from "./types";

const HEALTH_CARD_DEFAULT_EFFECTS = {
  accentColor: "#98D172",
  graphicSrc: "/effects/analytics-health-wave.svg",
} as const;

function resolveHealthEffects(effects: AnalyticsPocHealthCardProps["effects"]) {
  if (!effects) {
    return undefined;
  }

  return {
    accentColor: effects.accentColor ?? HEALTH_CARD_DEFAULT_EFFECTS.accentColor,
    graphicSrc: effects.graphicSrc || HEALTH_CARD_DEFAULT_EFFECTS.graphicSrc,
  };
}
export function AnalyticsPocHealthCard({
  title,
  score,
  statusText,
  trendLabel,
  ctaLabel,
  infoTooltipText = "Overall campaign health score based on recent creator activity and performance signals.",
  iconSrc = "/icons/svg/analytics-health-ecg.svg",
  showInfoIcon = true,
  infoIconSrc = "/icons/svg/analytics-info-circle.svg",
  progressPercent = 75,
  effects,
  className,
}: AnalyticsPocHealthCardProps) {
  const boundedProgress = Math.min(100, Math.max(0, progressPercent));
  const barHeight = Math.max(4, Math.round((boundedProgress / 100) * 56));
  const resolvedEffects = resolveHealthEffects(effects);
  const accentColor =
    resolvedEffects?.accentColor ?? HEALTH_CARD_DEFAULT_EFFECTS.accentColor;

  return (
    <AnalyticsPocMediumCardBase
      className={cn(resolvedEffects && "group/card-effects", className)}
      effectsLayer={
        resolvedEffects ? (
          <AnalyticsPocCardEffectsLayer
            accentColor={accentColor}
            graphicSrc={resolvedEffects.graphicSrc}
          />
        ) : undefined
      }
    >
      <AnalyticsPocCardHeader
        icon={
          <Image
            alt=""
            className={ANALYTICS_POC_CARD_HEADING_IMAGE_ICON_CLASS}
            height={16}
            src={iconSrc}
            width={16}
          />
        }
        rightContent={
          <p className={ANALYTICS_POC_STATUS_SUCCESS_CLASS}>{statusText}</p>
        }
        title={title}
        tooltipIcon={
          <Image
            alt=""
            className={ANALYTICS_POC_CARD_TOOLTIP_IMAGE_ICON_CLASS}
            fill
            sizes="16px"
            src={infoIconSrc}
          />
        }
        tooltipText={showInfoIcon ? infoTooltipText : undefined}
      />

      <div className="mt-auto flex items-end justify-between gap-4">
        <div className="flex items-end gap-3">
          <p className="font-inter text-[64px] font-medium leading-none tracking-[-1.28px] text-[var(--ap-text)]">
            {score}
          </p>

          <span
            className="relative mb-[5px] h-[56px] w-1 shrink-0 overflow-hidden rounded-[999px]"
            style={{ backgroundColor: `${accentColor}33` }}
          >
            <span
              className="absolute inset-x-0 bottom-0 rounded-[999px] bg-[#15803d]"
              style={{ backgroundColor: accentColor, height: `${barHeight}px` }}
            />
          </span>

          {trendLabel ? (
            <span
              className={cn("mb-[9px]", ANALYTICS_POC_STATUS_SUCCESS_CLASS)}
            >
              {trendLabel}
            </span>
          ) : null}
        </div>

        <GlassActionButton
          className={cn(
            ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS,
            "h-8 min-w-0 shrink-0 cursor-pointer px-3 text-xs",
          )}
        >
          {ctaLabel}
        </GlassActionButton>
      </div>
    </AnalyticsPocMediumCardBase>
  );
}
