import type { ReactNode } from "react";

export type AnalyticsPocPlatform =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "facebook"
  | "x";

export type AnalyticsPocTone = "neutral" | "success" | "warning" | "danger";

export type AnalyticsPocPanelPadding = "none" | "sm" | "md" | "lg";

export interface AnalyticsPocHeaderProps {
  title: string;
  className?: string;
}

export interface AnalyticsPocPageShellProps {
  children: ReactNode;
  className?: string;
}

export interface AnalyticsPocFilterChip {
  id: AnalyticsPocPlatform;
  label: string;
  active: boolean;
}

export interface AnalyticsPocFilterToolbarProps {
  platforms: AnalyticsPocFilterChip[];
  dateLabel: string;
  campaignLabel: string;
  dateSlot?: ReactNode;
  campaignSlot?: ReactNode;
  className?: string;
}

export interface AnalyticsPocPanelProps {
  children: ReactNode;
  className?: string;
  padding?: AnalyticsPocPanelPadding;
}

export interface AnalyticsPocCardHeaderProps {
  title: ReactNode;
  icon?: ReactNode;
  tooltipText?: string;
  tooltipIcon?: ReactNode;
  helperText?: ReactNode;
  rightContent?: ReactNode;
  className?: string;
  rowClassName?: string;
  leftClassName?: string;
  titleClassName?: string;
  helperClassName?: string;
  rightClassName?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}

export interface AnalyticsPocMediumCardsRowProps {
  left: ReactNode;
  right: ReactNode;
  className?: string;
}

export interface AnalyticsPocInsightSlide {
  id?: string;
  contentTitle?: string;
  contentSubtitle: string;
  ctaLabel?: string;
}

export interface AnalyticsPocCardEffects {
  accentColor?: string;
  graphicSrc?: string;
}

export interface AnalyticsPocInsightsCardProps {
  title: string;
  description: string;
  contentTitle?: string;
  contentSubtitle?: string;
  ctaLabel: string;
  iconSrc?: string;
  slides?: AnalyticsPocInsightSlide[];
  initialSlide?: number;
  onSlideChange?: (index: number) => void;
  pager?: {
    current: number;
    total: number;
  };
  effects?: AnalyticsPocCardEffects;
  showPagerUi?: boolean;
  className?: string;
}

export interface AnalyticsPocHealthCardProps {
  title: string;
  score: string;
  statusText: string;
  trendLabel?: string;
  ctaLabel: string;
  infoTooltipText?: string;
  iconSrc?: string;
  showInfoIcon?: boolean;
  infoIconSrc?: string;
  progressPercent?: number;
  effects?: AnalyticsPocCardEffects;
  className?: string;
}

export type AnalyticsPocKpiIcon =
  | "views"
  | "payouts"
  | "cpm"
  | "submissions"
  | "posts";

export type AnalyticsPocKpiVariant =
  | "default"
  | "views"
  | "payouts"
  | "cpm-efficient"
  | "cpm-inefficient"
  | "submissions";

export type AnalyticsPocKpiDeltaTone = "success" | "danger" | "neutral";

export interface AnalyticsPocKpiDeltaBadge {
  label: string;
  tone?: AnalyticsPocKpiDeltaTone;
}

export interface AnalyticsPocKpiCardProps {
  label: string;
  value: string;
  iconName?: AnalyticsPocKpiIcon;
  deltaBadge?: AnalyticsPocKpiDeltaBadge;
  meta?: string;
  status?: string;
  tone?: AnalyticsPocTone;
  variant?: AnalyticsPocKpiVariant;
  onClick?: () => void;
  className?: string;
}

export interface AnalyticsPocKpiRowProps {
  children: ReactNode;
  className?: string;
}

export interface AnalyticsPocSectionHeaderProps {
  title: string;
  icon?: ReactNode;
  infoText?: string;
  tooltipIcon?: ReactNode;
  helperText?: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
}

export interface AnalyticsPocMetricToggleRowProps {
  children: ReactNode;
  className?: string;
}

export interface AnalyticsPocChartToggleCardProps {
  label: string;
  value: string;
  metricKey?: string;
  platform?: AnalyticsPocPlatform;
  accentColor?: string;
  dotColorClass?: string;
  enabled?: boolean;
  selected?: boolean;
  isInteractive?: boolean;
  onToggle?: (metricKey: string) => void;
  className?: string;
}

export type AnalyticsPocChartVariant = "line" | "bar" | "stacked";
export type AnalyticsPocChartStylePreset = "default" | "performance-main";

