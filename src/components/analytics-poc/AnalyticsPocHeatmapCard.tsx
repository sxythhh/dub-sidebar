"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import Heatmap, { type HeatmapData } from "@/components/blocks/heatmap";
import {
  ANALYTICS_POC_CARD_HEADING_ICON_COLOR_CLASS,
  AnalyticsPocCardHeader,
} from "./AnalyticsPocCardPrimitives";
import { AnalyticsPocBestTimePill } from "./AnalyticsPocBestTimePill";
import { AnalyticsPocPanel } from "./AnalyticsPocPanel";
import {
  AnalyticsPocPlatformIcon,
  getAnalyticsPocPlatformBrandColor,
  hasAnalyticsPocPlatformIcon,
} from "./AnalyticsPocPlatformIcon";
import type { AnalyticsPocHeatmapCardProps } from "./types";

const HEATMAP_TONE_COLOR: Record<AnalyticsPocHeatmapCardProps["tone"], string> =
  {
    blue: "#4E8EEE",
    green: "#13C368",
    purple: "#AE4EEE",
    red: "#EE4E51",
  };


export function AnalyticsPocHeatmapCard({
  title,
  subtitle,
  badge,
  platform,
  tone,
  footerLeft,
  footerRight,
  heatmapData,
  startDate,
  endDate,
  className,
}: AnalyticsPocHeatmapCardProps) {
  const toneColor =
    (platform ? getAnalyticsPocPlatformBrandColor(platform) : undefined) ??
    HEATMAP_TONE_COLOR[tone];
  const showPlatformIcon = platform
    ? hasAnalyticsPocPlatformIcon(platform)
    : false;

  const colorScale = useMemo(
    () => [
      "var(--ap-hover)",
      `color-mix(in srgb, ${toneColor} 25%, transparent)`,
      `color-mix(in srgb, ${toneColor} 50%, transparent)`,
      `color-mix(in srgb, ${toneColor} 75%, transparent)`,
      toneColor,
    ],
    [toneColor],
  );

  return (
    <AnalyticsPocPanel className={cn(className)}>
      <AnalyticsPocCardHeader
        helperText={subtitle}
        icon={
          platform && showPlatformIcon ? (
            <AnalyticsPocPlatformIcon
              className={ANALYTICS_POC_CARD_HEADING_ICON_COLOR_CLASS}
              platform={platform}
              size={16}
              tone="inherit"
            />
          ) : undefined
        }
        rightContent={<AnalyticsPocBestTimePill label={badge} />}
        title={title}
      />

      <Heatmap
        data={heatmapData}
        startDate={startDate}
        endDate={endDate}
        colorScale={colorScale}
        colorMode="interpolate"
        legend={{ left: footerLeft, right: footerRight }}
      />
    </AnalyticsPocPanel>
  );
}
