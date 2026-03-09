"use client";

import { motion } from "motion/react";
import Image from "next/image";

import { useEffect, useMemo, useState } from "react";
import {
  AnalyticsPocCampaignHealthTab,
  AnalyticsPocChartPlaceholder,
  AnalyticsPocDateRangePicker,
  AnalyticsPocDayDrilldown,
  AnalyticsPocDetailDialog,
  AnalyticsPocFilterToolbar,
  AnalyticsPocHeader,
  AnalyticsPocHealthCard,
  AnalyticsPocHeatmapCard,
  AnalyticsPocInsightsCard,
  AnalyticsPocKpiCard,
  AnalyticsPocKpiRow,
  AnalyticsPocMediumCardsRow,
  AnalyticsPocPageShell,
  AnalyticsPocPanel,
  AnalyticsPocRankListCard,
  AnalyticsPocSectionHeader,
  AnalyticsPocSelect,
  AnalyticsPocToggleGroup,
  AnalyticsPocToggleGroupItem,
  AnalyticsPocTopPostsTable,
  AnalyticsPocTwoColumnRow,
  AnalyticsPocViewsDetail,
  analyticsPocCampaignHealthMockData,
  analyticsPocMockData,
  analyticsPocViewsDetailMockData,
  getAnalyticsPocDayDrilldown,
} from "@/components/analytics-poc";
import { AnalyticsPocChartToggleChip } from "@/components/analytics-poc/AnalyticsPocChartToggleChip";
import type { AnalyticsPocDayDrilldownData } from "@/components/analytics-poc/AnalyticsPocDayDrilldown";

const PAGE_TABS = ["Overview", "Campaign Health"] as const;
type PageTab = (typeof PAGE_TABS)[number];

const DRILLDOWN_TRANSITION = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
} as const;