export type AnalyticsPocPerformanceMetricKey =
  | "views"
  | "engagement"
  | "likes"
  | "comments"
  | "shares";

export type AnalyticsPocTotalPostsMetricKey =
  | "tiktok"
  | "instagram"
  | "youtube"
  | "facebook";

export interface AnalyticsPocChartTick {
  index: number;
  label: string;
}

export interface AnalyticsPocPerformanceLineDataPoint {
  index: number;
  label: string;
  views: number;
  engagement: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface AnalyticsPocPerformanceLineSeries {
  key: AnalyticsPocPerformanceMetricKey;
  label: string;
  color: string;
  axis: "left" | "right";
  domain?: [number, number];
  yLabels?: string[];
  tooltipValueType?: "number" | "percent" | "currency";
  tooltipDecimals?: number;
}

export interface AnalyticsPocPerformanceLineChartData {
  datasets: {
    daily: AnalyticsPocPerformanceLineDataPoint[];
    cumulative: AnalyticsPocPerformanceLineDataPoint[];
  };
  series: AnalyticsPocPerformanceLineSeries[];
  xTicks: AnalyticsPocChartTick[];
  yLabels: string[];
  rightYLabels: string[];
  leftDomain?: [number, number];
  rightDomain?: [number, number];
}

export interface AnalyticsPocStackedBarDataPoint {
  index: number;
  label: string;
  tiktok: number;
  instagram: number;
  youtube: number;
  facebook: number;
}

export interface AnalyticsPocStackedBarSeries {
  key: AnalyticsPocTotalPostsMetricKey;
  label: string;
  color: string;
}

export interface AnalyticsPocStackedBarChartData {
  points: AnalyticsPocStackedBarDataPoint[];
  series: AnalyticsPocStackedBarSeries[];
  xTicks: AnalyticsPocChartTick[];
  yLabels: string[];
  maxValue?: number;
}

export interface AnalyticsPocChartPlaceholderProps {
  variant: AnalyticsPocChartVariant;
  chartStylePreset?: AnalyticsPocChartStylePreset;
  lineChart?: AnalyticsPocPerformanceLineChartData;
  stackedBarChart?: AnalyticsPocStackedBarChartData;
  activeLineDataset?: "daily" | "cumulative";
  visibleMetricKeys?: string[];
  heightClassName?: string;
  className?: string;
  onDayClick?: (index: number, label: string) => void;
}

export interface AnalyticsPocTwoColumnRowProps {
  left: ReactNode;
  right: ReactNode;
  className?: string;
}

export interface AnalyticsPocRankListItem {
  id: string;
  label: string;
  secondaryLabel?: string;
  detailLabel?: string;
  platform?: AnalyticsPocPlatform;
  icon?: ReactNode;
  avatarSrc?: string;
  accentColor?: string;
  dotColorClass?: string;
  percentLabel: string;
  valueLabel: string;
  rightMetrics?: AnalyticsPocProgressMetric[];
  progress: number;
}

export type AnalyticsPocProgressMetricTone = "default" | "muted";

export interface AnalyticsPocProgressMetric {
  text: string;
  tone?: AnalyticsPocProgressMetricTone;
}

export type AnalyticsPocRankHeaderIcon =
  | "views"
  | "posts"
  | "engagement-rate"
  | "effective-cpm"
  | "content-clusters";

export interface AnalyticsPocProgressBarRowProps {
  item: AnalyticsPocRankListItem;
  className?: string;
}

export interface AnalyticsPocRankListDrilldown {
  label: string;
  accentColor: string;
  items: AnalyticsPocRankListItem[];
}

export interface AnalyticsPocRankListCardProps {
  title: string;
  headerIcon: AnalyticsPocRankHeaderIcon;
  infoTooltipText?: string;
  items: AnalyticsPocRankListItem[];
  drilldowns?: Record<string, AnalyticsPocRankListDrilldown>;
  className?: string;
}

export type AnalyticsPocHeatmapTone = "green" | "purple" | "red" | "blue";

export interface AnalyticsPocHeatmapCell {
  dayIndex: number;
  slotIndex: number;
  intensity: number;
  date?: string;
  value?: number;
}

export interface AnalyticsPocHeatmapCardProps {
  title: string;
  subtitle: string;
  badge: string;
  platform?: AnalyticsPocPlatform;
  tone: AnalyticsPocHeatmapTone;
  footerLeft: string;
  footerRight: string;
  heatmapData: { date: string; value: number }[];
  startDate: Date;
  endDate: Date;
  className?: string;
}

export interface AnalyticsPocTopPostRow {
  id: string;
  position: number;
  post: string;
  author: string;
  postedDaysAgo: number;
  platform: AnalyticsPocPlatform | string;
  views: string | number;
  engagement: string | number;
  payout: string | number;
  cpm: string | number;
}

export interface AnalyticsPocTopPostsTableProps {
  title: string;
  headerIcon?: ReactNode;
  headerTooltipText?: string;
  mode: "top" | "bottom";
  rows: AnalyticsPocTopPostRow[];
  pageSize?: number;
  summaryLabel?: string;
  pageNumbers?: number[];
  currentPage?: number;
  className?: string;
}

export interface AnalyticsPocPerformanceSectionData {
  tabs: string[];
  activeTab: string;
  rangeLabel: string;
  metrics: AnalyticsPocChartToggleCardProps[];
  chart: AnalyticsPocChartPlaceholderProps;
}

export interface AnalyticsPocTotalPostsSectionData {
  title: string;
  trend: string;
  total: string;
  delta: string;
  metrics: AnalyticsPocChartToggleCardProps[];
  chart: AnalyticsPocChartPlaceholderProps;
}

export interface AnalyticsPocPageData {
  header: {
    title: string;
    subtitle: string;
  };
  filters: {
    platforms: AnalyticsPocFilterChip[];
    dateLabel: string;
    campaignLabel: string;
  };
  insightsCard: AnalyticsPocInsightsCardProps;
  healthCard: AnalyticsPocHealthCardProps;
  kpis: AnalyticsPocKpiCardProps[];
  performance: AnalyticsPocPerformanceSectionData;
  viewsCard: AnalyticsPocRankListCardProps;
  postsCard: AnalyticsPocRankListCardProps;
  engagementRateCard: AnalyticsPocRankListCardProps;
  effectiveCpmCard: AnalyticsPocRankListCardProps;
  contentClustersCard: AnalyticsPocRankListCardProps;
  totalPosts: AnalyticsPocTotalPostsSectionData;
  heatmaps: AnalyticsPocHeatmapCardProps[];
  topPosts: AnalyticsPocTopPostsTableProps;
}

// Campaign Health Tab types

export interface AnalyticsPocFunnelStep {
  label: string;
  value: string;
  subtitle: string;
  color: string;
}

export interface AnalyticsPocTrafficSource {
  id: string;
  rank: number;
  label: string;
  views: string;
  applied: string;
  convRate: string;
  progress: number;
}

export interface AnalyticsPocEngagementCardProps {
  title: string;
  subtitle: string;
  funnelSummary: {
    views: string;
    applied: string;
    joined: string;
    ctr: string;
  };
  funnelSteps: AnalyticsPocFunnelStep[];
  trafficSources: AnalyticsPocTrafficSource[];
  chart: AnalyticsPocChartPlaceholderProps;
  className?: string;
}

export interface AnalyticsPocHealthScoreBreakdownItem {
  label: string;
  weight: string;
  score: number;
  maxScore: number;
}

export interface AnalyticsPocHealthScoreDetailCardProps {
  title: string;
  score: number;
  maxScore: number;
  items: AnalyticsPocHealthScoreBreakdownItem[];
  className?: string;
}

export interface AnalyticsPocFinancialLegendItem {
  label: string;
  value: string;
  color: string;
}

export interface AnalyticsPocCostMetric {
  label: string;
  value: string;
}

export interface AnalyticsPocFinancialSummaryCardProps {
  title: string;
  budgetUsedLabel: string;
  spent: string;
  total: string;
  remaining: string;
  progressPercent: number;
  legend: AnalyticsPocFinancialLegendItem[];
  costMetrics: AnalyticsPocCostMetric[];
  className?: string;
}

export interface AnalyticsPocActivityKpi {
  label: string;
  value: string;
  subtitle: string;
  dotColor: string;
}

export interface AnalyticsPocCampaignHealthTabProps {
  engagement: AnalyticsPocEngagementCardProps;
  activityKpis: AnalyticsPocActivityKpi[];
  activityChart: AnalyticsPocChartPlaceholderProps;
  activityChartMetrics: AnalyticsPocChartToggleCardProps[];
  healthScore: AnalyticsPocHealthScoreDetailCardProps;
  financials: AnalyticsPocFinancialSummaryCardProps;
  className?: string;
}
