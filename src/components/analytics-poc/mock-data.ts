import type { AnalyticsPocClusterDrilldownData } from "./AnalyticsPocClusterDrilldown";
import type { AnalyticsPocCpmTooltipData } from "./AnalyticsPocCpmTooltip";
import type { AnalyticsPocDayDrilldownData } from "./AnalyticsPocDayDrilldown";
import type { AnalyticsPocPayoutRow } from "./AnalyticsPocPayoutsDetail";
import type { AnalyticsPocViewsDetailRow } from "./AnalyticsPocViewsDetail";
import type {
  AnalyticsPocCampaignHealthTabProps,

  AnalyticsPocPageData,
  AnalyticsPocPerformanceLineChartData,
  AnalyticsPocPerformanceLineDataPoint,
  AnalyticsPocPlatform,
  AnalyticsPocStackedBarChartData,
  AnalyticsPocTopPostRow,
} from "./types";

const TOTAL_POINTS = 30;

const CHART_TICKS = [
  { index: 0, label: "Jan 5" },
  { index: 3, label: "Jan 8" },
  { index: 6, label: "Jan 11" },
  { index: 9, label: "Jan 14" },
  { index: 12, label: "Jan 17" },
  { index: 15, label: "Jan 20" },
  { index: 18, label: "Jan 23" },
  { index: 21, label: "Jan 27" },
  { index: 24, label: "Jan 30" },
  { index: 27, label: "Feb 2" },
  { index: 29, label: "Feb 5" },
];

const PERFORMANCE_DAILY_POINTS = buildPerformanceDailyPoints();
const PERFORMANCE_CUMULATIVE_POINTS = buildCumulativePerformancePoints(
  PERFORMANCE_DAILY_POINTS,
);

const PERFORMANCE_LINE_CHART: AnalyticsPocPerformanceLineChartData = {
  datasets: {
    cumulative: PERFORMANCE_CUMULATIVE_POINTS,
    daily: PERFORMANCE_DAILY_POINTS,
  },
  leftDomain: [0, 100000],
  rightDomain: [0, 8],
  rightYLabels: ["8.0%", "6.0%", "4.0%", "2.0%", "1.0%", "0.0%"],
  series: [
    {
      axis: "left",
      color: "#4D81EE",
      domain: [0, 100000],
      key: "views",
      label: "Views",
      tooltipValueType: "number",
      yLabels: ["100k", "75k", "50k", "25k", "0"],
    },
    {
      axis: "right",
      color: "#9D5AEF",
      domain: [0, 8],
      key: "engagement",
      label: "Engagement",
      tooltipValueType: "percent",
      yLabels: ["8%", "6%", "4%", "2%", "0%"],
    },
    {
      axis: "left",
      color: "#DA5597",
      domain: [0, 5000],
      key: "likes",
      label: "Likes",
      tooltipValueType: "number",
      yLabels: ["5k", "3.75k", "2.5k", "1.25k", "0"],
    },
    {
      axis: "left",
      color: "#E9A23B",
      domain: [0, 1500],
      key: "comments",
      label: "Comments",
      tooltipValueType: "number",
      yLabels: ["1.5k", "1.1k", "750", "375", "0"],
    },
    {
      axis: "left",
      color: "#13C368",
      domain: [0, 800],
      key: "shares",
      label: "Shares",
      tooltipValueType: "number",
      yLabels: ["800", "600", "400", "200", "0"],
    },
  ],
  xTicks: CHART_TICKS,
  yLabels: ["100k", "75k", "50k", "25k", "10k", "0"],
};

const TOTAL_POSTS_STACKED_CHART: AnalyticsPocStackedBarChartData = {
  maxValue: 110000,
  points: buildTotalPostsStackedPoints(),
  series: [
    { color: "#13C368", key: "tiktok", label: "TikTok" },
    { color: "#AE4EEE", key: "instagram", label: "Instagram" },
    { color: "#EE4E51", key: "youtube", label: "YouTube" },
    { color: "#4E8EEE", key: "facebook", label: "Facebook" },
  ],
  xTicks: CHART_TICKS,
  yLabels: ["100k", "75k", "50k", "25k", "10k", "0"],
};