export function AnalyticsPocView() {
  const data = analyticsPocMockData;
  const [activePageTab, _setActivePageTab] = useState<PageTab>("Overview");
  const [activePerformanceTab, setActivePerformanceTab] = useState(
    data.performance.activeTab,
  );
  const [performanceMetricState, setPerformanceMetricState] = useState(() =>
    data.performance.metrics.reduce<Record<string, boolean>>((acc, metric) => {
      if (metric.metricKey) {
        acc[metric.metricKey] = metric.enabled ?? true;
      }
      return acc;
    }, {}),
  );
  const [totalPostsMetricState, setTotalPostsMetricState] = useState(() =>
    data.totalPosts.metrics.reduce<Record<string, boolean>>((acc, metric) => {
      if (metric.metricKey) {
        acc[metric.metricKey] = metric.enabled ?? metric.selected ?? true;
      }
      return acc;
    }, {}),
  );
  const [dateRange, setDateRange] = useState("last-30-days");
  const [selectedCampaign, setSelectedCampaign] = useState("fall-off");
  const [perfRange, setPerfRange] = useState("last-30-days");
  const [showViewsDetail, setShowViewsDetail] = useState(false);
  const [viewsDialogOpen, setViewsDialogOpen] = useState(false);
  const [dayDrilldown, setDayDrilldown] =
    useState<AnalyticsPocDayDrilldownData | null>(null);

  useEffect(() => {
    const body = document.body;
    const hadNoGlowClass = body.classList.contains("no-glow");

    body.classList.add("no-glow");

    return () => {
      body.classList.remove("no-glow");
      if (hadNoGlowClass) {
        body.classList.add("no-glow");
      }
    };
  }, []);

  const visiblePerformanceMetricKeys = useMemo(
    () =>
      Object.entries(performanceMetricState)
        .filter(([, isEnabled]) => isEnabled)
        .map(([metricKey]) => metricKey),
    [performanceMetricState],
  );
  const visibleTotalPostsMetricKeys = useMemo(
    () =>
      Object.entries(totalPostsMetricState)
        .filter(([, isEnabled]) => isEnabled)
        .map(([metricKey]) => metricKey),
    [totalPostsMetricState],
  );
  const performanceSeriesColorByKey = Object.fromEntries(
    (data.performance.chart.lineChart?.series ?? []).map((series) => [
      series.key,
      series.color,
    ]),
  ) as Record<string, string>;
  const totalPostsSeriesColorByKey = Object.fromEntries(
    (data.totalPosts.chart.stackedBarChart?.series ?? []).map((series) => [
      series.key,
      series.color,
    ]),
  ) as Record<string, string>;

  const handlePerformanceMetricToggle = (metricKey: string) => {
    setPerformanceMetricState((previousState) => ({
      ...previousState,
      [metricKey]: !previousState[metricKey],
    }));
  };

  const handleTotalPostsMetricToggle = (metricKey: string) => {
    setTotalPostsMetricState((previousState) => {
      const enabledCount = Object.values(previousState).filter(Boolean).length;
      if (previousState[metricKey] && enabledCount <= 1) {
        return previousState;
      }

      return {
        ...previousState,
        [metricKey]: !previousState[metricKey],
      };
    });
  };

  const handleDayClick = (index: number, label: string) => {
    setDayDrilldown(getAnalyticsPocDayDrilldown(index, label));
  };


  const campaignOptions = [
    {
      icon: (
        <Image
          alt="Campaign avatar"
          className="size-4 rounded-full object-cover"
          height={16}
          src="/logos/brand8.jpg"
          width={16}
        />
      ),
      label: data.filters.campaignLabel,
      value: "fall-off",
    },
    {
      label: "Creator Sprint Q1",
      value: "creator-sprint-q1",
    },
  ];

  if (showViewsDetail) {
    return (
      <AnalyticsPocPageShell>
        <motion.div {...DRILLDOWN_TRANSITION}>
          <AnalyticsPocViewsDetail
            rows={analyticsPocViewsDetailMockData}
            onBack={() => setShowViewsDetail(false)}
          />
        </motion.div>
      </AnalyticsPocPageShell>
    );
  }

  if (dayDrilldown) {
    return (
      <AnalyticsPocPageShell>
        <motion.div {...DRILLDOWN_TRANSITION}>
          <AnalyticsPocDayDrilldown
            data={dayDrilldown}
            onBack={() => setDayDrilldown(null)}
          />
        </motion.div>
      </AnalyticsPocPageShell>
    );
  }

  if (activePageTab === "Campaign Health") {
    return (
      <AnalyticsPocPageShell>
        <AnalyticsPocHeader title={data.header.title} />
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-2 px-4 py-4 sm:px-5 sm:py-5 md:gap-3 lg:px-10">
          <AnalyticsPocCampaignHealthTab
            {...analyticsPocCampaignHealthMockData}
          />
        </div>
      </AnalyticsPocPageShell>
    );
  }

  return (
    <AnalyticsPocPageShell>
      <AnalyticsPocHeader title={data.header.title} />

      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-2 px-4 py-4 sm:px-5 sm:py-5 md:gap-3 lg:px-10">
      <AnalyticsPocFilterToolbar
        campaignLabel={data.filters.campaignLabel}
        campaignSlot={
          <AnalyticsPocSelect
            onValueChange={setSelectedCampaign}
            options={campaignOptions}
            value={selectedCampaign}
          />
        }
        dateLabel={data.filters.dateLabel}
        dateSlot={
          <AnalyticsPocDateRangePicker
            onValueChange={setDateRange}
            value={dateRange}
          />
        }
        platforms={data.filters.platforms}
      />

      <AnalyticsPocMediumCardsRow
        left={<AnalyticsPocInsightsCard {...data.insightsCard} />}
        right={<AnalyticsPocHealthCard {...data.healthCard} />}
      />

      <AnalyticsPocKpiRow>
        {data.kpis.map((kpi) => {
          if (kpi.iconName === "views") {
            return (
              <AnalyticsPocKpiCard
                key={kpi.label}
                {...kpi}
                onClick={() => setShowViewsDetail(true)}
              />
            );
          }
          if (kpi.iconName === "payouts") {
            return <AnalyticsPocKpiCard key={kpi.label} {...kpi} />;
          }
          return <AnalyticsPocKpiCard key={kpi.label} {...kpi} />;
        })}
      </AnalyticsPocKpiRow>

      <AnalyticsPocPanel>
        <div className="space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="w-full min-w-0 md:max-w-[420px]">
              <AnalyticsPocToggleGroup
                onValueChange={setActivePerformanceTab}
                value={activePerformanceTab}
              >
                {data.performance.tabs.map((tab) => (
                  <AnalyticsPocToggleGroupItem key={tab} value={tab}>
                    {tab}
                  </AnalyticsPocToggleGroupItem>
                ))}
              </AnalyticsPocToggleGroup>
            </div>

            <AnalyticsPocDateRangePicker
              onValueChange={setPerfRange}
              value={perfRange}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {data.performance.metrics.map((metric) => (
              <AnalyticsPocChartToggleChip
                enabled={
                  metric.metricKey
                    ? performanceMetricState[metric.metricKey]
                    : metric.enabled
                }
                key={metric.label}
                label={metric.label}
                metricKey={metric.metricKey}
                onToggle={handlePerformanceMetricToggle}
                seriesColor={
                  metric.metricKey
                    ? (performanceSeriesColorByKey[metric.metricKey] ??
                      "#4D81EE")
                    : "#4D81EE"
                }
                value={metric.value}
              />
            ))}
          </div>

          <AnalyticsPocChartPlaceholder
            {...data.performance.chart}
            activeLineDataset={
              activePerformanceTab === "Cumulative" ? "cumulative" : "daily"
            }
            onDayClick={handleDayClick}
            visibleMetricKeys={visiblePerformanceMetricKeys}
          />
        </div>
      </AnalyticsPocPanel>

      <AnalyticsPocTwoColumnRow
        left={<AnalyticsPocRankListCard {...data.viewsCard} />}
        right={<AnalyticsPocRankListCard {...data.postsCard} />}
      />

      <AnalyticsPocTwoColumnRow
        left={<AnalyticsPocRankListCard {...data.engagementRateCard} />}
        right={<AnalyticsPocRankListCard {...data.effectiveCpmCard} />}
      />

      <AnalyticsPocRankListCard {...data.contentClustersCard} />

      <AnalyticsPocPanel>
        <div className="space-y-3">
          <AnalyticsPocSectionHeader
            className="pb-0"
            icon={
              <Image
                alt=""
                className="shrink-0 object-contain dark:invert"
                height={16}
                src="/icons/svg/analytics-posts-header.svg"
                width={16}
              />
            }
            rightSlot={
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 items-center justify-center rounded-[100px] bg-[rgba(21,128,61,0.1)] px-1.5 font-inter text-[12px] font-medium leading-[1.2] text-[#15803d]">
                  {data.totalPosts.trend}
                </span>
                <span className="font-inter text-xl font-semibold text-foreground">
                  {data.totalPosts.total}
                </span>
                <span className="font-inter text-xs text-muted-foreground">
                  {data.totalPosts.delta}
                </span>
              </div>
            }
            title={data.totalPosts.title}
          />

          <div className="flex flex-wrap items-center gap-2">
            {data.totalPosts.metrics.map((metric) => (
              <AnalyticsPocChartToggleChip
                enabled={
                  metric.metricKey
                    ? totalPostsMetricState[metric.metricKey]
                    : metric.enabled
                }
                key={metric.label}
                label={metric.label}
                metricKey={metric.metricKey}
                onToggle={handleTotalPostsMetricToggle}
                seriesColor={
                  metric.metricKey
                    ? (totalPostsSeriesColorByKey[metric.metricKey] ??
                      "#13C368")
                    : "#13C368"
                }
                value={metric.value}
              />
            ))}
          </div>

          <AnalyticsPocChartPlaceholder
            {...data.totalPosts.chart}
            onDayClick={handleDayClick}
            visibleMetricKeys={visibleTotalPostsMetricKeys}
          />
        </div>
      </AnalyticsPocPanel>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {data.heatmaps.map((heatmap) => (
          <AnalyticsPocHeatmapCard key={heatmap.title} {...heatmap} />
        ))}
      </div>

      <AnalyticsPocTopPostsTable {...data.topPosts} />

      <AnalyticsPocDetailDialog
        onOpenChange={setViewsDialogOpen}
        open={viewsDialogOpen}
        subtitle="5.14M views across all creators"
        title="Total Views"
      >
        <AnalyticsPocViewsDetail rows={analyticsPocViewsDetailMockData} onBack={() => setViewsDialogOpen(false)} />
      </AnalyticsPocDetailDialog>
      </div>
    </AnalyticsPocPageShell>
  );
}
