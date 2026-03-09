"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ANALYTICS_POC_CARD_CONTAINER_CLASS,
  ANALYTICS_POC_CARD_SURFACE_STYLE,
  ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
  AnalyticsPocCardHeader,
} from "./AnalyticsPocCardPrimitives";
import { AnalyticsPocChartPlaceholder } from "./AnalyticsPocChartPlaceholder";
import { AnalyticsPocChartToggleCard } from "./AnalyticsPocChartToggleCard";
import { AnalyticsPocEngagementCard } from "./AnalyticsPocEngagementCard";
import { AnalyticsPocFinancialSummaryCard } from "./AnalyticsPocFinancialSummaryCard";
import { AnalyticsPocHealthScoreDetailCard } from "./AnalyticsPocHealthScoreDetailCard";
import { AnalyticsPocMetricToggleRow } from "./AnalyticsPocMetricToggleRow";
import { AnalyticsPocPageShell } from "./AnalyticsPocPageShell";
import {
  AnalyticsPocToggleGroup,
  AnalyticsPocToggleGroupItem,
} from "./AnalyticsPocToggleGroup";
import { AnalyticsPocTwoColumnRow } from "./AnalyticsPocTwoColumnRow";
import type {
  AnalyticsPocActivityKpi,
  AnalyticsPocCampaignHealthTabProps,
  AnalyticsPocChartToggleCardProps,
} from "./types";

function ActivityKpiCard({ kpi }: { kpi: AnalyticsPocActivityKpi }) {
  return (
    <article
      className={cn(
        ANALYTICS_POC_CARD_CONTAINER_CLASS,
        ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
        "min-h-[85px] p-4",
      )}
      style={ANALYTICS_POC_CARD_SURFACE_STYLE}
    >
      <div className="relative z-10 flex h-full flex-col gap-2">
        <div className="flex items-center gap-[6px]">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: kpi.dotColor }}
          />
          <p className="font-inter text-[10px] font-medium uppercase leading-[1.2] tracking-[0.5px] text-[var(--ap-text-secondary)]">
            {kpi.label}
          </p>
        </div>
        <p className="font-inter text-[20px] font-medium leading-[1.2] tracking-[-0.33px] text-[var(--ap-text)]">
          {kpi.value}
        </p>
        <p className="font-inter text-[11px] font-normal leading-[1.2] text-[var(--ap-text-secondary)]">
          {kpi.subtitle}
        </p>
      </div>
    </article>
  );
}

function ActivityChartSection({
  chart,
  metrics,
}: {
  chart: AnalyticsPocCampaignHealthTabProps["activityChart"];
  metrics: AnalyticsPocChartToggleCardProps[];
}) {
  const [activeTab, setActiveTab] = useState("Daily");
  const [enabledMetrics, setEnabledMetrics] = useState<Set<string>>(() => {
    return new Set(
      metrics
        .filter((m) => m.enabled !== false)
        .map((m) => m.metricKey ?? m.label),
    );
  });

  const toggleMetric = (key: string) => {
    setEnabledMetrics((prev) => {
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
      )}
      style={ANALYTICS_POC_CARD_SURFACE_STYLE}
    >
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <AnalyticsPocCardHeader className="pb-0" title="Activity Over Time" />
          <AnalyticsPocToggleGroup
            defaultValue="Daily"
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <AnalyticsPocToggleGroupItem value="Daily">
              Daily
            </AnalyticsPocToggleGroupItem>
            <AnalyticsPocToggleGroupItem value="Cumulative">
              Cumulative
            </AnalyticsPocToggleGroupItem>
          </AnalyticsPocToggleGroup>
        </div>

        <AnalyticsPocMetricToggleRow>
          {metrics.map((metric) => {
            const key = metric.metricKey ?? metric.label;
            return (
              <AnalyticsPocChartToggleCard
                {...metric}
                enabled={enabledMetrics.has(key)}
                isInteractive
                key={key}
                onToggle={toggleMetric}
              />
            );
          })}
        </AnalyticsPocMetricToggleRow>

        <AnalyticsPocChartPlaceholder
          {...chart}
          activeLineDataset={
            activeTab === "Cumulative" ? "cumulative" : "daily"
          }
          visibleMetricKeys={Array.from(enabledMetrics)}
        />
      </div>
    </section>
  );
}

export function AnalyticsPocCampaignHealthTab({
  engagement,
  activityKpis,
  activityChart,
  activityChartMetrics,
  healthScore,
  financials,
  className,
}: AnalyticsPocCampaignHealthTabProps) {
  return (
    <AnalyticsPocPageShell className={className}>
      {/* 1. Engagement card */}
      <AnalyticsPocEngagementCard {...engagement} />

      {/* 2. Activity KPIs */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {activityKpis.map((kpi) => (
          <ActivityKpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      {/* 3. Activity Over Time chart */}
      <ActivityChartSection
        chart={activityChart}
        metrics={activityChartMetrics}
      />

      {/* 4. Health + Financials row */}
      <AnalyticsPocTwoColumnRow
        left={<AnalyticsPocHealthScoreDetailCard {...healthScore} />}
        right={<AnalyticsPocFinancialSummaryCard {...financials} />}
      />
    </AnalyticsPocPageShell>
  );
}