const TOP_POSTS_TOTAL_ROWS = 50;
const TOP_POST_TITLES = [
  "This fitness hack changed my life",
  "5 ways to stay focused all day",
  "The easiest meal prep routine",
  "How I doubled my output in 7 days",
  "Tiny habit, massive results",
];
const TOP_POST_AUTHORS = [
  "NeonEdits",
  "GrowthLab",
  "ClipFarm",
  "MetricMinds",
  "DailyBoost",
];
const TOP_POST_PLATFORMS: AnalyticsPocPlatform[] = [
  "tiktok",
  "instagram",
  "youtube",
  "facebook",
  "x",
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function toFixedNumber(value: number, decimals = 2) {
  return Number(value.toFixed(decimals));
}

function formatCompactNumber(value: number) {
  if (value >= 1_000_000) {
    const short = (value / 1_000_000)
      .toFixed(2)
      .replace(/\.00$/, "")
      .replace(/(\.\d)0$/, "$1");
    return `${short}M`;
  }

  if (value >= 1_000) {
    const short = (value / 1_000).toFixed(1).replace(/\.0$/, "");
    return `${short}K`;
  }

  return String(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function buildTopPostRows(totalRows: number): AnalyticsPocTopPostRow[] {
  return Array.from({ length: totalRows }, (_, index) => {
    const position = index + 1;
    const platform = TOP_POST_PLATFORMS[index % TOP_POST_PLATFORMS.length];
    const title = TOP_POST_TITLES[index % TOP_POST_TITLES.length];
    const author = TOP_POST_AUTHORS[index % TOP_POST_AUTHORS.length];

    const baseViews = 2_450_000;
    const rankDrop = index * 31_500;
    const patternBoost = (index % 6) * 9_800;
    const views = Math.max(120_000, baseViews - rankDrop + patternBoost);

    const baseEngagement = 2.2 + ((totalRows - index) % 9) * 0.31;
    const platformEngagementBonus = platform === "tiktok" ? 0.5 : 0.15;
    const engagementRate = clamp(
      baseEngagement + platformEngagementBonus,
      1.2,
      8.6,
    );

    const baseCpm = 0.74 + (index % 7) * 0.11;
    const platformCpmBonus = platform === "youtube" ? 0.17 : 0;
    const cpm = toFixedNumber(baseCpm + platformCpmBonus, 2);
    const payout = (views / 1000) * cpm;

    return {
      author,
      cpm: formatCurrency(cpm),
      engagement: formatPercent(engagementRate),
      id: `post-${position}`,
      payout: formatCurrency(payout),
      platform,
      postedDaysAgo: 1 + ((index * 3 + 2) % 30),
      position,
      post: title,
      views: formatCompactNumber(views),
    };
  });
}

const TOP_POST_ROWS = buildTopPostRows(TOP_POSTS_TOTAL_ROWS);

function buildDateLabels(startIso: string, total: number) {
  const start = new Date(`${startIso}T00:00:00Z`);
  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

  return Array.from({ length: total }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    return formatter.format(date);
  });
}

function buildPerformanceDailyPoints(): AnalyticsPocPerformanceLineDataPoint[] {
  const labels = buildDateLabels("2026-01-07", TOTAL_POINTS);

  return labels.map((label, index) => {
    const views = clamp(
      Math.round(
        28000 +
          Math.sin((index - 2) / 1.9) * 17000 +
          Math.cos(index / 4.2) * 11000 +
          (index % 9 === 4 ? 18000 : 0),
      ),
      9000,
      98000,
    );

    const engagement = toFixedNumber(
      clamp(
        2.2 +
          Math.sin(index / 2.2) * 1.8 +
          Math.cos((index + 3) / 5.1) * 0.9 +
          (index % 11 === 5 ? 1.2 : 0),
        0.4,
        7.8,
      ),
      2,
    );

    const likes = clamp(
      Math.round(
        views * 0.72 +
          Math.sin((index + 1) / 2.4) * 9000 +
          (index % 8 === 3 ? 12000 : 0),
      ),
      6000,
      92000,
    );

    const comments = clamp(
      Math.round(
        views * 0.64 +
          Math.cos((index + 2) / 3.2) * 10000 +
          (index % 10 === 6 ? 16000 : 0),
      ),
      7000,
      96000,
    );

    const shares = clamp(
      Math.round(
        views * 0.42 +
          Math.sin(index / 1.6) * 6000 +
          (index % 7 === 0 ? 8000 : 0),
      ),
      3500,
      64000,
    );

    return {
      comments,
      engagement,
      index,
      label,
      likes,
      shares,
      views,
    };
  });
}

function buildCumulativePerformancePoints(
  dailyPoints: AnalyticsPocPerformanceLineDataPoint[],
) {
  const running = {
    comments: 0,
    engagement: 0,
    likes: 0,
    shares: 0,
    views: 0,
  };

  const cumulative = dailyPoints.map((point) => {
    running.views += point.views;
    running.engagement += point.engagement;
    running.likes += point.likes;
    running.comments += point.comments;
    running.shares += point.shares;

    return {
      ...point,
      comments: running.comments,
      engagement: running.engagement,
      likes: running.likes,
      shares: running.shares,
      views: running.views,
    };
  });

  const maxes = cumulative.reduce(
    (acc, point) => ({
      comments: Math.max(acc.comments, point.comments),
      engagement: Math.max(acc.engagement, point.engagement),
      likes: Math.max(acc.likes, point.likes),
      shares: Math.max(acc.shares, point.shares),
      views: Math.max(acc.views, point.views),
    }),
    {
      comments: 1,
      engagement: 1,
      likes: 1,
      shares: 1,
      views: 1,
    },
  );

  const targets = {
    comments: 86000,
    engagement: 7.2,
    likes: 78000,
    shares: 52000,
    views: 94000,
  };

  return cumulative.map((point) => ({
    ...point,
    comments: Math.round((point.comments / maxes.comments) * targets.comments),
    engagement: toFixedNumber(
      (point.engagement / maxes.engagement) * targets.engagement,
      2,
    ),
    likes: Math.round((point.likes / maxes.likes) * targets.likes),
    shares: Math.round((point.shares / maxes.shares) * targets.shares),
    views: Math.round((point.views / maxes.views) * targets.views),
  }));
}

function buildTotalPostsStackedPoints() {
  const labels = buildDateLabels("2026-01-07", TOTAL_POINTS);

  return labels.map((label, index) => ({
    facebook: clamp(
      Math.round(
        3200 +
          Math.sin(index / 1.7) * 1800 +
          Math.cos((index + 1) / 2.9) * 1500 +
          (index % 8 === 1 ? 2200 : 0),
      ),
      1500,
      8200,
    ),
    index,
    instagram: clamp(
      Math.round(
        20500 +
          Math.sin(index / 1.8) * 7600 +
          Math.cos((index + 2) / 4.6) * 6000 +
          (index % 7 === 2 ? 6400 : 0),
      ),
      10000,
      34000,
    ),
    label,
    tiktok: clamp(
      Math.round(
        37000 +
          Math.sin((index - 4) / 2.1) * 14000 +
          Math.cos(index / 5.3) * 10000 +
          (index % 6 === 0 ? 11000 : 0),
      ),
      22000,
      61000,
    ),
    youtube: clamp(
      Math.round(
        7200 +
          Math.sin((index + 1) / 2.5) * 3000 +
          Math.cos(index / 3.4) * 2200 +
          (index % 9 === 5 ? 3800 : 0),
      ),
      3000,
      13000,
    ),
  }));
}

const HEATMAP_START = new Date("2025-09-07");
const HEATMAP_END = new Date("2026-03-07");

function buildHeatmapData(seed: number): { date: string; value: number }[] {
  const data: { date: string; value: number }[] = [];
  const current = new Date(HEATMAP_START);
  const end = HEATMAP_END.getTime();

  while (current.getTime() <= end) {
    const dayOfWeek = current.getUTCDay();
    const dayOfMonth = current.getUTCDate();
    const base = Math.sin((dayOfMonth + seed) * 0.47) * 0.5 + 0.5;
    const weekday = dayOfWeek >= 1 && dayOfWeek <= 5 ? 0.3 : 0;
    const value = Math.round(
      (base * 0.6 + weekday + Math.cos((dayOfMonth * seed) / 3) * 0.2) * 30,
    );
    data.push({
      date: current.toISOString().slice(0, 10),
      value: clamp(value, 0, 30),
    });
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return data;
}

export const analyticsPocMockData: AnalyticsPocPageData = {
  contentClustersCard: {
    headerIcon: "content-clusters",
    infoTooltipText:
      "Breakdown of dominant content themes and their contribution to total views.",
    items: [
      {
        accentColor: "#E9A23B",
        detailLabel: "85 videos",
        dotColorClass: "bg-[#E9A23B]",
        id: "cluster-reaction",
        label: "Reaction Videos",
        percentLabel: "84%",
        progress: 84,
        rightMetrics: [{ text: "84%", tone: "muted" }, { text: "500K" }],
        secondaryLabel: "85 videos",
        valueLabel: "500K",
      },
      {
        accentColor: "#4D81EE",
        detailLabel: "45 videos",
        dotColorClass: "bg-[#4D81EE]",
        id: "cluster-meme",
        label: "Meme Edits",
        percentLabel: "56%",
        progress: 56,
        rightMetrics: [{ text: "56%", tone: "muted" }, { text: "200K" }],
        secondaryLabel: "45 videos",
        valueLabel: "200K",
      },
      {
        accentColor: "#22C55E",
        detailLabel: "38 videos",
        dotColorClass: "bg-[#22C55E]",
        id: "cluster-pov",
        label: "POV / Skit",
        percentLabel: "49%",
        progress: 49,
        rightMetrics: [{ text: "49%", tone: "muted" }, { text: "180K" }],
        secondaryLabel: "38 videos",
        valueLabel: "180K",
      },
      {
        accentColor: "#EAB308",
        detailLabel: "20 videos",
        dotColorClass: "bg-[#EAB308]",
        id: "cluster-transform",
        label: "Transformation",
        percentLabel: "41%",
        progress: 41,
        rightMetrics: [{ text: "41%", tone: "muted" }, { text: "150K" }],
        secondaryLabel: "20 videos",
        valueLabel: "150K",
      },
      {
        accentColor: "#A855F7",
        detailLabel: "30 videos",
        dotColorClass: "bg-[#A855F7]",
        id: "cluster-tutorial",
        label: "Tutorial Format",
        percentLabel: "23%",
        progress: 23,
        rightMetrics: [{ text: "23%", tone: "muted" }, { text: "92K" }],
        secondaryLabel: "30 videos",
        valueLabel: "92K",
      },
      {
        accentColor: "#EF4444",
        detailLabel: "22 videos",
        dotColorClass: "bg-[#EF4444]",
        id: "cluster-unboxing",
        label: "Unboxing / Review",
        percentLabel: "9%",
        progress: 9,
        rightMetrics: [{ text: "9%", tone: "muted" }, { text: "24K" }],
        secondaryLabel: "22 videos",
        valueLabel: "24K",
      },
    ],
    drilldowns: {
      "cluster-reaction": {
        label: "Reaction Videos",
        accentColor: "#E9A23B",
        items: [
          { id: "cr1", label: "Reacting to viral cooking fails", detailLabel: "@sarah_creates", avatarSrc: "/logos/brand8.jpg", accentColor: "#E9A23B", percentLabel: "", progress: 100, valueLabel: "124K", rightMetrics: [{ text: "124K" }] },
          { id: "cr2", label: "First time watching K-drama", detailLabel: "@mike.films", avatarSrc: "/logos/brand8.jpg", accentColor: "#E9A23B", percentLabel: "", progress: 79, valueLabel: "98K", rightMetrics: [{ text: "98K" }] },
          { id: "cr3", label: "Reacting to my old videos", detailLabel: "@ava.style", avatarSrc: "/logos/brand8.jpg", accentColor: "#E9A23B", percentLabel: "", progress: 70, valueLabel: "87K", rightMetrics: [{ text: "87K" }] },
          { id: "cr4", label: "Fan edits that made me cry", detailLabel: "@luna.creates", avatarSrc: "/logos/brand8.jpg", accentColor: "#E9A23B", percentLabel: "", progress: 58, valueLabel: "72K", rightMetrics: [{ text: "72K" }] },
          { id: "cr5", label: "Trying weird food combos", detailLabel: "@jess_vlogs", avatarSrc: "/logos/brand8.jpg", accentColor: "#E9A23B", percentLabel: "", progress: 49, valueLabel: "61K", rightMetrics: [{ text: "61K" }] },
        ],
      },
      "cluster-meme": {
        label: "Meme Edits",
        accentColor: "#4D81EE",
        items: [
          { id: "cm1", label: "POV: your code works first try", detailLabel: "@noahkim_", avatarSrc: "/logos/brand8.jpg", accentColor: "#4D81EE", percentLabel: "", progress: 100, valueLabel: "68K", rightMetrics: [{ text: "68K" }] },
          { id: "cm2", label: "When the WiFi drops mid-stream", detailLabel: "@dan.photo", avatarSrc: "/logos/brand8.jpg", accentColor: "#4D81EE", percentLabel: "", progress: 62, valueLabel: "42K", rightMetrics: [{ text: "42K" }] },
          { id: "cm3", label: "Monday morning energy", detailLabel: "@olivia.n", avatarSrc: "/logos/brand8.jpg", accentColor: "#4D81EE", percentLabel: "", progress: 56, valueLabel: "38K", rightMetrics: [{ text: "38K" }] },
          { id: "cm4", label: "That friend who never texts back", detailLabel: "@sarah_creates", avatarSrc: "/logos/brand8.jpg", accentColor: "#4D81EE", percentLabel: "", progress: 46, valueLabel: "31K", rightMetrics: [{ text: "31K" }] },
          { id: "cm5", label: "Expectations vs reality: adulting", detailLabel: "@ava.style", avatarSrc: "/logos/brand8.jpg", accentColor: "#4D81EE", percentLabel: "", progress: 31, valueLabel: "21K", rightMetrics: [{ text: "21K" }] },
        ],
      },
      "cluster-pov": {
        label: "POV / Skit",
        accentColor: "#22C55E",
        items: [
          { id: "cp1", label: "POV: you're the main character", detailLabel: "@luna.creates", avatarSrc: "/logos/brand8.jpg", accentColor: "#22C55E", percentLabel: "", progress: 100, valueLabel: "52K", rightMetrics: [{ text: "52K" }] },
          { id: "cp2", label: "When your mom calls during a date", detailLabel: "@jess_vlogs", avatarSrc: "/logos/brand8.jpg", accentColor: "#22C55E", percentLabel: "", progress: 85, valueLabel: "44K", rightMetrics: [{ text: "44K" }] },
          { id: "cp3", label: "Airport drama in 60 seconds", detailLabel: "@mike.films", avatarSrc: "/logos/brand8.jpg", accentColor: "#22C55E", percentLabel: "", progress: 69, valueLabel: "36K", rightMetrics: [{ text: "36K" }] },
          { id: "cp4", label: "POV: first day at a new job", detailLabel: "@noahkim_", avatarSrc: "/logos/brand8.jpg", accentColor: "#22C55E", percentLabel: "", progress: 54, valueLabel: "28K", rightMetrics: [{ text: "28K" }] },
          { id: "cp5", label: "The toxic friend group skit", detailLabel: "@olivia.n", avatarSrc: "/logos/brand8.jpg", accentColor: "#22C55E", percentLabel: "", progress: 38, valueLabel: "20K", rightMetrics: [{ text: "20K" }] },
        ],
      },
      "cluster-transform": {
        label: "Transformation",
        accentColor: "#EAB308",
        items: [
          { id: "ct1", label: "30-day glow up challenge", detailLabel: "@ava.style", avatarSrc: "/logos/brand8.jpg", accentColor: "#EAB308", percentLabel: "", progress: 100, valueLabel: "48K", rightMetrics: [{ text: "48K" }] },
          { id: "ct2", label: "Room makeover on $50 budget", detailLabel: "@dan.photo", avatarSrc: "/logos/brand8.jpg", accentColor: "#EAB308", percentLabel: "", progress: 79, valueLabel: "38K", rightMetrics: [{ text: "38K" }] },
          { id: "ct3", label: "Before & after: closet declutter", detailLabel: "@sarah_creates", avatarSrc: "/logos/brand8.jpg", accentColor: "#EAB308", percentLabel: "", progress: 60, valueLabel: "29K", rightMetrics: [{ text: "29K" }] },
          { id: "ct4", label: "From messy to minimal desk", detailLabel: "@luna.creates", avatarSrc: "/logos/brand8.jpg", accentColor: "#EAB308", percentLabel: "", progress: 46, valueLabel: "22K", rightMetrics: [{ text: "22K" }] },
          { id: "ct5", label: "Hair transformation compilation", detailLabel: "@jess_vlogs", avatarSrc: "/logos/brand8.jpg", accentColor: "#EAB308", percentLabel: "", progress: 27, valueLabel: "13K", rightMetrics: [{ text: "13K" }] },
        ],
      },
      "cluster-tutorial": {
        label: "Tutorial Format",
        accentColor: "#A855F7",
        items: [
          { id: "ctu1", label: "How to edit like a pro in 5 min", detailLabel: "@noahkim_", avatarSrc: "/logos/brand8.jpg", accentColor: "#A855F7", percentLabel: "", progress: 100, valueLabel: "28K", rightMetrics: [{ text: "28K" }] },
          { id: "ctu2", label: "Beginner makeup tutorial", detailLabel: "@olivia.n", avatarSrc: "/logos/brand8.jpg", accentColor: "#A855F7", percentLabel: "", progress: 79, valueLabel: "22K", rightMetrics: [{ text: "22K" }] },
          { id: "ctu3", label: "Easy recipe: 3-ingredient meals", detailLabel: "@mike.films", avatarSrc: "/logos/brand8.jpg", accentColor: "#A855F7", percentLabel: "", progress: 64, valueLabel: "18K", rightMetrics: [{ text: "18K" }] },
          { id: "ctu4", label: "Photography tips for beginners", detailLabel: "@dan.photo", avatarSrc: "/logos/brand8.jpg", accentColor: "#A855F7", percentLabel: "", progress: 50, valueLabel: "14K", rightMetrics: [{ text: "14K" }] },
          { id: "ctu5", label: "How I grew to 100K followers", detailLabel: "@sarah_creates", avatarSrc: "/logos/brand8.jpg", accentColor: "#A855F7", percentLabel: "", progress: 36, valueLabel: "10K", rightMetrics: [{ text: "10K" }] },
        ],
      },
      "cluster-unboxing": {
        label: "Unboxing / Review",
        accentColor: "#EF4444",
        items: [
          { id: "cu1", label: "Unboxing the new tech everyone wants", detailLabel: "@jess_vlogs", avatarSrc: "/logos/brand8.jpg", accentColor: "#EF4444", percentLabel: "", progress: 100, valueLabel: "8.2K", rightMetrics: [{ text: "8.2K" }] },
          { id: "cu2", label: "Honest review: viral skincare", detailLabel: "@ava.style", avatarSrc: "/logos/brand8.jpg", accentColor: "#EF4444", percentLabel: "", progress: 71, valueLabel: "5.8K", rightMetrics: [{ text: "5.8K" }] },
          { id: "cu3", label: "$500 mystery box unboxing", detailLabel: "@luna.creates", avatarSrc: "/logos/brand8.jpg", accentColor: "#EF4444", percentLabel: "", progress: 50, valueLabel: "4.1K", rightMetrics: [{ text: "4.1K" }] },
          { id: "cu4", label: "Testing Amazon gadgets under $20", detailLabel: "@noahkim_", avatarSrc: "/logos/brand8.jpg", accentColor: "#EF4444", percentLabel: "", progress: 41, valueLabel: "3.4K", rightMetrics: [{ text: "3.4K" }] },
          { id: "cu5", label: "Is this worth the hype? PR haul", detailLabel: "@olivia.n", avatarSrc: "/logos/brand8.jpg", accentColor: "#EF4444", percentLabel: "", progress: 30, valueLabel: "2.5K", rightMetrics: [{ text: "2.5K" }] },
        ],
      },
    },
    title: "Content Clusters",
  },
  effectiveCpmCard: {
    headerIcon: "effective-cpm",
    infoTooltipText:
      "Average effective payout per thousand views split by platform.",
    items: [
      {
        accentColor: "#4E8EEE",
        id: "ecpm-facebook",
        label: "Facebook",
        percentLabel: "",
        platform: "facebook",
        progress: 100,
        rightMetrics: [{ text: "$0.22" }],
        valueLabel: "$0.22",
      },
      {
        accentColor: "#AE4EEE",
        id: "ecpm-instagram",
        label: "Instagram",
        percentLabel: "",
        platform: "instagram",
        progress: 55,
        rightMetrics: [{ text: "$0.12" }],
        valueLabel: "$0.12",
      },
      {
        accentColor: "#EE4E51",
        id: "ecpm-youtube",
        label: "YouTube",
        percentLabel: "",
        platform: "youtube",
        progress: 27,
        rightMetrics: [{ text: "$0.06" }],
        valueLabel: "$0.06",
      },
      {
        accentColor: "#13C368",
        id: "ecpm-tiktok",
        label: "TikTok",
        percentLabel: "",
        platform: "tiktok",
        progress: 18,
        rightMetrics: [{ text: "$0.04" }],
        valueLabel: "$0.04",
      },
    ],
    title: "Effective CPM",
  },
  engagementRateCard: {
    headerIcon: "engagement-rate",
    infoTooltipText:
      "Average engagement rate by platform over the selected date range.",
    items: [
      {
        accentColor: "#13C368",
        id: "er-tiktok",
        label: "TikTok",
        percentLabel: "",
        platform: "tiktok",
        progress: 100,
        rightMetrics: [{ text: "4.2%" }],
        valueLabel: "4.2%",
      },
      {
        accentColor: "#EE4E51",
        id: "er-youtube",
        label: "YouTube",
        percentLabel: "",
        platform: "youtube",
        progress: 74,
        rightMetrics: [{ text: "3.1%" }],
        valueLabel: "3.1%",
      },
      {
        accentColor: "#AE4EEE",
        id: "er-instagram",
        label: "Instagram",
        percentLabel: "",
        platform: "instagram",
        progress: 43,
        rightMetrics: [{ text: "1.8%" }],
        valueLabel: "1.8%",
      },
      {
        accentColor: "#4E8EEE",
        id: "er-facebook",
        label: "Facebook",
        percentLabel: "",
        platform: "facebook",
        progress: 22,
        rightMetrics: [{ text: "0.9%" }],
        valueLabel: "0.9%",
      },
    ],
    title: "Engagement Rate",
  },
  filters: {
    campaignLabel: "The Fall-Off x Superbowl",
    dateLabel: "Jan 4 - Feb 4, 2026",
    platforms: [
      { active: true, id: "youtube", label: "YouTube" },
      { active: true, id: "tiktok", label: "TikTok" },
      { active: true, id: "instagram", label: "Instagram" },
      { active: false, id: "x", label: "X" },
    ],
  },
  header: {
    subtitle:
      "Monitor performance, creator activity, and payouts across all platforms.",
    title: "Analytics",
  },
  healthCard: {
    ctaLabel: "View health",
    effects: {
      accentColor: "#98D172",
      graphicSrc: "/effects/analytics-health-wave.svg",
    },
    infoTooltipText:
      "Overall campaign health score based on recent creator activity and performance signals.",
    progressPercent: 75,
    score: "76",
    statusText: "Looking healthy",
    title: "Health Score",
    trendLabel: "+4 vs last period",
  },
  heatmaps: [
    {
      badge: "Best 6 PM EST",
      endDate: HEATMAP_END,
      footerLeft: "Less",
      footerRight: "More",
      heatmapData: buildHeatmapData(3),
      platform: "tiktok",
      startDate: HEATMAP_START,
      subtitle: "Most active on Tuesdays ~47.5 videos/week",
      title: "TikTok",
      tone: "green",
    },
    {
      badge: "Best 6 PM EST",
      endDate: HEATMAP_END,
      footerLeft: "Less",
      footerRight: "More",
      heatmapData: buildHeatmapData(9),
      platform: "instagram",
      startDate: HEATMAP_START,
      subtitle: "Most active on Wednesdays ~38 videos/week",
      title: "Instagram",
      tone: "purple",
    },
    {
      badge: "Best 6 PM EST",
      endDate: HEATMAP_END,
      footerLeft: "Less",
      footerRight: "More",
      heatmapData: buildHeatmapData(13),
      platform: "youtube",
      startDate: HEATMAP_START,
      subtitle: "Most active on Mondays ~12.5 videos/week",
      title: "YouTube",
      tone: "red",
    },
    {
      badge: "Best 6 PM EST",
      endDate: HEATMAP_END,
      footerLeft: "Less",
      footerRight: "More",
      heatmapData: buildHeatmapData(17),
      platform: "facebook",
      startDate: HEATMAP_START,
      subtitle: "Most active on Sundays ~8 videos/week",
      title: "Facebook",
      tone: "blue",
    },
  ],
  insightsCard: {
    contentSubtitle:
      "4 of your top 10 creators haven’t posted anything in 7+ days. They account for 31% of your total views.",
    contentTitle: "No activity from 4 of your top 10 creators",
    ctaLabel: "Send nudge",
    description:
      "No activity from 4 of your top 10 creators in the last 7 days. They account for 31% of your total views.",
    effects: {
      accentColor: "#EC3EFF",
      graphicSrc: "/effects/ai-insights-sparkle.svg",
    },
    pager: { current: 2, total: 4 },
    showPagerUi: true,
    slides: [
      {
        contentSubtitle:
          "3 creators are trending up across TikTok this week with a +22% engagement lift.",
        contentTitle: "Momentum is building on TikTok",
        ctaLabel: "Review trends",
        id: "insight-slide-1",
      },
      {
        contentSubtitle:
          "4 of your top 10 creators haven’t posted anything in 7+ days. They account for 31% of your total views.",
        contentTitle: "No activity from 4 of your top 10 creators",
        ctaLabel: "Send nudge",
        id: "insight-slide-2",
      },
      {
        contentSubtitle:
          "Instagram posting volume is high, but average watch time dropped 12% week-over-week.",
        contentTitle: "Instagram watch time is slipping",
        ctaLabel: "View breakdown",
        id: "insight-slide-3",
      },
      {
        contentSubtitle:
          "CPM improved in 2/4 platforms. Reallocating budget could reduce blended CPM by ~9%.",
        contentTitle: "There is room to improve blended CPM",
        ctaLabel: "Optimize budget",
        id: "insight-slide-4",
      },
    ],
    title: "AI Insights",
  },
  kpis: [
    {
      deltaBadge: {
        label: "+18.3%",
        tone: "success",
      },
      iconName: "views",
      label: "Total Views",
      tone: "success",
      value: "5.14M",
      variant: "views",
    },
    {
      iconName: "payouts",
      label: "Total Payouts",
      meta: "$832 pending",
      value: "$4,218.50",
      variant: "payouts",
    },
    {
      iconName: "cpm",
      label: "Effective CPM",
      meta: "vs $1.00",
      status: "80.3%",
      tone: "success",
      value: "$0.84",
      variant: "cpm-efficient",
    },
    {
      iconName: "submissions",
      label: "Submissions",
      meta: "690 approved",
      value: "847",
      variant: "submissions",
    },
  ],
  performance: {
    activeTab: "Daily Performance",
    chart: {
      activeLineDataset: "daily",
      chartStylePreset: "performance-main",
      heightClassName: "h-[300px]",
      lineChart: PERFORMANCE_LINE_CHART,
      variant: "line",
    },
    metrics: [
      {
        accentColor: "#4D81EE",
        dotColorClass: "bg-blue-500",
        enabled: true,
        label: "Views",
        metricKey: "views",
        selected: true,
        value: "1.93M",
      },
      {
        accentColor: "#9D5AEF",
        dotColorClass: "bg-violet-500",
        enabled: true,
        label: "Engagement",
        metricKey: "engagement",
        value: "4.8%",
      },
      {
        accentColor: "#DA5597",
        dotColorClass: "bg-pink-500",
        enabled: true,
        label: "Likes",
        metricKey: "likes",
        value: "465K",
      },
      {
        accentColor: "#E9A23B",
        dotColorClass: "bg-amber-500",
        enabled: true,
        label: "Comments",
        metricKey: "comments",
        value: "629K",
      },
      {
        accentColor: "#000000",
        dotColorClass: "bg-emerald-500",
        enabled: false,
        label: "Shares",
        metricKey: "shares",
        value: "213K",
      },
    ],
    rangeLabel: "Last 30 days",
    tabs: ["Daily Performance", "Cumulative"],
  },
  postsCard: {
    headerIcon: "posts",
    infoTooltipText:
      "Post volume distribution by platform during the selected period.",
    items: [
      {
        accentColor: "#AE4EEE",
        id: "posts-instagram",
        label: "Instagram",
        percentLabel: "42%",
        platform: "instagram",
        progress: 42,
        rightMetrics: [{ text: "42%", tone: "muted" }, { text: "345" }],
        valueLabel: "345",
      },
      {
        accentColor: "#13C368",
        id: "posts-tiktok",
        label: "TikTok",
        percentLabel: "35%",
        platform: "tiktok",
        progress: 35,
        rightMetrics: [{ text: "35%", tone: "muted" }, { text: "289" }],
        valueLabel: "289",
      },
      {
        accentColor: "#EE4E51",
        id: "posts-youtube",
        label: "YouTube",
        percentLabel: "15%",
        platform: "youtube",
        progress: 15,
        rightMetrics: [{ text: "15%", tone: "muted" }, { text: "123" }],
        valueLabel: "123",
      },
      {
        accentColor: "#4E8EEE",
        id: "posts-facebook",
        label: "Facebook",
        percentLabel: "8%",
        platform: "facebook",
        progress: 8,
        rightMetrics: [{ text: "8%", tone: "muted" }, { text: "61" }],
        valueLabel: "61",
      },
    ],
    title: "Posts",
  },
  topPosts: {
    currentPage: 1,
    mode: "top",
    pageNumbers: [1, 2, 3, 4, 5],
    rows: TOP_POST_ROWS,
    summaryLabel: "1-10 of 50",
    title: "Top Posts",
  },
  totalPosts: {
    chart: {
      heightClassName: "h-[300px]",
      stackedBarChart: TOTAL_POSTS_STACKED_CHART,
      variant: "stacked",
    },
    delta: "~27/day",
    metrics: [
      {
        accentColor: "#13C368",
        dotColorClass: "bg-[#13C368]",
        enabled: true,
        label: "TikTok",
        metricKey: "tiktok",
        platform: "tiktok",
        selected: true,
        value: "345 · 43%",
      },
      {
        accentColor: "#AE4EEE",
        dotColorClass: "bg-[#AE4EEE]",
        enabled: true,
        label: "Instagram",
        metricKey: "instagram",
        platform: "instagram",
        selected: true,
        value: "289 · 35%",
      },
      {
        accentColor: "#EE4E51",
        dotColorClass: "bg-[#EE4E51]",
        enabled: true,
        label: "YouTube",
        metricKey: "youtube",
        platform: "youtube",
        selected: true,
        value: "123 · 13%",
      },
      {
        accentColor: "#4E8EEE",
        dotColorClass: "bg-[#4E8EEE]",
        enabled: true,
        label: "Facebook",
        metricKey: "facebook",
        platform: "facebook",
        selected: true,
        value: "61 · 8%",
      },
    ],
    title: "Total Posts",
    total: "818",
    trend: "+18.3%",
  },
  viewsCard: {
    headerIcon: "views",
    infoTooltipText:
      "Share of total views by platform for the selected date range.",
    items: [
      {
        accentColor: "#AE4EEE",
        id: "views-instagram",
        label: "Instagram",
        percentLabel: "61%",
        platform: "instagram",
        progress: 61,
        rightMetrics: [{ text: "61%", tone: "muted" }, { text: "3.14M" }],
        valueLabel: "3.14M",
      },
      {
        accentColor: "#13C368",
        id: "views-tiktok",
        label: "TikTok",
        percentLabel: "20%",
        platform: "tiktok",
        progress: 20,
        rightMetrics: [{ text: "20%", tone: "muted" }, { text: "1.02M" }],
        valueLabel: "1.02M",
      },
      {
        accentColor: "#EE4E51",
        id: "views-youtube",
        label: "YouTube",
        percentLabel: "12%",
        platform: "youtube",
        progress: 12,
        rightMetrics: [{ text: "12%", tone: "muted" }, { text: "612K" }],
        valueLabel: "612K",
      },
      {
        accentColor: "#4E8EEE",
        id: "views-facebook",
        label: "Facebook",
        percentLabel: "7%",
        platform: "facebook",
        progress: 7,
        rightMetrics: [{ text: "7%", tone: "muted" }, { text: "354K" }],
        valueLabel: "354K",
      },
    ],
    title: "Views",
  },
};

// ---------------------------------------------------------------------------
// Campaign Health tab mock data
// ---------------------------------------------------------------------------

interface EngagementLineDataPoint {
  index: number;
  label: string;
  views: number;
  applied: number;
  joined: number;
}

function buildEngagementDailyPoints(): EngagementLineDataPoint[] {
  const labels = buildDateLabels("2026-01-07", TOTAL_POINTS);

  return labels.map((label, index) => {
    const views = clamp(
      Math.round(
        420 +
          Math.sin((index - 1) / 2.1) * 180 +
          Math.cos(index / 3.8) * 120 +
          (index % 7 === 3 ? 200 : 0),
      ),
      140,
      850,
    );

    const applied = clamp(
      Math.round(
        28 +
          Math.sin(index / 2.4) * 14 +
          Math.cos((index + 2) / 4.1) * 8 +
          (index % 6 === 2 ? 15 : 0),
      ),
      8,
      62,
    );

    const joined = clamp(
      Math.round(
        14 +
          Math.sin((index + 1) / 2.6) * 8 +
          Math.cos(index / 3.2) * 5 +
          (index % 8 === 5 ? 9 : 0),
      ),
      4,
      34,
    );

    return { applied, index, joined, label, views };
  });
}

function buildEngagementCumulativePoints(
  dailyPoints: EngagementLineDataPoint[],
): EngagementLineDataPoint[] {
  const running = { applied: 0, joined: 0, views: 0 };

  const cumulative = dailyPoints.map((point) => {
    running.views += point.views;
    running.applied += point.applied;
    running.joined += point.joined;
    return { ...point, ...running };
  });

  const maxes = cumulative.reduce(
    (acc, p) => ({
      applied: Math.max(acc.applied, p.applied),
      joined: Math.max(acc.joined, p.joined),
      views: Math.max(acc.views, p.views),
    }),
    { applied: 1, joined: 1, views: 1 },
  );

  const targets = { applied: 847, joined: 423, views: 12840 };

  return cumulative.map((point) => ({
    ...point,
    applied: Math.round((point.applied / maxes.applied) * targets.applied),
    joined: Math.round((point.joined / maxes.joined) * targets.joined),
    views: Math.round((point.views / maxes.views) * targets.views),
  }));
}

const ENGAGEMENT_DAILY = buildEngagementDailyPoints();
const ENGAGEMENT_CUMULATIVE = buildEngagementCumulativePoints(ENGAGEMENT_DAILY);

const ENGAGEMENT_LINE_CHART: AnalyticsPocPerformanceLineChartData = {
  datasets: {
    cumulative: ENGAGEMENT_CUMULATIVE as unknown as AnalyticsPocPerformanceLineDataPoint[],
    daily: ENGAGEMENT_DAILY as unknown as AnalyticsPocPerformanceLineDataPoint[],
  },
  leftDomain: [0, 900],
  rightDomain: [0, 70],
  rightYLabels: [],
  series: [
    {
      axis: "left",
      color: "#60A5FA",
      key: "views" as "views",
      label: "Views",
      tooltipValueType: "number",
    },
    {
      axis: "right",
      color: "#A78BFA",
      key: "engagement" as "engagement",
      label: "Applied",
      tooltipValueType: "number",
    },
    {
      axis: "right",
      color: "#34D399",
      key: "likes" as "likes",
      label: "Joined",
      tooltipValueType: "number",
    },
  ],
  xTicks: CHART_TICKS,
  yLabels: ["900", "675", "450", "225", "0"],
};

interface ActivityLineDataPoint {
  index: number;
  label: string;
  submissions: number;
  creators: number;
  applications: number;
}

function buildActivityDailyPoints(): ActivityLineDataPoint[] {
  const labels = buildDateLabels("2026-01-07", TOTAL_POINTS);

  return labels.map((label, index) => {
    const submissions = clamp(
      Math.round(
        28 +
          Math.sin((index - 2) / 2.0) * 14 +
          Math.cos(index / 3.5) * 9 +
          (index % 6 === 1 ? 12 : 0),
      ),
      6,
      55,
    );

    const creators = clamp(
      Math.round(
        14 +
          Math.sin(index / 2.3) * 7 +
          Math.cos((index + 1) / 4.2) * 5 +
          (index % 7 === 4 ? 8 : 0),
      ),
      3,
      30,
    );

    const applications = clamp(
      Math.round(
        20 +
          Math.sin((index + 2) / 1.8) * 10 +
          Math.cos(index / 2.9) * 7 +
          (index % 5 === 0 ? 10 : 0),
      ),
      5,
      42,
    );

    return { applications, creators, index, label, submissions };
  });
}

function buildActivityCumulativePoints(
  dailyPoints: ActivityLineDataPoint[],
): ActivityLineDataPoint[] {
  const running = { applications: 0, creators: 0, submissions: 0 };

  const cumulative = dailyPoints.map((point) => {
    running.submissions += point.submissions;
    running.creators += point.creators;
    running.applications += point.applications;
    return { ...point, ...running };
  });

  const maxes = cumulative.reduce(
    (acc, p) => ({
      applications: Math.max(acc.applications, p.applications),
      creators: Math.max(acc.creators, p.creators),
      submissions: Math.max(acc.submissions, p.submissions),
    }),
    { applications: 1, creators: 1, submissions: 1 },
  );

  const targets = { applications: 847, creators: 423, submissions: 690 };

  return cumulative.map((point) => ({
    ...point,
    applications: Math.round(
      (point.applications / maxes.applications) * targets.applications,
    ),
    creators: Math.round(
      (point.creators / maxes.creators) * targets.creators,
    ),
    submissions: Math.round(
      (point.submissions / maxes.submissions) * targets.submissions,
    ),
  }));
}

const ACTIVITY_DAILY = buildActivityDailyPoints();
const ACTIVITY_CUMULATIVE = buildActivityCumulativePoints(ACTIVITY_DAILY);

const ACTIVITY_LINE_CHART: AnalyticsPocPerformanceLineChartData = {
  datasets: {
    cumulative: ACTIVITY_CUMULATIVE as unknown as AnalyticsPocPerformanceLineDataPoint[],
    daily: ACTIVITY_DAILY as unknown as AnalyticsPocPerformanceLineDataPoint[],
  },
  leftDomain: [0, 60],
  rightDomain: [0, 50],
  rightYLabels: [],
  series: [
    {
      axis: "left",
      color: "#818CF8",
      key: "views" as "views",
      label: "Submissions",
      tooltipValueType: "number",
    },
    {
      axis: "right",
      color: "#F472B6",
      key: "engagement" as "engagement",
      label: "Creators",
      tooltipValueType: "number",
    },
    {
      axis: "right",
      color: "#38BDF8",
      key: "likes" as "likes",
      label: "Applications",
      tooltipValueType: "number",
    },
  ],
  xTicks: CHART_TICKS,
  yLabels: ["60", "45", "30", "15", "0"],
};

export const analyticsPocPayoutsDetailMockData: AnalyticsPocPayoutRow[] = [
  { id: "p1", creator: "Sarah Chen", handle: "@sarah_creates", amount: "$420.00", date: "Feb 3", status: "paid" },
  { id: "p2", creator: "Mike Rodriguez", handle: "@mike.films", amount: "$380.50", date: "Feb 2", status: "paid" },
  { id: "p3", creator: "Luna Patel", handle: "@luna.creates", amount: "$312.00", date: "Feb 1", status: "pending" },
  { id: "p4", creator: "Jess Taylor", handle: "@jess_vlogs", amount: "$285.00", date: "Jan 31", status: "paid" },
  { id: "p5", creator: "Dan Kowalski", handle: "@dan.photo", amount: "$248.00", date: "Jan 30", status: "paid" },
  { id: "p6", creator: "Ava Williams", handle: "@ava.style", amount: "$232.00", date: "Jan 29", status: "pending" },
  { id: "p7", creator: "Noah Kim", handle: "@noahkim_", amount: "$198.50", date: "Jan 28", status: "paid" },
  { id: "p8", creator: "Olivia Nguyen", handle: "@olivia.n", amount: "$185.00", date: "Jan 27", status: "paid" },
  { id: "p9", creator: "Ethan Brooks", handle: "@ethan.b", amount: "$172.00", date: "Jan 26", status: "pending" },
  { id: "p10", creator: "Mia Johnson", handle: "@miaj_creates", amount: "$165.50", date: "Jan 25", status: "paid" },
];

export const analyticsPocViewsDetailMockData: AnalyticsPocViewsDetailRow[] = [
  { id: "v1", creator: "Sarah Chen", handle: "@sarah_creates", avatar: "/logos/brand8.jpg", platform: "tiktok", views: "1.2M", engagement: "4.8%" },
  { id: "v2", creator: "Mike Rodriguez", handle: "@mike.films", avatar: "/logos/brand8.jpg", platform: "youtube", views: "892K", engagement: "3.2%" },
  { id: "v3", creator: "Luna Patel", handle: "@luna.creates", avatar: "/logos/brand8.jpg", platform: "instagram", views: "745K", engagement: "5.1%" },
  { id: "v4", creator: "Jess Taylor", handle: "@jess_vlogs", avatar: "/logos/brand8.jpg", platform: "tiktok", views: "623K", engagement: "4.3%" },
  { id: "v5", creator: "Dan Kowalski", handle: "@dan.photo", avatar: "/logos/brand8.jpg", platform: "instagram", views: "512K", engagement: "3.9%" },
  { id: "v6", creator: "Ava Williams", handle: "@ava.style", avatar: "/logos/brand8.jpg", platform: "tiktok", views: "398K", engagement: "6.2%" },
  { id: "v7", creator: "Noah Kim", handle: "@noahkim_", avatar: "/logos/brand8.jpg", platform: "youtube", views: "321K", engagement: "2.8%" },
  { id: "v8", creator: "Olivia Nguyen", handle: "@olivia.n", avatar: "/logos/brand8.jpg", platform: "instagram", views: "284K", engagement: "4.5%" },
];

const CLUSTER_VIDEOS: Record<string, AnalyticsPocClusterDrilldownData> = {
  "cluster-reaction": {
    clusterId: "cluster-reaction",
    clusterLabel: "Reaction Videos",
    accentColor: "#E9A23B",
    videoCount: "85",
    totalViews: "500K",
    videos: [
      { id: "cr1", title: "Reacting to viral cooking fails", creator: "Sarah Chen", avatar: "/logos/brand8.jpg", platform: "tiktok", views: "124K", engagement: "5.8%" },
      { id: "cr2", title: "First time watching K-drama finale", creator: "Mike Rodriguez", avatar: "/logos/brand8.jpg", platform: "youtube", views: "98K", engagement: "4.2%" },
      { id: "cr3", title: "Reacting to my old videos", creator: "Ava Williams", avatar: "/logos/brand8.jpg", platform: "tiktok", views: "87K", engagement: "6.1%" },
      { id: "cr4", title: "Fan edits that made me cry", creator: "Luna Patel", avatar: "/logos/brand8.jpg", platform: "instagram", views: "72K", engagement: "5.4%" },
      { id: "cr5", title: "Trying weird food combos", creator: "Jess Taylor", avatar: "/logos/brand8.jpg", platform: "tiktok", views: "61K", engagement: "4.9%" },
    ],
  },
  "cluster-meme": {
    clusterId: "cluster-meme",
    clusterLabel: "Meme Edits",
    accentColor: "#4D81EE",
    videoCount: "45",
    totalViews: "200K",
    videos: [
      { id: "cm1", title: "POV: your code works first try", creator: "Noah Kim", avatar: "/logos/brand8.jpg", platform: "tiktok", views: "68K", engagement: "7.2%" },
      { id: "cm2", title: "When the WiFi drops mid-stream", creator: "Dan Kowalski", avatar: "/logos/brand8.jpg", platform: "instagram", views: "42K", engagement: "5.8%" },
      { id: "cm3", title: "Monday morning energy", creator: "Olivia Nguyen", avatar: "/logos/brand8.jpg", platform: "tiktok", views: "38K", engagement: "6.4%" },
      { id: "cm4", title: "That one friend who never texts back", creator: "Sarah Chen", avatar: "/logos/brand8.jpg", platform: "tiktok", views: "31K", engagement: "5.1%" },
      { id: "cm5", title: "Expectations vs reality: adulting", creator: "Ava Williams", avatar: "/logos/brand8.jpg", platform: "instagram", views: "21K", engagement: "4.7%" },
    ],
  },
  "cluster-pov": {
    clusterId: "cluster-pov",
    clusterLabel: "POV / Skit",
    accentColor: "#22C55E",
    videoCount: "38",
    totalViews: "180K",
    videos: [
      { id: "cp1", title: "POV: you're the main character", creator: "Luna Patel", avatar: "/logos/brand8.jpg", platform: "instagram", views: "52K", engagement: "6.8%" },
      { id: "cp2", title: "When your mom calls during a date", creator: "Jess Taylor", avatar: "/logos/brand8.jpg", platform: "tiktok", views: "44K", engagement: "5.9%" },
      { id: "cp3", title: "Airport drama in 60 seconds", creator: "Mike Rodriguez", avatar: "/logos/brand8.jpg", platform: "youtube", views: "36K", engagement: "4.5%" },
      { id: "cp4", title: "POV: first day at a new job", creator: "Noah Kim", avatar: "/logos/brand8.jpg", platform: "tiktok", views: "28K", engagement: "5.3%" },
      { id: "cp5", title: "The toxic friend group skit", creator: "Olivia Nguyen", avatar: "/logos/brand8.jpg", platform: "tiktok", views: "20K", engagement: "6.1%" },
    ],
  },
  "cluster-transform": {
    clusterId: "cluster-transform",
    clusterLabel: "Transformation",
    accentColor: "#EAB308",
    videoCount: "20",
    totalViews: "150K",
    videos: [
      { id: "ct1", title: "30-day glow up challenge results", creator: "Ava Williams", avatar: "/logos/brand8.jpg", platform: "tiktok", views: "48K", engagement: "5.6%" },
      { id: "ct2", title: "Room makeover on a $50 budget", creator: "Dan Kowalski", avatar: "/logos/brand8.jpg", platform: "youtube", views: "38K", engagement: "4.1%" },
      { id: "ct3", title: "Before & after: closet declutter", creator: "Sarah Chen", avatar: "/logos/brand8.jpg", platform: "instagram", views: "29K", engagement: "5.2%" },
      { id: "ct4", title: "From messy to minimal desk setup", creator: "Luna Patel", avatar: "/logos/brand8.jpg", platform: "tiktok", views: "22K", engagement: "4.8%" },
      { id: "ct5", title: "Hair transformation compilation", creator: "Jess Taylor", avatar: "/logos/brand8.jpg", platform: "tiktok", views: "13K", engagement: "6.3%" },
    ],
  },
  "cluster-tutorial": {
    clusterId: "cluster-tutorial",
    clusterLabel: "Tutorial Format",
    accentColor: "#A855F7",
    videoCount: "30",
    totalViews: "92K",
    videos: [
      { id: "ctu1", title: "How to edit like a pro in 5 min", creator: "Noah Kim", avatar: "/logos/brand8.jpg", platform: "youtube", views: "28K", engagement: "3.9%" },
      { id: "ctu2", title: "Beginner makeup tutorial", creator: "Olivia Nguyen", avatar: "/logos/brand8.jpg", platform: "instagram", views: "22K", engagement: "5.1%" },
      { id: "ctu3", title: "Easy recipe: 3-ingredient meals", creator: "Mike Rodriguez", avatar: "/logos/brand8.jpg", platform: "tiktok", views: "18K", engagement: "4.6%" },
      { id: "ctu4", title: "Photography tips for beginners", creator: "Dan Kowalski", avatar: "/logos/brand8.jpg", platform: "instagram", views: "14K", engagement: "3.8%" },
      { id: "ctu5", title: "How I grew to 100K followers", creator: "Sarah Chen", avatar: "/logos/brand8.jpg", platform: "tiktok", views: "10K", engagement: "5.4%" },
    ],
  },
  "cluster-unboxing": {
    clusterId: "cluster-unboxing",
    clusterLabel: "Unboxing / Review",
    accentColor: "#EF4444",
    videoCount: "22",
    totalViews: "24K",
    videos: [
      { id: "cu1", title: "Unboxing the new tech everyone wants", creator: "Jess Taylor", avatar: "/logos/brand8.jpg", platform: "youtube", views: "8.2K", engagement: "4.3%" },
      { id: "cu2", title: "Honest review: viral skincare", creator: "Ava Williams", avatar: "/logos/brand8.jpg", platform: "tiktok", views: "5.8K", engagement: "5.7%" },
      { id: "cu3", title: "$500 mystery box unboxing", creator: "Luna Patel", avatar: "/logos/brand8.jpg", platform: "tiktok", views: "4.1K", engagement: "6.2%" },
      { id: "cu4", title: "Testing Amazon gadgets under $20", creator: "Noah Kim", avatar: "/logos/brand8.jpg", platform: "youtube", views: "3.4K", engagement: "3.9%" },
      { id: "cu5", title: "Is this worth the hype? PR haul", creator: "Olivia Nguyen", avatar: "/logos/brand8.jpg", platform: "instagram", views: "2.5K", engagement: "4.8%" },
    ],
  },
};

export function getAnalyticsPocClusterDrilldown(
  clusterId: string,
): AnalyticsPocClusterDrilldownData | null {
  return CLUSTER_VIDEOS[clusterId] ?? null;
}

export const analyticsPocCpmTooltipMockData: AnalyticsPocCpmTooltipData = {
  effectiveCpm: "$0.84",
  originalCpm: "$1.00",
  efficient: true,
  platforms: [
    { platform: "tiktok", label: "TikTok", cpm: "$0.62", efficient: true },
    { platform: "instagram", label: "Instagram", cpm: "$0.91", efficient: true },
    { platform: "youtube", label: "YouTube", cpm: "$1.18", efficient: false },
    { platform: "facebook", label: "Facebook", cpm: "$0.78", efficient: true },
  ],
};

export const analyticsPocCampaignHealthMockData: AnalyticsPocCampaignHealthTabProps = {
  activityChart: {
    activeLineDataset: "daily",
    chartStylePreset: "performance-main",
    heightClassName: "h-[280px]",
    lineChart: ACTIVITY_LINE_CHART,
    variant: "line",
  },
  activityChartMetrics: [
    {
      accentColor: "#818CF8",
      dotColorClass: "bg-indigo-400",
      enabled: true,
      label: "Submissions",
      metricKey: "views",
      selected: true,
      value: "690",
    },
    {
      accentColor: "#F472B6",
      dotColorClass: "bg-pink-400",
      enabled: true,
      label: "Creators",
      metricKey: "engagement",
      value: "423",
    },
    {
      accentColor: "#38BDF8",
      dotColorClass: "bg-sky-400",
      enabled: true,
      label: "Applications",
      metricKey: "likes",
      value: "847",
    },
  ],
  activityKpis: [
    {
      dotColor: "#818CF8",
      label: "Submissions",
      subtitle: "690 approved (80.3%)",
      value: "847",
    },
    {
      dotColor: "#F472B6",
      label: "Active Creators",
      subtitle: "Posted in last 7 days",
      value: "423",
    },
    {
      dotColor: "#38BDF8",
      label: "Avg. Response Time",
      subtitle: "Application to approval",
      value: "1.2d",
    },
    {
      dotColor: "#34D399",
      label: "Approval Rate",
      subtitle: "Of total applications",
      value: "80.3%",
    },
  ],
  engagement: {
    chart: {
      activeLineDataset: "daily",
      chartStylePreset: "performance-main",
      heightClassName: "h-[240px]",
      lineChart: ENGAGEMENT_LINE_CHART,
      variant: "line",
    },
    className: undefined,
    funnelSteps: [
      {
        color: "#60A5FA",
        label: "Page Views",
        subtitle: "Unique visitors",
        value: "12,840",
      },
      {
        color: "#A78BFA",
        label: "Applications",
        subtitle: "6.6% of views",
        value: "847",
      },
      {
        color: "#34D399",
        label: "Joined",
        subtitle: "49.9% of applied",
        value: "423",
      },
    ],
    funnelSummary: {
      applied: "847",
      ctr: "3.3%",
      joined: "423",
      views: "12,840",
    },
    subtitle: "Funnel performance and traffic acquisition",
    title: "Campaign Engagement",
    trafficSources: [
      {
        applied: "312",
        convRate: "4.8%",
        id: "ts-direct",
        label: "Direct Link",
        progress: 100,
        rank: 1,
        views: "6,480",
      },
      {
        applied: "218",
        convRate: "6.2%",
        id: "ts-twitter",
        label: "Twitter / X",
        progress: 54,
        rank: 2,
        views: "3,520",
      },
      {
        applied: "142",
        convRate: "8.1%",
        id: "ts-discord",
        label: "Discord",
        progress: 27,
        rank: 3,
        views: "1,750",
      },
      {
        applied: "98",
        convRate: "11.3%",
        id: "ts-email",
        label: "Email Campaign",
        progress: 13,
        rank: 4,
        views: "870",
      },
      {
        applied: "77",
        convRate: "3.5%",
        id: "ts-organic",
        label: "Organic Search",
        progress: 3,
        rank: 5,
        views: "220",
      },
    ],
  },
  financials: {
    budgetUsedLabel: "67% of budget used",
    costMetrics: [
      { label: "Cost / Like", value: "$0.009" },
      { label: "Cost / Comment", value: "$0.067" },
      { label: "Cost / Share", value: "$0.020" },
      { label: "Cost / Engagement", value: "$0.008" },
    ],
    legend: [
      { color: "#10B981", label: "Paid Out", value: "$3,386.30" },
      { color: "#EAB308", label: "Pending", value: "$832.20" },
      { color: "#EF4444", label: "Clawed Back", value: "$124.00" },
      { color: "#9CA3AF", label: "Net Spend", value: "$4,094.50" },
    ],
    progressPercent: 67,
    remaining: "$2,081.50",
    spent: "$4,218.50",
    title: "Financials",
    total: "$6,300.00",
  },
  healthScore: {
    items: [
      { label: "Creator Activity", maxScore: 25, score: 22, weight: "25%" },
      { label: "Content Quality", maxScore: 20, score: 16, weight: "20%" },
      { label: "Engagement Rate", maxScore: 20, score: 15, weight: "20%" },
      { label: "Budget Efficiency", maxScore: 20, score: 14, weight: "20%" },
      { label: "Growth Trend", maxScore: 15, score: 9, weight: "15%" },
    ],
    maxScore: 100,
    score: 76,
    title: "Health",
  },
};

// ---------- Day drilldown mock data ----------

const DAY_DRILLDOWN_CREATORS = [
  { name: "ContentCrazy", platform: "youtube" as const },
  { name: "StacksOnStacks", platform: "tiktok" as const },
  { name: "BetBoss", platform: "facebook" as const },
  { name: "NeonEdits", platform: "instagram" as const },
  { name: "MemeQueen", platform: "tiktok" as const },
];

function buildDayDrilldownData(
  dateLabel: string,
): AnalyticsPocDayDrilldownData {
  const rng = (min: number, max: number) =>
    Math.floor(min + Math.random() * (max - min));

  const submissions = DAY_DRILLDOWN_CREATORS.map((c, i) => ({
    id: `sub-${i}`,
    creator: c.name,
    platform: c.platform,
    views: rng(20_000, 200_000),
    engagement: +(2 + Math.random() * 6).toFixed(1),
    payout: +(20 + Math.random() * 140).toFixed(2),
    status: "approved" as const,
  }));

  return { date: dateLabel, submissions };
}

const CHART_DATE_MAP: Record<number, string> = {};
const BASE_DATE = new Date(2026, 0, 5);
for (let i = 0; i < TOTAL_POINTS; i++) {
  const d = new Date(BASE_DATE);
  d.setDate(d.getDate() + i);
  CHART_DATE_MAP[i] = d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getAnalyticsPocDayDrilldown(
  index: number,
  label: string,
): AnalyticsPocDayDrilldownData {
  const fullDate = CHART_DATE_MAP[index] ?? label;
  return buildDayDrilldownData(fullDate);
}
