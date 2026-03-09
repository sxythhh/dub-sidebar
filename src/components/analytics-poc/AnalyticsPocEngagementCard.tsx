"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ANALYTICS_POC_CARD_CONTAINER_CLASS,
  ANALYTICS_POC_CARD_SURFACE_STYLE,
  ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
  AnalyticsPocCardHeader,
} from "./AnalyticsPocCardPrimitives";
import { AnalyticsPocChartPlaceholder } from "./AnalyticsPocChartPlaceholder";
import { ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS } from "./interaction";
import type {
  AnalyticsPocEngagementCardProps,
  AnalyticsPocFunnelStep,
  AnalyticsPocTrafficSource,
} from "./types";

const FUNNEL_STEP_SURFACE_STYLE: CSSProperties = {
  background: "var(--ap-surface)",
  border: "1px solid var(--ap-surface-border)",
  borderRadius: "12px",
};

const CTR_PILL_STYLE: CSSProperties = {
  backgroundColor: "rgba(34, 197, 94, 0.12)",
  borderRadius: "100px",
  color: "#15803d",
};

const TRAFFIC_BAR_STYLE: CSSProperties = {
  background: "linear-gradient(90deg, #60A5FA 0%, #A78BFA 100%)",
  borderRadius: "4px",
};

const SERIES_COLORS: Record<string, string> = {
  applied: "#A78BFA",
  joined: "#34D399",
  views: "#60A5FA",
};

function FunnelSummaryRow({
  views,
  applied,
  joined,
  ctr,
}: AnalyticsPocEngagementCardProps["funnelSummary"]) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-inter text-[13px] font-medium leading-[1.2] text-[var(--ap-text)]">
        {views} Views
      </span>
      <span className="font-inter text-[13px] font-normal leading-[1.2] text-[var(--ap-text-tertiary)]">
        →
      </span>
      <span className="font-inter text-[13px] font-medium leading-[1.2] text-[var(--ap-text)]">
        {applied} Applied
      </span>
      <span className="font-inter text-[13px] font-normal leading-[1.2] text-[var(--ap-text-tertiary)]">
        →
      </span>
      <span className="font-inter text-[13px] font-medium leading-[1.2] text-[var(--ap-text)]">
        {joined} Joined
      </span>
      <span
        className="inline-flex h-5 items-center px-2 font-inter text-[11px] font-medium leading-[1.2]"
        style={CTR_PILL_STYLE}
      >
        {ctr} CTR
      </span>
    </div>
  );
}

function FunnelStepCard({
  label,
  value,
  subtitle,
  color,
}: AnalyticsPocFunnelStep) {
  return (
    <div
      className="flex flex-1 flex-col gap-1 p-3"
      style={FUNNEL_STEP_SURFACE_STYLE}
    >
      <p className="font-inter text-[10px] font-medium uppercase leading-[1.2] tracking-[0.5px] text-[var(--ap-text-secondary)]">
        {label}
      </p>
      <p
        className="font-inter text-[20px] font-semibold leading-[1.2] tracking-[-0.33px]"
        style={{ color }}
      >
        {value}
      </p>
      <p className="font-inter text-[11px] font-normal leading-[1.2] text-[var(--ap-text-secondary)]">
        {subtitle}
      </p>
    </div>
  );
}

function SeriesPill({
  label,
  color,
  active,
  onClick,
}: {
  label: string;
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS,
        "inline-flex h-7 items-center gap-[6px] rounded-[100px] px-3 font-inter text-[12px] font-medium leading-[1.2] transition-colors duration-150",
        active ? "text-[var(--ap-text)]" : "text-[var(--ap-text-tertiary)]",
      )}
      onClick={onClick}
      style={{
        backgroundColor: active ? "var(--ap-hover)" : "transparent",
        border: active ? "1px solid var(--ap-border)" : "1px solid transparent",
        borderRadius: "100px",
      }}
      type="button"
    >
      <span
        className="size-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </button>
  );
}

function TrafficSourceRow({ source }: { source: AnalyticsPocTrafficSource }) {
  return (
    <div className="grid grid-cols-[24px_1fr_100px_80px_60px_60px] items-center gap-3">
      <span className="font-inter text-[12px] font-medium leading-[1.2] text-[var(--ap-text-tertiary)] text-center">
        {source.rank}
      </span>
      <span className="truncate font-inter text-[13px] font-medium leading-[1.2] text-[var(--ap-text)]">
        {source.label}
      </span>
      <div className="h-[6px] overflow-hidden rounded-[4px] bg-[var(--ap-hover)]">
        <div
          className="h-full"
          style={{
            ...TRAFFIC_BAR_STYLE,
            width: `${Math.min(Math.max(source.progress, 0), 100)}%`,
          }}
        />
      </div>
      <span className="font-inter text-[12px] font-normal leading-[1.2] text-[var(--ap-text-strong)] text-right">
        {source.views}
      </span>
      <span className="font-inter text-[12px] font-normal leading-[1.2] text-[var(--ap-text-strong)] text-right">
        {source.applied}
      </span>
      <span className="font-inter text-[12px] font-normal leading-[1.2] text-[var(--ap-text-strong)] text-right">
        {source.convRate}
      </span>
    </div>
  );
}

export function AnalyticsPocEngagementCard({
  title,
  subtitle,
  funnelSummary,
  funnelSteps,
  trafficSources,
  chart,
  className,
}: AnalyticsPocEngagementCardProps) {
  const [activeSeriesKeys, setActiveSeriesKeys] = useState<Set<string>>(
    new Set(["views", "applied", "joined"]),
  );

  const toggleSeries = (key: string) => {
    setActiveSeriesKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) {
          next.delete(key);
        }
      } else {
        next.add(key);
      }
      return next;
    });
  };

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
        <AnalyticsPocCardHeader helperText={subtitle} title={title} />

        <FunnelSummaryRow {...funnelSummary} />

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {funnelSteps.map((step) => (
            <FunnelStepCard key={step.label} {...step} />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1 pt-2">
          {Object.entries(SERIES_COLORS).map(([key, color]) => (
            <SeriesPill
              active={activeSeriesKeys.has(key)}
              color={color}
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              onClick={() => toggleSeries(key)}
            />
          ))}
        </div>

        <AnalyticsPocChartPlaceholder
          {...chart}
          visibleMetricKeys={Array.from(activeSeriesKeys)}
        />

        <div className="flex flex-col gap-2 pt-2">
          <p className="font-inter text-[12px] font-medium uppercase leading-[1.2] tracking-[0.5px] text-[var(--ap-text-secondary)]">
            Traffic Sources
          </p>

          <div className="grid grid-cols-[24px_1fr_100px_80px_60px_60px] items-center gap-3 px-0 pb-1">
            <span className="font-inter text-[10px] font-medium leading-[1.2] text-[var(--ap-text-tertiary)] text-center">
              #
            </span>
            <span className="font-inter text-[10px] font-medium leading-[1.2] text-[var(--ap-text-tertiary)]">
              Source
            </span>
            <span />
            <span className="font-inter text-[10px] font-medium leading-[1.2] text-[var(--ap-text-tertiary)] text-right">
              Views
            </span>
            <span className="font-inter text-[10px] font-medium leading-[1.2] text-[var(--ap-text-tertiary)] text-right">
              Applied
            </span>
            <span className="font-inter text-[10px] font-medium leading-[1.2] text-[var(--ap-text-tertiary)] text-right">
              Conv.
            </span>
          </div>

          <div className="flex flex-col gap-1">
            {trafficSources.map((source) => (
              <TrafficSourceRow key={source.id} source={source} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
